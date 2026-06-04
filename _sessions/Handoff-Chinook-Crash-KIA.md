# Session 50 Handoff — d281staircav

**Date:** 2026-05-28
**Branch:** `admin/2026-05-22` (continuing)
**Repo:** `https://github.com/authormsmiller/d281staircav`
**Deploy:** Push via GitHub Desktop only — terminal pushes fail (msm-illumia account lacks push access).

---

## What Was Completed This Session

### Chinook Crash — Full Research and Event Build

This session pivoted from FSB research to focus entirely on the May 10, 1972 Chinook crash (incident 720510031ACD). The session covered: research foundation, three-source cross-reference, KIA stub creation, Oscar Aguilar profile enrichment, event page builds, and newsletter data intake.

---

### Research Documents Created/Updated

**`site/_docs/chinook-crash-kia-checklist.md`**
Working checklist for all 34 KIA. Now fully resolved on unit attribution. Sections:
- Crew (362 ASHC, 5 KIA) — with hometowns from ASA newsletter
- D Co. Passengers (21 confirmed) — with rank, DOB, hometown, Wall panel, VHPA link
- Non-D Co. Passengers — unit attribution RESOLVED:
  - 6 confirmed A/1-12 Cav (Carr, Dunning, Hayes, Henaghan, Lydic, Rivera-Agosto) — with hometowns
  - 1 confirmed 1st Signal Brigade Aviation Detachment (Lahner) — with hometown
  - Mike John Aguilar confirmed A/1-12 Cav, Compton CA, MOS Armor Crewman
- Open items: Sablan hometown discrepancy (Yigo GU vs Agana GU); rank discrepancy CLOSED

**`site/_docs/d-co-kia-list.md`**
Full D Co. KIA research list (101 organic + 7 attached), sorted by year, with profile status.
Existing stubs noted; new stubs from this session added to status column.

---

### KIA Stubs Created (4 new)

All follow the canonical template with photo directories created.

| Slug | Name | Rank | Platoon | Wall |
|---|---|---|---|---|
| `aguilar-oscar` | Oscar Aguilar | SP4 | Skull | 1W/15 |
| `boatright-william` | William Arvel Boatright | SGT | Skull | 1W/16 |
| `bowersock-steven` | Steven Edward Bowersock | PFC | Skull | 1W/16 |
| `burnett-edward` | Edward Denzel Burnett | SGT | Skull | 1W/16 |

**Standard decoration pattern for Chinook KIA:**
- Confirmed: National Defense Service Medal, Vietnam Service Medal, Vietnam Campaign Medal
- Unconfirmed: Purple Heart (KIA near-certain), CIB, Marksmanship Badge, Army Presidential Unit Citation, Vietnam Gallantry Cross (all Honor States probability-based)

---

### Oscar Aguilar — Fully Enriched Profile (Template for Others)

`site/soldiers/aguilar-oscar/aguilar-oscar.md` is the reference profile for all remaining Chinook KIA stubs. Sources used: Virtual Wall profile HTML, Honor States profile HTML, VVMF Wall of Faces.

