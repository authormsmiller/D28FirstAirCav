# D Co. 2/8 CAV Archive — Handoff: Garvin Then & Now
May 22, 2026

---

## Context

This handoff covers a data collection planning session focused on two things: reassessing the Garvin site as a source, and processing the full D Company KIA list. It picks up from the data collection playbook produced in the prior session (`d281-data-collection-playbook.md`).

---

## The Garvin Site — Then vs. Now

**What it was assumed to be:** A photo gallery with captions that could be scraped to produce a 1971 roster, with Garvin's platoon/year notations providing cohort data.

**What the saved HTML actually contains:** The saved file is a Weebly gallery page. Captions were JavaScript-rendered and did not survive the save. What remains is 404 image filenames — which are data-rich: Garvin encoded name, platoon, and approximate year range directly into each filename.

**What the filenames yield:**
- 404 soldier entries spanning roughly 1965–1972
- Platoon encoded in ~60+ filenames: `cat`, `range`, `skull`, `hq`
- Year ranges encoded: `70-71`, `67-68`, etc.
- KIA flagged with `rip` in filename
- Name spelling errors already visible: Griggiths, Agular, Daylrmple, Mcgtew

**Why Garvin cannot anchor a 1971 cohort list:**
- Date errors are known and confirmed
- Rotation overlap is real: men arriving December 1971 effectively served 1972; men departing early 1971 overlap with 1970
- "1971" in Garvin's encoding is an approximation, not a roster

**What Garvin IS good for:**
- Name-recognition layer: find a name from another source, check if Garvin has a photo
- Cross-reference against known profiles
- The origin document: Michael's archive grew from wanting profiles beneath Garvin's listed men

**Garvin as a source:** Tier 2 corroborating source. Do not use as primary roster. Use as photo index and name-matching layer.

---

## KIA List — Processed

Full D Company KIA list obtained (107 names, all years). Source appears to be VVMF or equivalent official Wall records data.

**Tracker built:** `Archive/d281-kia-tracker.xlsx`
- Sheet 1: Full roster — all 107 KIA, sortable/filterable, dropdowns for Research Status and Profile Status, Wall Panel/Line and Home State columns blank for VVMF lookup
- Sheet 2: By Year — count and notes per year
- Sheet 3: Skull Platoon — May 10, 1972 — dedicated tab for the 28 men, crash context at top, Robin Woo source note

**KIA breakdown by year:**

| Year | Count | Notes |
|------|-------|-------|
| 1965 | 3 | Nov 4 action — 3 KIA same day |
| 1966 | 5 | |
| 1967 | 19 | Heaviest year outside 1972 |
| 1968 | 16 | Possible Williams duplicate (2× SSG William Williams, 12/04/1968) |
| 1969 | 20 | Multiple actions |
| 1970 | 9 | |
| 1971 | 7 | Apr 20–21 action (Cardwell, Drinkard, Hall KIA Apr 20; Sargent KIA Apr 21) |
| 1972 | 28 | May 10 — Skull Platoon CH-47 crash |

**May 10, 1972 — Skull Platoon Chinook crash:** 28 KIA, all on a single date. Nearly the entire Skull Platoon was aboard. This is confirmed by Robin Woo. Treat as a named event on the honor wall, not individual entries in a list.

**April 20–21, 1971:** Four KIA in two days. Cardwell, Drinkard, and Hall are documented in Marvin Miller's timeline (contact north of FSB Fanning — Range Platoon walked into a fortified bunker complex). This is the anchor event for the 1971 cohort.

**Williams duplicate:** Two entries — `WILLIAMS WILLIAM C. SSG` and `WILLIAMS WILLIAM CHARLES SSG`, both 12/04/1968. Flagged in the tracker. Verify against Wall records before building profiles.

---

## Two-Track Collection Strategy (Confirmed)

**Track 1 — Year by year:** 1971 first (primary focus), then 1972. Living memory, personal photos, anecdote collection. Tight cohort effect — sources from one soldier lead to others.

**Track 2 — KIA fast-track:** All years, all KIAs. Systematically easier. VVMF → VNOW → Fold3 casualty card. Feeds the honor wall page without requiring full profiles.

**Honor wall scope:** All D Company KIAs regardless of year.

---

## 1971 Cohort — How to Define It

The cohort cannot be reliably built from Garvin's year encoding. Better approach:

- **Anchor on known profiles:** Marvin Miller (Cat Plt, Dec 4 1970 – Dec 2 1971) is the reference point. His tour dates define the core window.
- **Morning reports (NARA):** 1969–1974 records are *non-archival* — held at NPRC St. Louis, require written request with fees ($8.30 deposit, $13.25/hr search fee). Not freely accessible online. Alternative: RG 472 daily journals at Archives II (College Park) may yield the same roster data and are archival/accessible.
- **Google search for online rosters:** Attempted this session. No D/2/8 roster found online. D/1/8 roster exists at webewebbiers.com (compiled from official company roster + daily officers logs + reunion list) — contact the site owner as a potential lead.
- **Name-first search:** Searching known soldier names alongside "D/2/8 cav" or "2/8 cav" can surface documents attached to memorial or genealogy pages.

**Unit standdown context:** The 2/8 Cav stood down from Vietnam in spring 1971 as part of Phase VI redeployment. The battalion was formally inactivated June 28, 1972. This compresses the 1971 cohort window (roughly Jan–spring 1971 before drawdown) and explains the low 1971 KIA count.

---

## Deferred Research Thread

**Robin Woo — Skull Platoon / May 10, 1972:**
- Nominally Skull Platoon for most of his tour
- Became RTO for Skipper 6 (Wolf Kutter, then his replacement) — was not aboard the Chinook
- Knew nearly all the men on that flight
- Primary source for the May 10, 1972 crash and Skull Platoon chapter
- **Deferred** — do not pursue until 1972 chapter is underway

**Wolf Kutter:**
- Skipper 6 (D Company CO) during the 1971–72 period
- Not yet in `roster.json`
- Worth a profile entry and potentially a source

---

## Roster.json — Edit Applied This Session

- `Lawrence Randt` → `Larry Randt` (first name and contact name updated to match profile slug `randt-larry` and prevent duplicate rendering)

---

## Next Steps

1. Continue building out the honor wall KIA tracker — VVMF panel/line lookups for quick wins
2. Use the April 20–21, 1971 event as a cohort anchor — identify who else was present, cross-reference against roster
3. Check RG 472 daily journals at Archives II as the most accessible route to a 1971 roster
4. Add Wolf Kutter to `roster.json` (Skipper 6, 1971–72 period)
5. Verify Williams SSG duplicate against Wall records
