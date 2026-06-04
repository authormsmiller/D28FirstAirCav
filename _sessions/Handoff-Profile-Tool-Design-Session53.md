# Session 53 Handoff — Profile Tool Design

**Date:** 2026-06-01
**Context:** Design discussion — no code written this session.

---

## Overview

A unified **New Profile / Edit Profile** tool added to the existing admin panel (port 3001). Replaces the disabled "New Record" tab stub. Handles both creating profiles from scratch and editing existing ones — same form, pre-populated in the edit case.

**Scope:** Local only. No GitHub API writes, no multi-user auth. VS Code + GitHub Desktop push remains the deploy mechanism. R2 upload goes through existing worker bindings in `photos.js`.

**Not in scope (this iteration):** Slug rename, DD-214 OCR, PDF parsing, bulk photo automation.

---

## Profile Creation — What Happens at Slug Creation

When a new slug is created, the tool scaffolds ALL folders across the repo immediately, with `.gitkeep` files to hold structure in git:

```
site/soldiers/[slug]/
  [slug].md                  ← stub from buildSoldierStub()
  photos/
    profile/    .gitkeep
    field/      .gitkeep
  
site/anecdotes/[slug]/
  .gitkeep

site/documents/[slug]/
  .gitkeep
```

`POST /api/soldiers/create` needs to be extended to create the anecdotes and documents folders in addition to the soldiers folder (currently only does soldiers).

---

## Tab Specs

---

### Tab 1 — Frontmatter

**Purpose:** Populate identity, rank, service, and post-service fields.

**Two entry modes:**

**Manual** — standard form, fill what you have, save anytime. Fields map directly to the template sections:
- Identity: first_name, last_name, middle_name, suffix, nickname, birth_year
- Rank & Assignment: rank, mos, platoon
- Service: arrived, departed, character_of_service, status
- Post-service: hometown, current_location, year_deceased, cause_of_death

**Import** — drop a file or paste a URL, parser pre-fills the form, you review before anything writes to disk.

Import sources (priority order):
1. **KIA sites** — Honor States, Virtual Wall, Wall of Faces. URL fetch or dropped HTML. Already proven in `build_profile.py`. Rank, DOB, hometown, Wall panel, casualty date.
2. **FindAGrave** — URL fetch. Name, birth/death dates, burial location. Lower fidelity.
3. **DD-214** — deferred. Scans vary too much in quality to rely on. Revisit if clean PDFs appear.

Both modes land on the same form. Conflicting fields from import surface as a choice, not a silent overwrite.

**Save behavior:** Per-section save, not a single submit. Each section saves independently so the profile can exist in a partially-complete state.

**Backend:** Existing `/api/edit` endpoint (one field per call) or a new bulk-write endpoint to save a whole section at once.

---

### Tab 2 — Photos

**Purpose:** Intake photos and route them to the correct subfolder.

**Session-level defaults (set once, apply to all photos in this batch):**
- `credit` — pre-filled as `"From the collection of [Name]"` where Name comes from the submitter captured at profile creation or intake screen. Editable per photo.
- `date` — optional. If set (e.g. `1971`), pre-fills `date` on every photo. Year-only entries write `date_known: false` automatically. Editable per photo.

**Per-photo flow (one at a time, same as current intake):**
- Routing: **Profile** | **Field** | **Field/Events** — set per photo, not as a batch
- Caption (long and short) — manual
- Credit — inherits session default, editable
- Date — inherits session default, editable; `date_known` flips to `true` only on a specific date
- Event — per photo, empty by default, filled when applicable (field/events routing)
- Contains — manual identification, no pre-population (collection source ≠ photo subject)
- Tagged — manual

**File type check:**
- Expected: `.jpg`, `.jpeg`, `.png`, `.tiff`, `.webp`
- Unmatched: drop to `site/soldiers/[slug]/raw/` with `status: draft`

**Subfolder mapping:**
- Profile → `photos/profile/`
- Field → `photos/field/`
- Field/Events → `photos/field/events/`

**R2 upload:** Fires on save via existing bindings in `photos.js`. Eliminates the manual `backfill-r2.js` step.

---

### Tab 3 — Documents

**Purpose:** Intake written documents and wire them into the documents structure.

**Expected file types:** `.docx`, `.md`, `.txt`

**Flow for matched files:**
1. Drop file → tool extracts text, converts to markdown
2. Scaffolds `site/documents/[soldier-slug]/[doc-slug]/index.md` with converted content in body
3. `doc-slug` inferred from filename, editable before save
4. Frontmatter pre-filled:

