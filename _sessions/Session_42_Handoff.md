# Session 42 Handoff — d281staircav

**Date:** 2026-05-20
**Repo:** `https://github.com/authormsmiller/d281staircav`
**Deploy:** Cloudflare Pages via `npx wrangler deploy` from `site/`. Always push via GitHub Desktop — terminal pushes fail (msm-illumia account lacks push access to authormsmiller/d281staircav).
**Date:** 2026-05-19
**Repo:** `https://github.com/authormsmiller/d281staircav`
**Deploy:** `npx wrangler deploy` from `site/`. Push via GitHub Desktop only — terminal pushes fail (msm-illumia account lacks push access to authormsmiller/d281staircav).

---

## What Was Completed This Session

### Primary Goal: UH-1H Crash Archive (4/24/71) + Associated Personnel Framework

---

### Nathan Stanfield Survivor Account

Archived Stanfield's Facebook comment as a primary source document.

**File:** `site/documents/stanfield-nathan/stanfield-nathan-account-042471/stanfield-nathan-account-042471.md`

- Title: "I Owe My Life to the Men That Came Out"
- `type: account`, `date: 1971-04-24`
- Source: Facebook comment, D 2/8 CAV 65-72 group, c. 2025
- Account reproduced verbatim
- `contains`: stanfield-nathan, fanning-martin, jeffries-gabriel
- `tagged`: colburn-richard (named as one of the dead), olds-lo (identified via VHPA — not named by Stanfield)
- Notes document KIA discrepancy: Stanfield recalls 2 passenger deaths; VHPA official record shows 1 (Colburn). Three total KIA per VHPA (Fanning + Jeffries + Colburn).

---

### VHPA Official Accident Record

Archived the official Vietnam Helicopter Pilots Association database record for the crash.

**File:** `site/documents/unit/vhpa-042471-report/vhpa-042471-report.md`
**Supporting file:** `site/documents/unit/vhpa-042471-report/710424101ACD.html` (original VHPA HTML)

- `type: record`, `date: 1971-04-24`, `event: crash-fsb-fontaine-1971-04-24`
- Full crew table: Fanning (KIA), Jeffries (KIA), Olds (survived), Stanfield (survived)
- Full passenger table: Colburn (KIA), 6 survivors (Pugh, Capps, Sukup, Castillo, Brooks, McCoy)
- Accident summary transcribed verbatim
- Notes list all survivors without current stubs

---

### Associated Personnel Framework

Established `associated: true` / `associated_unit` flags for non-D 2/8 organic personnel. Deferred physical directory migration (associated/) pending template work — templates hardcode `collections.soldiers` and `/soldiers/{slug}/` URLs.

Updated soldiers with `associated: true`:
- `stanfield-nathan` — `associated_unit: A/229 AVN`
- `fanning-martin` — `associated_unit: A/229 AVN`
- `jeffries-gabriel` — `associated_unit: A/229 AVN`
- `colburn-richard` — `associated_unit: HHC 2/8 CAV (Armor)`

Scope guidance confirmed: battalion COs remain in the main roster (they operated closely with the company). The `associated` flag is also appropriate for Donut Dollies, Kit Carson Scouts, and attached aviation crews.

---

### New Soldier Stubs

**`mcgrew-howard`** (`site/soldiers/mcgrew-howard/mcgrew-howard.md`)
- Platoon: Range Platoon
- Timeline entry: 3 MAY 1971, FSB Donna (squad photo source: Norm McDonald post, labeled by Kirk Davis; McGrew comment confirmed date/location)
- Note: McGrew's 1971 calendar (`sources/mcgrew-calendar/`) is a key archive source

**`giac`** (`site/soldiers/giac/giac.md`)
- `associated: true`, `associated_unit: Kit Carson Scout (attached D Co. 2/8 CAV)`
- Last name blank — only one name known
- `unit_note` explains Chieu Hoi program / former NVA or VC who defected
- Timeline entry: 3 MAY 1971, FSB Donna

---

### Harrington Profile Photo

Cropped a profile photo for William Harrington from the existing field photo `range-guidara-harrington.jpg`.

- Left soldier in field photo = Guidara (confirmed by comparison to his known profile photo)
- Center soldier = Harrington (unobstructed face)
- Right figure = likely Giac (Vietnamese appearance, consistent with his attachment to Range Platoon)
- Crop saved to: `site/soldiers/harrington-william/photos/profile/harrington-william.jpg`
- `profile/index.md` created; `profile_photo: harrington-william.jpg` set in `harrington-william.md`

---

## Pending Work (Carry-Forward)

### Immediate

