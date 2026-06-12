/**
 * proposals.js
 * Admin review for photo ID proposals submitted from the public lightbox.
 *
 * Records live in the SUBMISSIONS R2 bucket under:
 *   submissions/photo-proposals/pending/{id}.json    — awaiting review
 *   submissions/photo-proposals/held/{id}.json        — parked for research
 *   submissions/photo-proposals/approved/{id}.json     — applied, archived
 *   submissions/photo-proposals/dismissed/{id}.json    — rejected, archived
 *
 * Nothing here runs automatically. Approve applies the change to the photo's
 * index.md front matter (located by target.soldier_slug + subfolder + filename).
 *
 * Endpoints:
 *   GET  /api/proposals/list           — pending + held, grouped by photo
 *   POST /api/proposals/:id/approve    — apply change(s) to front matter
 *   POST /api/proposals/:id/hold       — move to held/
 *   POST /api/proposals/:id/dismiss    — move to dismissed/
 */

import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import path from 'path';
import { SITE_ROOT } from './records.js';
import { readRecord, writeRecord } from './frontmatter.js';

const ACCOUNT_ID = 'a147c21894e80723027ad746a073a7e9';
const BUCKET     = 'angryskipperarchive-submissions';
const BASE       = 'submissions/photo-proposals';

function getClient() {
  const accessKeyId     = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  if (!accessKeyId || !secretAccessKey) {
    throw new Error('R2 credentials not set. Add R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY to admin/.env');
  }
  return new S3Client({
    region: 'auto',
    endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });
}

async function streamToString(stream) {
  const chunks = [];
  for await (const chunk of stream) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks).toString('utf-8');
}

/** Read every JSON record under a status prefix. */
async function readPrefix(client, status) {
  const prefix = `${BASE}/${status}/`;
  const out = [];
  let token;
  do {
    const res = await client.send(new ListObjectsV2Command({
      Bucket: BUCKET, Prefix: prefix, ContinuationToken: token,
    }));
    for (const obj of res.Contents || []) {
      if (!obj.Key.endsWith('.json')) continue;
      const got = await client.send(new GetObjectCommand({ Bucket: BUCKET, Key: obj.Key }));
      try {
        const rec = JSON.parse(await streamToString(got.Body));
        rec._key = obj.Key;
        rec._status_folder = status;
        out.push(rec);
      } catch { /* skip malformed */ }
    }
    token = res.NextContinuationToken;
  } while (token);
  return out;
}

/** Find a single record by id across pending + held. */
async function findRecord(client, id) {
  for (const status of ['pending', 'held']) {
    const key = `${BASE}/${status}/${id}.json`;
    try {
      const got = await client.send(new GetObjectCommand({ Bucket: BUCKET, Key: key }));
      const rec = JSON.parse(await streamToString(got.Body));
      rec._key = key;
      rec._status_folder = status;
      return rec;
    } catch { /* not in this folder */ }
  }
  throw new Error(`Proposal not found: ${id}`);
}

/** Move a (possibly mutated) record to a new status folder. */
async function moveRecord(client, rec, newStatus) {
  const id = rec.proposal_id;
  const newKey = `${BASE}/${newStatus}/${id}.json`;
  const oldKey = rec._key;
  const body = { ...rec };
  delete body._key;
  delete body._status_folder;
  body.status = newStatus;
  body[`${newStatus}_at`] = new Date().toISOString();

  await client.send(new PutObjectCommand({
    Bucket: BUCKET, Key: newKey,
    Body: JSON.stringify(body, null, 2),
    ContentType: 'application/json',
  }));
  if (oldKey && oldKey !== newKey) {
    await client.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: oldKey }));
  }
  return newKey;
}

/**
 * Group pending + held proposals by target photo, and tally corroboration
 * for proposed `contains` slugs (the clearest "multiple confirmations" signal).
 */
