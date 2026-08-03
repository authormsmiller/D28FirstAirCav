# FSB/LZ Carolyn — Research Notes

**Status:** SUPERSEDED as of 2026-07-27 (session 5) — the live page is now built at
`site/locations/fsb-carolyn/index.md` (see `/locations/fsb-carolyn/`). This document is kept on
file as the detailed research log; the live page is the reader-facing summary distilled from it.
**Last updated:** 2026-07-27 (session 5 — page built, per Michael's go-ahead; supersedes session 4's "do not build yet" note below)
**Related soldiers:** [bruckner-garry](/soldiers/bruckner-garry/), [lomker-michael](/soldiers/lomker-michael/)
**Related document:** documents/bruckner-garry/bruckner-garry-account-1970-02/
**Related photo:** soldiers/lomker-michael/photos/locations/fsb-carolyn/ (1970 howitzer position)

---

## 0. Session 4 update — a photo, at last

Michael found a `fsb-carolyn` folder already sitting in `Downloads/locations/`, holding one photo:
**a 1970 howitzer position at Firebase Carolyn**, ammunition crates stacked into a protective wall
around the gun pit, two soldiers working the piece. Source credit (from the Angry Skipper
Association website): "Contributed by John Williams/Mike Lomker."

This is the **first actual image** of the base itself — everything before this was text-only
(ORLLs, gazetteer, Bruckner's account). Filed at
`site/soldiers/lomker-michael/photos/locations/fsb-carolyn/index.md` (binary:
`1970-fsb-carolyn-howitzer-position.jpg`), tagged `fsb: fsb-carolyn` so it will surface correctly
once the real location page exists.

**Dual-credit handling:** `photographer:` is a single slug-or-empty scalar (confirmed against
`_docs/data-standards.md` — it doubles as the Gallery-2 "Photos Taken By" routing signal, so
multi-value isn't a simple data change, it'd need template/crawler work). Filed under
**lomker-michael** alone for now, per Michael's call. John Williams doesn't have a slug yet. A
minimal stub profile was built for Lomker (`site/soldiers/lomker-michael/lomker-michael.md`) —
genuinely the thinnest profile in the archive so far, built solely so `photographer:` resolves to a
real page rather than a dangling reference; the only fact on file is the photo credit itself. If
Michael later wants Williams credited equally, the flagged fallback (his own words) is to **duplicate
the photo into a williams-john profile** rather than force the schema to carry two names.

**Update, same day:** Michael supplied Lomker's profile photo plus two facts — **Skull Platoon,
1970-71**. Skull is D Company's own 1st Platoon nickname, so this confirms Lomker as **D Co.
specifically**, not just wider 2/8 Cav/ASA membership — one more data point (alongside Bruckner)
placing D Co. personnel in this AO in the 1970-71 window. Lomker's profile and photo credit updated
accordingly; still no rank, MOS, or exact tour dates.

---

## 1. Why this note exists

Garry Bruckner's account, "Vietnam: February 2-4, 1970," places him at **FB Carolyn** in early
February 1970 — flown in, overnighted in a bunker under outgoing artillery fire, then joined D Co.
in the field by log bird, D Co. "operating with the 11th Armored Cavalry Regiment near Firebase
Carolyn, which is close to the Cambodian border." Session 1 (2026-07-27) collected every prior
scattered mention of Carolyn already on file. **Session 2 (same day)** pulled the actual ORLL PDFs
already in the archive (`site/sources/orll/1969/` and `site/sources/orll/1970/`) and found
substantial primary-source material — including a full account of a major battle at LZ Carolyn
directly involving 2/8 Cav. This note now carries both passes.

---

## 2. Every Carolyn/Caroline mention found before the ORLL pass (session 1)

| Source | Context | Date/period implied |
|---|---|---|
| `site/locations/fsb-st-barbara/index.md` | Firebase gazetteer's separate entry for **FB Carolyn, grid XT278788**, opened by 2/8 Cav **20 Apr 1969**, "overrun" **6 May 1969**. Colavita's memoir (ch. 10) describes D Co. moving "about 10km due north" toward a new LZ Carolyn area in April 1969 as St. Barbara wound down — matches the gazetteer grid almost exactly. Open question there: "Decide whether the FB Carolyn overrun (6 May 1969) warrants its own event page." **(See Section 3 below — now has a real answer.)** | April–May 1969 |
| `site/soldiers/colavita-henry/colavita-henry.md` | Same cross-reference as above. | April 1969 |
| `site/events/operation-montana-scout-1969/index.md` | 1st Brigade (2/8 Cav's brigade) operating from **LZs Grant, Carolyn, St Barbara, Ike, Jamie, and White**, maximum-ambush posture against Base Area 355. | 1969 (Montana Scout period) |
| `site/events/war-zone-c-border-operations-1969/index.md` | March 8, 1969 — C Company's extraction under fire ended with the company "pulled to **FSB Carolyn**." | March 1969 |
| `site/events/rava-friendly-fire-1970-02-18/index.md` | States **FSB Carolyn, FSB Tina, FSB Flasher, and FSB Jay** "all appear in the battalion's contacts within weeks of February 18 [1970]" — 1st Cav Division's Operational Report language that firebases in western War Zone C were "moved frequently," none fixed for long. | February 1970 |
| `site/soldiers/malec-paul/malec-paul.md` | An earlier research pass floated then rejected a **"14 May FB Carolyn / LZ Amy"** guess for Malec's own timeline ("NOT his — wrong year / post-wounding"). Never resolved further. | Unclear — rejected guess |

---

## 3. ORLL primary-source pass (session 2, 2026-07-27)

The archive already holds the actual ORLL PDFs — `site/sources/orll/1969/` and
`site/sources/orll/1970/` — indexed at `site/sources/orll/1969/index.md` and
`site/sources/orll/1970/index.md`. Neither index's digest notes mentioned Carolyn, but the source
PDFs themselves do, once pulled and searched directly. **Caveat:** several of these PDFs are
scanned/OCR'd with inconsistent font garbling page to page (the same issue seen on page 6 of
Bruckner's newsletter) — e.g. one passage below OCRs "CAROLYN" as "CMtftl'I" and would not surface
on a plain text search. The mentions below are what direct search found; more may exist,
un-findable by keyword until re-OCR'd or read as page images.

### a. Confirmed grid, March 1970 — `AD0511158.pdf` (IIFFV ORLL, 1 Feb–30 Apr 1970)

> "On 11 March 1970 one 8" platoon Battery A, 2d Battalion, 32d Artillery, moved from Fire Support
> Base Carolyn (**XT271783**) to Fire Support Base Beverly... at the same time one 175mm platoon
> Battery A moved to Fire Support Base St Barbara (XS576855) from Fire Support Base Carolyn
> (XT271783)."

This is **five to six weeks after Bruckner's visit** and gives FB Carolyn a hard grid: **XT271783**.
It also pairs Carolyn and St. Barbara operationally in March 1970 — the same pairing Colavita's
memoir describes for April 1969 (D Co. moving "about 10km due north" from St. Barbara toward the
new LZ Carolyn). XT271783 sits roughly **860m from the gazetteer's XT278788** (Apr 1969 opening
grid) — close enough to read as the same base re-established/re-surveyed across occupancy cycles,
not two unrelated positions with the same name.

### b. The 6 May 1969 battle — `AD0506273.pdf` (1st Cav Div ORLL, ending 31 Jul 1969) + `AD0505650.pdf` (1st Cav Div Artillery ORLL, same period)

This is the gazetteer's "overrun 6 May 69" — and it turns out to be a fully documented, serious
battle directly involving 2/8 Cav, not a vague notation. From the main 1st Cav Div ORLL's
significant-activity log:

> "(3) 6 May: Companies C and E, 2nd Battalion, 8th Cavalry defending LZ CAROLYN received a mortar
> and rocket attack followed by a regimental size ground attack by NVA forces. The ground assault
> was launched simultaneously from the southwest and north at 0200 hours; breaching a portion of
> the perimeter and destroying a 105mm howitzer ammunition area at 0315 hours. Fighting continued
> throughout the early morning, with U.S. forces utilizing all available support. Counterattacks
> reestablished the perimeter and the enemy force began withdrawing at 0415 hours, with contact
> finally breaking at 0600 hours. At first light three company sized units were air assaulted to
> block and interdict avenues of escape to the north and west. Final results of the NVA assault
> were 198 enemy KIA, 30 PW[s]... Friendly casualties were 10 US KIA and 73 US WIA."

The companion Artillery ORLL describes the same night from the gun line's perspective (LZ Carolyn
"received a heavy volume of incoming rounds, estimated at more than 200 including 122mm rockets,
75mm RR, 82 and 60mm mortars"; an M/R-4 counter-mortar radar sited at LZ Carolyn itself acquired
enemy firing positions; the ammunition storage area took two direct hits and detonated) but gives
slightly different friendly-casualty figures: **9 US KIA, 64 US WIA** (vs. the main ORLL's 10 KIA /
73 WIA) and enemy losses of **101 NVA KIA** (vs. the main ORLL's 198). Both documents describe the
same single engagement — the discrepancy is a normal artifact of two different reporting chains
(gun battery vs. maneuver battalion) with different cutoff times, not two different fights. Flag
both figures; don't silently pick one.

**This directly ties 2/8 Cav — Companies C and E, not D — to a major, costly battle at LZ Carolyn.**
Given the casualty count (10 US KIA is a serious single-day loss), this is a strong candidate for
its own event page once the location page exists — see Open Questions below on scope, since C and E
Co. are not D Company.

**Gazetteer wording check:** the gazetteer calls this an "overrun." The ORLL narrative describes a
**partial breach, then a successful counterattack that reestablished the perimeter** — the base was
not permanently lost. "Overrun" may be the gazetteer's shorthand for "breached under heavy attack,"
not a literal loss of the position. Worth a wording fix on whichever page eventually cites the
gazetteer's language.

### c. Continuous maintenance through summer 1969 — `AD0506273.pdf` (engineer section)

> "The fire bases at IKE, GRANT, CAROLYN, and ST BARBARA were maintained and upgraded during the
> period." (period ending 31 Jul 1969)

Confirms Carolyn as a standing, actively-maintained firebase through the summer, not a position
abandoned after the 6 May battle.

### d. October 1969 — reinforcement, ARVN pairing, and a reopening — `AD0508303.pdf` (1st Cav Div ORLL, ending 31 Oct 1969)

Several distinct passages:

> "On [1]3 October, C/1-12 Cav became OPCON to 2-5 Cav and began operations to the south and
> southeast of Carolyn."

> "On 15 October, [3] tubes of 105s were airlifted to CAROLYN which was secured by C/1-12 Cav thus
> increasing artillery coverage to the west and northwest. D and A Co 2-5 Cav were inserted west and
> northwest of FSB CAROLYN, [and] 2-5 Recon Platoon was inserted to the southwest of FSB CAROLYN."

> "...the 9th Airborne Battalion opened another fire base (FSB VICKY)... On 22 October, the 11th
> Airborne Battalion **reopened** FSB CAROLYN."

> "On 17 October 1969 the 2nd [ARVN] Abn Bde began to operate in the 1st Cav Area of Operations and
> established Fire Support Bases at JACKIE, VICKIE, and CAROLYN."

> (11th Combat Aviation Group log) "...assisted in the relocation of the following Fire Support
> Bases; ... IKE, DE, JUDIE, ELLEN, JACKIE, VICKIE, AND CAROLYN."

Read together: Carolyn was reinforced by C/1-12 Cav in mid-October (with 2-5 Cav elements pushed
out around it), then **explicitly "reopened"** on 22 October by the ARVN 11th Airborne Battalion as
part of a "buddy"/Vietnamization pairing program (each US cavalry squadron paired with an ARVN
Airborne battalion — 2-5 Cav/11th Abn Bn is the implied pairing here). "Reopened" confirms Carolyn
went through at least one close/reopen cycle by this point — consistent with a recurring position
rather than a single continuous occupation from April 1969 onward.

### e. Geography confirmed via the firebase gazetteer — `sources/fsb-locations/` (session 3, 2026-07-27)

Michael pointed at `sources/fsb-locations/` (2/8 Cav's own derived gazetteer list, plus the full
553-page `FSB-locations.pdf`) after noting that Bruckner's account places this Carolyn in **Tay
Ninh**, reached just after the unit moved there from **Song Be**. The gazetteer has exactly one
Carolyn entry — `2-8-cav-fsb-list.md` / `2-8-cav-fsb-by-year.md` / `lz-vocabulary.json` all agree:

> FB Carolyn — **11.5687, 106.1683 / XT278788** — "Opened by 2/8th Cav 20Apr69 with B/1/30th Arty
> (155mm)(T), A/2/19th (Abn) Arty (105mm)(T). Overrun 6May69." (citations: 612, AD504499)

No province field exists in this dataset (lat/lon and grid only), but plotting it against bases
**already published on the site** settles it decisively:

| Site | Grid | Lat/Lon | Distance from Carolyn | Site's own published province |
|---|---|---|---|---|
| **FB Becky** | XT372810 | 11.5882, 106.2545 | ~9.6 km | "Tay Ninh Province (War Zone C), Military Region 3, III Corps" — `site/locations/fsb-becky/index.md` |
| **Dog's Head** (event location) | XT077829 | 11.6065, 105.9841 | ~20.6 km | "Dog's Head area, War Zone C, Tay Ninh Province, III Corps" — `site/events/contact-dogs-head-1970-03-18/index.md` |
| **FB Illingworth** | XT033788/039792 | 11.5695/11.5731, 105.9436/105.9491 | ~24.5 km | Tay Ninh Province (well-established elsewhere in the archive; site of the 1 Apr 1970 sapper attack) |
| **FB Rita** | XT499802 | 11.5805, 106.3710 | ~22.1 km | "Binh Long Province (the Fishhook)... casualty records for 2/8 Cav men list Tay Ninh Province" — `site/locations/fsb-rita/index.md` (a known province-record quirk, not a contradiction) |

**Carolyn sits in the middle of this cluster** — all four sites within roughly 10-25km of each
other along the same latitude band (~11.57-11.61°N), the Tay Ninh Province / War Zone C corridor
already well documented elsewhere in the archive. This directly confirms Bruckner's clue.

**The 11th ACR connection is now independently corroborated, not just Bruckner's word for it.** The
already-published Dog's Head event states: "In March 1970 the 2nd Battalion, 8th Cavalry... was
working the Dog's Head against the NVA 272nd Regiment. The same operation produced the celebrated
26 March rescue, when **Alpha Troop, 1st Squadron, 11th ACR** fought through the jungle to relieve a
surrounded Charlie Company, 2/8 Cav (an action later recognized with a Presidential Unit
Citation)." That's the same 11th Armored Cavalry Regiment, the same Tay Ninh/War Zone C corridor,
the same month-and-change window as Bruckner's account (Feb 2-4 → Mar 18-26, 1970). Also from
`2-8-cav-fsb-list.md`: "Dog's Head Rescue... C/2/8th Cav trapped then extracted by A/2/8th Cav,
**A/1/11th ACR** 26Mar70." Bruckner's "operating with the 11th Armored Cavalry Regiment near
Firebase Carolyn" is no longer a lone claim — it fits a documented, ongoing 2/8 Cav – 11th ACR
partnership in this exact AO that spring.

**One loose thread worth flagging, not chasing further right now:** the gazetteer also lists **FB
Chris** (2/8 Cav, 3-8 Jan 1970, grid YT452900 — 11.6636, 107.2453) just one month before Bruckner's
arrival. That grid is in the **YT square, ~110km east** of Carolyn's XT square — nowhere near Tay
Ninh; it's out in the Long Khanh/Bien Hoa-corridor grid family used elsewhere in the archive (Fanning,
Judy, Karen, Fontaine are all YT-square). So 2/8 Cav apparently redeployed laterally across III
Corps between early January and early February 1970 — from the Long Khanh side to War Zone C/Tay
Ninh — matching Bruckner's own account of finding the battalion had "just moved to Tay Ninh." Not
pursued further this session; flagged in case it's useful context for the Carolyn page later.