1. **Hilts and Bott profile crops** — Norm McDonald squad photo (3 MAY 1971, FSB Donna) was shared as an inline screenshot only. Need the photo uploaded as a file to crop programmatically. Once available: crop Hilts and Bott, save to their respective `photos/profile/` directories, create `index.md` entries, wire up `profile_photo` in each stub.

2. **Crash event record update** (`crash-fsb-fontaine-1971-04-24`) — needs:
   - Passenger list updated with all 7 VHPA-identified names
   - Crew section updated to include L.O. Olds
   - Open question on cause of crash closed out (documented in VHPA report: power loss / RPM decay after loud bang at ~100–200 ft AGL)

3. **Squad photo archiving** — the labeled Norm McDonald FSB Donna photo (3 MAY 1971) should be archived as a unit document or photo record (Range Platoon, FSB Donna). Contains: McGrew, Giac, Hilts, Bott, Harrington, Freeman; possibly others.

### Next Session Focus

**Edit Record (Soldier) admin form — unlocking front matter fields.** Current admin edit form is limited. Goal is to expose additional YAML front matter fields for in-browser editing so records can be updated without touching raw files.

### From Prior Sessions

1. **Soldier profile standardization** (`DATA-TASK-20260519000073`) — still open
2. **Missing soldier stubs** — `bacon-wg`, `caruthers-tom`, `kinsey-charles`, `ryneska-john`, `kahnke-steve`, `martin-michael`, `mcgrew-harold`, `bedsole-jim`, `fishell-larry`, `louisell`
3. **Event slug `[]` literal bug** (`ADMIN-BUG-20260518000022`) — still open
4. **Fuzzy match scorer** (`ADMIN-BUG-20260518000024`) — still open
5. **Served Alongside** (`SITE-TASK-20260519000072`) — do not ship until results are meaningful
6. **Album page** (`SITE-TASK-20260519000074`) — not MVP
7. **Flushed photos not rendering** (`SITE-BUG-20260519000076`) — miller-marvin-dale field photos landed on disk but not displaying; likely crawler or R2 upload issue

---

## Architecture Notes (unchanged — see Session 40)
### Branch / Merge Recovery

`admin/2026-05-19` had been created from `main` instead of from the tip of `admin/2026-05-18`, leaving Sessions 35–41 (and all associated code) stranded on the old branch. Fixed by merging `admin/2026-05-18` into `admin/2026-05-19` via GitHub Desktop, then merging the PR into `main` and deploying to Cloudflare. 91 new/modified assets uploaded. Site confirmed live at angryskipperarchive.org.

---

### data-standards.md — Photo Schema Update

`site/_docs/data-standards.md` updated to Session 42 (was last updated Session 16). Changes:

**photographer: field**
- Always a soldier slug or empty string. Magic words (`unknown`, `unknown-of`) are deprecated — remove on sight.
- Slug = attribution credit AND gallery routing signal for selfies.
- Empty = attribution unknown; no routing effect.

