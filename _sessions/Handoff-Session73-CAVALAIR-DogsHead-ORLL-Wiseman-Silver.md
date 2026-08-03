# d281staircav — Session 73 Handoff
**Date:** June 19, 2026
**Continues from:** Session 72 (Unit History tabs; prepped the CAVALAIR newspaper sweep)
**Theme:** Ran the **CAVALAIR newspaper sweep**, built and then **officially confirmed** a D Co
2/8 combat action (the **Dog's Head, 18 Mar 1970**) against the 1st Cav ORLL, created **SGT
Richard Wiseman's** profile and tied him to that action as a near-certain casualty, added **two
morale events**, and processed **Jim Garvin's FSB Silver deck** end-to-end (Fontaine pattern):
a live **FSB Silver** location page, 14 photos, **14 new Range Platoon stubs**, and a **2 Feb
1971 contact** later **confirmed by McGrew's field calendar**. **Deployed and verified live.**

---

## What Session 73 built / changed

### CAVALAIR sweep (the Session-72 carry-forward)
- Swept all 17 CAVALAIR issues in `cavair/` for (1) D Co 2/8 specifics, (2) FSB datelines 2/8
  occupied, (3) division/bde/bn items that may involve D Co. Filtered hard against false
  positives (D 2/7, D 1/5, D 1/7, B/C 1-8, etc.). 14apr71.pdf had a usable text layer after all.
- Findings list surfaced to Michael; **#1 (Alpha Blues / Dog's Head) and #2 (VIP Center
  stand-down) built this session**; #3 (Duds at Fontaine) already existed via Ken Weaver.

### Dog's Head event — built, then OFFICIALLY CONFIRMED
- **`events/contact-dogs-head-1970-03-18/`** (type: contact). Built from the CAVALAIR 8 Apr 1970
  front page "Alpha Blues Surprise NVA Force," then **confirmed against the 1st Cav ORLL (DTIC
  AD0512505)**: daily-log entry **"181110 Mar XT045833"** — 18 Mar 1970, 11:10, contact broke
  1125 (the 15-minute fight the paper describes), SA/AW/B-40 fire, **14 US WIA, 19 NVA KIA**.
- Verbatim doc **`documents/unit/cavalair-alpha-blues-dogs-head/`** (the article) and
  **`documents/unit/orll-1cd-dogs-head-1970-03/`** (the ORLL entry, type: report).
- Clipping `assets/docs/alpha-blues-clipping.png` (Michael supplied).
- Operational frame: 1st Bde, **LTC Michael J. Conrad**, vs **NVA 272nd Regiment** (AD0509767
  "Operations in the Dog's Head" + HistoryNet "Rescue at Dog's Head"). The famous 26 Mar Alpha
  Troop/1-11 ACR rescue of C/2-8 was the same operation, a week later.

### SGT Richard Wiseman — new KIA profile
- **`soldiers/wiseman-richard/`** via the kia-profile skill, then **rewritten** — the skill is
  hardwired to the 1972 Chinook batch and injected wrong (crash) narrative/decorations/event.
  Replaced with his real facts: **KIA 18 Mar 1970, Tay Ninh, hostile, "Died of Wounds, multiple
  fragmentation wounds."** Organic unit **HHC, 2/8** (Virtual Wall) — the honor roll's "attached
  to D Co" = an HHC soldier detailed out to the line company.
- **Near-certain tie to the Dog's Head action**: one of the 14 WIA (B-40 = fragmentation; DOW
  fits WIA-who-died). Listed under the event's `casualties.dow` and linked in `related_events`.
  Name-confirmation still needs the 2/8 daily staff journal (NARA RG 472).
- **CPL Michael C. Jackson** (D Co 2/8, KIA 17 Mar 1970, Tay Ninh) is held SEPARATE — the ORLL
  log shows no 17 Mar action.

### DTIC research preserved
- `sources/orll-1cd-1970/` — README (citations + entry transcription + cross-checks) + raw OCR
  excerpt of AD0512505 (ORLL) and AD0509767 (Senior Officer Debrief). Original PDFs in
  `KIA/wiseman-richard/`.

### Two morale events (Morale tab now = 3)
- **`events/stand-down-vip-center-1970-04/`** — D Co (and E Co) 2/8 three-day stand-down at the
  Bien Hoa VIP Center, CAVALAIR 8 Apr 1970. Full-page clipping `assets/docs/bien-hoa-morale-8apr70.png`
  (Michael supplied; credit SP4 Lou Fallscheer). NOTE: the issue's VIP article quotes C/1-12 Cav,
  excluded.
- **`events/bob-hope-long-binh-1970-12-25/`** — Bob Hope Christmas show, Long Binh, from Garvin's
  deck.

### FSB Silver — Garvin v04_silver deck (Fontaine pattern)
- **`locations/fsb-silver/index.md`** — live location profile. **Silver -> Fontaine chain now
  dated**: teardown 26-28 Jan 1971, dovetails with Fontaine established 28 Jan 1971. Resolves the
  long-standing "stub FB Silver" carry-forward.
- **14 Silver photos** at `soldiers/garvin-jim/photos/locations/fsb-silver/` — ONLY frames where
  Silver is named/the subject (Michael's call). Soldiers-present auto-computes (Garvin, Collins,
  Dillon, Russell Burnett).
