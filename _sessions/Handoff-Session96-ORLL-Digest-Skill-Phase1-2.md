# Session Handoff — 2026-07-14
**Session 96**
**Theme:** ORLL Digest & Cross-Reference Skill build — Phase 1 (`kia.json` generator) and
Phase 2 (gazetteer restructure) both complete. Paused before Phase 3 (the ORLL digest
extractor), which is the judgment-heavy phase and needs a fresh session.

Continues from: `Handoff-ORLL-Digest-Skill-Build.md` (the original build brief — still the
canonical spec reference; re-read it plus `site/_docs/orll-digest-and-cross-reference-spec.md`
and `site/_docs/data-standards.md` before resuming).

---

## ADDENDUM 2026-07-15 — Phase-3 test + reconciliation model (READ before building the digest/cross-ref)

A Phase-3 **test scrape** was run on a *Daily Journal* — a different, higher-fidelity genre than the ORLL golden example. Open it as a **second worked example** alongside `AD0506273`:

- `site/sources/dj/1968/skipper-journal-jun-jul-1968.digest.json` — the digest (clean transcribed text, not OCR)
- `site/sources/dj/1968/skipper-journal-jun-jul-1968.review.md` — the cross-ref + scrape-completeness check

Source is the D/2-8 company daily journal (Jun–Jul 1968), transcribed on the veterans' association site. Not committed; new `sources/dj/<year>/` folder convention introduced for this genre.

### The reconciliation model changed — this supersedes the spec for Phase 3

The spec's casualty-reconciliation guidance still implies a simpler **two-date** model (journal date-of-action vs Wall date-of-record). **Use this three-date model instead** until the spec is updated:

- The daily journal was kept **in the rear, not with the company in the field.** Note-takers logged what the field element reported, when it reached them over the net.
- **Tactical/operational data** (contact time, grid, materiel, movement) came through in near-real-time → **high confidence.**
- **Personnel/casualty status** (who; and KIA vs MIA vs WIA) **lagged** — accurate accounting trailed the fighting.
- So a casualty carries **three dates** — *action*, *journal-logged*, *Wall-of-record* — and **none is guaranteed to match.** Match on **circumstance + proximity**, record all three with their source, and **flag the spread; never auto-align to one date.** (Model case in the test: the 4 June KIA was carried MIA and only resolved to KIA on the 7th — which is the Wall date for the likely man, Winner.)

**Cross-ref engine behavior:** treat journal `time`/`grid`/action fields as reliable; treat journal personnel/status as a *lagged* signal, not ground truth. KIA matches from a DJ remain **candidates to verify** — the journal names no individuals, so identities are inferred from date+company+circumstance.

### Daily-Journal genre notes for the digest schema

- The digest needs optional **`time` (HHMM)** and **`grid` (MGRS)** fields, populated for DJs, null for ORLLs — same schema, finer fields.
- **WIA→KIA within a day = one casualty with a state note**, not two (see 4 Jun, 5 Jun, 1 Jul in the test). Do not double-count.
- Capture **platoon-level unit** (`1D/2-8`, `2D/2-8`, `3D/2-8`).
- The risk here is **transcription noise, not OCR** — the source flips grid prefixes (`TD`/`YD`) in the same AO and has minor typos. **Normalize cautiously and flag; do not silently correct** (raw note stays authoritative, same as the gazetteer rule).
- DJs are the **highest-yield genre tested** (grids + platoon detail + individual casualties) — but the work shifts from extraction difficulty to disciplined reconciliation.

---

## Where this fits in the build order

From the handoff brief's build order:

1. ✅ **`kia.json` generator** — done this session.
2. ✅ **Gazetteer restructure** — done this session.
3. ⬜ **Digest extractor** — NOT started. This is next.
4. ⬜ **Cross-reference engine** — NOT started. Depends on #3.

Phases 1–2 were explicitly called out in the spec as "deterministic and safe to complete
autonomously." Phase 3 is explicitly the hard one — "expect iteration against page images."
Don't try to rush into it in a short session; it needs the golden example
(`site/sources/orll/1969/AD0506273.digest.json` + `.review.md` + the source PDF) open and
compared page-by-page.

---

## Completed this session

### Phase 1 — `kia.json` generator

