# Session Handoff — 2026-07-27
**Session 115**
**Theme:** Built three new soldier stubs from supplied profile photos and source material
(Bruckner, Lomker, Babas), used two of them to open a substantial research thread on FSB/LZ
Carolyn (not yet built as a page), and found — but did not fix — a sitewide data-quality bug in
the "Served Alongside" commanding-officer (Tier 4) entries.

---

## What was completed this session

### Garry Bruckner — new stub profile + document
Built `soldiers/bruckner-garry/` from a supplied profile photo and a scan of *Walking Point*
(Angry Skipper Association newsletter), Issue 20, January 2014, containing his own written
account, "Vietnam: February 2-4, 1970" (pp. 1, 6). Page 6 used a non-standard/shifted font that
`pdftotext` couldn't decode — rendered as a page image and transcribed by hand instead. Full
transcript filed at `documents/bruckner-garry/bruckner-garry-account-1970-02/`; the full raw
newsletter issue filed as a draft placeholder at `documents/unit/asa-newsletter-201401/`
(mirroring the existing `asa-newsletter-201301` pattern). Service timeline built entirely from the
account: arrived Bien Hoa 22 Jan 1970 → assigned D Co., 2/8 Cav → diverted through Song Be → FB
Carolyn → first night in the field (mortar attack, night ambush, 1 NVA KIA, 2 AK-47s captured, no
U.S. casualties). Rank, MOS, and which of the three platoons (Range 1/Range 2/Cat) he personally
joined are all unconfirmed and flagged.

### FSB/LZ Carolyn — three-pass research thread (still not built as a page)
Bruckner's account named FB Carolyn as a stopover, tied to the 11th Armored Cavalry Regiment, near
the Cambodian border. This opened a research thread, staged (per Michael's explicit call — **do
not build `site/locations/fsb-carolyn/` yet**) at **`site/_docs/locations/fsb-carolyn.md`**:

1. **ORLL primary-source pass** — pulled the actual PDFs already in the archive
   (`site/sources/orll/1969/`, `.../1970/`) and found: a confirmed March 1970 grid (XT271783, via
   `AD0511158`); and a fully-documented, previously-unlinked **major battle** — the gazetteer's
   cryptic "overrun 6 May 69" note turned out to be a regimental-size NVA night assault on LZ
   Carolyn, defended by **Companies C and E, 2/8 Cav** (10 US KIA / 73 US WIA vs. 198 NVA KIA per
   the main ORLL; the companion artillery ORLL gives slightly different figures — both quoted, not
   reconciled to one number). The gazetteer's "overrun" wording likely overstates it — the ORLL
   describes a breach followed by a successful counterattack that retook the perimeter.
2. **Gazetteer/geography pass** (`sources/fsb-locations/`) — plotted Carolyn's grid (XT278788)
   against already-published site pages (FSB Becky ~9.6km, Dog's Head ~20.6km, FSB Illingworth
   ~24.5km, FSB Rita ~22.1km) to confirm it sits squarely in the **Tay Ninh Province / War Zone C**
   cluster, matching Bruckner's own account exactly. Also found the already-published
   `contact-dogs-head-1970-03-18` event independently corroborates his 11th ACR detail (Alpha
   Troop, 1st Sqn, 11th ACR operating with 2/8 Cav in this same corridor, March 1970).
3. **Photo find** — Michael located a `fsb-carolyn` folder under `Downloads/locations/` with one
   photo (a 1970 howitzer position, ammo-crate gun-pit wall). Source credit: "John Williams/Mike
   Lomker."

Three open questions remain in the staging doc: whether the 6 May 1969 battle (C & E Co., not D)
warrants its own event page; exact grid-to-grid precision across occupancy cycles; and a loose
thread about a Jan→Feb 1970 lateral 2/8 Cav redeployment (FB Chris, Long Khanh corridor, YT-square)
into this Tay Ninh/XT-square AO, not pursued further.

### Mike Lomker — new stub profile
`photographer:` is confirmed (checked against `_docs/data-standards.md`) to be a single
slug-or-empty scalar that also drives Gallery-2 routing — it cannot carry two names without a
template/crawler change. Filed the Carolyn photo under **lomker-michael** alone, per Michael's
direction; John Williams has no slug yet. The fallback Michael himself proposed, if he later wants
Williams credited equally, is **duplicating the photo into a `williams-john` profile** rather than
changing the schema — flagged in both files, not built.

Built as the thinnest stub in the archive at first (only fact: the photo credit), then enriched
same session when Michael supplied a profile photo plus two facts: **Skull Platoon, 1970-71**.
Skull is D Company's own 1st Platoon nickname (per the Colavita memoir digest), so this confirms
Lomker as D Co. specifically, not just wider 2/8 Cav/ASA membership — status upgraded
`researching` → `veteran` accordingly.

