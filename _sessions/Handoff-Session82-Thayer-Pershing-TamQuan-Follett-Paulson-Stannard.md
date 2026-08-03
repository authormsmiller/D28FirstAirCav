# d281staircav — Session 82 Handoff
**Date:** June 29, 2026
**Continues from:** Session 81 (Geiger/Radcliff locations, tour-window model, Finding Aid split). This
session went the other direction — **straight at the operational-history gap** — and effectively
**closed out 1966–67 at the operation level** while building the first fully-sourced 1967 D Co contact
event and two command profiles.
**Theme:** Build the operation frames Michael queued (Thayer I & II) → discover the bulk of 1967 sits
under **Operation Pershing** → frame it as an umbrella + the **Battle of Tam Quan** sub-op → run the
**11 Dec 1967 cluster (Follett + Paulson)** all the way to a primary-source contact event → profile
both men → profile their battalion commander **LTC John Stannard**. The 1967 wall is essentially down.

> ⚠ **Sandbox note (STILL biting, exactly as S81 warned):** the Linux/bash mount served **stale and
> truncated copies of just-written/just-edited files** repeatedly this session — `nl`/`grep`/`python`
> over freshly-edited soldier `.md` files showed them cut off mid-line with the closing `---` missing,
> when the Read tool confirmed the files were complete and well-formed. **Trust Read/Edit/Write, NOT
> bash, for fresh files.** Validate event YAML in bash if you must (events seemed to refresh), but
> confirm soldier-profile completeness via the Read tool. Also: the bash `outputs/` mount did not show
> web_fetch's persisted tool-result files — use the Read/Grep tools on the Windows path for those.

> ⚠ **Pre-existing build blocker (carried from S81, NOT introduced this session):** a local
> `npx @11ty/eleventy` build fails on `site/locations/index.njk` — bash reads a **stale** copy missing
> its final `{% endif %}` (line 134 `if` → line 136 `endif`); the Read tool confirms the real on-disk
> file is balanced. This is the S81 sandbox-staleness artifact, not a real defect. The deploy on
> Michael's end should be fine; a clean local render-test isn't possible while the mount is stale.

---

## What was built (all NEW unless noted)

