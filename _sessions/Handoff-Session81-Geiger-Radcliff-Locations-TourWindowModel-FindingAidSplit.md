# d281staircav — Session 81 Handoff
**Date:** June 29, 2026
**Continues from:** Session 80 (Malec build-out, command chain, Bong Son 19 Sep 66 event). This
session answered **"Where was D Company in 1965?"** by building the **arrival chain** as location
pages — **USNS Geiger** (the troop-ship crossing) and **Camp Radcliff** (the An Khê base camp) —
then worked out the **design model** for turning locations into per-soldier service arcs (the
tour-window estimator) and the **Finding Aid vs Build My Book** split. No combat events were built;
this was locations + design groundwork.
**Theme:** Ia Meur ruled out (B/C, not D Co) → the 1965 deployment-to-All-the-Way gap → two new
location pages forming a navigable chain → a photo-host pattern → the tour-window estimation model
→ Finding Aid/BMB threshold split → header-convention fix so we stop restyling pages.

> ⚠ **Sandbox note (unchanged, still biting):** the Linux mount served **stale/blank copies of
> just-added/just-edited files** all session — freshly created folders and the user's dropped photo
> did not appear via bash. **Trust the Read/Edit/Write tools, not bash, for fresh files.** All edits
> below were confirmed via the file tools.

> **Deploy owed by Michael (nothing auto-deployed this session):**
> 1. **Geiger photo:** move the image the user dropped in `site/locations/usns-geiger/` into
>    `site/soldiers/archive-collection/photos/locations/usns-geiger/` and name it
>    **`usns-geiger-troopship.jpg`** (the host entry expects that filename), then
>    `node scripts/upload-soldier-photos.cjs archive-collection`. **Confirm what the image depicts** —
>    the caption assumes it's the ship itself.
> 2. **Rebuild + deploy (eleventy):** the two new location pages, the `voyage`/"Troop Ship" label
>    edits to `_includes/layouts/location.njk` and `locations/index.njk`, the Geiger↔Radcliff chain,
>    and the header restyle on both pages.
> 3. **Verify** the `voyage` type renders "Troop Ship" (hero) / "Troop ship" (index) for the Geiger.

---

## The 1965 arrival chain — two new location pages

Both follow the existing location schema (`layout: layouts/location.njk`) and the published header
convention (`## Sentence case`, see fix below).

