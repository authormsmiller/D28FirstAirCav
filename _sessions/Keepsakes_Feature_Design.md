# Keepsakes — Feature Design Record

**Date:** 2026-05-26
**Status:** Design decided, implementation not started

---

## What This Is

"Keepsakes" is the name chosen for a new nav-level entry point covering two related features:

1. **Self-serve asset download** — individuals grab photos, documents, letters, anecdotes directly from the archive without any process overhead.
2. **Curated memorial collection** — a request-based service where the archive works with a family to assemble a complete picture of a veteran's service into a printable album or book.

The name "Keepsakes" was chosen over "Curation Services," "For Families," "Build a Book," and "Your Story." It covers both output formats without over-specifying either, implies physical things you hold onto, and self-selects the right audience without explanation.

---

## The Two Tiers

### Tier 1 — Self-Serve ("grab what you need")

- No curation, no Michael involvement
- Every asset in the archive gets a download path:
  - Photos → download button (JPG)
  - Documents → link to R2 file
  - Anecdotes, letters → save as text or generated PDF
- Optional lightweight selection basket (localStorage, sticky counter) for grabbing several items across pages in one trip
- This satisfies: the veteran who wants two photos, the family member who wants to save a specific letter

**Status:** Not built. Per-photo download button identified as the easy first win.

### Tier 2 — Curated Request

- Request-based, Michael executes the curation
- Entry point: the `/families/` page (redesigned as the Keepsakes landing page)
- Submission: extends the existing `/request/` form with a new `curation` type
- The form collects the curation brief (see fields below)
- Michael receives the request, runs the curation, delivers the output

**Capacity note:** Volume is deliberately managed. The form language and page positioning should signal this is a meaningful engagement, not a self-service tool. "We take on a limited number of these each year."

---

## Curation Request Form Fields

To be added as a new `curation` type in `/request/index.njk`:

| Field | Type | Required | Notes |
|---|---|---|---|
| Who is the collection about? | Text input | Yes | Soldier name — typeahead against roster eventually, plain text for now |
| Your connection | Select | Yes | I'm this veteran / child or grandchild / other family / friend |
| What are you trying to make? | Radio | Yes | Photo album to print / Memorial book / Both / Not sure yet |
| Service period to focus on | Date range (from/to) | No | Used to set date filter; most will leave blank |
| Other veterans to include | Text | No | "Jim Garvin was his closest friend" — alongside signal from a human |
| Specific items you know you want | Textarea | No | |
| Notes / context | Textarea | No | |

`TYPE_LABELS.curation` = "Memorial Collection Request"
`TYPE_CONFIRMS.curation` = "We'll review your request and reach out within a few days to confirm details before we start building."

---

## Navigation Restructuring

Current nav CTA group:
- "Request" → `/families/`
- "Contribute" → `/contribute/`

Proposed nav CTA group (three buttons):
- **Keepsakes** → `/families/` (the redesigned Keepsakes/curation landing page)
- **Request** → `/request/` (utility: corrections, bugs, contact — currently not in nav)
- **Contribute** → `/contribute/`

The current nav has "Request" pointing to `/families/` — this is muddled and gets cleaned up by the restructuring. `/request/` becomes the utility page; `/families/` becomes the Keepsakes page.

**Files to update:** `masthead.njk`, `nav-drawer` section in `masthead.njk`

---

## The Families Page Redesign

`/families/index.njk` (or equivalent) becomes the Keepsakes landing page. Tone and register:

> "If you're a family member trying to piece together a fuller picture of your father's or grandfather's service, we can help. We'll work with you to pull together photographs, documents, and accounts from across the archive into something you can hold onto. This takes time and we take on a limited number of these each year — but if it matters to you, reach out."

The page covers:
- What a curated collection includes (photos, documents, accounts, timeline)
- Output options (photo album for print, memorial book)
- How the process works (brief conversation → curation → delivery)
- A "Start a conversation" button that pre-selects the curation type in the request form (`/request/?type=curation`)

**Self-serve tier** is also surfaced here as a lighter-weight option for families who just want to grab specific items.

---

## Book Output — KDP vs. Blurb

**KDP (Amazon):** Right tool for text-heavy output — unit history, narrative memoir, oral accounts with photos as supporting material. Not suitable for photo-forward output.

**Blurb:** Right tool for photo-heavy memorial books. Accepts PDF (full layout control via InDesign, Canva, Word). Uses photo paper. Handles softer source material more forgivingly than KDP.

**Photo resolution constraint:** Most archive photos are low-res scans (300–400px on long side, ~100–200KB). Acceptable for 4×6 prints, soft at 5×7+. Sets an upper bound on print ambitions for photo-forward output. File sizes at this resolution make the download size concern largely moot (450 photos ≈ 50–80MB).

---

## The Book Builder — Architecture (Future)

Discussed but not ready to build. Key decisions if/when this becomes self-serve:

- **Data layer:** Eleventy build outputs a unified `archive-index.json` consolidating `photosBySlug`, `documentsBySlug`, `alongside`, events, anecdotes — queryable client-side without round-trips
- **Query spec:** Subject soldier slug + date range + alongside-prioritized sort + content type filters (photos / documents / events / anecdotes / letters)
- **Alongside sort:** Content from soldiers in the alongside array surfaces before unrelated content — provides contextual relevance without manual curation
- **Unidentified GIs:** An irreducible gap in contains tagging. The book builder needs multiple discovery paths (by person, by event, by platoon, by contributor, browse all) not just person-based queries
- **Session persistence:** R2-backed session JSON (UUID-keyed, stores query not output) allows Michael to replay and debug any user session
- **Photo date sparsity:** Most archive photos lack date metadata — the date filter will work well for events/documents/anecdotes but return thin results for photos

**Prerequisite:** Intake tool must enforce or strongly encourage contains tagging on photo upload. The byContains index is only as reliable as intake discipline allows.

---

## Open Questions

- What does the families page currently contain? Does it need a full rewrite or extension?
- Should Tier 1 self-serve download have a basket/collection feature, or just per-item download buttons initially?
- Blurb vs. other print services for book output — worth evaluating Artifact Uprising (premium, heritage projects) and Mixbook before committing
- "Recognize someone in this photo?" — lightweight crowdsourced ID flow for unidentified GIs — phase 3 thinking, noted here

---

## Implementation Order (Suggested)

1. Nav restructuring — add Keepsakes button, fix Request → /request/ pointer (quick)
2. Per-item download buttons — easy win, Tier 1 foundation
3. Families page redesign — Keepsakes landing page with right tone/content
4. Curation request form type — extend /request/index.njk with curation fields
5. Selection basket — localStorage, sticky counter, multi-item download
6. Book builder architecture — archive-index.json build step, query UI (future)
