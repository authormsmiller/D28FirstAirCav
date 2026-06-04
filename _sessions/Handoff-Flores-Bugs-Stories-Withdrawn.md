# Session 51 Handoff — d281staircav

**Date:** 2026-05-29
**Branch:** `admin/2026-05-22` (continuing)
**Repo:** `https://github.com/authormsmiller/d281staircav`
**Deploy:** `npm run build` from `site/`, then `npx wrangler deploy` from `site/`. Push via GitHub Desktop only.

---

## What Was Completed This Session

### New Soldier Profile — David Cruz Flores

`site/soldiers/flores-david/flores-david.md` created. SP4, Skull Platoon, D/2-8 Cav, KIA May 10, 1972 Chinook crash. DOB August 20, 1952. Hometown: Agana, GU (Honor States shows DC — ignore; confirmed from separate sources). Wall: 1W/17. MOS: Infantryman.

Profile photo wired: `site/soldiers/flores-david/photos/profile/index.md` created with credit "Courtesy of Jim Garvin." R2 key: `soldiers/flores-david/profile/flores-david-profile.jpg`.

Profile surfaced correctly in the Recently Added feed on the homepage — confirmed the `sortByData("date_added")` filter is working.

**Profile photo field convention clarified this session:**
`profile_photo` in soldier front matter should be just the **filename** (e.g. `flores-david-profile.jpg`), not the full relative path. The template builds `/media/photos/soldiers/[slug]/profile/[profile_photo]`, so including the path doubles it.

Also fixed `aguilar-oscar.md` — same bug, corrected to just the filename.

The primary mechanism for profile photos is the `photos/profile/index.md` file. The `profile_photo` front matter field is a fallback only.

**R2 key for profile photos:** `soldiers/[slug]/profile/[filename]` — no `photos/` prefix. The backfill script strips the `photos/` directory level when building R2 keys.

---

### Bug Fix — `.eleventy.js` Null Bytes

Four null bytes (`\x00`) at the end of `.eleventy.js` were causing `SyntaxError: Invalid or unexpected token` on every build. Stripped with Python. Build is clean.

---

### Bug Fix — Request Form Hidden Required Fields

The `/request/` form was silently blocking submission when arriving via `?type=removal&story=...` because required fields on hidden type-specific blocks were failing browser validation. Fixed by:

- Changing `required` → `data-req="true"` on all type-specific fields (correction, contact, add, broken, privacy, removal, general blocks)
- Updated `selectType()` to toggle `.required = true/false` on fields in the active/inactive block

The common fields (`submitter_name`, `submitter_contact`) keep `required` since they are always visible.

---

### Skipper Stories — End-to-End Validation

Full submission loop tested and confirmed working:
- Submission from `/skipper-stories/` lands in R2 at `submissions/skipper-stories/pending/[id].json`
- Admin panel Skipper Stories subtab shows pending stories
- Approve moves story to `published/` — appears immediately on the public page without waiting for cron
- Removal link (`/request/?type=removal&story=[id]`) opens the request form pre-filled with story ID

**Email:** Admin notification email wired to `admin@angryskipperarchive.org`. The send was not confirmed during this session — investigate if emails are not arriving (see `INFRA-TASK-20260518000067`).

**Admin panel JSON error** (`Unexpected token '<'`) when loading Skipper Stories was observed but not fully root-caused. Stories still load — may be a timing/startup issue with `registerFeedbackRoutes`. Monitor.

---

### Withdrawn Story Status — New Feature

Added `withdrawn` as a soft-delete status for published Skipper Stories. Motivation: veterans may request removal but the content has archival value (and future Build My Book use). Discarding permanently was too destructive.

**Status lifecycle:**
- `pending` → auto-publish at 00:01 or manual Approve
- `held` → blocked from auto-publish
- `published` → live on public feed
- `withdrawn` → soft-deleted; removed from public feed, preserved in R2
- Restore → back to `published`

**Files changed:**

| File | Change |
|---|---|
| `site/src/worker.js` | Filter `status === "withdrawn"` from `/api/skipper-stories/published` response |
| `admin/lib/feedback.js` | Added `POST /api/feedback/stories/withdraw`, `POST /api/feedback/stories/restore`, `GET /api/feedback/stories/published`, `listPublishedStories()`, `setStoryStatus()` helper (stamps `withdrawn_at` / removes it on restore) |
| `admin/index.html` | Updated `renderStoryCard` — status label map includes withdrawn; pending cards show Approve/Hold/Discard; published cards show Withdraw; withdrawn cards show Restore. Added "Published & Withdrawn" collapsible section with Load button and `fbLoadPublishedStories()`, `fbWithdrawStory()`, `fbRestoreStory()` functions |

---

## State of the Site

The site is functionally complete for its primary mission. Features in place:

- Soldier profiles (KIA, WIA, living veterans) with photos, timelines, decorations, external links
- Event pages (Chinook crash, FSB Fontaine crash, NF34 memorial, others)
- Documents archive
- Skipper Stories — veteran submission, admin moderation, public feed, withdrawal
- Recently Added panel — surfaces new profiles and new stories on the homepage
- Contact info on file — signals reachable veterans to the community
- Request/contribute forms — corrections, contact lookups, adds, removals, general
- Admin panel — soldier management, photo management, feedback triage, Skipper Stories moderation

**What the site is waiting for:** data. More soldier profiles, more photos, more stories from veterans.

