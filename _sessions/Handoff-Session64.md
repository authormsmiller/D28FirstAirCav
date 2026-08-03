# d281staircav — Session 64 Handoff
**Date:** June 12, 2026
**Continues from:** Session 63 (Pleiku / Hill 732 cluster build-out)
**Theme:** Building event pages + KIA profiles from the same-day multi-KIA clusters, working down the list.

---

## What Session 63 accomplished

### Site fix — "Served Alongside" card photos (root-caused and fixed)
- Bug: Tier-1 alongside cards resolved photos from the `profile_photo` front-matter field, while the hero uses the crawler (`photosBySlug[slug].profile[0]`). Soldiers with a `photos/profile/index.md` but empty `profile_photo` showed initials instead of their photo.
- Fix in `site/_includes/layouts/soldier.njk`: card now resolves crawler-first (matches hero), `profile_photo` as fallback.
- Also created missing `photos/profile/index.md` for 6 soldiers that had an image but no index (aguilar-oscar, boatright-william, kint-joe, randt-larry, rosenberg-kenneth, woo-robin).

### Profile photos wired (drop-in workflow via the `profiles` connected folder)
- berry-dave, cardwell-james, wilson-david — image dropped in `profiles/`, copied into repo, `index.md` written, source moved to `profiles/done/`.

### NEW EVENT (published): Pleiku Campaign — Hill 732, 4 Nov 1965
- `site/events/pleiku-campaign-1965-11-04/index.md` — `status: published`, `publish: true`.
- Three D Co KIA, same day, consecutive Wall lines (3E/16 Barnett A Co; 3E/17 Coffey, Hamill; 3E/18 Hill).
- Action: Operation All the Way (under Operation Long Reach), 1st Brigade pursuit after Plei Me; enemy = 33rd PAVN Regiment; ground = Hill 732, Chu Pong–Ia Drang, Pleiku Province.
- Corroborated by SP4 David "Doc" Wilson first-person account (see document below).

### NEW KIA profiles (hand-built in Chinook/aguilar format — NOT via the crash script)
- `coffey-richard` (SGT, Los Angeles CA), `hamill-wright` (PFC, Albany OR), `hill-eddie` (CPL, Mobile AL). All with profile photos, timelines, `related_events`, and `_alongside.json` linking the three together (Tier 3 "Also in the company"; basis `same-action`, NOT same-platoon since 1965 platoons unknown).

### NEW veteran stub + document
- `wilson-david` (SP4 "Doc" Wilson, D Co medic, living veteran) — stub profile + photo.
- `documents/wilson-david/wilson-david-troopers-tale/` — his "Trooper's Tale" account (The Saber, 1CDA, Mar/Apr 2023), `event:`-linked to the Pleiku page. Phone redacted (restricted).

### Unit-history page
- Added full-width yellow (`--y`) / black (`--blk`) **year markers** within each type group (new `.uh-year-marker` class in main.css). Type label stays dominant.
- Fixed heading span: byline + meta description now **1965–1972** (was 1970–1972).

---

## CRITICAL LESSONS (read before editing)

1. **Mount write-truncation — use whole-file `bash` heredoc for non-trivial writes.** The Read/Write/Edit file tools on this repo mount can silently truncate large writes (~6.5KB) while reporting success — this cost most of Session 63's debugging time on `unit-history.njk` and earlier the event page. For anything beyond a tiny one-line edit, write the COMPLETE file via `cat > file <<'EOF' ... EOF` in bash and verify `wc -c` / `tail`.
2. **Assets after any `_site` rebuild.** Eleventy does NOT copy `assets/`. After `rm -rf _site` + build, run `cp -r assets _site/assets` (the local equivalent of the deploy `xcopy /E /Y assets _site\assets`). Forgetting this strips ALL CSS from the local preview.
3. **Photos live in R2, not git.** New soldier profile images must be pushed: `node scripts/upload-soldier-photos.cjs <slug>`. Repo only tracks `index.md`.
4. **Province = event location is source of truth.** DCAS/Honor States province fields for 1965 casualties are garbage — the four Hill 732 men carry four different wrong provinces (Tay Ninh, Binh Duong, Long Khanh, Thua Thien). Use the event's reconstructed location.
5. **Decorations tiers:** confirmed = displayed on the Virtual Wall; unconfirmed (`decorations_unconfirmed`, not rendered) = Honor States probability-based or photo/text-only. Template only displays the confirmed list.
6. **KIA script is Chinook-specific.** `scripts/build_profile.py` hardcodes the crash narrative/date/VHPA link/platoon peers. For non-crash events, hand-build the profile in the aguilar-oscar format.

