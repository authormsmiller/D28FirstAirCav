# Session Handoff — 2026-07-22
**Session 109**
**Theme:** Took three of the ch. 9 "Chicken Valley" digest's enrichment candidates (flagged but not
yet applied in Session 107) and actually wrote them into the live pages: the Jan 28, 1969 event
page, the Pipher and Eskridge soldier profiles, and the Karr profile. This is the first session
where Colavita-memoir digest findings moved from the "review.md, proposal only" layer into
published content since the Velez-Rodriguez event/profile build. Also compiled a consolidated
"what's left" list pulled from both the ch. 9 and ch. 10 reviews, since several items from each
have been sitting as proposals for two sessions now.

---

## What was completed this session

### `events/operation-sheridan-sabre-1969-01-28` (Pipher/Eskridge)

Added CPT Colavita's own memoir (ch. 9) as a second, independent firsthand source alongside the
existing 2016 oral history. New material folded in:

- A new body section, "A second account: the memoir names them directly" — the memoir is the
  first source anywhere to name Pipher and Eskridge directly, matching hometown and Wall panel
  exactly. Also adds tactical detail the oral history lacked: a three-platoon-front approach into
  a prepared enemy base camp, orders to disengage while gunships worked, the enemy staying in
  their bunkers rather than pressing the attack, and orange strobe lights (not flares) used
  because the company was above ground rather than in foxholes as at Chicken Valley.
- **oq-02 and oq-06 marked resolved** — the identity-match question this page had carried since
  the oral-history-only days is now settled by the author's own book.
- **New oq-07**, flagged not resolved: the memoir gives Pipher's age at death as 20; his DOB and
  this KIA date put him at 19. Left as a discrepancy, not silently corrected.
- Added the memoir to `sources[]`, added `operation-sheridan-sabre-1969-01-21` to
  `related_events` (reciprocal link — the Jan 21 Velez-Rodriguez page already pointed here),
  bumped `last_updated` to 2026-07-22.

### `soldiers/pipher-carl` and `soldiers/eskridge-warren`

Both profiles updated in parallel:

- `timeline_source` now cites the memoir alongside the existing Virtual Wall/Honor States/oral
  history sources.
- The Jan 28 timeline entry rewritten on both to name the three-platoon-front bunker fight, the
  two independent Colavita accounts, and cross-link to the event page.
- **Corrected "Tay Ninh province" to "Binh Long Province"** in the published timeline body on
  both — a judgment call, not explicitly requested this session, but consistent with the
  established precedent already applied to the Dec 4, 1968 cluster and the Jan 21, 1969
  Velez-Rodriguez page (Tay Ninh was the 1st Brigade's AO during Sheridan Sabre, not the 2nd
  Brigade's/2-8 Cav's actual Fishhook AO). Flagged in admin notes, not silently changed.
- Admin notes upgraded from "probable same-action inference" to "same-action CONFIRMED" language,
  citing the memoir's direct naming.
- **Eskridge only:** added a new "post-1983" timeline entry for the postwar Tangier Island visit —
  Colavita, Ed Regan, and Mike McGhie hitching a supply boat from Crisfield, MD, laying a wreath
  at Eskridge's grave, meeting his family including his twin brother (then the island's mayor).
  Admin notes also record the Karl Derums-ghostwritten condolence letter (falsely claimed Eskridge
  "walked into an ambush," which Colavita disputes) and note that the book's p4 gravesite photo is
  a photo printed in the book itself, not a separate digital asset in this archive — nothing was
  fabricated into a `photos:` gallery entry for it.

### `soldiers/karr-john`

- **Resolved the "Cat 6 vs. Skull" platoon/callsign ambiguity.** The admin notes previously hedged
  ("probable roster error... every other indicator points to Skull"); now cite Colavita's own ch. 9
  photo caption ("Preston Karr (White Skull 6)") as the stronger primary source that settles it.
- Added ch. 10's direct narration of Karr's actual arrival as a second, independent confirmation:
  OJT with Alpha Company beforehand, physical description, introduction to 2LT Bob Babas and 2LT
  David Spingath, and Colavita's strongly positive first impression — folded into the existing
  March 12, 1969 timeline entry rather than a new one, since it's the same arrival already dated.
