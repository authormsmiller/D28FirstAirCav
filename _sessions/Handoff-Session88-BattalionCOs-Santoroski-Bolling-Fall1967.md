# Session 88 Handoff — d281staircav

**Date:** 2026-07-07
**Continuing from:** Session 87 (Song Re Valley, LZ cluster, Dashiell) + compacted prior context
**Repo:** `https://github.com/authormsmiller/d281staircav`
**Deploy:** Push via GitHub Desktop only — terminal pushes fail (msm-illumia account lacks push access).

---

## What Was Completed This Session

### Battalion CO Profiles — All Created / Platoon Fixed

All 2/8 Cav battalion COs now have profiles with `platoon: HQ` (required for Roster page sort).
The CO chain in `stannard-john.md` notes field is the canonical reference.

**Profiles created this session:**

| Slug | Rank | Dates | Notes |
|---|---|---|---|
| `conrad-michael` | LTC | Jul 1969 – Apr 27, 1970 | War Zone C / Dog's Head; linked to contact-dogs-head-1970-03-18 |
| `kingston-robert` | LTC | Apr 27, 1970 – Jul 1970 | Full bio built; DSC citation; profile + field photos; 4-star General, first CINCCENT |
| `lytle-robert` | LTC | Jul 1970 – Oct 7, 1970 | Stub |
| `dubia-christian` | LTC | Oct/Nov 1968 – Jul 1969 | Fills gap between Gibney and Conrad |
| `moore-robert` | LTC | Oct 7, 1970 – Feb 16, 1971 | Stub; confirmed from ORLL AD0518422 |

**`platoon: HQ` added to:** tackaberry-thomas, hemphill-john, petty-howard, gibney-john, bacon-wg, stannard-john, dubia-christian, conrad-michael, kingston-robert, lytle-robert, moore-robert

**Full CO chain (canonical, stannard-john.md notes):**
Hemphill (Sep 1965 → Jul 30, 1966) → Tackaberry (Jul 30, 1966 → Feb 7, 1967) → Dashiell (Feb 7, 1967 → Jul 30, 1967) → Stannard (30 Jul 1967 → early Feb 1968) → Petty (→ KIA 15 Mar 1968) → Gibney (16 Mar 1968 → Oct/Nov 1968) → Dubia (Oct/Nov 1968 → Jul 1969) → Conrad (Jul 1969 → Apr 27, 1970) → Kingston (Apr 27, 1970 → Jul 1970) → Lytle (Jul 1970 → Oct 7, 1970) → Moore (7 Oct 1970 →) → Bacon (16 Feb 1971 →) → Blagg (~Jul 1971 →)

---

### Alongside Tier 4 — Battalion CO Entries

Python script `/tmp/gen_co_alongside.py` generated `_alongside.json` files for all soldiers with
parseable dates, adding `{"basis": "commanding-officer"}` entries linking each soldier to their
CO(s) during their service window. 69 files created/updated. 47 soldiers still have no parseable
dates — alongside CO entries pending for them.

---

### Documents — Stannard Testimonials

Two account documents created for `stannard-john`:

- `site/documents/stannard-john/saylor-gerald-account/index.md` — C Co platoon leader recalls Stannard organizing a volunteer recovery after an NVA ambush; resulted in Stannard's Silver Star.
- `site/documents/stannard-john/peters-vern-account/index.md` — CSM Peters (later CPT) recalls Stannard as brigade CO, flying in to extract wounded and recovering a missing NCO from a hot LZ on day 5.

Both filed under `documents/stannard-john/` (subject-based, since neither author is a D Co soldier with an archive profile). Both wired into stannard-john.md `documents:` array.

---

### PFC Michael Paul Santoroski — Profile Built

**Slug:** `santoroski-michael` | Wall: 27E/16 | KIA: 1967-09-26 (DOW)

