# Session 60 Handoff — Chinook Crash Profiles

**Date:** 2026-06-10
**Branch:** `admin/2026-05-22` (continuing)
**Repo:** `https://github.com/authormsmiller/d281staircav`
**Deploy:** `node admin/scripts/backfill-r2.js` from repo root first, then `npm run build` from `site/`, then `npx wrangler deploy` from `site/`. Push via GitHub Desktop only.

---

## What Was Completed This Session

### Profiles Built (8 new)

All Skull Platoon, D Co., chinook-crash-1972-05-10. Script run via kia-profile skill.

| Slug | Name | Rank | DOB | Hometown | Wall | Photo |
|---|---|---|---|---|---|---|
| `phillips-dean` | Dean Anthony Phillips | PFC | 1951-11-14 | Tiro, Crawford County, OH | 1W/20 | ✓ png, Garvin |
| `ray-jackie` | Jackie Ray | PVT | 1949-04-19 | Jackson, Jackson County, MI | 1W/21 | ✓ png, Garvin |
| `ridgeway-richard` | Richard Ridgeway | SP4 | 1951-08-13 | Bloomington, McLean County, IL | 1W/21 | ✓ webp, no credit |
| `sablan-john` | John Tenerio Sablan | PFC | 1953-06-03 | Agana, Guam* | 1W/21 | ✓ png, Garvin |
| `saulsberry-clarence` | Clarence Lawe Saulsberry Jr. | SP4 | 1951-12-31 | Chicago, Cook County, IL | 1W/22 | ✓ jpg |
| `shiko-raymond` | Raymond Joseph Shiko | SP4 | 1953-08-02 | Kingston, Luzerne County, PA | 1W/22 | ✓ jpg |
| `sulser-david` | David Wesley Sulser | SP4 | 1951-10-28 | Galion, Crawford County, OH | 1W/22 | ✓ png, no credit |
| `wood-thomas` | Thomas Eugene Wood | PFC | 1953-08-16 | Tacoma, Pierce County, WA | 1W/22 | ✓ webp, no credit |

*Sablan hometown discrepancy: honor roll says Agana GU, ASA newsletter says Yigo GU — verify before publishing.

---

### Photo Work

**phillips-dean**
- Profile: `phillips-dean-profile.png`, credit "Courtesy of Jim Garvin"

**ray-jackie**
- Profile: `ray-jackie-profile.png`, credit "Courtesy of Jim Garvin"
- Field: `jackie-ray-bush.jpg` — "Jackie Ray in the bush.", no credit
- Field: `jackie-ray-m16.jpg` — "Jackie Ray holding an M-16.", no credit
- ⚠ `ray-jackie-profile.jpg` orphaned in `ray-jackie/photos/profile/` — delete manually

**ridgeway-richard**
- Profile: `ridgeway-richard-profile.webp`, no credit

**sablan-john**
- Profile: `sablan-john-profile.png`, credit "Courtesy of Jim Garvin"
- Field: `sablan-john-and-soldier.jpg` — "John Sablan with an unidentified soldier.", no credit
- ⚠ `sablan-john-profile.jpg` orphaned in `sablan-john/photos/profile/` — delete manually

**saulsberry-clarence**
- Profile: `saulsberry-clarence-profile.jpg`
- Field (4 photos, all no credit, contains: saulsberry-clarence):
  - `Saulsberry-Clarence-Lawrence-jh-jm-jr-lt-6-.jpg` — "Clarence Saulsberry with his training company."
  - `Clarance-Saulsberry3-scaled.jpg` — "Clarence Saulsberry (middle) with two unknown soldiers in the bush."
  - `Clarance-Saulsberry2-scaled.jpg` — "Clarence Saulsberry (left) taking a break."
  - `saulsberry-dancing.png` — "Clarence Saulsberry having a good time during some R&R."

**shiko-raymond**
- Profile: `shiko-raymond-profile.jpg`
- Field: `shiko-peace.png` — "Raymond Shiko flashing the peace sign.", no credit
- Note: `RayShiko-on-left.webp` placed in **woo-robin** field photos — "Ray Shiko (left) with an unidentified soldier and Frank Henson (right)." Credit: Robin Woo · 1972. `contains: shiko-raymond, henson-frank`

**sulser-david**
- Profile: `sulser-david-profile.png`, no credit

**wood-thomas**
- Profile: `wood-thomas-profile.webp`, no credit
- Field: `thomas-wood-in-barracks.jpg` — "Thomas Wood in the barracks having a smoke." Credit: "Courtesy of Linda Meredith, Never Forgotten 34"

---

### Other Photo Work

**burnett-edward**
- Field added: `berry-burnett.jpg` — "Skull Platoon, 1972. From left: unidentified soldier, unidentified soldier, unidentified soldier, Dave Berry, Dean Phillips, Edward Burnett." Credit: "Photo courtesy of Dava Miller (daughter of Dave Berry)." `contains: berry-dave, phillips-dean, burnett-edward`

**howell-donald**
- Field added: `howell-saulsberry.jpg` — "Donald Howell (left) and Clarence Saulsberry during a break in the rear." Credit: "Photo courtesy of Joyce Jordan Hooke, Never Forgotten 34." `contains: howell-donald, saulsberry-clarence`

