# Handoff — Locations: Full Inventory and IA Planning

**Date:** 2026-05-26
**Scope:** Complete location file build-out for D Co. 2/8 Cav operational area;
           information architecture decisions for surfacing locations on the site
**Branch:** `admin/2026-05-22` (continuing)
**Continues from:** `_sessions/Handoff-Locations-FSB.md`

---

## Files in `site/_docs/locations/` (Complete Current State)

| File | Type | Status |
|---|---|---|
| `fsb-guinn.md` | Firebase | Research notes — no coordinates yet |
| `fsb-silver.md` | Firebase | Stub — Gemini coordinates |
| `fsb-donna.md` | Firebase | Research notes — Gemini coordinates |
| `fsb-mace.md` | Firebase | Research notes — Gemini coordinates |
| `fsb-fontaine.md` | Firebase | Research notes — strong primary sourcing |
| `fsb-fanning.md` | Firebase | Full research notes — McGrew primary *(prior session)* |
| `fsb-jeffries.md` | Firebase | Full research notes — McGrew primary *(prior session)* |
| `fsb-makowski.md` | Firebase | Research notes — existing event record |
| `relay-mountain.md` | Signal installation | Research notes — multiple primary sources |
| `vung-tau.md` | R&R center | Research notes — McGrew primary + photo evidence |

---

## Information Architecture Decisions

### Locations as a Peer Section

Locations should be a **top-level section** of the site (`/locations/`), not
tabs within Unit History. Unit History remains the event index. Locations is a
third browsing axis alongside soldiers and events.

Each location page will eventually have its own tabs: Overview, Photos,
Connected Events. This mirrors the soldier page structure.

### Location Type Taxonomy

Three distinct types with different surfacing rules on soldier timelines:

**`company_position`** — The FSB the company was operating from.
Safe to surface on any soldier's timeline where in-country service dates
overlap with the base's active dates. Suggested language: *"The company's
primary position during this period was FSB Mace."*

**`detachment_garrison`** — Squad or platoon-level rotation; not a
company-wide posting. Relay Mountain is the definitive example. Surface **only
by direct attribution** — a letter, account, or calendar entry placing a
specific soldier there. Never inferred from service dates alone.

**`rr_center`** — Rest and Recuperation destinations. Vũng Tàu is the only
current example. Surface **only by direct attribution**. Nearly every soldier
visited at some point, but that universality makes inference meaningless — the
personal detail is what matters.

**Mace edge case:** Mace was the regional anchor and soldiers almost certainly
passed through regularly, but "passed through" is not the same as "was posted
to." Treat as `company_position` for timeline surfacing, but note the
distinction in the data.

**Donna edge case:** Donna is geographically and tactically separate from the
Long Khánh cluster (grid zone XS vs. YT). D Co. presence is thin — only
McDonald confirmed via calendar. Do not surface as a company position without
stronger corroboration.

### `data-standards.md` Update Needed

The location type taxonomy above should be formally added to
`site/_docs/data-standards.md` before any location data is wired into soldier
timelines. The distinction between types is the kind of thing that gets fuzzy
when records are added months later.

---

## The Operational Sequence (D Co. 2/8 Cav)

The complete chain of company positions across dad's deployment is now
documented. This is the through-line for the locations index page:

| Base | Approx. dates | Notes |
|---|---|---|
| FSB Guinn | Sep–Nov 1970 | D Co. here before dad arrives |
| FSB Silver | Nov 1970–Feb 1971 | Dad arrives Dec 1970; Silver dismantled |
| FSB Fontaine | Feb–May 1971 | Dad draws map ~Feb; April 24 crash |
| FSB Mace | Anchor throughout | Semi-permanent; never replaced |
| FSB Fanning | May–Aug 1971 | Named for CPT Fanning |
| FSB Jeffries | Aug–Dec 1971 | Named for WO1 Jeffries |
| FSB Makowski | Nov 28–Dec 24, 1971 | Dad departs Dec 2 |

The naming tradition (Fanning → Jeffries → Makowski) is a narrative thread
that belongs on the locations index page, not just on individual base pages.

---

## Key Findings This Session

### Fontaine / Fanning Are Distinct Positions