- **Deferred location photo folders** (no profiles yet, won't surface live until built):
  `garvin-jim/photos/locations/{fsb-mace,gia-ray,fsb-bolden,first-team-academy}/`. **FB Bolden is
  a NEW base** (Hwy 36).
- **14 new Range Platoon stubs** (status researching, platoon Range): crawshaw-doc, cullen-brad,
  fairchild-joe, graham-ray, kincade-leo, lance-don, meyer-doug, smith-joe, deemer-henry,
  hunsucker-ray, recek-bob, lester-fred, **burnett-russell** (a SEPARATE man from burnett-edward,
  who arrived 1972 / Chinook crash), **carbone-vince**. Collins-gary stub enriched.
- **`events/contact-trotter-1971-02-02/`** (type: contact) — Range 3 trail fight, Garvin's M-60
  jammed, **Sgt Joe Smith thumb shot off**, Vince Carbone (living vet, 2020 account). **Date
  confirmed by McGrew's Feb-71 field calendar** ("Contact" on 2 Feb; calendar also shows "Humped
  into Fontaine" 6 Feb, corroborating the move).

### Template fixes (both real bugs)
1. **`event.njk` DOW block** never set `personSlug` — DOW casualties wouldn't link/show a photo.
   Added the `{% set personSlug = ... %}` line (mirrors KIA/WIA/MIA). Wiseman now renders.
2. **Event Images tab double-rendered** photos when both a frontmatter `images:` block AND
   `event:`-tagged crawler photos existed. RULE: for an event, use EITHER the frontmatter
   `images:` list OR a contributor photo collection tagged `event: <slug>` — not both. Fixed the
   Feb 2 and Bob Hope events by dropping their frontmatter `images:` blocks.

---

## CRITICAL LESSON (reinforced AGAIN)
**The Edit/Write tools truncate these repo files** — the Dog's Head body cut at "## M", the
morale event cut mid-sentence, and `.eleventy.js` lost its tail in Session 71. The tool's cached
view and the build's on-disk copy diverge; an en-dash in a heading was one trigger.
**RULE: write/patch any repo file via the bash mount (python read/replace/write or heredoc) and
verify on disk (`tail`, `grep`) + run a build. Do not trust an Edit/Write "success" message.**
All of this session's durable writes used python and built clean.

---

## DEPLOY — DONE this session
Michael ran the full sequence and verified live:
```
node admin/scripts/backfill-r2.js   # 31 new R2 photos (30 Garvin Silver-deck + 1 Wiseman)
cd site && npm run build            # 344 files, clean
xcopy /E /Y assets _site\assets     # alpha-blues + bien-hoa clippings
npx wrangler deploy                 # from site/
```

---

## CARRY-FORWARD

### Letters session (Michael will run a dedicated pass)
- ~10-12 remaining in-country Marvin letters + a training batch.
- Specific lead: the **late-Jan/early-Feb 1971 letter** about Marvin being asked to **draw the
  new firebase for the colonel** (-> Fontaine; the move; the colonel's ID). Held until the letter
  is relocated so dates/story are exact.
- Add **Marvin's artist / art-school** bio detail to his profile (can be done independent of the
  letter).

### Stub session
- Enrich the 14 new Range stubs; **priority living contact: Vince Carbone** (2020 account).
- Confirm WIAs: **Sgt Joe Smith** (thumb, 2 Feb 71), **Fred "Worm" Lester** (M-79 medevac).
- Give **Stan Dillon** the "Range platoon sergeant, E6" detail; finish **Gary Collins**.

### Build deferred location profiles (photos already filed, will auto-connect)
- **FB Bolden** (NEW, Hwy 36), **FB Mace**, **Gia Ray**, **1st Team Academy (FTA)**.

### Primary-source confirmations (NARA RG 472, 2/8 daily staff journal)
- **18 Mar 1970** — name the Dog's Head WIA roster (confirm Wiseman by name; ID the D Co CO/platoon).
- **17 Mar 1970** — find Jackson's (separate) action.
- **early Feb 1971** — the 2 Feb contact details.

### Remaining CAVALAIR finds (surfaced, NOT yet built — Priority 3 battalion-level)
- 2/8 Battalion Chaplain CPT Patrick J. Boyle (14 Jan 70); 2/8 chief medic SP6 George T. Jenkins
  (25 Feb 70); Prek Klok = 2/8 CP (28 May 69); LOH-pilot DFC for a 2/8 element contact (~May 69);
  B/2-8 Tay Ninh ambush (7 May 69); 8th Cav regimental history / Korea-Unsan (14 Apr 71).
  (The recurring "2/8 correspondents" masthead = bylines, skip.)

### Open IDs
- Battalion commander late 1970 known only as **"Chuck Chuck"** (Michael: possibly **Bacon** —
  note `bacon-wg` in roster; unconfirmed). Company CO confirmed **Capt. Bedsole**.

---

## NEW WORKFLOW IDEA — "summary posts" for the FB group
Recent additions have driven real engagement on the Facebook group (and produced the FSB Fontaine
**bicycle photo** + Ken Weaver's "Duds" clipping). Michael wants to start writing **short summary
posts** to paste into the group whenever new content goes live — they pull responses (names,
photos, corrections, IDs) far better than silent updates.

**Proposed:** make this a standard end-of-session deliverable. After building, generate a
ready-to-paste FB post per new item — plain text, conversational, no markdown, ending with a
specific ask ("If you served in Range Platoon in early '71, who else was on that trotter?").
Good first candidates from this session: the **Dog's Head action** (now ORLL-confirmed; ask for
the men + the 17-18 Mar casualties), **FSB Silver** (the deck is up — ask for IDs on the Range
men, Doc Crawshaw, Joe Smith), and the **Bob Hope show**. Could become a small skill later.
