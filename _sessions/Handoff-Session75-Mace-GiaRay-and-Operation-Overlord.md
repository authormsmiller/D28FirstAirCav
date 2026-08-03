# d281staircav — Session 75 Handoff
**Date:** June 22, 2026
**Continues from:** Session 74 (FSB Fanning/King/Judy from the v06_fanning deck; "I was there" design deferred)
**Theme:** Processed Jim Garvin's **v11_mace** deck into two new location pages (**FSB Mace** and
**Gia Ray**); added three more Fanning-area photos (Blais Stars & Stripes clipping + two Kirk Davis
frames); and — the big thread — used an Australian **Operation Overlord** account plus **McGrew's
June calendar** to resolve the long-open "Fanning, 5-14 Jul 71, Op Overlord" question, stand up an
**FSB Hall** research note, reframe **FSB Judy** as Overlord staging, and build a full **Operation
Overlord (June 1971)** event page.

**Deploy:** `node admin/scripts/backfill-r2.js` (repo root) → `npm run build` (site/) →
`npx wrangler deploy` (site/) + push via GitHub Desktop. **13 new images this session** need the R2
backfill (list below). NOT yet confirmed deployed as of this handoff.

---

## What this session built / changed

### FSB Mace + Gia Ray — Garvin v11_mace deck (Silver/Fanning pattern)
- **2 new location pages:** `locations/fsb-mace/index.md`, `locations/gia-ray/index.md`.
- **Photos** filed into `soldiers/garvin-jim/photos/locations/`:
  - **fsb-mace** — 8 new frames added to the 2 pre-existing v04_silver frames (10 total): company
    area below the mountain, Garvin as mail clerk, his ammo-crate quarters (photo by Sam Perritt),
    Lang the hooch maid, overhead-cover construction, March stand-down AO, loading trucks for Gia
    Ray, and "Signal Mt" from a Loach. Dropped the old "DEFERRED" notes.
  - **gia-ray** — 2 new frames (Caribou loading 17 Mar 71; O-1 Bird Dog) added to the 2 v04 frames.
- **Slide handling** per `fsb-mace-deck.txt`: slide 1 ignored; 2-7 & 11 → Mace; 8 (truck loading)
  → Mace with `contains: hilts-doug, fairchild-joe`, **Don Miller left unattributed** (Garvin's "?");
  9-10 → Gia Ray. Slide 6 "Mar 1970" read as a 1971 slip (noted on the photo).
- **FSB Mace coordinate:** YT 570 085 (10.9272, 107.3527), `coordinate_source: gemini`,
  `coordinate_confidence: low` — Gemini-sourced/unverified, but **geographically corroborated** by
  Garvin (base sits below Núi Chứa Chan / "Signal Mt", beside Gia Ray) and the Sargent Silver Star
  account. `contains: garvin-jim, hilts-doug, fairchild-joe`; `related_events: getter-malaria-1971-03-16`.

### Decisions (Michael's calls)
- **Gia Ray slug kept as `gia-ray`** — village + airstrip lumped together; the mountain of the same
  name is handled separately as **`relay-mountain`** (Núi Chứa Chan, research note only). No renames.
- **Lang** (Vietnamese hooch maid): **caption mention only** — no profile, no `contains`.
- **Unprofiled men flagged, NOT stubbed:** LT Druener, Sam Perritt, Sgt. Maurice Gay, Sammy Perot
  (Garvin unsure Gay/Perot were even 2/8 vs battalion/regimental staff), Don Miller ("?").

### Fanning-area photo adds
- **Blais Stars & Stripes clipping** → `soldiers/blais-dizzy/photos/locations/fsb-fanning/` (Echo
  Recon air-assault near FSB Fanning; original USA Photo by SP4 Al Gregory; credit "Stars and Stripes
  clipping from Jean \"Dizzy\" Blais", `credit_slug: blais-dizzy`). **Note:** slug is `blais-dizzy`
  (not "blais-jean"), and it had to go under `photos/locations/` (NOT `field/locations`) — the byFsb
  projection only fires from `photos/locations/[slug]/`.
- **Two Kirk Davis frames** → `soldiers/davis-kirk/photos/field/` (both `contains: davis-kirk`,
  credit "From the collection of Kirk Davis"): one tagged `fsb: fsb-fontaine` (surfaces on the
  Fontaine page — a field photo can carry an `fsb:` tag), one Range-platoon portrait left
  location-less.
- **Dropped:** a Wikimedia Commons "HQ 2/8 at Firebase Fanning" photo — no soldier owner fits our
  org model, and the Commons license/attribution wouldn't fetch. Michael said drop it; file left
  unused in the Downloads/locations folder.

### Operation Overlord thread (the main story)
Source chain converged on **early June 1971**:
1. An Australian **1 ATF Operation Overlord** day-by-day account (compiled from Scott, *Command in
   Vietnam*; English, *The Rifleman*; Taylor, *Last Out*) — supplied by Michael. Key line: *"2/8
   Battalion … deployed in blocking positions along the Suoi Luc with three companies, with
   Headquarters 2/8 Battalion remaining at FSB FANNING and a new US artillery FSB HALL established
   to support the operation."* D-Day deployment 0330, **5 June 1971**.
2. **Howard McGrew's calendar** (primary, D Co): **June 5 build FSB Hall**, June 7 Fanning, CAs
   June 9/13/16, **June 21 CA to Fanning and Vung Tau** — matches the account date-for-date.
3. Public histories (AWM, Wikipedia, DVA): Overlord = 1 ATF brigade-size search-and-clear, **5-14
   Jun 71**; **Battle of Long Khánh 6-7 Jun**; enemy **3/33 NVA + D445 VC** east of Route 2 ~30 km
   N of Nui Dat; 10 Australians KIA; **the last joint US-Australian battalion-size operation of the
   war** — and **2/8 Cav was the US battalion**.

Changes made:
- **`locations/fsb-fanning/index.md`** — new "Operation Overlord (June 1971)" section; corrected the
  gazetteer's "5-14 Jul 71" survey as a **Jun→Jul transcription slip**; added McGrew's June run; new
  Sources rows; **closed the open question** (struck through, resolved with a residual note on the
  YS759987 re-survey); `related_events: operation-overlord-1971-06`.
- **`_docs/locations/fsb-hall.md`** — NEW research stub. US artillery base built **5 Jun 71** for
  Overlord; **primary-corroborated** by McGrew ("June 5 build FSB Hall"); coordinate unknown.
- **`locations/fsb-judy/index.md`** — new "Operation Overlord staging" section: the **4 Jun 71**
  occupation (155mm heavy guns) is one day before D-Day → reads as **artillery pre-positioning**
  (inference). Reframed/tightened the open question; `related_events: operation-overlord-1971-06`.
- **`events/operation-overlord-1971-06/index.md`** — NEW `type: operation` event. Frames the
  operation, centers 2/8 Cav's role (Fanning HQ / Suoi Luc blocks / FSB Hall), folds in McGrew +
  Garvin + Blais + gazetteer, links Fanning/Judy/Mace and the two 24 Jun events (as **same-month
  tempo, NOT part of Overlord** — those are SE of Fontaine after Overlord closed). Renders on the
  unit-history timeline. Open questions flag the NARA 2/8 journal, FSB Hall coordinate, and Judy
  staging confirmation.

Build clean throughout (357 files).

---

## NEXT SESSION — PRIORITY
**Texas Tech Vietnam Archive + DTIC sweep for Operation Overlord / Battle of Long Khánh** to beef up
the Overlord event with the Australian + US material:
- Find primary/secondary docs naming **Operation Overlord**, **2/8 Cav's** blocking role, **FSB
  Hall**, the **Suoi Luc** positions, and **AO Gold** (Phuoc Tuy / Long Khánh border, ~30 km N of
  Nui Dat).
- **NARA RG 472 — 2/8 Cav daily staff journal (DA Form 1594) / AARs, 5-14 Jun 71** is the primary
  record for the US battalion's day-by-day actions (currently the event page only establishes ROLE,
  not tactical detail).
