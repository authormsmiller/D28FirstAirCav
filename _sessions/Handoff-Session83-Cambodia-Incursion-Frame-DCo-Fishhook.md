# d281staircav — Session 83 Handoff
**Date:** June 30, 2026
**Continues from:** Session 82 (Thayer/Pershing/Tam Quan; the 1967 wall came down). This session
took **queue item #2** — the operational-history milestone — and built the **1970 Cambodian
Incursion** Tier 2 frame. **With it, every year 1965–72 now has a Tier 2 operation frame.** The
operation-level coverage milestone Michael has been chasing is reached.
**Theme:** Research the Cambodian Incursion + 1st Cav Div role → confirm 2/8 Cav / D Co involvement
from primary published history + the firebase data → build the umbrella frame → wire it to the
adjacent ops and update the coverage docs.

> ⚠ **Sandbox note (carried from S81/S82):** bash can serve **stale/truncated copies** of
> just-written files, and the bash `outputs/` mount does **not** show web_fetch's persisted
> tool-result files — use the **Read/Grep tools on the Windows path** for those (did so this
> session for the large Cambodian-campaign Wikipedia fetch). Trust Read/Edit/Write for fresh files.

---

## What was built (NEW)

### `events/operation-cambodian-incursion-1970` (Tier 2, type: operation) — the milestone page
- **The Cambodian Incursion — D Company in the Fishhook (1 May – 30 Jun 1970).** Umbrella context
  page on the Pershing/Toan Thang III model: no per-man casualties block; frames D Co's 1970 in
  three phases (winter–spring War Zone C border buildup → May–Jun Cambodia phase → autumn return to
  III Corps). Officially Operations **Toan Thang 43/45/46**.
- **D Co role CONFIRMED at published-history level.** The CMH airmobility volume (Tolson, ch. XI)
  names **D Company, 2/8 Cav** as the unit that found an enemy **communications-supply depot** in
  Cambodia (in the 25 May–9 Jun cache belt), with **A Company** finding an automotive-parts cache
  (25 May). This is the anchor — a direct, named D Co action in Cambodia, not an inference.
- **Corroboration:** the 2/8 Cav firebase-by-year data places the battalion at FBs **Gonder**
  (20 May–27 Jun, Cambodia) and **Picatinny East** (C Co weapons cache, 27 May–2 Jun, Cambodia),
  and notes **FB Eunice** as the **"last 3rd Bde unit to leave Cambodia."** → 2/8 Cav was a **3rd
  Brigade** battalion (Task Force Shoemaker) for the incursion (a shift from its 1965–69 1st Bde
  parentage — flagged as oq-04 to pin against ORLLs).
- **Battle of FSB Illingworth (1 Apr 70)** is written in as **battalion context, NOT a D Co
  action** — defended by **C and E Companies, 2/8 Cav** + artillery; named for **CPL John
  Illingworth (A Co 2/8 Cav, KIA 14 Mar 70)**; ~400 men of the PAVN 272nd Regt/9th Div assaulted;
  25 KIA/54 WIA; **SGT Peter C. Lemon (Co E/Recon, 2/8 Cav) — Medal of Honor**; 2 DSCs. The
  battalion's bloodiest day of the border buildup.

### How the 1970 D Co KIA map to the frame (hedged — RG 472 to confirm which fell where)
- **Border buildup (War Zone C, pre-incursion):** Frierson 25 Jan · Rava 18 Feb · Flashner 28 Feb ·
  Ware 6 Mar · Brockmeier 7 Mar · Jackson 17 Mar · **Alsup (date disputed 18 Mar vs 6 Apr — flagged
  in kia-list)**.
- **Incursion (Cambodia, May–Jun):** **19 May cluster — SSG James Cooney + CPL Kenneth Gonder.**
  FB Gonder opened **20 May** (one day later) — very likely named for CPL Gonder (oq-03).
- **Post-incursion (III Corps, autumn):** Waterman 3 Sep.

