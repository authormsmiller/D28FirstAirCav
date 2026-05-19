# Public Forms — Design Spec
**Session:** May 18, 2026  
**Status:** Design complete. Wireframes complete — see `wireframes-public-forms.html`.

---

## Guiding Principle

Forms are conversation starters, not processing workflows. The goal is the lowest possible barrier to submission from an audience that is primarily veterans and family members in their mid-to-late 70s. Every form should be completable in under a minute. Nothing takes ten minutes.

---

## Site Entry Points

Three public-facing form surfaces:

- `/contribute/` — someone has materials to add (photos, documents, memories)
- `/request/` (or a section on `/families/`) — everything else: corrections, contact requests, add a missing soldier, bug reports, takedowns, general messages
- `/families/` — links to Request a Profile, which is handled by the Request form (Add Something type)

---

## 1. Contribute

### Entry point
A type selector at the top of the page: **Documents** or **Photos**. Opens a modal flow for each. Both flows share the same field structure and backend mechanics.

### Shared fields (both flows)
| Field | Notes |
|---|---|
| Your name | Required |
| How to reach you | One freeform field — phone or email, their choice. No format enforcement. |
| Soldier's name | Required. Used to name the R2 folder. |
| Permission to share | Dropdown: *Yes — with my name / Yes — anonymously / No — research use only*. Conditional reason text box appears for "research only." |

### Documents path
| Field | Notes |
|---|---|
| Upload files | Drag/drop + large "Choose Files" button. Covers digital files and phone-photographed documents (mobile file picker opens camera/photos natively — no separate flow needed). |
| Or share a Drive link | Secondary option. Helper text: *"Make sure your link is set to 'Anyone with the link can view.'"* Link is written to metadata.json; Michael downloads manually during processing. |
| Anything you want us to know | Optional. One line. |
| Provenance | Checkbox: *"I have the right to share this material."* |

### Photos path
| Field | Notes |
|---|---|
| Upload files | Drag/drop + large "Choose Files" button. Mobile triggers camera/photo library. |
| Tell us what you know | Optional text field. Captions, cutlines, soldier IDs if known. Small batches (1–2 photos) may include full cutlines here. |
| Provenance | Checkbox: *"I have the right to share this material."* |

Batch size rails: soft limit with a helpful message when limit is reached. No hard block. Client-side splitting handles large batches automatically (see Session Mechanics below).

### Session mechanics
The contribute form maintains state in `localStorage` so multi-batch submissions (e.g., photographing a 200-photo album across two evenings) append to the same R2 folder.

**localStorage keys:**
```
d28_contrib_folder_id     — R2 folder path for this submission
d28_contrib_email_sent    — boolean, prevents duplicate thank-you emails
d28_contrib_name          — pre-fills name field on return
d28_contrib_contact       — pre-fills contact field on return
d28_contrib_soldier       — pre-fills soldier name on return
```

**On page load:**
1. Check `localStorage` for `folder_id`
2. If found → ping `GET /submit/check?folder=[id]` to verify folder still exists in R2
3. If folder is gone (processed by admin) → clear localStorage, start fresh
4. If folder exists → pre-fill fields, show *"You're continuing your submission for [soldier name]"* state at top of form

**Submit & Continue:**
- First submit → Worker creates new R2 folder → stores `folder_id` in localStorage → sends thank-you email → sets `email_sent: true`
- Subsequent submits → Worker appends to existing folder → no email

**Thank-you email:**
- Fires once on first submit (`email_sent` flag prevents repeats)
- Confirms receipt, names the soldier
- Includes continuation link: `https://angryskipperarchive.org/contribute/?c=[folder-id]`
- Continuation link handler reads `?c=` param, validates folder exists, sets localStorage — enables cross-device continuation (e.g., photographed albums on phone, uploading scans on laptop)
- Sets expectation: *"We'll be in touch."*

---

## 2. Request

A single form with a **type selector** at entry. Six types, each with tailored fields. Routes to R2 `requests/` prefix as structured JSON. Notification email to archive address on every submission (these are low-volume, every one matters).

### Type: Correction
Structured to minimize ambiguity. Intentionally puts some lift on the submitter so nothing is left to interpretation.

