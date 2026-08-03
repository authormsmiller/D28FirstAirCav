# ORLL Digest & Archive Cross-References — Design Note

*Design spec. Not yet implemented. Companion to `data-standards.md`, `coverage-model.md`, and `sources/fsb-locations/LOCATION-FEATURE-CONCEPT.md`.*
*Drafted July 2026. Supersedes the earlier KIA-centric draft (`kia-index-orll-digest-spec.md`).*

---

## Problem & framing

We use Operational Report — Lessons Learned (ORLL) documents to build context around soldiers, events, and locations on the site. Two inefficiencies:

1. **ORLLs are re-parsed per soldier.** When a KIA is researched, we open the relevant ORLL PDF and pull only what's relevant to *that* man (see the Carolyn blob in `sources/orll/1969/index.md`). Everything else in the report stays locked up, so the next death that touches the same document pays the parsing cost again.

2. **The extracted knowledge isn't queryable.** What we do pull lands in prose `notes:` blobs. Nothing can retrieve it later — not a location lookup, not a KIA cross-reference, not an event page.

**The fix is a one-pass, document-scoped digest per ORLL, structured around the site's content taxonomy** (operations, locations, units, events), plus two curated cross-reference datasets the digest feeds. The digest is the *engine*; the KIA index and the location gazetteer are the *foundations* it enriches.

### A stated limitation

The exact source for this work would be **company-level Daily Journals (DA Form 1594)** — hour-by-hour, name-by-name. We do not have them for D Co. The ORLL is the best available *division-level* record: it narrates only *significant* activities, aggregates casualties, and rarely names individuals. Everything below is designed to extract maximum value from that coarser source and to degrade honestly (candidates to verify, not assertions). If Daily Journals surface later, they slot in as a higher-fidelity source using the same digest shape — see Extensibility.

---

## The three artifacts

| Artifact | Role | Source of truth |
|---|---|---|
| **KIA index** (`kia.json`) | Who died — when, unit, event | `site/_docs/d-co-kia-list.md` (curated markdown) → generated JSON |
| **Location gazetteer** | Where — canonical sites, coordinates, occupancy over time | `sources/fsb-locations/` (curated) → generated structured form |
| **ORLL digest** (one per PDF) | The engine — extracts operations/locations/units/events, and proposes enrichments to the two foundations | The ORLL PDF, read once |

They interlock: the gazetteer already links to the KIA index (`named_for`), and the digest matches its `events[]` against the KIA index (by date + unit) and its locations against the gazetteer (by name), proposing new rows for both.

**Decision — the digest is a standalone artifact, one per source document, not folded into the content pages.** It is a complete, page-cited, machine-readable read of the source that persists independently of whatever page consumed it. The point is the *later sweep*: when a page already exists and a question arises — "verify the location on this KIA page against the ORLL," "did any source give a grid for this FSB," "re-check this casualty count" — you query the digest, never the scan. That only works if the digest captured *everything* on the first pass, including material no page needed at the time. Content pages (document, event, soldier, location) are built downstream *from* digests plus the two foundations; the digest is the durable retrieval layer between the raw scan and the site.

---

## Artifact 1 — KIA Index (`kia.json`)

**Source of truth:** `site/_docs/d-co-kia-list.md` stays authoritative and hand-edited; `kia.json` is **generated** and never hand-edited (idempotent). The markdown list already carries men with no soldier profile yet, so the set cannot be derived from profile front matter alone.

**Location:** `site/_data/kia.json` (beside `roster.json`).

### Row schema

```json
{
  "slug": "freitag-dieter",
  "last_name": "Freitag", "first_name": "Dieter", "middle_name": "Kuno",
  "rank": "SGT",
  "dod": "1972-05-10", "date_known": true,
  "dob": "1946-09-10",
  "hometown": "Ft. Dix, NJ",
  "wall": "1W/17",
  "cause": "Non-hostile — aircraft crash (mechanical)",
  "hostile": false,
  "inclusion": "organic",
  "unit": "D Co, 2/8 Cav",
  "event": "chinook-crash-1972-05-10",
  "profile_status": "none"
}
```

- `dod` / `date_known` — `YYYY-MM-DD` with the `00` conventions from `data-standards.md`.
- `hostile` — boolean derived from the `cause` string (Cause key: not explicitly non-hostile ⇒ presumed hostile).
- `unit` — actual parent unit (`D Co, 2/8 Cav`; or `A/1-12 Cav`, `11th ACR`, `362 ASHC` for externals).
- `event` — event slug; **required for externals** (see integrity rule); optional otherwise.
- `profile_status` — `none` | `stub` | `full` from the Profile column (`—` / `stub` / `✅`).

