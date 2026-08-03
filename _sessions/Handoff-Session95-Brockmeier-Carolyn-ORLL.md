# Session Handoff — 2026-07-13
**Session 95**
**Theme:** brockmeier-thomas profile built and corrected. gulley-houston confirmed B Company
and removed from archive. AD0505650 (1st Cav Div Arty ORLL, May–Jul 1969) filed and indexed.
LZ Carolyn overrun casualty figures established.

Continues from: `Handoff-Session94-1970KIAs-EventPages.md`

---

## Completed this session

### Profile built

**brockmeier-thomas** — `site/soldiers/brockmeier-thomas/`
- PFC Thomas Michael Brockmeier, D Co 2/8 Cav, DOW 1970-03-07, Hau Nghia Province
- DOB 1949-08-20, Marietta, Washington County, OH. MOS 11B10. Age: 20.
- Arrived 1969-10-16. Panel 13W/91.
- Burial: New St. Mary Cemetery, Marietta, OH
- Casualty: hostile, died of wounds, small arms fire, ground casualty
- Incident date NOT RECORDED (Virtual Wall) — March 7 is date of death only
- No rank discrepancy — PFC (E3) consistent across all sources
- Platoon: unknown
- Service ID 431961053 — DO NOT PUBLISH (wait — that's Gulley's ID; Brockmeier's is 296445624)
- `related_events: contact-hau-nghia-1970-03-07`

**Script warning:** The kia-profile-general skill's `build_profile.py` injects Chinook
defaults regardless of soldier — Skull Platoon, VHPA link, crash narrative, and a
relationships.json entry linking the soldier to all 20 Skull Platoon peers. For any
non-Chinook soldier, **do not use the script**. Build manually from parsed HTML sources.
This session caught and corrected all injected defaults before committing.

---

### Event page created

**contact-hau-nghia-1970-03-07** — `site/events/contact-hau-nghia-1970-03-07/index.md`
- PFC Thomas Brockmeier DOW, Hau Nghia Province, March 7, 1970
- Stub. Date of death confirmed; wounding date and grid unknown.
- ORLL analysis documented: March 7 significant contact (h) in AD0512505 is C Co at
  XT178986 (Tay Ninh) — separate company, separate province, no KIA. Not Brockmeier.
- D Co's Hau Nghia / Dog's Head AO corroborated by ORLL entry (n) at XT045833 (Mar 18).
- Required next source: NARA 2/8 Cav DSJ (RG 472, early March 1970)

---

### Soldier dismissed

**gulley-houston** — removed from KIA staging folder; not in archive
- SP4 Houston Gulley, B Co 2/8 Cav (confirmed: Virtual Wall, Honor States both B Co)
- 1cda roster entry for D Company is wrong — two independent primary sources say B Co
- Casualty type: Non-hostile, died of other causes (July 2, 1969, Tay Ninh Province)
- Not on Garvin's site; B Company; non-hostile — does not belong in this archive

---

### ORLL filed

**AD0505650** — `site/sources/orll/1969/AD0505650-orll-1cav-arty-jul69.pdf`
- 1st Cav Div Artillery ORLL, period ending 31 July 1969 (covers 1 May – 31 Jul 1969)
- 25 pages. Companion to AD0506273 (divisional HQ, same period).
- DTIC page shows "AD505650" (6 digits) — correct accession is AD0505650 (7 digits);
  original FSB table entry "AD504499" is a separate transcription error, not this doc.
- Added to `site/sources/orll/1969/index.md`
- Key finding: **LZ Carolyn overrun, May 6, 1969** — 9 US KIA, 64 US WIA, 101 NVA KIA.
  Regimental enemy force. Attack ~0200–0600. Ammo and POL dumps destroyed. Firing batteries
  B/2/19 and B/1/30; 9 sections A/2/20 ARA. B/1/30 suffered 25 WIA within the battery.
  Enemy captured/destroyed: 42 AK-47s, 6 SKSs, 11 RPG-2s, 3 RPG-7s, 9 RPG-MGs, 2 x 60mm.
  No D Co 2/8 Cav soldier-level KIA data — artillery ORLLs track unit engagements, not
  infantry casualties by name.
- Also logged same night (May 6): LZ JOE attacked — 4 US KIA, 25 US WIA.
  May 12–13: LZ JAMIE — 7 US KIA, 35 US WIA; LZ GRANT — 5 US KIA, 40 US WIA.

---

### ORLL index updates

**AD0512505** (1st Cav Div, Apr 1970) — added:
- `brockmeier-thomas` to references
- Entry (h) 070630 Mar XT178986, C Co 2-8 Cav: 10 US WIA, 14 NVA KIA — documented in
  notes with explanation that this is separate from Brockmeier's D Co/Hau Nghia contact

---

## 1970 KIA roster — status at session end

All nine 1970 profiles built. All nine have at least one event.

| Soldier | Date | Event(s) | Status |
|---|---|---|---|
| frierson-kenneth | 1970-01-25 | contact-hau-nghia-1970-01-25 | Published |
| rava-henry | 1970-02-18 | rava-friendly-fire-1970-02-18 | Published |
| flashner-kenneth | 1970-02-28 | contact-mary-gwen-1970-02-28 | Stub |
| ware-frank | 1970-03-06 | contact-tay-ninh-1970-03-06 | Published |
| brockmeier-thomas | 1970-03-07 | contact-hau-nghia-1970-03-07 | Stub (new) |
| jackson-michael | 1970-03-17 | contact-illingworth-1970-03-17 | Stub |
| alsup-stephen (DOW) | 1970-03-18 / 1970-04-06 | contact-dogs-head-1970-03-18 | Published |
| wiseman-richard (DOW) | 1970-03-18 | contact-dogs-head-1970-03-18 | Published |
| gonder-kenneth | 1970-05-19 | gonder-mine-1970-05-19 | Published |
| waterman-craig | 1970-09-03 | contact-binh-tuy-1970-09-03 (×2) | Published |

---

## Outstanding research — 1970

| Item | Source needed | Notes |
|---|---|---|
| Brockmeier wounding date + grid | NARA 2/8 Cav DSJ, RG 472, early Mar 1970 | Death date Mar 7 confirmed; wounding date not recorded; D Co Dog's Head AO established |
| Jackson March 17 contact | NARA 2/8 Cav DSJ, RG 472, 17 Mar 1970 | No ORLL entry; circumstances unknown |
| Flashner Feb 28 contact | NARA 2/8 Cav DSJ, RG 472, 28 Feb 1970 | FB Mary Gwen probable; FSB Flashner naming suggests notable circumstances |
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
16. **FSB Carolyn source** — original FSB table citation "AD504499" is a transcription
    error; correct doc is AD0505650, now in collection. Update FSB table entry for Carolyn
    to cite AD0505650 with confirmed overrun figures (9 US KIA, 64 US WIA, 101 NVA KIA).

---

## Architecture reminders

- Event pages: `site/events/[slug]/index.md`
- ORLL indexes: `site/sources/orll/[year]/index.md` (YAML entries separated by `---`)
- Service IDs in soldier notes = Army-era SSNs — **never publish**
- Rank discrepancy pattern: Virtual Wall records grade at loss (E3=PFC), Honor States /
  VVMF record administrative rank (CPL/SP4) — use the named-rank sources, note discrepancy
- **Do not use `build_profile.py` for non-Chinook soldiers** — script injects Skull Platoon,
  VHPA incident link, Chinook crash narrative, and relationships.json peer links regardless
  of soldier. Build non-Chinook profiles manually from parsed HTML sources.
- Deploy: `npx wrangler deploy` from `site/`; push via GitHub Desktop only
