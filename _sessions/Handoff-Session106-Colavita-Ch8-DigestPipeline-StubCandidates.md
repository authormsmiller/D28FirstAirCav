# Session Handoff — 2026-07-22
**Session 106**
**Theme:** Built a standalone chapter-digest pipeline for Colavita's memoir (mirroring the
existing ORLL/Daily-Journal digest pattern), ran it end-to-end on ch. 8 "Angry Skipper" (17
screenshots), and used it to build four new soldier stubs (Nix, Adams, Derums, Spingath) plus
enrich an existing thin profile (Henry). Also formalized a copyright convention for full-passage
book excerpts and started a permanent, cross-source "stub candidates" tracker — the durable home
for names that surface ahead of a profile going forward.

---

## What was completed this session

### Part 1 — Colavita chapter-digest pipeline established

Michael dropped 17 e-reader screenshots of ch. 8, "Angry Skipper," and asked how to extract
names/locations/events without over-quoting the (copyrighted, commercially published) book, in a
form robust enough that a later soldier falling in the same window could be checked against it
without re-reading the screenshots.

Found the site already has exactly this pattern, just not yet applied to a memoir: the Daily
Journal digest at `site/sources/dj/1968/` (digest.json + review.md) and the full design spec at
`site/_docs/orll-digest-and-cross-reference-spec.md`. Adapted it for a memoir chapter:

- **`site/sources/colavita/index.md`** — new, book-level registry (chapters processed, known
  gaps, cross-reference index, the copyright/"Excerpt" convention — see Part 4).
- **`site/sources/colavita/08-angry-skipper/08-angry-skipper.digest.json`** — new, structured
  personnel/locations/events extraction, page-cited against the actual screenshot filenames.
- **`site/sources/colavita/08-angry-skipper/08-angry-skipper.review.md`** — new, cross-reference
  passes (what's already published vs. genuinely new, stub-candidate flags, event-page
  candidates).
- Added a **"Memoirs / veteran accounts"** section to `site/sources/index.md` pointing to it.

