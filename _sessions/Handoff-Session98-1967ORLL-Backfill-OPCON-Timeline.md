# Session Handoff — 2026-07-15
**Session 98**
**Theme:** Closed the 1968 gap Michael flagged at the top of the session (KIA stubs, contact
events, locations for 4 men), then ran the full digest-and-cross-reference workflow (built in
Session 97) on all three 1967 division ORLLs for the first time, and built a standalone 2/8
Cav OPCON reference timeline. **Ends with an important cross-check finding** — see "Read this
first" below before treating anything in this session's ORLL work as wholly new.

---

## Read this first — overlap with Sessions 87–88

Partway through writing up the October 1967 ORLL (AD0387543) digest, a check of `_sessions/`
turned up **Handoff-Session87-SongReValley-LZCluster-Dashiell.md** and
**Handoff-Session88-BattalionCOs-Santoroski-Bolling-Fall1967.md** — both from 2026-07-07,
both working from the *same* AD0387543 document (via an OCR transcript already in hand at
the time). Those sessions had already built full Tier 2 pages:

- **`events/song-re-valley-1967`** — with far more granular detail (LZ Lou/Pat/Jane/Tom/
  Moberly, exact times down to the hour) than this session's digest captured independently.
- **`events/operation-bolling-1967`** — already citing the exact same OPCON dates and
  KIA/WIA figures this session's digest found from scratch (OPCON to 173rd Abn Bde effective
  17 Sep, assault 19 Sep, released 14 Oct, 0 KIA/7 WIA).
- The GREELEY OPCON fact (3rd Brigade to 4th Inf Div, Kontum, through 25 Jul) is already
  mentioned in passing on `song-re-valley-1967`.

