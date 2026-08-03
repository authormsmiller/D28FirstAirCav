# Session 59 Handoff — Chinook Crash Profiles

**Date:** 2026-06-10
**Branch:** `admin/2026-05-22` (continuing)
**Repo:** `https://github.com/authormsmiller/d281staircav`
**Deploy:** `npm run build` from `site/`, then `npx wrangler deploy` from `site/`. Push via GitHub Desktop only.

---

## What Was Completed This Session

### Profiles Built (7 new)

All Skull Platoon, D Co., chinook-crash-1972-05-10. Script run via kia-profile skill.

| Slug | Name | Rank | DOB | Hometown | Wall | Photo |
|---|---|---|---|---|---|---|
| `bowersock-steven` | Steven Edward Bowersock | PFC | 1951-09-25 | Lima, Allen County, OH | 1W/16 | ✓ (webp) |
| `burnett-edward` | Edward Denzel Burnett | SGT | 1951-12-06 | Jay, Delaware County, OK | 1W/16 | ✓ (webp) |
| `henson-frank` | Frank Theodore Henson | SP4 | 1951-10-06 | Massapequa, Nassau County, NY | 1W/18 | ✓ (webp) |
| `howell-donald` | Donald Edward Howell | SP4 | 1947-11-14 | Los Angeles, Los Angeles County, CA | 1W/19 | ✓ (jpg) |
| `jackson-freddie` | Freddie Jackson | SP4 | 1944-02-14 | Cocoa, Brevard County, FL | 1W/19 | ✓ (jpg) |
| `jensen-james` | James Christian Jensen | SGT | 1951-06-21 | Elsinore, Sevier County, UT | 1W/21 | ✓ (webp) |
| `monteleone-gary` | Gary Robert Monteleone | SP4 | 1952-07-27 | Saugus, Los Angeles County, CA | 1W/20 | ✓ (jpg) |

---

### Photo Work

**bowersock-steven**
- Profile: `bowersock-steven-profile.webp`
- Field: `Bowersock_Steven_Edward_DOB_1951-1.webp`, `PFCStevenEdwardBowersock1972.webp` — generic captions, no credit
- Note: `henson-frank-profile.jpg` (wrongly placed by script) sits in profile folder unreferenced — delete manually when possible

**burnett-edward**
- Profile: `burnett-edward-profile.webp` — no field photos

**henson-frank**
- Profile: `henson-frank-profile.webp`, credited to Robin Woo (Bien Hoa, April 1972)
- Woo photos: `henson-woo1–4.jpg` added to `woo-robin` field folder with `photographer: woo-robin`, `contains: henson-frank`, date 1972
- Source: Robin Woo Facebook post — "I took these pictures of Frank in Bien Hoa... around April 1972... He posed for me holding an AK-47."
- Note: `henson-frank-profile.jpg` (wrongly placed by script) sits in profile folder unreferenced — delete manually when possible

**howell-donald**
- Profile: `howell-donald-profile.jpg`
- Field: `howell-coffee.jpg`, `minesweeping-howell.png` — generic captions, no credit, `contains: howell-donald`

**jackson-freddie**
- Profile: `jackson-freddie-profile.jpg` — no field photos

**jensen-james**
- Profile: `jensen-james-profile.webp` — no profile credit
- Field photo 1: `jay-with-3-friends-Fort-Ord-1971-1.webp` — "James Jensen (second from left) with friends at Fort Ord, 1971." No credit. `contains: jensen-james`
- Field photo 2: `jensen-monteleone-video-still.jpg` — `photographer: monteleone-gary`, `contains: jensen-james`. Source FB link in admin notes.
- **KIA timeline enriched:** "Before boarding the flight, James had sent a dozen roses to his fiancée back home. The flowers arrived after she learned of his death."
- Admin notes: fiancée identified as Kathy Chadwick (public FB comment); FB source link logged

