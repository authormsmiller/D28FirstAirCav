# Session Handoff — 2026-07-13
**Session 94**
**Theme:** 1970 KIA profiles completed — Flashner, Jackson, Alsup. ORLL mining (AD0511158,
AD0512505, AD0514678). Event pages for the March 17–18, 1970 Illingworth-area contacts.
Stub events for all remaining 1970 soldiers without coverage.

Continues from: `Handoff-Session92-Bonnelycke-Sarah-LZIke.md`

---

## Completed this session

### Profiles built (by hand, kia-profile-general pattern)

**flashner-kenneth** — `site/soldiers/flashner-kenneth/`
- CPL Kenneth Michael Flashner, D Co 2/8 Cav, KIA 1970-02-28, Tay Ninh Province
- DOB 1946-11-21, New Orleans, Orleans Parish, LA. MOS 11B10. Age: 23.
- Arrived 1969-12-07. Panel 13W/68.
- Last known location: FB Mary Gwen (XT526796, opened Feb 24 — four days prior)
- FSB Flashner (XT174982) named after him — confirmed AD0511158
- Rank discrepancy: E3 per Virtual Wall, CPL per Honor States/VVMF — CPL used
- Service ID 435689242 — DO NOT PUBLISH
- `related_events: contact-mary-gwen-1970-02-28`

**jackson-michael** — `site/soldiers/jackson-michael/`
- CPL Michael Charles Jackson, D Co 2/8 Cav, KIA 1970-03-17, Tay Ninh Province
- DOB 1949-09-10, Simi, Ventura County, CA. MOS 11C10 (mortarman). Age: 20.
- Arrived 1969-11-24. Panel 12W/13.
- Burial: Cardwell Cemetery, Dunklin County, MO
- No ORLL contact entry for March 17 — log jumps Mar 13 → Mar 18
- Honor States errors: county listed as Sonoma (should be Ventura); tour year listed
  as 1970 (should be 1969)
- Rank discrepancy: E3 per Virtual Wall, CPL per Honor States/VVMF — CPL used
- Service ID 500523678 — DO NOT PUBLISH
- `related_events: contact-illingworth-1970-03-17`

**alsup-stephen** — `site/soldiers/alsup-stephen/`
- SP4 Stephen John Alsup, D Co 2/8 Cav, WIA 1970-03-18, DOW 1970-04-06, Tay Ninh
- DOB 1949-08-19, Rumford, Providence County, RI. MOS 11C20 (mortarman). Age: 20.
- Arrived 1969-10-01. Panel 12W/99.
- Burial: Springvale Cemetery, East Providence, RI
- Wounded at XT045833 (~7km NE of Illingworth) — confirmed AD0512505 entry (n)
- Folder was saved as "alsup-steven" — renamed to "alsup-stephen" (all sources: Stephen)
- Service ID 036323653 — DO NOT PUBLISH
- `related_events: contact-dogs-head-1970-03-18`

---

### ORLLs mined and moved

**AD0511158** (IIFFV ORLL, period ending 30 Apr 1970)
- Copied from `KIA/flashner-kenneth/` to `site/sources/orll/1970/AD0511158.pdf`
- Key finds: FSB Flashner (XT174982) named after CPL Flashner KIA 28 Feb; March 8
  contact NW of FSB Flashner (3 US KIA, 15 US WIA); Illingworth April 1 (24 US KIA,
  54 US WIA); 2-8th Cav in 1st Brigade confirmed
- Added to ORLL index with references: flashner-kenneth, fsb-flashner, fsb-mary-gwen,
  fsb-illingworth

**AD0514678** (IIFFV ORLL, period ending 31 Jul 1970)
- Copied from `KIA/alsup-stephen/` to `site/sources/orll/1970/AD0514678.pdf`
- Covers Cambodian Incursion and post-incursion withdrawal. 2/8 Cav not in significant
  narrative (battalion-level detail is in companion 1st Cav Div ORLL AD0514580).
- Alsup's wounding (Mar 18) and death (Apr 6) fall in the prior period — covered by
  AD0511158, not this doc
- Added to ORLL index with reference: alsup-stephen

