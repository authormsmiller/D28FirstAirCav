# d281staircav — Session 76 Handoff
**Date:** June 23, 2026
**Continues from:** Session 75 (FSB Mace / Gia Ray from Garvin's v11_mace deck; Operation Overlord
event stood up; FSB Hall research note; Overlord research deferred to a TTU/DTIC sweep)
**Theme:** Ran the **TTU/DTIC sweep** for Overlord (mostly negative — see below); **enriched the
Operation Overlord event** with two Australian War Memorial accounts and **Col. Peter Scott's 50th-
anniversary address** (the big win: the **C/5-42 Artillery 155mm battery** likely behind FSB Hall,
plus **AO Gold/Juno/Omaha** confirmed); processed **Jim Garvin's v16_news_articles deck** — built
the **"Chopper Unit" news clipping** into his documents + a field portrait, and stood up a new
**Operation Thunder (May 1971)** event from the FSB King clipping; and did the planning + outreach
for a **NARA RG 472 pull on the 20–24 April 1971 action**.

**Deploy:** `node admin/scripts/backfill-r2.js` (repo root) → `npm run build` (site/) →
`npx wrangler deploy` (site/) + push via GitHub Desktop. **3 new images this session** (list below).
**DONE this session** — build + R2 backfill + deploy run by Michael at the close of the session.
(Also confirm Session 75's 13 images were backfilled if that hadn't been done — this build covers them.)

---

## What this session built / changed

### Operation Overlord event — enriched from AWM + Peter Scott
Two quick fixes first (per Michael): McGrew's "D Company field calendar" → **"personal field
calendar"**; removed the Garvin sentence from the FSB Judy staging paragraph.

Then a full batch applied to `events/operation-overlord-1971-06/index.md` from three new sources —
the AWM "Battle of Long Khanh" blog, the AWM "Bruce Cameron MC" interview, and **Col. Peter Scott's
*Call to Remembrance*** (50th-anniversary address, 7 Jun 2021; Scott was **CO of 3 RAR** — a primary
Australian-command source; PDF in `Downloads/locations`):
- **AO Gold confirmed** — Overlord's three AOs were named for Normandy beachheads **Gold / Juno /
  Omaha** (resolves a Session 75 open item).
- **FSB Hall's battery, likely identified:** Scott's order of battle lists **US Army Battery C, 5th
  Bn, 42nd Artillery (155mm)** — the strongest candidate for the "new US artillery FSB Hall," and a
  match for the 155mm guns at **FSB Judy** (4 Jun). Added to the Hall note and Judy page too.
- **US aviation:** the Cobra gunships that turned the 7 Jun battle were a **US Army Assault
  Helicopter Company** (laid fire 50 m ahead of the Australian tanks).
