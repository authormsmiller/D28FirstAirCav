# Session Handoff — 2026-07-24
**Session 113**
**Theme:** Standardized the "(n)" record-count indicator across every soldier-profile and
location-profile tab, using Unit History's tab-count styling as the visual reference. Along the
way, scoped (but deliberately did not build) a plan for eventually linking Skipper Stories
submissions back to soldier slugs for the long-term book-spine project. Garvin's photo-attribution
question from Session 112 was raised again but intentionally not investigated — Michael wants to
look at it fresh next session, and flagged that it may be less severe than originally thought.
Next session's stated goal: the Garvin/Spingath/Monteleone photo-attribution review.

---

## What was completed this session

### Soldier profile: tab-count indicators
Agreed the mapping first, then implemented it: every tab in `soldier.njk` now shows how many
records sit behind it, e.g. "Photos (10)", "Documents (0)".

- **Timeline** — hand-authored entries merged with auto-injected event entries (same set the
  Session 112 `mergeTimeline` fix produces)
- **Photos** — sum of all three galleries (photos of him, photos by him, related/tagged photos)
- **Served Alongside** — sum of all four tiers
- **Verbal Accounts** — archive anecdotes + first-person verbal documents + documents that
  reference him
- **Documents** — authored + explicitly referenced + tagged
- **Letters** — straight count
- **Service Record** — hardcoded `(1)`, since it's not a list
- **External Resources** — the one deliberate exception. Stays hidden entirely when a soldier has
  no Wall of Faces entry or outside link, rather than showing "(0)" — Michael's call: an absent
  external link isn't a research gap the way an empty Photos or Timeline tab is.

The counting logic was hoisted into a new block before the tab bar, using `tc_`-prefixed variable
names kept deliberately separate from the (recently touched, still build-unverified) per-tab
rendering logic further down the file — same values, computed twice, so nothing already working
had to be disturbed.

### Location profile: bigger change than expected
Applying the same "(0) is a signal" philosophy to `location.njk` surfaced a real behavioral
difference: Accounts, Soldiers Present, Events Here, Photos, and Documents tabs previously
**disappeared entirely** from the tab bar when empty — there was no way to show "(0)" under the
old structure at all. Changed all five to always render, with counts (including zero), and added
an empty-state message with a contribute link to each panel for when it's empty, matching the tone
of the soldier profile's existing empty states. Soldiers Present didn't have a count before at all;
it now shows confirmed + circumstantial combined. Overview intentionally stays uncounted — it's
narrative, not a record list, and Michael didn't ask for a forced "(1)" there the way Service
Record gets one.

### Shared styling
Added `.tab-count` to `main.css` (opacity .55, matching Unit History's existing muted-count look)
so both templates share one style instead of location's old inline `style="opacity:.55"`.

### Verification
No live Eleventy build was possible in this sandbox (same limitation Session 112 hit). Checked
tag balance instead: `soldier.njk` — 140 `{% if %}` / 140 `{% endif %}`, 55 `{% for %}` / 55
`{% endfor %}`; `location.njk` — 64/64 and 21/21. Both balanced. **Still needs an eyeball check on
a real build** — try a heavily-documented profile and a near-empty stub, since this touches the
shared layout for all soldiers and all locations, not just one profile.

Also noticed, not fixed: `soldier.njk` has roughly 6KB of trailing null bytes after the closing
`</html>` tag. Harmless (ignored by browsers/Eleventy) and pre-existing — not something this
session's edits introduced. Flagged in case it's worth a cleanup pass sometime.

### Skipper Stories → soldier slug — scoped, not built
Michael asked whether Skipper Stories should become a soldier-profile tab, with an eye on a
longer-term "book spine" project that would want everything related to a soldier pulled together
in one place. Investigated the actual data path rather than guessing:

- Skipper Stories don't go through the same pipeline as Letters/Documents/Anecdotes — there's no
  `contains:` tagging at all. Submissions are self-reported (name, email, phone, platoon, years,
  response, publication preference) and land **directly** in R2, bypassing the `_intake/raw/`
  review flow every other content type uses.
- Bucket: `angryskipperarchive-submissions`. Keys: `submissions/skipper-stories/pending/{id}.json`,
  moved to `submissions/skipper-stories/published/{id}.json` on admin approval (see
  `admin/lib/feedback.js`, which already lists/approves/withdraws stories with this exact
  pattern — same `@aws-sdk/client-s3` + `admin/.env` credential setup as `backfill-r2.js`).
- Concluded a public tab isn't advisable yet: two of the three publication choices are "anonymous"
  and "archive use only." Auto-linking a self-reported name to a roster slug risks publicly
  deanonymizing someone who explicitly opted out of that.
- Agreed design for whenever this is worth building: a script pulls both `pending/` and
  `published/` prefixes, Michael hand-maps each story to a soldier slug, and the output splits in
  two — the raw pull (real name/email/phone, present on every story regardless of publication
  choice) goes into `_private/` (mirrors the existing gitignored `_private/contacts.json`
  pattern), while a slim public-safe index (`story_id` → `soldier_slug`) is the only thing safe to
  track in the repo. **Key the index by `story_id`, not the R2 key/URL** — the key itself moves
  from `pending/` to `published/` on approval, so a URL-keyed mapping would orphan itself the
  moment a story gets approved. `story_id` is stable across that whole lifecycle and is already
  the durable public identifier used in the removal-request flow (`/request/?type=removal&story=`).
- **Michael's call: not enough volume right now to be worth building.** Explicitly deferred, not
  urgent. Parked here so the design doesn't have to be re-derived when it does become worth doing.

### Garvin/Spingath/Monteleone photo attribution — raised, not investigated
Michael mentioned the Session 112-flagged Garvin photo-attribution question "doesn't seem to be as
bad as I thought it might be," then chose to look at it next session rather than dig in now. No
files were opened this session — starting fresh next time, not picking up a half-finished
investigation.

---

## What's still on the table

### Next session's stated goal (why this handoff exists)
Michael wants to revisit the **Garvin/Spingath/Monteleone photo attribution** question — whether
tagging `photographer: garvin-jim` on all ~70 of his entries overclaims, given he was company
historian and likely received many photos he didn't personally take (see Session 112's handoff for
the original context: `soldiers/garvin-jim/photos/**`, `soldiers/spingath-dave/photos/field/
index.md`, `soldiers/monteleone-gary/photos/field/index.md`). Michael now suspects it's less severe
than he originally thought — worth starting by actually reading the captions/sources/credit fields
on those entries to see how many are genuinely ambiguous versus distinguishable, rather than
re-litigating the question in the abstract.

