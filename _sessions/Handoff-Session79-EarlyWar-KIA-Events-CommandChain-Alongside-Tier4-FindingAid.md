# d281staircav — Session 79 Handoff
**Date:** June 26, 2026
**Continues from:** Session 78 (Marvin Miller letters; Fontaine drawing note). This session pivoted
off the Miller letter work entirely into **early-war (1966–68) KIA profiles, their operation/contact
events, a command-chain layer, a new "Served Alongside" Tier 4, and the Finding Aid feature design.**
**Theme:** Built a **general (non-Chinook) KIA profile skill** and used it to fill 1966–68 gaps;
stood up **two operation/contact events** (Sheridan Sabre 1968, Binh Dinh/Thayer II Jan 1967) from
primary ORLLs; added **battalion-commander stubs + a Tier 4 "Stone Mountain 6" CO connection** to the
Alongside engine; prototyped a **same-tour overlap generator**; and fully designed the **Finding Aid**
(BMB intermediary) — settling its architecture (build-time JSON + one client-side query-string page).

**Deploy:** Michael ran **R2 backfill + build + deploy at session close.** New images this session
were 5 profile JPGs (keller, yates, cromie, derosier, ahern) — covered by the backfill he ran. The
template/data changes need **no xcopy** (xcopy only syncs `assets/` CSS/JS, which were untouched; the
Tier 4 block reuses existing CSS classes).

> ⚠ **Sandbox note (process, not a repo issue):** late in the session the Linux sandbox served stale/
> truncated copies of recently-edited files (alongside.js, the 1967 event), so bash YAML/JS validation
> falsely errored. The **authoritative file view (Read tool) confirmed all files complete and valid**,
> and the user's build runs against the real files. If the build flags `contact-binh-dinh-1967-01-28`
> or `_data/alongside.js`, it'll be trivial — but they verified clean by inspection.

---

## Soldiers built this session (general skill)

All via the **new `kia-profile-general` skill** (see below). Profiles published unless noted.

- **derosier-michael** — 2LT, KIA 19 Sep 1966, Quang Tin, small arms. D Co 2/8 (skill test case).
- **cromie-michael** — PFC, **DOW 18 Nov 1968**, Tay Ninh, indirect fire. Earliest archive D Co
  Sheridan Sabre loss. (Province likely a DCAS error — 2/8 was 2nd Bde/Binh Long.)
- **keller-peter** — CPL, KIA 28 Jan 1967, Binh Dinh, frag wounds. D Co 2/8. (Died 3 days before his
  22nd birthday.)
- **yates-donald** — CPL, KIA 28 Jan 1967, Binh Dinh, frag wounds. D Co 2/8 (11H10 direct-fire
  crewman). Same action as Keller (Wall 14E/91 & /94; arrived 2 days apart Jul 66).
- **ahern-raymond** — SP4, KIA 26 Nov 1968, Tay Ninh, indirect fire. **C/2-19 Field Artillery, NOT
  D Co** — **held `draft: true`** (possibly permanently). The 1cda roster MISATTRIBUTES him to D Co
  2/8; his battery was 1st Bde DS artillery at LZ Mustang. Corrected silently on public pages, explicit
  in his held draft (Michael: don't beat the contributing site over the head with it).
- **tackaberry-thomas** / **dashiell-john** — **command stubs** (`status: researching`, Bacon/Blagg
  model). LTC Thomas H. Tackaberry (2/8 CO through 7 Feb 67) → LTC John C. Dashiell (from 7 Feb 67).
  Source: AD0385642.

`d-co-kia-list.md` profile-status updated to `stub` for derosier, keller, yates (Cromie's 1968 row
likely also needs it — quick sync pass pending).

---

## Events built / corrected

- **NEW `events/operation-sheridan-sabre-1968/`** (type: operation) — the 1st Cav's first III Corps
  operation (7 Nov 1968 – 4 Apr 69, under Toan Thang II). Built from two primary ORLLs (Division
  AD0502597, DivArty AD0502415). Frames the Nov 1968 Tay Ninh/Fishhook fighting. **Key correction
  captured:** 2/8 Cav was a **2nd Brigade** battalion (Fishhook/Binh Long); Ahern's C/2/19 was **1st
  Brigade** DS artillery (Tay Ninh). Per the **scope decision**, the public page gives the November
  loss as an **aggregate of eleven** (10 of 2/8 + Ahern), NOT a named battalion roster; the named
  roster is retained in the event's non-published frontmatter notes.
- **MODIFIED `events/operation-sheridan-sabre-1968-12-04/`** — the Dec 4 1968 D Co cluster
  (Jones/Stoltz/Williams). The Division ORLL corrected it to **"C and D Companies, 2/8 Cav, vic XT
  4687"** (was D Co only); resolved oq-03 (2/8 = 2nd Bde, so the men's "Tay Ninh" records are DCAS
  errors; Binh Long stands); linked to the parent Sheridan Sabre event.
