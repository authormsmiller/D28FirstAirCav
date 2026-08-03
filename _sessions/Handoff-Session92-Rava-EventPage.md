# Session 92 Handoff — d281staircav

**Date:** 2026-07-10
**Continuing from:** Session 89 (Bolling ORLLs applied; Santoroski incident page; Rava profile)
**Repo:** `https://github.com/authormsmiller/d281staircav`
**Deploy:** Push via GitHub Desktop only — terminal pushes fail (msm-illumia account lacks push access).

---

## What Was Completed in Sessions 89–91

_(Abbreviated — see Handoff-Session89-Bolling-ORLLs-Applied.md for full detail.)_

- **Operation Bolling event page** enriched with AD0387543 and AD0394510: enemy ID (95th NVA Regiment), concurrent unit (4th Bn 503d Inf), confirmed results (Enemy KIA 21, PW 12; Friendly KIA 0, WIA 7), Operation Bolling II context
- **Santoroski incident event page** created — `site/events/santoroski-mine-1967-09-06/index.md` — land mine September 6, died of wounds September 26, 1967; letter home as central narrative
- **PFC Henry Tony Rava profile** built and corrected — `site/soldiers/rava-henry/rava-henry.md` — hostile DOW, friendly fire (arty/rocket/mortar), Tay Ninh Province, February 18, 1970; KIA list updated ✅

---

## Session 92 Primary Target — Rava Friendly Fire Incident Event Page

### What we know

**Soldier:** PFC Henry Tony Rava, D Co, 2/8 Cav, 1st Cav Div
**Date:** February 18, 1970
**Province:** Tay Ninh Province, III Corps
**AO:** War Zone C
**Casualty codes:** Hostile / Died of Wounds / Misadventure (Friendly Fire) / Artillery Rocket Mortar / Ground Casualty
**Burial:** Calvary Cemetery, Mt Angel, Oregon
**Panel:** 13W/31

**Profile:** `site/soldiers/rava-henry/rava-henry.md` — `related_events:` is empty, pending this page.

### What we don't know yet

