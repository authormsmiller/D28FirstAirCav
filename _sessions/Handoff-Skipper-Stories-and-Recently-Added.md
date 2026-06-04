# Handoff — Skipper Stories Feature + Recently Added Panel

**Date:** 2026-05-29
**Branch:** `admin/2026-05-22` (continuing)
**Repo:** `https://github.com/authormsmiller/d281staircav`
**Deploy:** `npm run build` from `site/`, then `npx wrangler deploy` from `site/`. Push via GitHub Desktop only.

---

## What Was Built This Session

### Skipper Stories — Full Implementation

Everything in the previous handoff (`Handoff-Writing-Prompts-Feature.md`) was built from scratch. All items are complete.

**Files created or modified:**

| File | What changed |
|---|---|
| `site/_data/skipperStories.json` | 7 tabs, 44 prompts — the full prompt config |
| `site/skipper-stories/index.njk` | Page with tabs, prompt cards, submission modal |
| `site/assets/js/skipper-stories.js` | Tab switching, modal, submission POST, client-side story load from R2, "Share your version" viral mechanic, deep-link support via `?prompt=&tab=` params |
| `site/assets/css/main.css` | Skipper Stories visual register appended |
| `site/src/worker.js` | `POST /submit/skipper-story`, `GET /api/skipper-stories/published`, nightly cron handler |
| `site/wrangler.jsonc` | Cron trigger `"1 0 * * *"` added |
| `site/_includes/partials/masthead.njk` | Skipper Stories added to main nav and mobile drawer |

**How the submission flow works:**
- Veteran clicks "Share your answer" → modal opens with the prompt displayed
- On submit, payload goes to `POST /submit/skipper-story` → written to R2 at `submissions/skipper-stories/pending/[timestamp]-[nanoid].json`
- Admin gets an email notification immediately
- Nightly cron at 00:01 promotes all unflagged pending stories to `submissions/skipper-stories/published/`
- Published stories load client-side at page load from `GET /api/skipper-stories/published?tab=[tab-id]`
- Each story card has a "Share your version" button (pre-selects same prompt) and a "Request removal" link

**How prompt identity is stored:**
- Each submission carries `prompt_id`, `prompt_text`, `tab_id`, `tab_label` directly in the JSON — no separate lookup table
- The page groups published stories by `prompt_id`, so readers see clusters of responses to the same question
- `tab_id` is used for the tab filter on the API endpoint

**Removal flow:**
- Confirmation screen on submit includes `/request/?type=removal&story=[story-id]` — the submitter has the link before the story goes live
- The `removal` type was added to the `/request/` page — it pre-fills the story ID from the `?story=` query param
- The request page already handles this; no separate UI needed

### Outgoing Emails — Wired

The `handleContribute` function had a comment saying email was "wired in INFRA-TASK-067" but was never implemented. This session wired it. All three submission types now send admin notification emails:

| Endpoint | Email function | Status before | Status after |
|---|---|---|---|
| `POST /submit/request` | `sendNotificationEmail` | ✓ Already working | ✓ |
| `POST /submit/account` | `sendAccountNotificationEmail` | ✓ Already working | ✓ |
| `POST /submit/contribute` | `sendContributeNotificationEmail` | ✗ Comment only | ✓ Now wired |
| `POST /submit/skipper-story` | `sendSkipperStoryNotificationEmail` | N/A (new) | ✓ |

### Admin Panel — Skipper Stories Subtab

- New "Skipper Stories" subtab added to Site Feedback in `admin/index.html`
- Shows all pending stories with **Approve** (promote immediately to published), **Hold** (flag to prevent auto-publish), **Discard** (delete from R2)
- Badge rollup updated to include story count
- Backend routes added to `admin/lib/feedback.js`:
  - `GET /api/feedback/stories` — list pending
  - `POST /api/feedback/stories/approve` — move to published
  - `POST /api/feedback/stories/hold` — toggle held status
  - `POST /api/feedback/stories/discard` — delete

### Recently Added Panel — Homepage

The old "Recent Profiles" single-card side panel on the homepage was replaced with a "Recently Added" panel surfacing three content types:

1. **Stories** — most recent 2 published Skipper Stories, loaded client-side from R2. Hidden until stories exist. Links to the relevant tab on the Skipper Stories page.
2. **Profiles** — 3 most recently added soldier profiles, sorted by `date_added` field, newest first.
3. **Contact Info on File** — soldiers where `share_contact: true`, sorted by `date_added`. Shows "✉ Contact info now available — request via archive." Hidden entirely until at least one veteran has `share_contact: true`. This is a signal to other veterans that a buddy is now reachable.