Key findings from cross-referencing sources:
- **MOS 11C10** — Indirect Fire Infantryman (mortar crew), D Company
- **Incident date: September 6, 1967** — stepped on a land mine, Binh Dinh Province (Pershing AO)
- **Died: September 26, 1967** — Army Hospital in the Philippines, 20 days after wounding
- **Both legs amputated below the knees** (confirmed in newspaper article)
- **Province "Unknown" on Wall** — consistent with death outside Vietnam (Philippines)
- **NOT a Bolling casualty** — wounding predates Operation Bolling (Sep 19). The Sep 26 casualty date falling in the Bolling window is coincidental; he was already evacuated and hospitalized.
- **Hometown:** Kingston, Ulster County, New York (confirmed from newspaper obit)
- **Parents:** Joseph F. and Marie E. (Lickvar) Santoroski, 95 Millers Lane, Kingston, NY
- **Siblings:** Robert G., Stephen C., Thomas G. (brothers); Barbara (sister)
- **Born:** New York City, January 25, 1947
- **Burial:** St. Stanislaus Church → parish cemetery, Hazleton, PA (grandparent's parish)
- **Letter home (4 days after wounding):** "Mom, please have courage... I have my whole life ahead of me and I'm determined not to let this get me down."

**Files created:**
- `site/soldiers/santoroski-michael/santoroski-michael.md`
- `site/soldiers/santoroski-michael/photos/profile/index.md` + `santoroski-michael-profile.jpg`
- `site/soldiers/santoroski-michael/photos/press/index.md` + `santoroski-michael-obituary.jpeg`

**KIA list updated:** Hometown filled in; cause column updated with DOW detail.

**Sources used:**
- VirtualWall.org (incident date, MOS, unit, tour start)
- Wall of Faces / VVMF (province "Unknown" confirmed)
- Newspaper obituary, Hazleton area, October 1967 (parents, siblings, burial, letter, land mine confirmed, Philippines hospital confirmed)

---

### Operation Bolling — Event Page Created

**File:** `site/events/operation-bolling-1967/index.md`
**Type:** Tier 2 operation page
**Dates:** September 19 – October 14, 1967
**Location:** West of Tuy Hoa, Phu Yen Province (hills west of the 31st TFW USAF base)

**What it establishes:**
- 2/8 Cav alerted mid-September; staged at SF camp west of Qui Nhon Sep 17–18
- September 19: OPCON to 173rd Airborne Brigade; companies combat-assaulted west of Tuy Hoa
- Light contact; NVA "seemed to fade away"; one NVA Finance Officer captured
- October 14: returned to LZ English → Bong Son operations → Dak To (November) → Tam Quan (December)

**Source limitation:** B Company narrative (eagerarms.com/fall1967.html) is the **only** current source. FSB database has no 2/8 Cav positions in Phu Yen Province / CQ grid area for 1967. No D Company KIA confirmed for the Bolling window.

**Wired into:** `operation-pershing-1967` related_events (concurrent); Stannard's external links.

**DTIC sources to check — BLOCKED during this session:**
- `AD0394510` — 173rd Airborne Brigade lessons learned for Operation Bolling (the controlling HQ's own AAR). **Primary target for Bolling detail:** LZ names, grid coordinates, enemy OOB, company-level contacts.
- `AD0387543` — 1st Cav Division ORLL, period ending 31 October 1967 (already cited for Song Re Valley). Should contain 2/8 Cav's own account of Bolling. DTIC domain (`apps.dtic.mil`) returned empty on all fetch attempts — not a document-specific block, appears to be domain-level.

---

### Operational Timeline Updates

`site/_docs/d-co-operational-timeline.md` updated:
- **Santoroski Bolling note** added: explicitly clears the ambiguity — Sep 6 wounding predates Bolling; he is a Pershing casualty.
- **Operation Bolling section added** to 1967 block: dates, source, FSB gap noted, ORLL AD0387543 flagged as next source.

---

### Stannard Profile Update

Added external link: `Eager Arms — 2/8 Cav: Fall 1967 (Operation Bolling, Tuy Hoa; Bong Son; Dak To)` → `https://www.eagerarms.com/fall1967.html`

---

## 1967 Operational Frame — Current State

The fall 1967 skeleton is now coherent:

| Period | Frame | Status |
|---|---|---|
| Feb 12 – Aug ~19 | Operation Pershing (Binh Dinh umbrella) | ✅ Tier 2 page |
| Aug 1–19 | Song Re Valley (3d Bde recon in force) | ✅ Tier 2 page |
| Sep 6 | Santoroski land mine incident (Pershing AO) | ✅ DOW — profile built |
| Sep 19 – Oct 14 | Operation Bolling (OPCON 173rd, Tuy Hoa) | ✅ Tier 2 page (B Co source only) |
| Oct 14 – Nov | Bong Son operations (return to Pershing) | ⬜ No page — no D Co KIA |
| November | Dak To (FSB data confirms: ZB grid, Nov 16–20) | ⬜ No page yet |
| Dec 6–20 | Battle of Tam Quan | ✅ Tier 2 + Tier 1 pages |

---

## Where to Pick Up

### Immediate — DTIC Documents

When DTIC access is available (or documents can be downloaded manually):

1. **AD0394510** — 173rd Airborne Brigade Lessons Learned, Operation Bolling. This is the highest-priority Bolling source. Will yield: official operation boundaries, LZ names/grids for 2/8 Cav, enemy OOB, company-level contacts, and dates.
2. **AD0387543** — 1st Cav Div ORLL, period ending Oct 31, 1967. Already cited for Song Re; the Bolling section should be in the same document. Will confirm 2/8 Cav's own account of the operation.

Once either document is accessible:
- Update `operation-bolling-1967/index.md` with confirmed D Company positions and contacts
- Add any LZ pages for Tuy Hoa / Phu Yen Province (none exist in the archive)
- Assess whether Bolling warrants Tier 1 contact event pages

### November 1967 — Dak To

The FSB database confirms 2/8 Cav at Dak To in November 1967:
- FB Winchester (ZB046208): 2/8th Cav + 173rd Abn CPs, November 16
- Hill 1034 (ZB110223): B/2/8th Cav, major engagement November 16–20

No operation or event page exists for this period. No D Co KIA confirmed for November 1967 (2LT Bennett, Nov 1, is listed as attached). This could become a Tier 2 context note on the Pershing page or a standalone light page depending on what the ORLL shows.

### Remaining 1967 Tier 1 Clusters (Pershing)

Per the open question in `operation-pershing-1967`:
1967-03-01 (Burton, R.E. Johnson) · 1967-03-18 (M.N. Johnson, Woodall + Willis, Middleton att.) · 1967-05-30 (D.I. Nelson, Sutt) · plus singles: Van Gieson 3/12, V. Williams 4/2, Bohmer 5/23, Krueger 5/31, Ehlers 6/1, McComb 6/5, Houser 6/13.
Each needs the 2/8 Cav daily staff journal (NARA RG 472) for the day-of action.

### Conrad Notes — Stale Gap Reference

`site/soldiers/conrad-michael/conrad-michael.md` notes field still contains: *"A gap remains between Gibney (16 Mar 1968 →) and Conrad (Jul 1969)"* — this is now resolved by Dubia (Oct/Nov 1968 – Jul 1969). The notes field should be updated to remove or correct this.

### Alongside Tier 4 — Soldiers Without Dates

47 soldiers still have no parseable arrived/departed dates — they did not receive commanding-officer alongside entries. Once dates are added to their profiles, re-run `gen_co_alongside.py` (or the manual equivalent) to generate their entries.

### Company CO Alongside (Future)

Battalion COs are the baseline Tier 4. D Company commanding officers (company-level COs) are the logical next tier — but these require company journals or other unit-level sources to establish command dates. No company CO alongside entries exist yet.

---

## Key File Locations

| Item | Path |
|---|---|
| CO chain reference | `site/soldiers/stannard-john/stannard-john.md` → notes |
| Operational timeline | `site/_docs/d-co-operational-timeline.md` |
| KIA list | `site/_docs/d-co-kia-list.md` |
| Alongside script | `/tmp/gen_co_alongside.py` (session-only; recreate from session 88 context if needed) |
| Bolling event page | `site/events/operation-bolling-1967/index.md` |
| Santoroski profile | `site/soldiers/santoroski-michael/santoroski-michael.md` |
| Eager Arms Fall 1967 | https://www.eagerarms.com/fall1967.html |
| DTIC Bolling lessons | https://apps.dtic.mil/sti/pdfs/AD0394510.pdf (blocked — download manually) |
| DTIC ORLL Oct 1967 | https://apps.dtic.mil/sti/tr/pdf/AD0387543.pdf (blocked — download manually) |
