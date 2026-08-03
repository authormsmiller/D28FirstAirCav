# Session 89 Handoff — d281staircav

**Dates:** 2026-07-07 (Bolling ORLLs) / 2026-07-10 (Santoroski incident page, Rava profile)
**Continuing from:** Session 88 (Battalion COs, Santoroski, Operation Bolling page)
**Repo:** `https://github.com/authormsmiller/d281staircav`
**Deploy:** Push via GitHub Desktop only — terminal pushes fail (msm-illumia account lacks push access).

---

## What Was Completed This Session

### Operation Bolling — Both ORLLs Applied

Session 88 ended with two DTIC documents blocked (DTIC domain unreachable) and flagged as immediate next step. Both documents were downloaded manually and processed this session.

**Documents consulted:**
- **AD0387543** — 1st Cavalry Division (Airmobile) ORLL, period ending 31 October 1967
- **AD0394510** — 173rd Airborne Brigade (Sep) ORLL, period ending 31 July 1968

**Key findings from AD0387543 (primary source — division level):**
- Operation BOLLING, 1 ACD participation: 17 Sep – 14 Oct 67
- IFFORCEV directed 173d Abn Bde to conduct the operation with **two battalions** west of Tuy Hoa: 4th Bn 503d Inf (173d organic) + TF 2/8 Cav (OPCON from 1st Cav Div)
- 1st ACD released TF 2/8 Cav OPCON to 173d Abn Bde effective **17 Sep 67**
- 2/8 Cav air assaulted into LZs in the BOLLING AO on **19 Sep 67**
- Operations terminated **14 October**, returned to PERSHING AO
- Results (scattered contacts): **Enemy KIA 21, PW 12, SA WPNS CAPT 8; Friendly KIA 0, WIA 7**
- Zero friendly KIA closes the D Company question definitively

**Key findings from AD0394510 (supporting source — brigade level):**
- Confirms Operation Bolling II commenced **17 September 1967** — the original OPCON order date; the "II" name was applied to the 173d's continuation of the same AO mission after 2/8 Cav departed
- Primary enemy in AO Bolling: **95th NVA Regiment** (under HQ, 5th NVA Division)
- The 4th Bn 503d Inf + D Co 16th Armor held AO Bolling after 2/8 Cav departed, through 1968
- AO grid: CQ and BQ squares (Phu Yen Province, west of Tuy Hoa)
- The 95th NVA Regiment had avoided major engagement from Sep–Oct 1967 onward — consistent with "fading away" in the B Co narrative
- Tuy Hoa Air Force Base (31st TFW) security was a continuing mission for the 173d through 1968

**Files updated:**
- `site/events/operation-bolling-1967/index.md` — added both ORLLs as primary sources; updated enemy unit to 95th NVA Regiment; added 4th Bn 503d Inf as the concurrent battalion; added confirmed results; added Operation Bolling II context; marked OQ-02 resolved (partially); added OQ-03 (LZ names still needed from NARA); rewrote prose body with primary-source framing
- `site/_docs/d-co-operational-timeline.md` — updated 1967 Bolling entry to show ORLL confirmation, results, enemy ID, and page status

**What the ORLLs did NOT provide:**
- Specific LZ names or grid coordinates for 2/8 Cav's positions in AO Bolling — the division ORLL records the operation at summary level only. LZ-level detail requires the 2/8 Cav battalion staff journal (NARA RG 472) or a 173d Abn Bde lower-echelon AAR for the specific period.

---

### Santoroski Incident Event Page — Created

**Session rationale:** Every KIA should have either a contact event or incident page with narrative beyond just a name. Santoroski had no event page despite being the most document-rich profile in the file (newspaper obituary, letter home).

**Files created/updated:**
- `site/events/santoroski-mine-1967-09-06/index.md` — new incident event page (type: incident), date 1967-09-06 / date_end 1967-09-26
- `site/soldiers/santoroski-michael/santoroski-michael.md` — added `related_events: [operation-pershing-1967, santoroski-mine-1967-09-06]`

