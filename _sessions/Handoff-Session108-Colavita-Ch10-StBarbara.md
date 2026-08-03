# Session Handoff — 2026-07-22
**Session 108**
**Theme:** Ran the Colavita chapter-digest pipeline on ch. 10, "Homeless on Saint Barbara" (16
screenshots, one confirmed real capture gap). Biggest find: upgraded an existing "research stub —
not a confirmed action" event page to a full firsthand account, the same pattern ch. 9 applied to
two other events. Also: added a Spingath profile photo (separate small task, done before this
chapter) and built the Elliot Velez-Rodriguez KIA profile flagged in ch. 9 (also done earlier this
session, via the `kia-profile-general` skill, with three gotchas Michael flagged handled: missing
Honor States, a Virtual Wall unit-attribution correction, and an unresolved name-spelling
discrepancy).

---

## What was completed this session

### Part 1 — Spingath profile photo

Michael cropped David Spingath's likeness out of the ch. 9 group photo (the same photo that
resolved 1LT Karr's platoon callsign) and dropped it in `profiles/spingath-dave/`. Added it as
`soldiers/spingath-dave/photos/profile/spingath-dave-profile.jpg` with a captioned `index.md`,
updated `profile_photo`/`photo_intro` on his main profile, and added an admin note documenting the
source and superseding the old "no confirmed photo" note (the 9-photo "Photos Taken By" gallery is
unaffected).

### Part 2 — Velez-Rodriguez KIA profile built

Michael added `KIA/velez-rodriguez-elliot/` (Virtual Wall + Wall of Faces HTML, no Honor States
page — confirmed absent) and flagged three things in advance. Built via `kia-profile-general`:

- **Honor States missing** — skill's fallback handled it (identity from Virtual Wall/Wall of
  Faces, decorations left blank, flagged in admin notes rather than silently worked around).
- **Virtual Wall lists him as A Company** — set D Company as his effective unit (`--unit`
  override), per Colavita's own account (inserted into Wild Cat's perimeter the night he died) and
  the same reasoning already applied to Ahern; A Company noted as his administrative parent in
  admin notes, not silently dropped.
- **Slug/name order** — kept `first_name: Elliot` / `last_name: Velez-Rodriguez` matching the
  slug. Also caught (not previously flagged by Michael) that Virtual Wall/Wall of Faces both spell
  it "Elliott" (double-T) while the KIA list, the memoir, and the slug all say "Elliot" — flagged
  as an unresolved spelling discrepancy, same treatment as the existing Derums Karl/Carl and
  Williams Horton/Morton flags, rather than picking one silently. Also corrected the casualty
  record's "Tay Ninh Province" to "Binh Long" in the published text (same DCAS-error pattern as
  the Dec 4/Jan 28 clusters), flagged in admin notes.
- Updated `d-co-kia-list.md` (profile status `—` → `stub`) and moved him from Pending to Resolved
  on `stub-candidates.md`.

### Part 3 — Ch. 10 chapter digest

- **`site/sources/colavita/10-st-barbara/10-st-barbara.digest.json`** — new, structured
  personnel/locations/events extraction, page-cited.
- **`site/sources/colavita/10-st-barbara/10-st-barbara.review.md`** — new, cross-reference
  passes, stub-candidate flags, event-page recommendations.
- **`site/sources/colavita/index.md`** — added the ch. 10 row, updated cross-reference index,
  known-gaps note, time window.
- **`site/_docs/stub-candidates.md`** — added 3 new pending rows (Wood, Bramlett, Goochie).

