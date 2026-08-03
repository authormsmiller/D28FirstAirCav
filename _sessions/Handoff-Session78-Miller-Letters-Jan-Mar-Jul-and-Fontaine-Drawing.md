# d281staircav — Session 78 Handoff
**Date:** June 24, 2026
**Continues from:** Session 77 (Marvin Miller letters push — 14 new letters via the single-PDF
workflow; Operation Thunder corroboration; induction date set; pre-Vietnam chapter opened).
**Theme:** Three **more in-country Marvin Miller letters** processed (30 Jan, 8 Mar **to brother
Dan**, 26 Jul), the **FSB Silver teardown corroborated** from the profile timeline, a correction
to how his **art training** is described, and a new **research note on the lost FSB Fontaine scale
drawing**. The pre-Vietnam **"training set" is still missing** (Michael's words: found more
in-country letters, training set gone missing for now).

**Deploy:** Run by **Michael at session close** (build + `npx wrangler deploy` + push via GitHub
Desktop). **No new images this session** — all changes are markdown — so **no R2 backfill needed**.

---

## What this session did

### New in-country letters processed (3)
All in the standard letter format (frontmatter + transcription + Transcription Notes + Archivist
Notes + cross-references), cross-linked to neighbors.

- **30 Jan 1971 — "The Last to Leave Silver"** (to Mother). The **primary source for the FSB Silver
  teardown**: "My platoon were the last to leave the old base… I had to draw a scaled down model of
  the new base for the Colonel." Dates the teardown to late January, gives the earliest plain
  statement of the **Army-banks-all-but-$35** pay arrangement and the **Elderton-bank payoff**, and
  adds a midpoint to the Ford-transmission thread ("Dan has probably got that transmission by now").
  Slug `…-19710130`.
- **8 Mar 1971 — "Don't Bother Sending Another Camera"** (to **brother Dan** — the only *in-country*
  letter to a sibling; a separate undated training-days letter to Dan also exists, not yet
  processed). Casual register: "Hi Dan," signed "Marv." Fishing, a .22 off Rudy, the Ford, the
  welder Dan and Buss got, and the camera/film thread. Slug `…-19710308`, `recipient: "Brother — Dan"`.
- **26 Jul 1971 — "My DEROS Date Is December 4th"** (to Mother). **Fills the Jul 12 → Aug 4 gap.**
  First time he writes his **DEROS (Dec 4)** down — back-confirms a ~4 Dec 1970 arrival; notes the
  short tours stopped (drawdown), the 8 Aug Vũng Tàu trip (matches 4 Aug & 9 Aug), garden/canning,
  baby Dean walking, film. Slug `…-19710726`.

### Silver teardown corroborated on the profile timeline
Added Marvin's own quote to the **"Silver Stands Down — Cat Platoon Last to Leave"** timeline entry
in `miller-marvin-dale.md` (Late Jan 1971) — it already stated Cat Platoon was last out and that he
drew the model for the Colonel; now sourced to the 30 Jan letter.

### Art-training correction (MDM-FAMILY-BACKGROUND)
The background doc had asserted his Art Institute training "had apparently been noticed or
mentioned" by the Army. Michael's note: he attended the **Art Institute of Pittsburgh** (one
semester, fall 1969) and was a good artist, but **does not know how the Army learned of it** to ask
him to draw the base. Reframed that passage as an **open question** and added it to the doc's
Open Questions list. Same caveat worked into the 30 Jan letter's drawing note.

