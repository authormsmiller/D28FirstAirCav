/**
 * generate-kia-json.cjs
 *
 * Phase 1 of the ORLL Digest & Cross-Reference build (see
 * site/_docs/orll-digest-and-cross-reference-spec.md, Artifact 1).
 *
 * Parses site/_docs/d-co-kia-list.md (the curated, hand-edited source of
 * truth) into site/_data/kia.json (generated, never hand-edited) plus a
 * QA report at site/_docs/kia-json-qa-report.md.
 *
 * Usage (from repo root):
 *   node scripts/generate-kia-json.cjs
 *
 * Idempotent: re-running overwrites both output files from the current
 * state of d-co-kia-list.md and the current event front matter. Nothing
 * in this script writes back to d-co-kia-list.md or to any event file --
 * per the spec guardrail ("candidates, not writes"), the only enrichment
 * this generator performs is a deterministic slug-join against existing,
 * already-curated event front matter (casualties.kia[]/dow[].slug) to
 * populate the optional event field. That join is read-only and is
 * fully described in the QA report.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC_PATH = path.join(ROOT, 'site', '_docs', 'd-co-kia-list.md');
const EVENTS_DIR = path.join(ROOT, 'site', 'events');
const OUT_JSON = path.join(ROOT, 'site', '_data', 'kia.json');
const OUT_REPORT = path.join(ROOT, 'site', '_docs', 'kia-json-qa-report.md');

const yaml = require(path.join(ROOT, 'site', 'node_modules', 'js-yaml'));

const BT = String.fromCharCode(96); // backtick, kept out of template literals on purpose

function code(s) {
  return BT + s + BT;
}

// ---------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------

const SUFFIX_RE = /^(Jr\.?|Sr\.?|II|III|IV|V)$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function stripCell(s) {
  return s.replace(/\s+/g, ' ').trim();
}

// Split a markdown table row into raw cells, dropping the leading/trailing
// empty strings produced by the outer pipes.
function splitRow(line) {
  const trimmed = line.trim();
  if (!trimmed.startsWith('|')) return null;
  const cells = trimmed.split('|').map((c) => c.trim());
  if (cells[0] === '') cells.shift();
  if (cells[cells.length - 1] === '') cells.pop();
  return cells;
}

function parseName(nameField) {
  // "Last[-Last], First [Middle...] [Suffix]"
  const commaIdx = nameField.indexOf(',');
  if (commaIdx === -1) {
    return { last_name: nameField, first_name: '', middle_name: '', suffix: '' };
  }
  const last_name = stripCell(nameField.slice(0, commaIdx));
  const remainder = stripCell(nameField.slice(commaIdx + 1));
  const tokens = remainder.length ? remainder.split(/\s+/) : [];
  let suffix = '';
  if (tokens.length && SUFFIX_RE.test(tokens[tokens.length - 1])) {
    suffix = tokens.pop();
  }
  const first_name = tokens.shift() || '';
  const middle_name = tokens.join(' ');
  return { last_name, first_name, middle_name, suffix };
}

function cleanMarkup(s) {
  return s.split('**').join('').split(BT).join('').trim();
}

// Parse the Profile column: detects [att] marker + profile status.
function parseProfile(raw) {
  let s = raw;
  const attached = /\[att\]/i.test(s);
  s = s.replace(/\[att\]/gi, '');
  s = cleanMarkup(s);
  s = s.replace(/\*+$/, '').trim(); // trailing footnote asterisk e.g. "[att]*"
  const draft = /\(draft\)/i.test(s);
  s = s.replace(/\(draft\)/i, '').trim();

  let profile_status = 'unknown';
  if (s === '' || s === '—' || s === '-') profile_status = 'none';
  else if (/^stub$/i.test(s)) profile_status = 'stub';
  else if (s === '✅' || /^(yes|full)$/i.test(s)) profile_status = 'full';
  else profile_status = 'unknown';

  return { attached, profile_status, draft, raw_remainder: s };
}

function dashToEmpty(s) {
  const v = stripCell(s);
  return v === '—' || v === '-' || v === '' ? '' : v;
}

function computeHostile(causeRaw) {
  if (!causeRaw) {
    return { hostile: true, causeNote: 'no Cause cell in source row; presumed Hostile per default rule' };
  }
  return { hostile: !/non-hostile/i.test(causeRaw), causeNote: '' };
}

// ---------------------------------------------------------------------
// 1. Read & split the source markdown into year sections
// ---------------------------------------------------------------------

const src = fs.readFileSync(SRC_PATH, 'utf8');
const lines = src.split('\n');

const totalLine = lines.find((l) => l.startsWith('**Total organic entries:**')) || '';

const yearHeaderRe = /^## (\d{4}) — (.+)$/;

const sections = [];
let current = null;
for (const line of lines) {
  const m = line.match(yearHeaderRe);
  if (m) {
    if (current) sections.push(current);
    current = { year: m[1], headerText: m[2].trim(), lines: [] };
    continue;
  }
  if (/^## Summary/.test(line) || /^## Open Items/.test(line)) {
    if (current) sections.push(current);
    current = null;
  }
  if (current) current.lines.push(line);
}
if (current) sections.push(current);

// ---------------------------------------------------------------------
// 2. Parse rows out of each year section (main table + footnote extras)
// ---------------------------------------------------------------------

const rows = [];
const perYearCounts = {};

const footnoteLineRe = new RegExp('^>\\s*' + BT + '(\\|.*\\|)' + BT + '\\s*$');

for (const section of sections) {
  const year = section.year;
  perYearCounts[year] = {
    headerText: section.headerText,
    tableRows: 0,
    attachedTagged: 0,
    footnoteRows: 0,
  };

  for (const line of section.lines) {
    const footnoteMatch = line.match(footnoteLineRe);
    const isFootnote = !!footnoteMatch;
    const rowSource = isFootnote ? footnoteMatch[1] : line;

    if (!rowSource.trim().startsWith('|')) continue;
    const cells = splitRow(rowSource);
    if (!cells) continue;
    if (!DATE_RE.test(cells[0])) continue;

    let dod, rank, name, hometown, dob, wall, slug, profile, notesCell, cause;

    if (cells.length === 9) {
      [dod, rank, name, hometown, dob, wall, slug, profile, cause] = cells;
    } else if (cells.length === 10) {
      [dod, rank, name, hometown, dob, wall, slug, profile, notesCell, cause] = cells;
    } else if (cells.length === 8) {
      [dod, rank, name, hometown, dob, wall, slug, profile] = cells;
      cause = '';
    } else {
      rows.push({ __parse_error: 'Unrecognized row shape (' + cells.length + ' cells): ' + rowSource });
      continue;
    }

    const { last_name, first_name, middle_name, suffix } = parseName(stripCell(name));
    const { attached, profile_status, draft } = parseProfile(profile);
    const { hostile, causeNote } = computeHostile(cause);

    const inclusion = attached ? 'attached' : 'organic';
    const unit = 'D Co, 2/8 Cav';

    const row = {
      slug: cleanMarkup(stripCell(slug)),
      last_name,
      first_name,
      middle_name,
      suffix,
      rank: stripCell(rank),
      dod: stripCell(dod),
      date_known: !/00/.test(dod),
      dob: dashToEmpty(dob),
      hometown: dashToEmpty(hometown),
      wall: dashToEmpty(wall),
      cause: cleanMarkup(stripCell(cause)),
      hostile,
      inclusion,
      unit,
      event: '',
      profile_status,

      _qa: {
        year,
        source_row: isFootnote ? 'footnote (absent from honor roll)' : 'main table',
        draft_profile: draft,
        cause_note: causeNote,
        re_check_flagged: /re-check/i.test(cause || ''),
        notes_cell: notesCell ? cleanMarkup(stripCell(notesCell)) : '',
      },
    };

    rows.push(row);

    if (isFootnote) perYearCounts[year].footnoteRows += 1;
    else {
      perYearCounts[year].tableRows += 1;
      if (attached) perYearCounts[year].attachedTagged += 1;
    }
  }
}

const parseErrors = rows.filter((r) => r.__parse_error);
const goodRows = rows.filter((r) => !r.__parse_error);

// ---------------------------------------------------------------------
// 3. Deterministic event slug-join (read-only) against site/events/*/index.md
// ---------------------------------------------------------------------

