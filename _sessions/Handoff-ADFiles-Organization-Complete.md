# Session Handoff — AD Files Organization
**Date written:** 2026-07-10
**Covers:** source library build, date extraction findings, OPCON research notes
**Prior handoff for other site context:** session-90 handoff

---

## What was built

`site/sources/` is a new directory in the repo containing all ingested DTIC documents,
organized by type and year:

```
site/sources/
  index.md                    ← master registry (all docs, all types)
  orll/
    1967/  index.md + 3 PDFs + 1 OCR .md
    1968/  index.md + 2 PDFs
    1969/  index.md + 3 PDFs
    1970/  index.md + 5 PDFs
    1971/  index.md + 2 PDFs
  sodr/
    1970/  index.md + 1 PDF
    1971/  index.md + 1 PDF
    1972/  index.md + 1 PDF
  other/
    index.md + 3 PDFs
```

Each year folder has an `index.md` with YAML-style metadata blocks (name, type, unit,
start_date, end_date, pages, file, source, references, notes). The master `index.md`
has full tables by unit type plus a gaps section and a duplicates-resolved section.

**Naming convention used:** `AD[number]-[type]-[unit-abbrev]-[period-end-mon+yr].pdf`

---

## Date extraction findings — corrections to prior inventory

The handoff that preceded this session (Handoff-ADFiles-Organization.md) had two period
labels swapped for the 1967 ORLLs. Confirmed from document cover pages:

| AD Number | Prior label | Correct period |
|---|---|---|
| AD0386215 | "likely Oct 1967" | **31 Jul 1967** |
| AD0387543 | "likely Jul 1967" | **31 Oct 1967** |

All other previously-confirmed periods were verified and unchanged.

**New confirmations from this session:**

| AD Number | Period confirmed |
|---|---|
| AD0502597 | 31 Jan 1969 |
| AD0509007 | 31 Jan 1970 (1st Cav Div Artillery) |
| AD0509704 | 31 Jan 1970 |
| AD0512505 | 30 Apr 1970 |
| AD0518422 | 30 Apr 1971 |

---

## Surprises and anomalies resolved

**orll-30apr71.pdf** (in locations/) — the AD number on its cover page is **AD515205**.
It is a duplicate of AD0515205 (II FFV Oct 1970 ORLL) with a completely wrong filename.
Not a new document. Was not ingested; noted in the master index as a resolved duplicate.

**AD0394510** — not a 1st Cav Div document. It is the **173d Airborne Brigade** ORLL,
period ending 31 Jul 1968. Appears to have been downloaded in error while searching for
the missing 1st Cav Apr 1968 ORLL. Filed in `other/`; noted accordingly.

**AD0390613** — not an ORLL. It is a **Combat Action Report** for Operation PERSHING,
Battle of Tam Quan, November 1967. Filed in `other/`. (Note: this is the same document
cited in multiple event pages as "1st Brigade Combat AAR for Battle of Tam Quan.")

**AD0824627** (Lincoln/Mosby I CAAR, 62 pp) — found in `locations/new/`. Already in the
repo as `events/operation-lincoln-1966/sources/CAAR-Op-Lincoln-Op-Mosby-I-1966-min.pdf`
(slightly compressed, identical page count). The DTIC copy was added to `other/` as
`AD0824627-caar-lincoln-mosby-i-1966.pdf` to give it an AD-numbered canonical entry.

---

## Known gaps — priority targets for future sessions

| Period | Unit | Notes |
|---|---|---|
| 31 Oct 1968 | 1st Cav Div HQ ORLL | **Highest priority.** LZ Carol context. Estimated AD0499xxx–AD0502xxx. Cannot use Chrome — download manually from DTIC. |
| 30 Apr 1968 | 1st Cav Div HQ ORLL | Unknown AD number. |
| 31 Jul 1968 | 1st Cav Div HQ ORLL | Artillery ORLL for this quarter exists (AD0393815); HQ ORLL missing. |
| 30 Apr 1969 | 1st Cav Div HQ ORLL | Unknown AD number. |
| 31 Jul 1970 | 1st Cav Div HQ ORLL | Unknown AD number. |
| 31 Jul 1971 | 1st Cav Div HQ ORLL | Unknown AD number. |

