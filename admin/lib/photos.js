import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import yaml from 'js-yaml';
import multer from 'multer';
import { REPO_ROOT } from './records.js';

// ---------------------------------------------------------------------------
// R2 upload client
// ---------------------------------------------------------------------------
const ACCOUNT_ID    = 'a147c21894e80723027ad746a073a7e9';
const PHOTOS_BUCKET = 'angryskipperarchive-photos';

function getR2Client() {
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

/**
 * Upload a single file to R2.
 * key format: soldiers/[slug]/[subfolder]/[filename]
 */
export async function uploadToR2(localPath, r2Key) {
  const client = getR2Client();
  const body   = await fsp.readFile(localPath);
  const ext    = path.extname(localPath).toLowerCase();
  const contentTypeMap = {
    '.jpg':  'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png':  'image/png',
    '.gif':  'image/gif',
    '.webp': 'image/webp',
    '.tiff': 'image/tiff',
  };
  const contentType = contentTypeMap[ext] || 'application/octet-stream';
  await client.send(new PutObjectCommand({
    Bucket:      PHOTOS_BUCKET,
    Key:         r2Key,
    Body:        body,
    ContentType: contentType,
  }));
}

// ---------------------------------------------------------------------------
// Paths — all relative to repo root.
// REPO_ROOT is imported from records.js (derived from this file's location via
// __dirname), so it is correct no matter which directory the server is launched
// from. Do NOT compute it from process.cwd() — that breaks when the server is
// started from the repo root instead of admin/.
// ---------------------------------------------------------------------------
const INTAKE_ROOT = path.join(REPO_ROOT, '_intake');
const RAW_PHOTOS = path.join(INTAKE_ROOT, 'raw', 'photos');
const STAGING_PHOTOS = path.join(INTAKE_ROOT, 'staging', 'photos');
const SITE_SOLDIERS = path.join(REPO_ROOT, 'site', 'soldiers');
const LOG_FILE = path.join(INTAKE_ROOT, 'photo-intake.log');

// ---------------------------------------------------------------------------
// Log helpers
// ---------------------------------------------------------------------------
function readLog() {
  if (!fs.existsSync(LOG_FILE)) return [];
  return fs.readFileSync(LOG_FILE, 'utf-8')
    .split('\n')
    .filter(Boolean)
    .map(line => {
      try { return JSON.parse(line); } catch { return null; }
    })
    .filter(Boolean);
}

function appendLog(entry) {
  const line = JSON.stringify({ ...entry, ts: new Date().toISOString() });
  fs.appendFileSync(LOG_FILE, line + '\n', 'utf-8');
}

function logHasStage(folderName) {
  return readLog().some(e => e.folder === folderName && e.action === 'staged');
}

// ---------------------------------------------------------------------------
// Fuzzy match helper — score against roster slugs
// ---------------------------------------------------------------------------
function fuzzyScore(input, slug) {
  const a = input.toLowerCase().replace(/[^a-z]/g, '');
  const b = slug.replace(/-/g, '');
  if (b.includes(a) || a.includes(b)) return 1;
  let matches = 0;
  for (const ch of a) { if (b.includes(ch)) matches++; }
  return matches / Math.max(a.length, b.length);
}

function fuzzyMatchSlugs(name, slugs, topN = 6) {
  const scored = slugs
    .map(s => ({ slug: s, score: fuzzyScore(name, s) }))
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, topN).map(s => s.slug);
}

