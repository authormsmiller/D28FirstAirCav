# d281staircav — Session 66 Handoff
**Date:** June 15, 2026
**Continues from:** Session 65 (1968-12-04 / Operation Sheridan Sabre cluster)
**Theme:** 1969-05-25 / Hau Nghia "trail ambush" cluster (3 KIA + survivor stub), a unit-history milestone, and a permanent KIA build playbook

---

## What Session 66 accomplished

### NEW CLUSTER (published): Command-Detonated Ambush, Hau Nghia — May 25, 1969
Event page: `site/events/trail-ambush-hau-nghia-1969-05-25/index.md` — `status: published`, `publish: true`.

The defining source is a family remembrance (Andrew Clooney, son of D Co RTO Ray Clooney) on
the VVMF pages of Garven and Karr: 1LT Karr, CPL Garven, and CPL White were killed together by
a **single command-detonated B-40 rocket rigged in trees above a trail**. D Co's callsign was
"**White Skull**." A coin flip put Garven on Karr's radio that day and kept Ray Clooney off it;
Clooney survived. All three casualty records independently read **"Other explosive device"** —
strong corroboration. All three carry casualty province **Hau Nghia**, Panel 24W.

### NEW KIA profiles (script-built + manually enriched)
- **garven-wayne** — CPL Wayne Eric Garven, Mt. Vernon OH, b. 1948-02-04, MOS 11B10, arrived
  1969-02-21, Wall 24W/102. RTO. (KIA list had him as PFC — **corrected to CPL**.)
- **karr-john** — 1LT John Preston Karr, Kenner LA, b. 1947, MOS 1542 (Infantry Unit Commander),
  arrived 1969-03-12 (~10 weeks in-country), Wall 24W/104. Skull Platoon leader. VMI grad,
  possibly a new father. Parser missed DOB/hometown (officer record) — set manually from VVMF.