**Fields:**
1. Record type — Soldier Profile / Event / Document / Roster
2. Which record — typeahead search against live record list (public read-only endpoint)
3. Which field — type-specific dropdown (see sub-levels below) + Other
4. What it should say — text field
5. How do you know? — optional source line (e.g., "DD-214 in hand")

**Correction field sub-levels by record type:**

| Soldier Profile | Event | Document | Roster |
|---|---|---|---|
| Full name | Event name / title | Title | Name spelling |
| Nickname | Date | Date | Rank |
| Rank | Location | Author / source | Platoon |
| MOS | Description | Content error | Other |
| Platoon | Who was involved | Other | |
| Dates in-country | Other | | |
| Hometown | | | |
| Photo caption or ID | | | |
| Other | | | |

Field list is a public-safe subset of `FIELDS_BY_TYPE` / `EDIT_TABS` from the admin tool. When the schema evolves, update both in sync. Status, permalink, and cross-reference array fields (`accounts`, `related_events`) are excluded.

Typeahead in step 2 queries a read-only public version of `GET /api/slugs?type=[type]`.

### Type: Contact Info Request
Someone wants to reach a veteran whose contact info is in the archive.

**Fields:** Your name · How to reach you · Who you're looking for · How you know them

**UI note:** Display inline: *"We hold veteran contact details in restricted access. We'll reach out to your buddy and let him decide if he wants to connect."* Michael acts as intermediary; veteran decides.

### Type: Add Something (Missing Person / Profile Request)
My buddy or father is missing from the archive.

**Fields:** Your name · How to reach you · Name of missing soldier · Your connection to them · Anything else useful

This is the "Request a Profile" flow. Michael follows up with an interview or sends a link to the Contribute form.

### Type: Something is Broken
A link didn't work, a page showed an error.

**Fields:** Your name · How to reach you · Brief description of what happened

**Implementation note:** JavaScript silently captures `document.URL` and `document.referrer` at submit time. Both written to the request JSON automatically. Almost zero lift on the user.

### Type: Privacy / Takedown Request
A family member wants information removed.

**Fields:** Your name · How to reach you · Which record (soldier name or page URL) · What you want removed · Why

**UI note:** Treated with care. Michael handles case by case.

### Type: General Message
Doesn't fit any other category. Also catches appreciation, offers to help, researcher inquiries.

**Fields:** Your name · How to reach you · Message

---

## 3. Cloudflare / R2 Architecture

### R2 bucket structure
```
angryskipperarchive-photos/        — existing, public media
angryskipperarchive-documents/     — existing, public media
angryskipperarchive-submissions/   — new, private
  submissions/
    photos/
      [folder-id]/
        [photo files]
        metadata.json
    documents/
      [folder-id]/
        [document files]
        metadata.json
  requests/
    [timestamp]-[type].json
```

Folder ID format: `[soldier-slug]-[unix-timestamp]`

### metadata.json shape (submissions)
```json
{
  "type": "photos",
  "soldier_name": "Marvin Miller",
  "submitter_name": "Jane Miller",
  "submitter_contact": "jane@example.com or 555-1234",
  "permission": "yes-named",
  "notes": "These are from his first month in-country, early 1971.",
  "provenance_confirmed": true,
  "submitted": "2026-05-18T14:32:00Z",
  "folder_id": "miller-marvin-1716123456",
  "user_id": null
}
```

### request JSON shape (requests/)
Type is encoded in both the filename (`[timestamp]-[type].json`) and as a field inside the JSON body. The body field is the authoritative one — the filename is a convenience for browsing R2 directly.

`type` values: `correction` · `contact` · `add` · `broken` · `privacy` · `general`

**Request priority order** (for admin queue display and triage):

| Priority | Type | Rationale |
|---|---|---|
| 1 | `privacy` | Legal/family sensitivity — act same day |
| 2 | `broken` | Site is actively broken for someone |
| 3 | `correction` | Public record is wrong — affects credibility |
| 4 | `contact` | Someone is waiting on a response |
| 5 | `general` | Open-ended — time-flexible |
| 6 | `add` | No urgency — no one is harmed by the delay |

Admin tool should sort by this priority order by default, then by `submitted` ascending within each tier.

