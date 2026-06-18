# d281staircav — Session 70 Handoff
**Date:** June 18, 2026
**Continues from:** Session 69 (Marvin letters; BMB design)
**Theme:** A big information-intake session. Added **six more Marvin letters** (incl. dating an
undated one); fixed a **site-wide search regression**; built/enriched **events from primary
sources** (CAVALAIR newspaper + the Pleiku Campaign AAR); and assembled a **firebase-location
dataset** for a future "where was this soldier" feature. Lots of new research material staged in
`sources/`.

---

## What Session 70 accomplished

### Marvin Miller letters (now 20 total)
Transcribed and built, in canonical letter format (`soldiers/miller-marvin-dale/letters/`):
- **26 Dec 70**, **9 Mar 71** (confirms move to FSB Fontaine), **22 Mar 71** (Vung Tau stand-down,
  corroborated by McGrew's calendar; Clay–Frazier fight), **20 Aug 71** (DEROS "105 days";
  hunting → Romani testimony; Judy's baby **Mark**), **8 Sep 71**, **21 Sep 71** (cut-thumb
  follow-up).
- **Undated pencil letter → dated to ~26–28 April 1971** (`...letter-1971-04-undated`,
  doc_date 1971-04-27, date_known:false) via the Pat-letter thread, garden, Vung Tau, "5 months,"
  Pirates. The **22 May 71** letter's "first letter after the April events" note was revised
  accordingly.
- Family glossary additions (research tree): nephew **Mark** (Judy's son), brother-in-law
  **Rudy** (m. Carolyn), **Steve Kovalchik** (m. Evelyn, div. late 1970s) — in
  `soldiers/miller-marvin/documents/MDM-FAMILY-BACKGROUND.md`.

### SEARCH REGRESSION FIXED (three causes)
1. **Marvin vanished from search** — the Session-69-era **Edit tool truncated
   `miller-marvin-dale.md`** (dropped the `notes:` block + closing `---`); 11ty rendered it but
   `searchIndex.js`'s strict front-matter regex skipped him. **Repaired** (restored notes +
   closing `---`).
2. **Letters gone from search** — the letter migration (out of `documents/`) left them where
   `searchIndex.js` never looked. **Added a letters pass** (type `letter`) + a dedicated
   **Letters group** in `search/index.njk`.
3. **Profile-photo 404** — front matter said `.jpeg`, file is `.jpg`. **Fixed.**
   (Also flagged but NOT fixed: **colburn-richard** is missing from search — pre-existing
   truncated profile file, notes cut mid-sentence; left for Michael.)

### Events / documents built from primary sources
- **Garryowen event** (`3rd-brigade-separate-garryowen-1971`): added a sourced **26 Mar 1971
  division standdown** subsection + attached the **CAVALAIR 14 Apr 71** standdown special as a
  document (`documents/unit/cavalair-19710414`, PDF in `assets/docs/`).
- **NEW incident event** `duds-firebase-fontaine-1971-03` ("'Duds' Hit Firebase") from the
  CAVALAIR 10 Mar 71 article; wired the existing `duds-hit-firebase` doc to it and **identified
  its long-unknown source** (CAVALAIR Vol. 5 No. 10). Injects onto Weaver (confirmed) and Miller
  (probable) timelines.
- **Pleiku Campaign AAR** added as a document (`documents/unit/pleiku-campaign-aar-1965`, PDF in
  `assets/docs/`); **enriched the `pleiku-campaign-1965-11-04` event** with the AAR's 4 Nov 2/8
  scheme of maneuver (Recon plt + A Co at **ZA978050**, out of **Position "Cavalair"**; 12
  captured/14 enemy KIA), fixed **Hill 732 = YA885106**, and added a restrained **company-attribution
  discrepancy note** (AAR names Recon/A/C Co, not D Co; KIA recorded D Co on the Wall — noted, not
  resolved). Confirmed "Position Cavalair" = Doc Wilson's "LZ Cavalier."
- **New timeline entry** on Marvin: **16–22 Jul 1971 "A Few Days at FB Oldham"** (D Co 2/8,
  grid ZT077004).