- **`locations/usns-geiger`** — NEW, `type: voyage` (a new type). The 1st Brigade's troop-ship
  crossing: boarded Savannah ~19–20 Aug 1965, ~32-day passage (Honolulu + Guam stops, one hurricane),
  ashore **Qui Nhơn 20 Sep 1965**. Confirmed: **USNS Geiger (T-AP-197)**, Barrett-class, named for
  USMC Gen. Roy Geiger; 1st Bde = 1/8, 2/8, 1/12 + 2/19 Arty. The point of the page (Michael's idea):
  the early men crossed **together as a unit**, unlike the later individual air replacements — a
  shared experience worth a page. An anonymous FB comment (truck→Chinook at Qui Nhơn) is used **inline
  as corroboration of the movement only** — NOT an Account (can't tie to a soldier / not confirmed
  D Co).
- **`locations/camp-radcliff`** — NEW, `type: base-camp`. The 1st Cav base camp ("the Golf Course")
  at An Khê, confirmed coords 13.993°N 108.6485°E. D Co home-based here **20 Sep 1965 – Jan 1968**.
  Rich namesake story: **Maj. Donald Radcliff** (1/9 Cav XO) was on the site-selection team that
  picked the ground **while the division was still at sea**, then KIA 18 Aug 65 at Op Starlite (LZ
  Blue) — the division's first combat death; base dedicated 21 Feb 66. Includes the Golf Course
  build (BG Wright's coinage, ~1,040-man advance party, 101st Abn perimeter) and a **"The fall of
  An Khê, 1975"** section (Tieman/Coal Hill Review memoir — kept **inline**, he was 4th ID not D Co;
  flags SP4 Eric Williams / Williams Bridge as a lead).

**Chain wiring:** Geiger `related_bases.successor: camp-radcliff`; Radcliff `related_bases.predecessor:
usns-geiger`. Renders "Replaced by Camp Radcliff" / "Succeeded USNS Geiger" both directions.
Radcliff `related_events`: deployment-vietnam-1965, operation-all-the-way-1965, pleiku-campaign-1965-11-04.
Both carry the early cohort in `tagged` (likely-aboard / circumstantial): **coffey-richard,
hamill-wright, hill-eddie, malec-paul, wilson-david**. The 1965 arc now reads
**Geiger → Radcliff → All the Way → 4 Nov losses** with no blank.

### Engine edits (small, additive)
- `_includes/layouts/location.njk` and `locations/index.njk`: added `"voyage": "Troop Ship"` /
  `"Troop ship"` to the two `typeLabels` maps. (Unknown types fall back to "Position"; this just
  labels the new type.)

---

## Photo-host pattern — NEW convention

Location pages surface photos **only** via `photosByFsb` (built by `_data/photosBySlug.js`, which
scans `soldiers/*/photos/**` and indexes any photo's `fsb:` onto the matching location). A loose
image in `site/locations/<slug>/` is **not served** (passthrough is disabled; `/media/` serves only
the photos R2 bucket's `soldiers/` prefix).

**Solution built:** `site/soldiers/archive-collection/` — a **photos-only host with NO profile `.md`**.
Because the roster globs `soldiers/*/*.md`, a folder with no `.md` is automatically invisible to the
roster / KIA list / Alongside / search, while the crawler still indexes its photos. Use it for
location/community photos with no individual soldier owner; if a **D Co veteran** took the shot, put
it under HIS soldier folder instead (ties him to the location).
- `…/archive-collection/photos/locations/camp-radcliff/index.md` — placeholder for the **Hòn Cong
  Mountain insignia** photo (`photos: []`, commented entry; deploy-safe; uncomment + drop file +
  upload when sourced).
- `…/archive-collection/photos/locations/usns-geiger/index.md` — **active** entry for
  `usns-geiger-troopship.jpg` (awaiting the file move + upload — see deploy step 1).
- Both use `permalink: false`. Real attribution lives in each photo's `credit:`. Orphan-work posture:
  "source unknown… contact us for credit or removal."

---

## Ia Meur (6 Nov 65) — ruled out, research note only

`site/_docs/ia-meur-1965-11-06-research-note.md` — the 6 Nov 65 Ia Meur River action was a **B and C
Company** fight (B Co platoon initial contact → entrenched NVA bn; 26 KIA; 6/33 Bn nearly
annihilated). **D Co not named.** No event page (Michael: doesn't belong in a D Co archive). The
9–10 Nov 65 AAR already on file (`operation-all-the-way-1965/sources/`) is a separate, later event.

## 1965 gap research (recorded, not a page)
July–27 Oct 1965 for D Co was **arrival + base-build, not combat**: activation 1 Jul 65 → Geiger →
An Khê (TAOR responsibility 28 Sep) → Pleiku/All the Way 27 Oct. The division's first battle,
**Operation Shiny Bayonet (10–14 Oct 65), did NOT include 2/8** (it was 7th Cav + 1/9 + 1/12). This
is footnoted on the Camp Radcliff garrison narrative.

---

## Design decisions (documented, not built)

1. **Unit timeline → use Locations as the spine.** We explored a rendered three-layer unit timeline
   (phase bands + locations + events, coverage-state colored) but decided the **Locations tab,
   presented chronologically, carries the "where over time" lift**; a rendered timeline is **deferred
   to BMB/Finding Aid**. The maintainer coverage view stays in prose (`d-co-operational-timeline.md`).
2. **Tour-window estimation model** — written into `LOCATION-FEATURE-CONCEPT.md` (new "Tour-window
   estimation" section): a **bidirectional matcher** (dates→places and places→dates), **anchor logic**
   (positive = hard floor/ceiling, can't predate a base; negative "never at X" = exclusion wall under
   continuous presence; 12-month tour norm = soft cross-check), and an **echelon-scaled confidence
   ladder** — **possible** (battalion held it) / **probable** (whole company recorded) / **confirmed**
   (first-person evidence), with the platoon-detachment nuance (specific echelon raises confidence for
   that element, lowers it for the rest). Worked example in the doc: Silver → Jeffries, excluding
   Makowski. **This applies to EVERY soldier with arrival/departure data, not just KIAs.**
3. **Finding Aid vs Build My Book split** — written into `finding-aid-concept.md` (new section): same
   engine + ladder, different **threshold + voice**. Finding Aid = "does this ring a bell?"
   (permissive, interrogative, surfaces *possible* as prompts). BMB = the keepsake (conservative,
   declarative, leads with confirmed/probable, demotes *possible*). They form a **pipeline**: Finding
   Aid harvests recognition → confirmations promote entries → BMB consumes the upgraded record. The
   location concept's confidence ladder points here under "Output gating."

## Header-convention fix
`site/locations/_template.md` now opens its body with a **"READ FIRST"** note: published pages use
`## Sentence case` H2 headers; the `# ── SECTION ──` dividers in the template are authoring markers
only. (This session's two pages were initially built with the divider style and **restyled** to match
fsb-fanning/silver/mace — done.)

---

## ★ NEXT SESSION — queue (Michael: build Thayer I & II — we have the data)

1. **`operation-thayer-i-1966` (Tier 2, type: operation).** Dates **13 Sep – 1 Oct 1966**, Bình Định
   (Kim Sơn / Soài Cà valleys), 1st Cav, CO LTC **Tackaberry**. **Anchors the already-built**
   `contact-bong-son-1966-09-19` (Derosier KIA / Tackaberry's DSC). **Source on hand:**
   `sources/orll-1cd-1966/ORLL-1cd-22Nov66.pdf` (covers the Sep–Nov 66 period). Wire `related_events`
   both ways with the contact event; attach derosier-michael, tackaberry-thomas. Per coverage model:
   2/8 losses by **aggregate**, D Co contact = Tier 1.
2. **`operation-thayer-ii-1966` (Tier 2, type: operation).** Dates **24 Oct 1966 – 11 Feb 1967**,
   Bình Định, **1st Brigade retained in the Kim Sơn Valley** (Gen. Norton), CO LTC **Tackaberry**.
   **Anchors the already-built** `contact-binh-dinh-1967-01-28` (Keller + Yates; candidate LZ Minh
   BR707760). **Sources on hand:** `site/events/contact-binh-dinh-1967-01-28/sources/ORLL-1st-Cav-HQ-Qt-Ending-31-Jan-67.pdf`
   (the period of the action) + the tail of the 22 Nov 66 ORLL + AD0385642 (30 Apr 67 ORLL, AO
   context, per S79). Wire both ways; attach keller-peter, yates-donald.
   - Neither Thayer page wires to **Malec** (he DOW'd 14 May 66, before both).
   - Update `_docs/d-co-operational-timeline.md`: 1966 and 1967 move off ⬜ once these land.
3. **`LZ Minh` location page (BR707760)** — the candidate site of the 28 Jan 67 Keller/Yates contact;
   wire `location_slug` both ways with `contact-binh-dinh-1967-01-28`. First of the 1965–69
   Binh Dinh-era LZ pages (the location spine's biggest gap). Trigger noted in S79 was the 2/8 daily
   staff journal, but a candidate page with confidence labels is fine now.
4. **Continue the location spine** generally (1965–69 LZs/FSBs) — this is the work that **unblocks the
   Finding Aid build** (see below).
5. **Finding Aid feature (gated, build SOON but not yet):** deliver as a **"Download finding aid"
   button on the soldier profile**. Hold until location + operations data is dense enough to match the
   **Malec dry-run** quality (the S80 worked PDF is the benchmark). Build order is in
   `finding-aid-concept.md`.
6. **Carry-forwards still open (from S80):** Malec deploy steps; Thayer I/II were already queued;
   extract the Col. Frank Trapnell CO letter (newsletter-2007-jun.pdf); verify Robert Batts as Malec's
   D Co company CO; Jim Bowie Combat AAR (AD0829472) NARA pull; 1966/67 KIA cluster event pages;
   command-officer (Skipper 6) stubs; VVMF remembrances for Derosier.

## Conventions added / reaffirmed
- **Photo host:** non-soldier location/community photos go under `soldiers/archive-collection/photos/
  locations/<slug>/` (no profile `.md` → invisible to roster; crawler still indexes; `permalink:false`).
  D Co veterans' photos go under their own soldier folder.
- **`type: voyage`** is a valid location type (Troop Ship). Location pages need no map/coords to render
  (hero fields are conditional).
- **Location body headers:** `## Sentence case` (not `# ── X ──`). See `_template.md` READ-FIRST note.
- **Tour-window confidence:** possible / probable / confirmed, scaled by unit echelon; window itself is
  labeled *inferred*. Negative anchors softer than positive (R&R/hospital/transfer break continuity).
- **Orphan-work photos:** honest "source unknown… contact us for credit or removal" credit; fair-use /
  noncommercial-educational posture; non-alteration is NOT the argument (market-harm + purpose are).

## Files touched (this session)
NEW locations: **usns-geiger**, **camp-radcliff** (both restyled to `##` headers).
NEW photo host: `soldiers/archive-collection/photos/locations/{camp-radcliff (placeholder), usns-geiger (active)}/index.md`.
MODIFIED engine/template: `_includes/layouts/location.njk` (+voyage label), `locations/index.njk`
(+voyage label), `locations/_template.md` (header-convention note).
NEW research note: `_docs/ia-meur-1965-11-06-research-note.md`.
MODIFIED docs: `sources/fsb-locations/LOCATION-FEATURE-CONCEPT.md` (tour-window section + output-gating
pointer), `_docs/finding-aid-concept.md` (FA vs BMB split + build-readiness gate).
NOT built (by design): unit-timeline render; any combat event; the photo upload (Michael's step).
