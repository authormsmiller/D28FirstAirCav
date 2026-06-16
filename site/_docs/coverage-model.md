# Coverage Model — Events, Operations, and the Complete Picture

**Status:** standing convention. **Created:** 2026-06-16.
**Companion docs:** `kia-profile-playbook.md` (how to build a KIA profile + its event page),
`data-standards.md` (field schema), `primary-records-finding-aid.md` (where the records are),
`d-co-operational-timeline.md` (the coverage tracker this model feeds).

This document defines *what pages we make and how they relate*, so the site builds toward a
single goal: **the complete picture of how D Company, 2/8 Cav's mission evolved across the
Vietnam War** — every action we can evidence, casualty or not.

There are three tiers. Tier 1 is mandatory wherever there are losses. Tier 2 is added whenever
the evidence supports it. Tier 3 is the long arc the first two tiers add up to.

---

## Tier 1 — The event page (what happened to the men)

**Always make one for a KIA action.** This is the specific, human record: what happened to the
D Company, 2/8 Cav men who were killed — who, when, where, the action itself, and the
corroboration for it.

- Path: `site/events/<event-slug>/index.md`. `type:` is `contact` (also `crash`, `incident`,
  `memorial`).
- It is built per the `kia-profile-playbook.md` (Section 2). It carries the casualties, the
  reconstructed location (DCAS province fields are frequently wrong — flag them), the narrative,
  the sources, and the public contribution invitation.
- The event page answers **"what happened to these men?"** It is *not* the place to explain the
  whole operation; that is Tier 2.

This tier already exists in practice. The model just makes it a rule: **no KIA cluster without
an event page.**

---

## Tier 2 — The operation context page (the larger assignment)

**Add one whenever we can evidence the operation the unit was assigned to.** This page explains
how 2/8 Cav — at battalion, brigade, or division level — fit into a named, larger operation. It
is the bridge from "what happened to these men" up to "what the Army had the unit doing."

- Path: `site/events/<operation-slug>/index.md`, `type: operation`.
- It documents the **campaign frame**, not the company's hour-by-hour scheme of maneuver.
- Models to copy: `operation-toan-thang-iii-1969` (corps-level umbrella) and
  `operation-all-the-way-1965` (specific operation phase).

### The echelon-precision principle (the core rule)

**Write the operation page at the most specific echelon the evidence honestly supports — and no
higher, no lower.** This is the lesson from comparing the 1965 and 1969 clusters:

- **1969 (Toan Thang III):** the May cluster could *not* be pinned to a single named sub-operation
  with confidence, so the context page sits at the **corps-umbrella** level and explicitly hedges
  the connection as "highly likely context, not established fact."
- **1965 (All the Way):** converging evidence (the Doc Wilson medic account, the Barnett LZ Juliet
  record, the campaign chronology) pins the action to a **specific operation phase**, so the page
  is written at the **operation** level — a step more precise than an umbrella.

Pinning higher than the evidence (vague umbrella when we know the phase) loses information;
pinning lower (naming a phase we can't support) invents it. Match the page to the proof.

Corollary: **hedge the echelon label itself when the org chart moved.** Brigades and battalions
rotated through areas of operation. "Operation X = Nth Brigade" is often a phase-level fact;
whether *our* company sat under that brigade on a given day belongs in an open question pointed at
the 2/8 Cav daily staff journal (NARA RG 472), not asserted from the phase name.

### When NOT to make a separate operation page

If the operational frame is thin or only loosely attributable, keep it as a **hedged paragraph
inside the Tier 1 event page** (as the early Pleiku page did) rather than spinning up a thin,
under-evidenced operation page. Promote it to its own Tier 2 page when the evidence arrives.

---

## Tier 3 — The complete picture (casualty or not)

The goal beyond individual actions: **document everything we can evidence D Co, 2/8 Cav doing in
Vietnam — not only the days men died.** Operations, firebase tours, moves between AOs,
reorganizations (e.g. the 1971 3rd Brigade (Separate) "Garryowen" period after the division went
home), notable non-casualty contacts and incidents. Together these show how the unit's mission
evolved from the 1965 Central Highlands pursuit through the 1971–72 War Zone D / Saigon defense.

This tier is tracked in **`d-co-operational-timeline.md`** — a year-by-year coverage list (the
operational counterpart to `d-co-kia-list.md`). Each entry records what we know, whether a page
exists yet, and the documentary next step. Work the gaps against that tracker.

---

## How the tiers link (cross-reference convention)

Event ↔ operation links use the `related_events:` field (see `data-standards.md`). Use these
relationship values for the Tier-1 ↔ Tier-2 ↔ Tier-2 connections:

| From → To | `relationship:` | Meaning |
|---|---|---|
| KIA event → operation page | `parent-operation` | "this action happened inside that operation" |
| operation page → KIA event | `tactical-action-within` | "this casualty cluster occurred during this operation" |
| sub-operation → umbrella | `subordinate-operation` | phase/sub-op of a larger named operation |

> **Note on vocabulary:** `data-standards.md` lists only `causal | operational | commemorative`
> for `relationship:`. That list is **stale** — the relationship string renders as a label, and
> the project already uses the more descriptive values above (e.g. on the Toan Thang III and
> All the Way pages). Treat the table above as the current convention; fold it into
> `data-standards.md` on the next pass through that doc.

Always link **both directions** so a reader on either page can climb up to the operation or down
to the specific men.

---

## Quick decision guide

1. Men were killed? → **build the Tier 1 event page** (playbook Section 2). Mandatory.
2. Can we evidence the larger operation? →
   - Strong, specific evidence → **Tier 2 operation page at the specific level.**
   - Only loose/umbrella evidence → **hedged paragraph in the event page**, plus an open question.
3. Either way → **log it in `d-co-operational-timeline.md`** and cross-link both directions.