---

## 4. Working timeline (combining all sources through the ORLL pass)

| Date | Event | Source |
|---|---|---|
| 1969-04-20 | Opened by 2/8 Cav, grid XT278788 | Firebase gazetteer (via fsb-st-barbara research) |
| 1969-05-06 | Regimental-size NVA night attack; C & E Co., 2/8 Cav defending; perimeter breached then reestablished; 10 US KIA / 73 US WIA (main ORLL) or 9 KIA / 64 WIA (arty ORLL); 198 (or 101) NVA KIA | AD0506273, AD0505650 |
| 1969-04–07 (summer) | "Maintained and upgraded" alongside Ike, Grant, St Barbara | AD0506273 (engineer section) |
| 1969-10-13 | C/1-12 Cav begins ops south/southeast of Carolyn (already a known reference point) | AD0508303 |
| 1969-10-15 | Reinforced — 3x 105mm tubes airlifted in, secured by C/1-12 Cav; 2-5 Cav elements inserted around it | AD0508303 |
| 1969-10-17 | ARVN 2nd Airborne Bde begins ops in 1st Cav AO; establishes FSBs at Jackie, Vickie, and Carolyn | AD0508303 |
| 1969-10-22 | ARVN 11th Airborne Battalion **reopens** FSB Carolyn | AD0508303 |
| 1970-02-02/04 | Garry Bruckner overnights at FB Carolyn (bunker, arty fire missions), then joins D Co. in the field alongside 11th ACR near the Cambodian border | Bruckner account (this archive, 2026-07-27) |
| 1970-02-18 | FSB Carolyn named among 1st Brigade FSBs active "within weeks of" the Rava friendly-fire incident | rava-friendly-fire-1970-02-18 event |
| 1970-03-11/18 | Grid confirmed: XT271783. Artillery platoons shuttle between Carolyn, Beverly, Ann, and St Barbara | AD0511158 |
| 1970-03-18/26 | Dog's Head fighting nearby (contact-illingworth-1970-03-17, contact-dogs-head-1970-03-18); 26 Mar rescue confirms Alpha Troop, 1st Sqn, 11th ACR operating with 2/8 Cav in this same Tay Ninh/War Zone C corridor | contact-dogs-head-1970-03-18 (already published) |