**Gallery routing rules** (⚠️ implementation pending — current template still uses old logic)
- "Photos of [First]" *(rendered first)*: slug in `contains:` anywhere in the archive, EXCEPT where `photographer == this soldier's slug` (selfies route to Gallery 2).
- "Photos Taken By [First]" *(rendered second; hidden if empty)*: `photographer == this soldier's slug`. Covers photos with no identifiable soldiers in frame AND selfies.
- Cross-folder photos (other soldiers' collections) merge into "Photos of" via the crawler's `byContains` reverse map — no separate Gallery 3.
- Gallery 2 hidden entirely if no photos qualify (most soldiers will have no personal collection).

**tagged: on photos**
Retained in schema for future use. Meaning: soldier implied by context but not visually identifiable in the frame.

**location: field**
New optional field on individual photo entries. Free text, named place only if identifiable with confidence. Feeds Lunr search index alongside event location data — enables "FSB Fontaine" searches to surface both events and photos of the base.

**Cross-Reference Field Summary table** updated with `photographer:` and `location:` rows.

---

### Hover Caption Removal — soldier.njk + main.css

Removed `.photo-overlay` / `.photo-cap-text` / `.photo-cap-credit` divs from all three gallery loops in `site/_includes/layouts/soldier.njk`. Removed corresponding CSS rules from `site/assets/css/main.css`. Photos now render as clean cards — no gradient overlay, no hover caption. Caption and credit are available in the lightbox when the user opens the photo.

**Status:** Built and tested locally. Not yet deployed — held in branch pending R2 URL fix (see below).

---

## Primary Next Session Target: Flush-to-R2 Pipeline

### The Problem

"Flush to site" currently writes image files into `site/soldiers/[slug]/photos/[subfolder]/` in the git repo. The crawler generates R2 URLs for these files (`/media/photos/soldiers/[slug]/[subfolder]/[filename]`), but the files only land in R2 if a separate manual upload step is run. Result: photos flush correctly but don't render on the live site until uploaded. As the collection grows, binary files in git will also become a space constraint.

### The Design

Image files go directly to R2 on flush. The repo holds only `index.md` metadata. Three tasks are specced in todo.json:

**ADMIN-TASK-20260519000077 — Flush uploads to R2**
- Use `@aws-sdk/client-s3` (already a dependency) with `PutObjectCommand`
- R2 credentials already in `admin/.env` (`R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`)
- Upload each file to `angryskipperarchive-photos` at key `soldiers/[slug]/[subfolder]/[filename]`
- Atomic success rule: only write `index.md` and clear staging after ALL uploads succeed
- On any failure: report failed files, leave staging intact, do not write `index.md` — archivist retries from staging

**ADMIN-TASK-20260519000078 — Gitignore image files**
- Add patterns: `site/soldiers/**/*.jpg`, `*.jpeg`, `*.png`, `*.gif`, `*.webp`
- `*.md` files must remain tracked
- After flush pipeline confirmed: `git rm --cached` on existing committed images

**ADMIN-TASK-20260519000079 — Backfill existing photos to R2**
- One-time migration script
- Walk `site/soldiers/[slug]/photos/` and upload all existing image files to R2
- Confirm each resolves at `/media/photos/soldiers/[slug]/[subfolder]/[filename]`
- Then `git rm --cached` and commit the removal

### Current R2 Path Gap

Marvin Miller's photos were uploaded in a prior batch and render correctly. Garvin's photos (and others flushed recently) are on disk but not in R2 — the crawler generates the right URL but the files aren't there. The backfill task (000079) resolves this. Do the backfill before or immediately after the flush pipeline change — don't leave the two states coexisting longer than necessary.

---

## Pending Work (Carry-Forward)

1. **Flush-to-R2 pipeline** — primary target next session (epic ADMIN-EPIC-20260519000076)
2. **Photo gallery rewrite** — deferred until after R2 pipeline is stable. Full spec in data-standards.md under Gallery Routing Rules.
3. **Soldier profile standardization** (`DATA-TASK-20260519000073`) — still open
4. **Missing soldier stubs** — `caruthers-tom`, `kinsey-charles`, `ryneska-john`, `kahnke-steve`, `martin-michael`, `mcgrew-harold`, `bedsole-jim`, `fishell-larry`, `louisell`
5. **Event slug `[]` literal bug** (`ADMIN-BUG-20260518000022`) — still open
6. **Fuzzy match scorer** (`ADMIN-BUG-20260518000024`) — still open
7. **Photo Schema V2** (`DATA-EPIC-20260518000001`) — photo_id, status per photo — deferred until gallery rewrite is done

---

## Architecture Notes

**CRLF** — repo built on Windows, all files use `\r\n`. Any regex touching line boundaries must use `\r?\n`.

**Soldier slug format** — `lastname-firstname` or `lastname-firstname-middlename`. No digits, 1–3 hyphens.

**Deployment** — `npx wrangler deploy` from `site/`. Push via GitHub Desktop only.

**Admin server** — runs on Windows at `localhost:3001`. Start with `npm start` from `admin/`. Requires `.env` with `R2_ACCESS_KEY_ID` and `R2_SECRET_ACCESS_KEY` for submissions pull.

**sharp on Windows** — `npm install` must be run on Windows (not WSL or Linux sandbox) so sharp installs its Windows prebuilt binary. The `node_modules/sharp` binary is platform-specific.

**YAML date field** — `date:` values in document front matter must NEVER be quoted. `date: 1971-04-24` is correct; `date: "1971-04-24"` breaks the build.

**associated flag** — `associated: true` marks soldiers not organic to D Co. 2/8 CAV (aviation crews, Kit Carson Scouts, attached personnel, Donut Dollies, etc.). Paired with `associated_unit` field. Physical migration to `associated/` directory deferred — templates hardcode `collections.soldiers` and `/soldiers/{slug}/` paths.
**Admin server** — runs on Windows at `localhost:3001`. Start with `npm start` from `admin/`. Requires `.env` with `R2_ACCESS_KEY_ID` and `R2_SECRET_ACCESS_KEY`.

**R2 bucket structure:**
- `angryskipperarchive-photos` — public media, served at `/media/photos/`
- `angryskipperarchive-documents` — documents
- `angryskipperarchive-submissions` — public form submissions, private

**sharp on Windows** — `npm install` must be run on Windows (not WSL) for the correct native binary to be compiled.
