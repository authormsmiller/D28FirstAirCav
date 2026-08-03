# Session Handoff -- 2026-07-15
**Session 97**
**Theme:** Phase 3 of the ORLL Digest & Cross-Reference build -- the digest-extraction
skill itself. Continues from `Handoff-Session96-ORLL-Digest-Skill-Phase1-2.md` (Phases
1-2 done) and its 2026-07-15 addendum (the Daily-Journal test scrape + three-date
reconciliation model).

**Scope decision (asked of Michael at the top of this session):** build the skill --
the deterministic engine + the full methodology doc -- but do not run it on a new
document yet. Both existing golden examples (AD0506273 ORLL, skipper-journal DJ) were
used only to validate the deterministic script, not as new intake.

---

## What was built

### 1. `scripts/cross-reference-engine.cjs` -- the deterministic half of Step 3

Takes one `digest.json` and joins it against `site/_data/kia.json`,
`site/_data/locations.json`, and `sources/fsb-locations/lz-vocabulary.json` to compute:

- **Pass 1 (KIA in range):** date + battalion (2-8/2/8) match, graded
  `candidate_exact_date_battalion_match` / `candidate_near_date_battalion_match` /
  `exact_date_other_unit` / `in_range_no_matching_event`. Near-date matching is
  deliberately restricted to single-casualty events (`us_kia === 1`) -- an aggregate
  multi-KIA tally (e.g. Carolyn's 10) isn't a plausible "same man, different date" match
  for an unrelated roster row, and without this restriction the script over-flagged
  (caught in validation: see below).
- **Pass 2 (casualty reconciliation):** flags any event naming a 2/8 sub-unit whose
  `us_kia` doesn't match the roster count on that exact date; surfaces nearby roster
  deaths (within a configurable `--near-days`, default 7) for the three-date-model check,
  per the addendum -- never auto-aligns.
- **Passes 4/5 (locations):** resolves raw site mentions against both foundations,
  case-insensitively deduped (the same site prints ALL CAPS in summary/coverage text and
  mixed case per-event -- e.g. "LZ CAROLYN" vs "LZ Carolyn" -- these are now merged, not
  double-counted), graded `confirmed` / `inferred` / `inferred_unresolved` / `unresolved`
  / `confirmed_no_tied_2-8_event`.

It writes exactly two new files next to the input digest --
`<accession>.candidates.json` (structured) and `<accession>.review.draft.md`
(pre-filled tables for Passes 1/2/4-5, headers for the rest) -- and never touches a
foundation or a page. Passes 3/6/7/8 (operations, personnel, awards, incident events,
and all narrative interpretation) are explicitly left to a human/Claude judgment pass;
the script does not attempt them.

**Usage:**
```
node scripts/cross-reference-engine.cjs --digest <path-to-digest.json>
```

### 2. `source-digest` skill -- the full methodology

Packaged as a Cowork skill (`source-digest.skill`, delivered to Michael separately for
install via Settings > Capabilities -- this session's tooling can't install a skill
directly). It encodes:

- Steps 0-5 of the spec's workflow, with the deterministic engine wired into Step 3.
- The five-axis triage (genre / echelon / temporal shape / provenance / OCR-or-transcription quality).
- The two-pass OCR read technique.
- Genre extensions to the one shared digest schema (DJ's `time`/`grid`/platoon-level
  `unit` fields, `coverage_gap`, WIA-to-KIA no-double-count rule) -- explicitly **not**
  a forked schema per genre.
- **The three-date reconciliation model, promoted from the addendum to permanent skill
  guidance** -- action date / source-logged date / Wall-of-record date, matched by
  circumstance + proximity, spread flagged and never auto-aligned. This is the one place
  the skill deliberately supersedes the original spec document's simpler two-date framing;
  the spec itself hasn't been edited to match yet (see Carry-forward below).
- All the non-negotiable guardrails from the original build brief (candidates not writes,
  citations everywhere, confirmed vs. inferred, ask before stub, honest empty passes).

The skill's own SKILL.md is the source of truth for the workflow going forward -- this
handoff summarizes it but isn't a substitute for reading it.

---

## Validation against both golden examples

Ran the script against both existing hand-built digests to confirm it reproduces their
deterministic findings (not the narrative/judgment parts, which it doesn't attempt):

**AD0506273 (ORLL):**
- 8 KIA-in-range rows (7 from the original golden review + `gulley-houston`, added to
  `kia.json` by the Phase-1 generator after the golden review was hand-written -- not a
  discrepancy, an improvement).
- 0 exact-date battalion matches, 3 `exact_date_other_unit` (Brown Neil, Brown George,
  Marchand -- matches the golden table's reasoning exactly), 5 `in_range_no_matching_event`.
- 1 casualty-reconciliation flag: the Carolyn 6 May event (10 US KIA reported, 0 on the
  roster that exact date) -- **the same single outstanding lead the golden review calls
  its centerpiece finding.**
- 12 deduped location candidates (2 resolved: Carolyn confirmed, Becky
  confirmed-no-tied-2-8-event; the rest unresolved or brigade-inferred), matching the
  golden table's Carolyn/St-Barbara/Ike/Grant/Joe-etc. structure.

**Skipper Journal (DJ):**
- 4 KIA-in-range rows, exactly matching the golden review's Ross/Winner/Weldin/Wheeler
  set: Ross, Winner, and Weldin all graded `candidate_exact_date_battalion_match`;
  Wheeler `candidate_near_date_battalion_match` against the nearest single-casualty
  event (correctly falls in the untranscribed 10-18 June gap per `coverage_gap` -- the
  skill's guidance flags this check explicitly, since the script itself doesn't parse
  free-text gap ranges).
- 2 casualty-reconciliation flags (4 Jun and 5 Jun events), with the nearby-roster-date
  offsets landing exactly on the golden review's own reasoning (+1d Weldin from 5 Jun,
  +2/+3d Winner from 5 Jun/4 Jun).
- 5 location candidates (LZ Carol resolved; Anne/Betty/Pedro/Green unresolved -- DJ
  genre gives grids instead, per the golden review's "DJ's superpower" framing).

**One real bug caught and fixed during validation:** the first script draft flagged
`dunkle-james` (ORLL, no golden-review enrichment) as a near-date candidate against the
10-KIA Carolyn aggregate event, purely on a 7-day offset. The golden review correctly
treats Dunkle as unrelated. Root cause: near-date matching shouldn't apply to aggregate
multi-casualty events at all -- only to single-casualty ones, where a specific "this man,
recorded late" read is plausible. Fixed by gating near-date matching on `us_kia === 1`.

---

## A tooling note worth repeating (same one from Session 96)

Editing `cross-reference-engine.cjs` with the file-editing tools produced a file that
`node`/bash saw as truncated mid-line -- the exact stale-bash-mount issue documented in
the Session 96 handoff. The fix was the same: rewrite the full file via a bash heredoc
(`cat > file << 'EOF' ... EOF`) rather than the file-editing tools, which resynced it
immediately. Small subsequent edits were then made safely via a Python find/replace run
through bash (not the file-editing tools), which didn't trigger the issue. If this
recurs: don't trust file-editing-tool writes for scripts in this repo without a
bash-side syntax check (`node -c <file>`) immediately after.

Also: `rm` on stale/scratch files in this session's mounts consistently failed
("Operation not permitted") -- both in the repo and in the session's own scratch
output folder. `scripts/synctest.cjs` in this repo is a harmless leftover from this
debugging (neutered to a one-line comment); safe to delete by hand whenever `rm` works
again.

---

## Where this leaves the build order

1. [x] `kia.json` generator (Session 96)
2. [x] Gazetteer restructure (Session 96)
3. [x] **Digest extractor / `source-digest` skill** (this session) -- built and
   validated against both golden examples; **not yet run on a new document.**
4. [~] Cross-reference engine -- the deterministic half (Passes 1/2/4-5) is done and
   bundled into the skill; the judgment passes (3/6/7/8) are documented as a required
   human/Claude step but have no tooling of their own, by design (they're interpretation,
   not computation).
5. [ ] Backfill -- run the skill across the 1965-1971 ORLLs (and any Daily Journals
   found). Not started.
6. [ ] Consumers (Wall of Honor page, location feature, event pages). Not started.

---

## Picking this back up

1. Install `source-digest.skill` via Settings > Capabilities if you want it available
   as a real Cowork skill (this session's tooling can only build/package it, not install
   it -- see the file delivered alongside this handoff).
2. First live run: pick a real new source (a not-yet-digested ORLL, or another Daily
   Journal if more Angry Skipper Association transcriptions get pulled) and run the full
   Step 0-5 workflow, ending in an approved `review.md` and, if warranted, actual writes
   to `kia.json`/gazetteer/event pages.
3. **Carry-forward, not urgent:** the spec document itself
   (`site/_docs/orll-digest-and-cross-reference-spec.md`) still states the older
   two-date casualty model in its Step-3 Pass-1 language. The skill's addendum
   supersedes it in practice, but the spec hasn't been edited to match -- worth doing
   once a few more documents confirm the three-date model holds up, rather than editing
   it off a single DJ test.
4. Carry-forward flags from Session 96 (1967 KIA-list undercount, Chinook
   crew/non-D-Co passengers not yet in `d-co-kia-list.md`, 7 same-name gazetteer splits
   to eyeball, locations.json/hand-authored-pages cross-link decision) are all still open
   and untouched this session.
