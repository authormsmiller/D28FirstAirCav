/**
 * cross-reference-engine.cjs
 *
 * Deterministic half of Phase 3/4 (see
 * site/_docs/orll-digest-and-cross-reference-spec.md, "The engine: how the
 * digest feeds the foundations" + Step 3 "Cross-reference passes").
 *
 * Takes ONE digest.json (built by hand or by a future digest-extraction pass)
 * and computes the parts of the Step-3 candidate list that are pure joins
 * against the two foundations (kia.json, locations.json/lz-vocabulary.json) --
 * date+battalion matching, casualty-count reconciliation, and gazetteer
 * name resolution. It does NOT do the judgment-heavy passes (operations,
 * personnel, awards, contact-event proposals, narrative interpretation) --
 * those still need a human/Claude reading the digest with the site's
 * existing content in view. This script exists so that work isn't redone
 * by hand every time: it produces a candidates JSON + a draft review-table
 * markdown that the judgment passes are then written on top of.
 *
 * Guardrail: this script only ever WRITES two new files next to the input
 * digest (<slug>.candidates.json, <slug>.review.draft.md). It never touches
 * kia.json, locations.json, lz-vocabulary.json, or any site/events|soldiers
 * page. "Candidates, not writes" applies here exactly as it does to the
 * skill that calls this script.
 *
 * Usage (from repo root):
 *   node scripts/cross-reference-engine.cjs --digest <path-to-digest.json> \
 *     [--kia site/_data/kia.json] [--locations site/_data/locations.json] \
 *     [--vocab sources/fsb-locations/lz-vocabulary.json] [--near-days 7]
 *
 * Validated against both existing golden examples:
 *   site/sources/orll/1969/AD0506273.digest.json   (division ORLL)
 *   site/sources/dj/1968/skipper-journal-jun-jul-1968.digest.json (daily journal)
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

// ---------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------

function parseArgs(argv) {
  const out = { nearDays: 7 };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--digest') out.digest = argv[++i];
    else if (a === '--kia') out.kia = argv[++i];
    else if (a === '--locations') out.locations = argv[++i];
    else if (a === '--vocab') out.vocab = argv[++i];
    else if (a === '--near-days') out.nearDays = parseInt(argv[++i], 10);
    else if (a === '--out-prefix') out.outPrefix = argv[++i];
  }
  return out;
}

const args = parseArgs(process.argv.slice(2));

if (!args.digest) {
  console.error('Usage: node scripts/cross-reference-engine.cjs --digest <path-to-digest.json> [--kia ...] [--locations ...] [--vocab ...] [--near-days N]');
  process.exit(1);
}

const DIGEST_PATH = path.resolve(ROOT, args.digest);
const KIA_PATH = path.resolve(ROOT, args.kia || 'site/_data/kia.json');
const LOCATIONS_PATH = path.resolve(ROOT, args.locations || 'site/_data/locations.json');
const VOCAB_PATH = path.resolve(ROOT, args.vocab || 'sources/fsb-locations/lz-vocabulary.json');
const NEAR_DAYS = args.nearDays;

const BT = String.fromCharCode(96);
function code(s) { return BT + s + BT; }

// ---------------------------------------------------------------------
// Load inputs
// ---------------------------------------------------------------------

function readJson(p, label) {
  if (!fs.existsSync(p)) {
    console.error('Missing ' + label + ': ' + p);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

const digest = readJson(DIGEST_PATH, 'digest');
const kiaRows = readJson(KIA_PATH, 'kia.json');
const locationsData = fs.existsSync(LOCATIONS_PATH) ? readJson(LOCATIONS_PATH, 'locations.json') : { sites: [] };
const vocabData = fs.existsSync(VOCAB_PATH) ? readJson(VOCAB_PATH, 'lz-vocabulary.json') : { sites: {} };

// The two golden examples put document metadata under different keys
// (ORLL: digest.document; DJ: digest.document too, but with different
// sub-fields) -- normalize what we need.
const documentMeta = digest.document || {};
const accessionOrSlug = documentMeta.accession || documentMeta.title || path.basename(DIGEST_PATH).replace(/\.digest\.json$/, '');
const periodStart = documentMeta.period_start || (digest.coverage && digest.coverage.date_range && digest.coverage.date_range[0]) || null;
const periodEnd = documentMeta.period_end || (digest.coverage && digest.coverage.date_range && digest.coverage.date_range[1]) || null;

const events = Array.isArray(digest.events) ? digest.events : [];

// ---------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------

const BATTALION_RE = /2[\s\-\/]?8\b/; // matches "2-8", "2/8", "2 8", in "2-8 Cav", "C/2-8 Cav", "D/2-8", "1D/2-8" etc.

function unitList(event) {
  if (Array.isArray(event.units)) return event.units;
  if (typeof event.unit === 'string') return [event.unit];
  const out = [];
  if (event.battalion) out.push(event.battalion);
  return out;
}

function eventBattalionMatch(event) {
  return unitList(event).some((u) => BATTALION_RE.test(u));
}

function parseDate(d) {
  if (!d || typeof d !== 'string') return null;
  const m = d.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  if (m[2] === '00' || m[3] === '00') return null; // unknown month/day -- can't place on a timeline
  return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
}

function daysBetween(aStr, bStr) {
  const a = parseDate(aStr);
  const b = parseDate(bStr);
  if (!a || !b) return null;
  return Math.round((a - b) / 86400000);
}

function inDocumentRange(dateStr) {
  if (!periodStart || !periodEnd) return true; // can't bound it -- don't silently drop
  const d = parseDate(dateStr);
  const s = parseDate(periodStart);
  const e = parseDate(periodEnd);
  if (!d || !s || !e) return true;
  return d >= s && d <= e;
}

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const PREFIX_RE = /^(LZ|FB|FSB|FSA|PS|OP|AP)\s+(.+)$/i;

function splitPrefix(raw) {
  const cleaned = raw.replace(/\s+/g, ' ').trim();
  const m = cleaned.match(PREFIX_RE);
  if (m) return { prefix: m[1].toUpperCase(), base: m[2].trim() };
  return { prefix: null, base: cleaned };
}

// Build a flat lookup table from both foundations: name/alias (lowercased) -> candidate site records.
function buildSiteIndex() {
  const index = new Map(); // key: lowercased base name (no prefix) -> [{source, slug, prefix, display, confirmed_examples}]

  function add(key, rec) {
    const k = key.toLowerCase().trim();
    if (!k) return;
    if (!index.has(k)) index.set(k, []);
    index.get(k).push(rec);
  }

  for (const site of locationsData.sites || []) {
    add(site.canonical_name, { source: 'locations.json', slug: site.slug, prefix: site.primary_prefix, display: site.display_name });
    for (const alias of site.aliases || []) {
      add(alias, { source: 'locations.json', slug: site.slug, prefix: site.primary_prefix, display: site.display_name });
    }
  }

  const vocabSites = vocabData.sites || {};
  for (const slug of Object.keys(vocabSites)) {
    const site = vocabSites[slug];
    const base = splitPrefix(site.canonical || slug).base;
    add(base, { source: 'lz-vocabulary.json', slug, prefix: (site.prefixes || [])[0] || null, display: site.canonical });
    for (const alias of site.aliases || []) {
      add(alias, { source: 'lz-vocabulary.json', slug, prefix: (site.prefixes || [])[0] || null, display: site.canonical });
    }
  }

  return index;
}

const SITE_INDEX = buildSiteIndex();

function resolveSite(rawName) {
  if (!rawName) return null;
  const { prefix, base } = splitPrefix(rawName);
  const matches = SITE_INDEX.get(base.toLowerCase().trim());
  if (!matches || matches.length === 0) return null;
  if (!prefix) return matches[0];
  const prefMatch = matches.find((m) => m.prefix && m.prefix.toUpperCase() === prefix.toUpperCase());
  return prefMatch || matches[0];
}

// ---------------------------------------------------------------------
// Pass A -- KIA in range (date + battalion match against kia.json)
// ---------------------------------------------------------------------

const kiaInRange = [];
let skippedUnknownDate = 0;

for (const row of kiaRows) {
  if (!row.date_known || !parseDate(row.dod)) {
    skippedUnknownDate++;
    continue;
  }
  if (!inDocumentRange(row.dod)) continue;

  const exactEvents = events.filter((e) => e.date === row.dod);
  const exactBattalion = exactEvents.filter(eventBattalionMatch);

  const nearEvents = events
    .map((e) => ({ event: e, offset: daysBetween(e.date, row.dod) }))
    .filter((x) => x.offset !== null && x.offset !== 0 && Math.abs(x.offset) <= NEAR_DAYS)
    .sort((a, b) => Math.abs(a.offset) - Math.abs(b.offset));
  // Near-date matching is only meaningful against a SINGLE-casualty event (the
  // three-date/one-man reconciliation model from the Session 96 addendum).
  // An aggregate multi-KIA event (e.g. a 10-KIA base-attack tally) isn't a
  // plausible "same man, different recorded date" match for an unrelated
  // single roster row -- that produces noise on quarter-shaped ORLLs, not signal.
  const nearBattalion = nearEvents.filter((x) => eventBattalionMatch(x.event) && x.event.us_kia === 1);

  let grade;
  if (exactBattalion.length) grade = 'candidate_exact_date_battalion_match';
  else if (exactEvents.length) grade = 'exact_date_other_unit';
  else if (nearBattalion.length) grade = 'candidate_near_date_battalion_match';
  else grade = 'in_range_no_matching_event';

  kiaInRange.push({
    slug: row.slug,
    name: [row.rank, row.first_name, row.middle_name, row.last_name, row.suffix].filter(Boolean).join(' '),
    dod: row.dod,
    unit: row.unit,
    grade,
    exact_events: exactEvents.map((e) => ({ n: e.n, date: e.date, units: unitList(e), us_kia: e.us_kia, installation: e.installation || null })),
    exact_events_other_unit: grade === 'exact_date_other_unit' ? exactEvents.map((e) => unitList(e)) : undefined,
    near_events_battalion: nearBattalion.map((x) => ({ n: x.event.n, date: x.event.date, offset_days: x.offset, units: unitList(x.event), us_kia: x.event.us_kia })),
  });
}

// ---------------------------------------------------------------------
// Pass B -- Casualty reconciliation (event tallies vs roster count on that date)
// ---------------------------------------------------------------------

const casualtyReconciliation = [];

for (const event of events) {
  const usKia = typeof event.us_kia === 'number' ? event.us_kia : null;
  if (usKia === null || usKia <= 0) continue;
  if (!eventBattalionMatch(event)) continue; // only reconcile events that actually name a 2/8 sub-unit

  const exactRoster = kiaRows.filter((r) => r.date_known && r.dod === event.date);
  const nearRoster = kiaRows
    .filter((r) => r.date_known && r.dod !== event.date)
    .map((r) => ({ row: r, offset: daysBetween(r.dod, event.date) }))
    .filter((x) => x.offset !== null && Math.abs(x.offset) <= NEAR_DAYS)
    .sort((a, b) => Math.abs(a.offset) - Math.abs(b.offset));

  if (exactRoster.length === usKia) continue; // reconciles cleanly, nothing to flag

  casualtyReconciliation.push({
    event_n: event.n !== undefined ? event.n : null,
    date: event.date,
    installation: event.installation || null,
    units: unitList(event),
    event_us_kia: usKia,
    roster_exact_date_count: exactRoster.length,
    roster_exact_date_slugs: exactRoster.map((r) => r.slug),
    roster_near_date_candidates: nearRoster.map((x) => ({ slug: x.row.slug, dod: x.row.dod, offset_days: x.offset })),
    open_question: 'Event reports ' + usKia + ' US KIA on ' + event.date + ' (' + unitList(event).join(', ') + '); roster shows ' + exactRoster.length + ' on that exact date' + (nearRoster.length ? ', with ' + nearRoster.length + ' roster death(s) within ' + NEAR_DAYS + ' days to check for the three-date (action / journal-or-report-logged / Wall-of-record) offset' : ', and none within ' + NEAR_DAYS + ' days') + '. Do not silently reconcile -- record as open_question.',
  });
}

// ---------------------------------------------------------------------
// Pass C -- Locations (resolve raw site mentions to the gazetteer)
// ---------------------------------------------------------------------

// Dedupe raw site mentions case-insensitively (the same site is often printed
// in ALL CAPS in coverage/summary pages and mixed case in per-event fields --
// e.g. "LZ CAROLYN" vs "LZ Carolyn"). Keep one display form per key and merge
// every event whose installation matches under any casing.
const rawNameGroups = new Map(); // lowercased-trimmed -> { display, variants: Set }

function addRawName(n) {
  if (!n) return;
  const key = n.replace(/\s+/g, ' ').trim().toLowerCase();
  if (!key) return;
  if (!rawNameGroups.has(key)) rawNameGroups.set(key, { display: n, variants: new Set() });
  const g = rawNameGroups.get(key);
  g.variants.add(n);
  // Prefer a mixed-case display form ("LZ Carolyn") over all-caps ("LZ CAROLYN")
  // when both are seen, since mixed case is how per-event fields tend to print it.
  if (/[a-z]/.test(n) && !/[a-z]/.test(g.display)) g.display = n;
}

const cov = digest.coverage || {};
for (const n of cov.installations_raw || []) addRawName(n);
for (const n of cov.lz_names || []) addRawName(n);
for (const e of events) {
  if (e.installation) addRawName(e.installation);
}

const opBaseNamesLower = new Set();
for (const op of digest.operations || []) {
  for (const b of op.bases || []) opBaseNamesLower.add(b.replace(/\s+/g, ' ').trim().toLowerCase());
}

const locationCandidates = [];

for (const [key, group] of rawNameGroups) {
  const raw = group.display;
  const resolved = resolveSite(raw);
  const tiedEvents = events.filter((e) => e.installation && e.installation.replace(/\s+/g, ' ').trim().toLowerCase() === key);
  const battalionTied = tiedEvents.some(eventBattalionMatch);
  const brigadeTied = !battalionTied && opBaseNamesLower.has(key);

  if (resolved) {
    locationCandidates.push({
      raw_name: raw,
      resolved_slug: resolved.slug,
      resolved_display: resolved.display,
      source: resolved.source,
      confidence: battalionTied ? 'confirmed' : (brigadeTied ? 'inferred' : 'confirmed_no_tied_2-8_event'),
      tied_events: tiedEvents.map((e) => ({ n: e.n, date: e.date, units: unitList(e) })),
      action: battalionTied
        ? 'Enrich occupancy: attach this document as source + tied event(s).'
        : (brigadeTied
          ? 'Occupancy candidate (inferred -- 1st Bde AO names this base but not a 2/8 sub-unit directly); coords already known from gazetteer.'
          : 'Already in gazetteer but no 2/8-specific tie in this document -- division-context only, low priority.'),
    });
  } else {
    locationCandidates.push({
      raw_name: raw,
      resolved_slug: null,
      confidence: brigadeTied ? 'inferred_unresolved' : 'unresolved',
      tied_events: tiedEvents.map((e) => ({ n: e.n, date: e.date, units: unitList(e), grid: e.grid || null })),
      action: brigadeTied
        ? 'New-site candidate -- 2/8 in the brigade AO that bases here (inferred); coordinates TBD.'
        : 'New-site candidate -- not found in locations.json or lz-vocabulary.json. Coordinates TBD unless a grid is present on a tied event.',
    });
  }
}

// ---------------------------------------------------------------------
// Assemble candidates JSON
// ---------------------------------------------------------------------

const candidates = {
  _meta: {
    artifact: 'cross-reference-candidates',
    generated_by: 'scripts/cross-reference-engine.cjs',
    from_digest: path.relative(ROOT, DIGEST_PATH),
    document: accessionOrSlug,
    period: [periodStart, periodEnd],
    near_days_window: NEAR_DAYS,
    kia_rows_skipped_unknown_date: skippedUnknownDate,
    note: 'Deterministic joins only (date+battalion match, casualty count diff, gazetteer name resolution). Operations / personnel / awards / contact-event proposals and all narrative interpretation still require a human/Claude pass -- see the source-digest skill Step 3-5.',
  },
  kia_in_range: kiaInRange,
  casualty_reconciliation: casualtyReconciliation,
  locations: locationCandidates,
};

const outPrefix = args.outPrefix || DIGEST_PATH.replace(/\.digest\.json$/, '');
const candidatesPath = outPrefix + '.candidates.json';
fs.writeFileSync(candidatesPath, JSON.stringify(candidates, null, 2) + '\n');

// ---------------------------------------------------------------------
// Draft review markdown (Pass 1 / Pass 2 / Pass 4 tables pre-filled;
// Passes 3/6/7/8 left as headers for the judgment pass to fill in)
// ---------------------------------------------------------------------

const L = [];
const P = (s) => L.push(s === undefined ? '' : s);

P('# Cross-Reference Candidates (draft) -- ' + accessionOrSlug);
P('');
P('*Auto-generated by ' + code('scripts/cross-reference-engine.cjs') + ' from ' + code(path.relative(ROOT, DIGEST_PATH)) + '.*');
P('*This is a DRAFT of the deterministic passes only. It is not a review.md -- the judgment passes');
P('(operations, contact-event proposals, personnel, awards, and all narrative interpretation) still');
P('need a human/Claude pass per ' + code('site/_docs/orll-digest-and-cross-reference-spec.md') + ' Step 3-5.*');
P('');
P('---');
P('');
P('## Pass 1 -- KIA in range (' + (periodStart || '?') + ' to ' + (periodEnd || '?') + ')');
P('');
P('| KIA | DOD | Grade | Detail |');
P('|---|---|---|---|');
for (const k of kiaInRange) {
  let detail = '';
  if (k.grade === 'candidate_exact_date_battalion_match') {
    detail = 'Event(s) ' + k.exact_events.map((e) => (e.n !== undefined && e.n !== null ? '#' + e.n : e.date)).join(', ') + ' on ' + k.dod + ' name a 2-8 Cav sub-unit -- verify.';
  } else if (k.grade === 'exact_date_other_unit') {
    detail = 'Event on ' + k.dod + ' names ' + JSON.stringify(k.exact_events_other_unit) + ' -- not 2-8 Cav. No enrichment.';
  } else if (k.grade === 'candidate_near_date_battalion_match') {
    const nb = k.near_events_battalion[0];
    detail = 'No exact-date event, but event ' + (nb.n !== undefined && nb.n !== null ? '#' + nb.n : ('dated ' + nb.date)) + ' on ' + nb.date + ' (offset ' + nb.offset_days + 'd, ' + JSON.stringify(nb.units) + ') is a 2-8 Cav battalion match -- check three-date offset (action/report/Wall).';
  } else {
    detail = 'No matching significant activity in this document.';
  }
  P('| ' + code(k.slug) + ' (' + k.name + ') | ' + k.dod + ' | ' + k.grade + ' | ' + detail + ' |');
}
if (!kiaInRange.length) P('_No roster rows fall within this document date range._');
P('');
P('---');
P('');
P('## Pass 2 -- Casualty reconciliation');
P('');
if (!casualtyReconciliation.length) {
  P('_No mismatches between event US-KIA tallies and the roster on the exact event date, for events naming a 2-8 Cav sub-unit._');
} else {
  for (const c of casualtyReconciliation) {
    P('### Event ' + (c.event_n !== null && c.event_n !== undefined ? '#' + c.event_n + ' -- ' : '') + c.date + (c.installation ? ' (' + c.installation + ')' : ''));
    P('');
    P('- Units: ' + c.units.join(', '));
    P('- Document reports **' + c.event_us_kia + ' US KIA**.');
    P('- Roster shows **' + c.roster_exact_date_count + '** on that exact date' + (c.roster_exact_date_slugs.length ? ' (' + c.roster_exact_date_slugs.map(code).join(', ') + ')' : '') + '.');
    if (c.roster_near_date_candidates.length) {
      P('- Roster deaths within ' + NEAR_DAYS + ' days to check for the three-date offset (action vs journal/report-logged vs Wall-of-record -- see the Session 96 addendum, never auto-align):');
      for (const n of c.roster_near_date_candidates) P('  - ' + code(n.slug) + ' -- ' + n.dod + ' (' + (n.offset_days > 0 ? '+' : '') + n.offset_days + 'd)');
    }
    P('- **Open question:** ' + c.open_question);
    P('');
  }
}
P('---');
P('');
P('## Pass 4/5 -- Locations (resolve to gazetteer)');
P('');
P('| Raw name | Resolved | Confidence | Action |');
P('|---|---|---|---|');
for (const l of locationCandidates) {
  const resolvedCell = l.resolved_slug ? code(l.resolved_slug) + ' (' + l.source + ')' : '_unresolved_';
  P('| ' + code(l.raw_name) + ' | ' + resolvedCell + ' | ' + l.confidence + ' | ' + l.action + ' |');
}
if (!locationCandidates.length) P('_No installation/LZ names found in coverage or events._');
P('');
P('---');
P('');
P('## Passes 3, 6, 7, 8 -- Operations / Personnel / Awards / Incident events (judgment pass -- not automated)');
P('');
P('Fill in by hand against the digest ' + code('operations[]') + ', ' + code('personnel[]') + ', ' + code('awards[]') + ',');
P('and narrative fields, cross-checked against existing ' + code('site/events/') + ' and ' + code('site/soldiers/') + ' content.');
P('');
P('## Proposed writes (await approval)');
P('');
P('_Compile from the sections above once the judgment passes are complete. Nothing writes to a');
P('foundation or page until this list is approved -- per the spec Step 5._');
P('');

fs.writeFileSync(outPrefix + '.review.draft.md', L.join('\n'));

console.log('Digest: ' + path.relative(ROOT, DIGEST_PATH));
console.log('Wrote ' + path.relative(ROOT, candidatesPath));
console.log('Wrote ' + path.relative(ROOT, outPrefix + '.review.draft.md'));
console.log('');
console.log('KIA-in-range rows: ' + kiaInRange.length + ' (skipped ' + skippedUnknownDate + ' unknown-date roster rows)');
console.log('  candidate_exact_date_battalion_match: ' + kiaInRange.filter((k) => k.grade === 'candidate_exact_date_battalion_match').length);
console.log('  candidate_near_date_battalion_match:  ' + kiaInRange.filter((k) => k.grade === 'candidate_near_date_battalion_match').length);
console.log('  exact_date_other_unit:                ' + kiaInRange.filter((k) => k.grade === 'exact_date_other_unit').length);
console.log('  in_range_no_matching_event:           ' + kiaInRange.filter((k) => k.grade === 'in_range_no_matching_event').length);
console.log('Casualty reconciliation flags: ' + casualtyReconciliation.length);
console.log('Location candidates: ' + locationCandidates.length + ' (' + locationCandidates.filter((l) => l.resolved_slug).length + ' resolved, ' + locationCandidates.filter((l) => !l.resolved_slug).length + ' unresolved)');
