# Location feature — concept & design notes

**Goal:** tie soldiers to the firebases/LZs the battalion occupied, and use those ties to build
**timelines** — including crude but real timelines for soldiers (especially KIAs) who left no
letters or accounts.

## Data backbone

The firebase gazetteer (`sources/fsb-locations/FSB-locations.pdf`) gives, per site: decimal
**lat/long**, **MGRS grid**, map sheet, and a dated **occupancy note**. Derived working data:

- `2-8-cav-fsb-list.md` — 202 entries naming 2/8th Cav (flat).
- `2-8-cav-cp-list.md` — 10 battalion-CP locations.
- `2-8-cav-fsb-by-year.md` — the same entries grouped by year (1965 ×15, 1966 ×95, 1967 ×26,
  1968 ×8, 1969 ×9, 1970 ×17, 1971 ×28, 1972 ×8, +5 undated).

These already carry coordinates, so anything built on them is **map-ready**.

## Two ways to tie a soldier to a firebase

**1. "I was there" — veteran/family submission (UI).**
A per-soldier **checkbox grid** of the battalion's firebases, **grouped by year**, each with an
"I was there" control. Submissions run through a review pipeline (mirror the existing
photo-ID-proposal / contribute flow — nothing goes live unreviewed). Confirmed ties accrete onto
the soldier's timeline the way the woodblock photo and the FB Oldham entry just did. Treat these
as **confirmed presence** (first-person).

**2. Service-date-range auto-match (derived timelines).**
Given a soldier's **service date range** (from DD-214 / records), search the FSB array for
occupancies whose dates fall within that range and add them as timeline entries. This is the
engine for **KIA timelines** — men with no letters still get a baseline "the battalion was here,
on these dates, at these grids." Mark these **derived / battalion-level presence**, not confirmed
(the individual's company/platoon may differ from the occupying element).

## Design wrinkles (learned while building the list)

- **Multiple coordinate rows per base.** Firebases were re-surveyed or moved; one base name can
  have several grid rows. Key the feature to a **canonical base + date-range**, not raw gazetteer
  rows.
- **Name collisions / shared nicknames.** E.g., **FB Oldham (ZT07x, D 2/8, Jul 71)** vs **FB Ham
  Tan**, both nicknamed "Old Ham"; and several different **"FB Mace"** including a Mekong-Delta one
  unrelated to the 1st Cav. Canonical IDs must pin corps/area + grid, not just the name.
- **Messy date strings.** Notes read like `8May-20Aug71`, `1-5Jun, 14Aug-5Dec71`, `Oct70`,
  `21Jul71`. Method #2 needs a parser that turns these into structured **start/end** dates (and
  handles split ranges). Until then, the raw note is authoritative and year-grouping is the safe
  granularity.
- **Company vs battalion granularity.** Some notes name the company (`D-/2/8th Cav 21Jul71`),
  most name only the battalion (`2/8th Cav`). Date-range matching is **battalion-level** by
  default; refine to company where the note specifies.
- **Confidence tiers.** Reuse the events model: **confirmed** (letters / "I was there" /
  photos) vs **derived/probable** (service-range match). Keep the two visually distinct on the
  timeline, as the event injector already does (Confirmed present vs Probably present).

## Next steps (when this goes live — not yet)

1. Parse the occupancy notes into structured `{base, grid, lat, long, start, end, company?}`
   records; define canonical base IDs.
2. Build the service-date-range matcher (KIA crude-timeline generator).
3. Design the "I was there" submission + review flow (extend the contribute pipeline).
4. Decide placement: a battalion **locations/map page** plus per-soldier timeline injection.

*Provenance: firebase location gazetteer, `sources/fsb-locations/FSB-locations.pdf`. This is a
research/design note, not part of the public build.*
