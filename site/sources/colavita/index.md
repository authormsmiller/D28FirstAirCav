# Colavita Memoir — Chapter Digest Registry

Chapter-by-chapter digests of Henry "Rocky" Colavita's memoir, *Company Grade: Memoir of an
Angry Skipper* (Hellgate Press, 2015), built from e-reader screenshots Michael captures and
drops per chapter. Companion to the existing `documents/colavita-henry/colavita-henry-memoir-company-grade/index.md`
(the published, integrated-facts document) and `soldiers/colavita-henry/colavita-henry.md` (the
author's own profile) — this registry is the raw-extraction layer underneath both, per the
three-artifact model in `site/_docs/orll-digest-and-cross-reference-spec.md`.

**Pattern per chapter:** one folder (`NN-chapter-slug/`) holding a `.digest.json` (structured
personnel/locations/events, page-cited) and a `.review.md` (cross-reference passes against
existing profiles/events/locations, stub candidates flagged for a scope decision, never built
automatically). Nothing here writes to a profile, event, document, or location page — it's the
retrieval layer you point future work at, so a new soldier who falls in the same window can be
checked against this chapter's index without re-reading the screenshots.

**Copyright note:** the source is a copyrighted, commercially published book. Digests extract
facts (names, ranks, units, dates, locations, event summaries) in paraphrase, not verbatim
passages. Any independently-sourced material the book merely reproduces (like a veteran's own
Virtual Wall tribute) is built as its own document under that person's name, not treated as
Colavita's copyright — see the Hackett precedent (Session 101).

When a long passage IS pulled verbatim from the book itself (e.g. a full first-person anecdote,
attributed to Colavita by name — see the `-dec4-1968`, `-jan28-1969` [oral history, not the
book], and `-nix-lp-1968-11` verbal-account documents for precedent), two things apply going
forward, per Michael (2026-07-22):

1. **Label it "Excerpt"** in the document body's italicized source line, not just in the front
   matter `source_note`.
2. **Link the book** — `https://www.amazon.com/Company-Grade-Memoir-Angry-Skipper/dp/1555717829`
   — as a real, visible, clickable link in the document body itself. The front-matter
   `source_url` field is NOT enough on its own: the `document.njk` template never renders it —
   the Source tab only shows `source_note`/`source` text, so a URL living only in `source_url`
   is invisible to a site visitor. Put the link inline in the body (standard markdown link
   syntax renders fine there, confirmed against existing documents' internal soldier links).

Rationale (Michael): this reads as free advertising for the book — a real link to buy it — not
appropriation, which supports treating this as fair use for a non-commercial archive project.

Last updated: 2026-07-22

---

## Chapters processed

| Ch. | Title | Period covered | Files | Digest | Review |
|---|---|---|---|---|---|
| 8 | "Angry Skipper" | ~Oct – early Dec 1968 | `08-angry-skipper/` (17 screenshots) | [08-angry-skipper.digest.json](08-angry-skipper/08-angry-skipper.digest.json) | [08-angry-skipper.review.md](08-angry-skipper/08-angry-skipper.review.md) |
| 9 | "Chicken Valley" | 4 Dec 1968 – 28 Jan 1969, plus an undated postwar coda | `09-chicken-valley/` (17 screenshots) | [09-chicken-valley.digest.json](09-chicken-valley/09-chicken-valley.digest.json) | [09-chicken-valley.review.md](09-chicken-valley/09-chicken-valley.review.md) |
| 10 | "Homeless on Saint Barbara" | 4 Feb – Apr 1969 | `10-st-barbara/` (16 screenshots, one real capture gap) | [10-st-barbara.digest.json](10-st-barbara/10-st-barbara.digest.json) | [10-st-barbara.review.md](10-st-barbara/10-st-barbara.review.md) |

## Known gaps

All other chapters of the book are not yet captured. Chapter 8 opens mid-command (Colavita
already at LZ Joe) and its dated events run 18 Nov – 26 Nov 1968, with an undated coda shortly
after. Chapter 9 picks up exactly where the existing (pre-digest-pipeline) excerpts already lived
— the Dec 4, 1968 "Chicken Valley" ambush and the Jan 28, 1969 bunker-complex fight (see
`documents/colavita-henry/colavita-henry-verbal-account-dec4-1968` and `-jan28-1969`) — confirming
both events almost exactly (the Dec 4 excerpt is verbatim-identical, since it was pulled from this
same chapter before this pipeline existed) while surfacing a fully new, previously undocumented KIA
(SP4 Elliot Velez-Rodriguez, 21 Jan 1969 — already on the KIA list with no event page until now)
and a photo-caption resolution of an existing profile ambiguity (1LT John Karr's platoon callsign).
The same lesson from Ch. 8 holds: a full-chapter read still catches real gaps even when two of its
three dated events already had scaffolding from directly-excerpted passages.

Chapter 10 continues immediately after Ch. 9 (4 Feb 1969 onward, D Co's time off LZ Saint Barbara
through an April 1969 move toward the new LZ Carolyn AO). Its biggest find: upgrading
`events/operation-sheridan-sabre-1969-02-05` from an explicit "research stub — not a confirmed
action" to a fully narrated firsthand account (CPL James Edmonds, SP4 Chester Kmit), the same
upgrade pattern Ch. 9 applied to the Dec 4/Jan 28 events. Also directly narrates a battalion
command change (LTC Frank Henry departing, LTC Richard Wood arriving as the new "Stone Mountain
6") and 1LT Preston Karr's actual arrival/assignment to D Co — a second, independent confirmation
of the platoon-callsign fact Ch. 9's photo caption already surfaced. **Note a real capture gap
this time** (unlike Ch. 9's harmless missing "p6"): Michael confirmed the folder's missing "p14"
is an actual missed page, bridging into a phosphorous-grenade WIA account for 2LT Jon Jones
("Jonsey") whose cause/circumstances are not on file.

## Cross-reference index — people/places this source touches

Quick pointers into the digests above, for future soldier/location additions to check against.

**People (existing profiles enriched or confirmed):** colavita-henry, garner-audis,
grannemann-rodney, ahern-raymond, hackett-larry, cromie-michael, henry-frank (Colonel Henry /
"Stone Mountain 6," confirmed by Michael — a thin `researching`-status profile Ch. 8 adds real
substance to); jones-willie-gerald, stoltz-donald, williams-william (Ch. 9 — KIA table matches
exactly, no new facts); pipher-carl, eskridge-warren (Ch. 9 — memoir now independently corroborates
the existing 2016-oral-history-sourced account of their deaths, and names both men directly for
the first time); derums-karl, spingath-dave, adams-bruce (Ch. 9 — each picks up new enrichment
detail, see the Ch. 9 review Pass 2); karr-john (Ch. 9 — a photo caption resolves an existing
platoon/callsign ambiguity on this full profile with a stronger primary source than the one
currently cited — see Ch. 9 review Pass 2/5). Ch. 10 adds further enrichment to: henry-frank
(departure-date arithmetic, OER excerpt), karr-john (a second, independent confirmation of his
arrival/assignment), adams-bruce (rotation to the rear), edmonds-james and kmit-chester (major
upgrade — see below).

**Events upgraded from stub to firsthand account:** `events/operation-sheridan-sabre-1969-02-05`
(Ch. 10) — previously an explicit "research stub, not a confirmed action"; Colavita's own account
of the "Colavita Creek" fight resolves most of its open questions, the same upgrade Ch. 9 gave the
Dec 4/Jan 28 events. **Not yet applied to the page itself** — see Session 109 handoff.

**APPLIED 2026-07-22 (Session 109):** the Ch. 9 proposals for `events/operation-sheridan-sabre-
1969-01-28` and `soldiers/pipher-carl`, `soldiers/eskridge-warren`, and `soldiers/karr-john` have
now been written into those pages directly (memoir cited as a second source naming Pipher/Eskridge
for the first time, Tay Ninh corrected to Binh Long on both profiles, Eskridge's Tangier Island
visit and the Derums condolence-letter error added, Karr's "Cat 6"/"Skull" ambiguity resolved via
the photo caption plus Ch. 10's arrival narration). See `_sessions/Handoff-Session109-...md`. Still
pending: `henry-frank`, `adams-bruce`, `derums-karl`, and `colavita-henry` enrichments from both
chapters, and the `events/operation-sheridan-sabre-1969-02-05` upgrade above.

**People (new profiles built from this chapter):** nix-jim (2026-07-22 — thinnest profile so far,
single anecdote, no rank/hometown/dates; Michael supplied a photo and asked for it built rather
than held as a candidate; the LP/M-79 anecdote is quoted in full as
documents/colavita-henry/colavita-henry-verbal-account-nix-lp-1968-11); adams-bruce (2026-07-22 —
stub, no photo available and built anyway per Michael's call; carries the pre-command Silver Star
action plus the Nix/LP anecdote); derums-karl (2026-07-22 — Company XO, photo supplied, minor
name-spelling flag between folder and filename); spingath-dave (2026-07-22 — Wild Cat platoon
leader, no confirmed photo of him; nine personal-collection photos cataloged as his "Photos Taken
By" gallery instead).

**People (stub candidates, not yet built — see Ch. 8/9/10 reviews, Pass 3 in each):**
1SG Ramon Cruz "Blinky", Lt. Douglas Magruder, Lt. Michael Johnson, Lt. Greg Armstrong, Lt. Jon
Jones "Jonsey", Clyde Dalrymple, Gil Carillo (Ch. 8); 2LT Bob Babas, RTO Ray Haley, Sgt. Terry
Shoopman, Ed Regan — scope-ambiguous, postwar-only mention (Ch. 9); LTC Richard Wood, Major James
Bramlett, SGT James Goochie (Ch. 10). Also flagged (Ch. 9): SP4 Elliot Velez-Rodriguez — a KIA
already on `site/_docs/d-co-kia-list.md` (1969-01-21, `[att]`) with no profile and, until that
chapter, no event page or account either. Magruder's and Johnson's threads both close out (Ch. 9
and Ch. 10 respectively) without being built — see each chapter's review for the resolution.
Jon Jones now has a substantial, warm, mostly-complete arc across three chapters (Ch. 8/9/10) —
flagged as a strong build candidate whenever Michael wants to act on it.

**Out of scope (per Michael):** Captain Mike Gonzales — Charlie Company CO, not D Company. This
is a D Company archive; he's not a stub candidate regardless of how much detail the book gives
him.

**Cross-source tracker:** all of the above (pending, out-of-scope, and resolved/built) now lives
centrally at `site/_docs/stub-candidates.md` (started 2026-07-22), alongside candidates from any
other source — check it before proposing a name this or any other chapter already raised.

**Locations:** LZ Joe (Michelin rubber plantation, ungazetteered), LZ Rita (existing page,
`locations/fsb-rita`), Quan Loi (suspected only), grid XT 642883 (new, ad hoc extraction LZ),
Fort Benning (postwar reunion site) — all Ch. 8. Ch. 9 adds: FSB Saint Barbara (former French
fort, 25th ID AO, Corps-level artillery, near Nui Ba Den — richest description yet, worth a real
gazetteer push), Nui Ba Den (well-known landmark, useful for locating Saint Barbara), Tangier
Island, VA / Crisfield, MD (postwar-only, not a wartime gazetteer candidate). Ch. 10 substantially
extends Saint Barbara (operational detail: mutual-support firebase string, unwanted attachments,
Feb-Mar 1969 occupancy) and adds LZ Carolyn (newly narrated construction, April 1969) — both now
tied with reasonable confidence to `events/operation-montana-scout-1969`'s 1st Brigade firebase
list, suggesting the Saint Barbara-to-Carolyn move is the transition into that operation (see
Ch. 10 review Pass 6 — inference, not confirmed in the text itself).

**Time window:** roughly October 1968 – April 1969, plus an undated postwar coda (Ch. 9/10). A
soldier or event dated in this window for D Co, 2/8 Cav should be checked against
`08-angry-skipper/08-angry-skipper.digest.json`, `09-chicken-valley/09-chicken-valley.digest.json`,
and `10-st-barbara/10-st-barbara.digest.json` before assuming no source material exists.