### Operation frames (Tier 2, type: operation)
- **`events/operation-thayer-i-1966`** — Kim Son Valley search-and-destroy, 13 Sep – 1 Oct 1966.
  Anchors `contact-bong-son-1966-09-19` (Derosier KIA / Tackaberry's 2nd DSC). Built from the 1st Cav
  Div ORLL qtr-ending 22 Nov 66; a bonus: the qtr-ending 31 Jan 67 ORLL **Staff Historian** entry
  (prepared with S.L.A. Marshall) places the 2/8 Cav 19 Sep 66 action in the **"506 Valley"** under
  Thayer I — corroborates the Derosier frame (the "506 Valley" vs DSC "near Bong Son" wording is
  flagged, not forced).
- **`events/operation-thayer-ii-1966`** — 24 Oct 1966 – 12 Feb 1967, the division's longest op to
  date. Anchors `contact-binh-dinh-1967-01-28` (Keller + Yates). Carries the battalion aggregate
  (PFC Boyless, A Co, 27 Jan — no profile, aggregate only). Do-NOT-conflate note kept re: the named
  27 Jan fight (2/12 Cav vs 8th Bn 22d NVA NE of Bong Son, not the 2/8 Kim Son cluster).
- **`events/operation-pershing-1967`** — the **1967 UMBRELLA** (12 Feb 1967 – 19 Jan 1968, Binh Dinh).
  2/8 Cav role confirmed via the firebase-by-year data (companies at ~26 Binh Dinh LZs across the
  year). Lays out all the year's clusters/singles in prose; the individual contacts stay queued.
- **`events/battle-of-tam-quan-1967`** — sub-op of Pershing, 6–20 Dec 1967, 1st Bde vs PAVN 22d Regt.
  Now carries the AAR-sourced day-by-day, the command chain, casualty totals, and the CMH "piling on"
  framing (see sources below).

### The 11 Dec 1967 cluster — run to ground (Tier 1)
- **`events/contact-tam-quan-1967-12-11`** — D Company's **night ambush at BS 926048**, contacts at
  **2215 and 2245 hrs**, against PAVN moving north→south to escape into the Cay Giep Mountains.
  Casualties: SP4 Follett (small-arms) + SP4 Paulson (explosive device); causes differ → "related but
  not necessarily a single shared blast." Wired both ways to Tam Quan + Pershing.
- **PRIMARY SOURCE OBTAINED:** Michael pulled the **1st Brigade Combat Operations After Action Report,
  Battle of Tam Quan, 30 Dec 1967 (DTIC AD390613)**, signed by **Col. Donald V. Rattan**. Filed at
  `events/contact-tam-quan-1967-12-11/sources/1st-Bde-1cd-Combat-AAR-Tam-Quan-30Dec67-AD390613.pdf`.
  It names the D Co ambush precisely (grid + both times) but **does NOT break out friendly casualties
  by name/unit** — so Follett/Paulson are matched by date + unit (strong, not explicit). Casualty
  totals from the AAR: US 58 KIA / 250 WIA; ARVN 30 / 71; enemy 650 KIA, 3 PW NVA + 29 VC.

### Soldier profiles (NEW)
- **`soldiers/follett-allan`** — SP4 Allan Eugene Follett, D Co 2/8 Cav, 11H20, KIA 11 Dec 67 (small
  arms), 31E/79. Photo in place. Built by hand from the 3 KIA HTML sources (Honor States / Virtual
  Wall / Wall of Faces) — see skill note below.
- **`soldiers/paulson-john`** — SP4 John Paul Paulson Jr., D Co 2/8 Cav, 11B20, KIA 11 Dec 67
  (explosive device), 31E/82. Photo in place. **Decorations caution:** Honor States lists a **Silver
  Star** (+ Bronze Star, Air Medal) — held in `decorations_unconfirmed`; the Silver Star especially
  needs a primary citation before promoting. Worth a Hall of Valor / NARA check.
- **`soldiers/stannard-john`** — LTC John Edward Stannard, 2/8 Cav CO at Tam Quan. Full command
  profile (Tackaberry model), portrait in place (West Point memorial portrait — **NOT Vietnam-era**,
  captioned/credited as such). USMA 1946; CIB in WWII/Korea/Vietnam → Infantry Hall of Fame; 3 Silver
  Stars; retired BG. Sources: West Point AOG memorial (usma1946/15850) + two Eager Arms 2/8 Cav pages.

### Command chain established (NEW, from Stannard's sources)
**2/8 Cav CO succession:** Tackaberry (→7 Feb 67) → **Dashiell** (7 Feb 67 →) → **Stannard**
(→ early Feb 68) → **Petty** (LTC Howard Petty, KIA by mortar at LZ Betty 15 Mar 68) → **Gibney**
(LTC John V. Gibney, 16 Mar 68 →). Stannard was promoted Colonel in early Feb 68 and took the **1st
Brigade** from Col. Donald "Snapper" Rattan. (Tam Quan itself: Bde CO = Rattan; battle commander =
LTC Christian F. Dubia, 1/8 Cav; div CG = MG John J. Tolson.)

### Sources added this session (worth reusing)
- 1st Bde Combat AAR Tam Quan (AD390613) — primary, in repo.
- Wikipedia "Battle of Tam Quan" (quotes the AAR page-by-page).
- Eager Arms (eagerarms.com): `battleoftamquan.html` and `tetoffensiveanddeploymenttoquangtri.html`
  — detailed 2/8 Cav (Bravo/"Cheyenne") veterans' accounts; the command-chain source.
- ichiban1.org `news_36.htm` — 1/50 Mech veterans' account.
- CMH **Villard, *Staying the Course* (2017)** and **Tolson, *Airmobility 1961–1971*, ch. VII** — the
  latter frames Tam Quan as the model of airmobile "piling on" and is the source of Tolson's
  "pre-empted Tet" assessment. (Tolson chapter is a great citation for other 1967–68 pages.)

---

## Skill note (IMPORTANT for the next KIA build)
The **`kia-profile-general`** skill's SKILL.md references `scripts/build_profile.py`, but **that
script is NOT in the cache** — only the original **`kia-profile`** (Chinook) script is present, and it
hardcodes the Chinook crash narrative / VHPA link / Skull platoon / event slug. Running it on a
non-Chinook casualty would inject false data. **Both Follett and Paulson were built by hand** from the
three HTML sources, following the general skill's field intent + the keller/yates schema. Until the
general parser script is restored, build non-Chinook profiles by hand the same way. The 3 service
medals → `decorations`; everything else (CIB, PH, Marksmanship, PUC, Gallantry Cross, and any
Silver/Bronze/Air) → `decorations_unconfirmed`. Service IDs are SSNs → admin notes only.

---

## ★ NEXT SESSION — queue

1. **Finish the 1967 clusters** (this is what fully closes the year's *event* layer — all wire up to
   `operation-pershing-1967`): 1967-03-01 (Burton, R.E. Johnson) · 1967-03-18 (M.N. Johnson, Woodall;
   +Willis, Middleton att.) · 1967-05-30 (D.I. Nelson, Sutt). Singles: 3/12 Van Gieson, 3/30 Gundolf
   (Wall-only), 4/2 V. Williams, 5/23 Bohmer, 5/31 Krueger, 6/1 Ehlers, 6/5 McComb, 6/13 Houser, 9/26
   Santoroski, 11/1 Bennett (att). Each needs the **2/8 Cav daily staff journal (NARA RG 472)** for
   the day-of action; the firebase-by-year data gives the LZs in the meantime.
2. **OPERATIONAL HISTORY MILESTONE — almost there.** Per `_docs/d-co-operational-timeline.md`, the
   only years WITHOUT a Tier 2 operation frame are now **1970 (Cambodia)** and a couple of partial
   stretches. **Building the 1970 Cambodia frame would essentially complete the unit's operation-level
   coverage 1965–72** — the milestone Michael is chasing. (1968 is partial; 1972 Chinook is done;
   1969/71 covered.) Recommend 1970 next after the 1967 clusters.
3. **Two open record threads on the Tam Quan work:**
   - Pin the **Dashiell→Stannard** 2/8 handover date (ORLL command rosters / RG 472).
   - Verify the possible **Silver Star for SP4 Paulson** (Honor States lists it; no citation found —
     try Hall of Valor / NARA). If real, promote from `decorations_unconfirmed`.
   - Optional: pin which of Follett/Paulson fell at the 2215 vs 2245 contact (RG 472 only).
4. **Command stubs to consider** (the chain is now documented, profiles would wire cleanly): LTC John
   C. Dashiell, LTC Howard Petty (KIA 15 Mar 68), LTC John V. Gibney, Col. Donald V. Rattan.
5. **Carry-forwards still open from S80/S81:** Malec deploy steps; Geiger photo move + upload;
   eleventy rebuild/deploy of the S81 locations work + the S82 events; LZ Minh location page (trigger:
   RG 472 confirms it as the 28 Jan 67 day-of position); continue the 1965–69 location spine (unblocks
   the Finding Aid build); the Finding Aid "Download finding aid" button (gated on data density).

## Conventions reaffirmed / added
- **Tier 2 umbrella vs sub-op:** Pershing (umbrella, year-level, no per-man casualties block) →
  Battle of Tam Quan (named sub-op, type: operation) → contact-tam-quan-1967-12-11 (Tier 1, the D Co
  action). related_events wired both ways at every level.
- **`units:` frontmatter is metadata only** — the event layout (`_includes/layouts/event.njk`) does
  NOT render the primary/supporting/enemy block, so a slug there creates no visible link; still keep
  it accurate (don't reuse a wrong soldier slug just to fill the field).
- **Unprofiled casualties render safely:** `casualties.kia[].slug` with no matching soldier renders a
  no-record card (initials, no broken link) — so you can list men before their profiles exist.
- **Non-era command portraits are OK** if captioned/credited as such (Stannard's West Point portrait).
- **CO profiles:** `status: researching`, Tackaberry model, rank = the rank relevant to this archive
  (note higher final rank in admin notes).

## Files touched (this session)
NEW events: `operation-thayer-i-1966`, `operation-thayer-ii-1966`, `operation-pershing-1967`,
`battle-of-tam-quan-1967`, `contact-tam-quan-1967-12-11` (+ its `sources/` AAR PDF).
NEW soldiers: `follett-allan`, `paulson-john`, `stannard-john` (all 3 with photos + photos/profile/index.md).
MODIFIED: `contact-bong-son-1966-09-19` and `contact-binh-dinh-1967-01-28` (related_events back-links);
`_docs/d-co-operational-timeline.md` (1966 → partial, 1967 → covered, table + priority-gaps);
`_docs/d-co-kia-list.md` (Follett + Paulson → stub); `_docs/1st-cav-division-operations-vietnam.md`
(1967 → covered).
NOT done (by design): the remaining 1967 cluster event pages; 1970 frame; command stubs for
Dashiell/Petty/Gibney/Rattan; any deploy (Michael's step).
