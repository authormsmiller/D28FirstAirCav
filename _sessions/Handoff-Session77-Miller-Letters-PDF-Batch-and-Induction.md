# d281staircav — Session 77 Handoff
**Date:** June 24, 2026
**Continues from:** Session 76 (Operation Overlord enrichment; Garvin v16 deck → Operation Thunder
event + Chopper-Unit clipping; NARA RG 472 pull planning). Note: **no Session 77 handoff existed at
the start** — the `_sessions` run stopped at 76, so this is the first Session 77 document.
**Theme:** A big **Marvin Dale Miller letters** push — processed **14 new letters** from a new
single-PDF workflow, reconciled a same-day pair, **corroborated Operation Thunder** from inside D Co,
placed a faint undated letter and an incomplete one by content, opened the **pre-Vietnam (1970
training) chapter**, and set his **induction date** on the profile.

**Deploy:** Run by **Michael at session close** (build + `npx wrangler deploy` + push via GitHub
Desktop). **No new images this session** — every change is markdown (letter transcriptions + notes),
so **no R2 backfill needed**. (See "Repo state" for a note on the working tree.)

---

## What this session did

### New Marvin Miller letters processed (14)
All built in the standard letter format (frontmatter + transcription + Transcription Notes +
Archivist Notes + cross-references), cross-linked to their neighbors and to locations/events.

**Pre-Vietnam (NEW chapter):**
- **29 Mar 1970 — "Basic Training Starts Monday"** (Fort Dix, NJ). The **earliest letter in the
  collection**, written Easter Sunday before basic training. Now the new "first letter overall"
  (15 Dec 70 remains the first *in-country* letter).

**1971 in-country (filled gaps):**
- **24 Jan — "A Short Letter Is Better Than No Letter"** (FSB Silver; the USO show in `uso-1.jpg`).
- **~10 Feb (undated) — "A Couple of Cowboy Stories"** — faint scan, **reconstructed by hand by
  Michael**; placed by content (see below). `date_known: false`, slug `…-1971-02-undated`.
- **22 Feb — "Distribute the Heat a Little More Evenly"** (Elderton-bank payoff plan begins).
- **26 Feb — "Jojo the Monkey"** (3 pp; the fullest explanation of his Army pay/savings — $35/mo,
  rest banked).
- **7 Mar — "Some of the Little Ones Won't Remember Me"** — **INCOMPLETE** (pp. 1–2 only; breaks off
  mid-sentence, closing page + signature missing). `date_known: true` (the date is legible).
- **13 Apr — "Back With the Company"** (off Relay Mountain; new company captain; Kodak 124).
- **30 May — "On Base King"** (FSB King — **Operation Thunder corroboration**, see below).
- **19 Jun — "Back from Hong Kong"** (R&R return; back on FSB Fanning). Profile timeline already
  pinned his R&R return to 19 Jun — this is that letter.
- **27 Jun — "Starting My 8th Month"** (Vũng Tàu; mosquitoes).
- **4 Aug — "A Mini Base Where Silver Used to Be"** — written, unremarked, on his **E-5 promotion
  day**; FSB Silver rebuilt as a "mini base."
- **9 Aug — "Here in Vung Tau Now"** (mailed together with the forgotten 4 Aug letter; unprompted
  "you don't have to worry about me getting on any drugs" — the 1971 GI heroin scare).
- **3 Oct — "Another Month Gone By"** (pre-election riots in Biên Hòa/Saigon = the 3 Oct 1971 SVN
  election; dateline anchor).
- **24 Nov — "So Long to My Buddies"** (`…-19711124b`) — a **second letter dated 24 Nov**, the
  evening one from Bien Hoa; now the **actual last surviving letter** of the tour.

### The single-PDF workflow (process note)
Michael switched from uploading separate page JPGs to **one PDF per letter**. PDFs render inline
(both/all pages visible at once), which is **noticeably easier** to read and transcribe than chasing
separate JPGs. Recommended going forward. Naming like `4aug71.pdf`, `7mar71-incomplete.pdf` in
`Downloads/letters/miller-marvin-dale/`.