// ---------------------------------------------------------------------------
// Roster slugs (same source as other tabs)
// ---------------------------------------------------------------------------
function getRosterSlugs() {
  const soldiersDir = SITE_SOLDIERS;
  if (!fs.existsSync(soldiersDir)) return [];
  return fs.readdirSync(soldiersDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
    .sort();
}

// ---------------------------------------------------------------------------
// Raw folder helpers
// ---------------------------------------------------------------------------
function listRawFolders() {
  if (!fs.existsSync(RAW_PHOTOS)) return [];
  return fs.readdirSync(RAW_PHOTOS, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => {
      const folderPath = path.join(RAW_PHOTOS, d.name);
      const files = fs.readdirSync(folderPath);
      const photos = files.filter(f => /\.(jpg|jpeg|png|tiff|webp)$/i.test(f));
      const notes = files.find(f => /^notes\.(txt|rtf)$/i.test(f)) || null;
      const alreadyStaged = logHasStage(d.name);
      // Parse name and timestamp from folder name e.g. "Marvin Miller-051526-103045"
      const match = d.name.match(/^(.+?)-(\d{6})-(\d{6})$/);
      const displayName = match ? match[1] : d.name;
      const timestamp = match ? `${match[2]}-${match[3]}` : '';
      return {
        folder: d.name,
        displayName,
        timestamp,
        photoCount: photos.length,
        hasNotes: !!notes,
        notesFile: notes,
        alreadyStaged,
        status: alreadyStaged ? 'already-staged' : 'ready'
      };
    })
    .sort((a, b) => a.displayName.localeCompare(b.displayName));
}

function getRawFolderDetail(folderName) {
  const folderPath = path.join(RAW_PHOTOS, folderName);
  if (!fs.existsSync(folderPath)) return null;
  const files = fs.readdirSync(folderPath);
  const photos = files.filter(f => /\.(jpg|jpeg|png|tiff|webp)$/i.test(f));
  const notesFile = files.find(f => /^notes\.(txt|rtf)$/i.test(f)) || null;
  let notesContent = '';
  if (notesFile) {
    try { notesContent = fs.readFileSync(path.join(folderPath, notesFile), 'utf-8'); } catch {}
  }
  // Fuzzy match
  const match = folderName.match(/^(.+?)-(\d{6})-(\d{6})$/);
  const displayName = match ? match[1] : folderName;
  const slugs = getRosterSlugs();
  const suggestions = fuzzyMatchSlugs(displayName, slugs);
  return { folderName, displayName, photos, notesContent, suggestions, allSlugs: slugs };
}

// ---------------------------------------------------------------------------
// Move raw folder to staging
// ---------------------------------------------------------------------------
async function moveToStaging(folderName, soldierSlug, renames = {}) {
  const srcDir = path.join(RAW_PHOTOS, folderName);
  const destDir = path.join(STAGING_PHOTOS, soldierSlug);
  // Block re-staging only if the log says it was staged AND the staging folder
  // still exists. If the folder was reverted (deleted), allow re-staging.
  if (logHasStage(folderName) && fs.existsSync(destDir)) {
    return { ok: false, error: `${folderName} has already been moved to staging.` };
  }
  if (!fs.existsSync(srcDir)) return { ok: false, error: 'Raw folder not found.' };

  await fsp.mkdir(destDir, { recursive: true });

  const files = await fsp.readdir(srcDir);
  for (const file of files) {
    const src = path.join(srcDir, file);
    const isNotes = /^notes\.(txt|rtf)$/i.test(file);
    if (isNotes) {
      // Append to existing notes.txt with separator
      const destNotes = path.join(destDir, 'notes.txt');
      const content = await fsp.readFile(src, 'utf-8');
      const separator = `\n\n--- Submission: ${folderName} ---\n\n`;
      await fsp.appendFile(destNotes, separator + content, 'utf-8');
    } else {
      // Apply rename if one was provided, otherwise keep original name
      const destName = renames[file] || file;
      const dest = path.join(destDir, destName);
      if (!fs.existsSync(dest)) {
        await fsp.copyFile(src, dest);
      }
    }
  }

  appendLog({ folder: folderName, slug: soldierSlug, action: 'staged' });
  return { ok: true, slug: soldierSlug };
}

// ---------------------------------------------------------------------------
// Staging folder helpers
// ---------------------------------------------------------------------------
function listStagingFolders() {
  if (!fs.existsSync(STAGING_PHOTOS)) return [];
  const slugs = getRosterSlugs();
  return fs.readdirSync(STAGING_PHOTOS, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => {
      const folderPath = path.join(STAGING_PHOTOS, d.name);
      const files = fs.readdirSync(folderPath);
      const photos = files.filter(f => /\.(jpg|jpeg|png|tiff|webp)$/i.test(f));
      const isExisting = slugs.includes(d.name);
      return { slug: d.name, photoCount: photos.length, isExisting };
    })
    .sort((a, b) => {
      // Existing profiles first, new soldiers second
      if (a.isExisting !== b.isExisting) return a.isExisting ? -1 : 1;
      return a.slug.localeCompare(b.slug);
    });
}

function getStagingFolderDetail(slug) {
  const folderPath = path.join(STAGING_PHOTOS, slug);
  if (!fs.existsSync(folderPath)) return null;
  const files = fs.readdirSync(folderPath);
  const photos = files.filter(f => /\.(jpg|jpeg|png|tiff|webp)$/i.test(f)).sort();
  const notesFile = path.join(folderPath, 'notes.txt');
  let notesContent = '';
  try { notesContent = fs.readFileSync(notesFile, 'utf-8'); } catch {}
  const slugs = getRosterSlugs();
  const isExisting = slugs.includes(slug);
  return { slug, photos, notesContent, isExisting };
}

// ---------------------------------------------------------------------------
// Known events list (for event destination dropdown)
// ---------------------------------------------------------------------------
function getKnownEvents() {
  const eventsDir = path.join(REPO_ROOT, 'site', 'events');
  if (!fs.existsSync(eventsDir)) return [];
  return fs.readdirSync(eventsDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
    .sort();
}

// ---------------------------------------------------------------------------
// YAML scalar helper — wraps a value in double quotes, escaping any
// embedded backslashes and double quotes so the output is always valid YAML.
// Use for any free-text field that could contain colons or special chars.
// ---------------------------------------------------------------------------
function yamlStr(val) {
  const s = (val || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  return `"${s}"`;
}

// ---------------------------------------------------------------------------
// Flush buffer to disk
// Each entry in buffer: { filename, dest, eventSlug, caption, caption_short,
//   credit, contains, tagged, quality, date, date_known }
// dest: 'field' | 'profile' | 'event'
// ---------------------------------------------------------------------------
async function flushBuffer(slug, buffer) {
  const stagingDir = path.join(STAGING_PHOTOS, slug);

  // Group by destination.
  // Profile entries use subjectSlug override if provided, otherwise fall back to folder slug.
  const byDest = { field: [], profile: {}, event: {} };
  for (const entry of buffer) {
    if (entry.dest === 'profile') {
      const subject = (entry.subjectSlug && entry.subjectSlug.trim()) ? entry.subjectSlug.trim() : slug;
      if (!byDest.profile[subject]) byDest.profile[subject] = [];
      byDest.profile[subject].push(entry);
    } else if (entry.dest === 'event') {
      const es = entry.eventSlug || 'unknown';
      if (!byDest.event[es]) byDest.event[es] = [];
      byDest.event[es].push(entry);
    } else {
      byDest.field.push(entry);
    }
  }

  // ── Phase 1: collect upload jobs ───────────────────────────────────────────
  // Build a flat list of { entry, photosSubdir, effectiveSlug, r2Key, localPath }
  // before touching anything on disk.
  const uploadJobs = [];

  function collectJobs(entries, photosSubdir, targetSlug) {
    const effectiveSlug = targetSlug || slug;
    for (const e of entries) {
      uploadJobs.push({
        entry:         e,
        photosSubdir,
        effectiveSlug,
        r2Key:         `soldiers/${effectiveSlug}/${photosSubdir}/${e.filename}`,
        localPath:     path.join(stagingDir, e.filename),
      });
    }
  }

  collectJobs(byDest.field, 'field', null);
  for (const [subject, entries] of Object.entries(byDest.profile)) {
    collectJobs(entries, 'profile', subject);
  }
  for (const [eventSlug, entries] of Object.entries(byDest.event)) {
    collectJobs(entries, `field/events/${eventSlug}`, null);
  }

  // ── Phase 2: upload all images to R2 ──────────────────────────────────────
  // Atomic rule: if ANY upload fails, return errors immediately.
  // Do NOT write index.md or clear staging.
  const uploadErrors = [];
  const uploaded = [];

  for (const job of uploadJobs) {
    try {
      await uploadToR2(job.localPath, job.r2Key);
      uploaded.push(job.r2Key);
    } catch (err) {
      uploadErrors.push(`R2 upload failed for ${job.entry.filename}: ${err.message}`);
    }
  }

  if (uploadErrors.length) {
    return { moved: [], written: [], errors: uploadErrors, uploaded };
  }

  // ── Phase 3: write index.md files (only reached if all uploads succeeded) ──
  const results = { moved: uploaded, written: [], errors: [] };

  // Group jobs by (effectiveSlug, photosSubdir) for index.md writing.
  const indexGroups = new Map();
  for (const job of uploadJobs) {
    const key = `${job.effectiveSlug}::${job.photosSubdir}`;
    if (!indexGroups.has(key)) {
      indexGroups.set(key, { effectiveSlug: job.effectiveSlug, photosSubdir: job.photosSubdir, entries: [] });
    }
    indexGroups.get(key).entries.push(job.entry);
  }

  for (const { effectiveSlug, photosSubdir, entries } of indexGroups.values()) {
    const destPhotoDir = path.join(SITE_SOLDIERS, effectiveSlug, 'photos', photosSubdir);
    await fsp.mkdir(destPhotoDir, { recursive: true });
    const indexPath = path.join(destPhotoDir, 'index.md');

    const yamlBlocks = [];
    for (const e of entries) {
      const contains = e.contains ? e.contains.split(',').map(s => s.trim()).filter(Boolean) : [];
      const tagged   = e.tagged   ? e.tagged.split(',').map(s => s.trim()).filter(Boolean)   : [];
      const block = [
        `  - filename: ${e.filename}`,
        `    caption: >`,
        `      ${(e.caption || '').replace(/\n/g, '\n      ')}`,
        `    caption_short: ${yamlStr(e.caption_short)}`,
        `    credit: ${yamlStr(e.credit)}`,
        `    photographer: ${yamlStr(e.photographer)}`,
        `    date: ${e.date || ''}`,
        `    date_known: ${e.date_known === true || e.date_known === 'true' ? 'true' : 'false'}`,
        `    event: ${e.eventSlug || '""'}`,
        `    quality: ${e.quality || ''}`,
        contains.length ? `    contains:\n${contains.map(c => `      - ${c}`).join('\n')}` : `    contains: []`,
        tagged.length   ? `    tagged:\n${tagged.map(t => `      - ${t}`).join('\n')}`     : `    tagged: []`,
      ].join('\n');
      yamlBlocks.push(block);
    }

    if (!yamlBlocks.length) continue;

    if (!fs.existsSync(indexPath)) {
      const header = `---\nsoldier: ${effectiveSlug}\nsubfolder: ${photosSubdir}\nphotos:\n`;
      await fsp.writeFile(indexPath, header + yamlBlocks.join('\n') + '\n---\n', 'utf-8');
    } else {
      let existing = await fsp.readFile(indexPath, 'utf-8');
      // Normalize CRLF → LF so the closing-marker check works regardless of
      // whether the file was written on Windows (CRLF) or Unix (LF).
      existing = existing.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
      const closeMarker = '\n---\n';
      if (existing.endsWith(closeMarker)) {
        existing = existing.slice(0, -closeMarker.length);
        existing += '\n' + yamlBlocks.join('\n') + closeMarker;
      } else {
        // No closing marker — file may be front-matter-only (no trailing ---).
        // Ensure we're inserting inside the photos: list, not after stray content.
        existing = existing.trimEnd() + '\n' + yamlBlocks.join('\n') + '\n---\n';
      }
      await fsp.writeFile(indexPath, existing, 'utf-8');
    }
    results.written.push(indexPath);
  }

  // ── Phase 4: clear staging ─────────────────────────────────────────────────
  try {
    await fsp.rm(stagingDir, { recursive: true, force: true });
    appendLog({ slug, action: 'flushed', photoCount: buffer.length });
  } catch (err) {
    results.errors.push(`Staging cleanup failed: ${err.message}`);
  }

  return results;
}

// ---------------------------------------------------------------------------
// Edit — read / write production photo metadata
// ---------------------------------------------------------------------------

/**
 * Parse a photo index.md and return the photos array.
 * Returns [] if file missing, empty, or malformed.
 */
function readIndexMd(indexPath) {
  if (!fs.existsSync(indexPath)) return [];
  const raw = fs.readFileSync(indexPath, 'utf-8');
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return [];
  try {
    const parsed = yaml.load(match[1]);
    return Array.isArray(parsed?.photos) ? parsed.photos : [];
  } catch { return []; }
}

/**
 * List all soldiers who have at least one photo index.md.
 */
function listEditableSoldiers() {
  if (!fs.existsSync(SITE_SOLDIERS)) return [];
  const result = [];
  for (const entry of fs.readdirSync(SITE_SOLDIERS, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const slug      = entry.name;
    const photosRoot = path.join(SITE_SOLDIERS, slug, 'photos');
    if (!fs.existsSync(photosRoot)) continue;

    let count = 0;
    count += readIndexMd(path.join(photosRoot, 'profile', 'index.md')).length;
    count += readIndexMd(path.join(photosRoot, 'field', 'index.md')).length;
    const eventsDir = path.join(photosRoot, 'field', 'events');
    if (fs.existsSync(eventsDir)) {
      for (const ev of fs.readdirSync(eventsDir, { withFileTypes: true })) {
        if (ev.isDirectory()) {
          count += readIndexMd(path.join(eventsDir, ev.name, 'index.md')).length;
        }
      }
    }
    if (count > 0) result.push({ slug, photoCount: count });
  }
  return result.sort((a, b) => a.slug.localeCompare(b.slug));
}

/**
 * Return all photos for a soldier flattened with subfolder metadata.
 * Each entry includes all photo fields plus `subfolder`.
 */
function getSoldierPhotosForEdit(slug) {
  const photosRoot = path.join(SITE_SOLDIERS, slug, 'photos');
  if (!fs.existsSync(photosRoot)) return [];
  const result = [];

  function loadSubfolder(subfolder, indexPath) {
    for (const p of readIndexMd(indexPath)) {
      result.push({ ...p, subfolder });
    }
  }

  loadSubfolder('profile', path.join(photosRoot, 'profile', 'index.md'));
  loadSubfolder('field',   path.join(photosRoot, 'field',   'index.md'));
  const eventsDir = path.join(photosRoot, 'field', 'events');
  if (fs.existsSync(eventsDir)) {
    for (const ev of fs.readdirSync(eventsDir, { withFileTypes: true })) {
      if (ev.isDirectory()) {
        loadSubfolder(`field/events/${ev.name}`,
          path.join(eventsDir, ev.name, 'index.md'));
      }
    }
  }
  return result;
}

/**
 * Write updated photo entries back to their index.md files.
 * `updates` is a flat array of photo objects, each with a `subfolder` field.
 * Each index.md is fully rewritten from the updated entries for that subfolder.
 */
async function updateSoldierPhotos(slug, updates) {
  const photosRoot = path.join(SITE_SOLDIERS, slug, 'photos');

  // Group by subfolder
  const bySubfolder = {};
  for (const photo of updates) {
    const sf = photo.subfolder;
    if (!bySubfolder[sf]) bySubfolder[sf] = [];
    bySubfolder[sf].push(photo);
  }

  const written = [];
  for (const [subfolder, photos] of Object.entries(bySubfolder)) {
    let indexPath;
    if      (subfolder === 'profile')                      indexPath = path.join(photosRoot, 'profile', 'index.md');
    else if (subfolder === 'field')                        indexPath = path.join(photosRoot, 'field',   'index.md');
    else if (subfolder.startsWith('field/events/')) {
      const eventSlug = subfolder.slice('field/events/'.length);
      indexPath = path.join(photosRoot, 'field', 'events', eventSlug, 'index.md');
    } else {
      continue; // unrecognised subfolder — skip
    }

    const yamlBlocks = photos.map(p => {
      const contains = Array.isArray(p.contains) ? p.contains
        : (p.contains ? String(p.contains).split(',').map(s => s.trim()).filter(Boolean) : []);
      const tagged = Array.isArray(p.tagged) ? p.tagged
        : (p.tagged ? String(p.tagged).split(',').map(s => s.trim()).filter(Boolean) : []);
      return [
        `  - filename: ${p.filename}`,
        `    caption: >`,
        `      ${(p.caption || '').replace(/\r?\n/g, '\n      ')}`,
        `    caption_short: ${yamlStr(p.caption_short)}`,
        `    credit: ${yamlStr(p.credit)}`,
        `    photographer: ${yamlStr(p.photographer)}`,
        `    date: ${p.date || ''}`,
        `    date_known: ${p.date_known === true || p.date_known === 'true' ? 'true' : 'false'}`,
        `    event: ${p.event ? yamlStr(p.event) : '""'}`,
        `    quality: ${p.quality || ''}`,
        contains.length ? `    contains:\n${contains.map(c => `      - ${c}`).join('\n')}` : `    contains: []`,
        tagged.length   ? `    tagged:\n${tagged.map(t => `      - ${t}`).join('\n')}`     : `    tagged: []`,
      ].join('\n');
    });

    await fsp.mkdir(path.dirname(indexPath), { recursive: true });
    const header = `---\nsoldier: ${slug}\nsubfolder: ${subfolder}\nphotos:\n`;
    await fsp.writeFile(indexPath, header + yamlBlocks.join('\n') + '\n---\n', 'utf-8');
    written.push(indexPath);
  }
  return written;
}

// ---------------------------------------------------------------------------
// Register all routes
// ---------------------------------------------------------------------------
export function registerPhotosRoutes(app) {

  // POST /api/photos/raw/upload
  // Multipart: files[] (image files), folderName (optional label, e.g. donor name)
  // Creates _intake/raw/photos/[folderName]-[MMDDYY]-[HHMMSS]/ and writes files there.
  // Returns { ok: true, folder, count }
  const photoUploadStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      // folderName is sent as a form field before files; multer processes fields in order
      const label = (req.body.folderName || 'upload').replace(/[^a-zA-Z0-9 _-]/g, '').trim() || 'upload';
      const now   = new Date();
      const pad   = n => String(n).padStart(2, '0');
      const ts    = `${pad(now.getMonth()+1)}${pad(now.getDate())}${String(now.getFullYear()).slice(-2)}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
      const folderPath = path.join(RAW_PHOTOS, `${label}-${ts}`);
      req._uploadFolder = folderPath;
      fs.mkdirSync(folderPath, { recursive: true });
      cb(null, folderPath);
    },
    filename: (req, file, cb) => cb(null, file.originalname),
  });

  const photoUpload = multer({
    storage: photoUploadStorage,
    fileFilter: (req, file, cb) => {
      cb(null, /\.(jpg|jpeg|png|tiff|tif|webp)$/i.test(file.originalname));
    },
  });

  app.post('/api/photos/raw/upload', photoUpload.array('files'), (req, res) => {
    try {
      const folder = req._uploadFolder
        ? path.basename(req._uploadFolder)
        : null;
      res.json({ ok: true, folder, count: req.files?.length ?? 0 });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET /api/photos/raw/:folder/image/:filename — serve a raw photo file
  app.get('/api/photos/raw/:folder/image/:filename', (req, res) => {
    try {
      const { folder, filename } = req.params;
      const filePath = path.join(RAW_PHOTOS, folder, filename);
      if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File not found' });
      res.sendFile(filePath);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // POST /api/photos/raw/crop — crop a raw photo in place
  // Body: { folder, filename, x, y, w, h } — all as 0..1 fractions of image dimensions
  app.post('/api/photos/raw/crop', async (req, res) => {
    try {
      const { folder, filename, x, y, w, h } = req.body;
      if (!folder || !filename || x == null || y == null || w == null || h == null) {
        return res.status(400).json({ error: 'folder, filename, x, y, w, h required' });
      }
      const filePath = path.join(RAW_PHOTOS, folder, filename);
      if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File not found' });

      // Use sharp (Node.js) to crop — no Python dependency.
      // Read into a buffer first so sharp never holds the file open on Windows,
      // which would cause UNKNOWN error when we try to overwrite the same path.
      const { default: sharp } = await import('sharp');
      const inputBuf = fs.readFileSync(filePath);
      const meta = await sharp(inputBuf).metadata();
      const left   = Math.round(x * meta.width);
      const top    = Math.round(y * meta.height);
      const width  = Math.round(w * meta.width);
      const height = Math.round(h * meta.height);
      const buf = await sharp(inputBuf)
        .extract({ left, top, width, height })
        .jpeg({ quality: 92 })
        .toBuffer();
      fs.writeFileSync(filePath, buf);
      res.json({ ok: true });
    } catch (err) {
      console.error('[crop error]', err);
      res.status(500).json({ error: err.message });
    }
  });

  // GET /api/photos/staging/:slug/image/:filename — serve a staging photo file
  app.get('/api/photos/staging/:slug/image/:filename', (req, res) => {
    try {
      const { slug, filename } = req.params;
      const filePath = path.join(STAGING_PHOTOS, slug, filename);
      if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File not found' });
      res.sendFile(filePath);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET /api/photos/raw — list raw folders with counts
  app.get('/api/photos/raw', (req, res) => {
    try {
      res.json({ folders: listRawFolders() });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET /api/photos/raw/:folder — detail + fuzzy match suggestions
  app.get('/api/photos/raw/:folder', (req, res) => {
    try {
      const detail = getRawFolderDetail(req.params.folder);
      if (!detail) return res.status(404).json({ error: 'Folder not found' });
      res.json(detail);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // POST /api/photos/raw/stage — move raw folder to staging
  // Body: { folder, slug, renames? }
  // renames: { [originalFilename]: newFilename } — optional, applied during copy
  app.post('/api/photos/raw/stage', async (req, res) => {
    try {
      const { folder, slug, renames } = req.body;
      if (!folder || !slug) return res.status(400).json({ error: 'folder and slug required' });
      const result = await moveToStaging(folder, slug, renames || {});
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET /api/photos/staging — list staging folders
  app.get('/api/photos/staging', (req, res) => {
    try {
      res.json({ folders: listStagingFolders() });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET /api/photos/staging/:slug — detail for one staging folder
  app.get('/api/photos/staging/:slug', (req, res) => {
    try {
      const detail = getStagingFolderDetail(req.params.slug);
      if (!detail) return res.status(404).json({ error: 'Staging folder not found' });
      res.json(detail);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // DELETE /api/photos/staging/:slug — revert (delete) a staging folder
  // The raw folder is untouched; the caller can re-stage it at any time.
  app.delete('/api/photos/staging/:slug', async (req, res) => {
    try {
      const { slug } = req.params;
      if (!slug) return res.status(400).json({ error: 'slug required' });
      const folderPath = path.join(STAGING_PHOTOS, slug);
      if (!fs.existsSync(folderPath)) return res.status(404).json({ error: 'Staging folder not found' });
      await fsp.rm(folderPath, { recursive: true, force: true });
      appendLog({ slug, action: 'reverted' });
      res.json({ ok: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET /api/photos/events — known event slugs for dropdown
  app.get('/api/photos/events', (req, res) => {
    try {
      res.json({ events: getKnownEvents() });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // POST /api/photos/flush — flush buffer to site/ and clean staging
  // Body: { slug, buffer: [...] }
  app.post('/api/photos/flush', async (req, res) => {
    try {
      const { slug, buffer } = req.body;
      if (!slug || !Array.isArray(buffer)) {
        return res.status(400).json({ error: 'slug and buffer array required' });
      }
      const result = await flushBuffer(slug, buffer);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET /api/photos/log — read intake log (for UI display)
  app.get('/api/photos/log', (req, res) => {
    try {
      res.json({ entries: readLog() });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET /api/photos/counts — raw + staging counts for tab bubbles
  app.get('/api/photos/counts', (req, res) => {
    try {
      const raw = fs.existsSync(RAW_PHOTOS)
        ? fs.readdirSync(RAW_PHOTOS, { withFileTypes: true }).filter(d => d.isDirectory()).length
        : 0;
      const staging = fs.existsSync(STAGING_PHOTOS)
        ? fs.readdirSync(STAGING_PHOTOS, { withFileTypes: true }).filter(d => d.isDirectory()).length
        : 0;
      res.json({ raw, staging, total: raw + staging });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // ── Edit routes ─────────────────────────────────────────────────────────────

  // GET /api/photos/edit/soldiers — list all soldiers with at least one photo index.md
  app.get('/api/photos/edit/soldiers', (req, res) => {
    try {
      res.json({ soldiers: listEditableSoldiers() });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET /api/photos/edit/:slug — all photos for a soldier (flattened, with subfolder)
  app.get('/api/photos/edit/:slug', (req, res) => {
    try {
      const photos     = getSoldierPhotosForEdit(req.params.slug);
      const rosterSlugs = getRosterSlugs();
      res.json({ photos, rosterSlugs });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // PATCH /api/photos/edit/:slug — write updated photos back to index.md files
  // Body: { updates: [...photo objects, each with subfolder field] }
  app.patch('/api/photos/edit/:slug', async (req, res) => {
    try {
      const { updates } = req.body;
      if (!Array.isArray(updates)) return res.status(400).json({ error: 'updates array required' });
      const written = await updateSoldierPhotos(req.params.slug, updates);
      res.json({ ok: true, written });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // GET /api/photos/edit/:slug/image — serve a production photo for preview
  // Query: ?subfolder=field&filename=photo.jpg
  // Tries disk first (site/soldiers/); redirects to live R2 URL if not on disk.
  app.get('/api/photos/edit/:slug/image', (req, res) => {
    try {
      const { slug }             = req.params;
      const { subfolder, filename } = req.query;
      if (!subfolder || !filename) return res.status(400).json({ error: 'subfolder and filename required' });
      const filePath = path.join(SITE_SOLDIERS, slug, 'photos', subfolder, filename);
      if (fs.existsSync(filePath)) return res.sendFile(filePath);
      // Not on disk — redirect to live R2 URL
      res.redirect(`https://angryskipperarchive.org/media/photos/soldiers/${slug}/${subfolder}/${filename}`);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
}
