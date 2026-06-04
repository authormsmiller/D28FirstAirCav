# Session 48 Handoff — d281staircav

**Date:** 2026-05-27
**Branch:** `admin/2026-05-22` (continuing)
**Repo:** `https://github.com/authormsmiller/d281staircav`
**Deploy:** `npx wrangler deploy` from `site/`. Push via GitHub Desktop only — terminal pushes fail (msm-illumia account lacks push access to authormsmiller/d281staircav).

---

## What Was Completed This Session

### Anecdote Migration — miller-marvin-dale (Complete)

All archive source anecdotes for Marvin Dale Miller were migrated from the prototype folder (`soldiers/miller-marvin/anecdotes/`) to the live site. Five files created:

| Archive ID | Site Path | Notes |
|---|---|---|
| MDM-ANECDOTE-ANGELOS | `site/anecdotes/miller-marvin-dale/angelos-shower/index.md` | Gus Angelos / USO shower story |
| MDM-ANECDOTE-M60 | `site/anecdotes/miller-marvin-dale/m60-incident/index.md` | Fishell account; `source_short: "Larry 'Pops' Fishell"` |
| MDM-ANECDOTE-NCOC | `site/anecdotes/miller-marvin-dale/ncoc-dismissal/index.md` | Fort Benning NCOC dismissal |
| MDM-ANECDOTE-PRISONER | `site/anecdotes/miller-marvin-dale/chieu-hoi-rallier/index.md` | Contemporary photo caption as primary source |
| MDM-RESEARCH-ROMANI | `site/anecdotes/miller-marvin-dale/romani-research/index.md` | How Val Romani was located; fulfills "forthcoming" reference in romani-testimony |

`MDM-ANECDOTES-TOLD.md` was identified as a curatorial meta-document, not a publishable anecdote — intentionally not migrated.

Letters (`soldiers/miller-marvin/letters/`) were already fully migrated to the site in earlier sessions. No action needed.

---

### Photo Registration — Field Index Files Updated

Four photos were registered in their respective `index.md` files. These are now in the crawler and will generate URLs — but the image files are not yet in R2 (see Backfill section below).

**`site/soldiers/davis-kirk/photos/field/index.md`** — one entry added:
- `19710500-chieu-hoi-fsb-fontaine.png` — Cat Platoon escorting Chieu Hoi rallier onto FSB Fontaine, ~May 1971. Credit: Kirk Davis collection. Contains: alloway-denny, small-bill, cate-larry, sells-leroy. Event: `chieu-hoi-fsb-fontaine-1971-05`.

**`site/soldiers/miller-marvin-dale/photos/field/index.md`** — three entries added:
- `training-barracks-1970.jpg` — Marvin at desk in military building, stateside 1970. `photographer: unknown-of`.
- `training-desk-1970.jpg` — Marvin on Barracks 80 steps, stateside 1970. `photographer: unknown-of`.
- `uso-1.jpg` — USO performers at firebase, 1971. `photographer: miller-marvin-dale`. Event field left blank — no USO event slug exists yet.

---

### Photo Display Bug — Diagnosed and Solved

**Root cause confirmed:** Photos are served from Cloudflare R2, not the git repo. The crawler (`site/_data/photosBySlug.js`) only builds URLs at compile time — it never serves bytes. Image files added directly to the repo via Cowork sessions bypass the admin tool's R2 upload step entirely, so the files exist in git but are missing from R2. The Worker returns 404 for every request.

**Solution:** Run the backfill script after any Cowork session that adds photo files to the repo:

```powershell
# From repo root (Windows PowerShell or Command Prompt)
node admin/scripts/backfill-r2.js
```

- Requires `R2_ACCESS_KEY_ID` and `R2_SECRET_ACCESS_KEY` in `admin/.env` — already set
- Checks R2 before uploading (skips existing files)
- Safe to re-run at any time
- Preview with `--dry-run` flag before committing to uploads