### Firebase-location dataset (research tree, `sources/fsb-locations/`)
- Held the full **FSB-locations gazetteer** (`FSB-locations.pdf`, 553 pp.) for provenance.
- **`2-8-cav-fsb-list.md`** (202 entries naming 2/8th Cav), **`2-8-cav-cp-list.md`** (10 battalion
  CPs), **`2-8-cav-fsb-by-year.md`** (grouped 1965–72).
- Resolved **Fanning ≠ Fontaine** (different grids); identified **FB Oldham** (D 2/8, 16–22 Jul 71)
  as the "base nobody could place"; flagged name traps (**Oldham/Ham Tan**, **multi-Mace** incl. a
  Delta one).
- **`LOCATION-FEATURE-CONCEPT.md`** — design note for the "where was this soldier" feature
  (two tie-ins: "I was there" UI submission = confirmed; service-date-range auto-match = derived
  KIA timelines).

### CAVALAIR harvest (paused mid-way)
- `sources/cavalair/` — `FINDING-AID-cavalair-vva.md` (TTU search guide) + `2-8-cav-index.md`
  (2/8 content logged issue-by-issue). Mirror issues processed: 26 Nov 69 → 24 Dec 69 + 8/15 Apr
  70; TTU files processed: 14 Jan 70, 11 Feb 70, 25 Feb 70, **2 Mar 71** (FSB Fontaine bicycle
  "500" — parked, no clean Unit-History home yet), 10 Mar 71, 14 Apr 71.

---

## DEPLOY — full sequence required (photos + assets changed)
```
node admin/scripts/backfill-r2.js      # repo root — uploads new woodblock photo
cd site && npm run build               # build
xcopy /E /Y assets _site\assets        # from site/ — for the 2 new /assets/docs PDFs
npx wrangler deploy                    # from site/
```
Then **push via GitHub Desktop** (terminal pushes fail). If wrangler auth error (10000):
`npx wrangler logout` → `npx wrangler login` (authormsmiller@gmail.com).
- New R2 binary: `chieu-hoi-woodblock.jpg`. New assets: `cavalair-19710414.pdf`,
  `pleiku-campaign-aar-1965.pdf`. Last clean build this session: **303 files**.

---

## CRITICAL LESSONS
1. **Edit-tool truncation struck AGAIN** — on `miller-marvin-dale.md` (the Blagg entry, Session
   69/70), silently dropping the file tail and breaking search. **RULE (reinforced): for files
   >~7KB do NOT use the Edit tool — use python read/replace/write and verify by content.** All
   large-file edits this session used python.
2. **searchIndex.js needs a closing `---`** — its hand-rolled front-matter regex skips any soldier
   file missing the closing delimiter (11ty/gray-matter is lenient and hides the problem). Watch
   for other truncated profiles (colburn-richard is one).
3. **Documents attach to events via `event: <slug>`** → appear in the event's Documents tab.
   **Downloadable PDFs go in `site/assets/docs/`** and are linked inline (passthrough is disabled;
   xcopy on deploy). Photos serve from R2 (`/media/photos/...`) via `backfill-r2.js`.
4. **CAVALAIR OCR caution:** "Delta Company" alone often = 1/5 or 2/12 Cav — always pair with
   "8th." Gazetteer "AD######" tokens are DTIC citation codes, not grids.

---

## OUTSTANDING / CARRY-FORWARD
- **colburn-richard** missing from search (pre-existing truncated profile) — add a closing `---`
  / restore the cut notes when ready.
- **CAVALAIR harvest** not finished — remaining `cavair` files: `2770Newspaper610630–633`,
  `3860106005` (21 MB), `6910109003`, the `2405…` items, plus mirror issues after 24 Dec 69
  (31 Dec 69, 7/21 Jan, 4 Feb, 11 Mar, 29 Apr, 20 May, 3 Jun, 5 Aug 70).
- **Bicycle "500" feature (2 Mar 71)** — parked; no clean Unit-History home yet (Michael deciding).
- **Locations going live** — not yet. Next engineering step: parse the gazetteer's messy date
  strings into structured start/end + canonical base IDs, then build the date-range matcher and
  the "I was there" submission flow. See `sources/fsb-locations/LOCATION-FEATURE-CONCEPT.md`.
- **Pleiku Nov-4 company attribution** — AAR (Recon/A/C Co) vs Wall (D Co) discrepancy noted, open.
- Out of scope (decided): two C Co 2/8 KIA from the Dog's Head / 26 Mar 70 fighting (not D Co).
