/**
 * server.js
 * Admin tool API server.
 * Run from the repo root: node admin/server.js
 * Serves the UI at http://localhost:3001
 * API at http://localhost:3001/api/*
 */

import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import { promises as fs } from 'fs';
import { resolvePath, listSlugs, SITE_ROOT } from './lib/records.js';
import { readRecord, attachValue, detachValue, writeRecord, isArrayField, isReadonlyField, isBooleanField, getNestedValue, setNestedValue } from './lib/frontmatter.js';
import { sessionStatus, ensureWorkingBranch, commitChanges, pushBranch } from './lib/session.js';
import { registerPhotosRoutes, uploadToR2 } from './lib/photos.js';
import { registerSoldiersRoutes } from './lib/soldiers.js';
import registerTodoRoutes from './lib/todo.js';
import { registerSubmissionsRoutes } from './lib/submissions.js';
import { registerProposalsRoutes } from './lib/proposals.js';
import { registerFeedbackRoutes } from './lib/feedback.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Load .env from admin/ regardless of which directory the server is started from
dotenv.config({ path: path.join(__dirname, '.env') });
const REPO_ROOT = path.resolve(__dirname, '..');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json({ limit: '25mb' }));

// Serve the admin UI static files from admin/
app.use(express.static(__dirname));

// ─── session endpoints ────────────────────────────────────────────────────────

/**
 * GET /api/session
 * Returns current branch, pending changes, last commit.
 * Also ensures we're on a working branch (creates one if needed).
 */
