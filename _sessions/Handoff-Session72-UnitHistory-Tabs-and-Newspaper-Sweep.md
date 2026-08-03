# d281staircav — Session 72 Handoff
**Date:** June 19, 2026
**Continues from:** Session 71 (Locations feature; FSB Fontaine; Garvin v05 deck)
**Theme:** Rebuilt the **Unit History page into a tabbed, type-grouped layout** (the top
carry-forward from Session 71), deployed it live, and **prepped the next session's
newspaper sweep** of the `cavair/` CAVALAIR archive.

---

## What Session 72 built

### Unit History → tabbed page (Model A)
- **`site/unit-history.njk`** fully rebuilt. Backup at **`unit-history.njk.bak`**.
- **Top matter kept:** the "First In, Last Out" era block (lightly revised kicker +
  closing note that now points to the tabs). Still paints its own light `.uh-era` panel.
- **Six type tabs**, hide-if-empty, with counts: **Contact (6) · Incidents (6) ·
  Crashes (2) · Operations (10) · Morale (1) · Memorials (2)** = 27 published events.
  **Contact** is the default-open tab.
- Each tab lists its events **grouped by year** (year sub-header + count + rule line),
  reusing the existing `.uh-card` rows (date col, casualty pills, First in / Last out
  bookends). Dates now run through the **`locDate`** filter ("4 Nov 1965", "Mar 1971").
- **Reuses the soldier/location tab shell** — `.tabs-bar` / `.tab[data-tab]` /
  `.tab-content#tab-<type>` + the inline `activateTab` + hash deep-link script. So
  `/unit-history/#operation` opens that tab. `.tab-content` paints the light reading
  surface (`var(--pg)`, 36px/48px) — satisfies the dark-hero/light-panel rule for free.
- A safety **"Other"** tab renders only if a published event has a type outside the six.
- Verified: clean build (312 files), every event lands in the right type tab + year,
  no leaked `{% %}`/`{{ }}` tokens. **Deployed and confirmed live.**

### Design decisions (so we don't relitigate)
- **Model A over Model B.** Tabs = event *types* (not facets like Overview/Timeline).
  Michael's call: people explore by kind, and it avoids overcrowding any one tab.
- **No "All"/chronological tab** — it would duplicate events the type tabs already hold
  and push the tab bar into needless horizontal scroll.
- **Wall of Honor = its own page, NOT a tab** (future task). The **Memorial type tab
  stays** (Colburn service, NF34 ceremony are commemoration *events*); the Wall of Honor
  is the separate roster of the fallen.

---

## CRITICAL LESSON — deploying this site
**`npx wrangler deploy` does NOT build. It uploads whatever is already in `site/_site`.**
Two deploys appeared to "do nothing" because `_site` was stale — the new HTML had never
been regenerated. The fix / rule:
```
cd site
npm run build      # regenerates _site from source  ← MUST run first, every time
npx wrangler deploy
```
- Watch wrangler's output: it should report **uploading new assets**. "No files to
  upload / 0 new" = the build didn't refresh `_site` (wrong dir, or build skipped).
- **It was NOT edge cache.** Confirmed by fetching `/unit-history/?v=...` (cache-buster)
  and still getting the old page — proof the *deployed files* were old, not a CDN copy.
- **`git push` (GitHub Desktop) does NOT deploy production.** Only `wrangler deploy`
  does. The lone GitHub workflow is `sync-photos.yml`.
- **Two `wrangler.jsonc` files share the worker name `d281staircav`:** the repo-root one
  serves the `admin/` folder; **`site/wrangler.jsonc`** serves `./_site` and owns the
  `angryskipperarchive.org/*` routes. **Always deploy from `site/`.** Deploying from the
  root would push admin assets onto the same worker and break the public site. (Optional
  cleanup: rename the root worker, e.g. `d281staircav-admin`.)

---

## NEXT SESSION (primary task): sweep the `cavair/` newspapers
Goal: read the **CAVALAIR** ("The First Team") division-paper issues in `cavair/` and pull
anything useful into the archive — events, D Co. soldier mentions, firebase/location
references, transcribable articles, and captioned photos.

