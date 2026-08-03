/**
 * generate-locations-json.cjs
 *
 * Phase 2 of the ORLL Digest & Cross-Reference build (see
 * site/_docs/orll-digest-and-cross-reference-spec.md, Artifact 2).
 *
 * Parses sources/fsb-locations/2-8-cav-fsb-by-year.md (the curated, authoritative
 * raw note) into:
 *   - site/_data/locations.json         { sites: [...], occupancies: [...] }
 *   - sources/fsb-locations/lz-vocabulary.json  (regenerated, same clustering)
 *   - site/_docs/locations-json-qa-report.md
 *
 * Usage (from repo root):
 *   node scripts/generate-locations-json.cjs
 *
 * Design decisions (confirmed with Michael, 2026-07-14):
 *   - Same-name rows are clustered into one physical site only if their grids
 *     are within ~5km of each other (typical re-survey/shift distance). Rows
 *     sharing a name but far apart become separate site entries (name reuse,
 *     e.g. "LZ Amy" spans 3 unrelated grids across 1965/66 -- see README.md's
 *     own FB Mace warning for the same phenomenon). Every split is logged in
 *     the QA report for review.
 *   - Numeric-only site names ("2", "3", "5", "7", "8") keep their prefix as
 *     part of the canonical identity (e.g. "OP 3", "Ps 3") rather than being
 *     collapsed to a bare number -- this was the flagged vocabulary bug.
 *   - "Unnamed" sites (LZ Unnamed, AP Unnamed, OP Unnamed, Ps Unnamed) carry no
 *     name signal at all, so they are never clustered by proximity -- only an
 *     exact (or near-exact, <50m) grid match is treated as the same site.
 *   - lz-vocabulary.json gets the same 5km clustering applied (per Michael's
 *     answer) rather than just the narrow numeric-key patch, so both gazetteer
 *     artifacts stay internally consistent. This changes its key format from
 *     bare canonical names to slugs (e.g. "Amy" -> "lz-amy" / "lz-amy-b" /
 *     "ps-amy") -- flagged in the QA report as nothing in the repo currently
 *     reads this file programmatically yet.
 *   - This generated registry is intentionally NOT cross-linked to the 13
 *     existing hand-authored site/locations/*\/index.md pages (per Michael's
 *     answer) -- those stay a separate, richer, human-curated layer for now.
 *   - named_for resolves against the union of kia.json slugs and
 *     site/soldiers/*\ directory names, since FSB namesakes are often NOT D Co
 *     KIAs (e.g. FB Fanning -> fanning-martin, FB Jeffries -> jeffries-gabriel
 *     -- both non-D-Co honorees with existing profiles, confirmed by grepping
 *     the repo before building this).
 *   - Messy date strings ("8May-20Aug71", "1-5Jun, 14Aug-5Dec71") are NOT
 *     parsed into structured start/end dates -- LOCATION-FEATURE-CONCEPT.md
 *     explicitly defers that to later work. The raw note stays authoritative;
 *     date_raw here is a best-effort, non-authoritative convenience field.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC_PATH = path.join(ROOT, 'sources', 'fsb-locations', '2-8-cav-fsb-by-year.md');
const SOLDIERS_DIR = path.join(ROOT, 'site', 'soldiers');
const KIA_JSON_PATH = path.join(ROOT, 'site', '_data', 'kia.json');
const OUT_LOCATIONS = path.join(ROOT, 'site', '_data', 'locations.json');
const OUT_VOCAB = path.join(ROOT, 'sources', 'fsb-locations', 'lz-vocabulary.json');
const OUT_REPORT = path.join(ROOT, 'site', '_docs', 'locations-json-qa-report.md');

const BT = String.fromCharCode(96);
function code(s) { return BT + s + BT; }

const KNOWN_PREFIXES = ['FB', 'LZ', 'OP', 'Ps', 'AP', 'Hp'];
const NAMED_CLUSTER_KM = 5;
const UNNAMED_CLUSTER_KM = 0.05;

// ---------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

function splitPrefix(siteRaw) {
  const parts = siteRaw.split(' ');
  if (KNOWN_PREFIXES.includes(parts[0])) {
    return { prefix: parts[0], bare: parts.slice(1).join(' ').trim() };
  }
  return { prefix: '', bare: siteRaw };
}

function isNumeric(bare) {
  return /^\d+$/.test(bare);
}
function isUnnamed(bare) {
  return /^unnamed$/i.test(bare);
}

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function splitNoteAndCitations(note) {
  const lastPeriod = note.lastIndexOf('.');
  if (lastPeriod === -1) return { prose: note.trim(), citations_raw: '' };
  return {
    prose: note.slice(0, lastPeriod + 1).trim(),
    citations_raw: note.slice(lastPeriod + 1).trim(),
  };
}

function classifyUnit(note) {
  const companyMatch = note.match(/([A-Za-z0-9,+\-]+)\/2\/8th\s+Cav/);
  if (companyMatch) return { granularity: 'company', unit_raw: companyMatch[0] };
  if (/\b2\/8th\s+Cav\b/.test(note)) return { granularity: 'battalion', unit_raw: '2/8th Cav' };
  return { granularity: 'unspecified', unit_raw: '' };
}

function extractOperation(note) {
  const m = note.match(/\bOp\.?\s+([A-Z][A-Za-z0-9\/]*(?:\s+[A-Z][A-Za-z0-9\/]*)*)/);
  return m ? 'Op ' + m[1].trim().replace(/[.,]$/, '') : null;
}

function extractDateRaw(note) {
  const m = note.match(/\b(\d{1,2}-)?\d{0,2}[A-Za-z]{3,9}(-\d{1,2}[A-Za-z]{3,9})?\d{2}\b/);
  return m ? m[0] : '';
}

function extractNamedFor(note) {
  const m = note.match(/\bFor\s+([A-Z][A-Za-z.'-]*(?:\s+[A-Z][A-Za-z.'-]*){1,4})\s+(\d{1,2}[A-Za-z]{3}\d{2})\b/);
  if (!m) return null;
  let tokens = m[1].split(/\s+/);
  while (tokens.length > 1 && /^[A-Z]{2,6}$/.test(tokens[tokens.length - 1])) {
    tokens.pop();
  }
  return { nameTokens: tokens, dateRaw: m[2], rawMatch: m[0] };
}

function guessSlug(nameTokens) {
  let tokens = nameTokens.slice();
  const suffixRe = /^(Jr\.?|Sr\.?|II|III|IV)$/;
  if (tokens.length > 1 && suffixRe.test(tokens[tokens.length - 1])) tokens.pop();
  const first = tokens[0];
  const last = tokens[tokens.length - 1];
  const clean = (s) => s.toLowerCase().replace(/[^a-z]/g, '');
  return clean(last) + '-' + clean(first);
}

function extractAliases(note) {
  const aliases = new Set();
  const alsoRe = /\bAlso\s+([A-Z][A-Za-z' ]*?)(?=[.,]|$)/g;
  let m;
  while ((m = alsoRe.exec(note))) {
    const val = m[1].trim();
    if (/^\d/.test(val)) continue;
    if (/^listed\b/i.test(val)) continue;
    aliases.add(val);
  }
  const akaRe = /\baka\s+([A-Z][A-Za-z' ]*?)(?=[.,]|$)/gi;
  while ((m = akaRe.exec(note))) aliases.add(m[1].trim());
  const listingRe = /\bListing is ([A-Z][A-Za-z]*)\b/;
  const lm = note.match(listingRe);
  if (lm) aliases.add(lm[1]);
  return [...aliases];
}

function extractAltGrids(note, ownGrid) {
  const zone = ownGrid.slice(0, 2);
  const grids = new Set();
  const re = /\bAlso\s+(\d{6})\b/g;
  let m;
  while ((m = re.exec(note))) grids.add(zone + m[1]);
  return [...grids];
}

function clusterRows(rows, thresholdKm) {
  const clusters = [];
  for (const row of rows) {
    let joined = false;
    for (const c of clusters) {
      const d = haversineKm(c.lat, c.lon, row.lat, row.lon);
      if (d <= thresholdKm) {
        c.members.push(row);
        joined = true;
        break;
      }
    }
    if (!joined) clusters.push({ members: [row], lat: row.lat, lon: row.lon });
  }
  return clusters;
}

// ---------------------------------------------------------------------
// 1. Parse the raw markdown into rows
// ---------------------------------------------------------------------

const src = fs.readFileSync(SRC_PATH, 'utf8');
const lines = src.split('\n');

const yearHeaderRe = /^## (.+?)\s+\((\d+)\)\s*$/;
let currentYear = null;
const rawRows = [];
const parseErrors = [];

for (const line of lines) {
  const hm = line.match(yearHeaderRe);
  if (hm) {
    currentYear = hm[1];
    continue;
  }
  if (!line.trim().startsWith('|')) continue;
  const cells = line.split('|').map((c) => c.trim());
  if (cells[0] === '') cells.shift();
  if (cells[cells.length - 1] === '') cells.pop();
  if (cells.length !== 5) continue;
  const [site, grid, lat, lon, note] = cells;
  if (site === 'Site') continue;
  if (/^-+$/.test(grid)) continue;
  if (!/^[A-Z]{2}\d{6}$/.test(grid)) {
    parseErrors.push('Row skipped (grid not recognized): year=' + currentYear + ' site="' + site + '" grid="' + grid + '"');
    continue;
  }
  const latN = parseFloat(lat);
  const lonN = parseFloat(lon);
  if (!Number.isFinite(latN) || !Number.isFinite(lonN)) {
    parseErrors.push('Row skipped (bad lat/lon): year=' + currentYear + ' site="' + site + '"');
    continue;
  }
  const siteNorm = site.replace(/\s+/g, ' ').trim();
  const { prefix, bare } = splitPrefix(siteNorm);
  rawRows.push({
    year: currentYear,
    site_raw: siteNorm,
    prefix,
    bare,
    grid,
    lat: latN,
    lon: lonN,
    note: note.trim(),
  });
}

// ---------------------------------------------------------------------
// 2. Group rows into candidate name-groups, then geographically cluster
// ---------------------------------------------------------------------

const groups = new Map(); // groupKey -> { mode, rows: [] }

for (const row of rawRows) {
  let groupKey;
  let mode;
  if (isNumeric(row.bare)) {
    groupKey = 'NUM|' + row.prefix + '|' + row.bare;
    mode = 'numeric';
  } else if (isUnnamed(row.bare)) {
    groupKey = 'UNNAMED|' + row.prefix;
    mode = 'unnamed';
  } else {
    groupKey = 'NAME|' + row.bare.toLowerCase();
    mode = 'named';
  }
  if (!groups.has(groupKey)) groups.set(groupKey, { mode, rows: [] });
  groups.get(groupKey).rows.push(row);
}

const clusterRecords = []; // one per resulting physical site

for (const [groupKey, group] of groups) {
  const threshold = group.mode === 'unnamed' ? UNNAMED_CLUSTER_KM : NAMED_CLUSTER_KM;
  const clusters = clusterRows(group.rows, threshold);
  clusters.forEach((cluster, idx) => {
    clusterRecords.push({ groupKey, mode: group.mode, idx, totalInGroup: clusters.length, members: cluster.members });
  });
}

// ---------------------------------------------------------------------
// 3. Build site records (base slug first, then resolve collisions)
// ---------------------------------------------------------------------

function buildBaseSlugAndDisplay(rec) {
  const members = rec.members;
  const prefixCounts = {};
  for (const r of members) prefixCounts[r.prefix || '(none)'] = (prefixCounts[r.prefix || '(none)'] || 0) + 1;
  const primaryPrefix = Object.entries(prefixCounts).sort((a, b) => b[1] - a[1])[0][0];
  const cleanPrefix = primaryPrefix === '(none)' ? '' : primaryPrefix;
  const bareDisplay = members[0].bare;

  if (rec.mode === 'unnamed') {
    const grid = members[0].grid;
    return {
      primaryPrefix: cleanPrefix,
      bareDisplay,
      baseSlug: slugify((cleanPrefix ? cleanPrefix + ' ' : '') + 'unnamed ' + grid),
      displayName: (cleanPrefix ? cleanPrefix + ' ' : '') + 'Unnamed (' + grid + ')',
    };
  }
  const displayName = (cleanPrefix ? cleanPrefix + ' ' : '') + bareDisplay;
  return {
    primaryPrefix: cleanPrefix,
    bareDisplay,
    baseSlug: slugify(displayName),
    displayName,
  };
}

// Sort clusters deterministically: by earliest year of first member, then by
// original row order, so "-b"/"-c" suffixing is stable across runs.
const yearSortKey = (y) => (y === '(undated)' ? -1 : parseInt(y, 10));

clusterRecords.sort((a, b) => {
  const ay = Math.min(...a.members.map((m) => yearSortKey(m.year)));
  const by = Math.min(...b.members.map((m) => yearSortKey(m.year)));
  return ay - by;
});

const prelim = clusterRecords.map((rec) => Object.assign({}, rec, buildBaseSlugAndDisplay(rec)));

const slugCounts = new Map();
for (const p of prelim) slugCounts.set(p.baseSlug, (slugCounts.get(p.baseSlug) || 0) + 1);

const slugSeenSoFar = new Map();
for (const p of prelim) {
  if (slugCounts.get(p.baseSlug) > 1) {
    const n = (slugSeenSoFar.get(p.baseSlug) || 0);
    slugSeenSoFar.set(p.baseSlug, n + 1);
    p.finalSlug = n === 0 ? p.baseSlug : p.baseSlug + '-' + String.fromCharCode(97 + n); // -b, -c, ...
  } else {
    p.finalSlug = p.baseSlug;
  }
}

const splitReport = []; // groups that produced >1 cluster (name reuse or unnamed dedup)

for (const [groupKey, group] of groups) {
  const clustersForGroup = prelim.filter((p) => p.groupKey === groupKey);
  if (clustersForGroup.length > 1 && group.mode !== 'unnamed') {
    splitReport.push({
      groupKey,
      mode: group.mode,
      clusters: clustersForGroup.map((c) => ({
        years: [...new Set(c.members.map((m) => m.year))],
        grids: c.members.map((m) => m.grid),
        slug: c.finalSlug,
      })),
    });
  }
}

const sites = prelim.map((p) => {
  const slug = p.finalSlug;

  const members = p.members;
  const gridsMap = new Map();
  for (const m of members) {
    if (!gridsMap.has(m.grid)) gridsMap.set(m.grid, { grid: m.grid, lat: m.lat, lon: m.lon, years: new Set() });
    gridsMap.get(m.grid).years.add(m.year);
  }
  // fold in inline "Also <6-digit>" alt-grids mentioned in notes
  for (const m of members) {
    for (const alt of extractAltGrids(m.note, m.grid)) {
      if (!gridsMap.has(alt)) gridsMap.set(alt, { grid: alt, lat: null, lon: null, years: new Set([m.year]), fromNote: true });
    }
  }

  const aliasSet = new Set();
  for (const m of members) for (const a of extractAliases(m.note)) aliasSet.add(a);

  const namedForCandidates = [];
  for (const m of members) {
    const nf = extractNamedFor(m.note);
    if (nf) namedForCandidates.push(nf);
  }

  return {
    slug,
    canonical_name: p.bareDisplay,
    primary_prefix: p.primaryPrefix,
    display_name: p.displayName,
    prefixes: [...new Set(members.map((m) => m.prefix).filter(Boolean))],
    aliases: [...aliasSet],
    grids: [...gridsMap.values()].map((g) => ({ grid: g.grid, lat: g.lat, lon: g.lon, years: [...g.years].sort(), from_note_only: !!g.fromNote })),
    years: [...new Set(members.map((m) => m.year))].sort(),
    occupancy_count: members.length,
    named_for_candidates: namedForCandidates.map((nf) => ({ name_raw: nf.nameTokens.join(' '), date_raw: nf.dateRaw, guessed_slug: guessSlug(nf.nameTokens) })),
    _members: members, // stripped before writing sites[], used to build occupancies[]
  };
});

// ---------------------------------------------------------------------
// 4. Resolve named_for against known soldier slugs (kia.json U soldiers dir)
// ---------------------------------------------------------------------

let kiaSlugs = [];
try {
  kiaSlugs = JSON.parse(fs.readFileSync(KIA_JSON_PATH, 'utf8')).map((r) => r.slug);
} catch (e) {
  kiaSlugs = [];
}
let soldierDirSlugs = [];
try {
  soldierDirSlugs = fs.readdirSync(SOLDIERS_DIR, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);
} catch (e) {
  soldierDirSlugs = [];
}
const knownSlugs = new Set([...kiaSlugs, ...soldierDirSlugs]);

const namedForResolved = [];
const namedForUnresolved = [];

for (const site of sites) {
  if (!site.named_for_candidates.length) {
    site.named_for = null;
    site.named_for_note = null;
    continue;
  }
  const resolved = site.named_for_candidates.filter((c) => knownSlugs.has(c.guessed_slug));
  const uniqueResolvedSlugs = [...new Set(resolved.map((c) => c.guessed_slug))];
  if (uniqueResolvedSlugs.length === 1) {
    site.named_for = uniqueResolvedSlugs[0];
    site.named_for_note = site.named_for_candidates[0].name_raw + ' KIA ' + site.named_for_candidates[0].date_raw;
    namedForResolved.push({ site: site.slug, named_for: site.named_for });
  } else if (uniqueResolvedSlugs.length > 1) {
    site.named_for = null;
    site.named_for_note = 'AMBIGUOUS: ' + uniqueResolvedSlugs.join(', ');
    namedForUnresolved.push({ site: site.slug, reason: 'ambiguous', candidates: uniqueResolvedSlugs });
  } else {
    site.named_for = null;
    site.named_for_note = site.named_for_candidates[0].name_raw + ' KIA ' + site.named_for_candidates[0].date_raw + ' (guessed slug "' + site.named_for_candidates[0].guessed_slug + '" not found)';
    namedForUnresolved.push({ site: site.slug, reason: 'no matching slug', candidates: site.named_for_candidates.map((c) => c.guessed_slug) });
  }
}

// ---------------------------------------------------------------------
// 5. Build occupancy log (one row per original table row)
// ---------------------------------------------------------------------

const occupancies = [];
for (const site of sites) {
  for (const m of site._members) {
    const { prose, citations_raw } = splitNoteAndCitations(m.note);
    const { granularity, unit_raw } = classifyUnit(m.note);
    occupancies.push({
      site_slug: site.slug,
      year_section: m.year,
      grid: m.grid,
      lat: m.lat,
      lon: m.lon,
      unit_raw: unit_raw || '(unspecified -- see note)',
      unit_granularity: granularity,
      operation: extractOperation(m.note),
      date_raw: extractDateRaw(m.note),
      confidence: granularity === 'company' ? 'confirmed' : granularity === 'battalion' ? 'battalion-level' : 'unspecified',
      source: {
        document: '2-8-cav-fsb-by-year.md',
        citations_raw: citations_raw,
      },
      note: m.note,
    });
  }
}

for (const site of sites) delete site._members;
for (const site of sites) delete site.named_for_candidates;

// ---------------------------------------------------------------------
// 6. Write site/_data/locations.json
// ---------------------------------------------------------------------

fs.mkdirSync(path.dirname(OUT_LOCATIONS), { recursive: true });
fs.writeFileSync(OUT_LOCATIONS, JSON.stringify({ sites, occupancies }, null, 2) + '\n');

// ---------------------------------------------------------------------
// 7. Regenerate lz-vocabulary.json from the same clusters
// ---------------------------------------------------------------------

const vocabSites = {};
for (const site of sites) {
  vocabSites[site.slug] = {
    canonical: site.display_name,
    prefixes: site.prefixes,
    grids: site.grids.filter((g) => g.lat !== null).map((g) => ({ grid: g.grid, lat: g.lat, lon: g.lon })),
    aliases: site.aliases,
    sources: [...new Set(
      occupancies.filter((o) => o.site_slug === site.slug)
        .flatMap((o) => o.source.citations_raw.split(/[\s,]+/).filter((t) => t && /^(AD|ADA)?\d/.test(t)))
    )],
  };
}

const vocab = {
  _meta: {
    purpose: 'Canonical site vocabulary for OCR name-resolution. Regenerated from 2-8-cav-fsb-by-year.md by scripts/generate-locations-json.cjs; grows as sources are processed.',
    regenerated: new Date().toISOString().slice(0, 10),
    authority: 'gazetteer note is authoritative for coords',
    key_format_note: 'Keys are now site slugs (e.g. "lz-amy", "op-3"), not bare canonical names -- changed 2026-07-14 to keep numeric-named sites (formerly bare "2","3","5","7","8") disambiguated by prefix, and to split same-name/different-place entries (e.g. former single "Amy" entry spanning ~100km+ now split into lz-amy / lz-amy-b / ps-amy). Nothing in the repo reads this file programmatically yet, so this is a safe breaking change to the key format.',
  },
  sites: vocabSites,
};

fs.writeFileSync(OUT_VOCAB, JSON.stringify(vocab, null, 2) + '\n');

// ---------------------------------------------------------------------
// 8. QA report
// ---------------------------------------------------------------------

function fmtList(arr) {
  return arr.length ? arr.map((x) => '- ' + x).join('\n') : '_none_';
}

const L = [];
const P = (s) => L.push(s === undefined ? '' : s);

const totalRows = rawRows.length;
const totalSites = sites.length;
const totalSplitGroups = splitReport.length;

P('# locations.json Generation Report');
P('*Generated by ' + code('scripts/generate-locations-json.cjs') + ' from ' + code('sources/fsb-locations/2-8-cav-fsb-by-year.md') + '.*');
P('*Regenerate rather than hand-edit -- ' + code('site/_data/locations.json') + ' and ' + code('sources/fsb-locations/lz-vocabulary.json') + ' are both build output.*');
P('');
P('Generated: ' + new Date().toISOString());
P('');
P('---');
P('');
P('## Totals');
P('');
P('Raw table rows parsed: **' + totalRows + '**');
P('Resulting canonical sites (after ' + NAMED_CLUSTER_KM + 'km clustering): **' + totalSites + '**');
P('Occupancy log entries: **' + occupancies.length + '** (one per raw row, 1:1 with rows parsed)');
P('Parse errors: **' + parseErrors.length + '**');
P('');
P('The source header (README.md) states "204 entries naming 2/8th Cav" and the by-year');
P('file\'s own year-section counts sum to a different total than either 202 or 204 --');
P('this is the same kind of header-vs-actual-rows gap Phase 1 found in the KIA list.');
P('Reporting the actual parsed count above rather than reconciling it silently.');
P('');
P('## Same-name/different-site splits (review these)');
P('');
P('Every case below is a raw site name that produced **more than one** canonical site');
P('because its grid rows were more than ' + NAMED_CLUSTER_KM + 'km apart -- i.e. the same name was');
P('almost certainly reused for a different physical place, the way the README already');
P('documents for "FB Mace." Confirm the splits look right; nothing here was merged back');
P('together automatically.');
P('');
if (splitReport.length) {
  for (const s of splitReport) {
    P('**' + s.groupKey.replace(/^NAME\|/, '').replace(/^NUM\|/, '') + '**' + (s.mode === 'numeric' ? ' (numeric site)' : '') + ':');
    for (const c of s.clusters) {
      P('  - ' + code(c.slug) + ' -- years ' + c.years.join(', ') + ' -- grids: ' + c.grids.join(', '));
    }
  }
} else {
  P('_none -- no same-name group split into multiple sites this run._');
}
P('');
P('## Numeric-site prefix fix (the flagged cleanup item)');
P('');
const numericSites = sites.filter((s) => /^\d+$/.test(s.canonical_name));
P('Numeric-named sites now keyed with their prefix, not as bare numbers:');
P('');
for (const s of numericSites) {
  P('- ' + code(s.display_name) + ' (slug ' + code(s.slug) + ') -- grids: ' + s.grids.map((g) => g.grid).join(', '));
}
P('');
P('Before this run, ' + code('lz-vocabulary.json') + ' had bare-number keys ("2", "3", "5", "7", "8")');
P('that silently merged different prefixes together (e.g. "3" held both OP 3 and Ps 3\'s');
P('grids under one entry). Both are now separate, prefixed entries.');
P('');
P('## named_for resolution');
P('');
P('Resolved against the union of ' + code('kia.json') + ' slugs (' + kiaSlugs.length + ') and ' + code('site/soldiers/*') + ' directory');
P('names (' + soldierDirSlugs.length + '), since FSB namesakes are frequently NOT D Co KIAs (e.g. Fanning,');
P('Jeffries -- confirmed as existing non-D-Co soldier profiles before this generator ran).');
P('');
P('**Resolved:**');
P(fmtList(namedForResolved.map((r) => r.site + ' -> ' + code(r.named_for))));
P('');
P('**Unresolved (flagged, not guessed):**');
P(fmtList(namedForUnresolved.map((r) => r.site + ' -- ' + r.reason + ' (' + r.candidates.join(', ') + ')')));
P('');
P('## Unit-granularity classification');
P('');
P('Every occupancy row is classified from its own note text:');
P('');
const granCounts = occupancies.reduce((acc, o) => { acc[o.unit_granularity] = (acc[o.unit_granularity] || 0) + 1; return acc; }, {});
P('- company (a specific company/sub-element named, e.g. "D/2/8th Cav"): **' + (granCounts.company || 0) + '**');
P('- battalion (bare "2/8th Cav", no company letter): **' + (granCounts.battalion || 0) + '**');
P('- unspecified (neither pattern matched -- should be rare/zero given this source is pre-filtered to 2/8 Cav mentions): **' + (granCounts.unspecified || 0) + '**');
P('');
P('Note: this is a different axis than the spec\'s ORLL-digest-phase confirmed/inferred');
P('vocabulary (which is about brigade-only vs. named-sub-unit evidence in a *narrative*');
P('source). Every row in this dataset already names 2/8th Cav by construction (that was');
P('the selection criterion for the source list), so "confidence" here means how far down');
P('the note specifies the unit, not whether 2/8 Cav was there at all.');
P('');
const unspecified = occupancies.filter((o) => o.unit_granularity === 'unspecified');
if (unspecified.length) {
  P('**Unspecified rows (check these):**');
  P(fmtList(unspecified.map((o) => o.site_slug + ' (' + o.year_section + '): ' + o.note)));
  P('');
}
P('## Aliases captured (best-effort)');
P('');
const withAliases = sites.filter((s) => s.aliases.length);
P(fmtList(withAliases.map((s) => code(s.slug) + ' -- ' + s.aliases.join(', '))));
P('');
P('Extracted from "Also <Name>", "aka <Name>", and "Listing is <Name>" patterns in the');
P('note text. Best-effort regex, not exhaustive -- the raw note (kept verbatim on every');
P('occupancy row) is always the authoritative source per the by-year file\'s own header.');
P('');
P('## Acceptance checks');
P('');
const missingFields = occupancies.filter((o) => !o.site_slug || !o.unit_raw || !o.grid || !o.confidence);
P('Every occupancy has site + unit + date + source + confidence:');
P(missingFields.length
  ? ('**' + missingFields.length + ' rows missing a required field** -- ' + fmtList(missingFields.map((o) => o.site_slug)))
  : '_all ' + occupancies.length + ' occupancy rows carry site_slug, unit_raw, grid, source, and confidence. (date_raw is best-effort and may be empty; year_section always is present as the authoritative fallback granularity.)_');
P('');
const emptyDateRaw = occupancies.filter((o) => !o.date_raw);
P('Rows where the best-effort date_raw regex found nothing (year_section is still reliable):');
P(fmtList(emptyDateRaw.map((o) => o.site_slug + ' (' + o.year_section + '): "' + o.note + '"')));
P('');
const namedForNotResolving = sites.filter((s) => s.named_for_note && !s.named_for);
P(code('named_for') + ' resolves to a real slug, or is null with a note explaining why:');
P(namedForNotResolving.length
  ? fmtList(namedForNotResolving.map((s) => s.slug + ' -- ' + s.named_for_note))
  : '_every site with a namesake candidate resolved to a known slug._');
P('');
P('## Parse errors');
P('');
P(fmtList(parseErrors));
P('');

fs.writeFileSync(OUT_REPORT, L.join('\n'));

console.log('Parsed ' + totalRows + ' rows -> ' + totalSites + ' sites, ' + occupancies.length + ' occupancies.');
console.log('Wrote ' + path.relative(ROOT, OUT_LOCATIONS));
console.log('Wrote ' + path.relative(ROOT, OUT_VOCAB));
console.log('Wrote ' + path.relative(ROOT, OUT_REPORT));
