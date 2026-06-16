# d281staircav — Session 67 Handoff
**Date:** June 15, 2026
**Continues from:** Session 66 (1969-05-25 / Hau Nghia trail-ambush cluster + KIA playbook)
**Theme:** 1969-10-08 / Song Be river-crossing cluster; an MIA banner feature; division/brigade
operational context pages built from primary unit records (AD0506273, AD0520447); a unit-history
rebuild; and the decision to stand up a formal sources/citations system next.

---

## What Session 67 accomplished

### NEW CLUSTER (published): River-Crossing Drowning, Song Be River — Oct 8, 1969
Event: `site/events/river-crossing-song-be-1969-10-08/index.md` — `status: published`. A
**non-hostile** event: a platoon-sized 2/8 Cav patrol crossing the Song Be in two boats; the
first boat (≈15 aboard, Third Squad in full combat gear) capsized; three D Co men drowned.
Sourced primarily to a researched VVMF remembrance (wkillian, citing the Coffelt Database + POW
Network), Honor States, Virtual Wall, POW Network (a362), and an obituary.

### NEW KIA profiles (script-built + enriched)
- **altizer-albert** — CPL Albert Harold Altizer, Squire WV, b. 1949-04-11, MOS 11B10, arrived
  1969-08-04, Wall **17W/49**. **MIA — body never recovered** ("Killed, Body Not Recovered");
  memorialized at the Courts of the Missing, Honolulu. Posthumously promoted PFC→CPL while
  missing. Province nuance: crossing in Phuoc Binh; a later (unconfirmed) intel report of a
  buried American near Binh Duong.
- **benson-joseph** — PFC Joseph Henning Benson, Coram MT (b. Havre 1949-02-16), arrived
  1969-07-11, Wall 17W/49. Body recovered; buried Woodlawn Cemetery, Columbia Falls MT. Full
  obituary folded in (Columbia Falls HS '67, Anaconda Aluminum, drafted 1969-02-11, family).
- **taylor-jerome** — PFC Jerome Milton Taylor, Battle Creek MI, b. 1947-11-14, arrived
  1969-08-22, Wall **17W/53** (CORRECTED from 17W/49 on the master list + handoff). Body
  recovered. NAME DISCREPANCY: a remembrance says he is buried as "John Milton Taylor." **No
  photo staged** (VVMF has 3).
All three: NDSM/VSM/VCM promoted to confirmed; **no Purple Heart** (non-hostile); platoon
unknown (script default Skull cleared); `_alongside.json` wired all three; KIA list marked
`**stub**`; Taylor row corrected to 17W/53.

### NEW FEATURE: MIA banner
`remains: not_recovered` front-matter flag drives a bronze-bordered **"MIA / Body Not
Recovered"** banner beneath the commemorative star (kept `status: kia` so KIA standards/roster
star/collection remain). Added `.prof-mia-banner/.prof-mia-tag/.prof-mia-sub` to
`assets/css/main.css` and the block to `_includes/layouts/soldier.njk`. Applied to Altizer;
**this is the standing convention for any future MIA.**

### NEW: operation/brigade CONTEXT pages (type: operation, published)
1969 (from **AD0506273**, 1st Cav Div ORLL, period ending 31 Jul 1969):
- `operation-toan-thang-iii-1969` (umbrella), `operation-montana-raider-1969`,
  `operation-montana-scout-1969`, `operation-comanche-warrior-1969`, `operation-creek-ii-1969`,
  `operation-kentucky-cougar-1969`.