const slugToEvents = new Map();

if (fs.existsSync(EVENTS_DIR)) {
  const eventDirs = fs.readdirSync(EVENTS_DIR, { withFileTypes: true }).filter((d) => d.isDirectory());

  for (const dir of eventDirs) {
    const idxPath = path.join(EVENTS_DIR, dir.name, 'index.md');
    if (!fs.existsSync(idxPath)) continue;
    const raw = fs.readFileSync(idxPath, 'utf8');
    const fmMatch = raw.match(/^---\n([\s\S]*?)\n---/);
    if (!fmMatch) continue;
    let fm;
    try {
      fm = yaml.load(fmMatch[1]);
    } catch (e) {
      continue;
    }
    if (!fm || !fm.casualties) continue;
    const eventSlug = fm.slug || dir.name;
    for (const key of ['kia', 'dow']) {
      const list = fm.casualties[key];
      if (!Array.isArray(list)) continue;
      for (const c of list) {
        if (!c || !c.slug) continue;
        if (!slugToEvents.has(c.slug)) slugToEvents.set(c.slug, []);
        slugToEvents.get(c.slug).push({ event: eventSlug, via: key });
      }
    }
  }
}

const eventJoinReport = [];

for (const row of goodRows) {
  const matches = slugToEvents.get(row.slug);
  if (!matches || matches.length === 0) continue;
  const uniqueEvents = [...new Set(matches.map((m) => m.event))];
  if (uniqueEvents.length === 1) {
    row.event = uniqueEvents[0];
    eventJoinReport.push({ slug: row.slug, matches: uniqueEvents, resolved: uniqueEvents[0] });
  } else {
    eventJoinReport.push({ slug: row.slug, matches: uniqueEvents, resolved: null });
    row._qa.ambiguous_event_match = uniqueEvents;
  }
}

