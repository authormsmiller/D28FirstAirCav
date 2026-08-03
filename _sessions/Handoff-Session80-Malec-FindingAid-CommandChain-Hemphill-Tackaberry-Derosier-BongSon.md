# d281staircav — Session 80 Handoff
**Date:** June 27, 2026
**Continues from:** Session 79 (early-war KIA profiles, Jim Bowie/Masher events, command-chain Tier 4,
finding-aid concept). This session took **SGT Paul Malec** from a photoless DOW stub to a fully
built-out profile **with a downloadable family finding-aid**, then broke open the **1965–67 2/8 Cav
command chain** (Hemphill → Tackaberry → Dashiell, with dates), and **identified 2LT Derosier as the
platoon leader in Tackaberry's Distinguished Service Cross action**, building a fully-cited event for it.
**Theme:** Malec photos + family account + DOW reconciliation → operational build-out (Jim Bowie,
Masher/White Wing, Lincoln) → finding-aid PDF + R2 hosting → command-chain breakthrough → the Bong Son
19 Sep 66 event → housekeeping (Collins roster bug, newsletter PDF).

> ⚠ **Sandbox note (unchanged from S79, still biting):** the Linux mount repeatedly served **stale/
> truncated copies of freshly-edited files**, so bash YAML/JSON validation threw false ScannerError /
> "Expecting value" / "Unterminated string" errors. **Every time, the authoritative Read tool
> confirmed the files complete and valid.** Trust Read, not bash, for just-edited files. The build runs
> against the real files.

> **Deploy still owed by Michael (nothing auto-deployed this session):**
> 1. `node scripts/upload-soldier-photos.cjs malec-paul` — pushes the **cleaned profile photo**, the
>    field photos, AND the finding-aid PDF to the `angryskipperarchive-photos` R2 bucket in one go.
> 2. Rebuild + deploy (eleventy) so the new event pages, the new Hemphill profile, the Collins stub fix,
>    Malec's Documents-tab finding-aid entry, and all the command-chain wiring go live.
> 3. Optional cleanup: an **orphaned** copy of the finding-aid PDF was pushed early into the
>    `angryskipperarchive-documents` bucket (that bucket is NOT web-served) — delete
>    `documents/malec-paul/finding-aid-sgt-paul-malec.pdf` from R2 whenever; harmless if left.

---

## Malec — fully built out