- **NEW `events/contact-binh-dinh-1967-01-28/`** (type: contact) — Keller + Yates, Operation
  **Thayer II**, **Kim Son Valley**, 1st Brigade, CO LTC Tackaberry. **Candidate location pinned: LZ
  Minh (BR707760)**, D Co's documented Jan 1967 position per the 2/8 firebase-by-year list (B Co at
  LZ Ho, C Co at LZ Chi nearby). ORLL for period ending 31 Jan 1967 confirms the AO; the day-of action
  is below the division narrative threshold (needs the 2/8 daily journal). The named 27 Jan division
  contact was 2/12 Cav at Bong Son — explicitly flagged NOT to conflate.

ORLL PDFs filed in each event's `sources/` folder.

---

## ORLL reference (hard-won — AD numbers are mislabeled in search)

- **AD0502597** — 1st Cav **Division** ORLL, period ending **31 Jan 1969** (Sheridan Sabre).
- **AD0502415** — 1st Cav **DivArty** ORLL, period ending 31 Jan 1969 (2/19 Arty / Ahern).
- **AD0385642** — 1st Cav Division ORLL, period ending **30 Apr 1967** (Tackaberry/Dashiell, AO context).
- **31 Jan 1967 ORLL** (1 Nov 66 – 31 Jan 67) — the doc that covers the Keller/Yates action. DTIC AD
  numbering for this one is unreliable; the working copy is the **11thpathfindercompany.org mirror**
  (`ORLL-1st-Cav-HQ-Qt-Ending-31-Jan-67-min.pdf`), now filed in the 1967 event's sources/.
- **Confirmed dead-end ADs** (do NOT re-fetch for 1967): AD0509704 = 1970; AD0508303 = 1969.

---

## "Served Alongside" — now 4 tiers (engine + template changed)

`_data/alongside.js` and `_includes/layouts/soldier.njk` were modified (LIVE engine — validated by
inspection; see sandbox note):

- **Tier 4 = Commanding Officer ("Stone Mountain 6")** — basis `commanding-officer` / `chain-of-command`
  routes here; CO de-duplicated out of Tiers 1–3; renders as its own section atop the Alongside tab.
- Worked example: Keller & Yates each show **Tackaberry** as Tier 4 (via `_alongside.json` in each
  soldier dir); Tackaberry reciprocally lists both. Verified end-to-end before the stale-mount issue.
- Tier 1 = same photos/docs (auto); Tier 2 = same platoon; Tier 3 = broader peer / same-tour.