async function listProposals() {
  const client = getClient();
  const records = [...await readPrefix(client, 'pending'), ...await readPrefix(client, 'held')];

  const groups = {};
  for (const r of records) {
    const t = r.target || {};
    const gk = `${t.soldier_slug}|${t.subfolder}|${t.filename}`;
    if (!groups[gk]) {
      groups[gk] = {
        target: t,
        photo_path: `soldiers/${t.soldier_slug}/photos/${t.subfolder}/index.md`,
        proposals: [],
        confirmations: {},   // slug → count
      };
    }
    groups[gk].proposals.push({
      id: r.proposal_id,
      status: r.status,
      status_folder: r._status_folder,
      submitted: r.submitted,
      submitter_name: r.submitter_name || '',
      submitter_contact: r.submitter_contact || '',
      source: r.source || '',
      changes: r.changes || {},
    });
    for (const slug of (r.changes && r.changes.contains_add) || []) {
      groups[gk].confirmations[slug] = (groups[gk].confirmations[slug] || 0) + 1;
    }
  }

  const photos = Object.values(groups).sort((a, b) => b.proposals.length - a.proposals.length);
  return { photos, total: records.length };
}

/**
 * Apply a proposal's changes to the photo's index.md front matter.
 * Returns { applied:[...], manual:[...] } — `manual` are changes that need a
 * human (freetext names, freeform notes) and are NOT written automatically.
 */
async function applyToFrontMatter(rec) {
  const t = rec.target || {};
  const filePath = path.join(SITE_ROOT, 'soldiers', t.soldier_slug, 'photos', ...t.subfolder.split('/'), 'index.md');

  const { data, content } = await readRecord(filePath);
  if (!Array.isArray(data.photos)) throw new Error(`No photos[] array in ${filePath}`);
  const entry = data.photos.find(p => p && p.filename === t.filename);
  if (!entry) throw new Error(`Photo entry "${t.filename}" not found in ${filePath}`);

  const c = rec.changes || {};
  const applied = [];
  const manual  = [];

  if (Array.isArray(c.contains_add) && c.contains_add.length) {
    if (!Array.isArray(entry.contains)) entry.contains = entry.contains ? [entry.contains] : [];
    for (const slug of c.contains_add) {
      if (!entry.contains.includes(slug)) { entry.contains.push(slug); applied.push(`contains += ${slug}`); }
      else applied.push(`contains already has ${slug}`);
    }
  }
  if (typeof c.caption === 'string' && c.caption) { entry.caption = c.caption; applied.push('caption updated'); }
  if (typeof c.date === 'string' && c.date) {
    entry.date = c.date;
    entry.date_known = c.date_approximate === false;
    applied.push(`date → ${c.date} (date_known: ${entry.date_known})`);
  }
  if (Array.isArray(c.contains_add_freetext) && c.contains_add_freetext.length) {
    manual.push(`Names not in roster (create stubs, then add to contains): ${c.contains_add_freetext.join(', ')}`);
  }
  if (typeof c.notes === 'string' && c.notes) {
    manual.push(`Freeform note (no auto-field — fold into caption or add by hand): ${c.notes}`);
  }

  if (applied.some(a => a.startsWith('contains +=') || a.startsWith('caption') || a.startsWith('date'))) {
    await writeRecord(filePath, data, content);
  }
  return { filePath, applied, manual };
}

export function registerProposalsRoutes(app) {
  app.get('/api/proposals/list', async (req, res) => {
    try {
      res.json(await listProposals());
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/proposals/:id/approve', async (req, res) => {
    try {
      const client = getClient();
      const rec = await findRecord(client, req.params.id);
      const result = await applyToFrontMatter(rec);
      await moveRecord(client, rec, 'approved');
      res.json({ ok: true, ...result });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/proposals/:id/hold', async (req, res) => {
    try {
      const client = getClient();
      const rec = await findRecord(client, req.params.id);
      await moveRecord(client, rec, 'held');
      res.json({ ok: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/proposals/:id/dismiss', async (req, res) => {
    try {
      const client = getClient();
      const rec = await findRecord(client, req.params.id);
      await moveRecord(client, rec, 'dismissed');
      res.json({ ok: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
}

export default registerProposalsRoutes;