---

## Outstanding / carry-forward
- **R2 photo upload before/after push:** coffey-richard, hamill-wright, hill-eddie, wilson-david (and berry-dave, cardwell-james if not already done).
- **9 pre-existing dangling alongside links** (un-profiled men tagged in others' photos/docs): caruthers-tom, catterson-jim, degraff-roger, fairchild-joe, graham-ray, holtzclaw-bill, kinsey-charles, murray-lynn, ryneska-john. Either scaffold stubs or make the alongside card render un-profiled names as plain text instead of dead links.
- **Bronze Star research:** Coffey (family medal-display photo) and Hamill (VVMF states BSM w/ "V" device) — promote from unconfirmed to displayed when a citation / DD-214 is located.
- **NARA RG 472:** pull the 2/8 Cav AAR + daily staff journal for 4 Nov 1965 to confirm LZ Juliet / LZ Cavalier and the A Co + D Co company scheme of maneuver.

---

## NEXT SESSION — next multi-KIA cluster

Same-day clusters with NO event page yet (from the unit fatality list; 1965-11-04 now DONE). Recommend working largest-first:

- **1968-12-04 — 4 KIA (RECOMMEND NEXT):** Jones (Willie Gerald), Stoltz (Donald Robert), Williams (William C. / William Charles — *likely the same man double-listed; verify and dedupe*). Biggest single-day cluster after the Chinook crash.
- **1965-11-04 — 3 KIA:** DONE (this cluster).
- **1969-05-25 — 3 KIA:** Garven (Wayne Eric), Karr (John Preston, 1LT), White (Richard Neal).
- **1969-10-08 — 3 KIA:** Altizer (Albert Harold), Benson (Joseph Henning), Taylor (Jerome Milton).
- **2-man clusters:** 1967-01-28 (Keller, Yates) · 1967-03-01 (Burton, R.E. Johnson) · 1967-03-18 (M.N. Johnson, Woodall) · 1967-05-30 (D.I. Nelson, Sutt) · 1967-12-11 (Follett, Paulson) · 1969-01-28 (Eskridge, Pipher) · 1969-02-05 (Edmonds, Kmit) · 1969-11-20 (Carlucci, Matthei).

> Note: same-DAY clustering only catches single-day actions. Multi-day operations won't surface here — a "within a few days" pass could catch those later.

### Suggested workflow for the next event
1. Identify the action (web research: Virtual Wall + Honor States + VVMF Wall of Faces per man; cross-check unit operational history for the date).
2. Michael drops each man's saved research (Honor States/Virtual Wall/Wall of Faces HTML + photo) into `KIA/<batch>/<slug>/` (e.g., `KIA/<action>/<slug>/`).
3. Build the event page first (draft), then hand-build each KIA profile in aguilar format, wire photos, add `_alongside.json` links, update event casualty notes to "Profile created."
4. Build + `cp -r assets _site/assets` + link scan, then publish (`status: published`, `publish: true`) and remember R2 uploads.

---

## Technical notes (permanent)
- **CSS deploy sync:** `xcopy /E /Y assets _site\assets` from `site/` before `wrangler deploy`.
- **Git:** push via **GitHub Desktop**.
- **Profile photo resolution:** crawler `photosBySlug[slug].profile[0]` (from `photos/profile/index.md`) precedes `profile_photo`. Every soldier with an image needs a `photos/profile/index.md`.
- **Service IDs are SSNs:** never publish.