- The specific circumstances of the friendly fire incident (short rounds, fire mission error, adjacent unit's fire, or own-unit error)
- Whether Rava was on patrol, at a firebase, or in a different configuration
- Whether any other D Co soldiers were casualties in the same incident
- The specific operation 2/8 Cav was conducting in Tay Ninh Province in February 1970
- The battalion's exact position on February 18

### Proposed event page slug

`rava-friendly-fire-1970-02-18`

If the source work establishes an operation name, the slug could be updated to reflect it. Use `type: incident` (same pattern as `santoroski-mine-1967-09-06` and `gonder-mine-1970-05-19`).

---

## Primary Source to Consult

**AD0512505** — 1st Cavalry Division (Airmobile) ORLL, period ending **30 April 1970**

This covers February 18, 1970. At division ORLL level it may:
- Name the operation(s) 2/8 Cav was conducting in Tay Ninh Province / War Zone C in February 1970
- Record the battalion's general AO and firebase positions
- Summarize the incident type that caused Rava's death (friendly fire by artillery/rocket/mortar)
- List other friendly casualties in the same period

**File location (if already downloaded):** Check `C:\Users\michael.miller\Downloads\locations\` for AD0512505. If not present, the user will need to download it from DTIC (DTIC domain is blocked to the agent; user downloads manually).

**Secondary sources to check:**
- The 2/8 Cav daily staff journal (NARA RG 472) for February 18, 1970 — this is the most granular source and would establish exactly what happened, but is not in available local files
- The 1st Cav Div FSB database for Tay Ninh Province, early 1970 — may fix the battalion's firebase on that date (FB Westphal was Jan 14–17, 1970; what came next?)

---

## AO Context — Early 1970, War Zone C

- **Commanding officer:** LTC Michael Conrad (CO July 1969 – April 27, 1970)
- **Firebase reference:** FB Westphal (YT380835) — active January 14–17, 1970; named for SSG James Westphal KIA January 6, 1970. By February 18 the battalion had moved from this position.
- **Theater context:** The 1st Cavalry Division had redeployed from II Corps (Binh Dinh/Bong Son) to III Corps (Tay Ninh / War Zone C / Cambodian border area) in late 1968. By early 1970 the division was operating in the War Zone C corridor anticipating the Cambodian Incursion (April–June 1970).
- **Other D Co KIA near this date:** Check the KIA list for anyone KIA in late January or February 1970 who might have been in the same engagement or on the same firebase.

---

## Event Page Pattern

Follow the `type: incident` pattern established by:
- `site/events/santoroski-mine-1967-09-06/index.md`
- `site/events/gonder-mine-1970-05-19/index.md`

Key fields:
```yaml
type: incident
date: "1970-02-18"
date_known: true
```

The narrative should carry:
1. The casualty codes and what they mean (hostile, DOW, friendly fire — artillery/rocket/mortar)
2. What is established vs. what is not established from available sources
3. The AO context (War Zone C, Conrad command, Cambodian border operations)
4. An open question inviting contact from anyone who was with D Co in February 1970

After the page is created, update `rava-henry.md`:
```yaml
related_events:
  - rava-friendly-fire-1970-02-18
```

---

## Secondary Targets (if Rava event page completes early)

### LZ Carol Window — fast-roger and golden-ronald

Two D Co KIA from the LZ Carol window (August 1968) need profiles. Research HTML is **not yet downloaded** — must be fetched from VirtualWall, Honor States, and Wall of Faces before `build_profile.py` runs. Ask the user to download to:
- `C:\Users\michael.miller\Downloads\KIA\fast-roger\`
- `C:\Users\michael.miller\Downloads\KIA\golden-ronald\`

| Slug | Name | Date | Panel | Hometown |
|---|---|---|---|---|
| `fast-roger` | PFC Roger Theodore Fast | 1968-08-19 | 48W/54 | Butterfield, MN |
| `golden-ronald` | SP4 Ronald Duane Golden | 1968-08-20 | 47W/7 | Superior, WI |

VirtualWall URLs (if fetching directly):
- `http://www.virtualwall.org/df/FastRT01a.htm`
- `http://www.virtualwall.org/dg/GoldenRD01a.htm`

**Note on LZ Carol B Co names:** The 19 Bravo Company KIA names are embedded in a memorial JPG — not extractable from HTML. Still unresolved.

---

## Carry-Forward (Ongoing)

- **Conrad notes stale gap reference** — `site/soldiers/conrad-michael/conrad-michael.md` notes still say "A gap remains between Gibney and Conrad" — resolved by Dubia but note not updated
- **aguilar-oscar orphaned files** — manual deletion of `documents/aguilar-oscar/...letter-720423.{md,jpg}`
- **Orphan profile files** — `wood-thomas-profile.webp`; `flores-david`, `henson-frank`, `ray-jackie`, `sablan-john` stray `.jpg`s
- **Profile stubs not started** — sargent-stan, woo-robin
- **Photo ID Proposals Tab 6 UI** — backend routes done; tab UI deferred
- **Alongside cards photo bug** — cards on profile pages don't consistently show related soldiers' photos
- **Chinook crash event page** (`chinook-crash-1972-05-10`) — canonical landing for Skull Platoon alongside links
- **Dave Berry profile** — daughter contact; build when materials arrive
- **Peter Eldridge** — promote draft when fuller account received
- **Alongside Tier 4 (47 soldiers without dates)** — no CO alongside entries generated yet

---

## Key File Locations

| Item | Path |
|---|---|
| Rava profile | `site/soldiers/rava-henry/rava-henry.md` |
| Rava photo index | `site/soldiers/rava-henry/photos/profile/index.md` |
| Rava event page (to create) | `site/events/rava-friendly-fire-1970-02-18/index.md` |
| Santoroski incident page | `site/events/santoroski-mine-1967-09-06/index.md` |
| KIA list | `site/_docs/d-co-kia-list.md` |
| Operational timeline | `site/_docs/d-co-operational-timeline.md` |
| Gonder incident (pattern) | `site/events/gonder-mine-1970-05-19/index.md` |
| Next ORLL (Rava) | AD0512505 — 1st Cav Div, period ending April 1970 |

---

## Technical Reminders

- **CSS deploy sync:** `xcopy /E /Y assets _site\assets` from `site/` before `wrangler deploy`
- **Git:** push via **GitHub Desktop** (terminal pushes fail on `msm-illumia`)
- **Profile photo resolution:** crawler `photosBySlug[slug].profile[0]` takes precedence over `profile_photo` front matter; every soldier with a profile image needs a `photos/profile/index.md`
- **Photo ID Proposals gate:** `submissions/photo-proposals/` never touched by cron; admin approval only
- **Service IDs are SSNs:** never publish
- **build_profile.py defaults to fix:** `platoon: Skull`, `credit: "Courtesy of Jim Garvin"`, `mos` suffix `· Infantryman` — always review and correct after running