Fontaine is grid zone **YS** (YS 804 953 — ~15 miles southeast of Xuân Lộc,
near the Bình Tuy border). Fanning is grid zone **YT** (YT 525 155 — northeast
of Xuân Lộc near QL-1/QL-56). Different grid zones = different geographic
sectors. The "FSB Fontaine was renamed FSB Fanning" claim in `fanning-martin.md`
is almost certainly wrong. The existing open question in both FSB files should
be treated as near-resolved pending coordinate verification. Once YS 804 953 is
confirmed against operational maps, update both files and close the discrepancy.

### Relay Mountain Is Not a Firebase

Relay Mountain (Núi Chứa Chan / Hill 837 / Gia Ray Mountain) was a permanent
signal installation operated by the 53rd Signal Battalion, not a 1st Cav FSB.
It requires its own location type and should not be grouped with the FSBs on
the index page without visual distinction.

D Co. provided security garrison rotations there at squad level. Miller, Marvin
Dale was personally there (letter evidence). McDonald, Norm ("Range") was WIA
there by shrapnel. The garrison was too small to infer presence for any other
soldier.

### Mace Is the Anchor, Not a Satellite

FSB Mace was a semi-permanent, battalion-level base — the fixed point around
which the temporary FSBs (Silver, Fanning, Jeffries) orbited. The 720th Military
Police Battalion ran daily "Red Road" convoys along QL-1 to supply it. The
convoy logs are a named, specific NARA research target.

### The Geographic Triangle

Mace (YT 570 085), Jeffries (YT 545 225), and Relay Mountain form a tight
cluster — Mace at the southern foot of the mountain, Jeffries on the approach,
the signal station at the summit. Guards at Mace looked up at Relay Mountain
every day. The signal detachment looked straight down into Mace.

### Vũng Tàu Photo Identification Tool

The Vũng Tàu file includes a comprehensive bar name list (Tommy's, The Lucky
Strike, The Kangaroo Bar, The Beachcomber, etc.) and sensory memory prompts
(music, drinks, smells) intended as a practical tool for placing undated
photographs. This is explicitly designed to jog veteran memories and prompt
contributions, not as verified historical record.

Three confirmed D Co. soldiers with Vũng Tàu photos: Miller, Marvin Dale;
Randt, Larry; Woo, Robin. Photos show soldiers in fatigues, corroborating
the post-September 1970 closed-city policy.

---

## Source Quality Master Summary

| Location | Coordinates | Dates | D Co. Connection |
|---|---|---|---|
| FSB Guinn | Unknown | Gemini | Garvin (+ 1 veteran) |
| FSB Silver | YT 829 043 — Gemini | Gemini | Dad (primary); dismantled pre-spring 1971 |
| FSB Donna | XS 848 999 — Gemini | Unknown | McDonald calendar (primary) |
| FSB Mace | YT 570 085 — Gemini | Gemini | D Co. supported; no specific soldier confirmed |
| FSB Fontaine | YS 804 953 — Gemini | Feb–May 1971 (primary) | Dad (letters, primary) |
| FSB Fanning | YT 525 155 — secondary | May–Aug 1971 (McGrew) | McGrew calendar (primary) |
| FSB Jeffries | YT 545 225 — secondary | Aug 14–Dec 5?, 1971 | McGrew calendar (primary) |
| FSB Makowski | YS 752 991 — Gemini | Nov 28–Dec 24, 1971 (Gemini) | Dad at CP; Makowski KIA (primary) |
| Relay Mountain | Unconfirmed | Garrison ~Mar–Apr 1971 | Dad (letters); McDonald WIA (primary) |
| Vũng Tàu | N/A | Closed city from Sep 1970 | Dad, Randt, Woo (photos) |

---

## Primary Source Threads to Pursue

### Letters Intake Session (Planned)
The letters session will resolve several open questions across multiple files:
- Confirm FSB Silver — letter reference and approximate dates
- Confirm/date the Fontaine map letter (~Feb 1971, "the new firebase")
- Determine if Fontaine map letter and Neal/mid-April letter are the same document
- Confirm Relay Mountain garrison from letter(s) — March or April 1971?
- Confirm South China Sea / Silver sightline letter — same as above or separate?
- Check for any Vũng Tàu mentions
- Check for FSB Mace, Donna, or Guinn references
- Check late November / early December 1971 letters — was dad aware FSB Makowski
  was being named before he processed out on December 2?

