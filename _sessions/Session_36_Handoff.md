# Session 36 Handoff — 2026-05-18

## Session Summary
Design and planning session — no code written. Reviewed the open issues list, repaired a corrupted `todo.json`, added a Cloudflare/R2 infrastructure epic, and completed a full design spec for the Contribute and Request public forms.

---

## Completed This Session

### Issues Review

Reviewed `admin/data/todo.json` against the session handoffs. Key finding: **all four Photo Intake Fix List bugs (ADMIN-EPIC-20260518000003) are now complete** — image preview, multi-select, photographer field, subject slug override all resolved in prior sessions.

Open bugs remaining (summary):

**Admin — actionable:**
- `ADMIN-BUG-20260518111112324` — Event data did not propagate to index.md (recent, real)
- `ADMIN-BUG-20260518000022` — Event slug shows `[]` literal in promote form (low, cosmetic)
- `ADMIN-BUG-20260518000031` — UTF-8 em dash mangled in promoted doc title (one-liner fix)
- `ADMIN-BUG-20260518000030` — Admin tool Commit button unreliable (root cause unknown)
- `ADMIN-BUG-20260518000033` — Unit doc Author Slug UI gives no routing signal

**Site — actionable:**
- `SITE-BUG-20260518000025` — Lightbox opens wrong photo with two galleries (`loop.index0` resets)
- `SITE-BUG-20260518000029` — Lightbox not firing for newly promoted photos
- `SITE-BUG-20260518000027` — marvin-miller-selfie filename mismatch (.jpeg vs .jpg)
- `SITE-BUG-20260518000028` — Documents tab rendering issue (pre-Phase 4, re-verify after Phase 5)

**Site — parked by design:**
- `SITE-BUG-20260518000026` — Profile hero photo uses `/soldiers/` path not R2 (Phase 5)

### todo.json Repair

File was truncated mid-item (`ADMIN-TASK-20260518134908541` cut off — content unrecoverable). Fixed by closing the JSON at the last complete item. The truncated task was dropped. If you remember what it was, re-add manually.

### New Tasks Added to todo.json

| ID | Title |
|---|---|
| `DATA-TASK-20260518000057` | Audit and normalize `event: []` across all records (low priority, fix on sight) |
| `ADMIN-TASK-20260518000058` | Corrections queue — R2 to Tab 5 promotion flow (deferred until site is public) |
| `INFRA-EPIC-20260518000060` | Cloudflare / R2 — Form Submission Infrastructure |
| `INFRA-TASK-20260518000061` | Fix worker.js asset passthrough — replace hardcoded Pages URL with `env.ASSETS.fetch()` |
| `INFRA-TASK-20260518000062` | Create R2 bucket — `angryskipperarchive-submissions` |
| `INFRA-TASK-20260518000063` | Add SUBMISSIONS R2 binding to wrangler.jsonc |
| `INFRA-TASK-20260518000064` | Worker — `POST /submit/contribute` (file upload to R2) |
| `INFRA-TASK-20260518000065` | Worker — `GET /submit/check?folder=[id]` (folder existence check) |
| `INFRA-TASK-20260518000066` | Worker — `POST /submit/request` (Request form → R2 JSON) |
| `INFRA-TASK-20260518000067` | Set up email sending — thank-you + continuation link (MailChannels) |
| `INFRA-TASK-20260518000068` | Admin tool — R2 submissions pull endpoint (list + download to `_intake/raw/`) |

### Design Spec Written

Full spec at `site/_docs/design-public-forms.md`. Covers everything below. Read that file rather than re-deriving from this handoff.

---

## Public Forms — Design Decisions

### Guiding principle
Forms are conversation starters. Audience is primarily veterans and family members in their 70s. Every form completable under a minute. Nothing takes ten minutes. KISS above all.

### Contribute — entry point
Type selector: **Documents** or **Photos**. Modal flow for each. Both share the same R2/localStorage/email mechanics.

### Shared fields (both Contribute flows)
Your name · How to reach you (one freeform field, phone or email) · Soldier's name · Permission to share dropdown (Yes named / Yes anonymous / No research only + conditional reason box)

### Documents path
Upload files (drag/drop + Choose Files button) OR Share a Drive link · Anything you want us to know (optional) · Provenance checkbox

*Note: phone-photographed documents and digital files are the same flow — mobile file picker handles the distinction natively. No separate flow needed.*

### Photos path
Upload files · Tell us what you know (optional — captions, cutlines, soldier IDs for small batches) · Provenance checkbox

*Batch size rails: soft limit with helpful message. Client-side splitting handles large batches. Submit & Continue appends to R2 folder.*

### Session mechanics (both Contribute flows)
- `localStorage` stores folder ID, pre-fill fields, email-sent flag
- On load: check localStorage → ping `GET /submit/check` → pre-fill or start fresh (if folder processed)
- Thank-you email fires once (flag in localStorage), includes continuation link encoding folder ID
- Continuation link (`?c=[folder-id]`) sets localStorage on any device — enables cross-device batching

### Request form — six types
1. **Correction** — structured dropdowns: record type → typeahead record search → field (type-specific list) → what it should say → optional source. Field lists are public-safe subset of admin tool's `FIELDS_BY_TYPE`. See spec for full field lists per type.
2. **Contact Info Request** — find a buddy. UI note: sets expectation that Michael acts as intermediary, veteran decides whether to connect.
3. **Add Something** — missing soldier / profile request. Michael follows up.
4. **Something is Broken** — bug report. JS auto-captures current URL and referrer silently.
5. **Privacy / Takedown Request** — handled case by case.
6. **General Message** — catch-all.

All Request submissions write structured JSON to R2 `requests/` prefix. Notification email to archive address on every submission.

### Cloudflare / R2 infrastructure
- New bucket: `angryskipperarchive-submissions` (private)
- R2 structure: `submissions/photos/[folder-id]/`, `submissions/documents/[folder-id]/`, `requests/[timestamp]-[type].json`
- Folder ID format: `[soldier-slug]-[unix-timestamp]`
- Three new worker routes: `POST /submit/contribute`, `GET /submit/check`, `POST /submit/request`
- Email: MailChannels (free, no API key, native to Cloudflare Workers)
- Build order: 061 (passthrough fix) → 062+063 (bucket) → 064+065+066 (routes) → 067 (email) → 068 (admin pull)

---

## Next Session

**Start here: modal structure wireframes for Contribute and Request.**

Read `site/_docs/design-public-forms.md` first — full spec is there. This session ended before the wireframe/sketch phase; everything is designed and ready to sketch.

Wireframes needed:
- Contribute landing (type selector)
- Contribute — Documents modal flow
- Contribute — Photos modal flow (including Submit & Continue state)
- Request landing (type selector)
- Request — Correction flow (the most complex, structured dropdowns)
- Request — remaining five types (simpler, may share a template)

Also carry forward from this session:
- Update `/families/` copy — remove "takes about ten minutes" (conversion killer for this audience)

---

## Key Files Changed This Session

| File | Change |
|---|---|
| `admin/data/todo.json` | Repaired truncation; added 11 new tasks |
| `site/_docs/design-public-forms.md` | Created — full public forms design spec |
| `_sessions/Session_36_Handoff.md` | This file |