**Key narrative:** Santoroski stepped on a land mine in Binh Dinh Province on September 6, 1967 — seven weeks into his tour, MOS 11C10 mortar crewman. Both legs amputated below the knees. Four days later he wrote home: *"Mom, please have courage… I have my whole life ahead of me and I'm determined not to let this get me down."* He died sixteen days after writing that letter at a U.S. Army hospital in the Philippines, September 26, 1967.

**Critical disambiguation preserved in all three files (Bolling event page, Santoroski profile, incident page):** Santoroski's official casualty date (Sep 26) falls inside the Operation Bolling window, but his wounding occurred September 6 in the Pershing AO — before Bolling began. He was already evacuated and hospitalized when the battalion moved to Tuy Hoa. He is a Pershing casualty.

**Sources:** Virtual Wall, VVMF Wall of Faces, Hazleton-area newspaper obituary October 1967 (Santoroski family copy — primary source for wounding date, cause, evacuation chain, letter, and burial details).

**Still needed:** Santoroski's exact position on September 6 (2/8 Cav daily staff journal, NARA RG 472) and the name of the Philippine hospital.

---

### PFC Henry Tony Rava — Profile Built

**KIA data:** D Co, 2/8 Cav, 1st Cav Div. DOD: 1970-02-18, Tay Ninh Province. Panel 13W/31. DOB: 1949-08-30. Hometown: Mt Angel, Marion County, OR. MOS: 11B10. Inducted via Selective Service. Start tour: 1969-10-07.

**Critical detail:** Casualty record = Hostile, Died of Wounds / Misadventure (Friendly Fire) / Artillery Rocket Mortar / Ground Casualty. Virtual Wall "Casualty Detail: Misadventure (Friendly Fire)" + Honor States "Artillery Rocket Mortar" together indicate friendly indirect fire — short rounds, fire mission error, or adjacent unit's fire. Specific circumstances not in available sources.

**Files created:**
- `site/soldiers/rava-henry/rava-henry.md` — full profile; `cause_of_death` field carries the full casualty-code description; notes carry AO context (War Zone C, LTC Conrad CO, FB Westphal reference Jan 1970), platoon unknown, SSN warning, decoration status
- `site/soldiers/rava-henry/photos/profile/index.md` — photo index; credit cleared (no family credit known)
- `site/_docs/d-co-kia-list.md` — row updated: ✅ with "Hostile (DOW, friendly fire — arty/rocket/mortar)"

**Manual corrections applied after build_profile.py ran:**
- Removed `platoon: Skull` default (no platoon confirmed for a 1970 soldier)
- Fixed `mos: "11B10"` (script appended `· Infantryman` descriptor — removed)
- Fixed `credit:` in photo index (script defaulted to "Courtesy of Jim Garvin" — cleared)
- Set `status: draft` (Selective Service / no volunteer record)
- `related_events:` left empty — no event page exists for Feb 18, 1970 yet

**Next source:** ORLL for 1st Cav Div, period ending April 1970 (AD0512505, at `sources/orll/1970/`) — may record the incident or fix the battalion's position on February 18, 1970.

**Burial:** Calvary Cemetery, Mt Angel, Oregon.

**Service ID 544581422 — DO NOT PUBLISH.**

---

## Where to Pick Up

### 1. The Remaining Session 88 Queue

All items from session 88 carry forward unchanged:

**Conrad notes — stale gap reference:**
`site/soldiers/conrad-michael/conrad-michael.md` notes field still contains: *"A gap remains between Gibney (16 Mar 1968 →) and Conrad (Jul 1969)"* — this is now resolved by Dubia (Oct/Nov 1968 – Jul 1969). Update or remove this note.

**Alongside Tier 4 — soldiers without dates:**
47 soldiers still have no parseable arrived/departed dates and did not receive commanding-officer alongside entries. Once dates are added, re-run the gen_co_alongside logic (see session 88 handoff for script reference).

**Company CO alongside (future):**
Battalion COs are in place as Tier 4. D Company company-level COs would be the next tier — needs company journals or unit-level sources for command dates.