### Same-day 24 Nov reconciliation
There are **two distinct letters dated 24 Nov 1971** (Michael's call: keep both, distinct slugs):
- `…-19711124` ("Don't Send Anymore Letters…") — the **morning/field** letter from FSB Jeffries
  ("I'm going back to Bien Hoa today").
- `…-19711124b` ("So Long to My Buddies") — the **evening** letter from Bien Hoa ("it's getting
  pretty late"); the actual last letter.
- Reconciled the existing `…-19711124`: reframed from "the last letter" to the morning half; **softened
  its "spent Thanksgiving in the rear" claim** (the new letter shows he meant to go back out to the
  firebase on Thanksgiving to say goodbye); fixed the "closing line of the whole correspondence"
  note; added companion cross-links both ways.

### Operation Thunder — corroborated from inside D Co
The **30 May letter** ("I'm on base King now. But we're going to tear it down in a couple of days and
go back to Fanning. King's not far from Ham Tam.") is a **primary source from a man on the firebase**.
Added to `events/operation-thunder-1971-05/index.md` in three places — frontmatter `sources`, a new
prose paragraph in "Where 2/8 Cav fit," and a Sources-table row — confirming the **~1 June teardown**,
the **return to Fanning**, and the **King–Ham Tan** link. `last_updated` → 2026-06-24. (Did **not**
fully resolve any open question — oq-03 still wants pinned Nui Be/Ham Tan coordinates.)

### Dating the faint undated letter (Feb 1971)
Placed in the 24 Jan–22 Feb gap, **~6–21 Feb 1971, from FSB Fontaine**, on four converging anchors:
(1) the old Ford's **new transmission** "when Dan gets it out" — between the 10 Jan decision and the
22 Feb "springs are on"; (2) **dry season**, no rain in >1 month, just before the 26 Feb "first rain
in almost 3 months"; (3) **after the Silver→Fontaine move** (26–28 Jan; Marvin was still at Silver
for the 24 Jan USO show); (4) **McGrew's calendar first records Fontaine on 6 Feb** (lower bound —
Michael's catch). `doc_date: 1971-02-10`, `date_known: false`.

### Profile — induction date set
`service_record.induction` was all null. Set from the 29 Mar 1970 (Easter) letter math (arrived
training center Thu 26 Mar after 4 days at reception):
- **date: 1970-03-23** (most likely Monday; possibly Sun 22 Mar) — reconstructed, documented in a YAML
  comment.
- **location: Fort Dix, NJ (reception station)**
- **status: null** — *draft vs. enlistment not yet confirmed* (ask Michael).

### Family identifications (from Michael, now in the notes)
- **Carolyn** = Marvin's sister; **Mary** = Carolyn's daughter (his niece) — the ear operation (faint
  Feb letter).
- **Paul/"Paulie"** = son of sister **Pat**; **Amy** = **Evelyn**'s daughter; **Julie** = **Judy**'s
  daughter; **Contrael** is the family surname (Marvin spelled it "Contrails"); Judy Contrael was
  expecting in spring '71 (7 Mar letter).

### "First letter" framing fixes
With a Mar 1970 letter now earliest, tightened references in `…-19701226` (intro "second letter home"
→ "second letter from Vietnam"; notes/cross-refs), and both 24 Nov letters ("first letter" → "first
in-country letter"). 15 Dec 70 = first **Vietnam** letter; 29 Mar 70 = first **overall**.

---

## Letter count
**38 letter files** now in `site/soldiers/miller-marvin-dale/letters/` (Mar 1970 → Nov 1971; includes
the two same-day 24 Nov letters and two content-placed undated letters: `…-1971-02-undated` and the
older `…-1971-04-undated`). Cadence is otherwise every ~4–13 days.

---

## NEXT — CARRY-FORWARD (Miller)

### Pre-Vietnam letters (~a dozen total; only Letter 1 done)
Source: **`Marvin Miller Letters Home.docx`** in `Downloads/letters/miller-marvin-dale/`. Letter 1
(29 Mar 70) is transcribed and filed. **Letters 2–5 have metadata only** (need transcriptions):
- **Letter 2** — Apr 5, 6 & 8 1970; postmark Apr 9; Fort Dix, NJ.
- **Letter 3** — Fort Dix **postcard**, undated (~Apr 18–19); postmark Apr 20; Fort Dix.
- **Letter 4** — Apr 30 1970; postmark May 4; Fort Dix.
- **Letter 5** — May 24 1970; postmark May 26; **Fort Polk, LA** (AIT / "Tigerland").
- Plus more beyond Letter 5 (Michael: "about a dozen or so at most" pre-Vietnam).
- When these land: build them, then **add the training arc to the profile** (Fort Dix basic → Fort
  Polk AIT → RVN 4 Dec 70) in `service_record`/timeline, and confirm **induction status (draft vs.
  enlist)**.

### Photos (big remaining batch)
**75+ photos** still to add (Michael's estimate) — profile/field/event. Different pipeline from
letters: image files + `photos/field`, `photos/profile`, and per-event/location `index.md` caption
entries, **plus the R2 backfill + redeploy**. When starting, sort each as profile / field /
event-or-location so the index entries + captions match existing structure.

### Smaller threads
- **Induction status** — draft vs. enlistment (one field).
- **Vietnamese newspaper keepsake** — the 4 Aug letter says he mailed home "a little newspaper… you
  probably won't be able to understand it"; possible document/keepsake to add if it survives (cf.
  `photos/field/events/chieu-hoi-woodblock.jpg`).
- **Remaining Vietnam cadence gaps** (if more letters surface): **Jul 12 → Aug 4 (23 d)** and
  **Apr 27 → May 16 (19 d)** are the only sizable mid-tour gaps left.

### Non-Miller (still open from S76)
- **NARA RG 472 pull** for the 20–24 Apr 1971 action — awaiting researcher **Michael Bracey**'s quote.
- Operation Thunder oq-01/02/03; Overlord FSB Hall coordinate / C/5-42 FA; unprofiled men (Druener,
  Perritt, Gay, Perot, Don Miller; Fanning re-survey).

---

## FILES TOUCHED (this session)
**NEW letters (14):** `…-19700329`, `…-19710124`, `…-1971-02-undated`, `…-19710222`, `…-19710226`,
`…-19710307`, `…-19710413`, `…-19710530`, `…-19710619`, `…-19710627`, `…-19710804`, `…-19710809`,
`…-19711003`, `…-19711124b` (all in `site/soldiers/miller-marvin-dale/letters/`).
**MODIFIED:** `site/events/operation-thunder-1971-05/index.md` (30 May corroboration); letters
`…-19711124` (reconciliation), `…-19710309` (companion-letter note → 7 Mar), `…-19701226` (framing);
`site/soldiers/miller-marvin-dale/miller-marvin-dale.md` (induction).

## Repo state / build
- **No new images** → no R2 backfill. Build + deploy run by Michael at close.
- **Heads-up:** the working tree has substantial **pre-existing uncommitted churn** from earlier
  sessions (≈hundreds of files — `.wrangler/` cache, `admin/.env`, `_intake/` logs, old handoffs,
  plus prior Miller letters never committed). This session's meaningful changes are the Miller
  letters/event/profile listed above; the rest of the noise predates this session. Worth a cleanup/
  commit pass when convenient (and confirm `.wrangler/`, `.env`, `_intake/` are gitignored as
  intended).
