# Session 47 Handoff — d281staircav

**Date:** 2026-05-27
**Branch:** `admin/2026-05-22` (continuing)
**Repo:** `https://github.com/authormsmiller/d281staircav`
**Deploy:** `npx wrangler deploy` from `site/`. Push via GitHub Desktop only — terminal pushes fail (msm-illumia account lacks push access to authormsmiller/d281staircav).

---

## What Was Completed This Session

### Survey System Build — Admin Panel + Backend

This session's primary focus was building out the full survey intake workflow: form rendering, submission handling, admin review, and draft generation.

**Survey config schema** (`site/_data/surveys/[event-slug].json`)
- Fields: `event`, `title`, `intro`, `sections[]` with `title`, `description`, `questions[]`
- Each question: `id`, `label`, `type` (`text` | `textarea` | `checkbox` | `radio`), `required`, `placeholder`, optional `options[]`
- Contact block appended automatically; not defined per-survey

**4/20 survey config written** — `site/_data/surveys/contact-fsb-fontaine-1971-04-20.json`
- Three sections: "Your Service," "The April 20 Engagement," "Anything Else"
- Questions cover unit assignment, role, platoon, location during contact, what they saw/heard, casualties, specific named individuals, the three KIA recovery, and open narrative

**Worker endpoint** — `POST /submit/account` added to `workers/functions/submit/account.js`
- Receives survey form submission, writes to R2 at `submissions/accounts/[event-slug]/[timestamp]-[nanoid].json`
- Responds JSON `{ ok: true, key }` on success

**Survey modal renderer** (`site/assets/js/survey.js`)
- Fetches `/_data/surveys/[event-slug].json` lazily on trigger
- Renders form with section grouping, all input types, required validation
- POST to `/submit/account`; shows confirmation on success

**Survey modal CSS** (`site/assets/css/main.css`)
- `.survey-modal`, `.survey-form`, `.survey-section`, `.survey-field`, input/textarea/button styles
- Mobile-responsive; blends with site's existing aesthetic

**Survey trigger wired into event template** (`site/_includes/layouts/event.njk`)
- "Share What You Know" button renders if `surveys[slug]` exists in `_data`
- Trigger passes event slug to modal renderer

---

### Site Feedback Admin Tab — Implemented

New "Site Feedback" tab in `admin/index.html` with three subtabs: Requests, Survey Responses, Document Contributions.

**Backend routes** (`admin/lib/feedback.js`, registered in `admin/server.js`)
- `GET /api/feedback/requests` — lists `submissions/requests/` keys from R2
- `GET /api/feedback/accounts` — lists `submissions/accounts/` keys from R2
- `GET /api/feedback/documents` — lists `submissions/documents/` keys from R2
- `GET /api/feedback/item?key=[key]` — fetches and parses a single submission JSON from R2
- `POST /api/feedback/create-draft/account` — generates a Q&A markdown draft (see below)
- `DELETE /api/feedback/discard?key=[key]` — deletes a submission from R2

**Admin panel tab** — `switchTab('feedback')` wired; `loadFeedbackCounts()` called on `DOMContentLoaded`
- Subtabs: Requests / Survey Responses / Documents, each with toolbar and list div
- `FB = { loaded: {...}, accountItems: {} }` tracks lazy-load state

**Survey response cards** — action buttons in card header (not bottom, which was cut off and unscrollable)
- Buttons: "Create Draft" / "Pull to _intake" / "Discard"

---

### Create Draft Workflow — Implemented

**Route:** `POST /api/feedback/create-draft/account`

**Behavior:**
- Derives `soldierSlug` from submitted `soldier_name` (`[lastname]-[firstname]`)
- Derives `accountSlug` from `soldierSlug` + event date (`[soldierSlug]-account-[MMDDYY]`)
- Writes to `site/documents/[soldierSlug]/[accountSlug]/[accountSlug].md`
- Returns 409 if file already exists
- Front matter: `layout: layouts/document.njk`, `status: draft`, `type: account`, `event: [event-slug]`, `contains: [soldierSlug]`
- Body: Q&A markdown — section headers, bolded questions, answer text, blockquotes for follow-up questions

**Narrative workflow decision (session):** Survey responses are not auto-published. Workflow is:
1. Respondent submits survey via site modal
2. Admin reviews in feedback tab
3. "Create Draft" generates structured Q&A file
4. Michael brings draft into a Claude session to craft a narrative collaboratively
5. Draft returned to respondent for review/approval
6. Published after respondent sign-off