### 2. November 1967 — Dak To

The FSB database confirms 2/8 Cav at Dak To in November 1967:
- FB Winchester (ZB046208): 2/8th Cav + 173rd Abn CPs, November 16
- Hill 1034 (ZB110223): B/2/8th Cav, major engagement November 16–20

No operation or event page exists for this period. No confirmed D Co KIA for November 1967 (2LT Bennett Nov 1 is listed as attached). AD0387543 covers this period (Nov falls within the Aug–Oct 1967 ORLL… actually, Oct 31 is the last day; Dak To began Nov 1). The Dak To 1967 period may fall in the next 1st Cav ORLL (period ending 31 Jan 1968 — not yet located/consulted). The B Co Eager Arms account for "Fall 1967" covers the Hill 1034 engagement. Could become a Tier 2 context page or a Tier 3 note on the Pershing page.

### 3. Remaining 1967 Tier 1 Clusters (Pershing)

Per `operation-pershing-1967` open questions and the timeline:
- 1967-03-01 (Burton, R.E. Johnson)
- 1967-03-18 (M.N. Johnson, Woodall; +Willis, Middleton att.)
- 1967-05-30 (D.I. Nelson, Sutt)
- Singles: Van Gieson 3/12, V. Williams 4/2, Bohmer 5/23, Krueger 5/31, Ehlers 6/1, McComb 6/5, Houser 6/13

Each needs the 2/8 Cav daily staff journal (NARA RG 472) for the day-of action.

### 4. Carry-Forward from Sessions 62–88

- `aguilar-oscar` orphaned files — manual deletion of `documents/aguilar-oscar/...letter-720423.{md,jpg}`
- Orphan profile files: `wood-thomas-profile.webp`; `flores-david`, `henson-frank`, `ray-jackie`, `sablan-john` stray profile `.jpg`s
- Profile stubs not started: **sargent-stan**, **woo-robin**
- **Photo ID Proposals — admin `index.html` Tab 6 UI** (backend routes done; tab UI deferred)
- Alongside cards photo bug (see session 63 handoff for investigative leads)
- Chinook crash event page (`chinook-crash-1972-05-10`) — canonical landing for Skull Platoon alongside links
- Dave Berry profile (daughter contact; build when materials arrive)
- Peter Eldridge follow-up — promote draft when fuller account received

---

## Key File Locations

| Item | Path |
|---|---|
| Operation Bolling event page | `site/events/operation-bolling-1967/index.md` |
| Santoroski incident page | `site/events/santoroski-mine-1967-09-06/index.md` |
| Santoroski profile | `site/soldiers/santoroski-michael/santoroski-michael.md` |
| Rava profile | `site/soldiers/rava-henry/rava-henry.md` |
| Rava photo index | `site/soldiers/rava-henry/photos/profile/index.md` |
| Operational timeline | `site/_docs/d-co-operational-timeline.md` |
| KIA list | `site/_docs/d-co-kia-list.md` |
| CO chain reference | `site/soldiers/stannard-john/stannard-john.md` → notes |
| AD0387543 OCR | `C:\Users\michael.miller\Downloads\locations\AD0387543-OCR.md` |
| AD0394510 PDF | `C:\Users\michael.miller\Downloads\locations\AD0394510.pdf` |
| Next ORLL (Rava) | AD0512505 — 1st Cav Div, period ending April 1970 — `sources/orll/1970/` |
| Eager Arms Fall 1967 | https://www.eagerarms.com/fall1967.html |

---

## Technical Reminders

- **CSS deploy sync:** `xcopy /E /Y assets _site\assets` from `site/` before `wrangler deploy`
- **Git:** push via **GitHub Desktop** (terminal pushes fail on `msm-illumia`)
- **Profile photo resolution:** crawler `photosBySlug[slug].profile[0]` takes precedence over `profile_photo` front matter; every soldier with a profile image needs a `photos/profile/index.md`
- **Photo ID Proposals gate:** `submissions/photo-proposals/` never touched by cron; admin approval only
- **Service IDs are SSNs:** never publish