---

## Remaining Chinook KIA Work

### D Co. — 16 stubs still needed

Next alphabetically is `freitag-dieter`.

| Slug | Name | Rank | DOB | Hometown | Wall |
|---|---|---|---|---|---|
| `freitag-dieter` | Dieter Kuno Freitag | SGT | 1946-09-10 | Ft. Dix, NJ | 1W/17 |
| `groves-james` | James Douglas Groves | PVT | 1953-07-06 | Maysville, KY | 1W/17 |
| `henson-frank` | Frank Theodore Henson | SP4 | 1951-10-06 | Massapequa, NY | 1W/18 |
| `howell-donald` | Donald Edward Howell | SP4 | 1947-11-14 | Los Angeles, CA | 1W/19 |
| `jackson-freddie` | Freddie Jackson | SP4 | 1944-02-14 | Cocoa, FL | 1W/19 |
| `jensen-james` | James Christian Jensen | SGT | 1951-06-21 | Elsinore, UT | 1W/21 |
| `monteleone-gary` | Gary Robert Monteleone | SP4 | 1952-07-27 | Saugus, CA | 1W/20 |
| `phillips-dean` | Dean Anthony Phillips | PFC | 1951-11-14 | Tiro, OH | 1W/20 |
| `ray-jackie` | Jackie Ray | PVT | 1949-04-19 | Jackson, MI | 1W/21 |
| `ridgeway-richard` | Richard Ridgeway | SP4 | 1951-08-13 | Bloomington, IL | 1W/21 |
| `sablan-john` | John Tenerio Sablan | PFC | 1953-06-03 | Agana GU / Yigo GU* | 1W/21 |
| `saulsberry-clarence` | Clarence L. Saulsberry Jr. | SP4 | 1951-12-31 | Chicago, IL | 1W/22 |
| `shiko-raymond` | Raymond Joseph Shiko | SP4 | 1953-08-02 | Kingston, PA | 1W/22 |
| `sulser-david` | David Wesley Sulser | SP4 | 1951-10-28 | Galion, OH | 1W/22 |
| `wood-thomas` | Thomas Eugene Wood | PFC | 1953-08-16 | Tacoma, WA | 1W/22 |

*Sablan hometown discrepancy: honor roll says Agana GU, ASA newsletter says Yigo GU — verify before publishing.

**Also needed:**
- `rosenberg-kenneth` — enrich with VHPA incident link, DOB (1942-10-25), hometown (New York NY), Wall 1W/19
- `woo-robin` — add Skull Platoon (71–72), survivor/not-aboard note, event reference, incident link

Honor States URLs for remaining stubs are in `Handoff-Chinook-Crash-KIA.md`.

---

## Carry-Forward (Ongoing)

1. **sargent-stan** — Dedicated session pending; widow's transcript on file. Do not work piecemeal.
2. **weaver-ken rank** — Confirm SGT directly with Ken when he sees the site
3. **R2 backfill** — Run `node admin/scripts/backfill-r2.js` from repo root for: kint-joe-profile.jpg, woo-robin-profile.jpg, and photos from sessions 48–49. flores-david is already in R2 manually at the correct key.
4. **Stale workflow file** — `git rm .github/workflows/sync-photos.yml`
5. **`git rm --cached`** — Remove committed photo binaries from git tracking
6. **Non-D Company roster classification** — Fanning, Jeffries, Colburn, Stanfield; needs `affiliation:` field or equivalent
7. **Makowski VVMF Wall of Faces URL** — JS-rendered; needs Chrome or direct browser visit
8. **scroggins-lanny `cause_of_death`** — `oklahoma-city-bombing` outside standard enumeration; flag for template work
9. **McGrew calendar intake** — Full calendar session still pending
10. **Missing stubs** — caruthers-tom, kinsey-charles, ryneska-john, kahnke-steve, martin-michael, mcgrew-harold, bedsole-jim, louisell
11. **Kint Transcript Review** — Deferred from Session 49
12. **Lightbox index offset** (`SITE-BUG-20260518000025`)
13. **Event slug `[]` literal** (`ADMIN-BUG-20260518000022`)
14. **Fuzzy match scorer** (`ADMIN-BUG-20260518000024`)
15. **Email sending confirmation** (`INFRA-TASK-20260518000067`) — admin notification emails not confirmed working
16. **Admin panel Skipper Stories JSON error** — intermittent; monitor
17. **Skipper Stories seed data** — 1–2 curated stories per tab from existing archive material before broader launch
18. **Build My Book** — deferred; needs significant story volume first

---

## Architecture Notes

**Profile photo convention:** `profile_photo` field = filename only (e.g. `flores-david-profile.jpg`). Primary mechanism is `photos/profile/index.md`. R2 key: `soldiers/[slug]/profile/[filename]`.

**Withdrawn stories:** live in `submissions/skipper-stories/published/` with `status: "withdrawn"` and `withdrawn_at` timestamp. Worker filters them from the public feed. Admin can restore.

**Canonical template:** `site/soldiers/_template.md`
**Gold star rendering:** `status: kia | dow | mia`
**Platoon names:** Cat, Range, Skull (no numbers)
**CRLF** — repo built on Windows
**R2 key format** — `soldiers/[slug]/[subfolder]/[filename]`
**Deployment** — `npx wrangler deploy` from `site/`. Push via GitHub Desktop only.
