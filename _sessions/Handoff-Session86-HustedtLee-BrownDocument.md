# d281staircav — Session 86 Handoff
**Date:** July 6, 2026
**Continues from:** Session 85 (Pipher/Eskridge/Sheridan Sabre, FB Rita, Pleiku AAR cast, Brown started).
**Theme:** Completed the Neil Brown thread — built Hustedt and Lee stubs, created the Brown-grave document, deployed.

> ⚠ **Sandbox note (carried forward):** trust **Read/Edit/Write**, not bash, for fresh files.
> **`.git/index.lock`** stale — still needs manual removal before any git ops.

---

## COMPLETED this session

### soldiers/hustedt-chuck
- Skull, 69. Arrived 1969; self-described cherry in May '69.
- Timeline entry: 2 May 69 carry-out of Neil Brown.
- `related_events: operation-montana-raider-1969`
- Document reference wired in `documents:`.
- **Platoon note:** handoff S85 flagged a possible "Range" discrepancy (Michael's recollection vs
  newsletter). Newsletter bylines him "(Skull, 69)" twice — filed as Skull. Correct if needed.

### soldiers/lee-john
- Range, 68–69. Wife Jan.
- Timeline entry: 2 May 69 carry-out.
- `related_events: operation-montana-raider-1969`
- Admin notes capture: visited Brown's Wall panel with Hustedt; raised McGhie group merger at 2008
  business meeting; common name — confirm identity before adding external links.

### documents/hustedt-chuck/brown-neil-kia-2may69/brown-neil-kia-2may69.md
- `type: verbal`, `author: hustedt-chuck`, `contains: [brown-neil, lee-john]`
- `event: operation-montana-raider-1969`
- Mirrors the `marshall-eulogy-2008` pattern.
- Body covers: 2 May 69 firefight, 1998 Charleston reunion discovery (Hustedt/Lee didn't know each
  other in-country), 2008 Salt Lake City cemetery grid-search (also: Al Seal Range 71–72, Dirk Olson
  Skull 71–72, Everett "Corp" Tolbert Skull 69–70).
- Alongside: Tier 1 links Hustedt↔Brown and Hustedt↔Lee now resolve via `contains`.

### brown-neil.md updated
- `documents:` block populated with the Hustedt account reference.
- `last_updated` bumped to 2026-07-06.

### Deploy
- Pure markdown additions, no assets changed — **xcopy not needed**.
- `cd site && npm run build` → `npx wrangler deploy` → pushed via GitHub Desktop.
- All new pages confirmed live.

---

## PENDING — next priorities (carried from S85)

1. **Linton death date discrepancy** — FindAGrave header 16 Jan 2003 vs cemetery book 6 Jan 2003.
   Still open.
2. **`.git/index.lock`** — remove manually before next git op.
3. **Candidates not yet built:**
   - Sgt Julien (other "Buckeye" NCO, 4 Nov 65)
   - The 9 named 4-Nov-65 WIA (Parrack, Baker, Spencer, Patterson, Taylor, Ortiz, Frolleny + two
     Wilsons) — no first names yet
4. **1968 Tier 2 frame** — still partial (Sheridan Sabre period / II→I→III Corps move).
5. **Malec deploy** (carry-forward from S80–S83).
6. **Geiger photo move + upload** (carry-forward from S81).
7. **Paulson Silver Star verification** (Hall of Valor / NARA).
8. **Finding Aid build** — architecture decided in `_docs/finding-aid-concept.md`; ready to build.