### Same-tour overlap generator (prototype, NOT yet wired to the build)
`site/admin/scripts/build_alongside_overlap.py` + `site/_data/alongside-exclude.json`. Review-first
workflow (Michael's call): `--review <slug>` surfaces candidate links for vetting; `--write` merges
`same-tour`/`same-platoon-tour` entries into `_alongside.json`. Default = everyone organic D Co; the
exclude list holds attached men (fanning, jeffries, ahern) + commanders. **`--write` has NOT been run**
— links remain manual/vetted. Membership can't be scraped from prose (regex caught 0 attached); the
exclude-list-with-review is the chosen mechanism. DEROS inferred = arrived+365 (flagged).

---

## Malec built (late this session) — DOW reframe + finding-aid dry run

- **`malec-paul`** (SGT Paul William Malec, D Co 2/8, Summerdale AL) **built and published** from his
  three source HTMLs (Honor States 365268, Virtual Wall, VVMF 32065; Find A Grave). Roster status →
  `stub`. **No photo** in folder (profile_photo pending).
- **KEY: he is DIED-OF-WOUNDS.** Virtual Wall: Incident 21 Mar 1966, Casualty 14 May 1966. Hand-fixed
  the skill output (the skill doesn't parse the VW "Incident" date): timeline is now Arrived 20 Sep 65
  (Pleiku Campaign) → **Wounded 21 Mar 66 (Op Jim Bowie; D Co at FB Phoenix City)** → **Died of wounds
  14 May 66**. 14 May is a hospital/evac date, NOT a field location — do NOT tie him to Crazy Horse
  (16 May) or any post-21-Mar position.
- **Service-number fix:** RA14547599 is a pre-1969 Army **service number, not an SSN** — corrected the
  skill's default "SSNs" caveat. (Generalize later: the SSN caveat only applies to post-~1969 IDs.)
- **Probable-presence trail** (in his field window 20 Sep 65 – 21 Mar 66) recorded in his admin notes
  and `KIA/malec-paul/RESEARCH-PREP.md`: Pleiku Campaign → Matador (D Co LZ Sue) → White Wing → Black
  Horse (D Co LZ Rene) → Jim Bowie (D Co FB Phoenix City) → wounded 21 Mar. The earlier FB Carolyn
  (1969, wrong year) and LZ Amy (11 Apr, post-wounding) guesses are explicitly ruled out in the note.
- **Finding-aid location-matcher, validated:** scraped the `2-8-cav-fsb-by-year.md` list for **71** 2/8
  positions in the 20 Sep 65 – 14 May 66 window (D-Co-specific ones flagged). Lesson for the future
  generator: **range date-strings ("8May-20Aug71") need the trailing year applied to the range start**,
  or 1970-72 firebases leak in as false positives. And the **field window must end at the wounding
  date for DOW cases**, not the casualty date.

## ★ NEXT SESSION — build queue (Michael: "all next-session stuff")

1. **"Campaigns & Operations" section on the soldier page (Service Record tab, below Decorations).**
   Decided this session. Render the profile's `related_events` **filtered to `type: operation`** as a
   list (title + date/date_end, linked), under a header, with framing like "Operations the battalion
   conducted during his service" — **unit context, not a claim of personal presence.** Keeps the
   **Timeline personal** (a man's own KIA/wounding/contact event stays a timeline entry by place-and-
   day; operations are scaffolding). Reuse existing `section-header` / `doc-list` styles (no new CSS).
   Empty-state: hide if no operation-type related_events. Insertion point: `_includes/layouts/
   soldier.njk` right after the Decorations block (~line 877, before the Service Record tab `</div>`).
   NOTE: `related_events` is currently **unrendered** on the profile — this is its first surfacing.
2. **"Potential Locations" section — directly beneath Campaigns & Operations (Service Record tab).**
   Decided this session. The firebases/LZs the battalion held **within the man's service window**, from
   `sources/fsb-locations/2-8-cav-fsb-by-year.md` (the Malec dry run proved the matcher — 71 hits for
   his window). Framing: probable presence / circumstantial — "firebases the battalion occupied during
   his service." The killer use case: **"I have a photo of my dad on a firebase" → "which of these is
   he on?"** — the list gives the candidate set to match against. Build notes:
   - Needs his **service window**: `arrived` → (`departed` | DOW/KIA date). **For DOW cases the window
     ends at the WOUNDING date, not the casualty date** (Malec: 20 Sep 65 – 21 Mar 66, not 14 May).
   - **Date-range parsing fix is mandatory:** a range's trailing year applies to its start
     ("8May-20Aug71" = 1971), or 1970-72 firebases false-positive into a 1966 window.
   - Likely delivery: publish the FSB list as JSON (a `permalink: /fsb-2-8.json` dump) + match
     client-side, OR precompute per-soldier at build. Flag **D-Co-specific** rows vs battalion-level.
   - Confidence labeling: confirmed presence (photo/doc/first-person) vs probable (unit-was-there).
   - This is the same engine the finding aid's "where he likely was" branch uses — build once, use both.
3. **Surface `related_events` data is already wired** on keller/yates (contact event), ahern/cromie
   (sheridan-sabre) — so the new section has content to show immediately on those profiles.
3. **Render principle to encode** (coverage-model or a UI-conventions doc): Timeline = the man
   (confirmed, his own moments); **Service Record "Campaigns & Operations" = the unit's operations
   during his service (circumstantial/context)**; finding aid = fullest operational-arc branch.
   "Public pages never lead with operation names" still holds — the section is labeled as unit context.
4. **Optional later:** a collapsible "show unit operations" overlay on the timeline for the fuller
   on-demand view (lower priority than the Service Record section).

## Conventions written (standing)

- **`_docs/coverage-model.md`** — added: **Tier 1 (contact) = D Co confirmed only; Tier 2 (operation)
  = 2/8 losses by AGGREGATE NUMBER, not by name**, from the 1cda listing for the date window. Holds for
  the **division era only (1965 → Apr 1971 redeployment)**; revisit at the 3rd Bde (Separate)
  "Garryowen" phase. Correct third-party misattributions silently. Worked example = Sheridan Sabre.
- **`_docs/finding-aid-concept.md`** (NEW) — see below.

---

## ★ NEXT — Finding Aid (buildable soon; Michael wants this)

The **Finding Aid** is the BMB intermediary: per-soldier (or name+dates) export of the whole picture —
identity, operational arc, probable locations, the men around him (incl. CO), what the archive holds,
and **leads for the family's own research**. Demonstrated live this session as a Dec 68 – Dec 69 dry
run (in transcript) — it works on current data.

**Architecture (decided, in `_docs/finding-aid-concept.md`):**
- Delivery = **one static client-side page, `/finding-aid/?slug=<slug>`**, that assembles in-browser
  from published JSON. No per-soldier build, no PDF dependency, no xcopy.
- Reads **`/search-index.json`** — ALREADY published (`search-index.njk`) and already carries each
  soldier's cross-referenced events/documents/photo counts.
- **To add (small):** a `permalink: /alongside.json` dump template (mirror `search-index.njk`) over
  `_data/alongside.js` for Tiers 1–4; and a locations JSON (2/8 firebase-by-year + service-date
  matcher). That's essentially the whole build cost.
- Download: a **"Download" button** serializing the populated DOM (`outerHTML` → Blob), + print-to-PDF;
  show Save-As instructions. (Naive Save-As can grab the empty shell.)
- **Interactive value (Michael, this session):** log requests; a request that hits a **clear coverage
  gap** becomes a **research-priority signal** — the public's questions rank the next build work.
- Doubles as the **BMB front door** (name+dates form → query params → unit-level aid even for
  unprofiled men).

**Build order when picked up:** (1) `/alongside.json` dump template; (2) locations JSON + date matcher;
(3) `/finding-aid/` page (fetch + assemble 6 branches, confirmed-vs-circumstantial labeling); (4)
download button; (5) request logging for the priority signal.

---

## Other carry-forward
- **Pin the 28 Jan 1967 action** (LZ Minh day-of confirmation) → 2/8 Cav daily staff journal, NARA RG
  472. Same pull would confirm Cromie's/the Nov 68 firebase and the broader 2/8 journal work.
- **LZ Minh location page** — deferred (logged in event oq-04 + LOCATION-FEATURE-CONCEPT.md). Trigger:
  journal confirmation. Documenting all 1965–69 Binh Dinh-era LZs is planned long-run work.
- **1968–69 battalion CO** — gap in the command chain (we have Tackaberry '67, Bacon/Blagg '71). Fill
  to extend Tier 4 coverage for the heavily-trafficked Dec 68–Dec 69 window.
- **kia-profile-general skill** lives in `Archive/kia-profile-general/` and is installed; it has the
  Burial-field location-parse fix. Re-sync the installed copy from Archive if edited.
- Cromie 1968 `d-co-kia-list` row → `stub`; profile-status sync pass across the list when convenient.
- Pre-existing repo churn / Miller carry-forwards from S77/78 still open (not touched this session).

## Files touched (this session)
NEW soldiers: ahern-raymond, derosier-michael, cromie-michael, keller-peter, yates-donald,
tackaberry-thomas, dashiell-john, **malec-paul** (+ photos/profile/index.md and JPGs where applicable;
keller/yates `_alongside.json`).
NEW (in Downloads/KIA, not the repo): `KIA/malec-paul/RESEARCH-PREP.md` (finding-aid dry-run + DOW
reframe + probable-presence trail).
NEW events: operation-sheridan-sabre-1968, contact-binh-dinh-1967-01-28 (+ sources/ PDFs).
MODIFIED events: operation-sheridan-sabre-1968-12-04.
MODIFIED engine/template: `_data/alongside.js`, `_includes/layouts/soldier.njk`.
NEW data/scripts: `_data/alongside-exclude.json`, `admin/scripts/build_alongside_overlap.py`.
NEW docs: `_docs/finding-aid-concept.md`. MODIFIED docs: `_docs/coverage-model.md`,
`_docs/d-co-kia-list.md`, `sources/fsb-locations/LOCATION-FEATURE-CONCEPT.md`.
