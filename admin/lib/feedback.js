/**
 * feedback.js
 * Admin routes for Site Feedback — requests, survey account responses, and document contributions.
 *
 * Endpoints:
 *   GET  /api/feedback/counts                  — badge rollup for all three types
 *   GET  /api/feedback/requests                — list items from requests/ prefix
 *   GET  /api/feedback/accounts                — list survey responses with resolved question text
 *   GET  /api/feedback/documents               — list document contributions
 *   POST /api/feedback/pull/account            — pull account JSON to _intake/accounts/
 *   POST /api/feedback/pull/document/:id       — pull document folder to _intake/documents/
 *   POST /api/feedback/create-draft/account    — generate draft document file from survey response
 *   POST /api/feedback/discard/request         — delete a request from R2
 *   POST /api/feedback/discard/account         — delete an account submission from R2
 *   POST /api/feedback/discard/document/:id    — delete a document folder from R2
 */

import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
  DeleteObjectCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import fs   from 'fs';
import path from 'path';
import { Readable } from 'stream';
import { pipeline } from 'stream/promises';

const ACCOUNT_ID = 'a147c21894e80723027ad746a073a7e9';
const BUCKET     = 'angryskipperarchive-submissions';

const REQUEST_TYPE_LABELS = {
  correction: 'Correction',
  contact:    'Contact Info Request',
  add:        'Add a Soldier',
  broken:     'Something is Broken',
  privacy:    'Privacy / Takedown',
  general:    'General Message',
};

function getClient() {
  const accessKeyId     = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  if (!accessKeyId || !secretAccessKey) {
    throw new Error('R2 credentials not set. Add R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY to admin/.env');
  }
  return new S3Client({
    region:   'auto',
    endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });
}

async function streamToString(stream) {
  const chunks = [];
  for await (const chunk of stream) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks).toString('utf-8');
}

