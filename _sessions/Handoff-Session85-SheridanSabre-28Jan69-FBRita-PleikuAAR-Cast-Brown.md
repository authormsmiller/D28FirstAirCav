# d281staircav — Session 85 Handoff
**Date:** June 30, 2026
**Continues from:** Session 84 (Gonder/Rippy/Mosby I + coverage inventory).
**Theme:** Two new 1969 KIA (Pipher, Eskridge) → their 28 Jan 69 cluster under **Sheridan Sabre** →
**FB Rita** location page (and the Rogers-MOH battle there) → mined the **4 Nov 65 Pleiku AAR**
(new primary source) and built out its whole cast (Linton, Trapnell, Marshall, Wilson links) →
started a third KIA, **Neil Brown** (1969, Montana Raider). **Stopped mid-Brown** to conserve usage.

> ⚠ **Sandbox note (still biting, per S84):** trust **Read/Edit/Write**, not bash, for fresh files.
> Edit the `relationships.json` with care — a bad Edit **truncated** it this session; I repaired it
> with a Python truncate-and-append (backup at `/tmp/relationships.broken.bak`). It is valid now (10
> entries). **There is a stale, unremovable `.git/index.lock`** in the repo (permission denied) —
> `git checkout`/commits will fail until Michael removes it manually.

---

## COMPLETED this session

### 1969-01-28 cluster — Pipher & Eskridge (Sheridan Sabre)
- **`soldiers/pipher-carl`** and **`soldiers/eskridge-warren`** — built via `kia-profile-general`,
  verified vs Honor States + Virtual Wall. Both D Co, 2/8 Cav, KIA 28 Jan 69, small arms, Tay Ninh
  (record) / Fishhook AO (actual). Cross-noted as a probable same-action cohort.
- **`events/operation-sheridan-sabre-1969-01-28`** — Tier 1 contact cluster (modeled on the
  `operation-sheridan-sabre-1968-12-04` sibling). **Umbrella = Sheridan Sabre, NOT Toan Thang III**
  (predates it; 17 Feb 69). Mined **Division ORLL AD502597** (now local at `KIA/pipher-carl/`) +
  **DivArty AD502415** (`KIA/ahern-raymond/502415.pdf`): both place 2/8 Cav under **2nd Brigade**
  (Fishhook/Saigon River AO, FB Rita), relieved by 2/5 Cav 300600H Jan 69. **Neither ORLL itemizes
  the 28 Jan contact** (below significant-action threshold) → likely a patrol contact; next source =
  **NARA RG 472** (2/8 Cav daily staff journal / S-3 AAR, late Jan 69).
- **`d-co-operational-timeline.md`** — 1969-01-28 marked DONE with the above reasoning.

