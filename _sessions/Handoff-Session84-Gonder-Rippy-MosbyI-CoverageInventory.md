# d281staircav — Session 84 Handoff
**Date:** June 30, 2026
**Continues from:** Session 83 (the 1970 **Cambodian Incursion** Tier 2 frame — see that handoff;
it completed operation-level coverage for every year 1965–72). This session kept going past the
Cambodia frame and ran two KIA profiles to ground with full operational context, built a new 1966
operation frame, fixed two broken roster links, and produced a **coverage inventory** by year.
**Theme:** Gonder (1970, non-combat) → Rippy (1966, combat) → reverse-engineer Rippy's action from
the operations + location list → new **Operation Mosby I** frame → coverage census + data hygiene.

> ⚠ **Sandbox note (still biting):** the Linux/bash mount repeatedly served **stale/truncated
> copies** of just-edited soldier `.md` files (UnicodeDecode "unexpected end of data," related_events
> reading as empty when they weren't). **Trust Read/Edit/Write, NOT bash, for fresh files.** Event
> and location YAML validated fine in bash; soldier files were confirmed via the Read tool. Also:
> web_fetch's persisted tool-result files don't appear on the bash `outputs/` mount — use the
> Read/Grep tools on the Windows path.

---

## What was built this session (after the Cambodia frame)

### CPL Kenneth Gonder — full set (1970, NON-COMBAT)
- **`soldiers/gonder-kenneth`** — built via the `kia-profile-general` parser (KIA-folder
  `build_profile.py`, run with `--event "" --platoon ""` to suppress the Chinook defaults), then
  hand-corrected. **Cause was WRONG in the roster** ("Hostile"); both Honor States and Virtual Wall
  say **non-hostile** — and the NJ Vietnam Veterans' Memorial **sister's tribute** gives the
  circumstance: he **stepped on an Allied Forces land mine while walking with his platoon**, killed
  instantly, in **Binh Duong Province** (the division rear during the incursion). That's why DCAS
  codes it non-hostile though it happened on a patrol. Decorations: PH not applicable; 3 service
  medals confirmed; CIB/Marksmanship/PUC/Gallantry Cross unconfirmed. 1st Platoon, MOS 11B10.
  Hometown genericized to **Middlesex County, NJ** (sources split New Brunswick vs East Brunswick).
- **`locations/fsb-gonder`** — FB Gonder (Cambodia, grid XU807383, 2/8 Cav 20 May–27 Jun 70).
  Opened **one day after** his death → **very likely named for him** (strong inference, no primary
  naming citation yet).
- **`documents/gonder-kenneth/gonder-kenneth-sister-tribute`** — the full first-person family
  remembrance (type: tribute), linked from the profile's documents block.
- **`events/gonder-mine-1970-05-19`** — Tier 1 **incident** page (non-combat death), mirroring the
  `getter-malaria-1971-03-16` + `river-crossing-song-be-1969-10-08` patterns. Wired to the Cambodia
  frame; the frame, profile, and location page all link back.

### SP4 Terry Rippy — profile + the operation behind his death (1966, COMBAT)
- **`soldiers/rippy-terry`** — SP4 Terry Allen Rippy, D Co 2/8 Cav, **KIA 22 Apr 1966, explosive
  device** ("hostile, died outright"); in-country since 30 Nov 1965 (division's first months),
  airborne-qual (MOS 11H2P), Hammond OR. PH + 3 service medals confirmed.
- **Province corrected:** Honor States "Quang Nam" (I Corps) is a **DCAS error** — the 1st Cav was
  in the II Corps highlands in Apr 66.
- **`events/operation-mosby-i-1966`** (NEW Tier 2) — built from the Lincoln/Mosby I Combat AAR
  (DTIC **AD824627**, filed under `operation-lincoln-1966/sources/`). Reconstructed arc: **Jim Bowie
  → Lincoln (Pleiku, to 8 Apr) → Mosby I recon-in-force (16–17 Apr, Pleiku/Kontum) → return to An
  Khe → Crazy Horse (May).** 2/8 Cav was a **1st Brigade** battalion (Col. Hennessey). **Location
  list clinched the placement:** D Co's forward Lincoln LZ was **LZ Cotton (YV843956)** — ~41 km
  from the Oasis fwd base but **~123 km (150+ by road) from An Khe**, so the 1st Bde was **airlifted
  back to An Khe by C-130 on 16–17 Apr**, not convoyed. So Rippy (22 Apr) was most likely killed by
  a **mine/booby-trap at or near An Khe (Camp Radcliff TAOR)** in the post-return refit window;
  Highway 19 a secondary possibility. Rippy wired to **Mosby I (primary) + Lincoln**; Mosby I ↔
  Lincoln wired both ways. **Working theory accepted by Michael** (still beats VVMF's "PR & MR
  Unknown"); leave hedged pending RG 472.

### Data hygiene (broken-link fixes for the site build)
- Two roster slugs in `_docs/d-co-kia-list.md` were stale and would have been **broken links**:
  `jones-willie` → **`jones-willie-gerald`**, `williams-william-charles` → **`williams-william`**
  (both 1968-12-04; profiles exist; Profile column set to ✅). Scanned the whole roster — **no other
  built rows point to a missing file.**

---

## ★ COVERAGE INVENTORY (profiles built ÷ organic KIA roster) — as of this session

| Year | Profiles | KIA (organic) | Coverage | Notes |
|------|:--------:|:-------------:|:--------:|-------|
| 1965 | 3  | 3  | **100%** | done |
| 1966 | 3  | 5  | **60%**  | gaps: saldana-fermin, floyd-paul |
| 1967 | 4  | 18 | **22%**  | 14 gaps (Pershing clusters) |
| 1968 | 4  | 16 | **25%**  | 12 gaps; count corrected after the slug fix |
| 1969 | 6  | 21 | **29%**  | 14 gaps |
| 1970 | 1  | 10 | **10%**  | 9 gaps — thinnest year |
| 1971 | 7  | 7  | **100%** | done |
| 1972 | 21 | 21 | **100%** | done (Chinook) |
| **All** | **49** | **101** | **49%** | 52 organic KIA still unbuilt |

- **Method:** denominator = organic totals from the KIA-list summary table; numerator = profiles on
  disk (status `kia`) matched to roster slugs. Excludes attached/related profiles (**ahern-raymond**
  1968-att, **wiseman-richard** 1970-att, and the 24 Apr 71 Huey-crash men **colburn-richard /
  fanning-martin / jeffries-gabriel**) — counting everything on disk you have **~54 KIA profiles**.
- **Bookends done (1965/71/72 = 100%); the frontier is 1967–1970 (10–29%).** 1970 is thinnest.
- Consider dropping this table into `_docs/` as a standing coverage snapshot if useful.

---

## ★ NEXT SESSION — start here: the **28 Jan 1969** cluster (2 KIA)

This is the chosen pickup. Two organic D Co KIA, **adjacent on the Wall (33W/7 & 33W/11)** — a
**single-action signature** (like the Oct 8 1969 and Dec 11 1967 clusters). Build both profiles and
a Tier 1 contact event, wired to the right III Corps operation.

**The men (from `_docs/d-co-kia-list.md`):**
- **CPL Warren Reed Eskridge** — Tangier Island, VA — DOB 1947-09-09 — Wall **33W/7** — slug
  `eskridge-warren` — Hostile. *(No profile yet; need the 3 HTML sources in `KIA/eskridge-warren/`.)*
- **SP4 Carl Dale Pipher** — Canton, OH — DOB 1949-03-31 — Wall **33W/11** — slug `pipher-carl` —
  Hostile. *(No profile yet; need the 3 HTML sources in `KIA/pipher-carl/`.)*

**FSB / location data for late Jan 1969 (`sources/fsb-locations/2-8-cav-fsb-by-year.md`):**
- **FB Rita** — grid **XT499802** (11.5805 N, 106.3710 E) — III Corps, **War Zone C / Tay Ninh–Binh
  Long area** — "**2/8th Cav Jan69**" (also 499803, attacked 23 Feb 69; refs AD501405, AD504499).
  **The strongest 2/8 Cav III Corps position for Jan 69 — likely where the company was.**
- LZ Unnamed **ZA007325** (13.85 N, 107.78 E) — II Corps highlands — "B/2/8 Cav 7Jan69, Op Matador"
  — *ambiguous* (the division was completing its **I Corps → III Corps move** in this period; treat
  this highlands line with caution / possible mislabel).
- Context only: **FB Fontaine** is named for **Michael A. Fontaine, DSC, KIA 10 Jan 69** — i.e.,
  early-Jan-69 action was costly; the base itself is an Apr-71 position, not Jan 69.

**Operations (candidate frame — confirm, don't assert):**
- 28 Jan 1969 **predates Operation Toan Thang III** (which began **17 Feb 1969**). The governing III
  Corps umbrella in January 1969 was **Operation Toan Thang II** (Phase II of the III Corps
  offensive, running into mid-Feb 1969). **No Toan Thang II page exists yet** → either build a new
  Tier 2 frame for it, or fold Jan 69 into the **I→III Corps move** context. Nearest existing frame:
  **`operation-sheridan-sabre-1968-12-04`** (the Dec 68 III Corps contact) — the same War Zone C/D
  AO, the immediate predecessor period.
- After this cluster, Toan Thang III (17 Feb–31 Oct) takes over and the existing
  `operation-toan-thang-iii-1969` umbrella + its 5 sub-op pages already cover the rest of the year.

**Records to pull (to pin the action):**
- **2/8 Cav daily staff journal, 28 Jan 1969 (NARA RG 472)** — the day-of action and positions.
- **1st Cav Division ORLL, quarter ending 31 Jan 1969 (and 30 Apr 1969)** — the III Corps campaign
  frame / Toan Thang II–III transition. (The staged ORLL AD0506273 is qtr-ending 31 Jul 69 — too
  late; need the earlier quarter.)

**Build steps:** save the 3 KIA HTML sources + photo for each man to `KIA/eskridge-warren/` and
`KIA/pipher-carl/`, run `kia-profile-general` (blank `--event`/`--platoon`), hand-correct
decorations (3 service medals → confirmed; rest → unconfirmed), then build a Tier 1 contact event
(`contact-...-1969-01-28`) and wire both men + the III Corps op frame.

---

## Other open threads (carry-forward)
- **SSG James Cooney** (19 May 70, same date as Gonder) — still tagged "hostile" in the roster;
  **re-check his cause** against his own sources (the shared date may have propagated a wrong tag).
- **RG 472 confirmations:** Rippy's exact 22 Apr 66 mechanism/place (mine vs booby-trap; An Khe vs
  Hwy 19); Gonder's exact Binh Duong location; FB Gonder naming citation.
- **1968 Tier 2 frame** — the only year still 🟡 partial at frame level (the II→I→III Corps move /
  Sheridan Sabre period). Toan Thang II would also serve the Jan-69 cluster above.
- **Carry-forwards from S80–S83:** Malec deploy; Geiger photo move + upload; eleventy rebuild/deploy
  of the S81–S84 work; remaining 1967 Pershing clusters; 1965–69 location spine + Finding Aid;
  Paulson Silver Star verification (Hall of Valor / NARA).

## Conventions reaffirmed this session
- **Non-combat deaths → Tier 1 `type: incident` pages** (getter/river-crossing model), framed as
  "death of the war," no Purple Heart, cause honestly labeled. Combat deaths don't get incident
  pages — they attach to contact/operation frames.
- **DCAS province errors are common for early-war 1st Cav** — cross-check the casualty province
  against the division's actual AO for that month before trusting it (Quang Nam→highlands for Rippy;
  the Gonder Binh-Duong-rear vs Cambodia-front distinction).
- **Fire bases named for recently-killed men** is a strong-but-inference link (FB Gonder); present as
  such, flag for a primary naming citation.
- **Parser hygiene:** the KIA-folder `build_profile.py` is the general-capable parser, but its
  `--event`/`--platoon` DEFAULT to the Chinook crash/Skull — always pass them BLANK for non-Chinook
  men, then hand-fix decorations + photo credit (blank for Wall-of-Faces photos) + the assignment
  label.

## Files touched (this session, post-Cambodia)
NEW soldiers: `gonder-kenneth`, `rippy-terry`. NEW events: `gonder-mine-1970-05-19`,
`operation-mosby-i-1966`. NEW location: `fsb-gonder`. NEW document:
`gonder-kenneth/gonder-kenneth-sister-tribute`.
MODIFIED: `operation-cambodian-incursion-1970` (← gonder incident wire), `operation-lincoln-1966`
(↔ Mosby I), `_docs/d-co-kia-list.md` (Gonder cause; Rippy ✅ + province note; jones/williams slug
fixes), `_docs/d-co-operational-timeline.md` (1966 Mosby I + Rippy; 1970 Gonder incident).
NOT done (by design): the 28 Jan 69 cluster; 1968 Tier 2 frame; Cooney re-check; any deploy.