- `timeline_source` and `last_updated` updated accordingly.

All three files verified via a YAML front-matter parse check (`python3 -m json.tool`-equivalent
for the event page, `yaml.safe_load` on the front matter for the soldier profiles) — no Eleventy
build run this session, same fallback as every prior session.

---

## What's still on the table from ch. 9 and ch. 10 (consolidated)

Both chapter reviews have been sitting for a session or two with unactioned items. Pulling them
together in one place so nothing gets lost:

### Highest priority — a "research stub" page still needs the same upgrade Jan 28 just got

1. **`events/operation-sheridan-sabre-1969-02-05`** (CPL James Edmonds, SP4 Chester Kmit) — this
   page currently states outright that it's a "research stub" that "does not describe a confirmed
   action." Ch. 10 answers nearly every open question on it: a downhill approach to a creek
   crossing ("Colavita Creek"), ambush from across the water, Kmit killed instantly as point man,
   Edmonds mortally wounded and then dropped when a medevac crew cut the jungle-penetrator cable
   under fire (formally investigated afterward by a Medical Service Corps colonel; Colavita
   testified the cut wasn't necessary). This has been flagged as the single highest-value pending
   action item across two consecutive handoffs now (Session 108, and again here) and hasn't moved.
   **Content-sensitivity note:** the ch. 10 digest describes this in more graphic detail than the
   published page should probably carry — the same kind of judgment call already made on the
   Velez-Rodriguez page — worth confirming with Michael before writing the public version.
2. **The Feb 5 event's brigade-attachment question may resolve differently than the other
   clusters.** Ch. 10 suggests 2/8 Cav had likely already shifted to the 1st Brigade's Tay Ninh AO
   by early Feb 1969 (cross-referenced against `operation-montana-scout-1969`'s firebase list) —
   meaning "Tay Ninh Province" on the casualty record may simply be **correct** for this one, unlike
   the Dec 4/Jan 28/Jan 21 clusters where it was likely a DCAS error. An inference, not confirmed
   in the text — needs Michael's read before the event page asserts it either way.

### Profile enrichments still pending (low-risk, no scope call needed)

3. **`soldiers/henry-frank`** — two ch. 10 items: (a) Colavita's own tenure arithmetic (7 months
   total command, 4.5 under Henry, from Oct 1968) gives an independent mid-to-late-Feb-1969
   departure estimate, refining without contradicting the existing ~March 1969 clipping-based one;
   (b) Henry's OER for Colavita is quoted at some length in the book (rating him #1 of 5 company
   commanders, citing Chicken Valley) — a candidate for its own short document page, similar to the
   existing verbal-account documents.
4. **`soldiers/adams-bruce`** — two chapters' worth of unfolded enrichment: ch. 9 (recommended
   shipping Lt. Johnson back to Rita, polled the Rifle Range NCOs on his performance) and ch. 10
   (rotated to the battalion rear near his own DEROS, handed First Sergeant duties back to the
   returning 1SG Cruz; Colavita speaks highly of his acting-1SG tenure).
5. **`soldiers/derums-karl`** — ch. 9's two items (fabricated three Claymore "clapper keyboard"
   devices from a field sketch; ghostwrote the Eskridge condolence letter containing the disputed
   "walked into an ambush" claim — already noted on Eskridge's own page this session, but not yet
   mirrored onto Derums's) plus a small ch. 10 humor beat (tasked with finding Adams something to
   do in the rear).
6. **`soldiers/colavita-henry`** — several small items never folded in: the Dec 6, 1968 skipped-
   ambush admission, Christmas-at-Rita color (phone call home, the Johnson/Babas swap), the
   clapper-keyboard invention (ch. 9); the Jon Jones Tet-truce denied-fire-mission vignette, and
   the first in-chapter naming of his wife Janine (ch. 10).

### Locations / operational connections

