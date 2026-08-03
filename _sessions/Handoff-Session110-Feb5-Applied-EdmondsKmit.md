# Session Handoff — 2026-07-22
**Session 110**
**Theme:** Applied the single highest-value pending action item carried across two
consecutive handoffs (Session 108, Session 109): upgraded the Feb 5, 1969 event page
(CPL James Edmonds, SP4 Chester Kmit) from an explicit "research stub — does not describe
a confirmed action" to a fully narrated firsthand account, using CPT Colavita's ch. 10
memoir digest. Both open judgment calls flagged in the Session 109 handoff were put to
Michael before writing anything, and his answers are now baked into the page.

---

## What was completed this session

### Two judgment calls resolved before writing

Both had been explicitly flagged as needing Michael's read rather than an archivist
default:

1. **Graphic-detail level for Edmonds's death** (mortally wounded, then dropped when a
   medevac crew cut the jungle-penetrator cable under fire). Michael chose to **follow the
   Velez-Rodriguez precedent**: keep the human/service context and the disputed-cause
   discussion (the cut, the subsequent Medical Service Corps investigation, Colavita's own
   testimony that the cut wasn't necessary) but omit any clinical description of the fall
   or physical condition.
2. **Brigade-attachment inference** (ch. 10 suggests 2/8 Cav had already shifted to 1st
   Brigade's Tay Ninh AO by early Feb 1969, via the Saint Barbara/Montana Scout
   connection). Michael chose to **state it as the working conclusion** rather than leave
   it open — the page now resolves oq-02 with this reasoning, explicitly flagged as
   inference from circumstantial fit, not a primary-record confirmation.

### `events/operation-sheridan-sabre-1969-02-05` (Edmonds/Kmit)

Upgraded from a casualty-record-only research stub to a firsthand narrated account:

- New body sections: "Operation Sheridan Sabre and FSB Saint Barbara" (location/brigade
  context), "The commander's account" (Feb 4 contact → Feb 5 creek-crossing ambush, Kmit
  killed instantly as point man, disengagement under gunship support), "Edmonds's
  evacuation" (jungle-penetrator lift, cable cut under fire, the investigation, Colavita's
  testimony — per the agreed graphic-detail level), "Kmit's recovery" (two-night delay,
  stay-in-place order tied to the investigation), and "An unresolved brigade question, now
  resolved" (the working conclusion on brigade attachment).
- **oq-02, oq-03, oq-04 all marked resolved.** oq-02 (brigade attachment) resolved as a
  working conclusion per Michael's call above, not a hard confirmation. oq-03 (same
  engagement) and oq-04 (action identified — a creek crossing, not a named firebase
  action) are both settled outright by the memoir. oq-01 (general call for information)
  stays open.
- `operation`, `location`, `location_precision`, `units.supporting`, `units.enemy` all
  rewritten to reflect the 1st Brigade / FSB Saint Barbara frame instead of the prior
  "unconfirmed" language.
- Added the ch. 10 memoir digest, the Montana Scout event page, and the existing OPCON/ORLL
  docs to `sources[]`. Added `operation-montana-scout-1969` to `related_events` (the
  Saint-Barbara-to-Carolyn connection flagged in Session 109's ch. 10 review). Bumped
  `last_updated` to 2026-07-22.

### `soldiers/edmonds-james` and `soldiers/kmit-chester`

Both profiles updated in parallel:

- `timeline_source` now cites the memoir alongside the existing casualty-record sources
  (and, for Kmit, the two documents already on file).
- The Feb 5 timeline entry rewritten on both to name the creek-crossing action and
  cross-link to the event page — Edmonds's entry carries the evacuation/cable-cut account
  at the agreed graphic-detail level; Kmit's entry states his death as point man plainly
  and covers the two-night recovery delay.
- Admin notes updated on both: the Wriston "2nd Brigade" remembrance is now flagged as
  likely outdated rather than an open contradiction (Edmonds), and the same-engagement
  link to the other man is now stated as confirmed rather than "likely" (both).
- `last_updated` bumped to 2026-07-22 on both.

All three files verified via a YAML front-matter parse check (`yaml.safe_load` on the
front matter for all three) — no Eleventy build run this session, same fallback as every
prior session.

---

## What's still on the table from ch. 9 and ch. 10 (unchanged from Session 109, minus the
## item just applied)

The Session 109 handoff's consolidated "what's left" list is carried forward as-is,
**minus item 1 (the Feb 5 upgrade), which is now done**, and with item 2 folded into
that upgrade rather than left separate. Everything else is untouched:

### Profile enrichments still pending (low-risk, no scope call needed)

1. **`soldiers/henry-frank`** — Colavita's tenure arithmetic (mid-to-late-Feb-1969
   departure estimate) and the quoted OER (candidate for its own document page).