// ---------------------------------------------------------------------------
// Survey config loader — resolves question IDs to text for account rendering
// ---------------------------------------------------------------------------
async function loadSurveyConfig(repoRoot, eventSlug) {
  const configPath = path.join(repoRoot, 'site', '_data', 'surveys', `${eventSlug}.json`);
  try {
    const raw = await fs.promises.readFile(configPath, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function buildQuestionLookup(config) {
  // Returns { questionId: { text, sectionTitle, sectionId } }
  const map = {};
  if (!config) return map;

  const allSections = [...(config.sections || []), { id: 'closing', title: 'Final Questions', questions: config.closing_questions || [] }];

  for (const section of allSections) {
    for (const q of (section.questions || [])) {
      map[q.id] = { text: q.text, sectionTitle: section.title, sectionId: section.id };
      // Follow-up sub-questions
      if (q.follow_up) {
        map[q.follow_up.id] = { text: q.follow_up.text, sectionTitle: section.title, sectionId: section.id, isFollowUp: true };
      }
      if (q.conditional_detail) {
        map[q.conditional_detail.id] = { text: q.conditional_detail.text, sectionTitle: section.title, sectionId: section.id, isFollowUp: true };
      }
    }
  }
  return map;
}

function resolveAccountAnswers(payload, config) {
  const lookup = buildQuestionLookup(config);
  const answers = payload.answers || {};

  // Group by section, preserving section order from config
  const allSections = [...(config ? config.sections || [] : []),
    { id: 'closing', title: 'Final Questions', questions: config ? (config.closing_questions || []) : [] }
  ];

  const platoon = payload.platoon;
  const relevantSections = allSections.filter(s =>
    !s.platoons || s.platoons.includes(platoon)
  );

  const resolved = relevantSections.map(section => {
    const sectionAnswers = [];
    for (const q of (section.questions || [])) {
      if (answers[q.id] !== undefined && answers[q.id] !== '') {
        sectionAnswers.push({ qid: q.id, text: q.text, answer: answers[q.id], isFollowUp: false });
      }
      if (q.follow_up && answers[q.follow_up.id] !== undefined && answers[q.follow_up.id] !== '') {
        sectionAnswers.push({ qid: q.follow_up.id, text: q.follow_up.text, answer: answers[q.follow_up.id], isFollowUp: true });
      }
      if (q.conditional_detail && answers[q.conditional_detail.id] !== undefined) {
        sectionAnswers.push({ qid: q.conditional_detail.id, text: q.conditional_detail.text, answer: answers[q.conditional_detail.id], isFollowUp: true });
      }
    }
    return { sectionId: section.id, sectionTitle: section.title, answers: sectionAnswers };
  }).filter(s => s.answers.length > 0);

  // Skipped sections
  const skipped = payload.skipped || {};

  return { resolved, skipped };
}

// ---------------------------------------------------------------------------
// List helpers
// ---------------------------------------------------------------------------
async function listRequests() {
  const client = getClient();
  const items  = [];
  let continuationToken;

  do {
    const cmd = new ListObjectsV2Command({
      Bucket: BUCKET, Prefix: 'requests/', ContinuationToken: continuationToken,
    });
    const res = await client.send(cmd);
    for (const obj of res.Contents || []) {
      try {
        const get = await client.send(new GetObjectCommand({ Bucket: BUCKET, Key: obj.Key }));
        const raw = await streamToString(get.Body);
        const data = JSON.parse(raw);
        items.push({ key: obj.Key, size: obj.Size, ...data,
          type_label: REQUEST_TYPE_LABELS[data.type] || data.type || 'Unknown' });
      } catch { /* skip malformed */ }
    }
    continuationToken = res.NextContinuationToken;
  } while (continuationToken);

  return items.sort((a, b) => (b.submitted || '').localeCompare(a.submitted || ''));
}

async function listAccounts(repoRoot) {
  const client  = getClient();
  const items   = [];
  const configs = {};  // cache: eventSlug → config
  let continuationToken;

  do {
    const cmd = new ListObjectsV2Command({
      Bucket: BUCKET, Prefix: 'submissions/accounts/', ContinuationToken: continuationToken,
    });
    const res = await client.send(cmd);
    for (const obj of res.Contents || []) {
      if (!obj.Key.endsWith('.json')) continue;
      try {
        const get = await client.send(new GetObjectCommand({ Bucket: BUCKET, Key: obj.Key }));
        const raw = await streamToString(get.Body);
        const data = JSON.parse(raw);

        // Load and cache survey config for this event
        const slug = data.event_slug;
        if (slug && !configs[slug]) {
          configs[slug] = await loadSurveyConfig(repoRoot, slug);
        }
        const config = slug ? configs[slug] : null;
        const { resolved, skipped } = resolveAccountAnswers(data, config);

        items.push({ key: obj.Key, size: obj.Size, ...data, resolved_answers: resolved, skipped_sections: skipped });
      } catch { /* skip malformed */ }
    }
    continuationToken = res.NextContinuationToken;
  } while (continuationToken);

  return items.sort((a, b) => (b.submitted || '').localeCompare(a.submitted || ''));
}

async function listDocuments() {
  const client  = getClient();
  const folders = {};
  let continuationToken;

  do {
    const cmd = new ListObjectsV2Command({
      Bucket: BUCKET, Prefix: 'submissions/documents/', ContinuationToken: continuationToken,
    });
    const res = await client.send(cmd);
    for (const obj of res.Contents || []) {
      const parts    = obj.Key.split('/');  // submissions/documents/folderId/filename
      if (parts.length < 4) continue;
      const folderId = parts[2];
      const filename = parts.slice(3).join('/');
      if (!folders[folderId]) folders[folderId] = { id: folderId, files: [], metadata: null };
      if (filename === 'metadata.json') {
        try {
          const get = await client.send(new GetObjectCommand({ Bucket: BUCKET, Key: obj.Key }));
          const raw = await streamToString(get.Body);
          folders[folderId].metadata = JSON.parse(raw);
        } catch { /* skip */ }
      } else {
        folders[folderId].files.push({ key: obj.Key, filename, size: obj.Size });
      }
    }
    continuationToken = res.NextContinuationToken;
  } while (continuationToken);

  return Object.values(folders).sort((a, b) => {
    const aD = a.metadata?.submitted || '';
    const bD = b.metadata?.submitted || '';
    return bD.localeCompare(aD);
  });
}

// ---------------------------------------------------------------------------
// Pull helpers
// ---------------------------------------------------------------------------
async function pullAccount(key, repoRoot) {
  const client   = getClient();
  const filename = path.basename(key);
  const localDir = path.join(repoRoot, '_intake', 'accounts');
  fs.mkdirSync(localDir, { recursive: true });
  const localPath = path.join(localDir, filename);
  const get = await client.send(new GetObjectCommand({ Bucket: BUCKET, Key: key }));
  const out = fs.createWriteStream(localPath);
  await pipeline(Readable.from(get.Body), out);
  return localPath;
}

async function pullDocument(folderId, repoRoot) {
  const client   = getClient();
  const localDir = path.join(repoRoot, '_intake', 'documents', folderId);
  fs.mkdirSync(localDir, { recursive: true });

  // List all objects in this folder
  const cmd = new ListObjectsV2Command({
    Bucket: BUCKET, Prefix: `submissions/documents/${folderId}/`,
  });
  const res = await client.send(cmd);
  for (const obj of res.Contents || []) {
    const filename  = obj.Key.split('/').slice(3).join('/');
    const localPath = path.join(localDir, filename);
    fs.mkdirSync(path.dirname(localPath), { recursive: true });
    const get = await client.send(new GetObjectCommand({ Bucket: BUCKET, Key: obj.Key }));
    const out = fs.createWriteStream(localPath);
    await pipeline(Readable.from(get.Body), out);
  }
  return localDir;
}

// ---------------------------------------------------------------------------
// Discard helpers
// ---------------------------------------------------------------------------
async function discardRequest(key) {
  const client = getClient();
  await client.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
}

async function discardAccount(key) {
  const client = getClient();
  await client.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
}

async function discardDocument(folderId) {
  const client = getClient();
  const cmd    = new ListObjectsV2Command({
    Bucket: BUCKET, Prefix: `submissions/documents/${folderId}/`,
  });
  const res = await client.send(cmd);
  for (const obj of res.Contents || []) {
    await client.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: obj.Key }));
  }
}