**AD0512505** (1st Cav Div ORLL, period ending 30 Apr 1970) — existing file, re-mined
- Index entry expanded with all 2/8 Cav significant contacts for March 1970:
  - (g) 040610 Mar XT178969, A Co 2-8: 60mm mortar, neg friendly cas
  - (i) 081625 Mar XT174982, C Co 2-8: 3 US KIA, 28 US WIA, 29 NVA KIA (FSB Flashner
    grid confirmed; note AD0511158 IIFFV summary undercounts WIA at 15)
  - (j) 090405 Mar FSB Flashner: ~175 rounds 82mm/107mm, 5 US WIA, 1 NVA KIA
  - (l) 120605 Mar XT17384, C Co 2-8: mortar/ground probe, neg friendly cas
  - (m) 131701 Mar XT183969, A Co 2-8: 2 US KIA, 6 US WIA, 12 NVA KIA
  - (n) 181110 Mar XT045833, 2-8 Cav: 14 US WIA, platoon-size force N/NE/S → ALSUP
  - NO entry for March 17 (Jackson's KIA) — log jumps (m)→(n)
  - (o) 261145 Mar XT077829, A&C Co 2-8: 3 US KIA, 22 US WIA, 8 NVA KIA (272nd Regt)
  - (p) 290415 Mar FSB Jay: 13 US KIA, 53 US WIA, 74 NVA KIA (primarily 2/7 Cav)
- References updated: added flashner-kenneth, alsup-stephen, jackson-michael, ware-frank

---

### Event pages created / updated

**contact-dogs-head-1970-03-18** — existing page, updated
- SP4 Stephen Alsup added as confirmed WIA (new `wia:` casualty block)
- Narrative updated: "Two D Company soldiers are now named to it" — Alsup (confirmed)
  and Wiseman (near-certain DOW)
- Jackson cross-reference added, pointing to new stub event
- `last_updated: 2026-07-13`

**contact-illingworth-1970-03-17** — new stub
- `site/events/contact-illingworth-1970-03-17/index.md`
- CPL Michael Jackson KIA, Tay Ninh Province, March 17, 1970
- Confirmed facts: date, province, unit, cause. Location unestablished.
- FSB Illingworth opened same day; Alsup wounded next day at XT045833
- No ORLL entry. NARA 2/8 Cav DSJ (RG 472, 17 Mar 1970) = required next source
- oq-02 (internal): pull NARA DSJ; check whether death connected to Illingworth opening

**contact-mary-gwen-1970-02-28** — new stub
- `site/events/contact-mary-gwen-1970-02-28/index.md`
- CPL Kenneth Flashner KIA, Tay Ninh Province, February 28, 1970
- Confirmed facts: date, province, unit, cause. Location: FB Mary Gwen probable
  (opened Feb 24, four days prior; fragmentation wounds consistent with firebase attack)
- No ORLL entry (AD0512505 or AD0511158). NARA 2/8 Cav DSJ = required next source
- FSB Flashner named after him — naming implies circumstances were notable
- oq-02 (internal): pull NARA DSJ; the naming of a firebase is unusual and worth explaining

---

### 1970 KIA roster — status at session end

All nine 1970 profiles are built and in the repo. All nine now have at least one event.

| Soldier | Date | Event(s) | Status |
|---|---|---|---|
| frierson-kenneth | 1970-01-25 | contact-hau-nghia-1970-01-25 | Published |
| rava-henry | 1970-02-18 | rava-friendly-fire-1970-02-18 | Published |
| flashner-kenneth | 1970-02-28 | contact-mary-gwen-1970-02-28 | Stub (new) |
| ware-frank | 1970-03-06 | contact-tay-ninh-1970-03-06 | Published |
| jackson-michael | 1970-03-17 | contact-illingworth-1970-03-17 | Stub (new) |
| alsup-stephen (DOW) | 1970-03-18 WIA / 1970-04-06 DOW | contact-dogs-head-1970-03-18 | Published |
| wiseman-richard (DOW) | 1970-03-18 WIA | contact-dogs-head-1970-03-18 | Published |
| gonder-kenneth | 1970-05-19 | gonder-mine-1970-05-19 | Published |
| waterman-craig | 1970-09-03 | contact-binh-tuy-1970-09-03 (×2) | Published |

No unbuilt 1970 KIAs remain in the KIA staging folder. All other KIA folders are
from other years (1966–1969, 1972).

---

## Outstanding research — 1970

| Item | Source needed | Notes |
|---|---|---|
| Jackson March 17 contact | NARA 2/8 Cav DSJ, RG 472, 17 Mar 1970 | No ORLL entry; circumstances unknown |
| Flashner Feb 28 contact | NARA 2/8 Cav DSJ, RG 472, 28 Feb 1970 | FB Mary Gwen probable location; naming of FSB Flashner suggests notable circumstances |
| Wiseman name-confirmation | NARA 2/8 Cav DSJ, RG 472, 18 Mar 1970 | Near-certain placement in contact-dogs-head; needs named confirmation |
| Jackson Honor States errors | — | County listed as Sonoma (should be Ventura); tour year listed as 1970 (should be 1969) |

---

## Carry-forward (ongoing from prior sessions)

1. **sargent-stan** — dedicated session pending; widow's transcript on file
2. **rosenberg-kenneth** — Virtual Wall / VVMF research pending (KIA 1972-05-10)
3. **weaver-ken rank** — confirm SGT directly with Ken when he sees the site
4. **R2 backfill** — run `node admin/scripts/backfill-r2.js` from repo root for photos
   registered in Sessions 48–49
5. **Stale workflow file** — `git rm .github/workflows/sync-photos.yml`
6. **`git rm --cached`** — remove committed photo binaries from git tracking
7. **Non-D Company roster classification** — Fanning, Jeffries, Colburn, Stanfield;
   needs `affiliation:` field before roster display is finalized
8. **Makowski VVMF Wall of Faces URL** — JS-rendered; needs browser visit to confirm
9. **scroggins-lanny `cause_of_death`** — value `oklahoma-city-bombing` outside standard
   enumeration; flag for template work
10. **McGrew calendar intake** — full calendar session pending
11. **Missing stubs** — caruthers-tom, kinsey-charles, ryneska-john, kahnke-steve,
    martin-michael, mcgrew-harold, bedsole-jim, louisell
12. **Lightbox index offset** (`SITE-BUG-20260518000025`)
13. **Event slug `[]` literal** (`ADMIN-BUG-20260518000022`)
14. **Fuzzy match scorer** (`ADMIN-BUG-20260518000024`)
15. **Email sending** (`INFRA-TASK-20260518000067`)

---

## Architecture reminders

- Event pages: `site/events/[slug]/index.md`
- ORLL index: `site/sources/orll/1970/index.md` (YAML entries separated by `---`)
- Service IDs in soldier notes = Army-era SSNs — **never publish**
- Rank discrepancy pattern: Virtual Wall records grade at loss (E3=PFC), Honor States /
  VVMF record administrative rank (CPL/SP4) — use the named-rank sources, note discrepancy
- Deploy: `npx wrangler deploy` from `site/`; push via GitHub Desktop only
