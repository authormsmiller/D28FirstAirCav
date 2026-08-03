# Session Handoff — 2026-07-22
**Session 107**
**Theme:** Ran the Colavita chapter-digest pipeline (established last session) on ch. 9,
"Chicken Valley" (17 screenshots). Unlike ch. 8, this chapter overlaps two events that already
had firsthand accounts before the pipeline existed — but the full read still surfaced an entirely
new, previously undocumented KIA and a photo-caption fix to an existing full profile.

---

## What was completed this session

Michael dropped 17 e-reader screenshots of ch. 9 into `Downloads/colavita/09-chickenvalley/` and
asked for the same treatment as ch. 8 (session 106): full read, digest.json + review.md, check
`stub-candidates.md` before proposing any name.

- **`site/sources/colavita/09-chicken-valley/09-chicken-valley.digest.json`** — new, structured
  personnel/locations/events extraction, page-cited against the screenshot filenames.
- **`site/sources/colavita/09-chicken-valley/09-chicken-valley.review.md`** — new, cross-reference
  passes, stub-candidate flags, event-page candidates.
- **`site/sources/colavita/index.md`** — added the ch. 9 row, updated the cross-reference index,
  known-gaps note, and time window.
- **`site/_docs/stub-candidates.md`** — added 5 new pending rows (see below).

**Reading-order notes (two anomalies, neither a real content gap):**
`p12.jpg` and `p13.jpg` are byte-identical duplicate captures of the same physical page (not a
ch.-8-style collision of two different pages sharing a name) — treated as one page. No file named
`p6` exists in the folder, but the %-complete counter only advances by 1 minute across the p5→p7
boundary and the narrative reads cleanly across it, so this looks like a missing/unnecessary
filename rather than a skipped page. `photos.jpg` (a group photo of the author with three platoon
leaders) carries a %-position that would place it mid-chapter, but its content depicts 1LT John
Karr as "White Skull 6" — and Karr's own existing profile confirms he didn't arrive in-country
until 12 Mar 1969, five weeks after this chapter's last narrated date (28 Jan 1969). Photo pages
apparently don't track the surrounding chapter's timeline at all; treated as a genuine but
out-of-sequence source item.

### Headline finding 1 — an entirely new KIA

**SP4 Elliot Velez-Rodriguez** (1969-01-21) was already sitting on `site/_docs/d-co-kia-list.md`
(`[att]`, profile status `—`) but had no event page and no account anywhere on the archive. This
chapter supplies one: a replacement bound for A Company, inserted into Wild Cat's LZ Rita
perimeter for one night only by Sgt. Terry Shoopman (new stub candidate); killed when an
explosion in the ammo pit went off, cause disputed even in the source itself (accidental
self-inflicted vs. an enemy satchel charge slung onto the LZ). Official Army cause: "Artillery,
rocket or mortar," consistent with the KIA list's current "Hostile" tag. Colavita explicitly
argues himself into counting Velez-Rodriguez on Delta's own Honor Roll despite the attached
status. **Flagged as the strongest event-page candidate in this batch** —
`events/operation-sheridan-sabre-1969-01-21` doesn't exist yet. No stub built for
Velez-Rodriguez himself; per the standing rule, that's Michael's call.

### Headline finding 2 — a photo caption resolves an existing profile ambiguity