2. **`soldiers/adams-bruce`** — ch. 9 (Johnson-to-Rita recommendation, Rifle Range NCO
   polling) and ch. 10 (rotation to battalion rear, First Sergeant handback to Cruz).
3. **`soldiers/derums-karl`** — ch. 9's clapper-keyboard and Eskridge-letter items (the
   letter is already on Eskridge's page, not yet mirrored onto Derums's), plus ch. 10's
   humor beat.
4. **`soldiers/colavita-henry`** — Dec 6 skipped-ambush admission, Christmas-at-Rita color,
   clapper-keyboard invention (ch. 9); Jon Jones Tet-truce vignette, first in-chapter naming
   of wife Janine (ch. 10).

### Locations / operational connections

5. **FSB Saint Barbara gazetteer push** — still not attempted, now flagged across three
   sessions (107, 108, 109/110). Note: this session's event-page work already pulled in
   Saint Barbara's operational detail for the brigade-attachment inference, but did not
   build a standalone location page.
6. **Saint Barbara → LZ Carolyn → Operation Montana Scout connection** — partially
   actioned this session (added as a `related_event` on the Feb 5 page), but the reciprocal
   note on `events/operation-montana-scout-1969` and/or `colavita-henry.md` is still
   pending Michael's confirmation of the inference.
7. **LZ Carolyn's construction** — still a candidate for a short administrative/logistics
   note rather than a full location page.

### Stub-candidate decisions (Michael's call, unchanged)

8. Ch. 9: 2LT Bob Babas, RTO Ray Haley, Sgt. Terry Shoopman, Ed Regan.
9. Ch. 10: LTC Richard Wood, Major James Bramlett, SGT James Goochie (now also named in
   this session's event-page narrative as one of the men wounded in the Feb 5 fight,
   generically, without building a stub — see the page's "commander's account" section,
   which does not name him).
10. **Jon Jones ("Jonsey")** — unchanged, still a strong build candidate.
11. Carried forward from ch. 8, untouched across four sessions now: 1SG Ramon Cruz, Lt.
    Greg Armstrong, Clyde Dalrymple, Gil Carillo.

---

## Key file locations

| Item | Path |
|---|---|
| Feb 5 event page (updated this session) | `site/events/operation-sheridan-sabre-1969-02-05/index.md` |
| Edmonds profile (updated) | `site/soldiers/edmonds-james/edmonds-james.md` |
| Kmit profile (updated) | `site/soldiers/kmit-chester/kmit-chester.md` |
| Montana Scout event (connection candidate, not modified this session) | `site/events/operation-montana-scout-1969/index.md` |
| Henry profile (pending enrichment, not modified) | `site/soldiers/henry-frank/henry-frank.md` |
| Adams profile (pending enrichment, not modified) | `site/soldiers/adams-bruce/adams-bruce.md` |
| Derums profile (pending enrichment, not modified) | `site/soldiers/derums-karl/derums-karl.md` |
| Colavita profile (pending enrichment, not modified) | `site/soldiers/colavita-henry/colavita-henry.md` |
| Ch. 10 digest/review (source material, unchanged) | `site/sources/colavita/10-st-barbara/` |
| Cross-source stub tracker | `site/_docs/stub-candidates.md` |
| Book-level registry | `site/sources/colavita/index.md` |

---

## Carried-forward warnings

- **Build/deploy is manual and separate from git**, unchanged from every prior session.
- **This session's page updates were direct edits, not digest-pipeline output** — the
  underlying ch. 10 digest/review was already built (prior session); this session only
  applied the one proposal Michael explicitly greenlit, after resolving the two judgment
  calls it depended on. The remaining items in this handoff are still proposals, not
  completed edits.
- **Content-sensitivity precedent now applies to three events** — Velez-Rodriguez (Jan
  21), and now the Feb 5 Edmonds/Kmit page, both omit clinical body/fall detail per
  Michael's explicit choice this session. Any future upgrade involving a graphic cause of
  death should surface the same choice rather than assuming an answer.
- **"Ask before creating" stub rule stands** — none of the pending names in this handoff
  (Babas, Haley, Shoopman, Regan, Wood, Bramlett, Goochie, Jones, Cruz, Armstrong,
  Dalrymple, Carillo) were built as profiles this session. Goochie and Magruder are named
  generically in the Feb 5 event narrative's WIA context but were not linked or given
  profile pages.
- **Always check `_sessions/` handoffs AND `site/_docs/stub-candidates.md`** before
  treating a name as new.
