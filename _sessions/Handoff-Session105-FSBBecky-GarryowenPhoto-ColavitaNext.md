# Session Handoff — 2026-07-22
**Session 105**
**Theme:** Built the FSB Becky location page (the natural follow-on to Session 104's
Zuniga/Muse work), cross-checked a candidate grid and a VA citation against it, then folded
in two new contributed photos — one raising a genuine, still-open dating problem at Becky,
the other a clean addition to the Garryowen Task Force event page. No new profiles this
session; Michael has more of Colavita's memoir queued for next time.

---

## What was completed this session

### Part 1 — FSB Becky location page built

Michael asked whether there was enough on hand for a location page. Initial answer was no
(no grid, no established/closed dates) — but a pass through `sources/fsb-locations/` (the
FSB gazetteer, previously not checked for this base) turned up two grid rows and an opening
date after all:

- **`site/locations/fsb-becky/index.md`** — new, `status: research` (no photo deck). Grid
  **XT372810 / XT373810** (flagged `approximate` — two rows ~90m apart, plus a third value
  ("372210") noted as an alternate listing, none checked against a rendered map). Opened
  **9 July 1969** by 2/8 Cav, with A/2/19 (Abn) Arty (105mm) initially, replaced by A-/1/30
  Arty (155mm) from 8 Aug 69. `related_events` wired to both existing Aug 1969 event pages;
  `contains: [zuniga-daniel]`, `tagged: [muse-michael]`.
- Added `location_slug: fsb-becky` to `events/contact-tay-ninh-1969-08-12/index.md` and
  `events/contact-tay-ninh-1969-08-16/index.md` (reciprocal link; the location page's own
  `related_events` list already does the work, this is the redundant/consistent path).

**A candidate grid Michael supplied (XT 185 765) didn't match** either gazetteer row (off by
~19km/~4.5km) — flagged, and Michael said to go with the gazetteer values instead.