Human-in-the-loop at every stage. No automated AI generation to site.

---

### Server Fixes

**`admin/server.js`** — dotenv path fix
- Changed `import 'dotenv/config'` (uses `process.cwd()`) to `dotenv.config({ path: path.join(__dirname, '.env') })`
- Problem: running `node admin/server.js` from repo root looked for `.env` at repo root, not `admin/.env`
- Fix ensures credentials load regardless of working directory at startup

---

### Event Location Support — Multi-Point Schema

**New `locations` array schema** for events with multiple significant points, in addition to the existing scalar `lat`/`lon` pattern.

```yaml
locations:
  - label: "Label Text"
    lat: 10.000000
    lon: 107.000000
    note: "Contextual note"
location_precision: "Narrative precision statement"
```

**`site/_includes/layouts/event.njk`** — updated to render `locations` array if present, fall back to scalar `lat`/`lon`
- Renders labeled Google Maps deep-links per point
- Shows `location_precision` note below
- Fallback handles all existing scalar-coordinate events

**`site/assets/css/main.css`** — new classes added:
- `.evt-map-points` — flex column container, 6px gap
- `.evt-map-point-link` — Space Grotesk 12px, yellow, flex row (label + arrow)
- `.evt-map-point-label` — flex:1
- `.evt-map-point-arrow` — 11px, 0.6 opacity
- Consistent with existing `.evt-map-link` and `.evt-coords-note`

**`site/events/contact-fsb-fontaine-1971-04-20/index.md`**
- Three coordinate points added along Suối Tầm Bông, Long Khanh Province:
  - Stream Crossover / CP Line: 10.850200, 107.560471
  - Medevac LZ (South Bank): 10.847500, 107.560471
  - NVA Bunker Complex / Ambush Site: 10.850600, 107.564500
- All ~300m precision; established via satellite imagery cross-referenced with Neal's account
- `oq-03` resolved with revised three-point methodology (initial single estimate corrected)
- `archivist_notes.location_research` updated

**⚠️ Coordinates currently held as `locations_draft`** — not published. See note below.

---

### Open Question Added — FSB Naming (oq-07)

Added `oq-07` (private) to `contact-fsb-fontaine-1971-04-20`:

> What was the fire support base actually called on April 20, 1971? Both Neal and Bacon use "FSB Fanning" retrospectively. McGrew's calendar — kept in real time — places a CA to "Fontaine" on April 23, lending that name stronger authority. One possibility: if the base was unnamed or informally designated on April 20, Neal may have used the next official name associated with the location (Fanning), and Bacon may have followed. Unresolved. A veteran present in April 1971 could confirm.

---

## Design Decisions Made This Session

### Location Coordinates — Do Not Treat as Authoritative

A Gemini-assisted re-anchoring from Bacon's account produced a second coordinate set (~20km north, ~25km west of the Suối Tầm Bông points) using a "5 clicks due north from FSB Fanning" projection methodology. This was rejected for the following reasons:
- Bacon's account already flagged as unreliable for geography (retrospective slip on FSB name)
- "Due north" projection assumes straight-line patrol movement — patrols don't move that way
- The methodology stacks three unverified assumptions, compounding error
- Gemini introduced unverified facts (33rd NVA Regiment designation, Vollmar stream crossing) not present in the source documents
- McGrew's contemporaneous record is more reliable than either Neal's or Bacon's retrospective accounts

**Current state:** Three Suối Tầm Bông points preserved in `locations_draft` (not rendered). Publishing should wait until a NARA source (battalion logs, after-action report with grid coordinates from radio traffic) can verify or refine. The ±300m estimate is honest; the conceptual location (Suối Tầm Bông, Long Khanh Province, ~1–2km from the FSB) is well-supported by Neal's account.

### Source Hierarchy (Established)

For the April 20–23 engagement:
1. McGrew's calendar — contemporaneous, highest authority on dates/locations
2. Neal's account — first-person, but retrospective; contested on some tactical details
3. Dillon's account — first-person, retrospective
4. Bacon's account — command perspective, retrospective; known naming slip; use with caution
5. Davis's account — published version edits out contested material; archived unredacted version preserved

---

## Pending Work

### Immediate (Next Session)

