# d281staircav — Session 71 Handoff
**Date:** June 18, 2026
**Continues from:** Session 70 (Marvin letters; search regression; firebase-location dataset)
**Theme:** Built the **Locations feature end to end** — a UI/UX redesign that adds a third
"character" to the site alongside People and Events. Locations get a Roster-style index and
per-base profiles that mirror soldier profiles. Then **fully populated FSB Fontaine** from Jim
Garvin's `v05_fontaine` photo deck (17 photos + 3 accounts), created the parked **bicycle "500"**
as an event under a new **"morale"** type, stubbed two new men, and wired **evidence-driven
auto-aggregation** so photos/accounts project onto a place automatically.

---

## The model we settled on (design discussion → build)
The site now has three kinds of "characters": **people** (Roster), **places** (Locations), and
**moments** (Events/Unit History). People and Places are parallel collection indexes → tabbed
profiles. Events are the timeline that threads through both (a soldier's Timeline, a base's
"Events here", and Unit History are the same event records, surfaced three ways).

- **Unit History** stays a tabbed/typed timeline (kept type-grouping; added Morale).
- **Locations** = a Roster-mirror index → per-base profiles built on the soldier tab shell.
- **Soldiers Present** on a base is **computed from evidence**, not hand-maintained (see below).

---

## What Session 71 built

### Location layout, data model, collection, filter
- **`_includes/layouts/location.njk`** — per-base profile mirroring the soldier tab shell. Tabs:
  **Overview · Accounts · Soldiers present · Events here · Photos · Documents**. Empty tabs are
  hidden; unprofiled `contains` slugs render gracefully ("No profile yet"). Reuses the soldier
  `.tab`/`.tab-content` classes + an inline `activateTab` + hash deep-link script + lightbox.
- **`.eleventy.js`**:
  - `locations` collection — glob `./locations/**/*.md`, excludes `_template`/`_notes`/
    `_photo-index-template`/drafts, sorted by first occupancy (then name).
  - **`locDate` filter** — year-tolerant date formatter: `1971` → "1971", `1971-03` → "Mar 1971",
    `1971-03-09` → "9 Mar 1971", and handles YAML Date objects (UTC). Use this so outliers
    (Vung Tau, Bien Hoa, Relay Mountain) can carry year-only dates.
- **Location front matter** (`locations/[slug]/index.md`, `layout: layouts/location.njk`,
  `tags: [location]`): display_name, short_name, type (`fsb|lz|relay|r-and-r|base-camp|other`),
  also_known_as, named_for(+_note), `location{mgrs,lat,lon,province,modern_landmark,
  coordinate_source,coordinate_confidence}`, `dates{established,closed,notes}`, `occupancies[]`
  (year-tolerant `start`/`end` + `company`/`grid`/`source`/`confidence`/`note`),
  `related_bases{predecessor,successor,split_from,split_into}`, `contains` (confirmed presence),
  `tagged` (circumstantial), `related_events[]`, `command_post` (bool → CP icon on the index).

### /locations/ index + nav
- **`locations/index.njk`** (`layout: base.njk`, `permalink: /locations/`) — **chronological,
  year-grouped** (collapsible `<details>` per year), Roster-mirror table. Replaced a "men count"
  column with an **icon column**: CP (`command_post`), Namesake (`named_for`, links to the
  soldier), Photos (`photosByFsb[slug]`), Action/casualties (matched combat event). Legend up top.
  Design choice: a base re-occupied later simply appears again under that year; identity is keyed
  to grid, not name (handles the multi-Mace / re-survey problem). **No live filters yet (v1).**
- **`_includes/partials/masthead.njk`** — added **Locations** to desktop nav + mobile drawer,
  after Unit History.

### Photo system — contributor owns, location projects (the `fsb` tag)
- **`_data/photosBySlug.js`** rewritten: now passes through `fsb`/`subject`/`quality`/`note`/
  `source_ref`/`source_file`/`source_slide`; **scans a new `locations/[slug]/` subfolder** under
  each soldier's `photos/` (mirrors the `field/events/[slug]` dynamic scan); builds a **`byFsb`**
  reverse map alongside byContains/byTagged/byEvent. (Backup at `photosBySlug.js.bak`.)
- **`_data/photosByFsb.js`** (new) — `{ [location-slug]: [...photos] }`, mirrors photosByEvent.
- The location **Photos tab** pulls from `photosByFsb[slug]` (URLs point at the contributor's
  collection, e.g. `/media/photos/soldiers/garvin-jim/locations/fsb-fontaine/...`).

