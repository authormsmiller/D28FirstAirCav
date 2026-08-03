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
- **Casualties are D Company, 2/8 Cav confirmed only.** A contact/crash/incident event names and
  profiles the specific D Company men killed in *that* action — nothing wider. The battalion-level
  "2/8 lost N" aggregate does **not** belong on a Tier 1 event; that framing lives on the Tier 2
  operation page (see "Framing the battalion's losses" below). Attached supporting-arm men follow
  the supporting-arm pattern (named only if profiled).

This tier already exists in practice. The model just makes it a rule: **no KIA cluster without
an event page.**

### Non-combat deaths are still war deaths

"Casualty" is not only "killed in action," and **"non-hostile" is a casualty *classification*,
not a statement about cause.** Men of D Co also died in-theater of **disease** (e.g. malaria),
**non-battle injury**, **accident**, and **self-inflicted causes** — and the war is in the causal
chain of those deaths as surely as it is for a man killed by a B-40 rocket:

- A soldier does not, in the ordinary course, contract malaria in his hometown. **PFC James Lee
  Getter** (d. 1971-03-16) caught it in a malarial war zone the Army deployed him to.
- A man does not turn to drugs in a vacuum. For **SP4 Charles W. Roberts Jr.** (d. 1971-07-18,
  recorded self-inflicted), the likely cause runs straight back to the stress and reality of
  combat assaults — the war he was asked to fight.

Both men are on the Wall; the Memorial itself counts them among the war dead. So the site does
too. Each gets a Tier 1 event/record the same as a combat death, governed by two rules:

- **Record the cause honestly and with dignity** — neither euphemized away nor reduced to a
  personal failing. Give the official casualty classification (hostile / non-hostile; the
  record's stated cause), and where a credible account contradicts or contextualizes it, present
  that too, attributed, rather than repeating a period euphemism uncritically or sensationalizing.
  (A death recorded as "self-inflicted" may, by family and unit accounts, have been a drug
  overdose the paperwork softened — and one rooted in combat stress; note both, sourced, and hold
  the man with the same respect as any other casualty.) The record exists to *understand* what the
  war did to these men, not to tidy it.
- **Mark the casualty type and its tie to service** so non-combat deaths are findable and
  correctly understood, not hidden inside a "KIA" list. Add a cause/casualty-type column to
  `d-co-kia-list.md` (it is really an *in-service deaths* roster), and carry a casualty-type field
  on the event page.

**Status convention (resolved).** Non-combat deaths keep `status: kia` — the site's grouping for
the fallen, matching how the Wall carries them. "KIA" is imprecise for a non-hostile death, so the
non-combat truth lives in the *content*, not the status badge: set `cause_of_death` to the honest
value (e.g. `non-hostile`), use a truthful timeline label ("Non-Hostile — Malaria," "Non-Hostile —
Drowned"), and let the event page carry the full story. Applies to getter-james and benson-joseph.

So the rule is broader than KIA: **no in-service death without an event record** — and every one
of them is treated as a death connected to Vietnam.

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

### Framing the battalion's losses — aggregate, not by name (standing convention, added 2026-06-26)

When building a Tier 2 operation page, **look up the 1st Cavalry Division Association (1cda) 2/8 Cav
KIA listing for the operation's date window and state the battalion's losses as an aggregate
number** in the event's context. A line like *"2/8 Cav and its supporting artillery lost eleven men
that month"* gives quantitative weight to a casualty cluster and conveys how contested the area
was — without turning a D Company archive into a 2/8-wide one.

Rules:

- **By number, not by name.** Do **not** list the battalion's other-company (A/B/C/E/HHC) dead by
  name on the public page. Naming them sets a precedent that would obligate a full battalion-wide
  roster on *every* D/2-8 operation page. The aggregate count carries the weight; the names do not
  need to be public.
- **D Company's own dead are still named and profiled** per Tier 1 — that is the archive's subject
  and is unchanged by this rule.
- **Attached supporting arms** (e.g. the direct-support artillery) follow the supporting-arm pattern
  (cf. `fanning-martin`, `jeffries-gabriel`): named only if profiled; otherwise folded into the
  aggregate or carried as a short under-research note. They may be counted in the aggregate when you
  say so explicitly (e.g. "the battalion *and its supporting artillery*").
- **Retain the named roster privately.** Keep the itemized 1cda list (names, ranks, companies,
  dates) in the event's non-published frontmatter `notes:` under a `SCOPE DECISION` /
  `RESEARCH-ONLY ROSTER (NOT FOR PUBLICATION)` marker, so the research survives and the same-day
  clusters are there for a future NARA RG 472 pull if the scope is ever widened.
- **Correct third-party misattributions silently.** Other unit sites (e.g. a veteran's D 2/8 page)
  sometimes list an attached or wrong-unit man under D Company. State the accurate record plainly in
  our content; do not call out the other site's error. Keep any explicit "misattributed" language in
  internal notes / a held draft profile, not on the public page.

**Temporal scope — division era only, through the Garryowen reorganization.** This convention holds
while 2/8 Cav was an organic battalion of the 1st Cavalry Division (1965 through the division's
April 1971 redeployment). From the **3rd Brigade (Separate) "Garryowen" phase** (mid-1971) onward —
after the division went home and 2/8 fell under the separate brigade — a battalion-level "2/8 Cav
lost N" aggregate may no longer be the right frame: the org chart, the casualty-listing structure,
and the relevant peer set all change. **Before applying this convention to a Garryowen-era or later
event, reconsider whether the 2/8 aggregate still means what it means in the division era**; if not,
frame the loss context at whatever echelon the post-redeployment structure actually supports.

**Worked example:** `operation-sheridan-sabre-1968` — public page gives the aggregate ("eleven men
of 2/8 Cav and the artillery supporting it," Nov 1968); the named ten-man roster + the artillery
case (Ahern) live in that event's frontmatter `notes:`; the 1cda "D Co 2/8" line on Ahern is
corrected quietly in the body and explicitly only in his held draft profile.

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