// ---------------------------------------------------------------------
// 4. QA checks
// ---------------------------------------------------------------------

const qa = {};

qa.headerTotalLine = totalLine;
qa.totalRowsParsed = goodRows.length;
qa.parseErrors = parseErrors;

const slugCounts = new Map();
for (const r of goodRows) slugCounts.set(r.slug, (slugCounts.get(r.slug) || 0) + 1);
qa.slugCollisions = [...slugCounts.entries()].filter(([, n]) => n > 1);

const nameDodCounts = new Map();
for (const r of goodRows) {
  const key = r.last_name + '|' + r.first_name + '|' + r.dod;
  if (!nameDodCounts.has(key)) nameDodCounts.set(key, []);
  nameDodCounts.get(key).push(r.slug);
}
qa.nameDodDuplicates = [...nameDodCounts.entries()].filter(([, slugs]) => slugs.length > 1);

qa.dodOutOfRange = goodRows.filter((r) => {
  const y = parseInt(r.dod.slice(0, 4), 10);
  return !(y >= 1965 && y <= 1972);
});

qa.externalsMissingEvent = goodRows.filter(
  (r) => (r.inclusion === 'co_casualty' || r.inclusion === 'causal') && !r.event
);
qa.inclusionCounts = goodRows.reduce((acc, r) => {
  acc[r.inclusion] = (acc[r.inclusion] || 0) + 1;
  return acc;
}, {});

qa.missingHometownOrDob = goodRows
  .filter((r) => !r.hometown || !r.dob)
  .map((r) => ({ slug: r.slug, hometown: r.hometown, dob: r.dob, source_row: r._qa.source_row }));

qa.reCheckFlagged = goodRows.filter((r) => r._qa.re_check_flagged).map((r) => r.slug);
qa.draftProfiles = goodRows.filter((r) => r._qa.draft_profile).map((r) => r.slug);
qa.noCauseCell = goodRows.filter((r) => r._qa.cause_note).map((r) => r.slug);
qa.perYear = perYearCounts;
qa.eventJoin = eventJoinReport;