**monteleone-gary**
- Profile: `monteleone-gary-profile.jpg`
- Field (6 photos), all credit "From the Collection of Gary Monteleone, Courtesy of Jesse Monteleone":
  - `monteleone-airstrip.png` — "Gary Monteleone at an airstrip." `contains: monteleone-gary`
  - `monteleone-bush.png` — "Gary Monteleone in the bush." `contains: monteleone-gary`
  - `monteleone-crooked.jpg` — "Gary Monteleone, Bien Hoa." `contains: monteleone-gary`
  - `monteleone-finger.jpg` — "Gary Monteleone (rear) at a firebase." `contains: monteleone-gary`
  - `soldiers-road.png` — "Soldiers on a road." No contains (uncertain)
  - `training-platoon-monteleone.jpg` — "Gary Monteleone with his Basic Combat Training platoon — A-4-1 BCT, 3rd Platoon, Fort Ord, California, April 27, 1971." `date: 1971-04-27`, `date_known: true`, `contains: monteleone-gary`
- Source: Never Forgotten 34 Facebook group post by Jesse Monteleone (nephew)
- Admin notes: Firebase Amie and Melanie noted as short-duration postings; BCT/Fort Ord connection to Jensen noted

---

### jackson-freddie — Arrived Date Flag

`arrived: 1970-11-08` (Virtual Wall) — Nov 1970 to May 1972 is ~18 months, longer than a standard tour. Either re-enlisted/extended, or date should be 1971-11-08. Flagged in admin notes. **Verify before publishing.**

---

## Remaining Chinook KIA Work

### D Co. Skull Platoon — 8 new stubs still needed

| Slug | Name | Rank | DOB | Hometown | Wall |
|---|---|---|---|---|---|
| `phillips-dean` | Dean Anthony Phillips | PFC | 1951-11-14 | Tiro, OH | 1W/20 |
| `ray-jackie` | Jackie Ray | PVT | 1949-04-19 | Jackson, MI | 1W/21 |
| `ridgeway-richard` | Richard Ridgeway | SP4 | 1951-08-13 | Bloomington, IL | 1W/21 |
| `sablan-john` | John Tenerio Sablan | PFC | 1953-06-03 | Agana GU / Yigo GU* | 1W/21 |
| `saulsberry-clarence` | Clarence L. Saulsberry Jr. | SP4 | 1951-12-31 | Chicago, IL | 1W/22 |
| `shiko-raymond` | Raymond Joseph Shiko | SP4 | 1953-08-02 | Kingston, PA | 1W/22 |
| `sulser-david` | David Wesley Sulser | SP4 | 1951-10-28 | Galion, OH | 1W/22 |
| `wood-thomas` | Thomas Eugene Wood | PFC | 1953-08-16 | Tacoma, WA | 1W/22 |

*Sablan hometown discrepancy: honor roll says Agana GU, ASA newsletter says Yigo GU — verify before publishing.

### Also needed

- `flores-david` — thin stub exists; needs full skill build (Honor States, Virtual Wall, Wall of Faces HTML saves required)
- `rosenberg-kenneth` — existing stub; enrich with DOB (1942-10-25), hometown (New York, NY), Wall 1W/19, VHPA incident link
- `woo-robin` — existing stub; add Skull Platoon (71–72), survivor/not-aboard note, event reference, VHPA incident link

Honor States URLs for remaining stubs are in `Handoff-Chinook-Crash-KIA.md`.

---

## R2 / Deploy Checklist

Run `node admin/scripts/backfill-r2.js` from repo root before deploying — new profile photos from this session not yet in R2.

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
18. **CSS sync** — `xcopy /E /Y assets _site\assets` needed after any `main.css` change (footnote styles won't be live otherwise)
19. **Documents tab wiring — sargent-stan** — verify Linda Martin PDF link resolves on live site
20. **Roster duplicate sweep** — Range and Skull platoons likely have roster.json entries for soldiers who now have profiles; run before next deploy
21. **henson-frank-profile.jpg** — orphaned file in `henson-frank/photos/profile/`; delete manually