app.get('/api/session', async (req, res) => {
  try {
    const branchResult = await ensureWorkingBranch();
    const status = await sessionStatus();
    res.json({ ...status, branchCreated: branchResult.created });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/session/commit
 * Body: { message: string }
 * Stages and commits all pending changes.
 */
app.post('/api/session/commit', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message?.trim()) {
      return res.status(400).json({ error: 'Commit message is required.' });
    }
    const hash = await commitChanges(message.trim());
    res.json({ ok: true, hash });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/session/push
 * Pushes the current branch to origin.
 */
app.post('/api/session/push', async (req, res) => {
  try {
    const branch = await pushBranch();
    res.json({ ok: true, branch });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── record endpoints ─────────────────────────────────────────────────────────

/**
 * GET /api/slugs?type=document
 * Returns all known slugs for a content type.
 */
app.get('/api/slugs', async (req, res) => {
  try {
    const { type } = req.query;
    if (!type) return res.status(400).json({ error: 'type is required' });
    const slugs = await listSlugs(type);
    res.json(slugs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/record?type=document&slug=dillon-stan-account-042071
 * Returns the front matter of a record.
 */
app.get('/api/record', async (req, res) => {
  try {
    const { type, slug } = req.query;
    if (!type || !slug) return res.status(400).json({ error: 'type and slug are required' });

    const filePath = await resolvePath(type, slug);
    if (!filePath) return res.status(404).json({ error: `No file found for ${type}:${slug}` });

    const { data } = await readRecord(filePath);
    res.json({ slug, type, filePath, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/attach
 * Body: { type, slug, field, value }
 * Appends or sets a value on a front matter field.
 */
app.post('/api/attach', async (req, res) => {
  try {
    const { type, slug, field, value } = req.body;

    if (!type || !slug || !field || value === undefined) {
      return res.status(400).json({ error: 'type, slug, field, and value are required' });
    }

    if (isReadonlyField(field)) {
      return res.status(400).json({ error: `"${field}" is read-only and cannot be edited here.` });
    }

    const filePath = await resolvePath(type, slug);
    if (!filePath) return res.status(404).json({ error: `No file found for ${type}:${slug}` });

    const { data, content } = await readRecord(filePath);
    const result = attachValue(data, field, value);

    if (!result.changed) {
      return res.json({ ok: true, changed: false, message: 'Value already present — no change made.' });
    }

    await writeRecord(filePath, data, content);

    res.json({
      ok: true,
      changed: true,
      field,
      previousValue: result.previousValue,
      newValue: result.newValue,
      filePath,
      isArrayField: isArrayField(field),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/detach
 * Body: { type, slug, field, value }
 * Removes a value from a front matter field.
 */
app.post('/api/detach', async (req, res) => {
  try {
    const { type, slug, field, value } = req.body;

    if (!type || !slug || !field || value === undefined) {
      return res.status(400).json({ error: 'type, slug, field, and value are required' });
    }

    const filePath = await resolvePath(type, slug);
    if (!filePath) return res.status(404).json({ error: `No file found for ${type}:${slug}` });

    const { data, content } = await readRecord(filePath);
    const result = detachValue(data, field, value);

    if (!result.changed) {
      return res.json({ ok: true, changed: false, message: 'Value not present — no change made.' });
    }

    await writeRecord(filePath, data, content);
    res.json({ ok: true, changed: true, field, previousValue: result.previousValue, newValue: result.newValue });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/edit
 * Body: { type, slug, field, value }
 * Sets a field to an exact value — scalar or full array replacement.
 */
app.post('/api/edit', async (req, res) => {
  try {
    const { type, slug, field, value } = req.body;

    if (!type || !slug || !field || value === undefined) {
      return res.status(400).json({ error: 'type, slug, field, and value are required' });
    }

    if (isReadonlyField(field)) {
      return res.status(400).json({ error: `"${field}" is read-only and cannot be edited here.` });
    }

    const filePath = await resolvePath(type, slug);
    if (!filePath) return res.status(404).json({ error: `No file found for ${type}:${slug}` });

    const { data, content } = await readRecord(filePath);
    const previousValue = getNestedValue(data, field);
    const coercedValue = isBooleanField(field) && typeof value === 'string'
      ? (value === 'true' ? true : value === 'false' ? false : value)
      : value;
    setNestedValue(data, field, coercedValue);
    await writeRecord(filePath, data, content);

    res.json({ ok: true, field, previousValue, newValue: coercedValue, filePath });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/remove-from-array
 * Body: { type, slug, field, index }
 * Removes an item from an array field by index position.
 */
app.post('/api/remove-from-array', async (req, res) => {
  try {
    const { type, slug, field, index } = req.body;

    if (!type || !slug || !field || index === undefined) {
      return res.status(400).json({ error: 'type, slug, field, and index are required' });
    }

    const filePath = await resolvePath(type, slug);
    if (!filePath) return res.status(404).json({ error: `No file found for ${type}:${slug}` });

    const { data, content } = await readRecord(filePath);
    const arr = Array.isArray(data[field]) ? data[field] : [];
    if (index < 0 || index >= arr.length) {
      return res.status(400).json({ error: `Index ${index} out of range for ${field}` });
    }

    const previousValue = arr[index];
    data[field] = arr.filter((_, i) => i !== index);
    await writeRecord(filePath, data, content);

    res.json({ ok: true, field, removedValue: previousValue, newValue: data[field], filePath });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Phase 2 Write & Tag Endpoints ───────────────────────────────────────────

/**
 * T2.1: POST /api/document/create
 * Schema: site/documents/<author>/<slug>/<slug>.md
 */
app.post('/api/document/create', async (req, res) => {
  try {
    const {
      slug,
      title = '',
      author = '',
      event = '',
      date = '',
      type = 'account',
      status = 'published',
      contains = [],
      tagged = [],
      content = '',
      body = ''
    } = req.body || {};

    if (!slug) return res.status(400).json({ error: 'slug is required' });
    if (!/^[a-z0-9-]+$/.test(slug)) return res.status(400).json({ error: 'slug: lowercase letters, numbers, hyphens only' });
    if (!author) return res.status(400).json({ error: 'author is required' });

    const docDir = path.join(SITE_ROOT, 'documents', author, slug);
    await fs.mkdir(docDir, { recursive: true });
    const absPath = path.join(docDir, `${slug}.md`);

    const data = {
      layout: 'layouts/document.njk',
      slug,
      title,
      author,
      event: event || '',
      date: date || '',
      type,
      status,
      contains: Array.isArray(contains) ? contains : [],
      tagged: Array.isArray(tagged) ? tagged : [],
      permalink: `/documents/${author}/${slug}/`,
    };

    const markdownBody = content || body || '';
    await writeRecord(absPath, data, markdownBody);

    res.json({ ok: true, path: absPath, slug });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * T2.2: POST /api/letter/create
 * Schema: site/soldiers/<author>/letters/<slug>.md
 */
app.post('/api/letter/create', async (req, res) => {
  try {
    const {
      slug,
      title = '',
      author = '',
      doc_date = '',
      date_known = false,
      recipient = '',
      source = '',
      status = 'published',
      contains = [],
      tagged = [],
      content = '',
      body = ''
    } = req.body || {};

    if (!slug) return res.status(400).json({ error: 'slug is required' });
    if (!/^[a-z0-9-]+$/.test(slug)) return res.status(400).json({ error: 'slug: lowercase letters, numbers, hyphens only' });
    if (!author) return res.status(400).json({ error: 'author (soldier slug) is required' });

    const letterDir = path.join(SITE_ROOT, 'soldiers', author, 'letters');
    await fs.mkdir(letterDir, { recursive: true });
    const absPath = path.join(letterDir, `${slug}.md`);

    const data = {
      layout: 'layouts/document.njk',
      slug,
      title,
      type: 'letter',
      author,
      doc_date: doc_date || '',
      date_known: date_known === true || date_known === 'true',
      recipient: recipient || '',
      source: source || '',
      status,
      contains: Array.isArray(contains) ? contains : [],
      tagged: Array.isArray(tagged) ? tagged : [],
      permalink: `/soldiers/${author}/letters/${slug}/`,
    };

    const markdownBody = content || body || '';
    await writeRecord(absPath, data, markdownBody);

    res.json({ ok: true, path: absPath, slug });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * T2.3: POST /api/anecdote/create
 * Schema: site/anecdotes/<soldier>/<slug>/index.md
 */
app.post('/api/anecdote/create', async (req, res) => {
  try {
    const {
      slug,
      soldier = '',
      title = '',
      summary = '',
      date = '',
      date_known = false,
      source_short = '',
      event = '',
      status = 'published',
      contains = [],
      tagged = [],
      content = '',
      body = ''
    } = req.body || {};

    if (!slug) return res.status(400).json({ error: 'slug is required' });
    if (!/^[a-z0-9-]+$/.test(slug)) return res.status(400).json({ error: 'slug: lowercase letters, numbers, hyphens only' });
    if (!soldier) return res.status(400).json({ error: 'soldier slug is required' });

    const anecdoteDir = path.join(SITE_ROOT, 'anecdotes', soldier, slug);
    await fs.mkdir(anecdoteDir, { recursive: true });
    const absPath = path.join(anecdoteDir, 'index.md');

    const data = {
      layout: 'layouts/anecdote.njk',
      slug,
      title,
      type: 'anecdote',
      summary: summary || '',
      date: date || '',
      date_known: date_known === true || date_known === 'true',
      source_short: source_short || '',
      event: event || '',
      contains: Array.isArray(contains) ? contains : [],
      tagged: Array.isArray(tagged) ? tagged : [],
      status,
      permalink: `/anecdotes/${soldier}/${slug}/`,
    };

    const markdownBody = content || body || '';
    await writeRecord(absPath, data, markdownBody);

    res.json({ ok: true, path: absPath, slug });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * T2.4: POST /api/contains
 * Attach/detach a soldier slug on any item's contains/tagged
 * Body: { type, slug, field: 'contains'|'tagged', value: <soldierSlug>, op: 'add'|'remove' }
 */
app.post('/api/contains', async (req, res) => {
  try {
    const { type, slug, field, value, op = 'add' } = req.body || {};

    if (!type || !slug || !field || !value) {
      return res.status(400).json({ error: 'type, slug, field, and value are required' });
    }
    if (!['contains', 'tagged'].includes(field)) {
      return res.status(400).json({ error: 'field must be contains or tagged' });
    }

    const filePath = await resolvePath(type, slug);
    if (!filePath) return res.status(404).json({ error: `No file found for ${type}:${slug}` });

    const { data, content } = await readRecord(filePath);
    let result;

    if (op === 'add') {
      result = attachValue(data, field, value);
    } else if (op === 'remove') {
      result = detachValue(data, field, value);
    } else {
      return res.status(400).json({ error: 'op must be add or remove' });
    }

    if (result.changed) {
      await writeRecord(filePath, data, content);
    }

    res.json({
      ok: true,
      changed: result.changed,
      field,
      value,
      op,
      filePath,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * T2.5: POST /api/alongside
 * Add/remove manual link in _alongside.json writing both directions
 * Body: { soldier, other, basis, notes, op: 'add'|'remove' }
 */
app.post('/api/alongside', async (req, res) => {
  try {
    const { soldier, other, basis = 'unspecified', notes = '', op = 'add' } = req.body || {};

    if (!soldier || !other) {
      return res.status(400).json({ error: 'soldier and other slugs are required' });
    }
    if (soldier === other) {
      return res.status(400).json({ error: 'soldier and other cannot be identical' });
    }

    const soldierPath = path.join(SITE_ROOT, 'soldiers', soldier, '_alongside.json');
    const otherPath = path.join(SITE_ROOT, 'soldiers', other, '_alongside.json');

    const readLinks = async (filePath) => {
      try {
        const raw = await fs.readFile(filePath, 'utf8');
        return JSON.parse(raw);
      } catch (err) {
        if (err.code === 'ENOENT') return [];
        throw err;
      }
    };

    const writeLinks = async (filePath, links) => {
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, JSON.stringify(links, null, 2) + '\n', 'utf8');
    };

    let soldierLinks = await readLinks(soldierPath);
    let otherLinks = await readLinks(otherPath);

    if (op === 'add') {
      // Forward: soldier -> other
      const existsForward = soldierLinks.some((l) => l.slug === other);
      if (!existsForward) {
        soldierLinks.push({ slug: other, basis, notes: notes || '' });
      }

      // Reverse: other -> soldier (empty notes if not specified)
      const existsReverse = otherLinks.some((l) => l.slug === soldier);
      if (!existsReverse) {
        otherLinks.push({ slug: soldier, basis, notes: '' });
      }
    } else if (op === 'remove') {
      soldierLinks = soldierLinks.filter((l) => l.slug !== other);
      otherLinks = otherLinks.filter((l) => l.slug !== soldier);
    } else {
      return res.status(400).json({ error: 'op must be add or remove' });
    }

    await writeLinks(soldierPath, soldierLinks);
    await writeLinks(otherPath, otherLinks);

    res.json({ ok: true, op, soldier, other });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── tab 4: photo intake & profile photo ──────────────────────────────────────

/**
 * POST /api/soldier/profile-photo
 * Body: { slug, imageData (base64 data URL), crop: {x,y,w,h}|null, credit, photographer }
 */
app.post('/api/soldier/profile-photo', async (req, res) => {
  try {
    const { slug, imageData, crop, credit = '', photographer = '' } = req.body;
    if (!slug || !imageData) {
      return res.status(400).json({ error: 'slug and imageData are required' });
    }

    const matches = imageData.match(/^data:image\/(\w+);base64,(.+)$/s);
    if (!matches) return res.status(400).json({ error: 'Invalid image data URL' });
    const buffer = Buffer.from(matches[2], 'base64');

    const profileDir = path.join(SITE_ROOT, 'soldiers', slug, 'photos', 'profile');
    await fs.mkdir(profileDir, { recursive: true });

    const filename = `${slug}-profile.jpg`;
    const outPath = path.join(profileDir, filename);

    const { default: sharp } = await import('sharp');
    let pipeline = sharp(buffer);

    if (crop && crop.w > 0.02 && crop.h > 0.02) {
      const meta = await pipeline.metadata();
      pipeline = pipeline.extract({
        left: Math.round(crop.x * meta.width),
        top: Math.round(crop.y * meta.height),
        width: Math.round(crop.w * meta.width),
        height: Math.round(crop.h * meta.height),
      });
    }

    await pipeline.jpeg({ quality: 90 }).toFile(outPath);

    const creditStr = credit ? `"${credit.replace(/"/g, '\\"')}"` : '""';
    const photographerStr = photographer ? `"${photographer}"` : '""';
    const indexMd =
`---
soldier: ${slug}
subfolder: profile
photos:
  - filename: ${filename}
    caption: >

    caption_short: ""
    credit: ${creditStr}
    photographer: ${photographerStr}
    date:
    date_known: false
    event: ""
    quality:
    contains: []
    tagged: []
---
`;
    await fs.writeFile(path.join(profileDir, 'index.md'), indexMd, 'utf8');

    await uploadToR2(outPath, `soldiers/${slug}/profile/${filename}`);

    const soldierPath = await resolvePath('soldier', slug);
    if (soldierPath) {
      const { data, content } = await readRecord(soldierPath);
      data.profile_photo = filename;
      await writeRecord(soldierPath, data, content);
    }

    res.json({ ok: true, filename });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

registerPhotosRoutes(app);
registerSoldiersRoutes(app);

// ─── private contacts ─────────────────────────────────────────────────────────

const PRIVATE_CONTACTS_PATH = path.resolve(__dirname, '..', 'site', '_private', 'contacts.json');

async function readPrivateContacts() {
  try {
    const raw = await fs.readFile(PRIVATE_CONTACTS_PATH, 'utf8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

async function writePrivateContacts(data) {
  await fs.mkdir(path.dirname(PRIVATE_CONTACTS_PATH), { recursive: true });
  await fs.writeFile(PRIVATE_CONTACTS_PATH, JSON.stringify(data, null, 2), 'utf8');
}

app.get('/api/private/contact', async (req, res) => {
  const { slug } = req.query;
  if (!slug) return res.status(400).json({ error: 'slug is required' });
  const all = await readPrivateContacts();
  res.json(all[slug] || {});
});

app.post('/api/private/contact', async (req, res) => {
  try {
    const { slug, ...fields } = req.body || {};
    if (!slug) return res.status(400).json({ error: 'slug is required' });
    const ALLOWED = new Set(['email', 'phone', 'address', 'notes']);
    const update = Object.fromEntries(
      Object.entries(fields).filter(([k, v]) => ALLOWED.has(k) && v !== '' && v != null)
    );
    const all = await readPrivateContacts();
    all[slug] = { ...(all[slug] || {}), ...update };
    await writePrivateContacts(all);
    res.json({ ok: true, slug, contact: all[slug] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── soldier links: other ─────────────────────────────────────────────────────

app.post('/api/soldier/links/other/add', async (req, res) => {
  try {
    const { slug, label, url } = req.body || {};
    if (!slug || !url) return res.status(400).json({ error: 'slug and url required' });
    const filePath = await resolvePath('soldier', slug);
    if (!filePath) return res.status(404).json({ error: `Soldier "${slug}" not found` });
    const { data, content } = await readRecord(filePath);
    if (!data.links) data.links = {};
    if (!Array.isArray(data.links.other)) {
      data.links.other = data.links.other ? [data.links.other] : [];
    }
    data.links.other.push({ label: label || '', url });
    await writeRecord(filePath, data, content);
    res.json({ ok: true, links: { other: data.links.other } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/soldier/links/other/remove', async (req, res) => {
  try {
    const { slug, index } = req.body || {};
    if (!slug || index === undefined) return res.status(400).json({ error: 'slug and index required' });
    const filePath = await resolvePath('soldier', slug);
    if (!filePath) return res.status(404).json({ error: `Soldier "${slug}" not found` });
    const { data, content } = await readRecord(filePath);
    const others = Array.isArray(data.links?.other) ? [...data.links.other] : [];
    if (index < 0 || index >= others.length) return res.status(400).json({ error: 'Index out of range' });
    others.splice(Number(index), 1);
    if (!data.links) data.links = {};
    data.links.other = others;
    await writeRecord(filePath, data, content);
    res.json({ ok: true, links: { other: data.links.other } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── service record ───────────────────────────────────────────────────────────

app.post('/api/soldier/service-record/induction', async (req, res) => {
  try {
    const { slug, ...fields } = req.body || {};
    if (!slug) return res.status(400).json({ error: 'slug required' });
    const filePath = await resolvePath('soldier', slug);
    if (!filePath) return res.status(404).json({ error: 'Soldier not found' });
    const { data, content } = await readRecord(filePath);
    if (!data.service_record) data.service_record = {};
    if (!data.service_record.induction || typeof data.service_record.induction !== 'object') {
      data.service_record.induction = {};
    }
    for (const k of ['status', 'location', 'date']) {
      if (fields[k] != null) data.service_record.induction[k] = fields[k] || null;
    }
    await writeRecord(filePath, data, content);
    res.json({ ok: true, induction: data.service_record.induction });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/soldier/service-record/assignment/add', async (req, res) => {
  try {
    const { slug, ...entry } = req.body || {};
    if (!slug) return res.status(400).json({ error: 'slug required' });
    const filePath = await resolvePath('soldier', slug);
    if (!filePath) return res.status(404).json({ error: 'Soldier not found' });
    const { data, content } = await readRecord(filePath);
    if (!data.service_record) data.service_record = {};
    if (!Array.isArray(data.service_record.assignments)) data.service_record.assignments = [];
    const clean = {};
    for (const k of ['type', 'label', 'unit', 'location', 'from', 'to', 'notes']) {
      if (entry[k] != null && entry[k] !== '') clean[k] = entry[k];
    }
    data.service_record.assignments.push(clean);
    await writeRecord(filePath, data, content);
    res.json({ ok: true, assignments: data.service_record.assignments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/soldier/service-record/assignment/remove', async (req, res) => {
  try {
    const { slug, index } = req.body || {};
    if (!slug || index == null) return res.status(400).json({ error: 'slug and index required' });
    const filePath = await resolvePath('soldier', slug);
    if (!filePath) return res.status(404).json({ error: 'Soldier not found' });
    const { data, content } = await readRecord(filePath);
    const assignments = Array.isArray(data.service_record?.assignments)
      ? [...data.service_record.assignments] : [];
    assignments.splice(Number(index), 1);
    data.service_record.assignments = assignments;
    await writeRecord(filePath, data, content);
    res.json({ ok: true, assignments: data.service_record.assignments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── timeline ─────────────────────────────────────────────────────────────────

app.post('/api/soldier/timeline/add', async (req, res) => {
  try {
    const { slug, ...entry } = req.body || {};
    if (!slug) return res.status(400).json({ error: 'slug required' });
    const filePath = await resolvePath('soldier', slug);
    if (!filePath) return res.status(404).json({ error: 'Soldier not found' });
    const { data, content } = await readRecord(filePath);
    if (!Array.isArray(data.timeline)) data.timeline = [];
    const clean = {};
    for (const k of ['date', 'phase', 'type', 'headline', 'body']) {
      if (entry[k] != null && entry[k] !== '') clean[k] = entry[k];
    }
    data.timeline.push(clean);
    data.timeline.sort((a, b) => (a.date || '').localeCompare(b.date || ''));
    await writeRecord(filePath, data, content);
    res.json({ ok: true, timeline: data.timeline });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/soldier/timeline/remove', async (req, res) => {
  try {
    const { slug, index } = req.body || {};
    if (!slug || index == null) return res.status(400).json({ error: 'slug and index required' });
    const filePath = await resolvePath('soldier', slug);
    if (!filePath) return res.status(404).json({ error: 'Soldier not found' });
    const { data, content } = await readRecord(filePath);
    const tl = Array.isArray(data.timeline) ? [...data.timeline] : [];
    tl.splice(Number(index), 1);
    data.timeline = tl;
    await writeRecord(filePath, data, content);
    res.json({ ok: true, timeline: data.timeline });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── soldier photo listing ────────────────────────────────────────────────────

app.get('/api/soldier/photos', async (req, res) => {
  const { slug } = req.query;
  if (!slug) return res.status(400).json({ error: 'slug required' });
  const SOLDIERS_ROOT = path.join(SITE_ROOT, 'soldiers');
  let profilePhoto = null;
  const soldierPath = await resolvePath('soldier', slug);
  if (soldierPath) {
    const { data } = await readRecord(soldierPath);
    profilePhoto = data.profile_photo || null;
  }
  const fieldDir = path.join(SOLDIERS_ROOT, slug, 'photos', 'field');
  let fieldFiles = [];
  try {
    fieldFiles = (await fs.readdir(fieldDir)).filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f));
  } catch {}
  res.json({ ok: true, profile_photo: profilePhoto, field_count: fieldFiles.length, field_files: fieldFiles });
});

app.get('/api/soldier/documents', async (req, res) => {
  const { slug } = req.query;
  if (!slug) return res.status(400).json({ error: 'slug required' });
  const docRoot = path.join(SITE_ROOT, 'documents', slug);
  const docs = [];
  try {
    const entries = await fs.readdir(docRoot, { withFileTypes: true });
    for (const e of entries) {
      if (!e.isDirectory()) continue;
      const docSlug = e.name;
      let title = docSlug;
      let type = '';
      for (const candidate of [`${docSlug}.md`, 'index.md']) {
        try {
          const { data } = await readRecord(path.join(docRoot, docSlug, candidate));
          if (data.title) title = data.title;
          if (data.type) type = data.type;
          break;
        } catch {}
      }
      docs.push({ slug: docSlug, title, type });
    }
  } catch {}
  res.json({ ok: true, documents: docs });
});

app.get('/api/soldier/photos/containing', async (req, res) => {
  const { slug } = req.query;
  if (!slug) return res.status(400).json({ error: 'slug required' });
  const SOLDIERS_ROOT = path.join(SITE_ROOT, 'soldiers');
  const results = [];
  try {
    const soldierDirs = await fs.readdir(SOLDIERS_ROOT, { withFileTypes: true });
    for (const sd of soldierDirs) {
      if (!sd.isDirectory()) continue;
      const sourceSlug = sd.name;
      const photosRoot = path.join(SOLDIERS_ROOT, sourceSlug, 'photos');
      let subfolders;
      try { subfolders = await fs.readdir(photosRoot, { withFileTypes: true }); }
      catch { continue; }
      for (const sf of subfolders) {
        if (!sf.isDirectory()) continue;
        const subfolder = sf.name;
        const indexPath = path.join(photosRoot, subfolder, 'index.md');
        try {
          const { data } = await readRecord(indexPath);
          const photos = Array.isArray(data.photos) ? data.photos : [];
          for (const photo of photos) {
            const contains = Array.isArray(photo.contains) ? photo.contains : [];
            if (contains.includes(slug)) {
              results.push({
                sourceSlug,
                subfolder,
                filename: photo.filename,
                caption: photo.caption_short || photo.caption || '',
                credit: photo.credit || '',
                url: `https://angryskipperarchive.org/media/photos/soldiers/${sourceSlug}/${subfolder}/${encodeURIComponent(photo.filename)}`,
              });
            }
          }
        } catch { /* skip unreadable */ }
      }
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
  res.json({ ok: true, photos: results });
});

app.post('/api/soldier/profile-photo/from-existing', async (req, res) => {
  try {
    const { slug, sourceSlug, subfolder, filename, crop, credit = '', photographer = '' } = req.body || {};
    if (!slug || !sourceSlug || !subfolder || !filename) {
      return res.status(400).json({ error: 'slug, sourceSlug, subfolder, and filename are required' });
    }
    const cdnUrl = `https://angryskipperarchive.org/media/photos/soldiers/${sourceSlug}/${subfolder}/${encodeURIComponent(filename)}`;
    console.log('[from-existing] fetching:', cdnUrl);
    const fetchRes = await fetch(cdnUrl);
    if (!fetchRes.ok) throw new Error(`CDN fetch failed: ${fetchRes.status} ${cdnUrl}`);
    const arrayBuf = await fetchRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuf);

    const profileDir = path.join(SITE_ROOT, 'soldiers', slug, 'photos', 'profile');
    await fs.mkdir(profileDir, { recursive: true });

    const outFilename = `${slug}-profile.jpg`;
    const outPath = path.join(profileDir, outFilename);

    const { default: sharp } = await import('sharp');
    let pipeline = sharp(buffer);
    if (crop && crop.w > 0.02 && crop.h > 0.02) {
      const meta = await pipeline.metadata();
      pipeline = pipeline.extract({
        left: Math.round(crop.x * meta.width),
        top: Math.round(crop.y * meta.height),
        width: Math.round(crop.w * meta.width),
        height: Math.round(crop.h * meta.height),
      });
    }
    await pipeline.jpeg({ quality: 90 }).toFile(outPath);

    const creditStr = credit ? `"${credit.replace(/"/g, '\\"')}"` : '""';
    const photographerStr = photographer ? `"${photographer}"` : '""';
    const indexMd = [
      '---',
      `soldier: ${slug}`,
      'subfolder: profile',
      'photos:',
      `  - filename: ${outFilename}`,
      '    caption: >',
      '',
      '    caption_short: ""',
      `    credit: ${creditStr}`,
      `    photographer: ${photographerStr}`,
      '    date:',
      '    date_known: false',
      '    event: ""',
      '    quality:',
      '    contains: []',
      '    tagged: []',
      '---',
      '',
    ].join('\n');
    await fs.writeFile(path.join(profileDir, 'index.md'), indexMd, 'utf8');

    await uploadToR2(outPath, `soldiers/${slug}/profile/${outFilename}`);

    const soldierPath = await resolvePath('soldier', slug);
    if (soldierPath) {
      const { data, content } = await readRecord(soldierPath);
      data.profile_photo = outFilename;
      await writeRecord(soldierPath, data, content);
    }

    res.json({ ok: true, filename: outFilename });
  } catch (err) {
    console.error('[from-existing] error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ─── tab 5: todo / flags ──────────────────────────────────────────────────────

registerTodoRoutes(app);

// ─── infra-task-068: submissions pull ────────────────────────────────────────

registerSubmissionsRoutes(app, REPO_ROOT);

// ─── photo ID proposals ──────────────────────────────────────────────────────

registerProposalsRoutes(app);

// ─── site feedback ───────────────────────────────────────────────────────────

registerFeedbackRoutes(app, REPO_ROOT);

// ─── Phase 3 Helper Endpoints: Alongside, Letters, Anecdotes ─────────────────

// GET /api/soldier/alongside?slug=
app.get('/api/soldier/alongside', async (req, res) => {
  try {
    const { slug } = req.query;
    if (!slug) return res.status(400).json({ error: 'slug is required' });

    const alongsidePath = path.join(SITE_ROOT, 'soldiers', slug, '_alongside.json');
    let manualLinks = [];
    try {
      const raw = await fs.readFile(alongsidePath, 'utf8');
      manualLinks = JSON.parse(raw);
    } catch (err) {
      if (err.code !== 'ENOENT') console.error(err);
    }

    res.json({ ok: true, slug, links: manualLinks });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/soldier/letters?slug=
app.get('/api/soldier/letters', async (req, res) => {
  try {
    const { slug } = req.query;
    if (!slug) return res.status(400).json({ error: 'slug is required' });

    const lettersDir = path.join(SITE_ROOT, 'soldiers', slug, 'letters');
    const letters = [];
    try {
      const entries = await fs.readdir(lettersDir, { withFileTypes: true });
      for (const e of entries) {
        if (!e.isFile() || !e.name.endsWith('.md')) continue;
        const letterSlug = path.basename(e.name, '.md');
        const { data } = await readRecord(path.join(lettersDir, e.name));
        letters.push({
          slug: letterSlug,
          title: data.title || letterSlug,
          doc_date: data.doc_date || data.date || '',
          recipient: data.recipient || '',
          contains: data.contains || [],
          tagged: data.tagged || []
        });
      }
    } catch {}

    res.json({ ok: true, letters });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/soldier/anecdotes?slug=
app.get('/api/soldier/anecdotes', async (req, res) => {
  try {
    const { slug } = req.query;
    if (!slug) return res.status(400).json({ error: 'slug is required' });

    const soldierAnecDir = path.join(SITE_ROOT, 'anecdotes', slug);
    const anecdotes = [];
    try {
      const dirs = await fs.readdir(soldierAnecDir, { withFileTypes: true });
      for (const d of dirs) {
        if (!d.isDirectory()) continue;
        const anecSlug = d.name;
        const filePath = path.join(soldierAnecDir, anecSlug, 'index.md');
        try {
          const { data } = await readRecord(filePath);
          anecdotes.push({
            slug: anecSlug,
            title: data.title || anecSlug,
            summary: data.summary || '',
            date: data.date || '',
            event: data.event || '',
            contains: data.contains || [],
            tagged: data.tagged || []
          });
        } catch {}
      }
    } catch {}

    res.json({ ok: true, anecdotes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
/**
 * T5.1: POST /api/locations/create
 * Schema: site/locations/<slug>/index.md
 */
app.post('/api/locations/create', async (req, res) => {
  try {
    const {
      slug,
      display_name = '',
      short_name = '',
      type = 'lz',
      also_known_as = '',
      named_for = '',
      named_for_note = '',
      location = {},
      dates = {},
      related_bases = {},
      photo_sources = [],
      related_events = [],
      contains = [],
      tagged = [],
      command_post = false,
      contributed_by = '',
      notes = '',
      content = '',
      body = ''
    } = req.body || {};

    if (!slug) return res.status(400).json({ error: 'slug is required' });
    if (!/^[a-z0-9-]+$/.test(slug)) return res.status(400).json({ error: 'slug: lowercase letters, numbers, hyphens only' });

    const locDir = path.join(SITE_ROOT, 'locations', slug);
    await fs.mkdir(locDir, { recursive: true });
    const absPath = path.join(locDir, 'index.md');

    const title = display_name || short_name || slug;
    const breadcrumb = short_name || display_name || slug;

    const data = {
      layout: 'layouts/location.njk',
      tags: ['location'],
      slug,
      title,
      breadcrumb,
      display_name,
      short_name,
      type,
      also_known_as,
      named_for,
      named_for_note,
      location: {
        mgrs: location.mgrs || '',
        lat: location.lat || '',
        lon: location.lon || '',
        province: location.province || '',
        modern_landmark: location.modern_landmark || '',
        coordinate_source: location.coordinate_source || '',
        coordinate_confidence: location.coordinate_confidence || ''
      },
      dates: {
        established: {
          date: dates.established?.date || '',
          source: dates.established?.source || '',
          confidence: dates.established?.confidence || ''
        },
        closed: {
          date: dates.closed?.date || '',
          source: dates.closed?.source || '',
          confidence: dates.closed?.confidence || ''
        },
        notes: dates.notes || ''
      },
      related_bases: {
        predecessor: related_bases.predecessor || '',
        successor: related_bases.successor || '',
        split_from: related_bases.split_from || '',
        split_into: related_bases.split_into || ''
      },
      photo_sources: Array.isArray(photo_sources) ? photo_sources : [],
      related_events: Array.isArray(related_events) ? related_events : [],
      contains: Array.isArray(contains) ? contains : [],
      tagged: Array.isArray(tagged) ? tagged : [],
      command_post: command_post === true || command_post === 'true',
      status: 'published',
      date_added: new Date().toISOString().slice(0, 10),
      last_updated: new Date().toISOString().slice(0, 10),
      contributed_by,
      notes,
      permalink: `/locations/${slug}/`
    };

    const markdownBody = content || body || '';
    await writeRecord(absPath, data, markdownBody);

    res.json({ ok: true, path: absPath, slug });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// ─── start ────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`\n  D Co. Admin Tool`);
  console.log(`  ─────────────────────────────────────`);
  console.log(`  UI:  http://localhost:${PORT}`);
  console.log(`  API: http://localhost:${PORT}/api`);
  console.log(`\n  Ctrl+C to stop\n`);
});