The four photos registered this session (training-barracks-1970.jpg, training-desk-1970.jpg, uso-1.jpg, 19710500-chieu-hoi-fsb-fontaine.png) will display on the site once backfill is run.

---

### Cleanup Required — Stale Workflow File

A GitHub Actions workflow file was created during session troubleshooting and then rejected. It cannot be removed via Cowork file tools. Delete it manually:

```powershell
# From repo root
git rm .github/workflows/sync-photos.yml
git commit -m "Remove GitHub Actions photo sync workflow — not needed"
```

---

## Next Session: Group 4 Profile Migrations

The profile standardization effort is defined in `_sessions/Handoff_Profile_Standardization-052726.md`. That handoff covers Group 1 (complete: hurst-fred, alloway-denny, kutter-wolf, makowski-william) and defines Group 4 as the next targets:

| Slug | Notes |
|---|---|
| miller-marvin-dale | Primary subject — highest priority |
| cate-larry | |
| davis-kirk | Template migration only — full profile exists |
| romani-val | Photographer; limited data |
| sells-leroy | Sparse — stub only |
| weaver-ken | Referenced across multiple records |

Canonical template format reference: any Group 1 profile. Section headers in YAML:
```yaml
# ── IDENTITY ──
# ── SERVICE ──
# ── RELATIONSHIPS ──
# ── CONTENT ──
```

Before starting profile work, run the backfill so the photos registered this session are live.

---

## Carry-Forward (From Session 47)

1. **`git rm --cached`** — remove committed photo binaries from git tracking (command in Session 43 handoff)
2. **Lightbox index offset** (`SITE-BUG-20260518000025`) — flat index map needed
3. **Event slug `[]` literal bug** (`ADMIN-BUG-20260518000022`)
4. **Fuzzy match scorer** (`ADMIN-BUG-20260518000024`) — Levenshtein needed
5. **Missing soldier stubs** — caruthers-tom, kinsey-charles, ryneska-john, kahnke-steve, martin-michael, mcgrew-harold, bedsole-jim, louisell
6. **Tab 5 (Todo/Flags)** — fully spec'd in Session 32 handoff, not yet built
7. **Email sending** (`INFRA-TASK-20260518000067`) — thank-you + continuation link
8. **jeffries-gabriel** — Full KIA profile. WO1, co-pilot, KIA 24 Apr 1971. VHPA: `https://www.vhpa.org/KIA/incident/710424101ACD.HTM`
9. **W.J. Brooks stub** — 27th Maintenance Battalion, survived FSB Fontaine crash
10. **`locations_draft` → `locations`** on 4/20 event once coordinates verified
11. **10/21 Makowski survey config** — `site/_data/surveys/contact-nui-ba-1971-10-21.json`
12. **USO event slug** — `uso-1.jpg` has `event: ""` — update once a USO event record is created
13. **sells-leroy** — `chieu-hoi-rallier` anecdote and Davis photo reference this slug; profile may still be sparse

---

## Architecture Notes

**CRLF** — repo built on Windows, all files use `\r\n`.

**R2 key format** — `soldiers/[slug]/[subfolder]/[filename]` (no `photos/` segment). Served at `/media/photos/soldiers/[slug]/[subfolder]/[filename]`.

**Photo pipeline** — files go to `_intake/raw/photos/[Name-MMDDYY-HHMMSS]/`, staged via admin UI, flushed to R2 + index.md. Cowork-added photos bypass this and must be backfilled via `node admin/scripts/backfill-r2.js`.

**Deployment** — `npx wrangler deploy` from `site/`. Push via GitHub Desktop only.

**Admin server** — `npm start` from `admin/`. Requires `.env` with `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `CLOUDFLARE_ACCOUNT_ID`.

**R2 buckets:**
- `angryskipperarchive-photos` — public media, served at `/media/photos/`
- `angryskipperarchive-documents` — documents
- `angryskipperarchive-submissions` — public form submissions, private

**`_private/contacts.json`** — gitignored; holds phone/email/address for living contacts. NEVER commit PII to .md files. Army-era service IDs are real SSNs — do not publish.
