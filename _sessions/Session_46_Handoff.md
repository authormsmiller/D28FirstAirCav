# Session 46 Handoff — d281staircav

**Date:** 2026-05-26
**Branch:** `admin/2026-05-22` (continuing)
**Repo:** `https://github.com/authormsmiller/d281staircav`
**Deploy:** `npx wrangler deploy` from `site/`. Push via GitHub Desktop only — terminal pushes fail (msm-illumia account lacks push access to authormsmiller/d281staircav).

---

## What Was Completed This Session

### KIA / DOW / MIA Profile Treatment — Implemented

New visual treatment for fallen soldier profiles. Fully implemented and deployed.

**Color:** `#C0924E` — bronze, distinct from the site's existing yellow family (`--y: #F5C400`). Used for all KIA/DOW/MIA indicators.

**Changes made:**

**`site/_includes/layouts/soldier.njk`**
- `<body>` now receives `class="status-{{ status }}"` — CSS hooks for all status-based styling
- Gold star (`★`) renders below the profile photo frame inside `.prof-photo-col`, centered, via `<div class="prof-kia-star">` — conditional on `status in ["kia", "dow", "mia"]`
- New `<div class="prof-kia-line">` renders after `.prof-rank` — outputs e.g. `KIA · 24 Apr 1971` using the `departed` field
- Removed the old broken `prof-deceased` block (was checking uppercase `"KIA"` against lowercase data — had never worked)

**`site/assets/css/main.css`**
- `body.status-kia .prof-photo-frame` — swaps box-shadow from `var(--y)` to `#C0924E` (bronze replaces yellow on the photo frame drop shadow)
- `.prof-kia-star` — 22px, bronze, centered, padded below photo frame
- `.prof-kia-line` — Space Grotesk, 0.7rem, 0.14em tracking, uppercase, bronze

**Affected soldiers (all have `status: kia`):**
colburn-richard, jeffries-gabriel, fanning-martin, drinkard-danny, cardwell-james, hall-joseph, makowski-william, sargent-stan

**Data cleanup note (separate pass):**
- `jeffries-gabriel` has `departed: "1971-04-24"` (ISO format) — renders as-is, inconsistent with others
- `makowski-william` has `departed: October 21, 1971 (KIA)` — "(KIA)" is now redundant with the KIA line prefix
- Both render correctly but should be normalized to `"21 Oct 1971"` style when next in those files

---

### Navigation — Request Link Fixed

**`site/_includes/partials/masthead.njk`** (desktop nav + mobile drawer)
- "Request" CTA now points to `/request/` (the card page) instead of `/families/`
- Active state updated to match `/request/` URL
- `/families/` is now unreferenced from the nav — sitting quietly until it becomes the Keepsakes page
- Rationale: `/request/` needs real user testing beyond the happy path; families page reserved for future Keepsakes redesign

---

## Design Decisions Made This Session

### Keepsakes — Full design record in `Keepsakes_Feature_Design.md`

A major design session produced the following decisions. Nothing built yet — all implementation pending.

**The concept:** "Keepsakes" is the name for a new nav-level entry point covering two features:
1. Self-serve asset download (per-item download buttons, optional selection basket)
2. Curated memorial collection (request-based, Michael executes)

The name was chosen over "Curation Services," "For Families," "Build a Book," "Your Story." It covers both output formats, implies physical objects, self-selects the right audience.

**Navigation (future state — not yet built):**
Three CTA buttons: **Keepsakes** → `/families/` · **Request** → `/request/` · **Contribute** → `/contribute/`

**Families page** becomes the Keepsakes landing page — emotional register, not utility register. Tone established in design record. Entry point for curation requests via `/request/?type=curation`.

**Curation request** extends `/request/index.njk` with a new `curation` type card and form fields. Designed to collect the curation brief (subject soldier, connection, output type, date range, alongside hints). Goes into the submissions blob like any other request type.

**Book output:** KDP for text-heavy (unit history, memoir). Blurb for photo-forward memorial books. Low-res source material (~300–400px) prints acceptably at 4×6, soft beyond that.

**Photo resolution finding:** Most archive photos are small scans (~100–200KB). 450-photo download ≈ 50–80MB — the size problem is smaller than initially assumed. Simple zip via Cloudflare Worker is viable for large self-serve selections.

**Book builder architecture** (future, not near-term): `archive-index.json` build step consolidating all scraper data into a unified queryable payload. Alongside-prioritized sort. R2-backed session persistence. Full design in `Keepsakes_Feature_Design.md`.

---

### UX Philosophy — Decided

> "Good enough for a researcher, everything they need for an average user."

- Texas Tech Vietnam Archive is the comparison point — built for researchers, overwhelming for average users
- The archive's primary user is someone who Googled their grandfather's name
- Source notices are already classed in HTML — a **"Show Sources" toggle** (body class + localStorage persistence) would hide source noise by default, expose it for researchers on opt-in. Easy win, markup already supports it. Two-hour job.
- Every feature decision should be filtered against: can Larry Cate's widow find something meaningful on the Colburn profile within a minute without help?

---

### Scope Check — Discussed

The site is already ahead of almost any comparable individual or unit archive in content and UX. The gap between "designed and decided" and "built" is the risk to watch, not the vision being too wide.

The end state is maintenance mode: a year of data curation and entry, then handling a handful of submissions and requests. Features should move toward that end state, not away from it.

The mission cases that drive the design:
- **Larry Fishell** — lost everything in a fire. The archive is the recovery.
- **Larry Cate's widow and son** — gap where his service should be. The archive fills it.
- **Bill Small** — has the memory, can't transmit it (stroke). The archive becomes the transmission.

A curated book serves all three. That's what Keepsakes is for.

---

## Pending Work

### Priority (Near-Term)

- **Per-item download buttons** — easy win, Tier 1 Keepsakes foundation. Photos get a download button; documents link to R2 file. No basket needed for initial pass.
- **"Show Sources" toggle** — body class + localStorage. Two-hour job, high UX impact. Hides source notices by default, opt-in for researchers.
- **Keepsakes nav button** — add third CTA to masthead (desktop + drawer). `/families/` → "Keepsakes"
- **Families page redesign** — rewrite as Keepsakes landing page with appropriate tone and content
- **Curation request form type** — extend `/request/index.njk` with `curation` type card and fields

### Carry-Forward (From Sessions 43–45)

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

### Data Cleanup (Next Pass)

- Normalize `departed` date format on `jeffries-gabriel` and `makowski-william` (see KIA treatment note above)
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
| vollmar-tom | |

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
