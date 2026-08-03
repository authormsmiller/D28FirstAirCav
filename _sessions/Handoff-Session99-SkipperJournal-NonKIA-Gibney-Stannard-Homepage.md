# Session Handoff — 2026-07-16
**Session 99**
**Theme:** Closed a gap in Session 97's digest workflow (non-KIA contacts were being
skipped), used that fix to pull a genuinely new POW-negotiation story out of the Skipper
Journal into LTC Gibney's profile, corrected a transcription error that ties COL Stannard
into the same source, and made the homepage's two most stagnant sections self-updating.

---

## What was completed this session

### Part 1 — Four more Skipper Journal events (digest Pass 4 gap)

Reviewing `skipper-journal-jun-jul-1968.review.md` against what Session 98 actually built
turned up a real gap: Pass 4 had only proposed the four contacts that tied to a roster KIA,
silently skipping four other incidents the digest itself had captured. Michael's call: no-KIA
contacts get pages too (precedent: `contact-1968-06-30`, `bunker-complex-1971-06-24`). Built:

- `contact-yd324398-1968-06-04` — friendly-fire artillery WIA, 1210 hrs (a distinct incident
  from the same day's bunker contact at a different grid, 1345 hrs). Cross-linked both ways
  with `contact-yd324393-1968-06-04`.
- `contact-yd353475-1968-06-20` — booby-trap WIA + the month's only enemy POW capture.
- `contact-yd288321-1968-06-26` — no-casualty S/A contact.
- `contact-1968-06-28` — 1st Plt contact, 1 NVA KIA, the "White Skull" MG-gunner nickname
  (personnel lead, not yet actioned).

Added an addendum to the review.md's Pass 4 plus a schema note for the digest skill itself:
propose a page for *every* `contact`/`casualty_medevac`-type entry by default, not just the
ones that resolve to a roster KIA. Absence of a fatality is page content, not a reason to skip
the page.

### Part 2 — LTC Gibney (gibney-john): the CHICAGO FIRE negotiation

Michael fed in sources as they arrived; each pass corrected or enriched the last:

1. **VHPA page** on Operation CHICAGO FIRE — a Dec 25, 1968 Tay Ninh meeting with NLF reps
   that broke off without a release. Added as a new, separate timeline entry (initially
   flagged as an *open question* whether it was linked to the already-on-file Jan 1, 1969
   release).
2. **Two NYT archive pieces** (Dec 31 1968, Jan 1 1969) **confirmed** it was the same
   negotiation continuing to a second meeting, and supplied the full 5-man delegation
   roster, plus a detail worth keeping in mind: several names/ranks already in the profile
   were wrong (Specialist 4, not Sgt.; Donald G. Smith, not Donald C.; Sauvageot, not
   Sauvageat) — corrected throughout.
3. **Baltimore Afro-American** (UPI wire, Jan 4 1969) — a scanned newspaper PDF, OCR'd via
   `pdftoppm` + `tesseract` (10224×8064px page; needed a second upscaled/sharpened pass for
   legibility — transcript is flagged moderate-confidence, bracketed where uncertain). Added
   a concrete new detail (Gibney personally called "Dustoff" to signal the pickup helicopter)
   and a **real, unresolved discrepancy**: this source gives his hometown as Oakdale, N.Y.,
   conflicting with Clearwater, Fla. in both NYT pieces. Left unresolved in the profile
   rather than picked.
4. **An in-country photo** — Michael found a watermarked AP wirephoto (via commercial
   reseller Historic Images) of the actual Dec 25/26 Tay Ninh meeting. Converted `.webp` →
   `.jpg` as a research file; **declined to remove/mitigate the watermark** (it protects the
   seller's commercial print — same reasoning as any other copyright-protection measure).
   Briefly wired it into the site as a field photo, then pulled it back out at Michael's
   request — he's after a proper solo portrait for `profile_photo`, not this group shot.
   Searched Getty, AP Images, the National Archives catalog, USMA's 1952 Howitzer yearbook
   digital library, and Stars & Stripes for an in-country solo photo — nothing found (several
   of those sites are JS-rendered and Claude in Chrome wasn't connected this session, so a
   manual look by a human may still turn up more than my fetch-only searches could).
   `profile_photo` stays blank.

Four documents now live under `soldiers/gibney-john/documents/`: the VHPA HTML, both NYT
transcripts, and the Afro-American PDF + transcript.

### Part 3 — COL Stannard correction

Michael caught that the digest's "COL Standard" (CO, 1st Brigade, visited D Co's CP June 8,
1968) is a mistranscription of **John Stannard** — the site already has a full profile
(`stannard-john`), and the match is exact: Stannard was promoted to Colonel and took 1st
Brigade command in early Feb 1968, so a Colonel-rank 1st Brigade CO in June 1968 fits
precisely. Corrected in `digest.json` (personnel + event entries, both annotated) and
`review.md` (Pass 5). Added a new June 8 timeline entry to `stannard-john.md` plus a
corroborating note on his 1st Brigade assignment record — this is now the source confirming
he was still commanding four months into the role.

### Part 4 — Homepage (`index.njk`): two stale sections fixed

"Documented Events" was 3 hand-picked 1971 cards; "Primary Sources" was 2 items — both from
the original site launch, badly out of date against the now-78-entry events collection.
Michael's calls: make Events dynamic, keep Sources as curated named collections and just add
what's new.

- **Documented Events** now pulls the 3 most-recently-created entries from
  `collections.events` (`status: published` only), via an extended `sortByData` filter that
  now supports dot-path keys (`archivist_notes.created`) — previously flat-key only. Card
  body auto-builds from `casualties.kia/wia` counts + `units.primary[0].role`; this reads more
  clinical than the old hand-written copy, and same-day ties break on filesystem order, not
  true recency — both known, accepted tradeoffs of going dynamic.
- **Primary Sources** kept the two existing cards, added Skipper Journal and the 1967 Division
  ORLLs.
- **Real bug caught and fixed**: a template local variable named `kia` fell through to the
  site's global `_data/kia.json` (the ~110-person roster) whenever a page's own
  `casualties.kia` was undefined — Nunjucks resolves an `undefined` local by continuing to
  search outer/global scope, so one card briefly rendered "110 KIA" with every soldier's name.
  Renamed locals (`eventKiaList`/`eventWiaList`) to kill the collision. **Worth remembering
  for any future template work**: avoid naming Nunjucks locals `kia`, or anything else that
  matches a top-level `_data/*.json` filename, anywhere in this codebase.

**Explicitly flagged as not final** — Michael is thinking about a "Most Wanted" section
instead of (or alongside) a fixed Primary Sources list: a rotating random pick of 3 from a
needs-list, refreshing every couple of minutes, so no contributor feels snubbed for not being
on a permanent "sources" roster. Not built. Worth surfacing again if Primary Sources comes up.

### Recurring infrastructure issue: stale bash-mount truncation, again

Hit **twice** this session (`skipper-journal-jun-jul-1968.digest.json`, then `.eleventy.js`) —
same bug documented in Session 98 for `kia.json`. Pattern is consistent: after an Edit-tool
write, `bash`/`node`/`python3` see the file cut off mid-string/mid-token near the end, while
the Read tool shows the file complete and correct. Fix both times: `head -n <last-good-line>`
from the stale view + heredoc-append the correct tail (copied from Read's output) + validate
(`json.load` / `node -c`). This is now 3-for-3 on files edited via the Edit tool late in a long
session — worth assuming it'll happen again on the next large edit, not treating each
occurrence as a one-off.

---

## Pending / next priorities

1. **Gibney's hometown discrepancy** (Oakdale, N.Y. vs. Clearwater, Fla.) — unresolved,
   flagged in the profile. No obvious tie-breaker found.
2. **No in-country photo found for Gibney** beyond the watermarked group wirephoto. Getty,
   AP Images, and the USMA Howitzer yearbook digital library are all JS-rendered and couldn't
   be searched past their landing pages without a connected browser — worth another pass if
   Claude in Chrome is available in a future session.
3. **"White Skull" identity** (1st squad MG gunner, `contact-1968-06-28`) — still just a
   nickname. Personnel lead from the digest's Pass 5, not actioned.
4. **"Most Wanted" homepage section** — Michael's idea, not built. If Primary Sources comes up
   again, raise it rather than just patching the current fixed-list format again.
5. Standing items carried from Session 98 (still open, not touched this session): the
   `operation-pershing-1967` "1st Brigade" framing correction awaiting sign-off; Nov 1967–Jan
   1968 ORLL not yet pulled; WALLOWA standalone note; the May–Jun 1967 An Qui KIA lead.

---

## Key file locations

| Item | Path |
|---|---|
| New Skipper Journal event pages | `events/contact-yd324398-1968-06-04`, `contact-yd353475-1968-06-20`, `contact-yd288321-1968-06-26`, `contact-1968-06-28` |
| Skipper Journal digest/review (corrected) | `sources/dj/1968/skipper-journal-jun-jul-1968.{digest.json,review.md}` |
| Gibney profile + documents | `soldiers/gibney-john/gibney-john.md`, `soldiers/gibney-john/documents/*` |
| Stannard profile (enriched) | `soldiers/stannard-john/stannard-john.md` |
| Homepage | `index.njk` |
| Eleventy config (sortByData dot-path support) | `.eleventy.js` |

---

## Carried-forward warnings

- **Stale bash-mount truncation** — now confirmed on `kia.json` (Session 98), the Skipper
  Journal digest, and `.eleventy.js` (both this session). Assume any large Edit-tool write
  late in a session may need the same fix: reconstruct the tail via `head` + heredoc, validate
  with the relevant parser, before trusting a bash/node/python read of the file.
- **Nunjucks scope-shadowing on global `_data` names** — a local `{% set %}` variable that
  evaluates to `undefined` will silently fall through to a same-named global data variable
  instead of just being falsy. `kia` is a live footgun in this codebase specifically (global
  `_data/kia.json`); avoid reusing that name (or any other `_data/*.json` filename) as a local
  template variable anywhere on the site.
- **`unit-history.njk` gates on `status: published`** (from Session 98) — still true; new
  event pages left at `status: stub` won't appear there by design.
- **Always check `_sessions/` handoffs before treating a source's findings as new** — still
  the single biggest recurring process lesson across both Session 98 and 99.