```yaml
title:                    # inferred from filename or doc heading
type:                     # letter | account | report | other — manual
author: [soldier-slug]    # pre-populated, blankable
source:                   # "Written account submitted by [Name]" — from session
source_type:              # submission | family | archive | research | unknown
doc_date:                 # manual
contains: []              # if author is blanked, soldier-slug is added here automatically
tagged: []
status: draft             # → published when ready
```

**Author/contains rule:** If `author` is filled, leave `contains` alone. If `author` is blanked, add soldier slug to `contains[]` automatically so the document still surfaces on the profile.

**Unmatched files (PDF, images, etc.):**
- Drop to `site/soldiers/[slug]/raw/`
- Write minimal stub with `status: draft`
- Surfaces in todo tab as pending

**PDF note:** Photo-of-a-letter goes through the document route, not the photo route, with `status: draft` and `needs-transcription` implied. Transcription could become a Cowork skill if volume justifies it — deferred for now.

---

### Tab 4 — Service Record

**Purpose:** Induction details and assignment history.

**Fields:**
- Induction: status (drafted | enlisted | ra | commissioned), location, date
- Assignments: type, label, unit, location, from, to, notes — repeating entries

**Complexity note:** Assignments are nested objects, not flat strings. The current `/api/attach` and `/api/edit` model handles flat fields only. Needs a dedicated endpoint for add/edit/remove of assignment entries.

**Entry:** Manual. No automation planned.

---

### Tab 5 — Decorations

**Purpose:** Manage confirmed, distinguished, and unconfirmed decorations.

**UI:** Checklist for each of the three arrays (decorations, distinguished_decorations, decorations_unconfirmed).

**KIA batches:** Could support decoration presets (e.g. "Chinook 1972 base set") to speed up batch work. Not required for initial build.

**Entry:** Manual with checklist UI. Uses existing `/api/attach` and `/api/detach` endpoints.

---

### Tab 6 — Timeline

**Purpose:** Service timeline entries. Narrative-heavy — no auto-write, but the tab surfaces flagged candidates and provides a form for manual entry.

**Full entry schema (from miller-marvin-dale, the reference profile):**
```yaml
- date: "24 Apr 1971"
  phase: in-country         # training | staging | in-country | post-service
  type: combat              # move | personal | combat
  tags:
    - { type: c, label: Combat Action }   # m=movement, p=personal, c=combat, ph=documented
  headline: Huey Crash at FSB Fontaine — Three Killed
  body: >
    Narrative text — multi-line, written by you.
  source_notice: >          # optional — for contested or multi-source entries only
    Caveat text.
```

**Two entry points, same form:**

**Flagged candidates** — on Edit, the tool scrapes the soldier's photos and documents and surfaces any with `date_known: true` AND at least one `contains` or `tagged` slug. Presented as a queue: click a candidate, date pre-fills, headline and body are blank for you to write. Source photo/doc noted so you know what you're working from.

**From scratch** — blank form. For cases where the evidence is a document or letter you've interpreted, with no corresponding photo.

**Not automated:** Timeline entries are intentionally narrative and judgment-driven. The flagged queue surfaces opportunities; writing is always manual.

**Backend:** Timeline is a deeply nested YAML array in the soldier's `.md`. Needs a dedicated endpoint for add/edit/remove of timeline entries — cannot use the flat `/api/edit` model.

---

### Tab 7 — Alongside

**Purpose:** Manage manual Tier 2 and Tier 3 alongside relationships in `relationships.json`.

**How alongside actually works (confirmed from `alongside.js`):**
- **Tier 1** — auto-calculated at build time from `contains[]` in photo and document index files. Never written to disk, always recalculated. No admin intervention needed.
- **Tier 2** — same-platoon manual links from `relationships.json` (basis: `same-platoon`)
- **Tier 3** — broader manual links from `relationships.json` (any other basis)

**When you'd add a manual entry:**
- A soldier appears in a document `contains[]` but no photo exists (Tier 1 would be missing)
- You have explicit knowledge of same-platoon service with a specific date

**Entry form:**
- Soldier A — pre-filled from current profile slug, locked
- Soldier B — searchable/filterable dropdown from existing slugs. Filter options: by platoon, by year (arrived/departed overlap)
- Basis — dropdown: `same-platoon` | `verbal-account` | `document` | `other`
- Source — event slug or document slug this relationship is sourced from
- Notes — free text

**Save:** Writes a new entry to `relationships.json`. Bidirectional by design — the crawler handles both sides from a single entry.

**Backend:** New endpoint to read/write `relationships.json`. Simple JSON file — no complex logic needed.

---

### Tab 8 — External Resources

**Purpose:** Manage `links.wall` and `links.other` — external URLs relevant to the soldier.