### FB Rita location
- **`locations/fsb-rita`** (status: research) — XT505795, Fishhook/Binh Long. **Same base as the
  1 Nov 1968 Battle of FSB Rita** (LTC Charles C. Rogers **Medal of Honor**, 1st Inf Div, 12 KIA;
  DVIDS article in `locations/fsb-rita/`). 2/8 Cav took it over 7 Nov 68. **FSB Carol RULED OUT**
  (that's LZ Carol/future Ripcord, YD344194, I Corps). Open: namesake, close date.

### 4 Nov 65 Pleiku cluster — new primary source + full cast
- **NEW primary source:** `KIA/AA Rpt 4Nov65.pdf` (5pp, scanned) — OCR transcript at
  **`sources/aar-2-8cav-4nov65-OCR.md`**. The **battalion** AAR companion to the division Pleiku AAR.
  Action at **Position "Cavalair" (grid 979049)**, NOT Hill 732 (Hill 732 = nearby enemy CP).
  Confirms the 3 KIA (Coffey/Hill/Hamill) + a 4th KIA (a **SVN interpreter "Sgt Be"**), **9 named
  WIA**, and **Bronze Star w/V** recommendations (posthumous for the 3; + SP/4 Wilson). A mid-battle
  "Right Guard 5 KIA/17 WIA" figure does NOT reconcile with the final 4-KIA count (peak field report).
- **`documents/unit/aar-2-8cav-4nov65/`** — the AAR as a document; **`contains:` drives Tier 1**.
- **`soldiers/linton-samuel`** — Capt. **Samuel Percy Linton III** (b.1936 Savannah / d.2003,
  FindAGrave 103111188; retired MAJ), **CO Co D** ("Skipper 6"). Wired **Tier 3 (company-command)**
  to the 3 KIA + Wilson via `relationships.json`. Added to the event page (units.commander + a new
  "battalion's own AAR" section). (OCR "Co B" was a B/D misread — he is **Co D**.)
- **`soldiers/trapnell-franklin`** — 1LT **Franklin "Buck" Trapnell Jr.** (b.1937/d.2014, FindAGrave
  131916630; retired COL), **D Co XO**, `platoon: HQ`. Led "Flanker Right." **Tier 1** with the
  cluster (added to AAR `contains`).
- **`soldiers/marshall-clint`** — SSG **Clint Roger Marshall** (b.~1928/d.2008), **Recon Plt Sgt**
  ("Buckeye"), `platoon: Recon`. Tier 1 with cluster (AAR `contains`). (Rank note: eulogy uses his
  retirement rank MSG; AAR says "FSG"; displayed SSG per Michael.)
- **`documents/trapnell-franklin/marshall-eulogy-2008/`** — Trapnell's ASA-newsletter (June 2008)
  eulogy for Marshall. `author: trapnell-franklin`, `contains: [marshall-clint]` → Trapnell↔Marshall
  Tier 1; shows "In Trapnell's Own Words" + "Accounts Mentioning Clint."
- **`soldiers/wilson-david`** (existing) — added **Bronze Star w/V** (recommended in AAR) +
  upgraded Purple Heart (WIA now confirmed by the AAR); reframed his timeline entry to Cavalair
  with his own "Hill 732" recollection reconciled.

---

## PENDING — pick up here (Neil Brown thread)
The June 2008 ASA newsletter (in `profiles/trapnell-franklin/` as `ASA Newsletter 2008_June.pdf`;
OCR text was at `/tmp/asa2008.txt`) also has **Chuck Hustedt's** narrative about finding
**Neil Brown's** grave, incl. the 2 May 69 action.

1. **`soldiers/brown-neil` — DONE & wired** (built via `kia-profile-general --event
   operation-montana-raider-1969`). PFC Neil Shipp Brown, D Co, KIA **2 May 69**, Tay Ninh / War
   Zone C. KIA-day timeline already enriched with the Hustedt carry-out account. **Death placed with
   Operation Montana Raider** (13 Apr–13 May 69) per Michael — `related_events` set.
2. **TODO — `soldiers/hustedt-chuck` stub.** Author of the Brown narrative. **DISCREPANCY TO
   CONFIRM:** Michael said "Range Platoon, 1969," but the newsletter bylines him **"Skull, 69"**
   (twice). Was a "cherry" in May 69 (arrived ~1969). Living vet (2008 reunion). *Defaulted plan:
   build as Skull '69 unless Michael says Range.*
3. **TODO — `soldiers/lee-john` stub.** **John Lee, Range, 68–69** (named repeatedly; helped carry
   Brown out; attended reunions). Needed so the document `contains: lee-john` link resolves.
4. **TODO — Hustedt's Brown-grave document** (June 2008 ASA newsletter), `type: verbal`,
   `author: hustedt-chuck`, **`contains: [lee-john, brown-neil]`**, `event:
   operation-montana-raider-1969`. Mirror the `marshall-eulogy-2008` doc pattern. Then add to
   brown-neil's profile "Documents" (auto via contains) and verify Alongside tiers with the
   `node -e 'require("./site/_data/alongside.js")()'` check.

---

## Reference — Alongside tier mechanics (learned this session)
- **Tier 1** = auto from **photo/document `contains[]`** (and doc `author`↔contains). Document must be
  named `{slug}/{slug}.md` (NOT `index.md`) for the alongside crawler to read it; `_crawlDocuments`
  (the Documents tab + documentsBySlug) accepts both.
- **Tier 2** = `basis: same-platoon`. **Tier 3** = any other basis (e.g. `company-command`) — use for
  COMPANY leaders. **Tier 4** = battalion LTC only (`commanding-officer`/`chain-of-command`).
- To keep a commander OFF Tier 1, do **not** put him in the document `contains`/`author`; wire him via
  `relationships.json` with a Tier-3 basis instead (that's how Linton is Tier 3, not Tier 1).
- Verify with: `node -e 'const a=require("./site/_data/alongside.js")(); console.log(a["wilson-david"])'`

## Other open items
- **`.git/index.lock`** stale — remove manually before next git op.
- **Linton** death day: FindAGrave header 16 Jan 2003 vs cemetery book 6 Jan 2003.
- Candidates not yet built: **Sgt Julien** (other "Buckeye" NCO); the 9 named 4-Nov-65 WIA
  (Parrack, Baker, Spencer, Patterson, Taylor, Ortiz, Frolleny + the two Wilsons) — no first names yet.
- Consider building the **June 2008 ASA newsletter** as its own unit document if more articles are mined.