- **Script:** `scripts/generate-kia-json.cjs`
- **Output:** `site/_data/kia.json` (110 rows) + `site/_docs/kia-json-qa-report.md`
- Parses `site/_docs/d-co-kia-list.md` (never hand-edit the JSON — markdown stays the source
  of truth). Idempotent — reran and diffed clean.
- Added an `event` field via a **read-only** join against `casualties.kia[]`/`dow[]` in every
  existing `site/events/*/index.md` — not in the original schema example but squarely in the
  spirit of the field. 52 of 110 rows got an event this way; ambiguous matches (e.g.
  Yates/Keller matching both an operation page and a specific contact page) were left blank
  and flagged rather than guessed.
- Added a `suffix` field (Jr./III/etc.) not in the spec's literal schema, to avoid losing
  that data — flagged as a design decision in the QA report, easy to drop if unwanted.
- **QA findings worth reading:**
  - Row count parses to 110, not the header's "111 individuals." Traced to the **1967**
    section specifically — its header says "18 organic + 2 attached" but the table itself
    has **three** `[att]`-tagged rows (Willis, Middleton, Bennett), and no footnote explains
    the gap the way there is for 1968 (Ahern) and 1969 (Gulley). Genuinely unresolved —
    worth a look before trusting any other section header at face value.
  - Zero rows in the current markdown are `co_casualty`/`causal` — the Chinook crew (5) and
    non-D-Co passengers (7, from `chinook-crash-kia-checklist.md`) are **not yet** rows in
    `d-co-kia-list.md`. If you want them in `kia.json`, they need to be added to the markdown
    first (markdown is source of truth) — the generator won't invent them.
  - Williams duplicate confirmed resolved, no slug collisions, no DOD outside 1965–1972.

### Phase 2 — Gazetteer restructure

- **Script:** `scripts/generate-locations-json.cjs`
- **Output:** `site/_data/locations.json` (185 sites, 211 occupancies) +
  `sources/fsb-locations/lz-vocabulary.json` (regenerated) +
  `site/_docs/locations-json-qa-report.md`
- Parses `sources/fsb-locations/2-8-cav-fsb-by-year.md` (raw note stays authoritative).
  Idempotent.
- **Two design questions were asked and answered before building** (both picked the
  recommended option — see the report for full reasoning):
  1. Same-name rows cluster into one physical site only within **~5km** (typical
     re-survey/shift distance); farther apart = name reuse = separate sites. Caught 7 real
     cases: **Amy** (split into 3 — two different `LZ Amy`s ~45km apart across 1965/66, plus
     an unrelated `Ps Amy`), Falcon, Sue, Quarter, Kim, Nickel, Pat. All flagged in the QA
     report for review, none silently merged.
  2. The 13 existing hand-authored `site/locations/*/index.md` pages (fsb-fanning,
     fsb-silver, fsb-mace, etc.) are **intentionally not cross-linked** to the new generated
     registry yet — they stay a separate, richer, human-curated layer. Worth revisiting later
     if you want one unified id space.
- **Numeric-key vocabulary bug** (the explicitly flagged cleanup item): fixed. `lz-vocabulary.json`
  no longer has bare-number keys ("2","3","5","7","8") that silently merged different
  prefixes together. Now "OP 3", "Ps 3", "Ps 2", "LZ 5", "OP 7", "OP 8" are distinct entries.
  Per a follow-up answer, the **same 5km clustering was applied to the whole vocabulary**,
  not just the numeric case — this changed its key format from bare canonical names to slugs
  (e.g. "Amy" → `lz-amy`/`lz-amy-b`/`ps-amy`). Nothing in the repo reads this file
  programmatically yet, so this was a safe breaking change — flagged prominently in its
  `_meta` block and the QA report in case that changes.
- `named_for` resolves against the **union** of `kia.json` slugs and `site/soldiers/*`
  directory names, not just `kia.json` — FSB namesakes are often not D Co KIAs. Confirmed
  correct against ground truth: `fb-fanning`→`fanning-martin`, `fb-jeffries`→`jeffries-gabriel`,
  `fb-hall`→`hall-joseph`, `fb-makowski`→`makowski-william` all resolved; `fb-fontaine` and
  `fb-westphal` correctly came back unresolved (checked the existing `fsb-fontaine` page
  itself, which states Fontaine is "a soldier outside this archive" — the generator's null
  result matches that).