**Wall field** — single URL. Only shown/active when `status: kia` or `mia`. VVMF Wall of Faces URL pattern can be suggested based on soldier name as a starting point.

**Other field** — repeating `label` / `url` pairs. No categories, no rules. Examples from colburn-richard: VHPA incident record, local memorial site, Honor States, Facebook memorial group. Add as many as needed, remove any.

**Entry:** Manual. Uses existing `/api/edit` for `links.wall` and a new array endpoint for `links.other` entries (add/remove).

---

### Tab 9 — Contact

**Purpose:** Family contact information (safe-to-commit fields only).

**Fields:** name, relation, last_verified, share_contact (boolean).

**Note:** Phone/email/address live in `_private/contacts.json` (gitignored) — not managed through this tab.

**Entry:** Manual form.

---

### Tab 10 — Admin

**Purpose:** Internal fields not rendered on the site.

**Fields:** date_added, last_updated, contributed_by, notes.

**Entry:** Manual. `date_added` auto-fills to today on new profile creation.

---

## Raw Folder & Draft Status

Any file that doesn't match expected types for its tab lands in `site/soldiers/[slug]/raw/` with a minimal stub and `status: draft`. This applies across all tabs — unrecognized file types, PDFs, anything the tool can't process automatically.

`status: draft` is the universal "needs attention" flag. The todo tab filters on it across all content types and presents a unified queue. No separate flag types needed for different failure modes.

**Decision rule:** If a file type or pattern starts appearing in raw frequently enough to feel like a bottleneck, that's the signal to design an automation for it. Build against real examples, not hypotheticals.

---

## Intake — Folder Picker

In addition to drag-and-drop, each intake tab needs a **folder picker** — a button that opens a directory browser pointed at `_intake/raw/` (or a configurable intake path). This covers the case where files have already been organized into a folder on disk (e.g. a family data dump) and dragging them one by one would be tedious.

**Behavior:**
- Picker opens at `_intake/raw/` by default
- You select a folder; the tool lists its contents filtered by the expected file types for the current tab
- Unmatched files are shown but skipped (or flagged for raw)
- Selected files enter the same per-item review flow as drag-and-drop — no difference in processing

**Backend:** Standard `<input type="file" webkitdirectory>` in the browser is sufficient for local use. No new server endpoint needed — files arrive via the existing multipart upload rails.

---

## Backend Gaps to Fill

| Gap | Work Required |
|---|---|
| Extend `POST /api/soldiers/create` | Also scaffold anecdotes/[slug] and documents/[slug] |
| Bulk field write | New endpoint or fan-out in UI for section-level saves |
| Nested assignments | Dedicated endpoint for add/edit/remove assignment entries |
| Nested timeline entries | Dedicated endpoint for add/edit/remove timeline entries |
| Timeline flagged candidates | On edit, scrape photos/docs for date_known:true + contains/tagged |
| HTML source parsing | Server-side port of `build_profile.py` parse logic |
| `relationships.json` management | New read/write endpoint |
| `links.other` array management | New array endpoint for add/remove of label/url pairs |
| Raw folder intake | Write stub + status:draft on unmatched file drop |
| Folder picker UI | `<input webkitdirectory>` on each intake tab, pointed at _intake/raw/ |

Slug rename: **deferred**. Frequency doesn't justify complexity yet.

---

## Build Order

1. New Profile tab — slug creation + section-by-section form driving existing endpoints
2. Bulk field write endpoint
3. Photo tab — session defaults (credit, date) + folder picker wired into existing per-photo intake
4. Document tab — docx conversion + index.md scaffold + folder picker
5. Nested assignments endpoint + Service Record tab
6. Timeline tab — entry form + flagged candidates queue
7. Alongside tab — relationships.json read/write endpoint + filtered soldier picker
8. External Resources tab — links.wall + links.other array management
9. Import from KIA sites (URL fetch/parse → pre-fill frontmatter form)
10. Decorations checklist + batch presets
11. FindAGrave import

---

## Related Files

- `Handoff-Admin-Design-Session52b.md` — prior session, open design questions
- `admin/lib/soldiers.js` — `buildSoldierStub()`, `POST /api/soldiers/create`
- `admin/lib/photos.js` — R2 upload, photo intake rails
- `admin/lib/frontmatter.js` — field type registry, readonly fields, read/write
- `admin/lib/records.js` — slug resolution, content type paths
- `admin/server.js` — all API endpoints
- `site/_data/_crawlDocuments.js` — how documents surface on profiles (folder + frontmatter, not author field alone)
- `site/soldiers/_template.md` — canonical profile template
- `skills/kia-profile/scripts/build_profile.py` — KIA site parse logic to port server-side
