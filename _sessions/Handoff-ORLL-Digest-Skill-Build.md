# Handoff — ORLL Digest & Cross-Reference Skill (build brief for Sonnet)

*Prepared 2026-07-14. Repo root: `d281staircav/`. All paths below are repo-relative.*

## Objective

Build the tooling described in the spec: (1) a `kia.json` generator, (2) a location-gazetteer restructure, (3) a one-pass **ORLL/source digest** extractor, and (4) a **cross-reference engine** that proposes (never auto-writes) enrichments to soldier profiles, events, and the gazetteer. A hand-built **golden example** already exists as the target output — match its shape.

## Build order (see spec "Build order")

1. **`kia.json` generator** — parse `d-co-kia-list.md` → structured JSON + QA report. *Bounded, deterministic, verifiable — do this first.*
2. **Gazetteer restructure** — `2-8-cav-fsb-by-year.md` → site registry + occupancy log + `named_for` links; also fix the vocabulary seed's numeric-key artifact (see below).
3. **Digest extractor** — source PDF → digest JSON (the hard, judgment-heavy part; expect iteration against page images).
4. **Cross-reference engine** — digest → candidate KIA / location / event / personnel changes → review summary.

---

## Context files — load by tier

### Tier 0 — Read first (always)
| Path | Why |
|---|---|
| `site/_docs/orll-digest-and-cross-reference-spec.md` | The full spec: artifacts, schemas, triage, workflow, guardrails. |
| `site/_docs/data-standards.md` | **Canonical** field/slug/date conventions. Do not deviate. |

### Tier 1 — Golden example (the build target)
| Path | Why |
|---|---|
| `site/sources/orll/1969/AD0506273.digest.json` | The exact digest shape to reproduce. |
| `site/sources/orll/1969/AD0506273.review.md` | The Step-5 cross-reference output shape. |
| `sources/fsb-locations/lz-vocabulary.json` | Canonical-site vocabulary for OCR name-resolution (146 sites seeded). |
| `site/sources/orll/1969/AD0506273-orll-1cav-jul69.pdf` | The source the golden example was built from — extract against it to validate. |

### Tier 2 — Phase 1 (`kia.json` generator)
| Path | Why |
|---|---|
| `site/_docs/d-co-kia-list.md` | **Source of truth** for KIA. `kia.json` is generated from this; never hand-edit the JSON. |
| `site/_data/roster.json` | Status vocabulary + where generated `_data` files live (JSON, alongside this). |

### Tier 3 — Phase 2 (gazetteer)
| Path | Why |
|---|---|
| `sources/fsb-locations/2-8-cav-fsb-by-year.md` | The occupancy data (raw note is authoritative). |
| `sources/fsb-locations/2-8-cav-fsb-list.md` | The 202-entry source the by-year file derives from. |
| `sources/fsb-locations/LOCATION-FEATURE-CONCEPT.md` | Location-feature intent/context. |

### Tier 4 — Phases 3–4 (digest + cross-ref) exemplars
| Path | Why |
|---|---|
| `site/documents/unit/aar-2-8cav-4nov65/aar-2-8cav-4nov65.md` | The **output pattern**: document faithful-to-source + linked event, citation, provenance caveat. |
| `sources/aar-2-8cav-4nov65-OCR.md` | The retained-OCR-transcript pattern. |
| `site/events/trail-ambush-hau-nghia-1969-05-25/index.md` | Event front-matter shape (casualties, contains, tagged). |
| `site/events/operation-montana-scout-1969/index.md` | An **existing event to enrich** (named in the review). |
| `site/events/war-zone-c-border-operations-1969/index.md` | Another existing event to enrich. |
| `site/soldiers/_template.md` | Soldier profile front matter (for stub creation). |
| `site/soldiers/pipher-carl/pipher-carl.md` | Example KIA profile. |
| `site/_docs/may-1969-casualty-cluster.md` | Shows how a May-69 casualty cluster is already reasoned about. |

### Tier 5 — Reference (consult as needed)
| Path | Why |
|---|---|
| `site/_docs/coverage-model.md` | Coverage philosophy. |
| `site/_docs/kia-profile-playbook.md` | How KIA profiles/stubs are built. |
| `site/sources/orll/1969/index.md` | The source manifest to update on intake. |

---

## Guardrails (non-negotiable)

- **Markdown is source of truth; JSON is generated.** `kia.json` from `d-co-kia-list.md`; never hand-edit generated JSON.
- **Candidates, not writes.** The cross-ref engine *proposes*; nothing writes to a profile/event/gazetteer without human approval (Step 5 review summary).
- **Every enrichment carries a citation** (accession + page).
- **Document = faithful to source; event = reconciled truth.** Don't silently reconcile conflicting figures — preserve them as `open_questions` (see the 10-vs-9 Carolyn KIA discrepancy in the review).
- **Confirmed vs inferred** location occupancy (unit explicitly named = confirmed; brigade-based only = inferred).
- **Ask before creating a soldier stub.**
- **Honor conventions:** slugs (`type-location-YYYY-MM-DD`, `lastname-firstname`), dates (`YYYY-MM-DD` + `date_known`, `00` for unknown).
- **Honest empty passes are correct output** — don't manufacture cross-references (the golden example's KIA pass returns zero direct matches on purpose).

## Where to expect trouble (flag for human review, don't trust blind)

The **digest extraction + OCR location-resolution** (Phase 3) is the judgment-heavy core. 1965–66 scans are badly degraded. Validate every extraction against page images; carry `confidence` and `page` on every fact. The `kia.json` generator and gazetteer restructure (Phases 1–2) are deterministic and safe to complete autonomously.

## Known cleanup item

`lz-vocabulary.json` collapsed five numbered positions ("LZ 5", "OP 3", "Ps 2"…) to bare-number keys (`2,3,5,7,8`). Fix the base-name normalizer to keep the prefix for numeric sites during the Phase-2 restructure.

## Acceptance checks (per phase)

1. **kia.json** — row count reconciles with the list header (flag the 111/112 vs ~107 delta + Williams duplicate); every external (`co_casualty`/`causal`) row has an `event`; all `dod` in 1965–1972.
2. **Gazetteer** — every occupancy has site + unit + date + source + confidence; `named_for` resolves to a real KIA slug.
3. **Digest** — reproduces `AD0506273.digest.json` structure when run on the same PDF; every fact has `page` + `confidence`.
4. **Cross-ref** — reproduces the `AD0506273.review.md` findings (Carolyn reconciliation lead; Montana Scout / War Zone C enrichments; confirmed vs inferred locations).
