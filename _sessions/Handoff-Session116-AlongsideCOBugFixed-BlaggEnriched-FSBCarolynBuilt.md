# Session Handoff — 2026-07-27
**Session 116**
**Theme:** Fixed the sitewide "Served Alongside" commanding-officer bug flagged at the end of
Session 115, enriched Thomas Blagg's profile from newly supplied source material, and stood up
the FSB Carolyn location page that had been staged (not built) since Session 115. Ready for
Michael to deploy.

---

## What was completed this session

### 1. "Served Alongside" commanding-officer (Tier 4) bug — fixed
Session 115 found that `soldiers/*/_alongside.json` files were dumping every CO from a soldier's
arrival-era onward (up to all 13) instead of just the one(s) whose tenure actually overlapped that
soldier's service. The crawler (`site/_data/alongside.js`) was confirmed innocent — a straight
pass-through of whatever's in each file.

**Root cause confirmed:** the population script used each soldier's *arrival* date to find a
starting CO, then appended every later CO through the end of the war, rather than checking which
CO's tenure actually covered the soldier's relevant date (KIA/incident date for most entries, full
tour range for surviving veterans).

**The CO tenure chain itself was already fully researched** — just buried in `stannard-john.md`'s
own admin notes rather than exposed anywhere structured:

> Hemphill (Sep 1965 → Jul 30, 1966) → Tackaberry (Jul 30, 1966 → Feb 7, 1967) → Dashiell (Feb 7,
> 1967 → Jul 30, 1967) → Stannard (Jul 30, 1967 → early Feb 1968) → Petty (→ KIA Mar 15, 1968) →
> Gibney (Mar 16, 1968 → Oct/Nov 1968) → Dubia (Oct/Nov 1968 → Jul 1969) → Conrad (Jul 1969 → Apr
> 27, 1970) → Kingston (Apr 27, 1970 → Jul 1970) → Lytle (Jul 1970 → Oct 7, 1970) → Moore (Oct 7,
> 1970 → Feb 16, 1971) → Bacon (Feb 16, 1971 → ~Jul 1971) → Blagg (~Jul 1971 → Jun 1972).

Of 70 affected soldier files, cross-checking each against this chain gave:

- **34 files** — clean single-CO fix (e.g. `gonder-kenneth` → Kingston only, the case Michael
  originally flagged)
- **6 files** — kept the one well-evidenced CO for veterans whose tour end date isn't recorded
  (Clooney, Hustedt, Lee, Linton, McDonald), plus `mcgrew-howard` which needed no change at all —
  its 3-CO span (Moore/Bacon/Blagg) is genuinely correct given his precise Jan–Dec 1971 tour
- **1 file** (`roberts-charles`) — kept both Bacon and Blagg with an explanatory note; his
  non-hostile death (18 Jul 1971) falls inside a transition both COs' own tenure records state
  only as "Jul 1971," with no day-level precision anywhere on file
- **4 files** (`weaver-ken`, `cate-larry`, `kint-joe`, `fishell-larry`) — only year-level
  arrived/departed dates, no anchoring event. Initially left untouched and flagged; **per
  Michael's follow-up instruction, all four now show Bacon + Blagg** (same treatment as
  Roberts), with a note explaining the imprecision
- **26 files** already correct (the 19 Chinook-crash victims, `rosenberg-kenneth`,
  `aguilar-oscar`, `wilson-david`, `makowski-william`, `jeffries-gabriel`,
  `trapnell-franklin`, `marshall-clint`) — untouched

No file in the archive now shows more than 3 CO entries, and every multi-CO file has a documented
reason (either a real multi-CO tour span, or a flagged date-imprecision note).

**Verified** against the live crawler output (`_data/alongside.js`), and all 71
`soldiers/*/_alongside.json` files confirmed still valid JSON. A full backup of the pre-fix state
of all 71 files was kept during the session (not committed — scratch only).