### Catalogue of `cavair/` (verified June 19) — chronological
CAVALAIR issues (all have EXTRACTABLE TEXT unless noted — grep-able):
| File | Issue / Date | Notable front-page item |
|---|---|---|
| `6910109003.pdf` | Vol 1 No 38 · An Khe · **6 Aug 1966** | earliest issue |
| `24050140001.pdf` | Vol 2 No 42 · **1967** | "Cav Still Follows Pattern" |
| `3860106005.pdf` | **29 Nov 1967** (8 pp) | — |
| `24050142001.pdf` | Vol 2 era · date unclear (poor OCR) | garbled scan text |
| `24050429001.pdf` | Vol 2 No 73 | "Division Ousts NVA in Lang Vei" |
| `2770Newspaper610633.pdf` | Vol 3 No 13 · **7 May 1969** | Presidential Unit Citation |
| `2770Newspaper610631.pdf` | ~**May 1969** | Gen. Roberts new CG (5 May ceremony) |
| `2770Newspaper610632.pdf` | Vol 3 No 20 · **14 May 1969** | MG Roberts takes reins |
| `2770Newspaper610630.pdf` | Vol 3 No 22 · **28 May 1969** | COL Greene, Blackhorse Bde |
| `2770Newspaper610677.pdf` | Vol 4 No 2 · **14 Jan 1970** | Song Be villagers / Xmas |
| `11feb70.pdf` | Vol 4 No 6 · **11 Feb 1970** | DIVARTY promotion |
| `25feb70.pdf` | Vol 4 No 8 · **25 Feb 1970** | "Cav Beats Back Attacks on Tina" |
| `8april1970.pdf` | Vol 4 No 14 · **8 Apr 1970** | "Alpha Blues Surprise NVA" |
| `20may70.pdf` | **20 May 1970** | Cambodia / Operation Toan Thang 43 |
| `2mar71.pdf` | Vol 5 No 9 · **2 Mar 1971** | ⚠ **ALREADY MINED** — the "500" bicycle |
| `10mar1971.pdf` | **10 Mar 1971** | 7 Medal of Honor winners |
| `14apr71.pdf` | **~14 Apr 1971** (12 pp) | ⚠ **IMAGE SCAN — no text, needs OCR/vision** |

NOT newspapers (separate Session-71 carry-forwards, leave for their own tasks):
- `FSB-locations.pdf` — **553-page FSB gazetteer** (carry-forward: parse to occupancy
  records + grids; Fontaine already done by hand = YS 803 953).
- `after-action-pleiku.pdf` — **128-page Pleiku AAR** (source for the 1965 Hill 732 /
  Pleiku events; open question: Nov-4 company attribution).
- `500-brief-highlight.png`, `v05_fontaine (1).pptx` — already processed in Session 71.

### ⚠ `2mar71.pdf` is already mined
The 2 Mar 71 issue produced the **bicycle "500"** event (`events/bicycle-500-fsb-fontaine-1971-03/`)
and the verbatim transcription (`documents/unit/cavalair-500-fontaine/`). Re-scan it only
for OTHER D Co. items, don't redo the 500.

### What "useful" means — map every find to a site structure
- **Events** (now incl. the **Morale** tab): contacts, named operations, crashes,
  incidents, awards/ceremonies, recreation. → `events/<slug>/` with `type`, `date`,
  and `location_slug` to auto-attach to a firebase.
- **Soldier mentions:** any **D Co. / 2nd Bn 8th Cav / "Angry Skipper" / Delta** name →
  cross-ref the roster; new names → stubs (status `researching`, full field set + notes
  block); quotes/photos → their profile.
- **Locations:** FSB / LZ names → location tagging + gazetteer cross-ref.
- **Documents:** transcribe notable articles **verbatim** into `documents/` (Duds
  pattern — `type: verbal`, clipping image attached), link from the related event.
- **Photos:** captioned scans → contributor/source collection, `fsb:` tag to project.

### Suggested method (fast, because most are text)
1. **Grep-triage** all text PDFs for D Co. markers: `2/8`, `2nd Bn, 8th`, `8th Cav`,
   `Angry Skipper`, `D Co`, `Delta`, plus known roster surnames. CAVALAIR is a
   *division-wide* paper — most content is NOT D Co.; **filter hard** and watch for false
   positives (other 8th Cav battalions, other divisions).
2. **`14apr71.pdf`** has no embedded text → OCR (or read pages as images) before triage.
3. Build a **findings list** (file → page → what → proposed site action) and review with
   Michael BEFORE creating any events/profiles/docs.

---

