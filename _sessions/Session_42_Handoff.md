# Session 42 Handoff — d281staircav

**Date:** 2026-05-20
**Repo:** `https://github.com/authormsmiller/d281staircav`
**Deploy:** Cloudflare Pages via `npx wrangler deploy` from `site/`. Always push via GitHub Desktop — terminal pushes fail (msm-illumia account lacks push access to authormsmiller/d281staircav).

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

**CRLF** — repo built on Windows, all files use `\r\n`. Any regex touching line boundaries must use `\r?\n`.

**Soldier slug format** — `lastname-firstname` or `lastname-firstname-middlename`. No digits, 1–3 hyphens.

**Deployment** — `npx wrangler deploy` from `site/`. Push via GitHub Desktop only.

**Admin server** — runs on Windows at `localhost:3001`. Start with `npm start` from `admin/`. Requires `.env` with `R2_ACCESS_KEY_ID` and `R2_SECRET_ACCESS_KEY` for submissions pull.

**sharp on Windows** — `npm install` must be run on Windows (not WSL or Linux sandbox) so sharp installs its Windows prebuilt binary. The `node_modules/sharp` binary is platform-specific.

**YAML date field** — `date:` values in document front matter must NEVER be quoted. `date: 1971-04-24` is correct; `date: "1971-04-24"` breaks the build.

**associated flag** — `associated: true` marks soldiers not organic to D Co. 2/8 CAV (aviation crews, Kit Carson Scouts, attached personnel, Donut Dollies, etc.). Paired with `associated_unit` field. Physical migration to `associated/` directory deferred — templates hardcode `collections.soldiers` and `/soldiers/{slug}/` paths.
