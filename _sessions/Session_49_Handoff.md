# Session 49 Handoff — d281staircav

**Date:** 2026-05-27
**Branch:** `admin/2026-05-22` (continuing)
**Repo:** `https://github.com/authormsmiller/d281staircav`
**Deploy:** Push via GitHub Desktop only — terminal pushes fail (msm-illumia account lacks push access).

---

## What Was Completed This Session

### Profile Standardization — Complete

Every soldier profile in `site/soldiers/` is now on the canonical template. All 43 profiles have `permalink`, `tags: - soldier`, `# ── RANK & ASSIGNMENT ──`, and `# ── ADMIN ──` sections. The old stub format (`family_contact:`, flat YAML, no section headers) is fully retired.

**Group 4 — Migrated:**

| Slug | Notes |
|---|---|
| miller-marvin-dale | Added all missing sections; `phase: in-country` added to all timeline entries; related_events filled |
| cate-larry | Full rewrite from stub; arrived late 1970; door gunner ~Jul 1971; departed late 1971; died 2011; widow Janice Cate |
| davis-kirk | Missing sections added; chieu-hoi event linked |
| romani-val | LT/Cat 6 confirmed from anecdote sources; status veteran confirmed |
| sells-leroy | Died March 29, 2022 (confirmed this session) |
| weaver-ken | Rank cleared — to confirm with Ken directly |

**Group 2 Verify — Fixed:**

| Slug | Notes |
|---|---|
| bacon-wg | Migrated from old stub |
| garvin-jim | Fixed service_record field names (role/date_from/date_to → label/from/to); decorations_unconfirmed added; contact.relation filled |
| woo-robin | Migrated from old stub; woo-robin-profile.jpg wired in; Skull Platoon (names only — no platoon numbers used anywhere in the archive) |

**Remaining 12 Stubs — Migrated:**
fults-john, marr-bill, neal-bill, randt-larry, rosenberg-kenneth, sargent-stan, schaffer-roger, schneck-steve, small-bill, stanfield-nathan, vitucci-stephen, vollmar-tom

**New profile created:**
- scroggins-lanny (see below)

---

### Data Fills and Corrections Made This Session

| Profile | Data |
|---|---|
| cate-larry | Arrived late 1970; reassigned to door gunner ~Jul 1971 (not DEROS); departed late 1971; died 2011 |
| sells-leroy | Died March 29, 2022 |
| weaver-ken | Rank removed — pending confirmation from Ken Weaver |
| randt-larry | Cat Platoon confirmed from MDM photo caption |
| neal-bill | CO arrival ~April 1971 noted; related_events linked to 4/20 contact |
| rosenberg-kenneth | KIA confirmed: Skipper 6 (Company Commander), killed May 10, 1972 helicopter crash that also decimated Skull Platoon; platoon-names anecdote updated to name him |
| stanfield-nathan | Not D Company — associated with April 24, 1971 flight; wartime_content_notice reason documented |
| sargent-stan | Name corrected: first_name Stanton, middle_name Gerald, nickname Stan |
| kint-joe | Profile photo wired: kint-joe-profile.jpg |

**Anecdotes updated:**
- `ice-cream-culvert` — clarified "before Cate's reassignment" means door gunner transition, not DEROS
- `platoon-names` — Rosenberg named in text and added to contains array

---

### New Profile — Lanny Scroggins

**File:** `site/soldiers/scroggins-lanny/scroggins-lanny.md`

- Cat Platoon, 1970–71 — served with Marvin for at least the first part of his tour
- Decorations: Bronze Star Medal, Army Commendation Medal for Heroism (both distinguished)
- KIA: Oklahoma City bombing, April 19, 1995. Age 46.
- Post-service: 23-year federal employee; at HUD at time of death
- Family: Wife Cheryl, two sons
- Source: Oklahoma City National Memorial & Museum tribute page
- `cause_of_death: oklahoma-city-bombing` — outside standard enumeration; note for future template work
- External link: Oklahoma City Memorial URL in profile