- Cross-check the four DTIC PDFs already in the `Downloads/locations` folder (AD0509007, AD0520447,
  AD0523510, AD0530055) — Session 74 found none named Fanning/King/Judy, but re-scan specifically
  for **Overlord / FSB Hall / Suoi Luc / Long Khánh June 71** and the AO **map overlays/"Inclosure"**
  image pages.
- Web sources already pulled: AWM blog (awm.gov.au/articles/blog/battle-long-khanh), Wikipedia
  (Battle of Long Khánh), DVA Overlord PDF. The 3rar.com.au 50th-anniversary docs and Grokipedia
  were in results but not yet read — worth a look.

## CARRY-FORWARD (lower priority)
- **Deploy this session's work** if not already done: backfill → build → wrangler deploy (see top).
- **FSB Hall** — pin a coordinate + identify the battery; decide if it warrants a full location page.
- **FSB Judy** — confirm via 2/8 journal whether Judy was held continuously through June or only for
  Overlord's opening (the 4 Jun vs 30 Jun-1 Aug gazetteer gap).
- **FSB Mace** — verify MGRS YT 570 085; confirm 199th LIB → 1st Cav handover (~Sep 70) and closure.
- **Unprofiled Mace men** — Druener, Perritt, Gay, Perot, Don Miller("?") if they surface elsewhere.
- **Fanning** residual — whether the YS759987 re-survey is a real shift (HQ at Fanning, companies on
  Suoi Luc) or a re-reading.

## NEW IMAGES NEEDING R2 BACKFILL (13)
soldiers/garvin-jim/photos/locations/fsb-mace/: 19710223-mace-company-area.jpg,
19710223-mace-garvin-mail-clerk.jpg, 19710304-mace-garvin-quarters.jpg,
197103-mace-lang-hooch-maid.jpg, 197103-mace-overhead-cover.png, 19710317-mace-stand-down.jpg,
19710317-mace-loading-trucks-gia-ray.jpg, 197106-mace-signal-mountain.jpg
soldiers/garvin-jim/photos/locations/gia-ray/: 19710317-gia-ray-caribou-loading.jpg,
19710317-gia-ray-o1-birddog.jpg
soldiers/blais-dizzy/photos/locations/fsb-fanning/: fanning-echo-recon-air-assault-clipping.jpg
soldiers/davis-kirk/photos/field/: 1971-davis-kirk-fsb-fontaine.jpg, 1971-davis-kirk-range-portrait.jpg

## FILES TOUCHED
NEW: locations/fsb-mace/index.md; locations/gia-ray/index.md;
events/operation-overlord-1971-06/index.md; _docs/locations/fsb-hall.md;
soldiers/blais-dizzy/photos/locations/fsb-fanning/index.md (+image);
plus rewritten photo indexes: soldiers/garvin-jim/photos/locations/{fsb-mace,gia-ray}/index.md;
soldiers/davis-kirk/photos/field/index.md
MODIFIED: locations/fsb-fanning/index.md; locations/fsb-judy/index.md
