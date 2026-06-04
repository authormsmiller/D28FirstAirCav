// admin/lib/soldiers.js
// Standalone soldier stub creation — importable from any tab or workflow.
// Exports: buildSoldierStub(slug, fm) → markdown string
// Registers: POST /api/soldiers/create
//            GET  /api/soldiers/check?slugs=slug1,slug2,...

import fs from 'fs';
import path from 'path';

const SITE_SOLDIERS  = path.resolve('..', 'site', 'soldiers');
const SITE_ANECDOTES = path.resolve('..', 'site', 'anecdotes');
const SITE_DOCUMENTS = path.resolve('..', 'site', 'documents');

// ---------------------------------------------------------------------------
// buildSoldierStub(slug, fm)
// Produces the full canonical soldier stub matching the established template.
// name is split on the last space: "Wolf Kutter" → first=Wolf, last=Kutter.
// Middle names/particles stay in first_name: "Marvin Dale" → first=Marvin Dale, last=Miller.
// ---------------------------------------------------------------------------
export function buildSoldierStub(slug, fm) {
  // Support either a pre-split first/last or a single name string.
  const firstName = fm.first_name || (fm.name ? fm.name.trim().split(/\s+/).slice(0, -1).join(' ') : '');
  const lastName  = fm.last_name  || (fm.name ? fm.name.trim().split(/\s+/).slice(-1)[0] : '');
  const fullName  = [firstName, lastName].filter(Boolean).join(' ');
  const rank      = fm.rank   || '';
  const title     = rank ? `${rank} ${fullName}` : fullName;
  const status    = fm.status || 'researching';
  const today     = new Date().toISOString().slice(0, 10);

  return [
    '---',
    'layout: layouts/soldier.njk',
    `title: ${title}`,
    `slug: ${slug}`,
    `breadcrumb: ${fullName}`,
    `permalink: /soldiers/${slug}/`,
    'tags:',
    '  - soldier',
    '',
    '# ── IDENTITY ──────────────────────────────────────',
    `first_name: ${firstName}`,
    `last_name: ${lastName}`,
    `middle_name: ${fm.middle_name || ''}`,
    `suffix: ${fm.suffix || ''}`,
    `nickname: ${fm.nickname || ''}`,
    `birth_year: ${fm.birth_year || ''}`,
    '',
    '# ── RANK & ASSIGNMENT ─────────────────────────────',
    `rank: ${rank}`,
    `mos: ${fm.mos || ''}`,
    `platoon: ${fm.platoon || ''}`,
    '',
    '# ── SERVICE ───────────────────────────────────────',
    `arrived: ${fm.arrived || ''}`,
    `departed: ${fm.departed || ''}`,
    `character_of_service: ${fm.character_of_service || 'Honorable'}`,
    `status: ${status}`,
    '',
    '# ── POST-SERVICE ──────────────────────────────────',
    `hometown: ${fm.hometown || ''}`,
    `current_location: ${fm.current_location || ''}`,
    `year_deceased: ${fm.year_deceased || ''}`,
    `cause_of_death: ${fm.cause_of_death || ''}`,
    '',
    '# ── PROFILE PHOTO ─────────────────────────────────',
    'profile_photo:',
    '',
    '# ── DECORATIONS ───────────────────────────────────',
    'decorations:',
    '',
    'distinguished_decorations:',
    '',
    'decorations_unconfirmed:',
    '',
    '# ── SERVICE RECORD ────────────────────────────────',
    'service_record:',
    '  induction:',
    '    status:',
    '    location:',
    '    date:',
    '  assignments:',
    '',
    '# ── CONTACT ───────────────────────────────────────',
    `share_contact: ${fm.share_contact || 'false'}`,
    'contact:',
    `  name: ${fm.contact_name || ''}`,
    `  relation: ${fm.contact_relation || ''}`,
    '  last_verified:',
    '',
    '# ── EXTERNAL LINKS ────────────────────────────────',
    'links:',
    '  wall:',
    '  other:',
    '',
    '# ── TIMELINE SOURCE NOTE ──────────────────────────',
    'timeline_source: >',
    `  Service timeline not yet compiled. If you served with or knew ${fullName}, please use the contribute form to share what you remember.`,
    '',
    '# ── SERVICE TIMELINE ──────────────────────────────',
    'timeline:',
    '',
    '# ── PHOTOS ────────────────────────────────────────',
    'photo_intro: >',
    '  Photographs pending.',
    '',
    'wartime_content_notice: false',
    '',
    'photos:',
    '',
    '# ── DOCUMENTS ─────────────────────────────────────',
    'documents:',
    '',
    '# ── RELATED ───────────────────────────────────────',
    'brothers:',
    '',
    'related_events:',
    '',
    '# ── ADMIN ─────────────────────────────────────────',
    `date_added: ${today}`,
    'last_updated:',
    `contributed_by: ${fm.contributed_by || ''}`,
    'notes:',
    '',
    '---',
    '',
  ].join('\n');
}