const summaryIdx = lines.findIndex((l) => /^## Summary/.test(l));
const openItemsIdx = lines.findIndex((l) => /^## Open Items/.test(l));
qa.summaryTableText = summaryIdx !== -1
  ? lines.slice(summaryIdx, openItemsIdx !== -1 ? openItemsIdx : undefined).join('\n').trim()
  : '';
qa.openItemsText = openItemsIdx !== -1 ? lines.slice(openItemsIdx).join('\n').trim() : '';

// ---------------------------------------------------------------------
// 5. Write kia.json (schema fields only -- strip _qa before writing)
// ---------------------------------------------------------------------

const fieldOrder = [
  'slug', 'last_name', 'first_name', 'middle_name', 'suffix', 'rank',
  'dod', 'date_known', 'dob', 'hometown', 'wall', 'cause', 'hostile',
  'inclusion', 'unit', 'event', 'profile_status',
];

const outRows = goodRows
  .slice()
  .sort((a, b) => (a.dod < b.dod ? -1 : a.dod > b.dod ? 1 : a.last_name.localeCompare(b.last_name)))
  .map((r) => {
    const o = {};
    for (const f of fieldOrder) o[f] = r[f];
    return o;
  });

fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
fs.writeFileSync(OUT_JSON, JSON.stringify(outRows, null, 2) + '\n');

// ---------------------------------------------------------------------
// 6. Write QA report -- built as an array of lines, joined at the end.
//    (Deliberately avoids nested template-literal backticks.)
// ---------------------------------------------------------------------

function fmtList(arr) {
  return arr.length ? arr.map((x) => '- ' + x).join('\n') : '_none_';
}

function parseHeaderCounts(headerText) {
  const orgM = headerText.match(/(\d+)\s+organic/i);
  const attM = headerText.match(/(\d+)\s+attached/i);
  const kiaOnlyM = headerText.match(/^(\d+)\s+KIA/i);
  if (orgM) {
    return { organic: parseInt(orgM[1], 10), attached: attM ? parseInt(attM[1], 10) : 0 };
  }
  if (kiaOnlyM) {
    return { organic: parseInt(kiaOnlyM[1], 10), attached: 0 };
  }
  return { organic: null, attached: null };
}

const perYearRows = Object.entries(qa.perYear).map(([year, c]) => {
  const tableOrganic = c.tableRows - c.attachedTagged;
  const headerCounts = parseHeaderCounts(c.headerText);
  let verdict = 'n/a';
  if (headerCounts.organic !== null) {
    const exactMatch = tableOrganic === headerCounts.organic && c.attachedTagged === headerCounts.attached;
    const footnoteAsOrganicMatch = (tableOrganic + c.footnoteRows) === headerCounts.organic && c.attachedTagged === headerCounts.attached;
    if (exactMatch) verdict = 'matches exactly';
    else if (footnoteAsOrganicMatch) verdict = 'matches if footnote row counted as organic';
    else verdict = '**MISMATCH**';
  }
  return '| ' + year + ' | ' + c.headerText + ' | ' + c.tableRows + ' | ' + c.attachedTagged + ' | ' + c.footnoteRows + ' | ' + verdict + ' |';
});

const L = [];
const P = (s) => L.push(s === undefined ? '' : s);

P('# kia.json Generation Report');
P('*Generated by ' + code('scripts/generate-kia-json.cjs') + ' from ' + code('site/_docs/d-co-kia-list.md') + '.*');
P('*Regenerate rather than hand-edit -- this file and ' + code('site/_data/kia.json') + ' are both build output.*');
P('');
P('Generated: ' + new Date().toISOString());
P('');
P('---');
P('');
P('## Header vs. parsed totals');
P('');
P('Source header line:');
P('> ' + qa.headerTotalLine);
P('');
P('Rows parsed (main table + footnote-extra rows), across all years: **' + qa.totalRowsParsed + '**');
P('');
P('Inclusion breakdown of parsed rows: ' + JSON.stringify(qa.inclusionCounts));
P('');
P('**Reconciliation:** the header claims "112 (111 individuals -- Williams duplicate resolved)."');
P('Summing the main year tables\' organic+attached rows plus the three Wall-only footnote');
P('rows (Gundolf 1967-03-30, Nelson Daniel Eugene Jr. 1968-09-21, Gulley Houston 1969-07-02)');
P('gives **' + qa.totalRowsParsed + '** parsed rows. ' + (qa.totalRowsParsed === 111
  ? 'This matches the "111 individuals" figure exactly.'
  : 'This does NOT match "111" -- see per-year table below for where the gap is.'));
P('The "112" figure appears to refer to a raw Wall count before the Williams duplicate was');
P('collapsed to one row (which is why the doc immediately glosses it as "111 individuals").');
P('');
P('## Per-year header vs. actual row counts');
P('');
P('The year section headers (e.g. "18 organic KIA + 2 attached") are prose written by hand and');
P('were **not** used to derive the JSON -- they are compared here against what the table rows');
P('actually contain (a row counts as "attached" only if its Profile cell carries ' + code('[att]') + ').');
P('Any mismatch below is a discrepancy in the source markdown itself, not a generator bug --');
P('flagging it, not silently resolving it, per the "no manufactured cross-references" guardrail.');
P('');
P('| Year | Header text (as written) | Table rows parsed | ...of which ' + code('[att]') + '-tagged | Footnote extra rows | Reconciles? |');
P('|---|---|---|---|---|---|');
for (const r of perYearRows) P(r);
P('');
P('"Matches if footnote row counted as organic" means: the header\'s stated organic count equals');
P('(table rows minus ' + code('[att]') + '-tagged rows) **plus** that year\'s Wall-only footnote row(s) -- i.e. the');
P('header already folds the footnote entry into its organic count even though the footnote itself');
P('is filed under "Open Items," not the table. This holds for **1969** (Gulley Houston folded in)');
P('and, with one additional wrinkle, **1968**: the header\'s "16 organic + 3 attached" only');
P('reconciles once you also apply the source\'s own **Ahern footnote** -- "Ahern is marked');
P('attached ' + code('[att]') + ' in the honor roll but listed as D Co. on the Wall" -- i.e. re-classify Ahern');
P('organic (per Wall) rather than attached (per honor roll) in addition to folding in the Nelson');
P('Daniel Eugene Jr. footnote row. That gives 14 table-organic + Ahern + Nelson-footnote = 16');
P('organic, and 4 table-' + code('[att]') + ' minus Ahern = 3 attached. Matches exactly.');
P('');
P('**1967 is a genuine, unresolved mismatch**: the header says "18 organic + 2 attached," and the');
P('table-organic count (18) does match -- but the table actually carries **three** ' + code('[att]') + '-tagged');
P('rows (Willis, Middleton, Bennett), not two, and the header total doesn\'t account for the Gundolf');
P('Wall-only footnote row at all (unlike 1968/1969, where the equivalent footnote is implicitly');
P('folded in). No footnote text in the source explains the extra Bennett tag the way the Ahern note');
P('explains 1968. This looks like a plain undercount in the hand-written 1967 section header --');
P('worth a look before treating the header prose as authoritative anywhere else in the archive.');
P('');
P('## Bottom summary table + Open Items (verbatim from source)');
P('');
P(BT + BT + BT);
P(qa.summaryTableText);
P(BT + BT + BT);
P('');
P(BT + BT + BT);
P(qa.openItemsText);
P(BT + BT + BT);
P('');
P('## Integrity checks');
P('');
P('**Slug collisions** (same slug used twice):');
P(qa.slugCollisions.length ? fmtList(qa.slugCollisions.map(([s, n]) => code(s) + ' -- ' + n + 'x')) : '_none found_');
P('');
P('**Name+DOD duplicates** (Williams-style duplicate check -- expect none, since the source');
P('already resolved the Williams duplicate to a single row):');
P(qa.nameDodDuplicates.length
  ? fmtList(qa.nameDodDuplicates.map(([k, slugs]) => k + ' -- ' + slugs.join(', ')))
  : '_none found -- Williams duplicate confirmed resolved in source._');
P('');
P('**DOD outside 1965-1972:**');
P(qa.dodOutOfRange.length ? fmtList(qa.dodOutOfRange.map((r) => r.slug + ' -- ' + r.dod)) : '_none_');
P('');
P('**External (' + code('co_casualty') + '/' + code('causal') + ') rows missing ' + code('event') + '** (integrity rule violation if any):');
P(qa.externalsMissingEvent.length
  ? fmtList(qa.externalsMissingEvent.map((r) => r.slug))
  : ('_none -- in fact, the current source markdown contains zero co_casualty/causal rows at all. ' +
     'The Chinook crew and non-D-Co passengers documented in ' + code('chinook-crash-kia-checklist.md') +
     ' (5 crew, 7 sister-unit passengers) are NOT yet rows in ' + code('d-co-kia-list.md') +
     ' and so are correctly absent from kia.json. Adding them is a markdown-editing decision for ' +
     'Michael, not something this generator should do -- per "markdown is source of truth."_'));
P('');
P('**Rows missing hometown and/or DOB** (mostly the three Wall-only footnote rows, by design --');
P('they are absent from the honor roll, which is the primary source for those fields):');
P(fmtList(qa.missingHometownOrDob.map((r) => r.slug + ' (hometown: "' + r.hometown + '", dob: "' + r.dob + '", source: ' + r.source_row + ')')));
P('');
P('**Rows whose own Cause text says "re-check"** (Cooney, per the Gonder note in the source):');
P(fmtList(qa.reCheckFlagged));
P('');
P('**Rows with no Cause cell at all in source** (the three footnote rows -- Hostile presumed');
P('per the document\'s own default rule, since none says "Non-hostile"):');
P(fmtList(qa.noCauseCell));
P('');
P('**Draft-status profiles** (Profile cell said "stub (draft)"):');
P(fmtList(qa.draftProfiles));
P('');
P('## Event slug-join (read-only enrichment beyond the literal markdown)');
P('');
P('The source markdown has no ' + code('event') + ' column. This generator additionally joins each KIA slug');
P('against ' + code('casualties.kia[]') + '/' + code('casualties.dow[]') + ' across every existing ' + code('site/events/*/index.md'));
P('front matter -- a deterministic, read-only lookup against already-published, human-curated');
P('event data (not an invented cross-reference). Rows below got ' + code('event') + ' populated this way:');
P('');
P(qa.eventJoin.length
  ? fmtList(qa.eventJoin.map((e) => e.resolved
      ? (e.slug + ' → ' + code(e.resolved))
      : (e.slug + ' -- AMBIGUOUS across ' + e.matches.join(', ') + ' (left blank, needs a human call)')))
  : '_no matches found_');
P('');
const joinedCount = qa.eventJoin.filter((e) => e.resolved).length;
P(qa.totalRowsParsed + ' rows parsed; ' + joinedCount + ' got an ' + code('event') + ' via this join; ' +
  (outRows.length - joinedCount) + ' have ' + code('event: ""') + ' (either genuinely undocumented in any event page yet, or an ambiguous match left for review).');
P('');
P('## Design decisions made by this generator (flag if any need revisiting)');
P('');
P('- **' + code('unit') + '** is set to ' + code('"D Co, 2/8 Cav"') + ' for both ' + code('organic') + ' and ' + code('attached') + ' rows. The');
P('  source distinguishes attachment status via ' + code('[att]') + ', not via a separate parent-unit column,');
P('  so this generator reads "attached" as "attached to D Co when killed" (serving with D Co at');
P('  time of death) rather than naming the soldier\'s actual parent unit, which the source doesn\'t');
P('  give. Confirm this reading is what ' + code('unit') + ' should mean for attached rows.');
P('- **' + code('suffix') + '** is a field not in the spec\'s example schema, added to avoid silently discarding');
P('  "Jr."/"III"/etc. from names rather than folding it into ' + code('last_name') + ' or ' + code('middle_name') + '. Drop or');
P('  fold it if you\'d rather match the schema exactly.');
P('- **Wall-only footnote rows** (Gundolf, Nelson Daniel Eugene Jr., Gulley Houston) are included');
P('  with ' + code('inclusion: "organic"') + ' (they appear on the D Co. Wall list) even though they\'re absent');
P('  from the honor roll used for the rest of the table. Flagged above under "missing hometown/dob."');
P('- No rows in the current source are ' + code('co_casualty') + ' or ' + code('causal') + ' -- see the integrity-check note');
P('  above regarding the Chinook checklist names.');
P('');
P('## Parse errors');
P('');
P(qa.parseErrors.length ? fmtList(qa.parseErrors.map((e) => e.__parse_error)) : '_none_');
P('');

fs.writeFileSync(OUT_REPORT, L.join('\n'));

console.log('Wrote ' + outRows.length + ' rows to ' + path.relative(ROOT, OUT_JSON));
console.log('Wrote QA report to ' + path.relative(ROOT, OUT_REPORT));