### NARA Research Targets
- **720th Military Police Battalion convoy logs** — FSB Mace "Red Road" convoys
  along QL-1; named unit, daily mission, likely well-documented
- **NARA record 111-CCV-226-CC79198** — official photography of FSB Jeffries
  construction (from prior session, not yet pulled)
- **March 1971 aviation logs / crash reports** — Gemini cites these as the
  source for FSB Silver coordinates (YT 829 043); specific enough to pursue
- **PFC Makowski casualty record** — verify name, age (20), hometown (Buffalo,
  NY), KIA date (Oct 21, 1971) against VHPA or The Wall

### Garvin Materials
- Garvin, James is the primary source window for FSB Guinn (predates dad)
- His photo collection is described as extensive for location photography
- Identify which Garvin photos are Guinn vs. Silver (transition was Nov 1970)
- Garvin also cited as a source for FSB Fontaine detail ("Delta 2/8 veterans")

### Coordinate Verification
All Gemini-sourced MGRS coordinates need verification against operational maps
before publishing. Priority order:
1. FSB Fontaine (YS 804 953) — resolves the Fanning rename question
2. FSB Mace (YT 570 085) — anchor base, highest strategic importance
3. FSB Silver (YT 829 043) — Gemini cites "March 1971 aviation logs" specifically
4. FSB Makowski (YS 752 991) — personal significance; event record exists
5. Relay Mountain summit — needed for geographic relationships table in fsb-mace.md
6. FSB Guinn — no coordinates at all yet

Texas Tech Vietnam Center and Archive is the recommended first stop for
operational maps. NARA as secondary.

---

## Open Questions Consolidated

**Fontaine / Fanning:**
- [ ] Verify YS 804 953 — if confirmed, close the rename discrepancy in both files
- [ ] Update `fanning-martin.md` once resolved

**Relay Mountain:**
- [ ] Confirm MGRS for summit installation
- [ ] Verify 53rd Signal Battalion as operating unit
- [ ] Trace "104 Sig Sqn" citation from Gemini output
- [ ] Confirm McDonald WIA date and casualty record

**FSB Makowski:**
- [ ] Verify PFC Makowski details against VHPA / The Wall
- [ ] Cross-reference "Song Dinh river area" against contact-nui-ba-1971-10-21
      event slug — reconcile location descriptions
- [ ] Determine public site handling of the CP detail (personal, sensitive)

**FSB Jeffries:**
- [ ] Confirm Dec 5, 1971 close date (Gemini) — check McGrew December calendar

**FSB Donna:**
- [ ] Record the specific McGrew calendar entry placing McDonald at Donna
- [ ] Confirm whether this is McDonald's calendar or McGrew's

**Vũng Tàu:**
- [ ] Confirm Miller, Marvin Dale visit — letters intake
- [ ] Verify September 1970 closed-city order
- [ ] Review Randt and Woo photos for shared landmarks / possible same visit

**Site architecture:**
- [ ] Update `site/_docs/data-standards.md` with location type taxonomy
- [ ] Determine locations index page structure — operational sequence as spine
- [ ] Design photo intake path for location photos (Garvin collection)
- [ ] Determine `soldiers/unit/` vs. `locations/[slug]/photos/` for location
      photo storage (unresolved from IA discussion)

---

## Notes for Next Session

The photo storage question (soldiers/unit/ vs. locations/[slug]/photos/) was
raised but not resolved. The `soldiers/unit/` approach reuses the existing
scraper pipeline without modification. The `locations/[slug]/photos/` approach
is semantically cleaner and lets a location page pull its own photos directly.
This decision should happen before Garvin's location photos are ingested.

The Vũng Tàu bar list and memory prompts are a template for a broader approach:
location pages as contribution-prompt tools, not just historical records. The
same principle (recognizable detail → jog memory → outreach) applies to FSB
pages once Garvin's photos are in.