**Reading-order note — a REAL gap this time.** Michael initially reported "p14" as simply skipped
in his own numbering (matching ch. 9's harmless missing "p6"), then corrected himself: this one IS
a real missed capture. p13 cuts off mid-word ("...shoot an azimuth towards LZ Saint Bar-") and p15
resumes mid-anecdote ("phosphorous grenade here on Saint Barbara...") describing the aftermath of
an accident that wounded 2LT Jon Jones ("Jonsey") — the actual accident is not on file, only its
aftermath (medevac, and a 1999 Las Vegas reunion). Flagged in both the digest and review rather
than reconstructed or glossed over.

### Headline finding — an event page upgraded from "not confirmed" to a firsthand account

**`events/operation-sheridan-sabre-1969-02-05`** (CPL James Edmonds, SP4 Chester Kmit, KIA 5 Feb
1969) currently states outright that it is a research stub that "does not describe a confirmed
action," with brigade attachment, specific location, and even whether the two men died together
all listed as open questions. This chapter answers nearly all of it: a downhill approach to a
creek crossing ("Colavita Creek," per the men's own nickname), ambushed from across the water,
Kmit killed instantly as point man, Edmonds mortally wounded and then dropped when a medevac crew
apparently panicked and cut the jungle-penetrator cable under fire — formally investigated
afterward by a Medical Service Corps colonel, with Colavita testifying the cut wasn't necessary.
**Not yet applied to the event page itself** — flagged as the top recommended action in the
review, same as any digest-stage finding.

### Other findings worth flagging

- **A battalion command change, directly narrated:** LTC Frank Henry departs (his own OER for
  Colavita, rating him #1 of 5 company commanders and citing Chicken Valley, is quoted); LTC
  Richard Wood arrives as the new "Stone Mountain 6," with his S-3, Major James Bramlett. Both new
  stub candidates. Colavita's own tenure arithmetic (7 months total command, 4.5 under Henry, from
  Oct 1968) gives an independent mid-to-late-Feb-1969 estimate for Henry's departure — refining,
  not contradicting, the existing ~March 1969 clipping-based estimate on `soldiers/henry-frank`.
- **1LT Preston Karr's actual arrival is directly narrated** — a second, independent confirmation
  (beyond ch. 9's photo caption) of his D Co assignment and its timing, both pointing to the same
  window as his profile's confirmed 12 Mar 1969 arrival date.
- **Two existing stub-candidate threads close out:** Lt. Doug Magruder (WIA a second time, Feb 5,
  does not return — permanently replaced by Karr) and, separately from this chapter but continuing
  the pattern, Jon Jones now has a substantial three-chapter arc (FO work, a WIA with the cause
  missing, and a fully warm 1999 reunion story) — flagged as a strong build candidate even with
  one gap in it.
- **A likely resolution to the Feb 5 event's "Tay Ninh vs. 2nd Brigade" tension:** this chapter's
  Saint Barbara operations, cross-referenced against the existing `operation-montana-scout-1969`
  page (which places 2/8 Cav's 1st Brigade at "LZs Grant, Carolyn, St Barbara, Ike, Jamie, and
  White"), suggest 2/8 Cav had already shifted to the 1st Brigade's Tay Ninh AO by early Feb 1969
  — meaning the casualty records' "Tay Ninh Province" may simply be correct this time (unlike the
  Dec 4/Jan 28 clusters, where it was likely a DCAS error). Flagged as a strong inference, not
  asserted as confirmed — the book itself never uses the term "1st Brigade" for Saint Barbara.
- **LZ Carolyn's construction is directly narrated for the first time** — April 1969, and its
  timing lines up almost exactly with Operation Montana Scout's official 1 Apr 1969 start.

---

## Pending / next priorities

1. **Update `events/operation-sheridan-sabre-1969-02-05`** with this chapter's firsthand account —
   the single highest-value action item from this session.
2. **More Colavita chapters queued** — same treatment each time.
3. **3 new stub candidates pending** (Wood, Bramlett, Goochie) — see `stub-candidates.md`.
4. **Jon Jones** — strong build candidate despite the missing WIA-cause detail; Michael's call.
5. **Henry departure-date arithmetic and Karr arrival confirmation** — low-effort citation
   upgrades on `soldiers/henry-frank` and `soldiers/karr-john`, no scope call needed.
6. **Saint Barbara → Montana Scout connection** — worth a line on `operation-montana-scout-1969`
   and/or `colavita-henry.md` if Michael agrees with the inference.
7. **Still-pending stub candidates from ch. 8/9** — Cruz, Armstrong, Dalrymple, Carillo, Babas,
   Haley, Shoopman, Ed Regan (scope question) — unchanged this session.
8. **No Eleventy build run this session** — verified via `python3 -m json.tool` and YAML
   front-matter sanity checks only, same fallback as prior sessions.

---

## Key file locations

| Item | Path |
|---|---|
| Ch. 10 digest (new) | `site/sources/colavita/10-st-barbara/10-st-barbara.digest.json` |
| Ch. 10 review (new) | `site/sources/colavita/10-st-barbara/10-st-barbara.review.md` |
| Velez-Rodriguez profile (new, this session) | `site/soldiers/velez-rodriguez-elliot/velez-rodriguez-elliot.md` |
| Spingath profile photo (new, this session) | `site/soldiers/spingath-dave/photos/profile/spingath-dave-profile.jpg` |
| Event needing the Feb 5 upgrade (not yet modified) | `site/events/operation-sheridan-sabre-1969-02-05/index.md` |
| Henry profile (citation-upgrade candidate, not modified) | `site/soldiers/henry-frank/henry-frank.md` |
| Karr profile (citation-upgrade candidate, not modified) | `site/soldiers/karr-john/karr-john.md` |
| Montana Scout event (connection candidate, not modified) | `site/events/operation-montana-scout-1969/index.md` |
| Book-level registry (updated) | `site/sources/colavita/index.md` |
| Cross-source stub tracker (updated) | `site/_docs/stub-candidates.md` |
| Raw source screenshots (not in repo) | `C:\Users\michael.miller\Downloads\colavita\10-st_barbara\` |

---

## Carried-forward warnings

- **Build/deploy is manual and separate from git**, unchanged from every prior session.
- **Nothing in the ch. 10 digest/review was written to a profile, event, or document page** — per
  the digest spec, proposals only. The Velez-Rodriguez profile and Spingath photo WERE written
  directly (per Michael's explicit requests, not the digest pipeline's "ask before creating" flow).
- **A real vs. harmless capture gap distinction now has one example of each** — ch. 9's missing
  "p6" (harmless) and ch. 10's missing "p14" (real, confirmed by Michael) — worth continuing to
  verify each gap independently rather than assuming a pattern.
- **Always check `_sessions/` handoffs AND `site/_docs/stub-candidates.md`** before treating a
  name as new.