**Staleness escalation:** Any request older than 30 days renders in red regardless of type or priority rank. Calculated client-side from `submitted` vs. current date — no server logic needed. Ensures low-priority items (`add`, `general`) can't age out silently.

Use CSS class `date-limit` for the red state. Todo.json items use the same staleness logic against their `created` field (a `YYYY-MM-DD` date string vs. the ISO timestamp here — both parse cleanly with `new Date()`). Implement as a shared utility so `date-limit` means the same thing in both the requests queue and the todo list view.

**Shared fields (all types):**
```json
{
  "type": "correction",
  "submitted": "2026-05-18T14:32:00Z",
  "submitter_name": "Jane Miller",
  "submitter_contact": "jane@example.com",
  "user_id": null,
  "page_url": null,
  "referrer_url": null
}
```
`page_url` and `referrer_url` are captured silently by JS at submit time for all types (not just "broken") — useful context for corrections and contact requests too.

**Type-specific fields (merged into shared fields above):**

*correction:*
```json
{
  "record_type": "soldier",
  "record_slug": "miller-marvin-dale",
  "field": "hometown",
  "correction": "Kittanning, PA",
  "source": "DD-214 in hand"
}
```

*contact:*
```json
{
  "looking_for": "Tommy Ramirez",
  "relationship": "Served together in Cat Platoon"
}
```

*add:*
```json
{
  "missing_soldier": "Tommy Ramirez",
  "connection": "Son",
  "notes": "SP4, Cat Platoon, approximately 1970"
}
```

*broken:*
```json
{
  "description": "Link to documents tab returned a 404"
}
```
(page_url and referrer_url from shared fields carry the context here)

*privacy:*
```json
{
  "which_record": "miller-marvin-dale",
  "what_to_remove": "Profile photo",
  "reason": "Family request"
}
```

*general:*
```json
{
  "message": "I served with Marvin in Cat Platoon and have some photos."
}
```

### Worker routes to add (site/src/worker.js)
| Route | Purpose |
|---|---|
| `POST /submit/contribute` | Multipart upload → R2. Returns `{ folderId, isNew }`. |
| `GET /submit/check?folder=[id]` | Verify folder exists in SUBMISSIONS. Returns `{ exists }`. |
| `POST /submit/request` | Write request JSON to SUBMISSIONS requests/ prefix. Send notification email. |

### Email
MailChannels (free, native to Cloudflare Workers, no API key). Fires on first contribute submit only. Request form notifications are a separate plain email to the archive address.

### Admin tool bridge
`GET /api/submissions/list` and `GET /api/submissions/download/:folderId` — wrangler shell-out to list and pull submissions from R2 into `_intake/raw/` so they enter the normal photo/document intake pipeline. (Tracked as INFRA-TASK-20260518000068.)

### Build order
1. Fix worker.js asset passthrough (`env.ASSETS.fetch()`) — INFRA-TASK-061
2. Create SUBMISSIONS bucket + add binding to wrangler.jsonc — INFRA-TASK-062, 063
3. Worker routes (064, 065, 066) — build and test with `wrangler dev` before deploying
4. Email (067)
5. Admin pull endpoint (068)

---

## Still To Do

- [x] Modal structure / UI sketch — `wireframes-public-forms.html`
- [x] Update `/families/` copy — remove "takes about ten minutes"
- [x] Request JSON shape fully specced (all 6 types, shared fields, type-specific fields)
- [x] Request priority order defined (`privacy` → `broken` → `correction` → `contact` → `general` → `add`)
- [x] Staleness escalation specced (`date-limit` CSS class, 30-day threshold, shared with todo list view)
- [x] Form touch points inventory — all entry points across site catalogued (SITE-TASK-20260518000069)
- [x] `user_id: null` added to metadata.json shape (future login/auth rails)
- [ ] Contribute page markup and CSS
- [ ] Request page markup and CSS
- [ ] Typeahead endpoint for Correction record lookup
- [ ] Continuation link handler on `/contribute/`
- [ ] Wire form touch points — add ?soldier= and ?type= query string params to existing links (SITE-TASK-20260518000069)
- [ ] Corrections queue → Tab 5 promotion (deferred until site is public — ADMIN-TASK-058)