// ---------------------------------------------------------------------------
// Draft generation
// ---------------------------------------------------------------------------

/**
 * Converts a survey account payload (with resolved_answers already attached)
 * into a draft document file at site/documents/[soldier-slug]/[account-slug]/
 *
 * Returns { ok, filePath, soldierSlug, accountSlug } on success.
 * Returns { ok: false, error, filePath } if the file already exists.
 */
async function createAccountDraft(accountData, repoRoot) {
  const {
    first_name       = '',
    last_name        = '',
    platoon          = '',
    event_slug       = '',
    event_title      = '',
    submitted        = '',
    resolved_answers = [],
    skipped_sections = {},
    answers          = {},
    shared_before    = '',
  } = accountData;
  // contact is intentionally excluded — never written to disk

  // ── Derive slugs ─────────────────────────────────────────────────────────
  const slugify = s => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const lastSlug   = slugify(last_name);
  const firstSlug  = slugify(first_name);
  const soldierSlug = [lastSlug, firstSlug].filter(Boolean).join('-') || 'unknown';

  // Date string: MMDDYY from event_slug (e.g. contact-fsb-fontaine-1971-04-20 → 042071)
  const dateMatch  = event_slug.match(/(\d{4})-(\d{2})-(\d{2})$/);
  const isoDate    = dateMatch ? `${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}` : '';
  const dateStr    = dateMatch ? `${dateMatch[2]}${dateMatch[3]}${dateMatch[1].slice(2)}` : '000000';
  const accountSlug = `${soldierSlug}-account-${dateStr}`;

  // ── Permission label (for header note only — never published as-is) ──────
  const permission  = answers['closing-permission'] || '';
  const permLabel   = permission === 'publish'    ? 'OK to publish'
                    : permission === 'restricted' ? 'Restricted — do not publish without follow-up'
                    : permission === 'discuss'    ? 'Respondent requests follow-up before publishing'
                    : '(no permission recorded)';

  // ── Submitted date string ────────────────────────────────────────────────
  const submittedDate = submitted
    ? new Date(submitted).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'unknown date';

  const platoonLabel = platoon
    ? platoon.charAt(0).toUpperCase() + platoon.slice(1) + ' Platoon'
    : '';

  const displayTitle = [first_name, last_name].filter(Boolean).join(' ') || soldierSlug;
  const eventLabel   = event_title || event_slug;

  // ── Front matter ─────────────────────────────────────────────────────────
  const frontMatter = [
    '---',
    'layout: layouts/document.njk',
    `slug: ${accountSlug}`,
    `title: "[Draft] ${displayTitle} — ${eventLabel}"`,
    'type: account',
    `author: ${soldierSlug}`,
    `date: "${isoDate}"`,
    'date_known: true',
    `source: "Survey response · ${platoonLabel} · submitted ${submittedDate}"`,
    'status: draft',
    `event: ${event_slug}`,
    'contains:',
    `  - ${soldierSlug}`,
    'tagged: []',
    'files: []',
    `permalink: /documents/${soldierSlug}/${accountSlug}/`,
    '---',
  ].join('\n');

  // ── Body ─────────────────────────────────────────────────────────────────
  const lines = [];

  lines.push(`*${platoonLabel} survey response, submitted ${submittedDate}.*  `);
  lines.push(`*Permission: ${permLabel}.*  `);
  lines.push(`*Editorial review required — this is a structured Q&A draft, not a finished narrative.*`);
  lines.push('');
  lines.push('---');
  lines.push('');

  for (const section of resolved_answers) {
    if (!section.answers.length) continue;
    lines.push(`## ${section.sectionTitle}`);
    lines.push('');
    for (const qa of section.answers) {
      const answerText = Array.isArray(qa.answer) ? qa.answer.join(', ') : String(qa.answer);
      if (qa.isFollowUp) {
        lines.push(`> **${qa.text}**`);
        lines.push(`>`);
        lines.push(`> ${answerText}`);
      } else {
        lines.push(`**${qa.text}**`);
        lines.push('');
        lines.push(answerText);
      }
      lines.push('');
    }
  }

  const skippedKeys = Object.keys(skipped_sections);
  if (skippedKeys.length) {
    lines.push('---');
    lines.push('');
    lines.push('*Sections skipped by respondent:*');
    lines.push('');
    for (const k of skippedKeys) {
      const reason = skipped_sections[k];
      lines.push(`- ${k}${reason ? ` — "${reason}"` : ''}`);
    }
    lines.push('');
  }

  const content = frontMatter + '\n\n' + lines.join('\n');

  // ── Write file ───────────────────────────────────────────────────────────
  const docDir  = path.join(repoRoot, 'site', 'documents', soldierSlug, accountSlug);
  const outFile = path.join(docDir, `${accountSlug}.md`);

  // Don't overwrite an existing draft
  try {
    await fs.promises.access(outFile);
    const rel = outFile.replace(repoRoot + path.sep, '');
    return { ok: false, error: `Draft already exists: ${rel}`, filePath: rel };
  } catch {
    // File doesn't exist — proceed
  }

  await fs.promises.mkdir(docDir, { recursive: true });
  await fs.promises.writeFile(outFile, content, 'utf-8');

  const relPath = outFile.replace(repoRoot + path.sep, '');
  return { ok: true, filePath: relPath, soldierSlug, accountSlug };
}

