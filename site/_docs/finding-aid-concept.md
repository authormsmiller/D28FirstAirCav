# Finding Aid — concept & design notes

**Status:** concept / deferred. **Created:** 2026-06-26. **Companion:** `LOCATION-FEATURE-CONCEPT.md`,
`coverage-model.md`, `data-standards.md`.

## What it is

A **finding aid** is a downloadable, per-soldier export of *everything the archive holds or can
reasonably infer about a man*, handed to a family or veteran as the **starting point for their own
research journey** — not a finished biography. It is the **intermediary step toward "Build My Book"
(BMB)**: BMB assembles a narrative; the finding aid assembles the *evidence and leads* behind it.

The driving case: someone arrives with little more than a name and service dates ("my father, D Co
2/8 Cav, Dec 1968 – Dec 1969"). The finding aid returns a substantiated unit-level tour plus a
concrete list of where to look next.

**Requests as a research-priority signal (Michael, 2026-06-26).** Built as an *interactive* feature,
each request is also demand data: when someone asks for a man who lands in a **clear gap** (thin
coverage for his dates/company/area), that request flags where the archive's research effort would
have the most human impact. Log requests (esp. gap-hits) so they can be ranked into a research
to-do list — the public's questions steer the next profiles/events to build.

## It builds on the search index

`_data/searchIndex.js` already does the hard part — a two-pass crawler that, per soldier, aggregates
every piece of content that references them:

- the soldier's own record (front matter + excerpt);
- **events** that name them (contains / tagged / casualties);
- **documents** and **anecdotes** (contains / tagged);
- **photo** counts across `soldiers/*/photos/**`.

The finding-aid script reads that aggregate for one slug and joins on the other branches the archive
now computes:

- **Served Alongside** (`_data/alongside.js`) — Tier 1 (same photos/docs), Tier 2 (same platoon),
  Tier 3 (same-company / same-tour overlap), Tier 4 (commanding officer, "Stone Mountain 6").
- **Locations** (`sources/fsb-locations/…`) — firebases/LZs the battalion held within the man's
  service window (service-date-range auto-match; see `LOCATION-FEATURE-CONCEPT.md`).
- **Operational events** overlapping the service window (operation pages → the campaign arc).

## The branches of a finding aid (one soldier)

1. **Identity & service** — what we have on the man himself (rank, unit, dates, hometown, status).
2. **Operational arc** — the named operations his unit ran during his tour (unit level).
3. **Where he likely was** — locations the battalion held within his dates (probable presence).
4. **The men around him** — Served-Alongside tiers, including his commanding officer.
5. **What the archive holds** — his photos, documents, anecdotes, event pages (the search-index set).
6. **Leads for your own research** — the honest gaps as next steps: company/platoon unknowns, the
   2/8 Cav daily staff journal (NARA RG 472), connected veterans/families to contact, records to pull.

## Evidence discipline (carry over from the location + coverage conventions)

- Distinguish **confirmed** (named in a source, in a photo, in a document) from **probable /
  circumstantial** (the unit was there within his dates). The circumstantial branch must always read
  as circumstantial — it is *service context and leads*, never asserted fact.
- Most valuable for **thin profiles**: a man with no letters still gets a real, sourced arc.

## Finding Aid vs Build My Book — threshold & voice

Both read the **same engine and the same confidence ladder** (possible / probable / confirmed — see
the Tour-window section of `LOCATION-FEATURE-CONCEPT.md`). They differ in the **threshold** they
consume it at and the **voice** they speak in, because they carry different weight.

- **Finding Aid = "does this ring a bell?"** Permissive and *interrogative*. **Possible** is the
  point here, not a weakness — phrased as a question ("Was your father ever at FSB X? His battalion
  was there during his tour"), a possible is exactly what triggers recognition. Cast wide and let the
  family filter; a wrong guess costs nothing, a right one surfaces a memory.
- **Build My Book = the keepsake.** Conservative and *declarative*. A book carries the weight of
  *record*, so it leads with **confirmed** (the man's own moments) and **probable** (framed as unit
  context — "D Company was at X during his service," never "he stood here"). **Possible** is demoted
  to light, hedged mentions or an appendix, or dropped. Overclaiming in a kept book is a real harm;
  the bar is higher than the research prompt's.

**They form a pipeline, not a duplication.** The Finding Aid's "does this ring a bell?" is the intake
that **upgrades possibles to confirmed**: a family confirms a lead ("yes, he talked about that hill"),
and that confirmation flows back and promotes the entry into Build-My-Book-grade material. Finding Aid
harvests recognition; BMB consumes the upgraded record. The wider the Finding Aid casts, the more BMB
eventually has to work with — and the request log (above) doubles as that recognition intake.

## Output

A **downloadable file** (PDF or print-ready HTML/Markdown) generated per soldier — something a family
can keep, print, and work from offline. Generation is build-time or on-demand from the same data the
site already produces; no new data backbone required, just an assembler + a template.

**Delivery: one client-side page driven by query string (decision, Michael, 2026-06-26).** Rather than
build N per-soldier pages, ship a single static page — `/finding-aid/?slug=<slug>` — that assembles the
aid in the browser from already-published JSON. No per-soldier build, no PDF dependency, no xcopy.

Data it reads (all build-time JSON, generated once):

- **`/search-index.json`** — ALREADY PUBLISHED today (`search-index.njk`, `permalink: /search-index.json`;
  already fetched by `search/index.njk` and `photo-proposal.js`). Carries each soldier's record + the
  cross-referenced events / documents / photo counts. The identity, "what the archive holds," and
  operational/event branches come straight from here.
- **`/alongside.json`** — TO ADD: a one-line dump template mirroring `search-index.njk` over
  `_data/alongside.js` (Tiers 1–4, incl. the Tier 4 commanding officer).
- **A locations JSON** — TO ADD: the 2/8 firebase-by-year data + a service-date-range matcher (can be
  done client-side against the published gazetteer, or pre-joined at build).

So the only new build artifacts are 1–2 small `permalink: *.json` templates; everything else already
exists. The page is static HTML+JS — sidesteps the FUSE-mount `unlink`/EPERM issue (that only bites
passthrough copies), and the same page doubles as the **BMB front door**: a name+dates form populates
query params (`?unit=d-2-8&from=1968-12&to=1969-12`) to assemble a unit-level aid even for a man with no
profile yet.

**Download nuance.** A naive browser *Save As → HTML only* can save the un-populated shell (pre-JS).
Lead with a **Download button** that serializes the populated DOM (`document.documentElement.outerHTML`
→ Blob → download) into a self-contained file; offer *print → Save as PDF* as the alternative (always
captures the rendered page). Show the Save-As instructions alongside.

*(Alternative considered and set aside: generating per-soldier `/soldiers/<slug>/finding-aid/` pages at
build via pagination — purer static output, but N pages and no BMB-front-door flexibility. The
query-string page is preferred.)*

## Next steps (when this goes live — not yet)

1. Write the finding-aid assembler: input a slug → pull searchIndex record + alongside tiers +
   location overlap + overlapping operations.
2. Design the downloadable template (the six branches above) with clear confirmed-vs-circumstantial
   labeling and a sources/leads section.
3. Decide trigger: a "Download finding aid" control on each soldier page, and/or a name+dates form
   for not-yet-profiled men (the BMB front door).

**Build readiness (Michael, 2026-06-29).** Finding Aid is the **next real feature to build** — delivery
is a **"Finding aid" / "Download finding aid" button on the soldier profile** (the name+dates BMB front
door can follow later). **Gate: build soon, but not just yet.** Hold until more **location and
operations data** is filled in, so a generated aid reaches the accuracy of the **Malec dry run** — the
worked PDF from Session 80 is the quality benchmark. The location-overlap and operational-arc branches
need to be dense enough not to read thin before the button goes on every profile.

*Research/design note, not part of the public build. The Dec 68 – Dec 69 dry run in the session
transcript of 2026-06-26 is the worked example this is modeled on.*
