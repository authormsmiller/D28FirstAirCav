# Session Handoff — 2026-07-21
**Session 104**
**Theme:** Built two more of the 8 pending 1969 D Co profiles — Zuniga and Muse — and, while
chasing their KIA dates against the already-on-hand Aug-Oct 1969 division ORLL (AD0508303), found
that both deaths match named, dated combat actions in that document almost exactly. Merged one into
an existing (previously thinly-sourced) event page and built a new one for the other, cross-linked
both, and surfaced a genuinely surprising new OPCON data point along the way — a formal task-org
table placing 2/8 Cav under Division Artillery for this quarter, not any of the three maneuver
brigades. Michael ran the build at the end of the session and confirmed it's good.

---

## What was completed this session

### Part 1 — Two new profiles: Zuniga and Muse

- **`soldiers/zuniga-daniel/zuniga-daniel.md`** — PVT Daniel Moran Zuniga, D Co 2/8 Cav, KIA
  1969-08-11, Tay Ninh Province, multiple fragmentation wounds. Built via `kia-profile-general`
  (all three sources + photo present, no parser warnings). Flagged one reconciliation note: the
  roster (`d-co-kia-list.md`) lists his rank as PFC, but both Honor States and Virtual Wall
  independently give PVT — used PVT in the profile, left the roster's PFC alone, noted the
  discrepancy in admin notes rather than silently resolving it.
- **`soldiers/muse-michael/muse-michael.md`** — CPL Michael Dennis Muse, D Co 2/8 Cav, KIA
  1969-08-16, Tay Ninh Province, gun/small arms fire. Also built clean, no parser warnings.
  Flagged a second reconciliation note: Honor States pairs his hometown "Garland" with "Bowie
  County, TX" — but Garland sits in the Dallas/Collin/Rockwall area, nowhere near Bowie County
  (Texarkana). Virtual Wall and Wall of Faces both just say "Garland, TX" with no county, and his
  Dallas-area burial (Restland Memorial Park) fits that better. Left the field as Honor States
  states it; flagged the likely source error rather than correcting it.

Both got their `photos/profile/index.md` built alongside them (photos copied), and both roster rows
in `_docs/d-co-kia-list.md` updated from `—` to `**stub**`. `kia.json` regenerated after each.

### Part 2 — Both KIAs matched to a named action in an ORLL already in the collection

Michael asked whether either death could be pieced into an event page. `AD0508303` (1st Cav Div
ORLL, period ending 31 Oct 1969) was already on file — pulled in an earlier session for LZ Carol
context — but had never been read for its day-by-day significant-activities log. It was:

- **11 August 1969, 0300-0345 hrs** (item 7(a), internal pp. 45-46 / PDF pp. 50-51): Company D and
  Company E, 2/8 Cav, providing security for **Fire Support Base Becky** (War Zone C, Tay Ninh
  Province), took a mortar/RPG/sapper ground attack. Result: 17 NVA KIA, **4 US KIA, 14 US WIA**.
  Exact date match to Zuniga; he's the only D Co KIA on record for that date.
- **16 August 1969, 0845-1000 hrs** (item 12(a), internal p. 52 / PDF p. 57): Company A and Company
  D, 2/8 Cav, swept **west of FSB Becky** and made contact. Result: 25 enemy KIA, **1 US KIA, 3 US
  WIA**; a PW identified the enemy as 95th Regiment, 1st NVA Division. Exact date match to Muse; he's
  the only D Co KIA on record for that date.

Both figures were verified against the actual scanned page images (`pdftoppm`), not just OCR text —
the OCR on this document is rough in places and the task-org table finding below specifically
needed visual confirmation.