// ---------------------------------------------------------------------------
// Route registration
// ---------------------------------------------------------------------------
export function registerFeedbackRoutes(app, repoRoot) {

  // Badge rollup
  app.get('/api/feedback/counts', async (req, res) => {
    try {
      const [requests, accounts, documents, stories] = await Promise.all([
        listRequests(), listAccounts(repoRoot), listDocuments(), listPendingStories(),
      ]);
      res.json({
        requests:  requests.length,
        accounts:  accounts.length,
        documents: documents.length,
        stories:   stories.length,
        total:     requests.length + accounts.length + documents.length + stories.length,
      });
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  app.get('/api/feedback/requests', async (req, res) => {
    try { res.json({ items: await listRequests() }); }
    catch (err) { res.status(500).json({ error: err.message }); }
  });

  app.get('/api/feedback/accounts', async (req, res) => {
    try { res.json({ items: await listAccounts(repoRoot) }); }
    catch (err) { res.status(500).json({ error: err.message }); }
  });

  app.get('/api/feedback/documents', async (req, res) => {
    try { res.json({ items: await listDocuments() }); }
    catch (err) { res.status(500).json({ error: err.message }); }
  });

  // Pull account to _intake/accounts/
  app.post('/api/feedback/pull/account', async (req, res) => {
    try {
      const { key } = req.body;
      if (!key) return res.status(400).json({ error: 'key is required' });
      const localPath = await pullAccount(key, repoRoot);
      res.json({ ok: true, path: localPath });
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  // Pull document folder to _intake/documents/
  app.post('/api/feedback/pull/document/:id', async (req, res) => {
    try {
      const localPath = await pullDocument(req.params.id, repoRoot);
      res.json({ ok: true, path: localPath });
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  // Discard request
  app.post('/api/feedback/discard/request', async (req, res) => {
    try {
      const { key } = req.body;
      if (!key) return res.status(400).json({ error: 'key is required' });
      await discardRequest(key);
      res.json({ ok: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  // Discard account
  app.post('/api/feedback/discard/account', async (req, res) => {
    try {
      const { key } = req.body;
      if (!key) return res.status(400).json({ error: 'key is required' });
      await discardAccount(key);
      res.json({ ok: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  // Discard document folder
  app.post('/api/feedback/discard/document/:id', async (req, res) => {
    try {
      await discardDocument(req.params.id);
      res.json({ ok: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  // Generate draft document from survey response
  app.post('/api/feedback/create-draft/account', async (req, res) => {
    try {
      const accountData = req.body;
      if (!accountData.last_name && !accountData.first_name) {
        return res.status(400).json({ error: 'Respondent name is required to generate a draft.' });
      }
      const result = await createAccountDraft(accountData, repoRoot);
      if (!result.ok) {
        return res.status(409).json({ error: result.error, filePath: result.filePath });
      }
      res.json(result);
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  // ── Skipper Stories ───────────────────────────────────────────────────────

  app.get('/api/feedback/stories', async (req, res) => {
    try { res.json({ items: await listPendingStories() }); }
    catch (err) { res.status(500).json({ error: err.message }); }
  });

  // List published stories (all statuses: published, withdrawn) for admin review
  app.get('/api/feedback/stories/published', async (req, res) => {
    try { res.json({ items: await listPublishedStories() }); }
    catch (err) { res.status(500).json({ error: err.message }); }
  });

  // Approve: move from pending/ → published/
  app.post('/api/feedback/stories/approve', async (req, res) => {
    try {
      const { story_id, key } = req.body;
      if (!key) return res.status(400).json({ error: 'key is required' });
      await approveStory(key, story_id);
      res.json({ ok: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  // Hold: update status field in pending JSON to 'held' (or back to 'pending')
  app.post('/api/feedback/stories/hold', async (req, res) => {
    try {
      const { key, hold } = req.body;
      if (!key) return res.status(400).json({ error: 'key is required' });
      await holdStory(key, hold !== false);
      res.json({ ok: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  // Withdraw: set status to 'withdrawn' in published/ (soft delete — stays in R2)
  app.post('/api/feedback/stories/withdraw', async (req, res) => {
    try {
      const { key } = req.body;
      if (!key) return res.status(400).json({ error: 'key is required' });
      await setStoryStatus(key, 'withdrawn');
      res.json({ ok: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  // Restore: set status back to 'published'
  app.post('/api/feedback/stories/restore', async (req, res) => {
    try {
      const { key } = req.body;
      if (!key) return res.status(400).json({ error: 'key is required' });
      await setStoryStatus(key, 'published');
      res.json({ ok: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
  });

  // Discard: delete from pending/
  app.post('/api/feedback/stories/discard', async (req, res) => {
    try {
      const { key } = req.body;
      if (!key) return res.status(400).json({ error: 'key is required' });
      const client = getClient();
      await client.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
      res.json({ ok: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
  });
}

// ---------------------------------------------------------------------------
// Skipper Stories helpers
// ---------------------------------------------------------------------------

async function listPendingStories() {
  const client = getClient();
  const items  = [];
  let continuationToken;

  do {
    const cmd = new ListObjectsV2Command({
      Bucket: BUCKET, Prefix: 'submissions/skipper-stories/pending/', ContinuationToken: continuationToken,
    });
    const res = await client.send(cmd);
    for (const obj of res.Contents || []) {
      if (!obj.Key.endsWith('.json')) continue;
      try {
        const get  = await client.send(new GetObjectCommand({ Bucket: BUCKET, Key: obj.Key }));
        const raw  = await streamToString(get.Body);
        const data = JSON.parse(raw);
        items.push({ key: obj.Key, ...data });
      } catch { /* skip malformed */ }
    }
    continuationToken = res.NextContinuationToken;
  } while (continuationToken);

  return items.sort((a, b) => (b.submitted || '').localeCompare(a.submitted || ''));
}

async function listPublishedStories() {
  const client = getClient();
  const items  = [];
  let continuationToken;

  do {
    const cmd = new ListObjectsV2Command({
      Bucket: BUCKET, Prefix: 'submissions/skipper-stories/published/', ContinuationToken: continuationToken,
    });
    const res = await client.send(cmd);
    for (const obj of res.Contents || []) {
      if (!obj.Key.endsWith('.json')) continue;
      try {
        const get  = await client.send(new GetObjectCommand({ Bucket: BUCKET, Key: obj.Key }));
        const raw  = await streamToString(get.Body);
        const data = JSON.parse(raw);
        items.push({ key: obj.Key, ...data });
      } catch { /* skip malformed */ }
    }
    continuationToken = res.NextContinuationToken;
  } while (continuationToken);

  return items.sort((a, b) => (b.submitted || '').localeCompare(a.submitted || ''));
}

async function approveStory(pendingKey, storyId) {
  const client = getClient();

  // Fetch the pending story
  const get  = await client.send(new GetObjectCommand({ Bucket: BUCKET, Key: pendingKey }));
  const raw  = await streamToString(get.Body);
  const data = JSON.parse(raw);

  // Write to published/
  const sid        = storyId || data.story_id || pendingKey.split('/').pop().replace('.json', '');
  const publishKey = `submissions/skipper-stories/published/${sid}.json`;
  const published  = { ...data, status: 'published', published_at: new Date().toISOString() };

  await client.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key:    publishKey,
    Body:   JSON.stringify(published, null, 2),
    ContentType: 'application/json',
  }));

  // Remove from pending
  await client.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: pendingKey }));
}

async function holdStory(key, hold) {
  const client = getClient();

  const get  = await client.send(new GetObjectCommand({ Bucket: BUCKET, Key: key }));
  const raw  = await streamToString(get.Body);
  const data = JSON.parse(raw);

  data.status = hold ? 'held' : 'pending';

  await client.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key:    key,
    Body:   JSON.stringify(data, null, 2),
    ContentType: 'application/json',
  }));
}

async function setStoryStatus(key, status) {
  const client = getClient();

  const get  = await client.send(new GetObjectCommand({ Bucket: BUCKET, Key: key }));
  const raw  = await streamToString(get.Body);
  const data = JSON.parse(raw);

  data.status = status;
  if (status === 'withdrawn') data.withdrawn_at = new Date().toISOString();
  if (status === 'published') delete data.withdrawn_at;

  await client.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key:    key,
    Body:   JSON.stringify(data, null, 2),
    ContentType: 'application/json',
  }));
}