### Wiring + docs (MODIFIED)
- `operation-toan-thang-iii-1969` → added `followed-by` link to the Cambodia frame.
- `3rd-brigade-separate-garryowen-1971` → added `preceded-by` link to the Cambodia frame.
- `_docs/d-co-operational-timeline.md` → 1970 row **⬜ gap → ✅ covered**; rewrote the 1970 section;
  rewrote the "Priority gaps" footer into an **"operation-level coverage milestone reached"** note
  (every year 65–72 now has a Tier 2 frame; what remains is mostly Tier 1 clusters + 1968's frame).
- `_docs/1st-cav-division-operations-vietnam.md` → 1970 section **gap → covered**; priority-gaps
  item #3 updated.
- **Verified:** new-page YAML parses; `type: operation`; both related-event targets exist; both
  back-link edits parse and point to the new slug.

### Sources added (worth reusing for 1970/71 pages)
- **CMH — Tolson, *Airmobility 1961–1971*, ch. XI "The Changing War and Cambodia, 1969–1970"** —
  the division-level Cambodia narrative; **names A Co and D Co 2/8 Cav cache finds.** Primary.
- Wikipedia "Cambodian campaign" (Toan Thang 42–46 designations; 29 Apr–22 Jul overall, US ground
  1 May–30 Jun).
- GlobalSecurity.org "Cambodian Incursion" (TF Shoemaker org/strength; "The City").
- army.mil "Vietnam Veterans remember Battle of Illingworth" (Illingworth defenders, casualties).
- cmohs.org — SGT Peter C. Lemon MOH citation (Co E, 2/8 Cav).

---

## ★ NEXT SESSION — queue

1. **1970 Tier 1 clusters** (wire to the new Cambodia frame): the **19 May cluster (Cooney +
   Gonder)** is the best candidate to run to ground first — it's inside the Cambodia window and has
   the FB Gonder naming hook. Then the winter–spring border cluster and Waterman. Each needs the
   **2/8 Cav daily staff journal (NARA RG 472)** to pin the day-of action and place it inside vs.
   outside the Cambodia window. **None of the 10 organic 1970 KIA have soldier profiles yet** — all
   stubs (`frierson-kenneth`, `rava-henry`, `flashner-kenneth`, `ware-francis`, `brockmeier-thomas`,
   `jackson-michael-charles`, `alsup-stephen`, `cooney-james`, `gonder-kenneth`, `waterman-craig`).
2. **Resolve the Alsup date discrepancy** (Wall 6 Apr 70 vs honor roll 18 Mar 70 — 19-day gap)
   before building his stub — flagged in `_docs/d-co-kia-list.md`.
3. **Confirm oq-03/oq-04 on the Cambodia page:** FB Gonder naming; reconcile campaign end (CMH:
   last aircraft out 29 Jun vs firebase FB Eunice "last 3rd Bde out" 27 Jun–4 Jul); pin 2/8 Cav's
   3rd-Bde assignment date against the ORLLs.
4. **NEXT Tier 2 work = 1968** (the only remaining 🟡 partial year at frame level): a frame for the
   **II→I→III Corps move** and/or the larger **Sheridan Sabre** period. Candidate sub-frames:
   Pegasus (Khe Sanh, Apr), Delaware/Lam Son 216 (A Shau, Apr–May).
5. **Possible Illingworth spin-outs** (optional, strong sourcing now in hand): a Tier 1 page for the
   **Battle of FSB Illingworth (1 Apr 70)** as a battalion event, and/or a command/valor note on
   **SGT Peter Lemon (MOH)** and **CPL John Illingworth** — both 2/8 Cav. Would wire to the Cambodia
   frame as battalion context.
6. **Carry-forwards still open (S80–S82):** Malec deploy; Geiger photo move + upload; eleventy
   rebuild/deploy of the S81 locations + S82/S83 events; remaining 1967 Pershing clusters; the
   1965–69 location spine + Finding Aid; the Paulson Silver Star verification (Hall of Valor/NARA).

## Conventions reaffirmed
- **Tier 2 umbrella, no casualties block** — frame the year's losses in prose; Tier 1 clusters live
  on their own pages and wire here (same as Pershing/Toan Thang III).
- **Name battalion-but-not-D-Co actions as context, clearly labelled** (Illingworth = C & E Cos,
  not D Co) — don't let a strong battalion story imply D Co was present.
- **Hedge the casualty-to-action mapping** until RG 472 — give the phases, flag what's inference
  (which men fell inside the Cambodia window; the FB Gonder naming).
- **Cite the CMH airmobility volume by chapter** — ch. XI for Cambodia is the cleanest division
  source and names 2/8 Cav directly.

## Files touched (this session)
NEW event: `operation-cambodian-incursion-1970`.
MODIFIED: `operation-toan-thang-iii-1969` + `3rd-brigade-separate-garryowen-1971` (related_events
back-links); `_docs/d-co-operational-timeline.md` (1970 → covered, milestone note, coverage table);
`_docs/1st-cav-division-operations-vietnam.md` (1970 → covered, priority-gaps #3).
NOT done (by design): the 1970 Tier 1 cluster/contact pages; any 1970 soldier profiles; the 1968
frame; any deploy (Michael's step).