---

### Tech Debt Added

New item logged in `Handoff_Profile_Standardization-052726.md` tech debt table:

**Non-D Company soldiers in roster** — Fanning, Jeffries, Colburn, Stanfield and similar attached/flight personnel are currently in the soldier directory alongside D Company members. Roster needs a classification mechanism (e.g., `affiliation:` field) to display them separately. Not urgent but should be designed before the roster display is finalized.

---

## Next Session — Kint Transcript Review

**Goal:** Review the Kint VHP interview material as a research checklist — identify what the interview suggests could be confirmed, corroborated, or documented from external sources.

### Names Not Yet Confirmed

These people are mentioned in the Kint interview but not named. Each is a potential stub or a gap to fill in an existing profile:

| Description | What We Know | Research Path |
|---|---|---|
| Company Commander, D/1-8 Cav, Dec 1970 | From Eldridge, Iowa (Scott County — Quad Cities area) | Roster research; Eldridge is small enough that a CO from there may be traceable |
| Platoon Lieutenant, Cat Platoon, early tour | Dartmouth graduate; called the tactical column "the OD Circus" | VHP or unit roster |
| English teacher colleague, Iowa | Female; older; forwarded 8th grade English assignments to Kint a few times during 1971 | Kint himself could name her if asked |
| Vocal music teacher | Drafted 1968, returned 1970; accidentally placed at correct seniority step, creating precedent for Kint's school board case | Davenport school records — probably not accessible |
| School principal, Davenport | Held Kint's job using Palmer College spouses as fill-ins; was not legally required to | Davenport school records |
| School board member | Forcefully opposed Kint's seniority claim; later had two sons in Kint's class | Davenport school records |

### Events and Topics Worth Researching

| Topic | Kint's Account | Research Potential |
|---|---|---|
| Bob Hope Christmas Show, Dec 1970 | Kint arrived Dec 10 — still a "cherry," pulled duty, missed the show | USO records; press coverage of Hope's 1970 Vietnam tour; date/location confirming D/1-8 Cav area |
| Bob Hope Christmas Show, Dec 1971 | Kint departed ~Dec 8 — left before the 1971 show | Same |
| Black Pajama Factory firefight | VC uniform factory, MR3, early in tour (late 1970 or early 1971); VC rear guard, one magazine; Kint went down on his back, watched green tracers | Unit records / S-3 journals could pin date and grid; no US casualties mentioned |
| D/1-8 → D/2-8 redesignation | 1971 drawdown consolidation; troops unaware until after the fact | Official order date known? Cross-reference with other D/2-8 members' accounts |
| Chieu Hoi operations | Night-location security for civilian movement corridors; did not fire on civilians | Consistent with MDM archive; any operational records? |
| Montagnard bracelet | Made from stripped electrical cord insulation by hill people of III Corps; Kint still wears it (2024) | Cultural/historical context piece; potential photo if Kint willing |
| Vũng Tàu photos | Kint mentioned having photos from Vũng Tàu R&R | Kint could potentially contribute — possible overlap with other D/2-8 collections |

### Potential Corroboration with Existing Archive

| Kint Detail | Archive Parallel | Note |
|---|---|---|
| Arrived Dec 10, 1970 | Marvin arrived Dec 4, 1970 | Six days apart — almost certainly processed through the same replacement depot at Biên Hòa; may have overlapped |
| 3-day patrols between resupply | Consistent across multiple accounts | Establishes operational rhythm in archive |
| "Easy year" post-Cambodia context | Consistent with D/2-8 operational tempo | Kint's framing could contextualize the 4/20 contact — smaller/localized vs. late-60s mass engagements |
| Break-squelch perimeter guard | Tactical detail — not yet documented in any other profile | Could be added to unit context notes |
| PX camera ordered mid-tour | Marvin also had a camera throughout his tour | Both men photographing independently; possible overlap in subjects |
| Culvert sleeping at firebase | FSB Fontaine layout corroboration | Architectural detail; consistent with McGrew calendar entries |