This is now a fairly solid **11-month occupancy history (Apr 1969 – Mar 1970)** with at least one
confirmed close/reopen cycle (Oct 1969) and one major battle (6 May 1969). The "same Carolyn or
different?" question from session 1 is mostly resolved: **same recurring position/name**, not
unrelated bases — the ~860m grid variance between the 1969 and 1970 readings is well within normal
re-survey/re-establishment drift. The gazetteer cross-check (Section 3e) also confirms the province
Bruckner names (Tay Ninh) and independently corroborates the 11th ACR partnership he describes.

---

## 5. Open questions — resolve before building the page

- [x] ~~Same Carolyn or different?~~ — **Resolved (session 2, reinforced session 3):**
      continuous/recurring use of the same named position, April 1969 through at least March 1970,
      with a documented reopen cycle in October 1969, and now geographically confirmed to sit
      squarely in the Tay Ninh/War Zone C cluster with Becky, Rita, Illingworth, and Dog's Head. Not
      fully closed: whether every occupancy sat on the *exact* same grid point or shifted a few
      hundred meters each time remains unconfirmed.
- [x] ~~Province?~~ — **Resolved (session 3):** Tay Ninh Province, War Zone C, III Corps — confirmed
      by plotting Carolyn's gazetteer grid (XT278788) against already-published site pages for
      Becky (~9.6km away), Dog's Head (~20.6km), Illingworth (~24.5km), and Rita (~22.1km), all in
      the same corridor. Matches Bruckner's own account exactly.