- KEY corrected mapping: 2/8 Cav = **1st Brigade**, War Zone C. Its May ops were **Montana
  Raider** (3-bde, to 13 May) then **Montana Scout** (1st+2nd Bde, to 23 Jun). **Comanche
  Warrior / Creek II were 3rd Brigade, War Zone D — NOT 2/8 Cav** (an earlier "May 25 =
  Comanche Warrior" note was corrected).
1971 (from **AD0520447**, 3rd Bde (Separate) Senior Officer Debriefing Report, BG Jonathan R.
Burton, 10 Apr–13 Dec 1971):
- `3rd-brigade-separate-garryowen-1971` — Garryowen Task Force, Bien Hoa, ~3,500 sq mi
  Long Khanh/Binh Tuy/War Zone D AO; 2/8 Cav one of four maneuver battalions; the
  find-fix-react / "Mini-Cav" platoon airmobile doctrine (= the April 20 air assault, in the
  brigade's own words); Vung Tau R&R rotation + Flying PX/"King for a Day" (with a published
  contribution prompt, oq-02). **The full PDF is hosted for download** at
  `site/assets/docs/AD0520447-3rd-bde-sep-sodr-1971.pdf` with a cover image (title page) in the
  event Images tab.
- The "Bunker Training" passage (report p.10) was added to the **April 20 event** as an
  "Aftermath" section (hedged: report dates the bunker-casualty surge to "since May 1971," so
  April 20 exemplifies, not causes, it).
- **Fontaine→Fanning REMOVED:** the "Why FSB Fontaine became FSB Fanning" paragraph (FSB-reuse
  speculation) was deleted at Michael's direction — he believes Fontaine and Fanning were two
  distinct places. See carry-forward.

### Cross-linking
`related_events` wired both ways: Montana Scout ↔ the May 25 event; the 3rd Bde page ↔ all four
1971 D Co events (contact 4/20, crash 4/24, chieu-hoi 5/71, nui-ba 10/71). NOTE: event.njk does
**not** render `related_events` — it is relational data only (for the graph / future use).

### Research notes (internal, `_docs/`)
- `may-1969-casualty-cluster.md` — May 1969 = 2nd-deadliest D Co month (after Mar '67; the May
  '72 Chinook crash set aside). Per-man data (Neil Brown 5/2, George Brown 5/12 Tay Ninh,
  Dunkle 5/13 Tay Ninh, the 5/25 trio). Modeling decision: a **chain of linked event pages
  (the April 1971 Fontaine model), not one merged narrative**; link `operational-period` until
  a record proves causation, then `causal`. What the ORLL establishes vs. what only the daily
  journal can give. **NOT built — parked pending records.**
- `primary-records-finding-aid.md` — TTU Virtual Archive / DTIC / NARA RG 472 pathfinder.
  Pinned: AD0506273 (ORLL end 31 Jul 69, May cluster), AD0508303 (end 31 Oct 69, Oct 8 cluster),
  AD0520447 (3rd Bde SODR 1971). 1971 section (3rd Bde Separate era).
- `locations/vung-tau.md` — added the AD0520447 R&R-rotation detail (R&R Center opened Vung Tau
  Mar 1971; 45-day standdown).

### Unit-history rebuild (`unit-history.njk`) — build-validated
- **Year headings restored** (date-grouped within each section, ascending).
- Sections now: **Contact, Incidents, Crashes, Operations, Memorials** (was contact/crash/
  incident/memorial + an "Other" catch-all).
- **"Other" → "Operations"** (the type:operation pages).
- **Bee Incident** retyped `incident` (was untyped → fell into Other).
- **Memorials surfaced:** `memorial-colburn-2021` published + retyped `memorial` (was draft,
  untyped); `nf34-memorial-2022` retyped `memorial` (was `commemorative`).
- Ran `npx @11ty/eleventy` to confirm it renders (272 files, sections + year markers correct).

---

## CRITICAL LESSONS

1. **The ~7KB mount truncation bug recurred and corrupted MULTIPLE files mid-session** (the Oct
   event page, all three soldier `.md`, `main.css`, the KIA list). Reads on the mount were also
   inconsistent (wc/diff disagreed on the same file; `git checkout` hit "operation not
   permitted"). **Recovery that worked:** rebuild from a known-good source — `git show HEAD:...`
   for tracked files, full heredoc for new files — and **write via bash `cp`/heredoc then verify
   with `cmp` in the SAME command.** The Read/Write/Edit tools truncate; bash + cmp is reliable.
   Treat every non-trivial write this way.
2. **ORLL operation attribution is messy.** Division operations run concurrently by different
   brigades; map a death to the unit's **brigade AO**, not just the date. (2/8 Cav = 1st Bde,
   War Zone C; the calendar-overlapping Comanche Warrior was 3rd Bde, War Zone D.)
3. **Site mechanics:** `collections.events` = glob `./events/**/*.md` (new pages auto-include);
   `events/events.json` sets only `layout`; **`related_events` is NOT rendered** (data only);
   `/assets/*` is served statically but Eleventy passthrough is **disabled** — must
   `xcopy /E /Y assets _site\assets` after build; `/media/*` is served from R2 (so downloadable
   docs go in `assets/`, not `media/`).
4. **Fontaine vs Fanning is unresolved and the existing pages disagree:** the crash page
   (`crash-fsb-fontaine-1971-04-24`) states Fontaine "was subsequently renamed FSB Fanning"
   (McGrew calendar); the April 20 page says "the next FSB was named" Fanning (distinct).
   Michael believes they were **two distinct places** → the crash page "renamed" language needs
   reconciling.

---

## NEXT MAJOR INITIATIVE — a formal sources / citations system

**Michael's framing:** "The research is sound, but it wouldn't hold up as definitive without
good citations." Goal: every non-obvious claim on a public page traceable to a cited source,
with primary/secondary tiering and unconfirmed claims clearly flagged. Expect a **large
file sweep** and **item-by-item questions**.

**Current (inconsistent) state:**
- Event pages: free-text `sources:` front-matter list; some inline footnotes (e.g.
  `contact-fsb-fontaine-1971-04-20` uses `[^sargent-m60]`).
- Soldier profiles: `links:` (wall + other); source detail buried in admin `notes:`; a good
  existing model — `decorations` (confirmed) vs `decorations_unconfirmed` (Honor States
  probability-based) — worth generalizing.
- `_docs`: ad hoc "Source:" lines.
- No standardized, rendered "Sources/References" UI; no source tiering; primary vs secondary
  not marked.

**Proposed scope:**
1. Define a citation schema + format: a per-page sources list with stable IDs, optional inline
   footnote refs pointing to it. **Tier** each: primary (unit records — ORLL/SODR/AAR/daily
   journal at DTIC/NARA), secondary (VVMF, Virtual Wall, Coffelt, Honor States, FindAGrave, POW
   Network, association newsletters), tertiary/derived (Wikipedia, unit histories), and
   first-person accounts (depositions, oral histories, family).
2. Decide rendering: a "Sources" section/tab on event + soldier pages (event.njk already has
   `sources` in front matter; soldier.njk has an "External resources" tab to extend).
3. **Sweep** every soldier profile, event, and doc: enumerate substantive claims, attach a
   source ID, flag unsourced/weak claims, standardize the Honor States probability labeling.
4. **Item-by-item questions** where provenance is ambiguous (Michael's own knowledge, family
   contributions, oral vs documentary).
5. Sensitive-sourcing rule: never expose SSNs; cite DCAS without the service number.

**Suggested approach:** pilot the schema on ONE well-sourced page (e.g.
`contact-fsb-fontaine-1971-04-20`, which already has footnotes + depositions) and ONE soldier,
agree the pattern with Michael, then sweep.

---

## Outstanding / carry-forward

- **DEPLOY PENDING:** from `site/` — `npm run build` → `xcopy /E /Y assets _site\assets`
  (carries CSS + the AD0520447 PDF/cover) → `wrangler deploy`. Push via GitHub Desktop.
- **R2 photo backfill:** `node scripts/upload-soldier-photos.cjs altizer-albert benson-joseph`
  (Taylor has no photo yet).
- **Crash page Fontaine/Fanning** — reconcile the "renamed" language (Lesson 4).
- **Taylor** — photo; resolve "John Milton Taylor" given-name + burial (DCAS/SSDI/FindAGrave).
- **Decorations** — confirm Bronze Star/Air Medal for the Oct 8 men via VVMF/individual VW.
- **May 1969 cluster** — pull AD0506273 in full + NARA RG 472 2/8 Cav daily journal; only then
  build the May event chain (Montana Raider / Montana Scout framing already drafted in the note).
- **1971 tactical chain** — order the 3rd Bde Separate quarterly ORLLs + the 2/8 Cav daily
  journal (NARA RG 472) for the April 20/24 detail; reconcile the April 20 enemy (the AO's
  MR-7 Rear Service Group / 33rd NVA Regt vs the "83rd NVA rear service unit" on the event).
- **`_docs` build as public orphan pages** — `.eleventyignore` excludes only `SETUP.md` +
  `prototype/`; if research notes should stay off the public site, add `_docs/`.
- **Older carry-forward (Session 66):** 9 dangling alongside links; Bronze Star research for
  Coffey & Hamill (1965); FSB Donna McGrew→McDonald attribution fix.

---

## Technical notes (permanent)
- **KIA build playbook:** `site/_docs/kia-profile-playbook.md` — start here for new clusters.
- **Mount truncation:** bash heredoc/`cp` + `cmp` verify for every non-trivial write; recover
  tracked files from `git show HEAD:`.
- **Downloadable docs** live in `site/assets/docs/` (served at `/assets/docs/` after the asset
  xcopy), NOT in `/media/` (R2). Cover images via `pdftoppm -jpeg -f N -l N -scale-to 1000`.
- **Operation/context pages:** `type: operation`; render under the unit-history "Operations"
  section; relationship vocab in `related_events`: parent-campaign / subordinate-operation /
  concurrent-operation / preceding-operation / operational-period (data only — not rendered).
- **Service IDs are SSNs:** never publish.