- **OOB / 2/8 role:** three infantry battalions (3 RAR, 4 RAR/NZ, **US 2/8**) under **Brig. Bruce
  McDonald MC**; >2,500 Aus/US troops; Vung Tau casualty evac (lines up with McGrew's 21 Jun).
- **12 Jun ambush:** 274 RF VC Regiment hit a 1 ATF HQ element SW of the AO — RPG + Claymores, 7
  killed (worst single-incident Australian loss of the war).
- **D445 reconciled:** Scott records two enemy bases — 3/33 NVA (46 bunkers) + a 30-bunker base
  **vacated by D445** — so "3/33 + D445" stands.
- **Disambiguation:** Scott's "D Company" in the bunker assault is **3 RAR's** D Coy, NOT D Co 2/8
  Cav — added a one-line clarifier. Six new source citations + six new Sources-table rows.

Also modified: `site/_docs/locations/fsb-hall.md` (C/5-42 lead + open-question update),
`locations/fsb-judy/index.md` (155mm cross-link to C/5-42).

### v16_news_articles deck (Jim Garvin) — processed
Cover slide (1) confirms Garvin's tour: **Aug '70 – Jul '71, D Co, Range Platoon ("Range 1")**.

- **Slide 6 → "Chopper Unit" news clipping.** Hometown paper, **4 Nov 1970** (handwritten "G H per
  11-4-70"; publication unknown). Headline "Local Soldier With 'Chopper' Unit In Vietnam."
  - Cropped **portrait** → `soldiers/garvin-jim/photos/field/19701104-garvin-news-portrait.jpg`
    (credit "From the collection of Jim Garvin"; entry added to the field photos index).
  - Full transcription → `documents/garvin-jim/garvin-jim-newsclipping-chopper-unit/` (`type:
    clipping`, scan kept in-folder, `contains: garvin-jim`). Notes: paper printed "8th **Regiment**"
    (= 8th Cavalry); "Adolph Myer Zone Center" = Adolf Meyer Center, Decatur IL.
- **Slide 2 → Operation Thunder.** Article "Combined effort results in 'thunderous' operation,"
  datelined FSB King. Built a NEW event `events/operation-thunder-1971-05/index.md` (`type:
  operation`, **20 May – 1 Jun 1971**, `location_slug: fsb-king`) — a combined **2/8 Cav + Binh Tuy
  RF** raid on the **Nui Be Mountains** (the **MR-7 Rear Service Group**), staged from **Ham Tan
  airfield**, fire-supported from **FSB King**. Clipping processed → `documents/garvin-jim/
  garvin-jim-newsclipping-thunder-king/`. Updated `locations/fsb-king/index.md` (related-event link,
  a "why King existed" paragraph, and the Bacon open-question marked corroborated).
- **Slides 3–5 → passed** (general articles, not D Co/2/8): 3 & 4 = "Blue Max" ARA (B/2-20 Arty)
  Cobra feature + photos; 5 = Dr. Douglas Bey (1st Inf Div psychiatrist) on veteran grief. No entries.

### Decisions (Michael's calls)
- **Operation Thunder** modeled as an Operations event tied to King, **20 May – 1 Jun 1971** window
  (bounded by King's life + McGrew's calendar; the operation effectively closed ~28 May).
- **Slides 3–5 dropped** — general/wrong-unit; the deck's payload was slides 2 and 6.
- **Source caveats NOT yet logged** — hold until the NARA scans arrive, then write them against what
  actually shows up (see Carry-Forward).

### Operation Thunder — the dating logic (for the record)
McGrew's calendar: **19 May truck to "Arm Tam" (= Ham Tan) airfield** → **20 May CA to "the
mountains" (Nui Be)** → **25 May new location** → **28 May return to FSB King** → **1 Jun King
dismantled**. King existed only 20 May–1 Jun 1971, so the FSB-King-datelined clipping is pinned to
that window; present-tense reporting of results → written ~28–31 May. King was the fire-support base;
D Co staged from Ham Tan and air-assaulted into Nui Be under King's guns. Cache discoveries are
framed at the combined/battalion level — **not** attributed to D Co.

---

## TTU / DTIC sweep — results (mostly negative)
- **The four local DTIC PDFs do NOT cover Overlord.** AD0509007 = Div Artillery, period ending **31
  Jan 1970**; AD0520447 = a 3rd Bde report covering a quarter ending **~Oct 1971** (after Overlord;
  general Long Khanh AO only); AD0523510 / AD0530055 = Gen. Hamlet Senior Officer Debriefings, **Dec
  1971–1972**. Session 74's negative finding holds for the June '71 window too.
- **The record we actually want** is the **3rd Brigade (Separate), 1st Cav Div "Garryowen TF" ORLL
  for the quarter ~1 May–31 Jul 1971** (brigade activated 30 Apr 71; 2/8 was one of its four maneuver
  bns). No distinct AD number surfaced — DTIC's catalog is a JS SPA that won't render via fetch;
  search only echoes the *Aug–Oct* quarter (AD0520447). The day-by-day primary remains **NARA RG 472
  / the 2/8 Cav daily staff journal**.
- **TTU Virtual Vietnam Archive**: "Overlord" is **not** in the named-operations table (it's
  catalogued Australian-side). Keyword search is JS-rendered and resisted fetching. Best confirmed
  web sources remain AWM (Long Khanh blog + Cameron interview), Wikipedia, DVA. (Ignore WWII Normandy
  "Overlord" hits.)

---

## NEXT SESSION — PRIORITY
**The NARA RG 472 pull for the 20–24 April 1971 action** (Range Platoon ambush near Gia Ray + the
4/24 crash). Status: **researcher Michael Bracey** (College Park; RG 472 Vietnam staff journals/AARs
specialist; Vietnam vet) **emailed for a quote** (scope: 2/8 Cav DA Form 1594 daily staff journal
~18–26 Apr 71 + the AAR if filed + the **Silver Star General Orders/citations** for Sargent, Dillon,
and the two M-60 men). Michael added a personal note re: his father's story, hoping for a reduced
rate; target **< $50**.
- **Box check (done remotely):** the series is RG 472 **"Cavalry Unit Records" (ca. 1965–1973)**,
  which bundles daily journals, **general orders**, AARs, ORLLs, sitreps — so the journal AND the
  award GOs likely sit together (one visit). **Risk to confirm:** one catalog description lists the
  2/8 Cav portion as **1969–1970** — 1971 coverage unconfirmed from the desktop; the April '71
  journal **may be filed under 3rd Bde (Separate)** records. Have Bracey confirm 1971 coverage / locate
  the box **before** billing hours; a free NARA reference-desk question can de-risk it at zero cost.
- **Veteran caveats (frame the expectations):** **Kirk Davis** — the daily journal that day is
  mostly air-strike coordinates, not narrative (treat it as the **timeline backbone**, not the
  story). **Jim Garvin** (the clerk) — **morning reports were administratively unreliable** in the
  field (cite them only as "date of record," e.g. Sargent's 21 Apr DOW, not ground truth). Net: the
  **Silver Star citations + any AAR are the highest-value items** — officer-written, reviewed,
  insulated from both problems. Tell Bracey to prioritize them.
- **When the scans arrive:** log Davis's and Garvin's caveats as a short "note on the sources" on the
  4/20 event (held this session by Michael's call).

## CARRY-FORWARD (lower priority)
- **Operation Thunder open questions:** NARA journal 20 May–1 Jun 71 (exact dates, which companies,
  who found the caches); confirm **Bacon's name** (clipping's "Willis" vs archive's W.G./William
  "Gary" Bacon — now corroborated by a 2nd source as the late-May CO); pin **Nui Be** + **Ham Tan
  airfield** coordinates and King's relation to the coast.
- **Overlord carry-forward:** pin the **FSB Hall coordinate** and confirm **C/5-42 FA** as its
  battery; confirm FSB Judy continuous-vs-Overlord-only occupancy; NARA 2/8 journal 5–14 Jun for the
  US battalion's tactical detail.
- **BMB ("Build My Book") concept — tested this session** (chat exercise, no file): for a Dec 4
  1970–Dec 2 1971 D Co tour the archive returns a solid month-by-month skeleton, a 9-name casualty
  roll, and a source inventory. **Gap map:** strong day-by-day late-May→June + 20–24 Apr; **thin
  Jul–Sep 1971**. Useful for scoping future NARA pulls.
- **Unprofiled men / earlier carry-forwards from S75** still open (Druener, Perritt, Gay, Perot, Don
  Miller; Fanning YS759987 re-survey).

## NEW IMAGES NEEDING R2 BACKFILL (3)
soldiers/garvin-jim/photos/field/: 19701104-garvin-news-portrait.jpg
documents/garvin-jim/garvin-jim-newsclipping-chopper-unit/: garvin-jim-newsclipping-chopper-unit.jpg
documents/garvin-jim/garvin-jim-newsclipping-thunder-king/: garvin-jim-newsclipping-thunder-king.jpg

## FILES TOUCHED
NEW: events/operation-thunder-1971-05/index.md;
documents/garvin-jim/garvin-jim-newsclipping-chopper-unit/garvin-jim-newsclipping-chopper-unit.md (+ .jpg scan);
documents/garvin-jim/garvin-jim-newsclipping-thunder-king/garvin-jim-newsclipping-thunder-king.md (+ .jpg scan);
soldiers/garvin-jim/photos/field/19701104-garvin-news-portrait.jpg
MODIFIED: events/operation-overlord-1971-06/index.md; site/_docs/locations/fsb-hall.md;
locations/fsb-judy/index.md; locations/fsb-king/index.md;
soldiers/garvin-jim/photos/field/index.md (new portrait entry; note: this file is CRLF — a
line-ending corruption during editing was repaired via script and the YAML re-validated)

## BUILD STATUS
Clean throughout — last build **360 files** (added the Thunder event + Thunder clipping doc; the
chopper-unit doc; +1 portrait). Build + backfill + deploy run by Michael at session close.