// ---------------------------------------------------------------------------
// soldierExists(slug) → boolean
// ---------------------------------------------------------------------------
function soldierExists(slug) {
  return fs.existsSync(path.join(SITE_SOLDIERS, slug));
}

// ---------------------------------------------------------------------------
// registerSoldiersRoutes(app)
// Call from server.js after importing this module.
// ---------------------------------------------------------------------------
export function registerSoldiersRoutes(app) {

  // GET /api/soldiers/check?slugs=bacon-wg,neal-bill,...
  // Returns { missing: [...], present: [...] }
  app.get('/api/soldiers/check', (req, res) => {
    const raw = req.query.slugs || '';
    if (!raw.trim()) return res.json({ missing: [], present: [] });
    const slugs   = raw.split(',').map(s => s.trim()).filter(Boolean);
    const missing = slugs.filter(s => !soldierExists(s));
    const present = slugs.filter(s =>  soldierExists(s));
    res.json({ missing, present });
  });

  // POST /api/soldiers/create
  // Body: { slug, name?, rank?, status?, platoon?, mos?, hometown? }
  // Creates site/soldiers/[slug]/[slug].md and photo stub dirs.
  // Returns { ok: true, path } or { ok: false, error, alreadyExists? }
  app.post('/api/soldiers/create', (req, res) => {
    if (!req.body) req.body = {};
    const { slug, ...fm } = req.body;

    if (!slug || typeof slug !== 'string' || !/^[a-z0-9-]+$/.test(slug)) {
      return res.status(400).json({ ok: false, error: 'Invalid or missing slug.' });
    }

    if (soldierExists(slug)) {
      return res.status(409).json({ ok: false, alreadyExists: true,
        error: `Soldier "${slug}" already exists.` });
    }

    try {
      const soldierDir  = path.join(SITE_SOLDIERS,  slug);
      const anecdoteDir = path.join(SITE_ANECDOTES, slug);
      const documentDir = path.join(SITE_DOCUMENTS, slug);

      // soldiers/[slug]/photos/profile + field
      fs.mkdirSync(path.join(soldierDir, 'photos', 'profile'), { recursive: true });
      fs.mkdirSync(path.join(soldierDir, 'photos', 'field'),   { recursive: true });
      fs.writeFileSync(path.join(soldierDir, 'photos', 'profile', '.gitkeep'), '');
      fs.writeFileSync(path.join(soldierDir, 'photos', 'field',   '.gitkeep'), '');

      // anecdotes/[slug]/
      fs.mkdirSync(anecdoteDir, { recursive: true });
      fs.writeFileSync(path.join(anecdoteDir, '.gitkeep'), '');

      // documents/[slug]/
      fs.mkdirSync(documentDir, { recursive: true });
      fs.writeFileSync(path.join(documentDir, '.gitkeep'), '');

      const filePath = path.join(soldierDir, `${slug}.md`);
      fs.writeFileSync(filePath, buildSoldierStub(slug, fm), 'utf8');

      res.json({ ok: true, path: filePath.replace(/\\/g, '/') });
    } catch (err) {
      res.status(500).json({ ok: false, error: err.message });
    }
  });
}