- Every occupancy row carries site + unit + date (year at minimum, best-effort finer date
  where a regex could find one — the raw note stays authoritative, per
  `LOCATION-FEATURE-CONCEPT.md`'s explicit deferral of real date-range parsing) + source +
  confidence. Acceptance checks all pass — see the QA report for the full breakdown.

---

## A tooling gotcha worth knowing about

Partway through this session, the sandbox's shell (bash) started seeing a **stale, truncated
copy** of files I'd edited with the file-editing tools — e.g. `generate-kia-json.cjs` would
show the full, correct content when read normally, but `node` running against the
bash-mounted path would hit a syntax error mid-file, cut off at the same byte offset
regardless of what I'd actually written. Deleting the stale files from bash also silently
failed ("Operation not permitted"). The fix was to write the script's full contents directly
via a bash heredoc (`cat > file << 'EOF' ... EOF`) instead of the normal file-editing tools —
that resynced things immediately. If this happens again: don't trust `wc -c`/`wc -l` from
bash as proof of what's really in a file if you've been editing it with the file tools;
rewrite it via heredoc and re-check.

Also: `scripts/gen-kia-b.cjs` and `scripts/generate-kia-json-run.cjs` are leftover scratch
files from debugging that same issue — both neutered to a one-line comment, harmless, but
worth deleting outright if you get a working `rm` on them.

---

## Files created this session

- `scripts/generate-kia-json.cjs`
- `site/_data/kia.json`
- `site/_docs/kia-json-qa-report.md`
- `scripts/generate-locations-json.cjs`
- `site/_data/locations.json`
- `sources/fsb-locations/lz-vocabulary.json` (regenerated, not new, but fully rewritten)
- `site/_docs/locations-json-qa-report.md`
- `scripts/gen-kia-b.cjs`, `scripts/generate-kia-json-run.cjs` (dead scratch files, ignorable)

None of this is committed — working tree already shows a large pre-existing set of modified
files unrelated to this session (line-ending or intake-log churn, by the look of it); didn't
touch git. Push whenever you're ready, per the usual GitHub Desktop workflow.

---

## Picking this back up

1. Re-read `site/_docs/orll-digest-and-cross-reference-spec.md` (Artifact 3 + the "Extraction
   method" and "Two-pass read" sections) and `LOCATION-FEATURE-CONCEPT.md`.
2. Open the golden example side by side with its source PDF:
   - `site/sources/orll/1969/AD0506273.digest.json` (target shape)
   - `site/sources/orll/1969/AD0506273.review.md` (target Step-5 cross-ref output)
   - `site/sources/orll/1969/AD0506273-orll-1cav-jul69.pdf` (the actual source — 73pp,
     declassified OCR quality varies badly by section per the spec's own notes)
3. Start with Step 1 (triage) on that same document before attempting extraction — the spec
   wants a yield profile (genre × echelon × temporal shape × provenance × OCR era) before any
   passes run.
4. This will almost certainly need to read page images directly (not just OCR text) given
   "cover pages near-illegible; summary/list pages clean; dense justified narrative noisy" —
   plan for that rather than trusting a text extraction alone.
5. `locations.json` and `kia.json` are both now available as lookup targets for the
   cross-reference engine in Phase 4 — the digest skill in Phase 3 doesn't need to wait on
   anything further from Phases 1–2 to begin.

---

## Carry-forward flags from this session (not urgent, just don't lose them)

- 1967 KIA-list section header undercounts attached soldiers by one (see Phase 1 QA report).
- Chinook crew (5) + non-D-Co passengers (7) are documented in
  `chinook-crash-kia-checklist.md` but not yet merged into `d-co-kia-list.md` — a markdown-
  editing decision for Michael, not something either generator should do unilaterally.
- 7 same-name/different-site splits from the gazetteer restructure are flagged for review in
  `locations-json-qa-report.md` (Amy ×3, Falcon, Sue, Quarter, Kim, Nickel, Pat) — worth a
  skim to confirm the splits look right, though nothing is blocking on this.
- Whether/when to cross-link the generated `locations.json` site registry to the 13 existing
  hand-authored `site/locations/*/index.md` pages is still an open, deferred decision.