- **Photos (3, courtesy David Malec, great-grandson):** `malec-paul-profile.jpg` (101st Airborne
  jump-gear portrait — **cleaned** of screenshot UI icons via cv2 inpaint; untouched master remains in
  `KIA/malec-paul/`), plus two field photos (`malec-paul1.jpg` solo; `malec-jeep.jpg` — Malec's ID
  uncertain, family's best guess far-left trooper). `photos/profile/index.md` + `photos/field/index.md`
  written; `photo_intro` rewritten.
- **Family account (FB):** David Malec's post in the **"1st Cavalry Division Veterans"** group,
  27 Jul 2025. New bio: trained 101st Airborne → 11th Air Assault Div (→ 1st Cav), **squad leader**.
- **DOW reconciliation (the key payoff for the family):** official record codes the 21 Mar 66 wounding
  **hostile / multiple fragmentation wounds**; the family/comrade account says an **accidental
  detonation while setting a trap** (ignited his own smoke grenades). Corroborated and reconciled by
  two primary sources now on file: **MACV Communiqué #080-66 (1700H 21 Mar 66)** — "no significant
  contact in the nine days of searching," friendly casualties "majority sustained from punji sticks" —
  and the Jim Bowie casualty profile (**3 KIA / 377 WIA, mostly punji-stake booby traps**). Place of
  death confirmed **Fort Campbell, KY** (101st post; near the Dover, TN burial). All folded into his
  timeline + admin notes.
- **related_events:** deployment-vietnam-1965, operation-all-the-way-1965, operation-masher-white-wing-1966,
  operation-jim-bowie-1966. **`_alongside.json`:** coffey/hamill/hill/wilson (same-tour Tier 3) +
  **hemphill-john (Tier 4 CO)**.

### Finding-aid PDF (delivered for David)
- 7-page print-ready PDF (reportlab), six branches per `_docs/finding-aid-concept.md`, with **tiered
  Locations** (Confirmed: LZ Sue / LZ Rene / FB Phoenix City — anchor; Probable; Possible). Cover uses
  the cleaned photo.
- **Hosting decision (important, learned the hard way):** the `/media/` route serves the
  **`angryskipperarchive-photos`** bucket only; the **documents bucket is NOT web-served** (that's why
  doc pages use `/assets/docs/`). So the PDF lives at **`site/soldiers/malec-paul/photos/finding-aid-sgt-paul-malec.pdf`**
  → uploads via `upload-soldier-photos.cjs` → public URL
  **`https://angryskipperarchive.org/media/photos/soldiers/malec-paul/finding-aid-sgt-paul-malec.pdf`**.
- **On-site surfacing:** a document stub `documents/malec-paul/finding-aid-sgt-paul-malec/…md`
  (`contains: malec-paul`, NOT `author:`) makes it appear under his **Documents tab** as an *about-him*
  reference with a download link. (Bare PDFs don't surface — the crawler only indexes doc `.md`.)
- Working copies also in `site/assets/docs/` and the scratchpad outputs.

---

## Command chain — broken open (1965–67)

**The chain, now dated:** **LTC John A. Hemphill (1965 → 30 Jul 66) → LTC Thomas H. Tackaberry
(30 Jul 66 → 7 Feb 67) → LTC John C. Dashiell (7 Feb 67 → ?)** → … → Bacon → Blagg (1971).

- **`hemphill-john` — NEW stub.** MG John Allen Hemphill (1927–2021), 2/8 CO "Stone Mountain 6" across
  **all of Malec's window**. **Four independent confirmations:** Michael's `Commanding-Officers.txt`
  roster note (1965); the **15 Aug 66 ORLL command roster** (sitting CO, no change logged); **Wikipedia**;
  and his **Legion of Merit citation** ("Commanding Officer, 2d Battalion, 8th Cavalry … 1965–1966").
  Korea DSC; retired MG. Wired as Malec's Tier 4 CO; added to `alongside-exclude.json` command group.
- **`tackaberry-thomas` — greatly enriched.** LTG Thomas H. "Tom" Tackaberry (1923–2017), **three
  DSCs + five Silver Stars**, retired 3-star; commanded 82nd Abn & XVIII Abn Corps. Command dates set
  (30 Jul 66 → 7 Feb 67). Wikipedia + Hall of Valor + Veteran Tributes links; decorations populated.
- **Handoff date Hemphill→Tackaberry = 30 July 1966**, read by Michael off the (barely legible) 22 Nov 66
  ORLL roster. Both stubs + Malec's CO note updated accordingly.
- **ORLLs filed:** `sources/orll-1cd-1966/ORLL-1cd-15Aug66.pdf` and `ORLL-1cd-22Nov66.pdf`. The 15 Aug 66
  ORLL is the **earliest proper 1st Cav ORLL** (quarterly series starts mid-66); pre-66 is AARs + the
  Interim Report.
- **Callsign convention confirmed:** **Stone Mountain 6 = 2/8 BATTALION CO** (LTC), not brigade (the
  note's "Brigade CO" label was a slip — brigades are full Colonels). **Skipper 6 = D Co company CO**
  (Capt) — a layer NOT yet modeled.
- **`KIA/Commanding-Officers.txt`** (Michael's roster note) is **held as a research note only** — dates
  unreliable (overlaps), not built into stubs. Company-CO (Skipper 6) names: Ambrose, Batts, Colavita,
  Garner, Grannerman, Guest, Livingston, Scholes, Kirby Smith. **Robert Batts = Malec's probable D Co
  company commander (1966), UNVERIFIED.**

---

## Derosier = the platoon leader in Tackaberry's DSC action → new event

- **`contact-bong-son-1966-09-19` — NEW event** ("D Company at Bong Son — 19 Sep 1966; Death of 2LT
  Derosier; LTC Tackaberry's DSC"). The **most documented single-action page in the archive** — anchored
  by Tackaberry's **full DSC citation** (HQ USARV GO No. 6537, 28 Nov 1966), quoted in full. Operation
  **Thayer I** frame. type: contact, Tier 1 (D Co confirmed).
- **Identification:** Tackaberry's 2nd DSC was for 19 Sep 66 near Bong Son, where a 15-man 2/8 patrol's
  **platoon leader was killed**. **2LT Michael Derosier (D Co 2/8) is the only 2/8 officer KIA that day**
  → he is the platoon leader (citation doesn't name the company; identification effectively certain).
- **Province correction:** Derosier's DCAS record says **Quang Tin (I Corps)** — an error; 2/8 was in
  **Binh Dinh near Bong Son** (Thayer I). Public pages corrected per coverage-model; DCAS error noted in
  admin.
- **`derosier-michael` enriched:** KIA timeline rewritten with the action + Tackaberry's rescue; province
  fixed; **`_alongside.json` NEW** (Tackaberry Tier 4); related_events → the event.
- Both Derosier and Tackaberry **reference the event as the single landing place**; profiles carry only
  the relevant parts (per Michael: full story in one spot).

---

## Events this session
- **NEW:** `operation-jim-bowie-1966` (Mar 66, Malec's wounding op; primary AAR AD0829472 is OFF DTIC —
  needs NARA RG472 / Donovan pull; **MACV communiqué 21 Mar 66 filed** in its sources/ with the TTU URL).
- **NEW:** `operation-masher-white-wing-1966` (25 Jan – 6 Mar 66; AARs + Bong Son LL filed; wired to Malec).
- **NEW:** `operation-lincoln-1966` (Pleiku/Oasis, late Mar 66 — AFTER Malec's wounding; **deliberately NOT
  wired to Malec**; CAAR filed).
- **NEW:** `contact-bong-son-1966-09-19` (see above).
- **MODIFIED:** `operation-all-the-way-1965` — added the 2/8 Cav 9–10 Nov 65 battalion AAR as a source
  (D Co at STADIUM → An Khe; adjutant-signed, no CO name).
- **NOT built — ruled out:** **Operation Happy Valley** (13–31 Oct 65) — An Khe op led by 1/5 Cav; 2/8 was
  moving to the Plei Me relief, so Malec was NOT in it. PDF + disambiguation README filed in
  `events/operation-happy-valley-1965/sources/` (no published page).

## Source PDFs filed this session
- `events/operation-jim-bowie-1966/sources/` — MACV-Communique-080-66-21Mar1966.pdf (+ README)
- `events/operation-masher-white-wing-1966/sources/` — Ops-Masher-White-Wing-25-Jan-1966.pdf,
  COAAR-MACV-28-Apr-66.pdf, Bong-Son-Campaign-min.pdf
- `events/operation-lincoln-1966/sources/` — CAAR-Op-Lincoln-Op-Mosby-I-1966-min.pdf
- `events/operation-happy-valley-1965/sources/` — Lesson_Learned_58_…Happy_Valley… + README
- `events/operation-all-the-way-1965/sources/` — AAR-2d-8th-Cav-9-10Nov65.pdf
- `sources/orll-1cd-1966/` — ORLL-1cd-15Aug66.pdf, ORLL-1cd-22Nov66.pdf
- `sources/newsletters/newsletter-2007-jun.pdf` — ASA June 2007 newsletter (see below)

## Housekeeping
- **Collins roster bug FIXED.** `soldiers/collins-gary/collins-gary.md` was a **frontmatter-less note**
  → rendered as a blank "," at the top of the roster + an untemplated page. Converted to a proper
  **researching stub** (Gary Collins, Range Platoon point man, Cherokee from SC, replaced Garvin Feb 71;
  lead from Garvin's FSB Silver deck moved to admin notes). Michael: visible researching stub is fine.
- **ASA June 2007 newsletter PDF filed** at `sources/newsletters/newsletter-2007-jun.pdf` (its `.md` was
  a PENDING stub, never extracted). Stub updated to flag a **Letter from Col. Frank Trapnell** with
  general CO info — **command-chain research lead** to extract later. (Bob Hope story in that issue
  skipped for now.)

---

## ★ NEXT SESSION — queue
1. **Michael's deploy steps** (top of file) — upload-soldier-photos.cjs + rebuild/deploy.
2. **Operation Thayer I event page** (Tier 2 frame above `contact-bong-son-1966-09-19`) — Michael: "later."
   Would also carry any battalion aggregate for the Thayer I period.
3. **Extract the Col. Frank Trapnell CO letter** from `newsletter-2007-jun.pdf` (command chain).
4. **Verify Malec's COMPANY commander** — Robert Batts (D Co "Skipper 6" 1966) per the roster note.
   CORROBORATED (not yet proof): **LTC Robert W. "Bob" Batts** (Citadel '60; d. 22 Mar 2025) trained
   with the 11th Air Assault Div (→ 1st Cav) and deployed to Vietnam **Jul 1965, commanding an Airborne
   Infantry Company** (obituary: citadelalumni.org/robert-w-batts-60/) — same unit path as Malec/Hemphill,
   fits Skipper 6, but the obituary names no company/battalion. Need a source placing him at **D Co, 2/8
   Cav** with dates before wiring to Malec. (Recorded in malec-paul admin notes.)
5. **Pin the 19 Sep 66 action**: exact grid + other patrol members + enemy regiment — needs the **2/8 Cav
   daily staff journal (NARA RG 472)** and the **Thayer I AAR**.
6. **Jim Bowie Combat AAR (AD0829472)** — pull from NARA RG472 / Donovan for the event's sources/.
7. **Command-officer stubs** from `Commanding-Officers.txt` — build Skipper 6 (company CO) layer + remaining
   Stone Mtn 6 names when dates are firmer (held this session).
8. **Candidate event pages** from the 1966 ORLLs: Crazy Horse, Davy Crockett, Henry Clay, Mosby II (15 Aug
   ORLL); Byrd, Thayer I, Irving (22 Nov ORLL). Also **506 Valley (17 Dec 66)** — a 2/8 platoon was there
   under Tackaberry (HistoryNet lead).
9. **VVMF Wall of Faces remembrances** for Derosier — not yet checked (JS-rendered; needs browser tools).
10. **Finding-aid feature** (the full client-side `/finding-aid/?slug=` page) — still deferred; Malec's PDF
    is the worked prototype.

## Conventions reaffirmed / added
- **Trust the Read tool over bash** for freshly-edited files (stale-mount truncation).
- **Stone Mountain 6 = battalion CO; Skipper 6 = company CO.** Command stubs use `status: researching`,
  Tier 4 via `_alongside.json` `basis: commanding-officer` (engine auto-creates the reciprocal).
- **Downloadable soldier assets go in `soldiers/<slug>/photos/`** (served via `/media/photos/` from the
  photos bucket); the documents bucket is storage-only, not web-served.
- **DCAS province errors corrected silently on public pages**, documented in admin notes (Derosier
  Quang Tin → Bong Son; cf. coverage-model).
- General/officer commanders titled by their **rank-at-the-time in this unit** (LTC), with later
  star-rank noted in bio (Hemphill MG, Tackaberry LTG) — consistent with the existing Tackaberry stub.

## Files touched (this session)
NEW soldier: **hemphill-john**. MODIFIED soldiers: **malec-paul** (photos, FB account, DOW
reconciliation, related_events, _alongside.json, CO note), **derosier-michael** (timeline, province,
_alongside.json, related_events, notes), **tackaberry-thomas** (full enrichment, command dates,
DSC↔Derosier), **collins-gary** (stub fix).
NEW _alongside.json: malec-paul, derosier-michael. MODIFIED `_data/alongside-exclude.json` (+hemphill-john).
NEW events: operation-jim-bowie-1966, operation-masher-white-wing-1966, operation-lincoln-1966,
contact-bong-son-1966-09-19. MODIFIED event: operation-all-the-way-1965 (source added).
NEW document: documents/malec-paul/finding-aid-sgt-paul-malec/ (.md stub). NEW asset:
soldiers/malec-paul/photos/finding-aid-sgt-paul-malec.pdf + cleaned profile photo + the 3 photo index.md.
NEW source dirs/PDFs: orll-1cd-1966/, the event sources/ folders listed above, newsletter-2007-jun.pdf.
MODIFIED: sources/newsletters/newsletter-2007-jun.md (Trapnell flag).
NEW (in Downloads/KIA, not the repo): Commanding-Officers.txt (research note, held), the dropped source
PDFs, ASA Newsletter 2007_June.pdf.