**New front matter field: `date_added`**
All existing soldier profiles have `date_added` populated from prior sessions (mostly `2026-05-27`, a few `2026-05-28`). New profiles should include this field.

**New Eleventy filters added to `.eleventy.js`:**
- `sortByData(key)` — sort a collection by a data field, descending, blanks last. Handles Date objects and strings.
- `whereData(key, value)` — filter a collection to items where a data field equals a value.
- `isoDate` — format a date value (string or JS Date object) as "May 27, 2026" for display.

**Known build issue — EPERM on assets:**
The `addPassthroughCopy("assets")` call was failing on Windows with an EPERM error on `1cav-patch.png` whenever the browser was holding the file open. It has been disabled. Assets are no longer auto-copied during builds. To sync assets manually when they change:
```
xcopy /E /Y assets _site\assets
```
This is only needed when CSS, JS, or image files in `assets/` change. Template-only changes build cleanly without it.

---

## Next Session: Chinook Crash Profiles

The goal is to add new soldier profiles for the passengers aboard UH-1H 69-15692 (the April 24, 1971 crash at FSB Fontaine) and confirm that the new profiles surface correctly in the Recently Added panel.

### What the event record already has

The crash is fully documented at `site/events/crash-fsb-fontaine-1971-04-24/index.md`. Do not recreate it. The VHPA incident report is at `site/documents/unit/vhpa-042471-report/vhpa-042471-report.md`.

**Profiles that already exist:**
- `fanning-martin` — CPT Martin Vincent Fanning, pilot, KIA
- `jeffries-gabriel` — WO1 Gabriel Augustus Jeffries Jr., co-pilot, KIA
- `colburn-richard` — SGT Richard Eugene Colburn, passenger, KIA
- `stanfield-nathan` — Nathan Stanfield, door gunner, WIA — stub exists but is largely empty (no rank, MOS, dates, or hometown confirmed)

**Profiles that do not yet exist (from VHPA record):**

All seven passengers survived. The VHPA record names:

| Rank | Name | Role | Notes |
|---|---|---|---|
| E4 | L.O. Olds | Crew Chief | Survived injured; instructed Castillo to extinguish engine fire |
| E4 | J.T. Pugh | Passenger | Survived injured |
| E5 | K.R. Capps | Passenger | Survived injured |
| E3 | T.A. Sukup | Passenger | Survived injured |
| E4 | C. Castillo | Passenger (listed as PFC in narrative) | Survived; was first out of aircraft; extinguished engine fire on crew chief's instruction |
| E5 | W.J. Brooks | Passenger | Survived injured |
| O2 | C.J. McCoy | Passenger | Survived injured; his son Dusty McCoy posted on Colburn's Facebook memorial on the 53rd anniversary (April 24, 2024) identifying his father as a surviving passenger — living contact thread |

**Stanfield profile cleanup needed:**
Nathan Stanfield is listed as E3 in the VHPA record. His role was door gunner. He survived injured. His profile stub (`stanfield-nathan`) exists but has no rank, MOS, dates, or other details filled in. This should be completed at the same time new profiles are added.

### Notes on the VHPA names

The VHPA record provides rank and last name or initial only for most passengers (e.g. "E4 J.T. Pugh"). Full names are not available from the VHPA record alone. NARA requests or family contact would be needed for full names. Add profiles using what is known; leave fields blank rather than guessing. The `status` field for all survivors should be set to `researching` or `living` as appropriate.

### What "surfacing in the feed" means

After adding a new profile with a current `date_added` (today's date), rebuild the site. The new profile should appear in the **Profiles** section of the Recently Added panel on the homepage, ahead of the older profiles. This confirms the `sortByData("date_added")` filter is working and that new additions surface automatically.

### Slug convention

Follow existing pattern: `[lastname]-[firstname]` or `[lastname]-[initials]` if full name is unknown. Examples:
- `pugh-jt` (if only initials known)
- `castillo-c`
- `mccoy-cj`
- `olds-lo`

---

## Open Items Not Addressed This Session

- Seed data for Skipper Stories page (1–2 curated stories per tab from existing archive material before launch). See `Handoff-Writing-Prompts-Feature.md` for the suggested seed content.
- Admin panel: soldier slug tagging on approved stories (post-submission archivist connection to soldier records). Noted in the original spec but deferred.
- The `date_added` field on the `_template.md` for soldiers should be added as a commented field so future profiles include it by default.
- All items from prior session pending lists remain open. See `Session_47_Handoff.md` and `Session_48_Handoff.md`.