**Filename-collision gotcha, resolved:** the 17 screenshots aren't reliably ordered by filename —
`p8(1).jpg`/`p8.jpg` and `p11(1).jpg`/`p12(1).jpg` are two *different* physical pages that
happened to get the same base filename during capture, not duplicate shots. Verified the true
reading order by matching sentence continuity across every page boundary (documented in the
digest's `reading_order_note`).

### Part 2 — Cross-referenced against the existing archive (bigger than expected)

Before writing anything, checked whether this ground had been covered — it had, substantially.
Sessions 101/105 already built `soldiers/colavita-henry`, `garner-audis`, `grannemann-rodney`,
`ahern-raymond`, `cromie-michael`, `hackett-larry`, the `operation-sheridan-sabre-*` event family,
and `documents/colavita-henry/colavita-henry-memoir-company-grade`, all from excerpts Michael had
pasted directly into chat (not a full-chapter read).

The full-chapter read **confirmed everything already published** (no contradictions) but
surfaced roughly a dozen named people those excerpts never caught — proof that full-chapter reads
catch real gaps that excerpt-pasting misses, which is now written into the review as a lesson for
future chapters.

**Colonel Henry resolved:** Michael identified him as an *existing* profile,
`soldiers/henry-frank` (COL Frank Leonidas Henry, "Stone Mountain 6") — previously a thin
`researching`-status stub built from VHPA/Army Aviation Hall of Fame bios. This chapter added
real substance: the change-of-command ceremony, the OJT-with-Charlie-Company order, the LZ Rita
move order, approving Armstrong's removal and assigning Spingath, and personally directing the
grid XT 642883 reinforcement as "Stone Mountain 6." Digest/review/registry all updated to move
him from stub-candidate to enrichment.

### Part 3 — Four new soldier stubs built

All four sourced entirely from this one chapter; all thin by necessity (single-source, no
independent service record yet):

- **`soldiers/nix-jim`** — thinnest profile of the batch: one anecdote (grazed on the nose by an
  M-79 warning shot during a listening-post incident). Michael supplied a photo.
- **`soldiers/adams-bruce`** — SFC, acting First Sergeant; carries two incidents (a pre-command
  Silver Star extraction-under-fire action, still paraphrase only, and the Nix/LP anecdote, now
  quoted in full — see Part 4). **No photo available** — built anyway, per Michael's explicit
  call that names will keep surfacing ahead of photos going forward.
- **`soldiers/derums-karl`** — Company XO. Photo supplied. **Unresolved naming flag:** Michael's
  photo folder was named `derums-karl` (matching the book's spelling) but the photo file itself
  was named `derums-carl-profile.png`. Kept "Karl," flagged the discrepancy, didn't silently
  resolve it either way.
- **`soldiers/spingath-dave`** — Wild Cat (2nd Plt) platoon leader, replacing Armstrong. **No
  confirmed photo of him** — Michael supplied 9 personal-collection photos but confirmed he
  isn't identifiable in any of them. These went in as his **"Photos Taken By" gallery**
  (`photos/field/index.md`), not a profile photo — this required actually reading
  `site/_data/photosBySlug.js` and the `soldier.njk` template to confirm `photos/field/` (not
  `photos/profile/` or `photos/locations/`) is what feeds that specific gallery. Two of the nine
  photos named soldiers not yet in the archive: **Clyde Dalrymple** ("with his fellow Wild Cat
  Platoon soldiers" — a nice corroboration of Spingath's own platoon) and **Gil Carillo**. Both
  now tracked as stub candidates (see Part 6).

### Part 4 — Full-passage excerpt + a copyright convention, formalized

Michael asked to pull the *entire* Nix/Adams M-79 anecdote verbatim (not just short phrases),
attributed to Colavita by name — matching the existing `colavita-henry-verbal-account-dec4-1968`
/ `-jan28-1969` precedent for full first-person excerpts.

- Built **`documents/colavita-henry/colavita-henry-verbal-account-nix-lp-1968-11/index.md`** —
  the full passage (p9–p10, "We had three listening posts..." through "...might never wake up"),
  quoted verbatim and attributed. `contains: [colavita-henry, nix-jim, adams-bruce]`; linked from
  both Nix's and Colavita's profiles.
- Michael then asked that any long book quote be labeled **"Excerpt"** and carry a **visible
  link** to the book (`amazon.com/.../dp/1555717829`) — reasoning that a real link to buy the
  book reads as free advertising, not appropriation, supporting fair use for a non-commercial
  archive.
- **Found the front-matter `source_url` field is inert** — `document.njk`'s Source tab only
  renders `source_note`/`source`, never `source_url`. So the link has to live in the visible
  body text to actually show up. Fixed on the new document, retrofitted onto the existing
  `-dec4-1968` document and the main `colavita-henry-memoir-company-grade` synopsis page, and
  **formalized as a standing rule** in `sources/colavita/index.md` so future chapters follow it
  automatically.

### Part 5 — Scope decision: Gonzales excluded

Capt. Mike Gonzales (Charlie Company CO, appears only as a contextual OJT figure in ch. 8) was
explicitly marked **out of scope** per Michael — this is a D Company archive, and he's not a stub
candidate regardless of how much page-time the book gives him. Removed from every pending list;
kept in an explicit "out of scope" list instead so a future pass doesn't re-propose him.

### Part 6 — Cross-source "stub candidates" tracker started

Michael asked for a single running list of stub candidates — not just this chapter's — with full
names, whatever data is on hand, and a reference to the source that generated each one.

Built **`site/_docs/stub-candidates.md`** — three sections:

- **Pending** (7 rows): Ramon Cruz ("Blinky," 1SG), Douglas Magruder (Lt., White Skull), Michael
  Johnson (Lt., Rifle Range), Greg Armstrong (Lt., Wild Cat, removed ~27 Nov 68), Jon Jones
  ("Jonsey," 2LT, FO), Clyde Dalrymple, Gil Carillo.
- **Out of scope**: Mike Gonzales (see Part 5).
- **Resolved**: the four new builds plus Henry, each with slug/date/source.

Both the chapter review and the book-level registry now point to this file as the source of
truth; it's designed to outlive this one source (any future document/photo drop that names
someone without a profile should land here).

---

## Pending / next priorities

1. **More Colavita chapters queued** — same treatment each time: full read (don't rely on
   excerpts alone, per Part 2's lesson), build digest.json + review.md, check
   `stub-candidates.md` before proposing any name.
2. **7 pending stub candidates** awaiting Michael's go-ahead/photos (see `stub-candidates.md`,
   Pending section) — Cruz, Magruder, Johnson, Armstrong, Jones, Dalrymple, Carillo.
3. **Karl/Carl Derums spelling discrepancy** — unresolved, flagged on his profile.
4. **Adams's pre-command Silver Star action** is still paraphrase only. If Michael wants it
   pulled as a full excerpt later, it follows the same Excerpt + visible-link convention from
   Part 4.
5. **The unnamed buck-sergeant FO** (Ahern's FO, replaced by Jones) has no name — can't become a
   stub without one; noted on `ahern-raymond` cross-references already.
6. **New event-page candidate, not yet built:** the emergency reinforcement of Charlie Company at
   grid XT 642883 — distinct from the 4 Dec 1968 "Chicken Valley" fight already on
   `events/operation-sheridan-sabre-1968-12-04`. Flagged in the ch. 8 review as the strongest
   event-page candidate from this chapter (no-KIA contacts still get pages, per the site's own
   established rule).
7. **Ambush-doctrine mechanics** ("Delta 'Bush," "triangle 'bush," three-platoons-abreast
   movement) — new specifics beyond what `soldiers/colavita-henry` already summarizes in general
   terms; worth folding into his profile narrative when next touched.
8. **No Eleventy build run this session** — verified everything via `gray-matter` front-matter
   parsing and `python3 -m json.tool` on the digest JSON only, per the same fallback practice
   documented in Sessions 101/105 when a full build isn't practical in a single tool call. Run a
   real build before treating this session's work as fully done.

---

## Key file locations

| Item | Path |
|---|---|
| Book-level digest registry (new) | `site/sources/colavita/index.md` |
| Ch. 8 digest (new) | `site/sources/colavita/08-angry-skipper/08-angry-skipper.digest.json` |
| Ch. 8 review (new) | `site/sources/colavita/08-angry-skipper/08-angry-skipper.review.md` |
| Cross-source stub tracker (new) | `site/_docs/stub-candidates.md` |
| Jim Nix profile (new) | `soldiers/nix-jim/nix-jim.md` + `photos/profile/` |
| Bruce Adams profile (new, no photo) | `soldiers/adams-bruce/adams-bruce.md` |
| Karl Derums profile (new) | `soldiers/derums-karl/derums-karl.md` + `photos/profile/` |
| David Spingath profile (new, no photo) | `soldiers/spingath-dave/spingath-dave.md` + `photos/field/` (9 photos, "Photos Taken By" gallery) |
| Frank Henry profile (enriched) | `soldiers/henry-frank/henry-frank.md` |
| Full Nix/Adams excerpt (new document) | `documents/colavita-henry/colavita-henry-verbal-account-nix-lp-1968-11/index.md` |
| Existing Dec 4 excerpt (retrofitted with visible book link) | `documents/colavita-henry/colavita-henry-verbal-account-dec4-1968/index.md` |
| Main memoir synopsis (retrofitted with visible book link) | `documents/colavita-henry/colavita-henry-memoir-company-grade/index.md` |
| Top-level source registry (added Memoirs section) | `site/sources/index.md` |
| Design spec this pipeline is modeled on | `site/_docs/orll-digest-and-cross-reference-spec.md` |
| Raw source screenshots (not in repo) | `C:\Users\michael.miller\Downloads\colavita\08-AngrySkipper\` |

---

## Carried-forward warnings

- **Build/deploy is manual and separate from git**, unchanged from every prior session — local
  `npm run build` → `_site/`, deployed separately by Michael. This session verified front matter
  via `gray-matter` and JSON via `python3 -m json.tool` rather than a full Eleventy build (same
  fallback as Sessions 101/105); run a real build before treating this work as fully live.
- **`source_url` in document front matter does not render anywhere** on `document.njk` — confirmed
  by reading the template directly. Any link meant to be visible to a reader must be in the body
  content (markdown links do render there — confirmed against existing soldier-link usage in
  other documents).
- **Copyright handling for this source, reaffirmed and extended:** facts → paraphrase in the
  archive's own words; a full first-person anecdote → may be quoted in full *only* when
  attributed to Colavita by name as his own account (not for material he merely reproduces from
  someone else — that goes under the original author's name instead, per the Hackett precedent);
  any such full excerpt gets labeled "Excerpt" and carries a visible, clickable link to
  `amazon.com/.../dp/1555717829` in the body text.
- **"Ask before creating" stub rule stands**, but Michael has explicitly accepted building
  thin/no-photo stubs this session rather than holding them back ("names are going to surface
  without photos as I move forward") — Adams and Spingath both shipped without photos on that
  basis.
- **Always check `_sessions/` handoffs AND `site/_docs/stub-candidates.md`** before treating a
  name as new — the tracker is now the first stop, this note is the second.