**Zuniga's action turned out to already have a page**: `events/contact-tay-ninh-1969-08-12/index.md`,
built in an earlier session from a Silver Star general order citation for SSG Clyde Bonnelycke (D
Co) alone — same FSB, same companies, same attack profile, but dated "the night of August 12," one
day off from both the ORLL and Zuniga's own official KIA date. Merged the ORLL account in: added
Zuniga to `casualties.kia[]`, added the ORLL as a source, changed the primary `date` field to
1969-08-11 (kept the slug unchanged so existing links — including from `bonnelycke-clyde.md` —
don't break), and added an explicit `date_note` plus an open-question entry documenting the 1-day
discrepancy as unresolved rather than picking a winner. The GO's "4 KIA" line item was never present
before; the ORLL's "4 KIA, 14 WIA" is now the sourced figure, with a note that the other 3 KIA
(D Co, E Co, or both) are not yet identified — Zuniga is presumed, not source-named, as one of the 4.

**Muse's action got a new page**: `events/contact-tay-ninh-1969-08-16/index.md`. Same treatment —
ORLL as primary source, Muse presumed (not source-named) as the single KIA, open question calling for
the 2/8 Cav daily staff journal (NARA RG 472) to confirm by name.

Both pages cross-link each other (`related_events`, relationship `same-unit-nearby-date`) and both
soldier profiles got `related_events` pointing to their event page plus an admin-notes paragraph
recording the match logic and its inference (not certainty) status. `kia.json` regenerated once more
after these edits — both events auto-joined via the generator's deterministic `casualties.kia[]`
scan, no parse errors.

### Part 3 — New OPCON data point: 2/8 Cav under Division Artillery, Aug-Oct 1969

While in AD0508303 for the above, found **TAB A (Task Organization)**, PDF pp. 96-97 / internal pp.
91-92 — a clean, explicit task-org table. It places **2-8th Cav under "e. Div Arty"** (alongside HHB
Div Arty and the division's artillery battalions) — **not** under 1st, 2nd, or 3rd Brigade. Confirmed
by rendering the actual page image, not trusting the OCR alone, since this is an unusual enough claim
to warrant it (an infantry/cavalry battalion under Div Arty is not a normal arrangement).

Logged as a new **high-confidence** entry in `_docs/2-8-cav-opcon-timeline.md`, explicitly flagged as
an open question rather than a resolved finding: the *fact* of the table entry is high-confidence, but
its *operational meaning* isn't explained by anything else in the document, and it sits in tension
with the same quarter's own day-to-day contact log (the FSB Becky actions above look like completely
normal 1st Brigade War Zone C activity, not anything Div-Arty-specific). Does not corroborate or
contradict the Session 103 Wriston "2nd Brigade" data point (Feb 1969) — different quarter, and
"organic brigade" vs. "OPCON to arty" aren't necessarily the same question. Updated the "Open windows"
section accordingly.

### Part 4 — Source and roster bookkeeping

- `sources/orll/1969/index.md` — AD0508303's entry expanded with `zuniga-daniel` and `muse-michael`
  added to `references:`, and a detailed notes block citing both action items and the TAB A finding
  with page numbers.
- `_docs/d-co-kia-list.md` — Zuniga and Muse rows marked `**stub**`.
- `_data/kia.json` — regenerated three times total this session (once per profile build, once after
  the event-page edits); 109 rows, no parse errors each time.

---

## Pending / next priorities

1. **6 named 1969 KIAs remain undocumented**: `velez-rodriguez-elliot`, `brown-george`,
   `dunkle-james`, `marchand-thomas`, `anderson-william`, `carlucci-anthony`. Build as Michael drops
   their KIA folders. Note: **`anderson-william`** (KIA 1969-08-24) is only 8 days after Muse and on
   the same Wall panel range (19W) — worth checking AD0508303's narrative for an Aug 24 entry once his
   folder is available (a first pass this session found no explicit Aug 24 significant-activity item,
   but that was before his casualty type/location were known to search against).
2. **The other 3 KIA from the 11 August FSB Becky attack are unidentified.** The ORLL gives "4 KIA"
   for D+E Co combined; only Zuniga is matched. If any of the remaining pending D Co 1969 names turns
   out to also be an 11 Aug death, that's an easy second match — worth checking new folders' dates
   against this specifically.
3. **The Div Arty OPCON finding is an open question, not a resolved one.** Nothing in hand explains
   *why* 2/8 Cav shows up under Div Arty for Aug-Oct 69, or reconciles it with the battalion's own
   War Zone C combat log in the same document. AD0502597 (Nov 68-Jan 69) still hasn't been digested
   for a task-org table; the Apr 1969 quarter ORLL is still unlocated.
4. **Woehnker's unit attribution is still unresolved** (unchanged from Session 103 — still needs the
   NARA RG 472 daily staff journal).
5. **Ross/Weldin/Winner/Wheeler stub→full upgrade** — still Michael's call, not made.
6. **Kmit's Haydenville-cemetery connection is unconfirmed** — unchanged from Session 103.
7. **AD0508303 still has no formal `.review.md`/`.digest.json`** — this session's findings live only
   as prose in `sources/orll/1969/index.md` and the two event pages. Fine for now; a full digest pass
   (matching the 1967 ORLL convention) would be future work if this document keeps yielding matches
   as more 1969 folders come in.
8. **Build was run and confirmed by Michael at the end of this session** — no outstanding render
   caveat this time.

---

## Key file locations

| Item | Path |
|---|---|
| Zuniga profile | `soldiers/zuniga-daniel/zuniga-daniel.md` |
| Muse profile | `soldiers/muse-michael/muse-michael.md` |
| FSB Becky attack event (11 Aug, Zuniga) — enriched, date corrected | `events/contact-tay-ninh-1969-08-12/index.md` |
| West-of-FSB-Becky contact event (16 Aug, Muse) — new | `events/contact-tay-ninh-1969-08-16/index.md` |
| Division ORLL, Aug-Oct 1969 (source of both matches + TAB A) | `sources/orll/1969/AD0508303-orll-1cav-oct69.pdf` |
| ORLL source index (AD0508303 entry expanded) | `sources/orll/1969/index.md` |
| OPCON timeline (new Div Arty entry) | `_docs/2-8-cav-opcon-timeline.md` |
| Roster source of truth (Zuniga/Muse stub markers) | `_docs/d-co-kia-list.md` |
| Generated roster (109 rows) | `_data/kia.json` |

---

## Carried-forward warnings

- **`_data/kia.json` and `_docs/kia-json-qa-report.md` are both build output — regenerate via
  `node scripts/generate-kia-json.cjs`, never hand-edit.**
- **Event-to-roster joins are automatic and deterministic** — the generator scans every
  `site/events/*/index.md`'s `casualties.kia[]`/`casualties.dow[]` for a matching slug. Confirmed
  again this session for both new joins.
- **Skills install via Customize, not Settings > Capabilities.**
- **Zip files must be built in `/tmp`, then copied into the outputs mount** — not needed this
  session (no new skill packaging), but still true.
- **DTIC AD-number web searches are unreliable; prefer direct `pdftotext`/page-image verification.**
  This session went a step further — even OCR'd `pdftotext -layout` output can mangle a table
  (fortunately it didn't here, but the Div Arty finding was specifically double-checked against the
  rendered page image before writing it down as high-confidence).
- **Copyright handling on new source material**: paraphrase substantially; at most one short
  (<15 word) attributed quote per new document. Applied to the ORLL excerpts quoted in the two event
  pages' `sources:` blocks (kept to short, clearly-attributed quotations of the operational log).
- **Always check `_sessions/` handoffs before treating a source's findings as new.**