### FSB Fontaine — fully populated from Garvin's `v05_fontaine.pptx`
- **17 photos** at `site/soldiers/garvin-jim/photos/locations/fsb-fontaine/` (index.md + binaries).
  `credit: "From the Collection of Jim Garvin"`, `photographer:` blank (authorship uncertain — he
  curated), `fsb: fsb-fontaine`. Skipped: slide-1 insignia, slides 4–5 (butterflies/flowers), and
  the duplicated decorative aerial on slides 16/17. **Deck year typos corrected** (deck reads
  "1970" for several Feb–May frames; his tour + the slide-1 banner = **1971**).
- **3 anecdotes** (`anecdotes/garvin-jim/`), each `location: fsb-fontaine` + `contains`:
  `gun-crews-fontaine`, `ambush-after-leaving-the-field` (Holtzclaw), `awards-on-fontaine-indian`
  (Collins). Surface on Fontaine's Accounts tab and on Garvin's profile.
- **`locations/fsb-fontaine/index.md`** — now **non-draft**. Provenance captured: predecessor
  **FB Silver**, convoy origin **FB Mace**, the village = memory-disambiguation clue (ARVN tower,
  stream, ox carts). Grid still blank (gazetteer not yet parsed).

### Bicycle "500" event + new "morale" type
- **`events/bicycle-500-fsb-fontaine-1971-03/`** — `type: morale`, `location_slug: fsb-fontaine`
  (auto-matches the Fontaine Events tab), from the CAVALAIR 2 Mar 71 "Vietnam-style '500'" feature.
- **`unit-history.njk`** — added a **Morale & Recreation** section (between Operations and
  Memorials) to `typeSections` AND added `morale` to `knownTypes`. This is the home for USO shows,
  the Flying PX, recreation items.

### Soldier stubs
- **`soldiers/holtzclaw-bill/`** and **`soldiers/collins-gary/`** (nickname "Indian") — status
  `researching`, platoon Range (inferred from Garvin), full field set + closing `---` + notes
  block (search-index requirement). Their names now link from anecdotes; their photos surface on
  their own profiles via `byContains`.

### Soldiers Present — evidence-driven auto-aggregation
- `location.njk` now computes **Confirmed** = the location's hand-listed `contains` **∪** everyone
  named in a photo tagged to the base (`photosByFsb → contains`) **∪** anyone in an anecdote
  located here. **Circumstantial** = `tagged` minus anyone already confirmed (deduped). So tagging
  a photo or anecdote to a base auto-adds its people; you only hand-list special cases (an
  "I was there" with no photo, or a battalion-window circumstantial tie). Fixed sample slug
  `weaver-robert` → `weaver-ken`.

### Later in the session — FSB Fontaine finishing + styling fixes
- **Bicycle "500" fully sourced.** Added the highlighted CAVALAIR clipping
  `assets/docs/500-brief-highlight.png` to the event's Images tab; transcribed the full article
  verbatim into a new document `documents/unit/cavalair-500-fontaine/` (Duds pattern — type
  verbal, image attached, the unrelated briefs in the column noted). Removed the editorial
  paragraph from the event so the article stands alone; the event now links to the transcription.
- **Fontaine grid + namesake plucked from the gazetteer.** Grid **YS 803 953**
  (10.8053, 107.5595, confirmed); battalion occupancy **28 Jan – 8 May 71**; province corrected to
  **Long Khánh**; named for **Michael A. Fontaine** (DSC, KIA 10 Jan 69 — a soldier outside this
  archive). A second survey ~100 m away (YS804953, Apr 71) is noted.
- **Duds now appears in Fontaine's Events Here.** Added `location_slug: fsb-fontaine` to the
  `duds-firebase-fontaine-1971-03` event so it auto-matches (5 events now: 20 Apr contact, 24 Apr
  crash, May Chieu Hoi, Duds, the 500). `location_slug` is the scalable way to tie an existing
  event to a base without editing the location's `related_events`.
- **Card-styling fix (location tabs).** Accounts / Events here / Documents were rendering an
  **unstyled `.doc-card`**. Converted all three to the site's real pattern — `.doc-list` ›
  `.doc-item` (white card + accent bottom-border) with a dark `.doc-icon` square and a
  `.doc-type` pill. Also fixed an invalid nested `<a>` in the Events tab. **When listing
  documents/anecdotes/events anywhere, use `.doc-list`/`.doc-item`/`.doc-icon`/`.doc-type`, never
  `.doc-card` (it has no CSS).**