**dillon-stan**
- Field added: `dillon-bible-042071.jpg` — Stan Dillon's New Testament with VC bullet, stopped at 2 Corinthians 5:7. Credit: "Photo courtesy of Jim Garvin." Event: `contact-fsb-fontaine-1971-04-20`. `contains: dillon-stan`

---

### New Stub

**berry-dave**
- Skull Platoon, D/2-8 Cav, 1971–1972. Not aboard the May 10, 1972 Chinook crash. Died 2023.
- Contact: Dava Miller (daughter) — logged in stub
- All service details unknown — pending research
- Facebook group (Never Forgotten 34) flagged as primary research source

---

### Event Work

**chinook-crash-1972-05-10**
- Status changed to `published`
- A/1-12 Cav passenger count corrected: 6 → 7 in `kia_count_note`
- `archivist_notes` updated: `last_updated: 2026-06-10`, session `18-19, 59-60`, stub list updated to all 21 D Co. stubs
- Added `links` block: Spectrum News 1 article — Marj Graves, combat nurse, body identification account (2023-11-06)
- Added body paragraph: **Hospital reception** — Gary Sellenrick, 24th Evacuation Hospital, call sign Queen Tonic, radio call ~1010 hours, ward opened for 34 remains. Source: NF34 Facebook group.
- Added body paragraph: **Body identification** — Marj Graves account
- Sellenrick and Graves added to `archivist_notes.sources`

---

### Script/Workflow Note

The `kia-profile` script grabs any `.jpg` at the top level of the KIA slug folder as the profile photo. To prevent wrong photos being grabbed, use a `field/` subfolder for non-profile photos (established this session). An `info.txt` in the field folder is a clean way to pass caption/credit metadata.

---

## Open Flags

- **`sablan-john` hometown** — Agana GU (honor roll) vs. Yigo GU (ASA newsletter); verify before publishing
- **`jackson-freddie` arrived date** — 1970-11-08 (Virtual Wall); Nov 1970 to May 1972 is ~18 months; verify if extended tour or date should be 1971-11-08
- **Chinook event `images` block** — `filename: ""` placeholder for Adams departure photo; template handles blank gracefully but fill when photo is located
- **Never Forgotten 34 Facebook group** — Michael joining; dedicated research session(s) planned for berry-dave and broader Skull Platoon enrichment

---

## Remaining Chinook KIA Work

All 21 D Co. stubs complete. Remaining:
- `flores-david` — thin stub exists; needs full skill build
- `rosenberg-kenneth` — existing stub; enrich with DOB (1942-10-25), hometown (New York, NY), Wall 1W/19, VHPA incident link
- `woo-robin` — existing stub; add Skull Platoon (71–72), survivor/not-aboard note, event reference, VHPA incident link

---

## Deploy Checklist

1. `node admin/scripts/backfill-r2.js` from repo root — new photos from sessions 59–60 not yet in R2
2. `npm run build` from `site/`
3. `npx wrangler deploy` from `site/`
4. Push via GitHub Desktop

---

## Carry-Forward (Ongoing)

1. **sargent-stan** — Dedicated session pending; widow's transcript on file. Do not work piecemeal.
2. **weaver-ken rank** — Confirm SGT directly with Ken
3. **git rm --cached** — Remove committed photo binaries from git tracking
4. **Stale workflow file** — `git rm .github/workflows/sync-photos.yml`
5. **Non-D Company roster classification** — Fanning, Jeffries, Colburn, Stanfield
6. **Makowski VVMF Wall of Faces URL** — JS-rendered; needs Chrome
7. **scroggins-lanny `cause_of_death`** — outside standard enumeration; flag for template work
8. **McGrew calendar intake** — Full calendar session pending
9. **Missing stubs** — caruthers-tom, kinsey-charles, ryneska-john, kahnke-steve, martin-michael, mcgrew-harold, bedsole-jim, louisell
10. **Kint Transcript Review** — Deferred from Session 49
11. **Lightbox index offset** (`SITE-BUG-20260518000025`)
12. **Event slug `[]` literal** (`ADMIN-BUG-20260518000022`)
13. **Fuzzy match scorer** (`ADMIN-BUG-20260518000024`)
14. **Email sending confirmation** (`INFRA-TASK-20260518000067`)
15. **Admin panel Skipper Stories JSON error** — intermittent; monitor
16. **Skipper Stories seed data** — 1–2 curated stories per tab before broader launch
17. **Build My Book** — deferred; needs significant story volume first
18. **CSS sync** — `xcopy /E /Y assets _site\assets` needed after any `main.css` change
19. **Documents tab wiring — sargent-stan** — verify Linda Martin PDF link resolves on live site
20. **Roster duplicate sweep** — Range and Skull platoons likely have roster.json entries for soldiers who now have profiles; run before next deploy
21. **henson-frank-profile.jpg** — orphaned file in `henson-frank/photos/profile/`; delete manually
22. **ray-jackie-profile.jpg** — orphaned file in `ray-jackie/photos/profile/`; delete manually
23. **sablan-john-profile.jpg** — orphaned file in `sablan-john/photos/profile/`; delete manually
24. **berry-dave** — new stub; needs full research (rank, DOB, hometown, arrived/departed); NF34 Facebook group primary source
