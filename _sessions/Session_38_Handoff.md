# Session 38 Handoff — 2026-05-19

## Session Summary
Build session — all public form infrastructure completed and tested end-to-end. Cloudflare Email Routing wired to Gmail. Contribute form and Request form both live. Submissions R2 bucket created and confirmed working. Admin pull endpoint built and tested with a real submission (Jim Garvin photos). First live photo batch processed through the new pipeline.

---

## Development Environment

**Local on Windows.**

**Repo:** `https://github.com/authormsmiller/d281staircav`
**Working branch:** `admin/2026-05-18`

**To start a session:**
1. Open GitHub Desktop — confirm branch is `admin/2026-05-18`
2. Open repo in VS Code
3. Terminal 1: `cd admin && npm start` (admin tool at `localhost:3001`)
4. Terminal 2: `cd site && npx @11ty/eleventy --serve` (site preview at `localhost:8080`)

**Deploy (from `site/` in PowerShell):**
```powershell
Remove-Item -Recurse -Force _site -ErrorAction SilentlyContinue; npm run build
npx wrangler deploy
```

**Git warnings (carry-forward):**
- Terminal git pushes fail — `msm-illumia` account does not have access to `authormsmiller/d281staircav`. Always push via **GitHub Desktop**.
- Admin tool Commit button confirmed unreliable — always verify in GitHub Desktop History tab.
- PowerShell does not support `&&` — run commands separately.
- PowerShell `curl` is `Invoke-WebRequest` — use `Invoke-WebRequest -Method POST [url]` for POST requests.

---

## What Was Accomplished This Session

### INFRA-TASK-061 — worker.js asset passthrough fix
Replaced hardcoded `fetch("https://d281staircav.pages.dev/...")` with `env.ASSETS.fetch(request)`. The old line was making an outbound HTTP round-trip; the ASSETS binding was already declared in `wrangler.jsonc` but never called.

### INFRA-TASK-062 + 063 — SUBMISSIONS R2 bucket
Created `angryskipperarchive-submissions` bucket in Cloudflare dashboard. Added `SUBMISSIONS` binding to `wrangler.jsonc`.

### INFRA-TASK-064 — POST /submit/contribute
Multipart upload handler in `site/src/worker.js`. Creates or appends to a folder in `submissions/[type]/[folder-id]/`. Returns `{ folderId, isNew }`. Folder ID format: `[soldier-slug]-[unix-timestamp]`.

### INFRA-TASK-065 — GET /submit/check
Verifies a folder_id still exists in SUBMISSIONS. Checks both `photos/` and `documents/` prefixes. Returns `{ exists: true|false }`. Used by contribute form on load for session continuation.

### INFRA-TASK-066 — POST /submit/request
Writes typed request JSON to `requests/[timestamp]-[type].json` in SUBMISSIONS. Sends notification email to `admin@angryskipperarchive.org` via Cloudflare Email Workers.

### INFRA-TASK-067 — Email (partial)
Notification email wired for Request form only. Sends plain-text email to `admin@angryskipperarchive.org` on every request submission. Thank-you email for Contribute (first submit, to submitter) is stubbed in worker.js with a comment but not yet implemented.

### INFRA-TASK-068 — Admin pull endpoint
Built `admin/lib/submissions.js` using R2 S3-compatible API (`@aws-sdk/client-s3`). Registered three routes:
- `GET /api/submissions/list` — lists all pending folders with metadata
- `POST /api/submissions/pull/:id` — downloads folder to `_intake/raw/[type]/[id]/`
- `POST /api/submissions/discard/:id` — deletes folder from R2 after processing

Credentials stored in `admin/.env` (gitignored). See `admin/.env.example`.

### Cloudflare Email Routing + Gmail Send As
- `admin@angryskipperarchive.org` forwards to Gmail via Cloudflare Email Routing
- Gmail "Send As" configured with App Password via `smtp.gmail.com:587`
- Both receive and send from `admin@` now work from Gmail

### Contribute page — `site/contribute.njk`
Replaced old Formspree form with new upload form. Features:
- Photos / Documents type selector
- Drag-and-drop file upload with file list and remove buttons
- localStorage session continuation (folder_id, name, contact, soldier pre-fill)
- Checks `/submit/check` on load — shows continuation banner if returning
- XHR upload with progress bar
- Handles `?type=` and `?c=` query params
- Success / error states

### Request page — `site/request/index.njk`
New page at `/request/`. All 6 types implemented:
- Correction, Contact Info Request, Add a Soldier, Something is Broken, Privacy/Takedown, General Message
- Type selector with back navigation
- Shared submitter fields + type-specific fields
- Submits to POST /submit/request
- Captures `page_url` and `referrer_url` silently
- Pre-selects type from `?type=` query param
- Success / error states with type-specific confirmation messages