The `photos.jpg` group-photo caption names "Preston Karr (White Skull 6)" — a direct match to the
**existing full profile** `soldiers/karr-john` (1LT John Preston Karr, KIA 25 May 1969), whose own
admin notes flag an unresolved conflict ("Jim Garvin's roster lists Karr as 'Cat 6'... treated as
a probable roster error... every other indicator points to Skull"). Colavita's own book, in his
own words, now confirms "White Skull 6" directly — a stronger source than the secondhand roster
currently backing that profile. This is a clean citation upgrade, no scope call needed.

### Two already-scaffolded events, confirmed and (one) newly corroborated

- **Dec 4, 1968 "Chicken Valley" ambush** (Jones/Stoltz/Williams KIA) — the key paragraphs on this
  chapter's p3/p5 are **verbatim identical** to text Michael had already excerpted directly onto
  `colavita-henry-verbal-account-dec4-1968` before this digest pipeline existed. No new facts about
  the ambush itself, but the surrounding night-assault scene (chaplain, Lt. Johnson's foxhole
  incident, the "GOOKS IN THE WIRE" call) is a major expansion of what had been one summary
  paragraph on the event page.
- **Jan 28, 1969 bunker-complex fight** (Pipher/Eskridge KIA) — previously sourced only from a
  2016 oral history video that never named either man. This chapter is a **second, independent
  primary source** — the book itself — and names both casualties directly for the first time, plus
  adds new tactical detail (three-platoon front, orange strobe lights vs. flares, an explicit
  backreference to Chicken Valley's flare use).

### Personnel resolved, enriched, or newly flagged

- **Lt. Michael Johnson** (ch. 8 stub candidate) — thread closed out: found hiding in the CP
  foxhole during the Dec 4-5 night assault, assessed by his own NCOs as showing no
  leadership/initiative, taken off Colavita's hands by Colonel Henry at Christmas 1968 in exchange
  for 2LT Bob Babas, reassigned to battalion staff. Still not built — remains a stub candidate with
  a completed story arc.
- **Lt. Douglas Magruder** (ch. 8 stub candidate) — enriched: WIA during the Dec 4 daytime fight,
  medevac'd, returned after treatment; directed the Blue Max ARA smoke-ID call.
- **2LT Dave Spingath** (existing profile) — callsign "Cat 6" confirmed in-text; reported an enemy
  attempt to turn Wild Cat's own Claymores during the night assault.
- **SFC Bruce Adams** (existing profile) — enriched: recommended shipping Johnson back to Rita,
  polled the platoon NCOs on his performance.
- **Lt. Karl Derums** (existing profile) — enriched twice: fabricated three Claymore "clapper
  keyboard" devices from a field sketch; separately, during a postwar Tangier Island visit,
  Colavita learned Derums had ghostwritten a condolence letter to CPL Eskridge's family (over
  Colavita's own unsigned signature block) containing a factual error Colavita disputes.
- **New stub candidates (not built, added to the tracker):** 2LT Bob Babas (Rifle Range 6,
  replacing Johnson at Christmas), RTO Ray Haley (Colavita's own RTO, named only in the photo
  caption), Sgt. Terry Shoopman (Wild Cat squad leader tied directly to the Velez-Rodriguez KIA),
  Ed Regan (flagged with a scope question — his only appearance is postwar/association context,
  not a wartime mention; the site has no settled rule yet for whether that class of name gets the
  same "ask before creating" treatment).

### Location note

**FSB Saint Barbara** gets its richest description yet (former French fort, in the 25th Infantry
Division's AO so 2/8 Cav didn't provide its own perimeter security there, Corps-level 175mm/8-inch
artillery, near the well-known Nui Ba Den landmark) — enough to make a real gazetteer push
worthwhile now, distinct from the false-match coordinate already ruled out in
`colavita-henry.md`'s admin notes.

---

## Pending / next priorities

1. **More Colavita chapters queued** — same treatment each time.
2. **Velez-Rodriguez event page** — `events/operation-sheridan-sabre-1969-01-21` doesn't exist;
   strongest single candidate this chapter produced. Stub decision for his own profile is separate
   and still Michael's call.
3. **Karr callsign citation** — low-effort, no-judgment-call upgrade: cite this chapter's photo
   caption on `soldiers/karr-john` to resolve the "Cat 6" vs. "Skull" ambiguity already flagged
   there.
4. **Jan 28, 1969 event page/document** — consider citing this chapter directly (a second source)
   alongside the existing oral-history-only document.
5. **5 new stub candidates pending** (Babas, Haley, Shoopman, Regan, plus Velez-Rodriguez as a
   KIA-specific case) — see `stub-candidates.md`.
6. **Ed Regan scope question** — postwar-only association mention; no site rule yet for this class
   of name. Worth deciding once, since more reunion-era names will likely surface.
7. **FSB Saint Barbara gazetteer push** — enough new detail (near Nui Ba Den) to attempt a real
   location fix.
8. **7 pre-existing pending stub candidates from ch. 8 still awaiting a decision** — Cruz,
   Magruder, Johnson, Armstrong, Jones, Dalrymple, Carillo — unchanged this session except
   Magruder/Johnson enrichment (see above).
9. **No Eleventy build run this session** — verified via `python3 -m json.tool` on the new digest
   and a YAML front-matter sanity check on the edited markdown files only, same fallback as prior
   sessions. Run a real build before treating this session's work as fully live.

---

## Key file locations

| Item | Path |
|---|---|
| Ch. 9 digest (new) | `site/sources/colavita/09-chicken-valley/09-chicken-valley.digest.json` |
| Ch. 9 review (new) | `site/sources/colavita/09-chicken-valley/09-chicken-valley.review.md` |
| Book-level digest registry (updated) | `site/sources/colavita/index.md` |
| Cross-source stub tracker (updated) | `site/_docs/stub-candidates.md` |
| Raw source screenshots (not in repo) | `C:\Users\michael.miller\Downloads\colavita\09-chickenvalley\` |
| Existing Dec 4 event/document (confirmed, not modified) | `events/operation-sheridan-sabre-1968-12-04`, `documents/colavita-henry/colavita-henry-verbal-account-dec4-1968` |
| Existing Jan 28 event/document (confirmed + new second source, not modified) | `events/operation-sheridan-sabre-1969-01-28`, `documents/colavita-henry/colavita-henry-verbal-account-jan28-1969` |
| Karr profile (citation-upgrade candidate, not modified) | `soldiers/karr-john/karr-john.md` |
| KIA list (Velez-Rodriguez already present, not modified) | `site/_docs/d-co-kia-list.md` |

---

## Carried-forward warnings

- **Build/deploy is manual and separate from git**, unchanged from every prior session.
- **Nothing in this session was written to a profile, event, or document page** — per the digest
  spec, this pipeline only produces the digest/review candidate layer plus the two registry/
  tracker files (`sources/colavita/index.md`, `_docs/stub-candidates.md`), which are themselves
  meant to be living indexes, not content pages. All profile/event enrichments listed above are
  proposals for Michael to action, not completed edits.
- **"Ask before creating" stub rule stands** — none of this session's 4 new personnel names
  (Babas, Haley, Shoopman, Regan) or the Velez-Rodriguez KIA were built as profiles.
- **Copyright handling unchanged**: no new verbatim passages were added this session — the only
  verbatim text anywhere in this chapter's digest/review is the same two paragraphs already on
  `colavita-henry-verbal-account-dec4-1968` from an earlier direct excerpt of this same chapter.
- **Always check `_sessions/` handoffs AND `site/_docs/stub-candidates.md`** before treating a
  name as new.