### Unresolved / flagged, not this session's job to fix
1. **`colburn-richard.md` and `stannard-john.md`** — permanent truncated-text data loss from
   Session 112, YAML closed but the missing sentences are gone. Still no recovery source.
2. **martin-michael's `platoon: Range` field** still contradicts his own event tagging as Skull
   Platoon leader (Session 112). Needs a real look at his stub.
3. **kutter-wolf's CO tenure end date** unconfirmed past 2 Dec 71; **whether SGT Steve Kahnke
   needs a stub built** (Session 112, both still open).
4. **Skipper Stories → soldier slug index** — parked per above. Revisit once submission volume
   grows enough to matter; design is ready to go when it is.
5. **Full production build never completed inside this sandbox** — carried forward from Session
   112, now also applies to this session's tab-count changes to `soldier.njk` and `location.njk`.

---

## Key file locations

| Item | Path |
|---|---|
| Soldier profile tab counts (this session) | `site/_includes/layouts/soldier.njk` |
| Location profile tab counts + always-visible tabs (this session) | `site/_includes/layouts/location.njk` |
| Shared tab-count style (new) | `site/assets/css/main.css` — `.tab-count` |
| Skipper Stories submission form | `site/skipper-stories/index.njk`, `site/assets/js/skipper-stories.js` |
| Skipper Stories admin review (list/approve/withdraw) | `admin/lib/feedback.js` |
| R2 credentials for any future Skipper Stories script | `admin/.env` (`R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY`) |
| Precedent for a private slug-keyed index (mirror this pattern) | `_private/contacts.json` (gitignored) |
| Existing R2 pull pattern to reuse | `admin/lib/submissions.js`, `admin/scripts/backfill-r2.js` |
| Garvin/Spingath/Monteleone photos (next session's target) | `site/soldiers/garvin-jim/photos/**`, `site/soldiers/spingath-dave/photos/field/index.md`, `site/soldiers/monteleone-gary/photos/field/index.md` |

---

## Carried-forward warnings

- **A full `eleventy` build still could not be completed inside this session's sandbox** — same
  hard-cap/background-process issue noted in Session 112. This session's tab-count changes are
  verified by template tag-balance only, not a rendered page. Worth checking a few profiles of
  different completeness (heavily documented and near-stub) after the next real build.
- **This mount will not allow file deletion** (Session 112 finding, unchanged).
- **Garvin's photo attribution model is still an open question, not yet re-examined this
  session.** Michael's "doesn't seem as bad as I thought" comment is a lead worth following up on
  directly next time, not a signal to close the question without looking.
- **McGrew is a living contributor actively reviewing his profile** (Session 112) — this session's
  template changes affect his profile's tab bar along with everyone else's, so the same care/
  verification bar applies.