**Side finding, not acted on:** `dashiell-john.md`'s own `arrived` field says "1966," but two
independent sources (the OPCON timeline doc and Stannard's own notes) put his tenure start at Feb
7, 1967. Used the correct date for computing the fix, but left his profile page as-is — a
separate, small correction for a future session.

### 2. Thomas Blagg's profile — enriched
Michael supplied a `profiles/blagg-thomas/` folder: an Encyclopedia of Arkansas entry, a Gazette
obituary (via U.S. Special Forces Taps), and an ASU ROTC Hall of Heroes Silver Star citation image.
`soldiers/blagg-thomas/blagg-thomas.md` went from a thin stub (no birth year, no decorations, no
timeline) to a full profile:

- Identity: born Oct 20, 1934, Prairie Grove, Benton County, AR; died Jan 22, 2023, Colorado
  Springs, age 88. Family detail from the obituary (wife Billy J. Blagg, three daughters, siblings).
- **Rank question resolved:** retired full Colonel (1982); held LTC — the standard Vietnam-era
  battalion-commander rank — specifically during 2/8 Cav command. Previously flagged as an open
  question in the file's own notes.
- Decorations: Silver Star (30 Aug 1964, Song So Ha River ambush — full account now in the service
  record), 2 Purple Hearts, Bronze Star, 2 Legion of Merit.
- 8-entry service record: Special Forces advisor duty → M.A. English/West Point instructor → 2/8
  Cav command → ran Nixon's 1973 inaugural parade → Army War College → brigade command, 101st
  Airborne (alongside Colin Powell) → Chief of Staff, 4th Infantry Division (the "damned me with
  faint praise" episode from Powell's memoir, *My American Journey*).
- **2/8 Cav command dates now independently corroborated:** the Encyclopedia of Arkansas
  confirms he took an infantry battalion command in the 1st Cav Division in 1971 — matching this
  archive's own CO chain (Jul 1971 – Jun 1972) built from a different source. His own
  `arrived`/`departed` fields are now filled in accordingly, closing one of the CO-chain's data gaps.
- Real profile photo added (his portrait from the Encyclopedia entry), replacing a placeholder in
  `photos/profile/index.md` that had credited an unfulfilled "Robin Woo, 1971" photo that was never
  actually supplied — flagged in the notes rather than silently dropped.
- One unresolved discrepancy flagged, not silently picked: the obituary gives his birthplace as
  "Prairie View, Arkansas" (not a real place name), treated as a variant of the Encyclopedia's
  "Prairie Grove."

### 3. FSB Carolyn — location page built
Per Michael's go-ahead this session. Built `site/locations/fsb-carolyn/index.md` from the
three-pass research staged at Session 115 (`site/_docs/locations/fsb-carolyn.md`, kept on file as
the detailed research log, marked superseded/pointing at the live page):

- Full occupancy history across three documented cycles (Apr 1969 opening → 6 May 1969 battle →
  reopened Oct 1969 → still active Mar 1970), using the site's `occupancies` array pattern.
- **The 6 May 1969 battle** (Companies C and E, 2/8 Cav — a regimental-size NVA night assault,
  perimeter breached then retaken) written up in full, with both the main-ORLL and
  artillery-ORLL casualty figures quoted rather than reconciled (10 US KIA/73 WIA/198 NVA KIA vs.
  9 US KIA/64 WIA/101 NVA KIA).
- Garry Bruckner's Feb 1970 account and the Mike Lomker/John Williams 1970 howitzer photo both
  now surface on the page (the photo automatically, via its existing `fsb: fsb-carolyn` tag).
- Cross-references updated: `fsb-st-barbara` (added as predecessor/successor pair, updated its own
  body text and Open Questions item), `bruckner-garry.md` (both "not yet built" references now
  point at the live page), the Lomker photo's own index note.
- **Scope decision, flagged rather than made unilaterally:** the 6 May 1969 battle is narrated as
  background on the location page, not split into its own dedicated event page — that would be a
  new precedent (battalion-wide, non-D-Company event), so it's left as an Open Question on the
  page itself for Michael's call.
- All other open questions from the staging doc (grid precision across occupancy cycles, unknown
  closing dates for two of the three occupancy cycles, an OCR gap in one ORLL, the unpursued FB
  Chris lateral-redeployment thread) carried forward onto the live page's own Open Questions
  section rather than resolved.

**Not build-tested this session** — per Michael's instruction, skipped attempting a full `eleventy`
build (consistent with prior sessions' experience that a full build doesn't complete in this
sandbox). Verified instead via YAML frontmatter parsing on every touched file, a manual
field-by-field check against `_includes/layouts/location.njk` (occupancies, related_bases,
photo_sources, tagged/contains, locDate filter behavior on blank/annotated date strings), and a
live re-run of the `alongside.js` and `photosByFsb.js` crawlers, which both picked up the new
content correctly.

---

## What's still on the table

1. **6 May 1969 Carolyn battle — event page or not?** Currently just narrated on the location
   page. Would be this archive's first non-D-Company dedicated event page if built.
2. **Grid precision across Carolyn's occupancy cycles** — XT278788 (1969) vs. XT271783 (1970),
   ~860m apart. Currently read as re-survey drift on the same position, not confirmed.
3. **Carolyn's closing dates** — no source found for when either the Apr 1969 or the Oct 1969
   occupancy ended.
4. **OCR gaps** — a "CMtftl'I" garble for "CAROLYN" was found in one ORLL (AD0506273); other
   mentions may exist elsewhere that keyword search won't catch without a manual page-image pass.
5. **FB Chris lateral-redeployment thread** (Jan–Feb 1970, YT-square to XT-square) — not pursued.
6. **`dashiell-john.md`'s own `arrived` field is wrong** ("1966," should be "1967-02-07" per two
   independent sources) — found this session, not corrected, since it's outside the alongside-bug
   scope.
7. **John Williams — no slug yet.** Still credited jointly with Lomker on the Carolyn photo
   (`photographer: lomker-michael` only); fallback if Michael wants him credited is a duplicate
   `williams-john` profile, per the Session 115 call.
8. Everything carried forward from Session 115 and earlier remains untouched: `colburn-richard.md`
   / `stannard-john.md` permanent truncation data loss, `martin-michael`'s `platoon: Range`
   contradiction, `kutter-wolf`'s CO tenure end date / possible Steve Kahnke stub, Garvin/
   Spingath/Monteleone photo-attribution model (still explicitly deferred), Skipper Stories →
   soldier slug index (parked), full production build still never completed in-sandbox.

---

## Key file locations

| Item | Path |
|---|---|
| Alongside crawler (unchanged, confirmed correct) | `site/_data/alongside.js` |
| Fixed CO entries, example | `site/soldiers/gonder-kenneth/_alongside.json` (now 1 entry: kingston-robert) |
| Dual-CO annotated example | `site/soldiers/roberts-charles/_alongside.json`, `weaver-ken`, `cate-larry`, `kint-joe`, `fishell-larry` (now bacon-wg + blagg-thomas each) |
| Blagg's enriched profile | `site/soldiers/blagg-thomas/blagg-thomas.md` |
| Blagg's new profile photo | `site/soldiers/blagg-thomas/photos/profile/blagg-thomas-profile.jpg` (+ updated `index.md`) |
| FSB Carolyn — live page (new) | `site/locations/fsb-carolyn/index.md` |
| FSB Carolyn — research log (superseded, kept on file) | `site/_docs/locations/fsb-carolyn.md` |
| FSB St. Barbara (cross-linked to Carolyn) | `site/locations/fsb-st-barbara/index.md` |
| Bruckner's profile (references updated) | `site/soldiers/bruckner-garry/bruckner-garry.md` |
| Carolyn howitzer photo (now surfaces live) | `site/soldiers/lomker-michael/photos/locations/fsb-carolyn/index.md` |

---

## Carried-forward warnings

- **This mount will not allow file deletion** (unchanged, multiple prior sessions).
- **A full `eleventy` build still could not be attempted/verified this session** — skipped per
  Michael's explicit instruction this time; carried forward as still unverified against a real
  compiled build. Worth a real build+preview before or right after deploy.
- **`colburn-richard.md` and `stannard-john.md`** — permanent truncated-text data loss, no
  recovery path (Session 112 finding, unchanged).
- **Garvin's photo-attribution model is an open question, not a bug to re-fix** — any future
  photo-pipeline work touching his ~70 entries should start with a conversation, not a script.
- **McGrew is a living, engaged contributor** — general care/verification bar from prior sessions
  still applies to his profile; not touched this session.
