# d281staircav — Session 87 Handoff
**Date:** July 7, 2026
**Continues from:** Session 86 (Hustedt/Lee stubs, Brown document, deployed).
**Theme:** Song Re Valley Aug 1967 — full LZ cluster, Dashiell stub, operation page.

> ⚠ **Sandbox note (carried forward):** trust **Read/Edit/Write**, not bash, for fresh files.
> **`.git/index.lock`** stale — still needs manual removal before any git ops.

---

## COMPLETED this session

### soldiers/dashiell-john (fully built — carried from S86 handoff)
- COL (Ret.) John Cofer Dashiell, nickname "Jack." Rank corrected from LTC → COL.
- Born 18 Mar 1927, Smithfield VA. Died 31 May 2017, age 90.
- Decorations: two Silver Stars (Vietnam), Purple Heart + CIB (Korea, Pork Chop Hill July 1953).
- Assignment: CO 2/8 Cav 7 Feb 1967 – July 1967 (per ORLL AD0385642 + B Co memoir).
- Handed command to LTC Stannard at Camp Radcliff, July 1967.
- Profile photo scaffold in place: `photos/profile/dashiell-john-profile.jpg`.
- Obituary link: https://www.littlesfuneralhome.com/obituaries/john-dashiell
- **DEPLOY NOTE:** Dashiell profile photo needs R2 backfill before deploy.
  Run `node admin/scripts/backfill-r2.js` from repo root, then build + wrangler deploy.

### soldiers/stannard-john (updated)
- `arrived: "1967-07"`, assignment notes updated to include Camp Radcliff handover and Song Re Valley.

### Song Re Valley LZ cluster — all four pages built and cross-wired

#### locations/lz-lou
- **BS 400 425** (14.8472, 108.5792) — confirmed in gazetteer ref 179.
- C/2/19th (Abn) Arty (105mm)(T) 9Aug67. Same source cluster as Tom and Jane.
- Also ref 270: BS395424 (12Aug, 2/B/29th Arty) and BS395425 (15Aug, D/2/17th Arty).
- General entry LZ Lou BS401422 (1st ACD, no date).
- Role: B Co CA at 0737H 9Aug; secured as bn CP + C Bty firebase; C Bty operational ~0900H.
- `related_events: song-re-valley-1967`

#### locations/lz-jane (updated)
- `related_events: song-re-valley-1967` added.

#### locations/lz-tom (updated)
- Notes updated: LZ Lou grid confirmed; source table row corrected.
- Open question closed: LZ Lou grid confirmed.
- `related_bases: predecessor: lz-lou, successor: lz-moberly`
- `related_events: song-re-valley-1967`

#### locations/lz-moberly (NEW)
- **BS 558 321** (14.7547, 108.7265) — Ba To Airfield, Ba To district, Quang Ngai Province.
- Three gazetteer entries (tight cluster, all Ba To AF):
  - BS558321 — 2/17th Arty (105mm)(T) 5Aug67, Op Pershing, ref 270
  - BS558325 — D/5/7th Cav PZ 15Aug67, ref 179
  - BS558326 — C/1/77th Arty (105mm)(T) 19Aug67, refs 270, AD387477
- Special Forces CIDG camp with Caribou-capable airstrip. A-detachment number unknown.
- Role: battalion overnight staging 18Aug → Caribou lift to LZ English morning 19Aug.
- C/1/77th 19Aug entry confirms artillery extracted same morning as B Co memoir states.
- DISTINCT from LZ Tom — ~20 km apart. Tom and Moberly are separate locations.
- `related_events: song-re-valley-1967`

### events/song-re-valley-1967 (NEW — Tier 2 operation page)
- `type: operation`, nested under `operation-pershing-1967` as parent.
- No formal operation name — title uses ORLL designation.
- Full sequence documented: 1 Aug brigade move north; 3 Aug 2/8 assault north of Song Re;
  9 Aug LZ Lou (0737H) → C Bty (0900H) → LZ Pat (0935H, hot, 46 TAC AIR);
  13 Aug 2/12 Cav moves north; 17 Aug D Co at LZ Jane;
  18 Aug D Co PZ at LZ Tom → airlift to LZ Moberly (overnight);
  19 Aug Caribou from Moberly → LZ English → Pershing AO.
- Results: 42 enemy KIA, 2 POW, 242 detainees; US 7 KIA, 34 WIA (brigade-wide).
- Sources: ORLL AD0387543 (primary); B Co memoir eagerarms.com; gazetteer refs 179, 270.
- Open questions: D Co-specific KIA not yet identified from the 7 KIA brigade total;
  LZ Pat casualty attribution (A Co 2/8 vs other unit); D Co activity 1–17 Aug; Ba To SF camp designation.

### _docs/d-co-operational-timeline.md (updated)
- 1967 Song Re section updated: extraction sequence corrected to Moberly → LZ English (not direct).
- Location pages and operation page listed.
- LZ Lou grid marked confirmed.

---

## PENDING — next priorities

### Deploy
- **Dashiell profile photo** needs R2 backfill first:
  `node admin/scripts/backfill-r2.js` from repo root → `cd site && npm run build` → `npx wrangler deploy` → GitHub Desktop push.
- All other new pages (lz-lou, lz-moberly, song-re-valley-1967, lz-tom/jane/lou updates,
  stannard update) are pure markdown — no xcopy needed.

### Carried from S86
1. **Linton death date discrepancy** — FindAGrave 16 Jan 2003 vs cemetery book 6 Jan 2003. Still open.
2. **`.git/index.lock`** — remove manually before next git op.
3. **Candidates not yet built:**
   - Sgt Julien (other "Buckeye" NCO, 4 Nov 65)
   - The 9 named 4-Nov-65 WIA (Parrack, Baker, Spencer, Patterson, Taylor, Ortiz, Frolleny + two Wilsons) — no first names yet
4. **1968 Tier 2 frame** — still partial (Sheridan Sabre period / II→I→III Corps move).
5. **Malec deploy** (carry-forward from S80–S83).
6. **Geiger photo move + upload** (carry-forward from S81).
7. **Paulson Silver Star verification** (Hall of Valor / NARA).
8. **Finding Aid build** — architecture decided in `_docs/finding-aid-concept.md`; ready to build.

### Song Re open threads
- D Co Aug 1967 KIA — the brigade lost 7 KIA total; none yet identified as D Co.
  Cross-check `d-co-kia-list.md` for any Aug 1967 dates.
- LZ Pat (BS330477, Hill 450): 11 KIA, 27 WIA, 3 aircraft — if any are D Co, build stubs.
- Ba To CIDG camp A-detachment number — SF order-of-battle records or NARA RG 472.
- D Co activity 1–17 Aug (before the Jane/Tom/Moberly extraction sequence) — NARA RG 472.

---

## Key sources in hand
- **AD0387543-OCR.md** — `C:\Users\michael.miller\Downloads\locations\AD0387543-OCR.md`
  (1st Cav ORLL period ending 31 Oct 1967; OCR text, 2,552 lines)
- **Firebase gazetteer (master PDF)** — in the repo; refs 179 and 270 cover Song Re cluster.
- **B Co memoir** — https://www.eagerarms.com (Song Re Valley, Tam Quan, Tet pages)
