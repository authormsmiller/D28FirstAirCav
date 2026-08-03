# Session Prep — AD Files Organization
**Date written:** 2026-07-09
**Goal:** Move all DTIC AD-numbered documents scattered across KIA/, locations/, and downloads
into a structured source library within the repo, with an index documenting what each covers.

---

## The problem

AD files currently exist in at least four places:
- `locations/` (working download folder — not in repo)
- `KIA/` and `KIA/[slug]/` subfolders (pulled for specific research, not in repo)
- `site/assets/docs/` (the one file already ingested into the repo)

There is no index, no deduplication, and no systematic naming convention. When a document
is needed, it has to be rediscovered or re-downloaded from DTIC. Some are duplicated across
folders. Two (AD0515205, AD0516259) were only located because the FSB gazetteer cited them.

---

## Current inventory

### Already in the repo

| File | Content | Period |
|---|---|---|
| `site/assets/docs/AD0520447-3rd-bde-sep-sodr-1971.pdf` | Senior Officer Debriefing Report, 3rd Brigade (Separate), 1st Cav Div | 1971 |

### In `locations/` folder (not yet in repo)

| AD Number | Pages | Content | Period covered |
|---|---|---|---|
| AD0386215 | 56 | ORLL, HQ 1st Cav Div (Airmobile) | Likely Oct 1967 (dist. letter 19 Dec 1967) |
| AD0387543 | 61 | ORLL, HQ 1st Cav Div (Airmobile) | Likely Jul 1967 (dist. letter 15 Nov 1967) |
| AD0394510 | 83 | ORLL, HQ 1st Cav Div (Airmobile) | Likely Apr 1968 (dist. letter 15 Aug 1968) |
| AD0500295 | 21 | ORLL, HQ 1st Cav Div Artillery (Airmobile) | Aug–Oct 1968 (confirmed) |
| AD0508303 | 122 | ORLL, HQ 1st Cav Div (Airmobile) | **Oct 1969** (confirmed Session 90 — not 1968) |
| AD0509007 | 37 | ORLL, HQ 1st Cav Div Artillery | Period TBD |
| AD0509704 | 91 | ORLL, HQ 1st Cav Div (Airmobile) | Period TBD (duplicate — also in KIA/yates-donald/) |
| AD0515205 | 110 | ORLL, HQ II Field Force Vietnam | Period ending 31 Oct 1970 (confirmed) |
| AD0516259 | 92 | ORLL, HQ 1st Cav Div (Airmobile) | Period ending 31 Oct 1970 (confirmed) |
| AD0518422 | 124 | ORLL, HQ 1st Cav Div (Airmobile) | Period TBD |
| AD0520447 | 30 | SODR, 3rd Brigade (Separate), 1st Cav Div | 1971 (duplicate of repo file) |
| AD0523510 | 37 | SODR, HQ 1st Cav Div | 13 Dec 1971 – 20 Jun 1972 (confirmed) |
| AD0530055 | 17 | ORLL, HQ 3rd Brigade (Separate), 1st Cav Div | Period ending 31 Oct 1971 (confirmed) |
| AD0387543-OCR.md | — | OCR text of AD0387543 | Same as above |

### In `KIA/` and subfolders (not in repo, partially identified)

| AD Number | Location | Pages | Content | Period covered |
|---|---|---|---|---|
| AD0385642 | KIA/yates-donald/ | 118 | ORLL, HQ 1st Cav Div (Airmobile) | Period ending 30 Apr 1967 (confirmed) |
| AD0390613 | KIA/paulson-john/ | 37 | Unknown | TBD |
| AD0502597 | KIA/pipher-carl/ | 103 | ORLL, HQ 1st Cav Div (Airmobile) | Period TBD |
| AD0506273 | KIA/ | 73 | ORLL, HQ 1st Cav Div (Airmobile) | Period ending 31 Jul 1969 (confirmed) |
| AD0509704 | KIA/yates-donald/ | 91 | ORLL, HQ 1st Cav Div (Airmobile) | Period TBD (duplicate of locations/) |
| AD0509767 | KIA/wiseman-richard/ | 34 | SODR, 1st Cav Div | 23 Apr 1969 – 5 May 1970 (confirmed) |
| AD0512505 | KIA/wiseman-richard/ | 107 | ORLL, HQ 1st Cav Div (Airmobile) | Period TBD |
| AD0520447 | KIA/ | 30 | SODR, 3rd Brigade (Separate) | 1971 (duplicate — in repo and locations/) |

### Also in `locations/` — not an AD file but related
- `ORLL-31-Jul-68.pdf` — confirmed as AD393815 (1st Cav Div Artillery ORLL, period ending
  31 Jul 1968). Should be aliased in the index.

---

## Known gaps