- [x] ~~11th ACR co-location, Feb 1970?~~ — **Resolved/strongly corroborated (session 3):** no
      longer resting on Bruckner's word alone. The already-published contact-dogs-head-1970-03-18
      event and the gazetteer's own "Dog's Head Rescue" entry both confirm Alpha Troop, 1st
      Squadron, 11th ACR operating with 2/8 Cav in this exact Tay Ninh corridor in March 1970, ~6
      weeks after Bruckner's Feb 1970 account. Not a direct Carolyn-specific citation, but a
      documented ongoing partnership in the same AO and window.
- [ ] **Scope question for the 6 May 1969 battle:** it was fought by C and E Companies, 2/8 Cav —
      not D Company. The archive is otherwise D-Co-scoped (cf. the Mike Gonzales exclusion in
      `_docs/stub-candidates.md`: "different company; this is a D Company archive"). But
      battalion-wide context already appears on other location pages (e.g. fsb-fanning covers
      Operation Overlord at the battalion level). Ask Michael: does this battle get its own event
      page (battalion-level context, like Overlord), or stay folded into the FB Carolyn page as
      background/history without a dedicated soldier-facing event page?
- [ ] **Grid precision.** XT278788 (1969 gazetteer) vs. XT271783 (March 1970 ORLL) — ~860m apart.
      Worth a source that nails down whether this is the same physical berm or a re-sited position
      a few hundred meters off across occupancy cycles.