### Glenn Beasley — enriched with a second photo + inferred tour-span dates
Michael added a `fsb-gonder` folder with one photo (soldiers washing up/shaving, Cambodia, June
1970, credited to Beasley). **Unlike Carolyn, FSB Gonder already has a real, published location
page** (`site/locations/fsb-gonder/`), so this photo is live immediately — no staging needed.
Captioned generically ("Soldiers taking a break at FSB Gonder") per Michael's instruction, since no
one in frame is identifiable.

Beasley previously had only a Nov 1969 FSB Becky photo and a 25 Jan 1970 Hau Nghia contact on file.
Per Michael's own observation, the three dated points now bracket a service span — added
`arrived: "1969"` / `departed: "1970"` (year-only, matching the site's established bare-year
convention seen elsewhere) — explicitly documented as a **minimum bound**, not a confirmed exact
tour: his real arrival could be well before Nov 1969 and departure well after Jun 1970.

### Bob Babas — new stub profile + a real attempt at photo text-removal
Built from CPT Henry Colavita's memoir (ch. 9, "Chicken Valley" digest) — was sitting in
`_docs/stub-candidates.md` as a Pending row; moved to Resolved. 2LT, Rifle Range (3rd Platoon),
callsign "Rifle Range 6" — swapped in for Lt. Michael Johnson at Christmas 1968 (a trade Colonel
Henry made after Johnson's foxhole incident during the Dec 4-5 night attack), held the platoon
through the rest of Colavita's command. Cross-referenced the existing Colavita group photo (already
cropped for Spingath's profile) that separately confirms Babas as "Rifle Range 6."

**Photo text-removal, attempted and rejected:** the supplied profile photo had a burned-in,
misspelled "BOB Babbas" text label; Michael also supplied a pre-cropped version with the label
removed and asked whether the original could be cleanly fixed instead. Isolated the yellow text by
HSV color threshold (restricted to its bounding box to avoid false-positives on skin tones — an
unrestricted color mask picked up his face and forearm), then ran `cv2.inpaint` (both TELEA and NS)
at several radii. Text disappeared but left a visibly blurry smudge on the jacket at every setting
tried — the source image is small (444×252) with real fabric texture behind the label, which
simple inpainting can't reconstruct. Judged not clean enough; used the supplied cropped version
instead, per Michael's own fallback instruction. The inpainting attempts were not saved into the
site tree (scratch files only).

---

## What's still on the table

### 1. NEW, HIGH PRIORITY — "Served Alongside" commanding-officer (Tier 4) entries are broken for many soldiers
Michael flagged this at the end of the session: **`site/soldiers/gonder-kenneth/_alongside.json`
has six `commanding-officer` entries** (Conrad, Kingston, Lytle, Moore, Bacon, Blagg — essentially
the entire 1969-1972 CO roster), when it should have **exactly one**. Gonder died 19 May 1970
(per the already-published `fsb-gonder` location page), which falls squarely inside **Kingston's**
tenure (27 Apr – Jul 1970, per `kingston-robert.md`'s own `arrived`/`departed` fields) — he should
show Kingston only.

**Confirmed this is not an isolated case.** A quick sweep (`grep -c "commanding-officer"` across
every `_alongside.json`) found counts ranging from 1 (correctly filtered — e.g. `aguilar-oscar`
shows only Blagg, which is right: his 10 May 1972 Chinook-crash date falls inside Blagg's Jul
1971–Jun 1972 tenure) up to **13** (essentially the entire war-long CO roster dumped in unfiltered
— `coffey-richard`, `derosier-michael`, `hamill-wright`, `hill-eddie`, `linton-samuel`,
`malec-paul`, `rippy-terry` all show 13; `gonder-kenneth` shows 6; roughly 50+ profiles show 2 or
more). The mechanism (`site/_data/alongside.js`) itself looks correct — it's a straight pass-through
of whatever's in each `commanding-officer`-basis entry in `_alongside.json`; the bug is in **how
those files were populated**, not in the crawler. The authoritative source for each CO's own tenure
dates is that commander's own soldier profile (`arrived`/`departed`) — confirmed present and clean
for `hemphill-john` through `blagg-thomas`, though a few of those (`gibney-john`, `bacon-wg`,
`blagg-thomas`) have gaps in their own `arrived`/`departed` fields too, which will need filling in
before an automated date-overlap fix can run cleanly end-to-end.

**Not fixed this session — explicitly deferred to next, per Michael.** Whoever picks this up next
should: (1) decide whether to fix by hand per-soldier or write a small script cross-referencing
each soldier's known date(s) — arrival/departure for full-tour veterans, single incident date for
KIA/single-event soldiers — against the CO tenure table; (2) fill the gaps in the COs' own
`arrived`/`departed` fields first if going the automated route; (3) re-run the full-repo grep above
to get an exact list of affected files before starting (this session's numbers are a snapshot, not
necessarily exhaustive — e.g. it only checked for the literal string `"commanding-officer"`, so any
entries using the `chain-of-command` basis alias wouldn't have been counted).

### 2. FSB/LZ Carolyn — do not build the location page yet
Per Michael, more material is expected before `site/locations/fsb-carolyn/` gets built for real.
Everything found so far (three research passes, see above) is staged at
`site/_docs/locations/fsb-carolyn.md` and ready to fold in whenever that call is made. Related open
items there: the C/E Co. 6 May 1969 battle's event-page scope question, grid-precision across
occupancy cycles, and the unpursued FB Chris lateral-redeployment thread.

### 3. John Williams — no slug yet
If Michael wants him credited equally on the FSB Carolyn howitzer photo (currently
`photographer: lomker-michael` only), the agreed fallback is duplicating the photo into a
`williams-john` profile, not changing the `photographer:` schema to accept multiple values.

### 4. Everything carried forward from Session 114 and earlier remains open and untouched this
   session: `colburn-richard.md`/`stannard-john.md` permanent truncation data loss, `martin-michael`'s
   `platoon: Range` contradiction, `kutter-wolf`'s CO tenure end date / possible Steve Kahnke stub,
   Garvin/Spingath/Monteleone photo-attribution model (still explicitly deferred, don't touch without
   a plan), Skipper Stories → soldier slug index (parked), full production build still never
   completed in-sandbox.

---

## Key file locations

| Item | Path |
|---|---|
| Bruckner's profile (new) | `site/soldiers/bruckner-garry/bruckner-garry.md` |
| Bruckner's account, full transcript (new) | `site/documents/bruckner-garry/bruckner-garry-account-1970-02/` |
| Raw newsletter issue, draft (new) | `site/documents/unit/asa-newsletter-201401/` |
| FSB Carolyn staging research (new, 3 passes) | `site/_docs/locations/fsb-carolyn.md` |
| Lomker's profile (new) | `site/soldiers/lomker-michael/lomker-michael.md` |
| Carolyn howitzer photo (new) | `site/soldiers/lomker-michael/photos/locations/fsb-carolyn/` |
| Beasley's profile (dates updated) | `site/soldiers/beasley-glenn/beasley-glenn.md` |
| Beasley's FSB Gonder photo (new) | `site/soldiers/beasley-glenn/photos/locations/fsb-gonder/` |
| Babas's profile (new) | `site/soldiers/babas-bob/babas-bob.md` |
| Babas's profile photo (cropped version used) | `site/soldiers/babas-bob/photos/profile/` |
| Stub candidates tracker (Babas moved to Resolved) | `site/_docs/stub-candidates.md` |
| **Alongside CO bug — crawler (looks correct, not the bug)** | `site/_data/alongside.js` |
| **Alongside CO bug — example broken file** | `site/soldiers/gonder-kenneth/_alongside.json` (6 entries, should be 1: `kingston-robert`) |
| **Alongside CO bug — example correct file, for comparison** | `site/soldiers/aguilar-oscar/_alongside.json` (1 entry, correctly filtered) |
| CO tenure source-of-truth profiles | `site/soldiers/{hemphill-john,tackaberry-thomas,dashiell-john,stannard-john,petty-howard,gibney-john,dubia-christian,conrad-michael,kingston-robert,lytle-robert,moore-robert,bacon-wg,blagg-thomas}/*.md` |

---

## Carried-forward warnings

- **This mount will not allow file deletion** (unchanged, multiple prior sessions) — confirmed
  again this session (attempted to remove an empty leftover `photos/profile/.gitkeep` for Lomker;
  `rm` failed with "Operation not permitted").
- **A full `eleventy` build still could not be attempted this session** — not tested; carried
  forward from prior sessions as still unverified against a real compiled build.
- **`colburn-richard.md` and `stannard-john.md`** — permanent truncated-text data loss, no recovery
  path (Session 112 finding, unchanged).
- **Garvin's photo-attribution model is an open question, not a bug to re-fix** — any future
  photo-pipeline work touching his ~70 entries should start with a conversation, not a script.
- **McGrew is a living, engaged contributor** — general care/verification bar from prior sessions
  still applies to his profile; not touched this session.