### Stories with Narrative Potential (from Prior Handoff)

These are the high-value story items from `Handoff_Kint_Transcripts` carried forward:

- **Green tracer convergence** — Black Pajama Factory first firefight; complete narrative arc; visually specific
- **The school board battle** — Complete arc with resolution; the Hong Kong suit detail is strong
- **The MOS argument × 2** — Compact; illustrates the institutional logic Kint kept running into
- **The 8th grade letters** — Psychological anchor story; emotional resonance; connects to post-service identity
- **Wild elephants and rats** — Sensory contrast piece; the rat/culvert/mess hall detail is memorable
- **Bob Hope bookends** — Missed 1970 as a cherry; gone before 1971; clean structural symmetry

---

## Carry-Forward (Ongoing)

1. **sargent-stan** — Dedicated session pending; widow's transcript on file with extensive information. Do not work piecemeal. Needs Virtual Wall / VVMF research, KIA date, full biography.
2. **rosenberg-kenneth** — Virtual Wall / VVMF research pending (KIA 1972-05-10)
3. **weaver-ken rank** — Confirm SGT directly with Ken when he sees the site
4. **R2 backfill** — Run `node admin/scripts/backfill-r2.js` from repo root for: kint-joe-profile.jpg, woo-robin-profile.jpg, and the four photos registered in Session 48
5. **Stale workflow file** — `git rm .github/workflows/sync-photos.yml` (from Session 48)
6. **`git rm --cached`** — Remove committed photo binaries from git tracking
7. **Non-D Company roster classification** — Fanning, Jeffries, Colburn, Stanfield; needs `affiliation:` field or equivalent before roster display is finalized
8. **Makowski VVMF Wall of Faces URL** — JS-rendered; needs Chrome or direct browser visit to confirm
9. **scroggins-lanny `cause_of_death`** — Value `oklahoma-city-bombing` is outside standard enumeration; flag for template work
10. **McGrew calendar intake** — Full calendar session still pending
11. **Missing stubs** — caruthers-tom, kinsey-charles, ryneska-john, kahnke-steve, martin-michael, mcgrew-harold, bedsole-jim, louisell
12. **Lightbox index offset** (`SITE-BUG-20260518000025`)
13. **Event slug `[]` literal** (`ADMIN-BUG-20260518000022`)
14. **Fuzzy match scorer** (`ADMIN-BUG-20260518000024`)
15. **Email sending** (`INFRA-TASK-20260518000067`)

---

## Architecture Notes

**Canonical template location:** `site/soldiers/_template.md`
**Section headers:** `# ── IDENTITY ──`, `# ── RANK & ASSIGNMENT ──`, `# ── SERVICE ──`, `# ── POST-SERVICE ──`, `# ── PROFILE PHOTO ──`, `# ── DECORATIONS ──`, `# ── SERVICE RECORD ──`, `# ── CONTACT ──`, `# ── EXTERNAL LINKS ──`, `# ── TIMELINE SOURCE NOTE ──`, `# ── SERVICE TIMELINE ──`, `# ── PHOTOS ──`, `# ── DOCUMENTS ──`, `# ── RELATED ──`, `# ── ADMIN ──`

**Platoon names (no numbers used):** Cat, Range, Skull. "White Cat" appears in Makowski booklet for what may be a separate platoon — not reconciled; leave as-is until official source confirms numbering.

**CRLF** — repo built on Windows, all files use `\r\n`.
**R2 key format** — `soldiers/[slug]/[subfolder]/[filename]`. Served at `/media/photos/soldiers/[slug]/[subfolder]/[filename]`.
**Deployment** — `npx wrangler deploy` from `site/`. Push via GitHub Desktop only.
