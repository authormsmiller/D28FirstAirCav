# d281staircav — Session 65 Handoff
**Date:** June 12, 2026
**Continues from:** Session 64 (Pleiku / Hill 732 cluster)
**Theme:** 1968-12-04 cluster — event page + 3 KIA profiles + script overhaul

---

## What Session 65 accomplished

### Script overhaul — build_profile.py
Three major improvements written to `build_profile_updated.py` and deployed to `KIA/build_profile.py` (top-level KIA folder — see deployment note below):

1. **Honor States decoration parsing** — `parse_hs_decorations()` reads the `<div class="awardlist">` star-color scheme: `#4b5587` = confirmed (colored star), `#bcb8b8` = probability-based (grey star). Replaces the old VW "was awarded:" pattern that was hitting the wrong file (the Profile popup HTML does not contain decoration data — that's on the individual soldier page).

2. **VW Profile popup id= cell extraction** — `parse_virtual_wall()` now extracts `Location`, `CasType`, `CasReason`, `CasDetail`, and `Unit` in addition to `MOS` and `StartTour`. Location surfaces in admin notes with a "may be DCAS error" flag; casualty type/reason/detail also go in notes.

3. **`field/` folder handling** — if `KIA/<event>/<slug>/field/` exists and has an `info.txt`, the script: reads `info.txt` as the raw YAML, wraps it in `---` delimiters to write `photos/field/index.md`, and copies all non-`.txt` files to `site/soldiers/<slug>/photos/field/`.

Non-Chinook events now: use HS-parsed decorations, write a `# TODO` KIA timeline placeholder, skip `relationships.json` with a NOTE to wire via `_alongside.json` instead.

### Script deployment
The skills cache at `%APPDATA%\Claude\...\skills\kia-profile\scripts\` is a read-only session snapshot — the user cannot locate the actual file on disk. Workaround: script lives at the top level of the KIA folder (`KIA/build_profile.py`). The skill's bash command is overridden each run to point there. This is stable and working.

### NEW EVENT (published): Operation Sheridan Sabre — December 4, 1968
`site/events/operation-sheridan-sabre-1968-12-04/index.md` — `status: published`, `publish: true`.

- Three D Co KIA, same day, consecutive Wall lines (37W/40 Jones, 37W/42 Stoltz, 37W/44 Williams)
- Operational context: 2nd Brigade, 1st Cav, Binh Long Province / War Zone C / Fishhook area; interdiction of PAVN infiltration routes from Cambodia
- Adjacent Dec 3 D/2-7 Cav contact documented (24 US KIA, Sgt. Holcomb Medal of Honor) — not confirmed same action
- Barney Tharp tribute (Williams' NCO Academy classmate) included in narrative
- Province discrepancy documented: DCAS lists Tay Ninh for Stoltz; 2nd Brigade AO was Binh Long; event page uses Binh Long as working location
- 5 open questions (oq-01 public, oq-02 through oq-05 private)

### NEW KIA profiles (all via updated script + manual fixes)

**jones-willie-gerald** (built in Session 65 from script; manually enriched)
- SP4, Fort Lauderdale FL, b. 1947-11-15, age 21
- MOS 11B20 · Infantryman; arrived 1968-05-01; Wall 37W/40
- Decorations (confirmed from VW individual page, set manually): Bronze Star Medal (valor), Bronze Star Medal, Purple Heart, Air Medal, Good Conduct Medal, NDSM, VSM, VCM
- Timeline KIA body: written with action narrative referencing Stoltz and Williams

**stoltz-donald** (built via updated script + fixes)
- SP4, Milwaukee WI, b. 1948-01-17, age 20
- MOS **11C20 · Indirect Fire Infantryman** (mortar man — noteworthy)
- Arrived 1968-04-21; Wall 37W/42; 7½ months in-country
- Decorations confirmed: Purple Heart, NDSM, VSM, VCM; Bronze Star + Air Medal in unconfirmed pending VW individual page check
- field/ folder processed: `stoltz-gear.jpg` + `photos/field/index.md`
- VW URL: `https://www.virtualwall.org/ds/StoltzDR01a.htm`

**williams-william** (built via updated script + fixes)
- SSG, Horton MS, b. 1946-10-15, age 22
- MOS 11B40 · Infantryman; arrived 1968-08-31 (only 3 months in-country); Wall 37W/44
- Confirmed 2nd squad team leader per squad leader Mike "Mouse" McGhie (Angry Skipper site)
- Decorations confirmed: Purple Heart, NDSM, VSM, VCM; Bronze Star (valor) + Air Medal in unconfirmed pending VW individual page check
- VW URL: `https://www.virtualwall.org/dw/WilliamsWC01a.htm`

### `_alongside.json` — all three wired
`same-action` basis, all three pointing to each other. Written to each soldier's folder.

### KIA list updated
Stoltz and Williams set to `**stub**`; Williams slug corrected from `williams-william-charles` to `williams-william`.

---

## CRITICAL LESSONS

1. **Script deployment — use top-level KIA folder.** The skills plugin cache is read-only and not locatable on disk via normal file browsing. Keep `build_profile.py` at `KIA/build_profile.py` and override the path in each skill invocation. Do NOT try to locate `%APPDATA%\Claude\local-agent-mode-sessions\skills-plugin\...`.

2. **PNG → JPG conversion required before script run.** Script expects `.jpg` profile photos. Convert with:
   ```python
   from PIL import Image
   img = Image.open('slug-profile.png').convert('RGB')
   img.save('slug-profile.jpg', 'JPEG', quality=92)
   ```

3. **NDSM/VSM/VCM are always confirmed for Vietnam KIA.** HS shows them grey-star (probability-based), but these are certain for any in-country Vietnam-era KIA. After script run, always promote these three to the `decorations:` block manually (or update the script to auto-promote them for Vietnam-era KIA — not yet done).

4. **Decoration data lives on VW individual soldier page, not the Profile popup.** The Profile popup HTML (`www.VirtualWall.org Profile.html`) has NO decoration data. The `was awarded:` string is on the individual page (e.g., `JonesWG01a.htm`). For now, HS star-color parsing catches confirmed/unconfirmed; VW individual page must be checked manually for Bronze Star / Air Medal.

5. **Event page FIRST, then profiles.** The event page needs to exist before running the skill so the skill can reference it for body text context. Build order: event page → profiles → `_alongside.json` → publish.

6. **Williams slug is `williams-william`, not `williams-william-charles`.** The KIA list had the longer form; corrected in both the list and the event page.

---

## Outstanding / carry-forward

- **R2 photo uploads (immediate):** `node scripts/upload-soldier-photos.cjs jones-willie-gerald` / `stoltz-donald` / `williams-william`
- **Decoration confirmation:** Check VW individual pages for Stoltz (`StoltzDR01a.htm`) and Williams (`WilliamsWC01a.htm`) — Bronze Star and Air Medal likely confirmed there; promote if so.
- **Williams hometown:** VW says "Morton, MS"; KIA list and honor roll say "Horton, MS." Verify against DCAS MS alpha PDF (`archives.gov/files/research/military/vietnam-war/casualty-lists/ms-alpha.pdf`).
- **NARA RG 472:** Pull 2/8 Cav after-action report and daily staff journal for 4 Dec 1968 — confirm grid, nature of contact (follow-on vs. separate patrol), platoon, province.
- **McGhie first-person account:** Mike "Mouse" McGhie (squad leader, Angry Skipper site) is a primary source for the Dec 4 action. Contact if possible.
- **Script improvement:** Auto-promote NDSM/VSM/VCM to confirmed for Vietnam-era KIA (currently script leaves them in HS probability-based / unconfirmed unless HS happens to show them with a colored star).
- **9 dangling alongside links** (carry-forward from Session 64): caruthers-tom, catterson-jim, degraff-roger, fairchild-joe, graham-ray, holtzclaw-bill, kinsey-charles, murray-lynn, ryneska-john. Scaffold stubs or render un-profiled alongside names as plain text.
- **Bronze Star research (carry-forward):** Coffey (family medal photo) and Hamill (VVMF states BSM w/ "V" device) — promote to confirmed when citation / DD-214 located.

---

## NEXT SESSION

Michael has a project outside the events/profiles workflow that may require a full read of the `_sessions/` handoff folder and use of Opus. Details TBD.

Next KIA cluster candidates (if returning to profiles):
- **1969-05-25 — 3 KIA:** Garven (Wayne Eric), Karr (John Preston, 1LT), White (Richard Neal)
- **1969-10-08 — 3 KIA:** Altizer (Albert Harold), Benson (Joseph Henning), Taylor (Jerome Milton)
- **2-man clusters:** 1967-01-28 (Keller, Yates) · 1967-03-01 (Burton, R.E. Johnson) · 1967-03-18 (M.N. Johnson, Woodall) · 1967-05-30 (D.I. Nelson, Sutt) · 1967-12-11 (Follett, Paulson) · 1969-01-28 (Eskridge, Pipher) · 1969-02-05 (Edmonds, Kmit) · 1969-11-20 (Carlucci, Matthei)

---

## Technical notes (permanent)
- **CSS deploy sync:** `xcopy /E /Y assets _site\assets` from `site/` before `wrangler deploy`
- **Git:** push via GitHub Desktop
- **Profile photo resolution:** crawler `photosBySlug[slug].profile[0]` (from `photos/profile/index.md`) precedes `profile_photo`. Every soldier with an image needs a `photos/profile/index.md`.
- **Service IDs are SSNs:** never publish.
- **Script location:** `KIA/build_profile.py` (top of KIA folder, not in skill cache)
