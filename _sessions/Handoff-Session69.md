# d281staircav — Session 69 Handoff
**Date:** June 17, 2026
**Continues from:** Session 68 (non-combat-death framework; Memoria Reflections groundwork)
**Theme:** Sprawling but productive. Supplemented the Chinook/NF34 record; processed the
"Dad Service Info" interview doc; fixed a real site-wide search bug; designed the **Build My
Book (BMB)** feature end-to-end; and transcribed/added **six** new Marvin Miller letters,
then **migrated all of his letters** from `documents/` to the soldier's `letters/` folder.
(Session 68 advised holding to ONE subject — this one did not. **Next session should focus
solely on the BMB alpha**, which is Michael's stated priority.)

---

## What Session 69 accomplished

### Never Forgotten 34 / Chinook supplement
- **`documents/unit/nf34-memoria-reflections/`** — the "Memoria Reflections" essay from the
  2022 memorial program (provided by Doug Hilts), attached to event `nf34-memorial-2022`.
- Reviewed the full 9-page program: it contains **individual portraits of all 34** (a gallery
  — NOT yet imported; deferred). Noted the cover's "Chinook United Flight 157" is a lay
  rendering of tail **64-13157**; flagged **two Aguilars** (Oscar = D Co; Mike J. = attached).

### "Dad Service Info.docx" processing (partly mined in earlier sessions)
- **Neal "Firefight on the Mountain"** account → new **event `firefight-mountain-1971-06-24`**
  (type: **incident** — a false contact, two monkeys, no casualties), related to
  `bunker-complex-1971-06-24` (type: contact) via reciprocal `related_events`. Neal account
  doc lives at `documents/neal-bill/neal-bill-firefight-mountain-19710624/`.
- **Kutter field-operations primer** → `documents/kutter-wolf/kutter-wolf-field-operations/`
  (squad duties, NDP, V-movement, resupply, drug policy, jungle dangers). Ice-cream correctly
  credited to **Brig. Gen. Burton** (Brigade Commander standing order), not Blagg.
- **Marvin profile timeline** — added 4 entries (SP4 promotion 1 Mar 71; FSB King 30 May;
  overdose deaths 14 Aug; Bien Hoa/Saigon unrest 3 Oct); enriched the arrival entry with the
  **Cam Ranh Bay → Bien Hoa → FSB Mace** routing; added **DOB 15 Sep 1949** (annotation on
  `birth_year`).

### SEARCH BUG FIXED (core site feature)
- **`_data/searchIndex.js`** Pass 2b only read `<slug>.md` and **silently skipped every
  `index.md` document** — 10 docs were invisible to search (incl. all Marvin letters, Kint
  bio/interview, Garvin one-mans-story, Kutter Colburn commemoration, Makowski booklet). Now
  accepts `index.md` OR `<slug>.md` (mirrors `_crawlDocuments.js`).
- Same file now emits **`profile_photo_url`** (`/media/photos/soldiers/<slug>/profile/<file>`).
  Fixed the broken legacy `/soldiers/.../photos/profile/` image paths in **`search/index.njk`**
  and **`_includes/layouts/document.njk`** (3 spots) to use the R2 `/media/` path.

### Build My Book (BMB) — DESIGN (no feature code shipped; design + prototypes only)
- **Two outputs, two gates:**
  - **Photo album** — automated, one-press download. Deterministic from **photographer +
    contains** photo references. **R2 is source of truth** (`env.PHOTOS`); the album route
    fetches keys directly. The crawl that knows *who's in / who shot* a photo only exists at
    **build time** (markdown front matter), so the button consumes a **build-time index / a
    pre-baked per-soldier manifest**, not a live R2 crawl.
  - **Narrative book** — Claude-drafts, Michael edits. **Per-case, not scriptable** (the
    editorial choices are the point). The inventory script gathers; the human organizes.
- **Two-bucket inventory:** **explicit references** (contains/tagged/author/photographer/
  credit — auto-include) vs **temporal candidates** (events overlapping the service window —
  human vet for presence). Built and run for Marvin.
- **Unlock model:** requester-supplied **floor** (service window even year-grained; ≥1 photo;
  hometown + DOB) vs archive-supplied **ceiling** (operational docs + locations in window).
  Michael intends to **backfill operational data so it never gates**. Roster-wide threshold
  numbers deferred (few meet it yet).
- **Location timeline (designed, not built):** unit-presence intervals
  `{unit, location, from, to, precision, confidence, source}`; soldiers inherit by date
  overlap; person-level facts (letters/photos) override the unit "probable." Keep **two axes**:
  confidence-of-presence vs date-precision. Same explicit/temporal split as events.
- **Skipper stories → BMB:** stories live ONLY in **R2** (`submissions/skipper-stories/
  published/`), served dynamically via `/api/skipper-stories/published` — **outside** the
  build/index. They carry **no `subject_slug`** (only `referrer_url` like `/soldiers/hilts-doug/`
  + self-entered name). Plan: stamp an **`author` slug on EVERY story** (de facto teller tag),
  reserve **`contains`** for others mentioned. Matcher tiers: referrer-slug (high) → name (med)
  → manual. Verification via a **repo-side link layer keyed by `story_id`** (you edit markdown,
  never R2); optional **promote → anecdote**. First sample submission received: **hilts-doug**
  (C-rations/trade story).
- **Deliverables produced (in `outputs/`, NOT deployed):**
  `book-outline-miller-marvin-dale.md` (chronological spine + thematic interludes + prologue +
  a "Becoming a Soldier" training section) and `keepsakes-miller-marvin-dale.json` (the curated
  two-track contract: 43-photo album + narrative candidates).

### Consent language
- **`contribute.njk`** — added keepsake / personal-use, non-commercial consent line at the
  permission selector; "research use only" is the express opt-out (the eligibility exclusion).

### Marvin Miller letters (MAJOR)
- Transcribed from phone photos and added **6 new letters**: 15 Dec 70, 26 Mar 71, 14 Sep 71,
  18 Oct 71, 21 Oct 71, 24 Oct 71.
- **Family glossary resolved:** Don "Buss" Miller (oldest brother) + wife **Shirley**; **Dan**
  Miller (older brother); **Mary Ellen** and **Pat** (older sisters); **little Dean** (small
  child, nephew).
- Cross-referenced the October letters with **McGrew's calendar**: 14 Sep, 18 Oct, 21 Oct were
  written **in the bush**; 24 Oct **at FSB Jeffries** (unit came back in on Oct 23). McGrew's
  21 Oct note puts **Cat Platoon near the CP with Kutter** during the Makowski contact.
- Same-day coincidences noted (NOT overplayed, NOT formally linked): 26 Mar = 1st Cav Division
  stand-down; 24 Oct = Pirates' 1971 World Series; **14 Sep = Armstrong School District
  injunction** (added an Archivist Note with the *Armstrong School District v. AEA* cite).
- **LETTER MIGRATION:** all **11** Marvin letters now live in
  `soldiers/miller-marvin-dale/letters/` in the **legacy format** (`doc_date`, `recipient`,
  `source`, `/soldiers/.../letters/` permalink) so they render on the **Letters tab**, not
  Documents. Verified all 11 render. **The 11 `documents/miller-marvin-dale/letter-*` copies
  are NOT yet deleted — Michael is deleting them after confirming.**

### Camera research (for the book; nothing written to record yet)
- Evidence says Marvin's homecoming camera was an **Asahi Pentax Spotmatic**, not a K-1000:
  mercury battery + homemade wire-rig + **screw mount** + 1971 timing all point to Spotmatic
  (K-1000 = 1976, bayonet K-mount, common 1.5V cell). "Spy camera" likely the **Kodak
  Instamatic 124** he mentions buying in the 18 Apr 71 letter. Confirm against remaining
  "foibles" letters / the physical camera (screw threads vs bayonet).

---

## CRITICAL LESSONS
1. **Edit-tool truncation struck again** on `searchIndex.js` (~12KB): the Edit tool returned
   success but **silently cut the file tail** (same byte count, truncated end). Caught via
   `node -c`, restored from a `/tmp` backup, reapplied via **python-edit → write `/tmp` →
   `cat /tmp/file > mountfile` → verify**. **RULE: for files >~7KB do not use the Edit tool;
   use the python+cat method and verify with `node -c` / YAML parse / `tail`.**
2. **File deletes are now ENABLABLE.** Plain `rm` still fails ("Operation not permitted"), but
   calling **`mcp__cowork__allow_cowork_file_delete`** (with a path in the folder) prompts the
   user and **enables deletion for the whole folder** for the session. Granted this session.
3. **Mount CRLF normalization** changes byte counts on write-back (LF in tmp → CRLF on mount).
   **Verify by content** (node -c, YAML parse, `tail`), never by matching byte counts.
4. **Two letter homes existed.** The **Letters tab** reads `collections.letters`
   (`soldiers/*/letters/*.md`); the **Documents tab** reads `documentsBySlug` (`documents/`).
   **Letters belong under the soldier** (`soldiers/<slug>/letters/`), or they show under
   Documents. Resolved for Marvin; watch for the same on other soldiers.
5. **Skipper stories are R2-only and not indexed at build** — they won't appear in profiles,
   search, or the BMB inventory until each carries an author slug AND is brought into the build
   (link layer + optional promote-to-anecdote).

---

## Outstanding / carry-forward
- **Michael to DELETE** the 11 `documents/miller-marvin-dale/letter-*` folders (the whole
  `documents/miller-marvin-dale/` dir is then empty), then **rebuild**. Until then the Documents
  tab still shows the duplicate letters. (Deletion is enabled for the folder.)
- **DEPLOY BATCH (large):** everything this session. `npx @11ty/eleventy` → `wrangler deploy`
  → push via GitHub Desktop. **Skip xcopy + R2 photo backfill** (no assets/photos changed).
  `node -c site/.eleventy.js` passes. Last clean build: **302 files**.
- **Letters tab is unsorted** — optional one-line tweak: sort `collections.letters` by
  `doc_date` in `soldier.njk`.
- Pre-existing housekeeping: `site/unit-history.njk.bak` / `.bak2` to delete; stray `t).`
  artifact at the very end of `miller-marvin-dale.md` (harmless; soldier pages are
  front-matter-driven).
- Deferred content: NF34 34-photo gallery import; the 6 confirmed non-D Co Chinook names in
  the checklist; Roberts "Darlac / accidental self-destruction" cross-ref; the "Possible Names"
  list + contact PII → `_private`; camera-model confirmation.

---

## NEXT SESSION — the BMB alpha (Michael's priority; hold to this one subject)
Michael wants Build My Book off the ground **with his dad as the test subject**, believing it
could be **the biggest driver of site submissions**. He'll keep adding letters to strengthen
the alpha. Concrete, well-scoped pieces:
1. **Photo index** — build-time JSON, one record per photo
   `{r2_key, thumb_url, caption, credit, photographer, contains[], tagged[], owner, event, date}`
   (flatten `photosBySlug`, incl. the photographer/credit axis). Powers seed + suggest + search.
2. **Photo-album generator** — pre-baked per-soldier seed manifest (photographer+contains) →
   one-press R2→PDF; plus the alongside-suggest + click-to-select picker (localStorage basket).
3. **Skipper-story `subject_slug`** — matcher + repo-side link layer (verification) + promote.
4. **Location timeline** schema + a first backfill pass for Marvin's window.
5. **Draft one section of Marvin's book** (per `outputs/book-outline-miller-marvin-dale.md`) to
   test the voice — applying the four framing principles below.

### Book framing principles (banked this session)
- **Chronological spine + thematic interludes + prologue** (fixes "big event early" — Marvin's
  peak is April, month 4 of 12).
- **Letters deliberately downplay danger** — the calm is a kindness performed for his mother;
  read "I'm doing all right over here" against the operational record, not at face value.
- **Half-dialogue** — his reassurances answer his mother's unseen worry; reconstruct her side
  from his replies.
- **Home-front motif** — Pirates, school strikes, Mary Ellen's baby, the tractor: a man in the
  jungle keeping one hand on Kittanning.

---

## Technical notes (permanent)
- **New event:** `events/firefight-mountain-1971-06-24/` (incident). **New docs:**
  `documents/unit/nf34-memoria-reflections/`, `documents/neal-bill/neal-bill-firefight-mountain-19710624/`,
  `documents/kutter-wolf/kutter-wolf-field-operations/`.
- **searchIndex.js** now: reads `index.md` docs; emits `profile_photo_url`. Profile-photo URLs
  use `/media/photos/soldiers/<slug>/profile/<file>` (R2 via the Worker) — never
  `/soldiers/.../photos/...`.
- **Letters** canonical home: `soldiers/<slug>/letters/<slug>-letter-YYYYMMDD.md`, layout
  `layouts/document.njk`, fields `doc_date` + `recipient` + `source`, permalink under
  `/soldiers/.../letters/`. The Letters tab filters `collections.letters` by `slug in contains`.
- **Skipper stories:** R2 `submissions/skipper-stories/{pending,published}/`, nightly cron
  promotes, `/api/skipper-stories/published?tab=` serves client-side. Worker buckets:
  `env.PHOTOS`, `env.DOCUMENTS`, `env.SUBMISSIONS`.
- **Deletion:** `mcp__cowork__allow_cowork_file_delete` enables `rm` for the folder (per session).
- **Large-file writes:** python-edit → `/tmp` → `cat > mountfile` → verify (`node -c`, YAML, tail).