- **white-richard** — CPL Richard Neal White, **Golden Valley, MN** (Hennepin County),
  b. 1946-07-30, MOS 11B10, arrived 1969-02-16, Wall 24W/109. (KIA list said "Golden Valley,
  **NM**" — **corrected to MN**, since confirmed by his Honor States page.)

All three: NDSM/VSM/VCM promoted to confirmed; KIA timeline narratives written; admin notes
log discrepancies; marked `**stub**` on the KIA list; event casualty notes set to "Profile
created."

### NEW survivor stub + account document
- **clooney-ray** — Ray Clooney, RTO, **Skull Platoon** (per Jim Garvin's D Co roster, "Skull
  1969-70"), `status: veteran`, deceased **July 19, 2017**. Photo supplied via the `profiles/`
  drop-in workflow.
- `documents/clooney-ray/clooney-ray-coin-flip/` — both Andrew Clooney remembrances reproduced
  **verbatim**, `author: clooney-ray`, `event:`-linked, `tagged:` to the three KIA. Published.

### `_alongside.json` — wired four ways
Each of the three KIA points to the other two (basis `same-action`) **and** to clooney-ray
(survivor); clooney-ray points back to all three. All 12 cross-references verified to resolve.

### Research — the 25 May 1969 mission context
- Operational frame is **most likely Operation Toan Thang III** (III Corps offensive umbrella,
  17 Feb–31 Oct 1969) — the 1st Cav's 1969 border-interdiction campaign of company/platoon RIF
  patrols off small hasty firebases. This is **hedged on the page as "likely, not confirmed."**
- **Unresolved crux: Hau Nghia vs. Tay Ninh.** Every casualty record says Hau Nghia, but the
  1st Cav's documented 1969 AO was Tay Ninh / War Zone C. Either DCAS province error or the
  screen reached south. Resolve via the **1st Cav ORLL, period ending 31 July 1969** (Texas
  Tech Vietnam Center & Archive, vva.vietnam.ttu.edu; also DTIC) and the **2/8 Cav daily staff
  journal / AAR, 25 May 1969** (NARA RG 472). Captured as open question oq-07.
- Caution: the CMH *Airmobility* chapter's "25 May" D/2-8 Cav cache find is **1970** (Cambodia),
  not our date.

### Unit-history milestone added
`site/unit-history.njk` now has a narrative section, **"The First Team Goes Home — The Brigade
Stays"** (scoped inline `<style>`, uses site color vars). Confirmed fact: when the 1st Cav
Division ended Vietnam duties (26 Mar 1971) and redeployed that spring, the **3rd Brigade
(Separate), "Garryowen Task Force"** (activated 30 Apr 1971) stayed until late June 1972 — and
**2/8 Cav was one of its four maneuver battalions** (with 2/5, 1/7, 1/12 Cav, F/9 Cav, 215th
Spt). This is why D Co kept taking losses in 1971–72 (Fontaine, Núi Bà, the May 1972 Chinook
crash) after the division left. AO shifted to War Zone D / Saigon–Long Binh defense out of Bien
Hoa. Ends with a placeholder to add SGT Marvin Miller's "rumors of coming home" letters.

### NEW permanent doc: KIA build playbook
`site/_docs/kia-profile-playbook.md` — the canonical, repo-versioned procedure (build order,
staging convention, script command, manual enrichment checklist, cross-linking, records,
publish/deploy, gotchas, reference profiles). **It overrides the `kia-profile` skill's SKILL.md
where they disagree** (the skill cache is read-only, partly Chinook-specific, stale paths).

### Site-wide standardization
- Event "Draft research page" banners → **"Research page — in progress."** on all three
  (Pleiku, Sheridan Sabre, Hau Nghia).
- Public contribution prompts (the `publish: true` open question) rewritten from research
  questions to **invitations**, each ending with the standard low-barrier line:
  *"You don't need to have researched anything or know the operation's name — a nickname, a
  face, or a fragment of that day all help us complete the record."* Baked into the playbook
  (Section 2) as the standing convention.

---

## CRITICAL LESSONS

1. **~7KB mount write-truncation is real and bit us again.** The Edit/Write file tools
   silently truncated `unit-history.njk` at ~7KB on an insert (reported success). Fix: for any
   non-trivial write/insert, use a bash `cat > file <<'EOF' … EOF` heredoc and **verify with
   `wc -c` + `tail`** and a tag-balance check. Small one-line edits via Edit are fine.
2. **Edit tool requires a Read-tool read first.** Reading a file via bash (`awk`/`sed`) does
   NOT satisfy it; and after any sed edit the file is "modified since read." Read (tool) the
   region, then Edit.
3. **The Donna evidence is McDonald's ("Range") calendar + a Range-platoon photo — NOT
   McGrew's.** McGrew's element went Fontaine → Vung Tau (R&R 4–7 May) → Fanning (from 7 May).
   In early May 1971 D Co was split across firebases. `site/_docs/locations/fsb-donna.md`
   Section 4 wrongly credits the McGrew calendar — not fixed this session (Michael declined),
   but worth correcting; also a strong working hypothesis that the 30 Apr brigade activation at
   Bien Hoa explains a brief Donna posting before the newly-named FSB Fanning was set up.
4. **Officer records often miss DOB/hometown in the parser** — fill manually from VVMF (Karr).
5. **Province agreement across a cluster is a same-action signal, but the province can still be
   wrong** — reconcile against the unit's documented AO, don't take DCAS at face value.

---

## Outstanding / carry-forward

- **SITE BUILD IS HELD** (Michael's call) until enough is batched. Pending deploy includes: the
  1969 event flip to published, all three banner rewrites, all three invitation-form prompts,
  the unit-history milestone, and the playbook. Deploy = build + `cp -r assets _site/assets`
  (local) / `xcopy /E /Y assets _site\assets` before `wrangler deploy`, push via GitHub Desktop.
- **R2 photo uploads** — confirm all four are up: garven-wayne, karr-john, white-richard, and
  **clooney-ray** (created late; verify): `node scripts/upload-soldier-photos.cjs <slug>`.
- **Decoration confirmation** — check VVMF / individual VW pages for Bronze Star / Air Medal for
  Garven, Karr, White; promote if confirmed.
- **Karr DOB** — KIA list 1947-01-14 vs VVMF 06-14-1947; resolve vs DCAS (oq-03).
- **Operation + province** — 1st Cav ORLL (ending 31 Jul 1969, Texas Tech) + 2/8 Cav staff
  journal (NARA RG 472) for operation name, AO, grid, the trail (oq-02, oq-07).
- **Andrew Clooney** — contact for Ray's original letters home (primary source for the action);
  add to clooney-ray + the coin-flip doc.
- **FSB Donna note** — optional: fix McGrew→McDonald attribution; add the brigade-activation
  staging hypothesis; record the Range-platoon "FSB Donna, early May" photo.
- **1971–72 event prompts** — optional: apply the invitation-form / low-barrier treatment to
  Fontaine, Núi Bà, Chinook-crash event pages.
- **Carry-forward (older):** 9 dangling alongside links (caruthers-tom, catterson-jim,
  degraff-roger, fairchild-joe, graham-ray, holtzclaw-bill, kinsey-charles, murray-lynn,
  ryneska-john); Bronze Star research for Coffey & Hamill (1965 cluster).

---

## NEXT SESSION — next cluster

**Recommended next (last remaining 3+ KIA cluster):**
- **1969-10-08 — 3 KIA:** Altizer (Albert Harold), Benson (Joseph Henning), Taylor (Jerome
  Milton) — **all three on Wall line 17W/49**, which is an even tighter single-action signature
  than the 24W spread of the May cluster. Slugs per the KIA list: `altizer-albert`,
  `benson-joseph`, `taylor-jerome`.

**Then the 2-man clusters** (from the master list): 1967-01-28 (Keller, Yates) · 1967-03-01
(Burton, R.E. Johnson) · 1967-03-18 (M.N. Johnson, Woodall) · 1967-05-30 (D.I. Nelson, Sutt) ·
1967-12-11 (Follett, Paulson) · 1969-01-28 (Eskridge, Pipher) · 1969-02-05 (Edmonds, Kmit) ·
1969-11-20 (Carlucci, Matthei).

**Workflow:** follow `site/_docs/kia-profile-playbook.md` start to finish. Michael stages the
three saved web pages + photo per man into `KIA/<batch>/<slug>/`; build the event page first,
then run `KIA/build_profile.py` per man, enrich, cross-link, update records, publish.

---

## Technical notes (permanent)
- **KIA build playbook:** `site/_docs/kia-profile-playbook.md` — start here.
- **Script:** `KIA/build_profile.py` (top of the KIA folder, not the skill cache). `--kia-dir`
  points at the batch folder; platoons are Skull/Cat/Range.
- **Master KIA list:** `site/_docs/d-co-kia-list.md` (mark `**stub**`; correct + note errors).
- **CSS deploy sync:** `xcopy /E /Y assets _site\assets` from `site/` before `wrangler deploy`.
- **Git:** push via GitHub Desktop.
- **Profile photo resolution:** crawler `photosBySlug[slug].profile[0]` precedes `profile_photo`;
  every soldier with an image needs `photos/profile/index.md`.
- **Service IDs are SSNs:** never publish.
- **Mount truncation:** heredoc + verify for non-trivial writes.