### Inclusion-reason taxonomy

The archive documents deaths outside D Co when there is a *relationship* to the company. `inclusion` records it, echoing the `related_events.relationship` vocabulary in `data-standards.md`:

| Value | Meaning | Example |
|---|---|---|
| `organic` | Member of D Co 2/8 Cav | Most of the roster |
| `attached` | Attached to D Co when killed | The `[att]` honor-roll entries |
| `co_casualty` | Died in the **same event** as D Co men | Chinook non-D Co passengers (A/1-12 Cav, 11th ACR), same `event` |
| `causal` | Died in a **separate, causally linked** event | Huey pilot, 24 Apr 71 — own event, `causal` to the 20 Apr contact; FSB renamed Fanning |

**Integrity rule:** a `co_casualty` or `causal` row **must** carry an `event` slug — the event link is the only reason the man is in the archive. An external row without one is a data error the generator flags.

### Per-consumer filters

| Consumer | Filter |
|---|---|
| **Wall of Honor** | `organic + attached` (D Co's own dead; a "Died Alongside D Co" section for the rest is optional/later) |
| **Tracking** | all rows |
| **ORLL cross-reference** | all rows |

> **Open decision (Michael):** Wall renders `organic` only vs `organic + attached`. Lean: organic + attached. The field makes it reversible.

### QA byproducts of generation

Reconcile the header count (111–112) against dated rows (~107); surface the Williams duplicate and any slug collisions; flag externals missing an `event`; flag any `dod` outside 1965–1972.

---

## Artifact 2 — Location Gazetteer

**Current state:** `sources/fsb-locations/2-8-cav-fsb-by-year.md` — 202 occupancy rows with grid, lat/long, occupying sub-unit, operation, date, and source citations, derived from `2-8-cav-fsb-list.md`. The **raw note is authoritative** (per its header). This is already a strong dataset and holds the coordinates the ORLLs lack.

**Why it's foundational:** ORLL narrative garbles site names ("CAROLYN" → "CMtftl'I") and gives no grids. The gazetteer resolves both — fuzzy-match the garbled mention to a canonical site and inherit its coordinates. The gazetteer is the coordinate authority; the ORLL confirms occupancy and supplies events.

**Known gap:** it is 2/8-specific and note-driven, so it undercounts. Concrete example: the Jul-69 ORLL bases 1st Brigade (which contains 2-8 Cav) at "LZ CAROLYN, ST BARBARA, IKE, and GRANT" during MONTANA SCOUT; the 1969 gazetteer has Carolyn but not the other three. Systematic ORLL processing is how the gaps close.

### Proposed structure — two layers

The current file is effectively an **occupancy log** (one row per site-observation; the same base recurs across years with re-surveyed grids). Keep that and formalize a thin layer above it:

- **Site registry** — canonical site name, aliases (e.g. Beckie/Becky, Old Ham/Oldham), best-known coordinates, and `named_for` → KIA slug where the base honors a KIA. The gazetteer *already* encodes these ties in prose ("For Joseph L. Hall KIA 20Apr71," Fanning, Makowski, Westphal, Fontaine) — promote them to a field.
- **Occupancy log** — site + unit + date(s) + operation + source + `confidence`. ORLL processing appends here; the registry stays curated.

### Confidence — mirrors `contains:` vs `tagged:`

| Value | Meaning |
|---|---|
| `confirmed` | A 2/8 sub-unit is explicitly named at the site in the source ("Companies C and E, 2/8 Cav defending LZ Carolyn") |
| `inferred` | 2/8's brigade was based there but the narrative names a sister battalion — real signal, not proof |

---

## Artifact 3 — The ORLL Digest (one per document)

**Principle:** supply-driven, one pass. Read the PDF once; strip *everything* structured, whether or not it's relevant to today's task. That single change ends the re-parsing loop.

**Location & manifest split:** `sources/orll/<year>/index.md` stays a thin **manifest** (which documents exist). The harvested content moves out of `notes:` into a per-document digest: `sources/orll/<year>/<accession>.digest.json` (format under Open Questions).

### ORLL document anatomy (RCS CSFOR-65)

Consistent across the collection (verified against `AD0506273`, 1 Cav Div HQ, 1 May–31 Jul 69, 73 pp):

- **Cover / classification / distribution** (skip).
- **Section I — Operations, Significant Activities:** operations overview with named operations + date ranges + controlling brigade + mission + cumulative results; a quarter-level roll-up (enemy/friendly totals, kill ratio, aircraft losses); then a **numbered dated chronology** of significant activities.
- **Section II — Lessons Learned:** commander observations/recommendations (TIME/ACTIVITY/COMMENT).
- **TABs (annexes):** A Task Organization, B Weather/Terrain, C Aerial Surveillance, E Training, AA/AB Logistics, AC Civil Affairs, AD Psyops, AE Chemical.
- **DD Form 1473** control data.

### Digest schema (taxonomy-aligned)

```yaml
# --- Document metadata ---
accession: AD0506273
accession_as_printed:            # DTIC 6-digit variant if different
unit: 1st Cavalry Division (Airmobile)
echelon: division_hq             # division_hq | division_artillery | brigade | ...
period_start: 1969-05-01
period_end: 1969-07-31
rcs: CSFOR-65
classification_original: CONFIDENTIAL
declassified: General Declassification Schedule
pages: 73
source: DTIC
file: AD0506273-orll-1cav-jul69.pdf
companion: AD0505650             # linked ORLL(s), same period

# --- Coverage header (fast lookup) ---
coverage:
  date_range: [1969-05-01, 1969-07-31]
  operations: [MONTANA SCOUT, COMANCHE WARRIOR, CREEK II, KENTUCKY COUGAR]
  provinces: [Tay Ninh, Binh Long, Binh Duong, Long Khanh, Bien Hoa, Binh Tuy, Phuoc Long]
  installations: [LZ Carolyn, LZ St Barbara, LZ Ike, LZ Grant, LZ Joe, LZ Jamie, ...]  # resolved to gazetteer
  units_mentioned: [2-7 Cav, 2-8 Cav, 1-12 Cav, 1-8 Cav, 5-7 Cav, 2-5 Cav, ...]

# --- Operations ---
operations:
  - name: COMANCHE WARRIOR
    start: 1969-05-14
    end: 1969-06-01
    controlling_unit: 3rd Brigade
    mission: >
      Interdict southerly movement of the 5th VC Division out of War Zone D...
    results: { enemy_kia: 132, enemy_pw: 5, ... }
    page: 11

# --- Quarter roll-up ---
quarter_stats:
  enemy_kia: 2696
  enemy_pw: 103
  us_kia: 247
  us_wia: 1781
  kill_ratio: "11:1"
  aircraft_lost: { OH6: 11, UH1: 5, AH1G: 6 }
  page: 8

# --- Task organization (TAB A) ---
task_organization:
  1st_brigade: [2-7 Cav, 2-8 Cav, 1-12 Cav]
  2nd_brigade: [2-5 Cav, 2-12 Cav]
  3rd_brigade: [1-7 Cav, 5-7 Cav, 1-8 Cav]
  div_arty: [2/19, 2/20, 1/21, 1/77, E/82 (Avn), 1/30 ...]
  # ... 11th ACR, aviation group, DISCOM
  page: 50

# --- Events (significant activities chronology) ---
events:
  - date: 1969-05-06
    installation: LZ Carolyn          # resolved to gazetteer canonical name
    location_raw: "CMtftl'I"          # what the OCR actually said
    units: [C/2-8 Cav, E/2-8 Cav]
    type: base_attack                 # base_attack | contact | cache | recon | ...
    dco_involved: true                # 2-8 Cav or D Co present, regardless of casualties
    us_kia: 10
    us_wia: 73
    enemy_kia: 198
    enemy_pw: 30
    materiel: "81 AK-47, 11 RPG, 2x60mm mortar, 128 RPG rds, ..."
    page: 30
    confidence: high                  # high | medium | low (OCR/legibility)
    summary: >
      Regimental ground attack ~0200 after mortar/rocket prep; breached
      perimeter 0225, hit a 105mm ammo area 0315; contact broke 0600.
```

Every event and figure carries a `page` (provenance) and `confidence` (these are dirty declassified OCR scans — cover pages near-illegible; summary/list pages clean; dense justified narrative noisy). Low-confidence reads are flagged, never silently asserted.

### Two-pass read (the accuracy trick)

Location names are garbled in the dense narrative but printed **cleanly** in the summary pages (operations overview, TAB A). So: (1) harvest the clean canonical name/unit lists from the summary pages and TAB A first; (2) resolve the garbled narrative mentions against that list *and* the gazetteer. This is fuzzy matching applied at extraction time — the same principle as the site's Lunr search.

---

## The engine: how the digest feeds the foundations

For each digest `event`:

- **KIA candidates** — find KIA rows whose `dod` falls in the event's date and whose `unit` overlaps `event.units`. Return ranked candidates (`matched_on: [date, unit, location]`, with page). **Candidates to verify, not assertions** — the ORLL only narrates significant actions, so a death can occur with no matching event.
- **Location candidates** — resolve `event.installation` to the gazetteer. If matched, append an occupancy row (site + unit + date + operation + source=this ORLL + confidence). If unmatched, emit a **new-site candidate** (coordinates to be sourced). Brigade-basing without a named 2/8 sub-unit ⇒ `confidence: inferred`.
- **No-KIA contact events count.** The extraction flag is `dco_involved`, independent of casualties. A contact with zero friendly KIA still yields an event and a location occupancy — documented for completeness, per site practice.

Run in reverse, each digest can precompute `kia_candidates` (slugs whose DOD falls in its period) — the "array of slugs + dates" that lets a soldier's profile immediately show which ORLLs might enrich the event.

---

## Workflow (per document)

Dropping a source file into a watched folder starts a fixed pipeline. Triage first sets expectations; the digest is always produced; cross-reference passes run *selectively* by yield profile; nothing writes to the foundations or to a page without review.

### Step 0 — Intake & idempotency

- File lands in a watched inbox (e.g. `Downloads/locations/`).
- Resolve the accession (canonical 7-digit; note the printed variant). **Check whether it was already processed** (key on accession) — if so, update, never duplicate.
- Place the file into `sources/<type>/<year>/` with the naming convention; add/refresh the manifest entry in that `index.md`.
- Retain the original scan and an uncorrected machine-OCR transcript (`sources/<slug>-OCR.md`) with a "verify against page images" caveat — the pattern the `aar-2-8cav-4nov65` document page already follows.

### Step 1 — Triage (classify before extracting)

Read the front matter (cover, subject line, TOC, distribution) and classify on five axes, then emit a **yield profile** that decides which passes run and at what default confidence.

| Axis | Values | Drives |
|---|---|---|
| **Genre** | primary operational (ORLL/AAR/DJ) · reflective debrief (SODR) · secondary study (e.g. USAF history) | structure; whether claims are *primary* or *attributed* |
| **Echelon** | corps · division · brigade · battalion · company | how far down names go → personnel/contact yield |
| **Temporal shape** | point (AAR) · quarter (ORLL) · long-span (SODR tour) | warns when a wide date-match ≠ enrichment |
| **Provenance/service** | US Army field · USAF · ARVN · secondary | perspective; how much to trust unit-level 2/8 detail |
| **OCR era** | 1965–66 (poor) · 1967–68 (fair) · 1969–70 (better) | extraction care + confidence ceiling |

Worked examples (the documents this spec was built against):

- **AD0501405** — corps ORLL (II FFV), quarter → *operations + location only.* ~0 D-Co yield; 8 KIA fall in range but the echelon can only frame the operation.
- **AD0506273** — division ORLL, quarter → *operations + task-org + significant-activities events + casualties + location.*
- **AD0833869** — brigade AAR (Op Lincoln, 1966), point → *all passes* (named companies, grids, contacts, personnel, awards); worst OCR, so highest review need.
- **AD0509767** — SODR (CG's 13-month tour), long-span → *operations/doctrine context only.* Matches many KIA dates, enriches none individually.
- **ADA486953** — secondary USAF study → *context + citation-harvest* (its footnotes are acquisition leads for primary docs).

### Step 2 — Build the digest (always)

One-pass structured extraction into the standalone digest (Artifact 3 schema), with page provenance and per-field confidence, using the two-pass read (clean summary pages resolve the garbled narrative). This runs for **every** document regardless of yield — it is the durable layer, and low-yield today may be exactly what a future sweep needs.

### Step 3 — Cross-reference passes (selective, run *from* the digest)

Only the passes the yield profile enables. Each produces **candidates, not writes**. The eight passes:

1. **KIA-in-range** — date + unit + location graded match. Profile exists → propose cited enrichment. No profile → propose stub referencing the source (ask). Handle DOW (test both wound date and death date against the window).
2. **Operations** — match/extend an existing operation page, else propose a new one.
3. **Incident events** (non-combat death/injury) — usually absent; propose an event if present.
4. **Contact events (D 2/8 specifically)** — extend an existing event or propose a new contact-event page. No-KIA contacts still count (`dco_involved` flag).
5. **Location matching** — resolve to the gazetteer (append occupancy, confirmed vs inferred); surface new sites for research (coords TBD).
6. **Personnel mentions (D 2/8)** — capture **name + element + role** (Lt Ward/Recon, Marshall/"Buckeye"); link to existing soldiers or propose a stub (ask).
7. **Casualty reconciliation** — compare the document's aggregate figures for an event against the roster for that date/place; flag mismatches (missing KIA to research, or deaths belonging to other units).
8. **Awards/valor** — capture decorations mentioned; cross-ref to soldiers; feed event `citations:`.

### Step 4 — Two-output writeback (document *faithful*, event *reconciled*)

A primary source produces two linked outputs, per the `aar-2-8cav-4nov65` pattern:

- **Document page** (`documents/unit/<slug>`) — faithful to the source: what the report says, summarized and fully cited, with `event`/`contains` links, OCR-transcript reference, and provenance caveat. **Document date = report/prep date.**
- **Event page(s)** (`events/<slug>`) — the reconciled action across sources: casualties reconciled, contradictions preserved as `open_questions`, not silently resolved. **Event slug uses the action date.**
- **Foundations** — reviewed KIA rows / gazetteer occupancies appended with citation + confidence.

A low-yield document may produce **only a digest + manifest entry, no page** — a valid, honest outcome.

### Step 5 — Review summary (human-in-the-loop)

One consolidated proposed-changes list — new stubs, new events, new occupancies, enrichments, citation-harvest leads — each with citation and confidence, batched for approval before anything writes to a foundation or page. The "ask before creating a stub" prompts live here.

---

## Extraction method

Pure regex will choke on the OCR, but the document structure is stable. Approach:

1. **Navigate deterministically** to Section I (ops overview + chronology), TAB A, Section II, DD1473 — by header patterns.
2. **Extract fields** within each section, using the clean summary pages as the name/unit authority.
3. **Normalize** locations and units against the gazetteer and TAB A (fuzzy).
4. **Validate numbers** (casualty/materiel tallies) and set per-field `confidence`; carry `page` for every fact.
5. **Emit** the digest + the two candidate lists (KIA, locations) for human review before anything is written to the foundations.

Human-in-the-loop is deliberate: the digest is generated freely, but appends to `kia.json`/gazetteer are reviewed.

---

## Extensibility — SODR / AAR / Daily Journals (later)

The digest is deliberately document-type-agnostic below the metadata header. Other sources map onto the same `operations` / `events` / `locations` / `units` shape at finer or coarser grain:

- **AAR (After Action Report)** — single-operation depth; richer per-event narrative, often named participants. Populates `events[]` with higher `confidence` and may name individuals → stronger KIA matches.
- **SODR / staff daily summaries** — daily granularity between ORLL and Daily Journal.
- **Daily Journal (DA 1594)** — the missing high-fidelity source; hour-by-hour, named. Would let `events[]` carry confirmed individual presence (`contains:`), not just aggregate casualties.

Keeping the digest schema shared means a future Daily Journal digest enriches the same KIA index and gazetteer without a new pipeline — only a new `source_type` and a higher default confidence.

---

## Build order (when approved)

1. **`kia.json` generator** — parse `d-co-kia-list.md` → rows + QA report. (Foundation the rest depends on.)
2. **Gazetteer structuring** — site registry + occupancy log + `named_for` links, from `sources/fsb-locations/`.
3. **ORLL digest skill** — one-pass PDF → digest; two-pass read; provenance/confidence.
4. **Engine / cross-ref step** — digest → KIA candidates + location candidates, human-reviewed appends.
5. **Backfill** — run the skill across the 1965–1971 ORLLs.
6. **Consumers (later)** — Wall of Honor page (`kia.json`, filtered organic+attached); location feature; event pages.

---

## Decided

- **Digest is a standalone artifact** (one per source), not folded into content pages — to support later sweeps for missed detail. See "The three artifacts."
- **Triage answers the SODR/AAR question:** source *type* matters less than genre × echelon. A brigade/battalion AAR is high-yield; a corps ORLL or a long-span SODR is context/location only. Confirm which source types we actually hold, but the schema already generalizes.

## Open questions

- **Digest format:** `.json` (clean for the skill to read/write, matches `_data/`) vs `.md` + YAML front matter (hand-editable, matches current `index.md`). Leaning `.json` for the digest, `index.md` stays the human manifest.
- **Wall scope:** `organic` only vs `organic + attached`.
- **Gazetteer generated vs curated:** does structuring produce a generated `_data/locations.json` (like `kia.json`) while `sources/fsb-locations/` stays the hand-edited source? (Consistent with the KIA pattern — recommended.)
- **Review surface:** where the Step 5 proposed-changes list is presented for approval (per-digest file, a session note, or inline in the skill run).