### New research note — the FSB Fontaine scale drawing
`soldiers/miller-marvin/documents/MDM-RESEARCH-FONTAINE-DRAWING.md`. Captures, all as inference /
open questions (asserting nothing the sources don't support):
- the drawing is **lost**, no known witness recollection;
- **which "Colonel"** — battalion CO (an LTC, colloquially "the Colonel"); command timeline
  **Conrad (1970) → Bacon (attested Apr–May 71) → Blagg (14 Jul 71)**; **late-Jan '71 CO not
  pinned** (Bacon plausible but unconfirmed; Bacon is deceased);
- **who'd have seen it / where** — an **S-3 (operations)** product more than S-2; Maj. Charles
  Kinsey named as S-3 (Apr 71); would have lived at the battalion **CP/TOC**; where he drew it is
  unknown;
- **why only once / not standard practice** — reads as a one-off, skill-based ad hoc task (bases
  normally laid out by engineers); opportunity was rare (few genuine base stand-ups); caveat that
  his letters under-report duties generally, so silence isn't proof.
Cross-linked both ways with the 30 Jan letter.

---

## Letter count
**41 letter files** now in `site/soldiers/miller-marvin-dale/letters/` (Mar 1970 → Nov 1971).
Remaining sizable mid-tour gap: **Apr 27 → May 16 (19 d)**. (Jul 12 → Aug 4 now filled by 26 Jul.)

---

## NEXT — CARRY-FORWARD

### Pre-Vietnam "training set" — STILL MISSING (for now)
Source: **`Marvin Miller Letters Home.docx`** in `Downloads/letters/miller-marvin-dale/`. Letter 1
(29 Mar 70) done in S77; **Letters 2–5 have metadata only** (Fort Dix basic → Fort Polk AIT), plus
~a dozen total. **Also: an undated training-days letter to brother Dan** (per Michael — that's why
8 Mar is only the *in-country* sibling letter). When the set lands: build them, add the training
arc to the profile, confirm induction.

### Induction status — RESOLVED this session
`service_record.induction.status` set to **`enlistment`** — **confirmed by Michael**: his dad
volunteered, was not drafted (a two-year enlistment, 23 Mar 1970, ahead of a low draft-lottery
number). Matches the MDM-FAMILY-BACKGROUND account. The remaining training-arc work (Fort Dix
basic → Fort Polk AIT) still depends on the missing pre-Vietnam letters.

### Open research questions — Fontaine drawing (for any 2/8 veteran contact)
See `MDM-RESEARCH-FONTAINE-DRAWING` (5 items): late-Jan '71 battalion CO; how the Army knew of his
art training; which staff officer tasked/kept the drawing; where he made it; whether the drawing or
any reference survives.

### Scanning workflow (process)
Michael is looking for a **built-in Windows** way to scan the remaining documents/letters (he
**can't install** new software). See the assistant's reply this session — Windows Fax and Scan
(built-in) + Microsoft Print to PDF, vs. the Store "Scan" app. Continue the **single-PDF-per-letter**
convention (`Downloads/letters/miller-marvin-dale/`, names like `30jan71.pdf`, `8mar71-dan.pdf`).

### Photos (big remaining batch)
**75+ photos** still to add — profile/field/event — different pipeline (image files + index/caption
entries + **R2 backfill + redeploy**).

### Non-Miller (still open from S76/77)
- **NARA RG 472 pull** for the 20–24 Apr 1971 action — awaiting researcher **Michael Bracey**'s quote.
- Operation Thunder oq-01/02/03; Overlord FSB Hall coordinate / C/5-42 FA; unprofiled men (Druener,
  Perritt, Gay, Perot, Don Miller; Fanning re-survey).

---

## FILES TOUCHED (this session)
**NEW letters (3):** `…-19710130`, `…-19710308`, `…-19710726` (in `site/soldiers/miller-marvin-dale/letters/`).
**NEW doc:** `soldiers/miller-marvin/documents/MDM-RESEARCH-FONTAINE-DRAWING.md`.
**MODIFIED:**
- `site/soldiers/miller-marvin-dale/miller-marvin-dale.md` — Silver Stands Down timeline quote.
- `soldiers/miller-marvin/documents/MDM-FAMILY-BACKGROUND.md` — art-training reframe + open question.
- letters `…-19710307`, `…-19710309` (xref to 8 Mar/Dan), `…-19710712` (prev 27 Jun, next 26 Jul),
  `…-19710804` (prev now 26 Jul), `…-19710124` (next now 30 Jan), `…-1971-02-undated` (30 Jan xrefs).

## Repo state / build
- **No new images** → no R2 backfill. Build + deploy run by Michael at close.
- Pre-existing uncommitted churn from earlier sessions still present (see S77 handoff); worth a
  cleanup/commit pass when convenient.