- **Build and deploy** — `npm run build` + `npx wrangler deploy` from `site/` to publish CSS and template changes for location display
- **10/21 Makowski survey config** — `site/_data/surveys/contact-nui-ba-1971-10-21.json` not yet written
- **`locations_draft` → `locations`** on the 4/20 event once coordinates are verified via NARA or veteran confirmation

### Carry-Forward (From Sessions 43–46)

1. **`git rm --cached`** — remove committed photo binaries from git tracking (command in Session 43 handoff)
2. **Lightbox index offset** (`SITE-BUG-20260518000025`) — flat index map needed
3. **Event slug `[]` literal bug** (`ADMIN-BUG-20260518000022`)
4. **Fuzzy match scorer** (`ADMIN-BUG-20260518000024`) — Levenshtein needed
5. **Missing soldier stubs** — caruthers-tom, kinsey-charles, ryneska-john, kahnke-steve, martin-michael, mcgrew-harold, bedsole-jim, louisell
6. **Tab 5 (Todo/Flags)** — fully spec'd in Session 32 handoff, not yet built
7. **Email sending** (`INFRA-TASK-20260518000067`) — thank-you + continuation link via MailChannels/Resend
8. **Event data not propagating to index.md** (`ADMIN-BUG-20260518111112324`)
9. **davis-kirk** — full canonical template migration still needed
10. **jeffries-gabriel** — Full KIA profile build. WO1, co-pilot, killed 24 Apr 1971. VHPA: `https://www.vhpa.org/KIA/incident/710424101ACD.HTM`
11. **W.J. Brooks stub** — 27th Maintenance Battalion, survived FSB Fontaine crash. No profile exists.
12. **Fanning profile photo** — formal Army dress portrait (B&W) still pending
13. **Per-item download buttons** — Tier 1 Keepsakes foundation
14. **"Show Sources" toggle** — body class + localStorage; two-hour job, high UX impact
15. **Keepsakes nav button + families page redesign** — see `Keepsakes_Feature_Design.md`
16. **Curation request form type** — extend `/request/index.njk`

### Data Cleanup

- Normalize `departed` date format on `jeffries-gabriel` and `makowski-william`
- Groups 3 & 4 soldier migrations (hurst-style + miller contact-block) still pending from Session 44

### Remaining Migration Targets

| Slug | Notes |
|---|---|
| fishell-larry | nickname: Pops |
| fults-john | nickname: Peanut |
| guidara-frank | |
| hall-joseph | |
| harrington-william | |
| hilts-doug | |
| **jeffries-gabriel** | **Priority — full KIA build** |
| kint-joe | |
| marr-bill | |
| neal-bill | |
| rosenberg-kenneth | |
| sargent-stan | |
| schneck-steve | |
| small-bill | |
| **stanfield-nathan** | On crash flight as door gunner; survived |
| vitucci-stephen | |
| vollmar-tom | Do not create until oq-05 resolved |

---

## Architecture Notes

**CRLF** — repo built on Windows, all files use `\r\n`.

**R2 key format** — `soldiers/[slug]/[subfolder]/[filename]` (no `photos/` segment). Served at `/media/photos/soldiers/[slug]/[subfolder]/[filename]`.

**Event photos** — stored flat at `soldiers/[credit_slug]/field/events/[filename]` (no event-slug subfolder). Use explicit `src:` field in event index.md rather than relying on template path construction.

**Photo pipeline** — files go to `_intake/raw/photos/[Name-MMDDYY-HHMMSS]/`, staged via admin UI, flushed to R2 + index.md. WebP fully supported.

**Deployment** — `npx wrangler deploy` from `site/`. Push via GitHub Desktop only.

**Admin server** — `npm start` from `admin/`. Requires `.env` with `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `CLOUDFLARE_ACCOUNT_ID`.

**R2 buckets:**
- `angryskipperarchive-photos` — public media, served at `/media/photos/`
- `angryskipperarchive-documents` — documents
- `angryskipperarchive-submissions` — public form submissions, private

**`_private/contacts.json`** — gitignored; holds phone/email/address for living contacts. NEVER commit PII to .md files. Army-era service IDs are real SSNs — do not publish in any field.

**Survey submissions** — stored in `submissions/accounts/[event-slug]/[timestamp]-[nanoid].json`. Contact fields (email, phone) are private and never published. Create Draft workflow is the handoff artifact for narrative development.