7. **FSB Saint Barbara gazetteer push** — now has its richest description across two chapters
   (former French fort, 25th ID AO, Corps-level 175mm/8-inch artillery, near the well-known Nui Ba
   Den landmark). Flagged as worth a real location-fix attempt in both the Session 107 and 108
   handoffs; still not attempted.
8. **Saint Barbara → LZ Carolyn → Operation Montana Scout connection** — ch. 10's April 1969 move
   to the LZ Carolyn area lines up almost exactly with Montana Scout's official 1 Apr 1969 start.
   Worth a line on `events/operation-montana-scout-1969` and/or `colavita-henry.md` if Michael
   agrees with the inference (not stated as such in the book itself).
9. **LZ Carolyn's construction** — directly narrated for the first time (April 1969); a candidate
   for a short administrative/logistics note rather than a full location page for now.

### Stub-candidate decisions (Michael's call, unchanged)

10. Ch. 9: 2LT Bob Babas, RTO Ray Haley, Sgt. Terry Shoopman, Ed Regan (scope-ambiguous — postwar-
    association-only mention, no settled site rule for that class of name yet).
11. Ch. 10: LTC Richard Wood, Major James Bramlett, SGT James Goochie.
12. **Jon Jones ("Jonsey")** — now has a substantial, warm, mostly-complete arc across all three
    chapters (FO work, a WIA whose cause is missing from the ch. 10 capture gap, and a fully warm
    1999 Las Vegas reunion with Colavita's wife Janine). Flagged repeatedly as a strong build
    candidate despite the one gap — still Michael's call.
13. Carried forward from ch. 8, untouched across three sessions now: 1SG Ramon Cruz, Lt. Greg
    Armstrong, Clyde Dalrymple, Gil Carillo.

---

## Key file locations

| Item | Path |
|---|---|
| Jan 28 event page (updated this session) | `site/events/operation-sheridan-sabre-1969-01-28/index.md` |
| Pipher profile (updated) | `site/soldiers/pipher-carl/pipher-carl.md` |
| Eskridge profile (updated) | `site/soldiers/eskridge-warren/eskridge-warren.md` |
| Karr profile (updated) | `site/soldiers/karr-john/karr-john.md` |
| Feb 5 event page (top pending action, not modified) | `site/events/operation-sheridan-sabre-1969-02-05/index.md` |
| Henry profile (pending enrichment, not modified) | `site/soldiers/henry-frank/henry-frank.md` |
| Adams profile (pending enrichment, not modified) | `site/soldiers/adams-bruce/adams-bruce.md` |
| Derums profile (pending enrichment, not modified) | `site/soldiers/derums-karl/derums-karl.md` |
| Colavita profile (pending enrichment, not modified) | `site/soldiers/colavita-henry/colavita-henry.md` |
| Montana Scout event (connection candidate, not modified) | `site/events/operation-montana-scout-1969/index.md` |
| Ch. 9 digest/review (source material, unchanged) | `site/sources/colavita/09-chicken-valley/` |
| Ch. 10 digest/review (source material, unchanged) | `site/sources/colavita/10-st-barbara/` |
| Cross-source stub tracker | `site/_docs/stub-candidates.md` |
| Book-level registry | `site/sources/colavita/index.md` |

---

## Carried-forward warnings

- **Build/deploy is manual and separate from git**, unchanged from every prior session.
- **The three pages updated this session were direct edits, not digest-pipeline output** — the
  underlying digest/review files were already built (Sessions 107/108); this session only applied
  proposals that had been sitting there, per Michael's explicit go-ahead. The remaining items
  above are still proposals, not completed edits.
- **Content-sensitivity precedent now applies to two events, not one** — the Velez-Rodriguez page
  omits graphic body-recovery detail per Michael's request; the still-pending Feb 5 (Edmonds/Kmit)
  upgrade will need the same judgment call before publication, given how the ch. 10 source
  describes Edmonds's death.
- **"Ask before creating" stub rule stands** — none of the pending names in this handoff (Babas,
  Haley, Shoopman, Regan, Wood, Bramlett, Goochie, Jones) were built as profiles this session.
- **Always check `_sessions/` handoffs AND `site/_docs/stub-candidates.md`** before treating a
  name as new.