**A 2005 BVA decision (citation no. 0527053)** Michael pasted in — an unrelated veteran's PTSD
claim, quoting unidentified "online research" about LZ Becky — added real corroboration (2/8
Cav + A/1/30 Arty garrison, matches the gazetteer's own artillery-unit note) plus a new,
unreconciled claim: a **second attack wave, 0340 hrs 12 Aug**, hitting an artillery unit hard
(9 KIA/19 WIA per that account). Michael then cross-checked this against **1cda** casualty-
by-date data: **12 Aug shows 9 KIA under "C Company and HQ," not D Co and not the "A/1/30" the
BVA account named** — so the two-wave read survives, but the unit attribution in the BVA
source doesn't line up with 1cda's breakdown. The 11 Aug 1cda breakdown Michael gave (D Co
Zuniga + 2 Alpha + 2 Echo + 1 HQ) also doesn't sum to the "5 KIA" total he gave it (adds to 6)
— flagged, not resolved; **Michael said neither the 1cda numbers nor the arithmetic mismatch
matter for the Becky page itself**, so both are logged as open questions on the location page
and left alone rather than forced into the narrative.

### Part 2 — Glenn Beasley's Nov 1969 photo, and a real dating problem

Michael dropped a photo in the `locations/fsb-becky/` intake folder: a memorial formation
(helmets/rifles/boots, troops in ranks, a semi-permanent building in frame), courtesy of
**Glenn Beasley** (existing profile, no prior photos), captioned "Soldiers performing service
for fallen comrades at Fire Support Base Becky in November 1969."

- **`soldiers/beasley-glenn/photos/locations/fsb-becky/index.md`** + the photo itself,
  `19691100-becky-memorial-ceremony.jpg`. `photographer: beasley-glenn` (so it lands in his
  "Photos Taken By" gallery per the site's own gallery-routing spec, per Michael's
  instruction), `fsb: fsb-becky` (surfaces on the location page's Photos tab via the
  `photosByFsb` crawler — verified directly by running `photosBySlug.js`, since a full
  Eleventy build wasn't practical this session, see Warnings).
- This is a real, unresolved discrepancy, not just a caption quibble: **nothing else places
  2/8 Cav at Becky as late as November** (documented actions are Aug only; no closed date is
  established), and **the only Nov 1969 D Co losses on record — Carlucci and Matthei, 20 Nov
  69 — aren't tied to any location** in the archive's own operational tracker
  (`d-co-operational-timeline.md` still lists that cluster as open). Michael's first guess was
  that those two belonged at FSB Rita, but on questioning this turned out to be an unsourced
  "last known D Co location" default, not a documented connection — and it doesn't even hold
  up chronologically: **Rita was a Nov 1968–Jan 1969 posting, so Becky (Jul–Aug 1969) is
  actually the more recent known D Co location** heading into November. That weakens rather
  than supports a "photo is mislabeled" reading. Both open readings (mislabel vs. Becky/a
  successor CP still in use, hosting a service for losses that happened elsewhere) are written
  up on the location page's Overview and Open Questions, deliberately unresolved.
- Noted the KIA folder for **`matthei-peter`** has been dropped (Downloads/KIA) — no profile
  built yet. **No folder yet for `carlucci-anthony`.**

### Part 3 — Garryowen Task Force standdown ceremony photo

Michael had a second photo (in a `locations/gerryowen/` intake folder — note the folder's
spelling vs. the correct "Garryowen") showing a formation with a color guard. Confirmed by
Michael: **the 26 March 1971 division standdown ceremony at Bien Hoa**, which
`events/3rd-brigade-separate-garryowen-1971/index.md` already narrates in prose.

- Copied to `site/assets/docs/standdown-ceremony-bien-hoa-1971-03-26.png` and added as a
  second entry in that event's own `images:` front-matter array (same pattern as the
  existing AD0520447 cover-page image — `src` + `caption` + `credit`, not the soldier-photo
  crawler, since this isn't tied to a soldier profile). **Credit: courtesy of 1cda.org** (1st
  Cavalry Division Association), per Michael. Verified front matter parses (`gray-matter`).

---

## Pending / next priorities

1. **Colavita's memoir — more chapters coming next session, via screenshots**, for
   systematic mining (continuing the Session 101 plan). His book has already produced the
   Garner command-chain correction, the Ahern reframe, the Hackett profile, and Cromie detail
   — treat it as the major still-open source for this stretch of the timeline.
2. **6 named 1969 KIAs remain undocumented**: `velez-rodriguez-elliot`, `brown-george`,
   `dunkle-james`, `marchand-thomas`, `anderson-william`, `carlucci-anthony`. Note:
   **`matthei-peter`**'s KIA folder is now on hand (dropped since Session 104) and ready to
   build, alongside Carlucci once his folder arrives — the two share a KIA date (20 Nov 69,
   adjacent Wall panel lines) and are very likely the same action.
3. **Carlucci/Matthei's 20 Nov 1969 location is still unresolved.** Neither Rita nor Becky is
   confirmed; the Beasley photo is the only lead, and it's a caption, not a source. Building
   either soldier's profile may surface a location clue worth checking against this open
   question on `locations/fsb-becky`.
4. **The BVA citation's "two-wave" (11/12 Aug) hypothesis is still unreconciled** — battery
   unit attribution conflicts between the BVA-quoted account (A/1/30) and 1cda's breakdown
   (C Company and HQ). The 11 Aug 1cda breakdown also has an unresolved 5-vs-6 arithmetic
   mismatch. Both logged as open questions on `locations/fsb-becky`, explicitly deferred at
   Michael's call — not pursued further unless it turns out to matter for the event pages.
5. **The Div Arty OPCON finding (Session 104) is still an open question**, unchanged.
6. **Woehnker's unit attribution, Ross/Weldin/Winner/Wheeler stub upgrade, Kmit's
   Haydenville-cemetery connection** — all still unchanged from prior sessions.
7. **Build verification gap this session** — see Warnings below.

---

## Key file locations

| Item | Path |
|---|---|
| FSB Becky location page (new) | `site/locations/fsb-becky/index.md` |
| Beasley's Nov 1969 Becky photo | `site/soldiers/beasley-glenn/photos/locations/fsb-becky/index.md` |
| Zuniga event page (added `location_slug`) | `site/events/contact-tay-ninh-1969-08-12/index.md` |
| Muse event page (added `location_slug`) | `site/events/contact-tay-ninh-1969-08-16/index.md` |
| Garryowen Task Force event page (new standdown photo) | `site/events/3rd-brigade-separate-garryowen-1971/index.md` |
| Standdown ceremony photo asset | `site/assets/docs/standdown-ceremony-bien-hoa-1971-03-26.png` |
| FSB-locations gazetteer (source of Becky's grid/dates) | `sources/fsb-locations/2-8-cav-fsb-list.md`, `2-8-cav-fsb-by-year.md`, `lz-vocabulary.json` |
| Operational timeline (1969-11-20 cluster still marked open) | `site/_docs/d-co-operational-timeline.md` |
| Matthei KIA source folder (on hand, unbuilt) | `Downloads/KIA/matthei-peter/` |

---

## Carried-forward warnings

- **Could not run a full Eleventy build this session.** The sandbox tears down background
  processes between tool calls, and a synchronous `node node_modules/@11ty/eleventy/cmd.js`
  run didn't complete inside a single 40s call. Verified instead via direct `gray-matter`
  parsing of every touched front-matter block and by running `photosBySlug.js` directly to
  confirm both new photos resolve correctly (`byFsb`/`photographer` routing). **Run the real
  build before treating this session's work as done** — same as every prior session's
  practice.
- **`_data/kia.json` and `_docs/kia-json-qa-report.md` are build output** — regenerate via
  `node scripts/generate-kia-json.cjs`, never hand-edit. Not touched this session (no new
  profiles), but the two new-folder names above will need it once built.
- **The generated location gazetteer (`_data/locations.json`) and the hand-authored
  `site/locations/*/index.md` pages are intentionally two separate layers** (confirmed
  design decision, `scripts/generate-locations-json.cjs`) — FSB Becky's page was hand-authored
  directly; no generator run needed or expected.
- **DTIC AD-number web searches are unreliable; prefer direct `pdftotext`/page-image
  verification.**
- **Copyright handling on new source material**: paraphrase substantially; at most one short
  (<15 word) attributed quote per new document. Relevant again next session for Colavita's
  memoir screenshots — treat the same as any other copyrighted source.
- **Skills install via Customize, not Settings > Capabilities.**
- **Always check `_sessions/` handoffs before treating a source's findings as new.**