- [ ] **The Jan→Feb 1970 lateral redeployment.** FB Chris (2/8 Cav, 3-8 Jan 1970) sits in the
      YT-square Long Khanh/Bien Hoa corridor, ~110km from Carolyn's XT-square Tay Ninh position.
      Worth confirming the battalion's move west into War Zone C in this window against
      `_docs/2-8-cav-opcon-timeline.md` or `_docs/d-co-operational-timeline.md` if those cover it.
- [ ] **OCR gaps.** Given the "CMtftl'I" garble found in AD0506273, other Carolyn mentions may exist
      in these or other ORLLs that keyword search won't catch. Worth a manual page-image pass on
      the 1969-1970 ORLLs if/when the page gets built for real, rather than relying solely on
      pdftotext.
- [ ] **The Feb 4 (approx) contact from Bruckner's account** (8 incoming mortar rounds, night
      ambush, 1 NVA KIA, 2 AK-47s captured) — still un-gridded, described only as "the open field
      from which we had just moved." Separate from the 6 May 1969 battle; consider whether it
      warrants its own (much smaller) event page once/if the location is pinned down.

---

## 6. Superseded — page built (session 5, 2026-07-27)

The page is now live at `site/locations/fsb-carolyn/index.md`. The open questions in Section 5
above were carried forward onto the live page rather than resolved outright, with one scope
decision made there: the 6 May 1969 battle is narrated as background/history on the page itself
rather than split into its own event page — flagged for Michael's review rather than decided
unilaterally, since it would be a new precedent (battalion-level, non-D-Co event page).