## Also this session — Howard McGrew profile + the FSB Fontaine bicycle photo
A veteran sent a photo (dropped in `cavair/fsb-fontaine-bike.jpg`) of FSB Fontaine with a
**bicycle** in the frame — quiet corroboration of the "500" races, which the men don't actually
remember.

- **New profile: `soldiers/mcgrew-harold/mcgrew-harold.md`** — **Howard McGrew**, SGT, Range
  Platoon CP radio operator (RTO), `status: veteran`. Keeper of the **McGrew Field Calendar, 1971**
  (already the archive's date-anchor for ~a dozen 1971 events) — had no profile until now.
  **DEROS December 1971** per his calendar. Slug kept **`mcgrew-harold`** to match the existing
  bee-incident link, even though his name is **Howard** (the "harold" slug is a legacy spelling;
  display name is correct).
- **Photo filed** at `soldiers/mcgrew-harold/photos/locations/fsb-fontaine/`
  (`1971-fontaine-bicycle-01.jpg` + index.md), `fsb: fsb-fontaine`, credit "From the Collection of
  Howard McGrew". Dated **"1971"** (`date_known: false`); Michael places it mid-Feb–early May 1971
  from the built-up state of the base.
- **Surfacing:** added `mcgrew-harold` to **`locations/fsb-fontaine/` `contains`** (Confirmed
  present); photo shows on Fontaine's **Photos** tab via `byFsb`.
- **Cross-linked to the `bicycle-500-fsb-fontaine-1971-03` event:** bike photo added to the event
  `images:`, `mcgrew-harold` added to its `tagged:`, and a body note links to Fontaine's photos.
  ⚠ The tagged-list edit first produced a **duplicated `note:` key → YAML build failure**; fixed.
  Lesson: when inserting a list item BEFORE an existing one that has child keys, insert the whole
  item — don't split the anchor between the `- slug:` line and its `note:`.
- **Caption details** (Michael's read): flag on the antenna mast, sandbag bunkers, ammo crates, an
  **M274 "Mule"** (flatbed utility carrier) above the bicycle, and a **field-expedient shower**
  (water can on a tripod) at right.
- **Unidentified figures recorded as an ID prompt** in the photo note: the Mule driver; a soldier
  behind the Mule; a far-left soldier (glasses, M16 stock visible); a man waiting by the shower and
  a head in the shower; a soldier at right. **Awaiting Howard's IDs** — Michael asked him directly.
  When names come back: add slugs to the photo `contains` (+ stub any new men).
- Operational note (inference, kept OUT of the record): platoons held perimeter sectors and worked
  by sector, so co-located men are usually same-platoon — BUT this frame is at shared facilities
  (CP/commo mast, shower, log pad), the one spot that mixes platoons. A lead to test, not a fact:
  near McGrew's Range CP the figures *may* skew Range.

---

## Other open carry-forwards (from Session 71, still pending)
- **Wall of Honor** — build as its own page (roster of the fallen, links to profiles).
- **Stub referenced bases:** FB Silver, FB Mace, FB Oldham (ZT077004, D Co 16–22 Jul 71).
- **Parse the FSB gazetteer** (`FSB-locations.pdf` / `sources/fsb-locations/`) + build the
  service-date-range auto-matcher for circumstantial `tagged` sets.
- **Full profiles:** Bill Holtzclaw (RTO), Gary Collins "Indian" — currently stubs.
- **`/locations/` filters** (Type / Year / Province) — v1 is chronological only.
- **`colburn-richard`** still missing from search (truncated profile, since Session 70).
- **More Garvin decks** (Fanning, etc.) to process with the Fontaine pattern.
- **Howard McGrew fuller pass** — confirm rank/tour dates/hometown, link his 1971
  calendar to each event timeline, and apply his IDs for the Fontaine bicycle photo once he replies.

---

## Deploy reminder (every time)
```
node admin/scripts/backfill-r2.js   # ONLY if new photo/doc binaries were added
cd site && npm run build            # ALWAYS — wrangler does not build
xcopy /E /Y assets _site\assets     # ONLY if a new file under /assets was added
npx wrangler deploy                 # from site/ — never from repo root
```
Unit History was template-only, but the **McGrew bike photo is a NEW binary** → the pending
deploy **needs `backfill-r2`** (then build, then `wrangler deploy` from `site/`). Still **no xcopy**
(photo serves from R2 via `/media/`, not `/assets`). At session close the redesign **and** the McGrew
work are built locally (**314 files**) but **NOT yet deployed**.