| Period | Document needed | Status |
|---|---|---|
| Jul–Oct 1968 | 1st Cav Div HQ ORLL (LZ Carol context) | **Missing** — targeted in Session 90; estimated AD0499xxx–AD0502xxx |
| Periods for AD0386215, AD0387543, AD0394510 | Exact quarter-end dates | Need page 4+ text extraction |
| Periods for AD0502597, AD0509704, AD0512505, AD0518422, AD0390613 | Exact quarter-end dates | Need page 4+ text extraction |
| AD0515205 / AD0516259 | Now in locations/ | **Resolved 2026-07-09** |

---

## Proposed repo structure

```
site/sources/
  ├── index.md                   ← human-readable registry (see below)
  ├── orll/
  │   ├── AD0385642-orll-1cav-apr67.pdf
  │   ├── AD0386215-orll-1cav-[period].pdf
  │   ├── AD0387543-orll-1cav-jul67.pdf
  │   ├── AD0387543-orll-1cav-jul67-ocr.md
  │   ├── AD0394510-orll-1cav-[period].pdf
  │   ├── AD0500295-orll-1cav-arty-oct68.pdf
  │   ├── AD0502597-orll-1cav-[period].pdf
  │   ├── AD0506273-orll-1cav-jul69.pdf
  │   ├── AD0508303-orll-1cav-oct69.pdf
  │   ├── AD0509007-orll-1cav-arty-[period].pdf
  │   ├── AD0509704-orll-1cav-[period].pdf
  │   ├── AD0512505-orll-1cav-[period].pdf
  │   ├── AD0515205-orll-iiffv-oct70.pdf
  │   ├── AD0516259-orll-1cav-oct70.pdf
  │   ├── AD0518422-orll-1cav-[period].pdf
  │   ├── AD0530055-orll-3bde-oct71.pdf
  │   └── ORLL-31-Jul-68-AD393815-arty-jul68.pdf
  └── sodr/
      ├── AD0509767-sodr-1cav-may70.pdf
      ├── AD0520447-sodr-3bde-1971.pdf
      └── AD0523510-sodr-1cav-jun72.pdf
```

**Naming convention:** `AD[number]-[type]-[unit-abbrev]-[period-end-mon+yr].pdf`
- type: `orll` | `sodr` | `lessons`
- unit-abbrev: `1cav` | `1cav-arty` | `iiffv` | `3bde`
- period: `oct70`, `jul69`, `apr67`, etc.
- Use `[period]` as placeholder when not yet confirmed

**Duplicates to resolve:**
- AD0509704: keep one copy (locations/ version, rename to repo)
- AD0520447: keep repo version (already named); discard KIA/ and locations/ copies

---

## What the session should do

1. **Extract period-end dates** for the 7 unidentified ORLLs (AD0386215, AD0394510,
   AD0390613, AD0502597, AD0509704, AD0512505, AD0518422) — read page 4–5 of each,
   look for the subject line that names the quarter-end date.

2. **Create `site/sources/`** directory structure.

3. **Copy and rename** all AD files from locations/ and KIA/ into `site/sources/` with
   the naming convention above.

4. **Write `site/sources/index.md`** — a table of every document: AD number, filename,
   unit, period covered, page count, and what it's been used for in the archive.

5. **Update references** in existing location and event pages — any `source:` or `notes:`
   field citing a bare AD number should reference the new repo path.

6. **Pull missing documents via DTIC** (Chrome required):
   - The HQ ORLL for period ending 31 Oct 1968 (LZ Carol; estimated AD0499xxx–AD0502xxx)
   - Any other gaps identified during step 1

7. **Alias ORLL-31-Jul-68.pdf** as AD393815 in the index.

---

## Notes on AD0515205 and AD0516259 (just added)

These were pulled 2026-07-09 specifically for FSB Guin research. Key content already extracted:

**AD0516259** (92pp, 1st Cav Div ORLL, period ending 31 Oct 1970):
- FSB table (p82): Powder Ridge confirmed (11–31 Aug, 2-8 Cav)
- FSB table (p83): Guin closed 26 Oct, taken over by 199th Infantry Brigade
- FSB table (p83): Silver (YT829043) reopened by 2-8 Cav 26 Oct
- Order of Battle (p61): 2-8 Cav at Silver, Binh Tuy, 3rd Bde, as of 31 Oct
- Contact narrative (p17): D/2-8 Cav contact at YT076214, 3 Sep 1970, 1420 hours

**AD0515205** (110pp, II Field Force Vietnam ORLL, period ending 31 Oct 1970):
- p30: Confirms FSB Guin at ZT100190 on 4 Sep; 15 Hoi Chanh ralliers to 2-8th Cav

Both should go to `site/sources/orll/` in the organization session.