DTIC search URL pattern: `https://apps.dtic.mil/sti/citations/AD[number]`
The Oct 1968 gap is in the AD0499xxx–AD0502xxx range; try sequential IDs in that band.
AD0502597 (Jan 1969 ORLL) is already in the collection — so the Oct 1968 doc is somewhere
below that number.

---

## OPCON history reconstructed

This session also mapped 2/8 Cav's known OPCON assignments across its Vietnam service.
Relevant for journal research in NARA RG 472 — the battalion's records during OPCON
periods may be filed under the parent unit rather than 2/8 Cav or 1st Brigade directly.

| Period | Parent unit | Source |
|---|---|---|
| Late Jul – ~19 Aug 1967 | 3d Brigade, 1st Cav Div (temporary) | AD0387543 OCR; song-re-valley-1967 event page |
| 17 Sep – 14 Oct 1967 | 173d Airborne Brigade | AD0387543 OCR; operation-bolling-1967 event page |
| ~21 Jul – 26 Aug 1968 | 2nd Brigade, 1st Cav Div | lz-carol-1968 event page |
| Nov 1968 – Apr 1969 | 2nd Brigade, 1st Cav Div | operation-sheridan-sabre-1968 event page; AD0502597 |
| May 1970 | **Uncertain** — rebrigading in progress | See note below |
| By Sep 1970 | 3rd Brigade, 1st Cav Div | AD0516259 order of battle (p. 61) |
| Oct 1970 – Mar 1971 | 3rd Brigade, 1st Cav Div | AD0516259; event pages |
| Apr 1971 – Jun 1972 | 3rd Brigade (Separate) "Garryowen" TF | 3rd-brigade-separate-garryowen-1971 event page |

**May 1970 note:** The rebrigading from 2nd Brigade to 3rd Brigade occurred sometime between
the Apr 1970 ORLL (AD0512505) and the Oct 1970 ORLL (AD0516259). The exact date is not
confirmed. For events in May–Aug 1970 (Cambodia Incursion, Gonder mine 19 May), check
all three possibilities in RG 472: 2/8 Cav directly, 2nd Brigade, 3rd Brigade.

---

## Event pages updated with OPCON research notes

The following pages had "NARA RG 472" journal references that did not specify the filing
unit. Brief researcher notes were added to each:

| Page | Note added |
|---|---|
| contact-binh-tuy-1970-09-03 | 3rd Brigade, 1st Cav Div |
| contact-binh-tuy-1970-09-03-d28cav | 3rd Brigade, 1st Cav Div |
| contact-trotter-1971-02-02 | 3rd Brigade, 1st Cav Div (pre-stand-down) |
| getter-malaria-1971-03-16 | 3rd Brigade, 1st Cav Div (pre-stand-down) |
| gonder-mine-1970-05-19 | Uncertain — check 2/8 Cav, 2nd Bde, 3rd Bde all |

Pages that were already self-explanatory (operation-bolling-1967, lz-carol-1968,
operation-sheridan-sabre-* series) were not modified.

---

## Files that remain in locations/ and KIA/ (not yet cleaned up)

The source library copies files *into* `site/sources/` but does not delete the originals
from `locations/` and `KIA/`. The originals can be cleaned up once the site/sources/
copies are confirmed good. Specifically:

- `locations/` — all AD*.pdf files are now duplicated in site/sources/
- `KIA/yates-donald/AD0385642.pdf` — now in orll/1967/
- `KIA/yates-donald/AD0509704.pdf` — now in orll/1970/ (duplicate; the locations/ copy was used)
- `KIA/pipher-carl/AD0502597.pdf` — now in orll/1969/
- `KIA/wiseman-richard/AD0509767.pdf` — now in sodr/1970/
- `KIA/wiseman-richard/AD0512505.pdf` — now in orll/1970/
- `KIA/paulson-john/AD0390613.pdf` — now in other/
- `KIA/AD0506273.pdf` — now in orll/1969/
- `KIA/AD0520447.pdf` — duplicate of sodr/1971/ copy; discard

`locations/orll-30apr71.pdf` — confirmed duplicate of AD0515205; safe to delete.