**This is good news, not wasted work** — independently re-deriving the same facts from the
same primary source via a completely different method (a fresh full read + the digest schema,
vs. Session 87/88's more freeform research pass) is a real corroboration, and this session's
digest/review files are still useful as a second, more systematic pass with full citations.
But it means `AD0387543.review.md`'s original "Proposed writes" #1–2 were redundant when
first drafted — **both have been corrected in place** (struck through, annotated) to point at
the existing pages instead of re-proposing them. Read `AD0387543.review.md` as it stands now,
not as originally written.

**One real, non-redundant finding came out of this cross-check**, though: the existing
`events/operation-pershing-1967` page states flatly *"2/8 Cavalry fought Pershing as a
**1st Brigade** battalion."* That's contradicted by AD0385642's clean TAB A task-org table
(built earlier this session, covering the Feb–Apr 67 portion of Pershing): 2/8 Cav was OPCON'd
**away** from 1st Brigade to the division's own 3rd Brigade for that entire window, while 5/7
Cav went the other way. The page's framing is true for parts of the ~11-month operation, not
the whole thing. **This is flagged, not fixed** — the live page's language hasn't been touched;
it's listed as proposed write #4 in `AD0387543.review.md` and needs Michael's sign-off before
editing customer-facing (well, public-site) prose.

---

## What was completed this session

### Part 1 — 1968 Skipper Journal follow-through (early in session)
- Built KIA profile stubs for **weldin-jacob, winner-brian, wheeler-john, ross-robert**,
  then enriched each as Honor States/Virtual Wall/Wall of Faces source HTML arrived,
  preserving the original Skipper-Journal-based narrative.
- Built 4 contact event pages from the Skipper Journal (`contact-yd324393-1968-06-04`,
  `contact-1968-06-05`, `contact-1968-06-30`, `contact-yd293319-1968-07-01`), plus a
  deliberate **research-gap stub** for Wheeler (`contact-1968-06-12`) — built to Michael's
  explicit instruction that a stub is itself a signal ("I still need help"), not something to
  omit.
- Added `lz-anne` and `lz-green` to the location gazetteer (via the raw note +
  `generate-locations-json.cjs`, never hand-editing `locations.json` directly), plus a
  hand-authored `locations/lz-betty` research page.
- **Diagnosed and fixed a Unit History visibility bug**: `unit-history.njk` gates strictly on
  `status: published`; all 5 new/updated event pages were `status: stub`. Michael chose
  "promote all 5 to published" via AskUserQuestion.
- Hit the recurring **stale-bash-mount truncation bug** on `kia.json` twice (Edit-tool writes
  look truncated via bash afterward even though Read/Edit show the file intact) — fixed both
  times the documented way: reconstruct the tail directly via bash heredoc, validate with
  `python3 -c "import json; json.load(...)"`.

### Part 2 — 1967 ORLL backfill (the bulk of the session)

Ran the full Session-97 digest-and-cross-reference workflow, live, on all three 1967
quarterly division ORLLs for the first time:

| Document | Period | Files written | Headline finding |
|---|---|---|---|
| **AD0385642** | Feb–Apr 1967 | `.digest.json`, `.candidates.json`, `.review.md` | Clean TAB A table: 2/8 Cav OPCON'd to the division's own 3rd Brigade for Pershing (not 1st Brigade, its organic parent) — no KIA resolved to a specific action. **This directly contradicts `operation-pershing-1967`'s "1st Brigade" framing — see above.** |
| **AD0386215** | May–Jul 1967 | `.digest.json`, `.candidates.json`, `.review.md` | Strongest circumstantial KIA lead of the backfill: an exact-date, gridded 31 May 1967 action near An Qui (BS 6811) that the division's own Staff Historian tagged to "1st Bde" for the 30 May–1 Jun window — matches Krueger's DOD exactly, Nelson/Sutt's the day before — but no battalion named, so graded as a lead, not a confirmed tie. Also found the GREELEY OPCON fact independently (already partly on-site, see above). |
| **AD0387543** | Aug–Oct 1967 | `.digest.json`, `.candidates.json`, `.review.md` | Only one in-range KIA (Santoroski, already fully covered). Richest operational narrative of the three — names A/2/8 Cav directly in a 9 Aug firefight (Song Re Valley) and gives the most explicit OPCON language of the year (2/8 to 173rd Abn Bde for BOLLING, 17 Sep–14 Oct). **Mostly corroborates Sessions 87-88's existing pages — see "Read this first."** |

All three follow the "candidates, not writes" rule — nothing was written to `kia.json`, an
event page, or the location gazetteer without approval. Each `.review.md` ends with a
"Proposed writes (await approval)" section.

### Part 3 — OPCON reference timeline (new)

Built **`site/_docs/2-8-cav-opcon-timeline.md`** — a standalone reference doc (not a public
site page) tracking 2/8 Cav's actual command relationship week-by-week across 1967:
organic 1st Brigade → OPCON to 3rd Brigade for Pershing (Feb–Apr) → open question (May–Jul)
→ grouped under 3rd Brigade for the Song Re recon (1–20 Aug) → OPCON to 173rd Abn Bde for
Bolling (17 Sep–14 Oct) → presumed return to 1st Brigade. Plus a mirror-image section on
3rd Brigade's own two OPCON departures (GREELEY to 4th Inf Div, WALLOWA to Americal Div).
Includes a "practical implications for NARA requests" section — which brigade's records to
check for which date range — since this was Michael's stated reason for wanting it ("if I try
for NARA records, I'll need to know that").

**This timeline doc does not appear to duplicate anything already on the site** — it's the
one genuinely new artifact from the 1967 backfill, as far as this session's cross-check found.

### Verification
Full Eleventy build run twice (`npx @11ty/eleventy --input=. --output=...`), clean both times,
no errors or warnings, 569 files. Confirmed `_docs/*.md` and `sources/orll/**/*.md` build as
pages under their own routes (existing site behavior, not new) — including the new
`_docs/2-8-cav-opcon-timeline` and all six new `sources/orll/1967/AD038*` files.

---

## Pending / next priorities

1. **Ask Michael about the `operation-pershing-1967` "1st Brigade" correction** (see "Read
   this first") before editing that page's language — this is the one substantive,
   non-redundant proposed write from the whole 1967 backfill.
2. **November 1967 – January 1968 ORLL not yet pulled.** Priority pull if the OPCON timeline
   needs to extend past October — 3rd Brigade's WALLOWA move was still "continuing" as of
   31 Oct 67 with no end date yet.
3. **WALLOWA note** — still genuinely missing from the site (unlike Song Re Valley and
   Bolling, which already exist). Could go on `operation-pershing-1967`... actually not
   Pershing-related since it's 3rd Brigade's separate I Corps deployment — more likely a
   short standalone note or an addition to the OPCON timeline only. Low priority; no 2/8 tie.
4. **The May–Jun 1967 An Qui lead** (`AD0386215.review.md` Pass 1) is the strongest KIA lead
   found in the 1967 backfill and isn't captured anywhere on the site yet. Michael flagged in
   `AD0386215.review.md`'s proposed writes as a judgment call: strong enough to note, not
   clearly strong enough (no battalion named) to justify a research-gap stub like Wheeler's.
   Ask Michael which way he wants to go.
5. **1965–66 and Nov 1967 onward have no OPCON-focused review yet** — the OPCON timeline doc
   has an explicit "Open windows" section listing this; extend the table as more ORLLs get
   the same treatment, don't assume the 1967 pattern carries into other years.
6. Standing items carried from Sessions 87/88, still open: Ba To CIDG camp A-detachment
   number (SF order-of-battle or NARA); D Company's specific activity 1–17 Aug 67 (before the
   Song Re extraction sequence); LZ Pat casualty attribution (A Co 2/8 vs. other unit) for
   the 11 KIA/27 WIA figure at that specific LZ; the March/May-June 1967 D Co KIA clusters
   still need the 2/8 Cav daily staff journal (NARA RG 472) before any Tier 1 event page can
   be built with a confirmed action.

---

## Key file locations

| Item | Path |
|---|---|
| OPCON timeline (new) | `site/_docs/2-8-cav-opcon-timeline.md` |
| Apr 1967 ORLL digest/review | `site/sources/orll/1967/AD0385642.{digest,candidates}.json`, `.review.md`, `.review.draft.md` |
| May–Jul 1967 ORLL digest/review | `site/sources/orll/1967/AD0386215.{digest,candidates}.json`, `.review.md`, `.review.draft.md` |
| Aug–Oct 1967 ORLL digest/review | `site/sources/orll/1967/AD0387543.{digest,candidates}.json`, `.review.md`, `.review.draft.md` |
| 1967 ORLL manifest | `site/sources/orll/1967/index.md` (notes added on all three entries) |
| Existing Song Re Valley page | `site/events/song-re-valley-1967/index.md` (Session 87 — don't duplicate) |
| Existing Bolling page | `site/events/operation-bolling-1967/index.md` (Session 88 — don't duplicate) |
| Pershing page needing review | `site/events/operation-pershing-1967/index.md` — "1st Brigade" line, see above |
| Digest/cross-ref spec | `site/_docs/orll-digest-and-cross-reference-spec.md` |
| Cross-reference engine | `scripts/cross-reference-engine.cjs` |
| D Co KIA roster | `site/_data/kia.json` |
| D Co operational timeline | `site/_docs/d-co-operational-timeline.md` |

---

## Carried-forward warnings

- **Stale bash-mount truncation on `kia.json`** after Edit-tool writes — bash shows the file
  truncated near the end even though Read/Edit show it complete. Fix: reconstruct the tail
  directly via bash (`head -n <good-line>` + heredoc append), validate with
  `python3 -c "import json; json.load(...)"`.
- **`unit-history.njk` gates on `status: published`** — any new event page left at
  `status: stub` will not appear there, by design (stub = "needs help," not "hidden").
- **Always check `_sessions/` handoffs for existing coverage before treating an ORLL finding
  as new** — this session's biggest process lesson. The digest workflow is systematic and
  citation-rich, but it doesn't automatically know what a prior, less formal research pass
  already established from the same document.