Enriched fields:
- `mos: "11B2Y · Infantryman (Airborne/Pathfinder Qualified)"` — from Virtual Wall
- `arrived: "1972-01-07"` — tour start from Virtual Wall
- `hometown: "Fairfield, Solano County, CA"` — full county form from Honor States
- `profile_photo: "photos/profile/aguilar-oscar-profile.jpg"` — photo dropped in by user
- `decorations_unconfirmed` — Purple Heart + 4 Honor States probability entries, each with source comment
- `links.wall` — VVMF Wall of Faces URL confirmed
- `links.other` — VHPA incident, Honor States, Virtual Wall, Find A Grave
- Timeline — arrived entry (1972-01-07) + KIA entry (1972-05-10)
- Admin notes — burial (Saint Mary's Catholic Cemetery and Mausoleum, Sacramento CA), Service ID flagged no-publish (SSN policy)

**Gold star policy confirmed:** `status: kia` is the gate for gold star rendering — template renders `prof-kia-star` for `kia | dow | mia`. Does not check `cause_of_death`. Applies to non-combat deaths in-country (Chinook crash, and by extension Roberts drug OD). No additional field needed.

---

### Event Pages

**`site/events/chinook-crash-1972-05-10/index.md`** — Major update
- Fixed slug: `rosenberg-ken` → `rosenberg-kenneth`
- Full unit breakdown added (D Co. 21, 362nd ASHC 5, A/1-12 Cav 6, 1st Signal Brig 1)
- Cause confirmed: blade retaining pin failure (hostile fire ruled out)
- Complete prose casualty name list added
- Open questions resolved: cause, tail number, Roy Adams photo
- Cross-linked to `nf34-memorial-2022`
- Status: still `draft` — promote to `published` when D Co. stub set is complete

**`site/events/nf34-memorial-2022/index.md`** — New
Never Forgotten 34 Memorial Ceremony, May 9–10, 2022, Washington DC.
- Two-day program documented: gathering dinner + Wall ceremony
- Resource panel: John Dullahan (Arty FO 1972 / ASA President), Dr. John Osheroff (attending physician at crash site), Wolf Kutter (CO D-2/8), Roy Adams (Cat Platoon, departure photographer), Peter Eldrige (Chairman, Crash Investigation Board)
- Four Gold Star family testimonials verbatim: Howell, Rosenberg, Monteleone, Phillips
- Roy Adams confirmed as photographer of "Skull Platoon Last Flight May 10, 1972" departure photo
- `tagged` includes 5 D Co. KIA with stubs; add remaining 16 as stubs are built
- Status: `published`
- Source: ASA Walking Point newsletter, Issue 20, January 2023

---

### Source: ASA Newsletter Issue 20, January 2023

Key data extracted and applied:
- Unit attribution for all 34 KIA (authoritative Never Forgotten 34 roster)
- Crew hometowns (Tomlin, Harrell, Elenburg, Neiss, Mustin)
- Non-D Co. hometowns (all 7 confirmed non-D Co. soldiers)
- Resource panel identifications
- Roy Adams as departure photographer
- Gold Star family testimonials (with ages at death: Howell 24, Rosenberg 29, Monteleone 20, Phillips 20)
- Wolf Kutter byline as Skipper 6, 1971–72

---

## Next Session — Prompts

Revisit the prompts session from 2026-05-27. (Session 49 had planned Kint Transcript Review as the next session; that remains carry-forward.)

---

## Remaining Chinook KIA Work

### D Co. — 17 stubs still needed (alphabetical order)

| Slug | Name | Rank | DOB | Hometown | Wall |
|---|---|---|---|---|---|
| `flores-david` | David Cruz Flores | SP4 | 1952-08-20 | Agana, GU | 1W/17 |
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

**Also needed (existing stubs to enrich):**
- `rosenberg-kenneth` — Add VHPA incident link, DOB (1942-10-25), hometown (New York NY), Wall 1W/19
- `woo-robin` — Add Skull Platoon (71–72), survivor/not-aboard note, event reference, incident link

**Honor States profile URLs for remaining stubs** (from Oscar Aguilar's related casualties list):
- Flores: https://www.honorstates.org/profiles/587407/
- Freitag: https://www.honorstates.org/profiles/273250/
- Groves: https://www.honorstates.org/profiles/275768/
- Henson: https://www.honorstates.org/profiles/277771/
- Howell: https://www.honorstates.org/profiles/279194/
- Jackson: https://www.honorstates.org/profiles/279975/
- Jensen: https://www.honorstates.org/profiles/280412/
- Monteleone: https://www.honorstates.org/profiles/288680/
- Phillips: https://www.honorstates.org/profiles/292487/
- Ray: https://www.honorstates.org/profiles/294058/
- Rivera-Agosto: https://www.honorstates.org/profiles/587406/
- Rosenberg: https://www.honorstates.org/profiles/295679/
- Sablan: https://www.honorstates.org/profiles/587408/
- Saulsberry: https://www.honorstates.org/profiles/296629/
- Shiko: https://www.honorstates.org/profiles/297911/
- Sulser: https://www.honorstates.org/profiles/300729/
- Wood: https://www.honorstates.org/profiles/306238/

---

## Carry-Forward (Ongoing — from Session 49)

1. **sargent-stan** — Dedicated session pending; widow's transcript on file. Do not work piecemeal.
2. **rosenberg-kenneth** — Enrich with incident link, DOB, hometown, Wall URL (see above)
3. **weaver-ken rank** — Confirm SGT directly with Ken when he sees the site
4. **R2 backfill** — Run `node admin/scripts/backfill-r2.js` from repo root for: kint-joe-profile.jpg, woo-robin-profile.jpg, and the four photos registered in Session 48
5. **Stale workflow file** — `git rm .github/workflows/sync-photos.yml`
6. **`git rm --cached`** — Remove committed photo binaries from git tracking
7. **Non-D Company roster classification** — Fanning, Jeffries, Colburn, Stanfield; needs `affiliation:` field or equivalent
8. **Makowski VVMF Wall of Faces URL** — JS-rendered; needs Chrome or direct browser visit
9. **scroggins-lanny `cause_of_death`** — `oklahoma-city-bombing` outside standard enumeration; flag for template work
10. **McGrew calendar intake** — Full calendar session still pending
11. **Missing stubs** — caruthers-tom, kinsey-charles, ryneska-john, kahnke-steve, martin-michael, mcgrew-harold, bedsole-jim, louisell
12. **Kint Transcript Review** — Deferred from Session 49; see that handoff for full research checklist
13. **Lightbox index offset** (`SITE-BUG-20260518000025`)
14. **Event slug `[]` literal** (`ADMIN-BUG-20260518000022`)
15. **Fuzzy match scorer** (`ADMIN-BUG-20260518000024`)
16. **Email sending** (`INFRA-TASK-20260518000067`)

---

## Architecture Notes

**Canonical template location:** `site/soldiers/_template.md`
**Section headers:** `# ── IDENTITY ──`, `# ── RANK & ASSIGNMENT ──`, `# ── SERVICE ──`, `# ── POST-SERVICE ──`, `# ── PROFILE PHOTO ──`, `# ── DECORATIONS ──`, `# ── SERVICE RECORD ──`, `# ── CONTACT ──`, `# ── EXTERNAL LINKS ──`, `# ── TIMELINE SOURCE NOTE ──`, `# ── SERVICE TIMELINE ──`, `# ── PHOTOS ──`, `# ── DOCUMENTS ──`, `# ── RELATED ──`, `# ── ADMIN ──`

**Gold star rendering:** Triggered by `status: kia | dow | mia` in soldier.njk (`prof-kia-star` div). Does not check `cause_of_death`. Policy: any death in-country or in transit qualifies for `status: kia`.

**Chinook KIA decoration pattern:** Three confirmed service medals + five unconfirmed (Purple Heart near-certain for KIA; CIB + Marksmanship + APUC + VGC per Honor States probability). CIB note: does not apply to crew (362nd ASHC) or non-infantry passengers.

**Aguilar as template:** `aguilar-oscar` is the reference profile for all remaining Chinook stubs — fully enriched with MOS, arrived, full county hometown, profile photo, decoration pattern, all four external links, two-entry timeline, admin notes with burial and service ID (flagged no-publish).

**SSN policy:** Army-era service IDs are real SSNs — admin notes only, never in published fields.

**Platoon names (no numbers used):** Cat, Range, Skull.
**CRLF** — repo built on Windows, all files use `\r\n`.
**R2 key format** — `soldiers/[slug]/[subfolder]/[filename]`.
**Deployment** — `npx wrangler deploy` from `site/`. Push via GitHub Desktop only.
