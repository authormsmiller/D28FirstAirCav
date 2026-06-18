# d281staircav — Session 68 Handoff
**Date:** June 16, 2026
**Continues from:** Session 67 (1969-10-08 Song Be cluster; division/brigade op-context pages)
**Theme:** the 1965 operational frame; a NON-COMBAT-DEATHS framework (coverage model + Getter
event + KIA casualty-type column); "first in, last out" deployment/departure bookends; a
collapsible timeline; and a 1st Cav division-operations research list. (Sprawled across several
subjects — future sessions should hold to one.)

---

## What Session 68 accomplished

### 1965 operational frame
- **`site/events/operation-all-the-way-1965/index.md`** (type: operation, published) — the 1st
  Brigade pursuit phase of the Pleiku Campaign (Long Reach Phase I, 27 Oct–9 Nov 1965), the
  specific operation containing the 4 Nov 1965 D Co losses. Written at operation level (not a
  vague umbrella) because the evidence supports it — the **echelon-precision principle**.
- Cross-linked `pleiku-campaign-1965-11-04` ⇄ All the Way (parent-operation / tactical-action).

### Non-combat-death framework (the session's core)
- **`site/_docs/coverage-model.md`** — standing 3-tier convention: Tier 1 event page (every
  in-service death, combat OR non-combat), Tier 2 operation context page (echelon-precision
  principle), Tier 3 the complete picture. Key principle: **"non-combat deaths are still war
  deaths"** — "non-hostile" is a classification, not a cause. **Status convention RESOLVED:**
  keep `status: kia` (the site's grouping for the fallen, as the Wall carries them); carry the
  truth in `cause_of_death: non-hostile` + a truthful timeline label ("Non-Hostile — Malaria")
  + the event page. Applied to **getter-james** and **benson-joseph**.
- **`site/_docs/d-co-operational-timeline.md`** — coverage tracker (counterpart to the KIA list),
  year-by-year, now includes non-combat deaths and notes the new Cause column.
- **PFC James Getter** (malaria, 16 Mar 1971): `soldiers/getter-james/` profile + photo, and
  **`events/getter-malaria-1971-03-16/`** (type: incident, published) — the archive's FIRST
  non-combat-death event page. Rank corrected PVT→**PFC**; platoon left blank (unverified Cat
  lead noted); place of death = probable 24th Evac, Long Binh (framed probable, cited). Malaria
  progression section included to jog veterans' memories; public oq about others falling ill
  (shared mosquito exposure — malaria is NOT person-to-person; corrected the contagion premise).
- **KIA list Cause column** (`d-co-kia-list.md`): added a casualty-type column across all 8 year
  tables. **26 non-hostile deaths surfaced** that were hiding in a "KIA" list — the **1972 Chinook
  21 (mechanical, hostile fire ruled out)**, the 1969 river-crossing 3 (drowned), Getter (malaria),
  Roberts (overdose). Legend marks "Hostile" as presumed-pending-verification.

### "First in, last out" — deployment & departure bookends
- **`site/_docs/first-in-last-out-documentation.md`** — the documentary record (CMH Airmobility/
  Tolson; division Interim Report; 2/8 Cav Lineage & Honors; Pleiku AAR AD0855112; 3rd Bde ORLLs).
- **`events/deployment-vietnam-1965/`** (type: operation, dated 1965-07-01 → sorts FIRST) and
  **`events/departure-vietnam-1972/`** (type: operation, dated 1972-06-28 → sorts LAST). 2/8 Cav
  brackets the whole war: in country Sept 1965 → inactivated 28 Jun 1972. Verified timeline order.

### Timeline UI (unit-history.njk)
- Type sections (Contact/Incidents/Crashes/Operations/Memorials) and year markers are now native
  `<details>/<summary>` collapsibles, each showing a **child-event count** (e.g. "1971 (3)").
  **Types default OPEN, years default COLLAPSED** (scannable index; better on mobile). Counts use
  the already-computed `typeEvents.length` / `yearEvents.length`. Caret rotates on open.
- **First in / Last out** teal pills on the deployment/departure cards (slug-conditional in the
  card; `.uh-bookend` CSS in the scoped `<style>`).
- A mockup of the collapsible timeline was shown to Michael and approved.

### Research list
- **`site/_docs/1st-cav-division-operations-vietnam.md`** — scraped the TogetherWeServed synopsis
  (staged at KIA root) into a year-by-year **paper trail** of division operations (Masher/Crazy
  Horse/Thayer '66, **Pershing '67**, Jeb Stuart/Pegasus/Delaware '68, Cambodia '70, etc.). Each a
  lead to confirm for D Co — NOT asserted involvement. Flags gaps vs archive coverage.

---

## CRITICAL LESSONS

1. **Mount file-tool truncation bit REPEATEDLY this session.** The Edit tool silently truncated
   the tail of files >~7KB (kia-profile-playbook.md, the Pleiku casualty page, AND .eleventy.js —
   all reported success, all cut at the end). Caught each via verification and restored.
   - **RELIABLE write methods (use these):** a single `cat > file <<'EOF' … EOF` heredoc (full
     rewrite); a single `head -N … > tmp; cat >> tmp; tail -n +M … >> tmp; mv tmp file`
     reassembly; `sed -i` single-line substitutions; small one-line Edit-tool edits.
   - **UNRELIABLE (avoid):** the Edit tool on files >~7KB (truncates the tail); a CHAIN of
     multiple head/tail/mv ops in one script (corrupted the Getter event page into garbage —
     rebuilt from a single heredoc); python read-modify-write on files >~10KB.
   - **ALWAYS verify after any non-trivial write:** `wc -c`, `tail`, delimiter/tag balance
     (`grep -c '^---$'` == 2; `<details>`==`</details>`), and YAML parse.
2. **File DELETES are blocked on this mount** ("Operation not permitted" on `rm`). Could not
   delete `roberts-charles` files, nor `unit-history.njk.bak` / `.bak2`. To hide a profile use
   `draft: true` (see below); to actually delete, the user must do it (or use a delete tool).
   **Two stray backups remain: `site/unit-history.njk.bak` and `.bak2` — Michael to delete.**
3. **Soldier draft mechanism (new):** `.eleventy.js` now filters `!s.data.draft` from the
   `soldiers`, `kia`, and `allPhotos` collections. Add `draft: true` to a soldier's front matter
   to keep the profile in the repo but OFF the site (unlisted). The standalone page URL still
   builds but is unlinked.
4. **Roberts — one source can't beat three.** Honor States, Virtual Wall, and the honor roll all
   say **D Company**; only a single coffeltdatabase narrative says HHC (and supplies the Darlac/
   overdose detail, which **may describe a different same-named Roberts**). Kept as D Co but held
   in **draft**. Darlac (II Corps) also conflicts with the unit's III Corps AO; McGrew's July
   calendar puts the company in III Corps on 18 Jul 1971.
5. **Malaria is not person-to-person** (mosquito-vector only). A malaria case signals shared
   exposure, not contagion — reframe any "did contact spread it" instinct accordingly.

---

## Outstanding / carry-forward

- **SITE BUILD STILL HELD** (batch deploy). The pending batch is now LARGE — everything from
  Sessions 66–68. Deploy = `npx @11ty/eleventy` build + `xcopy /E /Y assets _site\assets` (from
  `site/`) + `wrangler deploy`, push via GitHub Desktop. **Run `node -c site/.eleventy.js` first**
  (it was truncated + repaired this session — passes now, but re-verify before building).
- **Roberts (`roberts-charles`, draft):** resolve D Co vs HHC and the same-name conflation —
  contact **CPT Neal** (D Co commander), pull **DCAS / DA casualty file (IDPF)**, **Texas Tech**,
  and the **2/8 Cav Daily Staff Journal, July 1971 (NARA RG 472)**. If confirmed D Co, remove
  `draft: true` to publish. Research checklist is in his profile admin notes.
- **coverage-model.md still uses Roberts as an example** in the "non-combat deaths" section —
  revisit once his status resolves (he may not belong if HHC).
- **Exact DA General Order numbers** for the deployment/departure events (oq-01 on each) — pull
  from CMH Lineage & Honors certificates (JS-rendered, weren't fetchable) and NARA GO volumes.
- **R2 photo upload** for getter-james (`node scripts/upload-soldier-photos.cjs getter-james`);
  roberts-charles only if/when published.
- **Two ORLL PDFs staged at KIA root** (AD0506273, AD0520447) — primary division records for the
  gap years.

---

## NEXT SESSION — hold to ONE subject

**Recommended: 1967 / Operation Pershing.** Biggest gap — **18 organic D Co KIA, no pages**.
Pershing ran ~12 Feb 1967–Jan 1968 (Bình Định, II Corps), so nearly every 1967 loss should attach
to it. Workflow: cluster the 1967 KIA dates from `d-co-kia-list.md` → build Tier 1 event pages per
the `kia-profile-playbook.md` → then a Tier 2 `operation-pershing-1967` context page once 2/8
Cav's role is confirmed (ORLLs + RG 472). See `1st-cav-division-operations-vietnam.md`.
Then in later sessions: **1966** (Masher/Crazy Horse/Thayer, 5 KIA) and **1970 / Cambodian
Incursion** (10 KIA).

---

## Technical notes (permanent)
- **New docs this session:** `_docs/coverage-model.md`, `_docs/d-co-operational-timeline.md`,
  `_docs/first-in-last-out-documentation.md`, `_docs/1st-cav-division-operations-vietnam.md`.
- **New event pages:** operation-all-the-way-1965, getter-malaria-1971-03-16, deployment-vietnam-1965,
  departure-vietnam-1972. **New (draft) profile:** roberts-charles. **New profile:** getter-james.
- **KIA list** now has a **Cause** column (per-table; "Hostile" = presumed-pending-verification).
- **Timeline collapsibles:** unit-history.njk — `<details class="uh-type" open>` /
  `<details class="uh-year">` (years collapsed); `.uh-count`, `.uh-bookend` in the scoped style.
- **Draft soldiers:** `draft: true` + the `.eleventy.js` collection filters.
- **Mount truncation:** heredoc/sed/single-reassembly only for >7KB; always verify. Deletes blocked.