### Jim Garvin — first live submission test
- Photos submitted via live contribute form at `angryskipperarchive.org/contribute/`
- Landed in R2 SUBMISSIONS as `jim-garvin-1779179932216`
- Pulled to `_intake/raw/photos/jim-garvin-1779179932216/` via admin pull endpoint
- Processed through photo intake pipeline
- Profile and photos deployed to live site
- Garvin stub created: `garvin-jim`

---

## Known Issues

### Photo URL mismatch — Garvin photos not displaying
Photos processed through the intake pipeline build into static assets at `/soldiers/garvin-jim/photos/field/[filename]`. The photo templates generate `/media/photos/soldiers/garvin-jim/field/[filename]` which routes to the R2 PHOTOS bucket handler — but Garvin's photos are not in R2 PHOTOS. They 404 on the live page.

Root cause: two-path problem:
1. `/media/photos/` prefix only applies to R2-hosted photos (legacy migration batch)
2. Path order differs: template generates `soldiers/[slug]/field/` but static assets are at `soldiers/[slug]/photos/field/`

**Options:**
- **Option A (quick):** Fix template URL generation to produce correct static asset paths — 30 min
- **Option B:** Upload Garvin's photos to R2 PHOTOS and fix path order — 45-60 min
- **Option C (Phase 5):** Full R2 migration for all photos, remove static asset fallback — several sessions

Deferred — site is not being shown publicly yet. Broken links not urgent.

---

## Carry-Forward (from Session 37, still open)

**Soldier stubs needed:**
- `bacon-wg` — W.G. Bacon, LTC, status: deceased. Not yet created.
- `caruthers-tom`, `kinsey-charles`, `ryneska-john` — referenced in Bacon document `contains`, no stubs
- `rosenberg-kenneth` — KIA May 14, 1972 (Chinook crash); update `status: kia`, add `date_of_death`
- `blais-dizzy` — nickname slug; update when given name confirmed
- `neal-bill` — confirm correct slug for Capt. William D. Neal before wiring
- `martin-michael` vs `martin-mike` — slug conflict; reconcile before scaffolding profile
- Dillon document `contains` — named soldiers not yet cross-referenced with stubs

**Data decisions pending:**
- `mcgrew-calendar` document type — `log` or `journal`
- `miller-marvin-dale-OLD.md` — remove once new profile confirmed stable

**Research / physical assets:**
- Higher-resolution Cardwell clippings — LaCunha deceased; Peggy may have originals
- Linda Martin shadow box photograph — offered to Angelo State; unclear if in collection
- Grenada MS war memorial — carries Sargent's name; note on his profile
- Unnamed boot camp soldier in Linda Martin transcript — potentially identifiable
- Cate shadow box — Michael Miller has photograph; needs adding to project

**Deferred features:**
- Honor Wall — tabled; revisit after Unit History page built
- Bee incident slug — update `bee-incident-1971` to `bee-incident-1971-03-22` in testing brief
- Phase 5 template work — photo URL fix; R2 migration; remove static asset fallback
- ASA newsletter migration — skip until ready as clean batch
- `node_modules` committed in initial push — dead weight, clean up when convenient
- Contribute thank-you email (INFRA-TASK-067 partial) — stub is in worker.js, needs implementation
- Tab 5 (Todo/Flags) UI — spec complete from Session 32, not yet built

---

## Next Session Priorities

1. **Photo URL fix (Option A)** — Fix template URL generation so Garvin's photos display. Quick win before any public sharing.
2. **SITE-TASK-069** — Wire form touch points: add `?soldier=`, `?type=` query params to 19 existing links; add new Correction links on soldier/event/document heroes; add footer "Report an issue" link.
3. **Contribute thank-you email** — Finish INFRA-TASK-067: send thank-you to submitter on `isNew`, include continuation link.
4. **Tab 5 build** — Todo/Flags UI per Session 32 spec. Design is complete and ready to build.
5. **Garvin stubs** — `garvin-jim` profile exists but soldiers tagged in his photos need stubs: Catterson, Collins (Gary "Indian"), Holtzclaw, Fairchild (Joe "Meatball"). Dillon and Graham already have stubs.

---

## Files Changed This Session

| File | Change |
|---|---|
| `site/src/worker.js` | Asset passthrough fix; POST /submit/contribute; GET /submit/check; POST /submit/request; sendNotificationEmail |
| `site/wrangler.jsonc` | Added SUBMISSIONS R2 binding; added send_email binding |
| `site/contribute.njk` | Full rewrite — replaced Formspree with new upload form |
| `site/request/index.njk` | New file — Request form, all 6 types |
| `site/assets/css/main.css` | Added contribute and request form styles |
| `admin/lib/submissions.js` | New file — R2 pull endpoint (INFRA-TASK-068) |
| `admin/server.js` | Added dotenv, REPO_ROOT, registerSubmissionsRoutes |
| `admin/.env.example` | New file — R2 credentials template |
| `admin/.gitignore` | Added .env |
| `admin/data/todo.json` | Added ADMIN-TASK-20260519000070 (pending publish health check) |
| `_sessions/Session_38_Handoff.md` | This file |
