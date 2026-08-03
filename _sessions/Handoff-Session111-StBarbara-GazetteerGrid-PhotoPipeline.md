# Session Handoff — 2026-07-23
**Session 111**
**Theme:** Built the FSB Saint Barbara location page that Session 107/108/109 had flagged
repeatedly as "worth a real location-fix attempt" and never gotten to. What started as a
straightforward location page turned into a real identification win (a gazetteer grid Michael
found independently corroborates Colavita's memoir three separate ways) and then a genuine
site-architecture lesson once photos entered the picture: location pages don't host their own
photos, and getting that wrong cost most of this session's back-and-forth.

---

## What was completed this session

### `locations/fsb-st-barbara` — built, then corrected

Built from CPT Colavita's memoir (ch. 9 "Chicken Valley," ch. 10 "Homeless on Saint Barbara")
plus a gazetteer lookup Michael supplied directly in chat: **FB Saint Barbara, 11.4748/106.1651,
XT275684, 1:50,000 map sheet 6231-4, aka "The French Fort" and "FSB Bao Co," noted "25th ID, 1st
ACD '68"** — pulled from the master `sources/fsb-locations/FSB-locations.pdf` gazetteer, not the
2/8-Cav-filtered derived list (this entry's note doesn't literally say "2/8th Cav," so it never
surfaced in the existing `2-8-cav-fsb-list.md`).

Three independent cross-checks confirmed this is the right site, none of which informed each
other: the gazetteer's own **"French Fort"** alias matches Colavita's own description; the grid
sits ~12 km from **Nui Ba Den**, matching his account of the base's proximity to the mountain;
and the gazetteer's separate **FB Carolyn** entry (XT278788, opened 20 Apr 69) sits ~10.4 km
north of this grid, matching his memoir's "about 10km due north" account of the April 1969 move
almost exactly. This also resolved a standing false-match warning already on file
(`soldiers/colavita-henry.md`): an earlier "FB Barbara" candidate (10.7240/106.4364, XS575855)
is confirmed as a different base entirely, tied to the 199th LIB near Xuan Loc.

**Slug correction:** the page was first built as `fsb-saint-barbara`, but Michael's own staging
folder for photos was already named `fsb-st-barbara` — renamed the page and every cross-reference
to match (`colavita-henry.md`, the Feb 5 event page). Lesson: check for an existing staging
folder name before picking a slug.

**Cross-references updated:** `soldiers/colavita-henry.md` admin notes (the old "coordinates TBD"
language resolved), and `events/operation-sheridan-sabre-1969-02-05` (`location`,
`location_precision`, `sources`, and body text now cite the confirmed grid — the brigade-
attachment question itself, oq-02, remains an inference, not something the grid alone resolves).

### The photo pipeline — the real lesson of this session

Michael added four photos from a third-party source (Larry Kleinschmidt,
larrykleinschmidt.com/VietnamGallery17.htm — a gallery titled **"The French Fort,"** itself a
fourth independent corroboration of the identification above) to a staging folder. First attempt
filed them at `site/locations/fsb-st-barbara/photos/index.md` with a manual `## Photos` section
in the page body — **wrong**, and the Photos tab never appeared on the published page.

Michael pointed at `site/locations/fsb-mace/index.md` and `site/locations/index.njk` to show
what the working pattern looks like. Tracing `photosByFsb` into `site/_data/photosBySlug.js`
revealed the actual mechanism: **the photo crawler only walks `site/soldiers/[slug]/photos/**`.
It never reads `site/locations/*/photos/` at all.** A location's Photos tab is populated by
`photosByFsb[slug]`, built from *contributors'* own photo folders — specifically
`photos/locations/[loc-slug]/index.md`, where each entry carries `fsb: <loc-slug>` and gets
reverse-indexed onto that location.

Since Kleinschmidt isn't a documented D Co soldier — just a photo source — Michael's call was to
give him a **draft (unpublished) contributor stub**, following the exact precedent already in
the archive (`soldiers/roberts-charles.md` uses the same `draft: true` mechanism for a different
reason). Built `soldiers/kleinschmidt-larry/kleinschmidt-larry.md` with `draft: true` — excluded
from the roster/KIA collections via the existing `!s.data.draft` filter in `.eleventy.js`, not
linked anywhere — and filed the four photos at
`soldiers/kleinschmidt-larry/photos/locations/fsb-st-barbara/index.md`, each carrying
`fsb: fsb-st-barbara`. This is the exact pattern the pipeline's own code comments describe for
"a contributor's firebase deck."

Cleanup: the abandoned `locations/fsb-st-barbara/photos/index.md` could not actually be deleted —
**this mount denies file removal (`rm`/`rmdir` both fail with "Operation not permitted")** —
so it was emptied and left with a pointer note to the corrected location. The manual `## Photos`
section was removed from the location page body per Michael's request; the tab is meant to
render automatically from `photosByFsb`, not from page prose.

**Not yet verified against a real build** — see warnings below.

### New fact surfaced, not actioned

The same gazetteer lookup that confirmed Saint Barbara also showed **FB Carolyn was "Overrun
6May69"** — not reflected anywhere else in this archive (the existing `operation-montana-
scout-1969` and `colavita-henry` pages only note Carolyn's construction/occupation). Flagged in
`locations/fsb-st-barbara`'s admin notes and open questions. Not built out — a KIA-scale event
page needs Michael's go-ahead first, same as any new combat event in this archive.

---

## What's still on the table (carried forward from Session 109/110, updated)

### Resolved this session
- ~~FSB Saint Barbara gazetteer push~~ — done, confirmed grid XT275684.

### Still pending — profile enrichments (low-risk, no scope call needed)
1. `soldiers/henry-frank` — tenure arithmetic + OER document candidate (ch. 10).
2. `soldiers/adams-bruce` — ch. 9/10 enrichments (Johnson-to-Rita recommendation; rotation to
   battalion rear, First Sergeant handback to Cruz).
3. `soldiers/derums-karl` — ch. 9 clapper-keyboard/Eskridge-letter items (mirror onto Derums;
   already on Eskridge's page); ch. 10 humor beat.
4. `soldiers/colavita-henry` — Dec 6 skipped-ambush admission, Christmas-at-Rita color,
   clapper-keyboard invention (ch. 9); Jon Jones Tet-truce vignette, first naming of wife Janine
   (ch. 10).

### Locations / operational connections
5. **Saint Barbara → LZ Carolyn → Operation Montana Scout connection** — the Saint Barbara page
   now documents this from Saint Barbara's side; the reciprocal note on
   `events/operation-montana-scout-1969` and/or `colavita-henry.md` is still pending.
6. **LZ Carolyn's construction, and now its 6 May 1969 overrun** — construction still a candidate
   for a short note; the overrun is a new, unbuilt, KIA-scale event — needs Michael's go-ahead.

### Stub-candidate decisions (Michael's call, unchanged)
7. Ch. 9: 2LT Bob Babas, RTO Ray Haley, Sgt. Terry Shoopman, Ed Regan.
8. Ch. 10: LTC Richard Wood, Major James Bramlett, SGT James Goochie (named generically, not
   linked, in the Feb 5 event page's narrative — no profile built).
9. Jon Jones ("Jonsey") — still a strong build candidate.
10. Carried forward from ch. 8, untouched across five sessions now: 1SG Ramon Cruz, Lt. Greg
    Armstrong, Clyde Dalrymple, Gil Carillo.

### New this session
11. **Larry Kleinschmidt's own Vietnam service is unresearched.** His stub exists only to file
    photo credits (draft, unpublished). If his unit/dates are ever confirmed, rebuild the profile
    properly before considering publication — don't just flip `draft` off.
12. **Original Kleinschmidt gallery captions were never retrieved.** A WebFetch attempt on
    larrykleinschmidt.com/VietnamGallery17.htm returned no usable content, and Claude in Chrome
    wasn't connected in that session. The four captions in
    `soldiers/kleinschmidt-larry/photos/locations/fsb-st-barbara/index.md` are archive-written
    descriptions of what's visible, clearly flagged as such — worth swapping in the real captions
    if someone can pull that page.

---

## Key file locations

| Item | Path |
|---|---|
| Saint Barbara location page (built, corrected) | `site/locations/fsb-st-barbara/index.md` |
| Kleinschmidt contributor stub (draft, unpublished) | `site/soldiers/kleinschmidt-larry/kleinschmidt-larry.md` |
| Kleinschmidt's Saint Barbara photos (the fix) | `site/soldiers/kleinschmidt-larry/photos/locations/fsb-st-barbara/index.md` |
| Dead file, emptied, could not delete | `site/locations/fsb-st-barbara/photos/index.md` |
| Feb 5 event page (grid citations updated) | `site/events/operation-sheridan-sabre-1969-02-05/index.md` |
| Colavita profile (admin note resolved) | `site/soldiers/colavita-henry/colavita-henry.md` |
| The photo pipeline itself (read, not modified) | `site/_data/photosBySlug.js`, `site/_data/photosByFsb.js` |
| Draft-stub precedent referenced | `site/soldiers/roberts-charles/roberts-charles.md` |
| Master firebase gazetteer (source of the grid) | `sources/fsb-locations/FSB-locations.pdf` (see also `2-8-cav-fsb-list.md`, `2-8-cav-fsb-by-year.md` — both filtered to entries naming "2/8th Cav" explicitly, which is why Saint Barbara wasn't in either) |
| Montana Scout event (reciprocal Carolyn note pending) | `site/events/operation-montana-scout-1969/index.md` |

---

## Carried-forward warnings

- **Build/deploy is manual and separate from git**, unchanged from every prior session. Michael
  is deploying as of this handoff — **this is the first real test of whether the Photos tab
  actually renders** from the `photosByFsb[slug]` data this session set up. Nothing in this
  session ran the actual Eleventy build; verification was YAML front-matter parse checks only
  (`yaml.safe_load`), same fallback as every prior session. If the tab doesn't appear after
  deploy, check that `site/_data/photosBySlug.js` is finding `soldiers/kleinschmidt-larry/photos/
  locations/fsb-st-barbara/index.md` and that the media sync step (whatever copies committed jpgs
  to the Cloudflare-served `/media/photos/soldiers/...` path) actually ran.
- **This mount will not allow file deletion.** `rm` and `rmdir` both fail with "Operation not
  permitted" even on files/directories created this session. Plan around this — overwrite/empty
  a file rather than trying to remove it, and mention the leftover explicitly rather than assuming
  cleanup succeeded.
- **Location pages do not host their own photos.** Any future location build that includes
  photos must file them under the relevant contributor's `soldiers/[slug]/photos/locations/
  [loc-slug]/index.md` with `fsb: <loc-slug>` on each entry — never under `locations/[slug]/
  photos/`. If the contributor isn't a documented company soldier, use a `draft: true` stub
  (per `roberts-charles`) rather than inventing a published profile.
- **Content-sensitivity precedent now applies to three events** — Velez-Rodriguez (Jan 21) and
  Edmonds/Kmit (Feb 5) both omit clinical body/fall detail per Michael's explicit choice.
- **"Ask before creating" stub rule stands** — Wood, Bramlett, Goochie, Jones, Cruz, Armstrong,
  Dalrymple, Carillo, Babas, Haley, Shoopman, Regan all remain unbuilt. Kleinschmidt is the one
  exception this session, and only as an explicitly unpublished filing stub, not a real profile.
- **Always check `_sessions/` handoffs AND `site/_docs/stub-candidates.md`** before treating a
  name as new — and now also check `Downloads/locations/[slug]/` (or equivalent staging folder)
  for an existing naming convention before picking a new location's slug.