- **Index column headers + light-surface fix.** Added Position / Grid / Occupancy `<thead>` to
  each year table on `/locations/`. Both location pages had rendered dark-on-dark with no gutter
  (see Lesson 3) — fixed.

---

## DEPLOY — backfill + build + xcopy + deploy
```
node admin/scripts/backfill-r2.js      # repo root — uploads the 17 new Fontaine photos
cd site && npm run build               # build
xcopy /E /Y assets _site\assets        # from site/ — syncs the new 500 clipping asset
npx wrangler deploy                    # from site/
```
Then **push via GitHub Desktop**. **xcopy IS needed this time** — the Bicycle "500" CAVALAIR
clipping `assets/docs/500-brief-highlight.png` was added (assets passthrough is disabled, so the
build does not copy it). New R2 binaries: the 17 `…/locations/fsb-fontaine/*.jpg`. Last clean
build: **312 files**.

---

## CRITICAL LESSONS
1. **Edit/Write tools truncated large files AGAIN** — `.eleventy.js` lost its entire tail
   (whereData + processFootnotes + the `return{dir}` config) mid-comment; the Garvin photo index
   truncated at a bare `  - `. The tools write to the Windows path and the Linux mount lags/cuts.
   **RULE (reinforced): for any file over a few KB, write via the bash mount — heredoc or
   python read/replace/write — NOT the Edit/Write tools. Verify with `node -c` / a build.** All
   large writes this session used heredocs and built clean.
2. **A new event type needs entries in BOTH places** in `unit-history.njk`: the `typeSections`
   array (to get its own section) AND `knownTypes` (or it falls into the "Other" catch-all).
3. **`body` is dark (`--blk`); pages paint their own light reading surface.** Content is NOT
   readable by default — a standalone page needs a dark hero band (light text) plus a light panel
   (`background: var(--pg)`, ~`padding: Xpx 48px`) for the body, exactly like `.prof-hero` +
   `.tab-content` / `.roster-table-wrap`. Both new location pages initially rendered dark-on-dark
   with no gutter; fixed by giving `.loc-hero` / `.loc-idx-hero` a `--blk` band and wrapping the
   index body in `.loc-idx-body` (light, 48px). Mobile drops the gutter to ~16–20px.

4. **Locations carry data two ways**: the contributor *owns* a photo (it lives under their
   `photos/locations/[base]/`), and the `fsb:` tag *projects* it onto the base via `byFsb`. Same
   for anecdotes via `location:`. Don't duplicate a soldier roster onto the location — it's
   computed.

---

## OUTSTANDING / CARRY-FORWARD
- **REDO THE UNIT HISTORY PAGE — ✅ DONE in Session 72** (tabbed, type-grouped Model A;
  built, deployed, live). See `Handoff-Session72-UnitHistory-Tabs-and-Newspaper-Sweep.md`.
  Original note kept below for context:
- **(was) REDO THE UNIT HISTORY PAGE (next major task).** Per the Session-71 design discussion, the
  intended direction is to bring Unit History in line with the new Locations/profile treatment —
  a tabbed surface (mirroring the soldier/location shell) or a card-hub-to-landing-pages model,
  with a chronological default view. This session only *added* the Morale & Recreation type to
  the existing type-grouped page; the structural redo is still pending. `unit-history.njk` is the
  file; it currently renders a narrative era block + events grouped by type then year.
- **Stub the referenced bases** so the index fills out and Fontaine's chain link resolves:
  **FB Silver** (predecessor, ~early 71), **FB Mace** (convoy origin / logistics, 71),
  **FB Oldham** (ZT077004, D Co 16–22 Jul 71). Each needs at least type + an occupancy for
  chronological placement.
- **Parse the FSB gazetteer** (`sources/fsb-locations/`) into structured occupancy records +
  real grids (done by hand for Fontaine = YS 803 953), then build the **service-date-range
  auto-matcher** to generate the `tagged` (circumstantial) sets instead of hand-listing.
- **New people need full profiles:** Bill Holtzclaw (RTO) and Gary Collins "Indian" are stubs.
- **/locations/ filters** (Type / Year / Province) not built — v1 is chronological only.
- **"I was there" submission flow** (extend the contribute pipeline) still to design.
- **More Garvin decks** (Fanning, etc.) to process with the same pattern; the Fontaine deck still
  has un-mined value (village geography, the Mace/Silver chain).
- **colburn-richard** still missing from search (pre-existing truncated profile, from Session 70).
- **Pleiku Nov-4 company attribution** (AAR Recon/A/C Co vs Wall D Co) still open (Session 70).
