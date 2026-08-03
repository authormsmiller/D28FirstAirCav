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

**Why this matters for Build My Book (Michael, 2026-06-26).** Locations are one **branch of the BMB
tree**. We will rarely have hard proof that a given soldier stood at a given firebase on a given
day — but if the **unit was there within his service dates**, that is **strong circumstantial
evidence** and legitimate *service context*, presented as such (not as fact). Its value is highest
for **thin profiles**: a man with no letters, photos, or testimony still gets a substantiated arc —
"during your father's tour, his battalion held LZ X (date), FB Y (date)…" — turning an empty page
into a real, sourced story. Confidence labeling is the safeguard: **confirmed presence** (first-
person / photo / document) vs **probable presence** (unit-was-there-during-service). The circumstantial
branch must always read as circumstantial.

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
5. **Per-location pages (`site/locations/<slug>/`) — planned but deferred.** Today only the 1970–72
   firebases have pages; the 1965–69 sites (incl. the Kim Son / Binh Dinh-era LZs in the by-year
   list) are not yet built. Documenting **all** locations is the long-run goal (Michael, 2026-06-26)
   — deferred for now. In the interim, stand up an individual location page opportunistically when a
   site is **confirmed** relevant to a built event/soldier. First pending case: **LZ Minh
   (BR707760)**, the candidate site of the 28 Jan 1967 Keller/Yates contact — create it (and wire
   `location_slug` both ways with `contact-binh-dinh-1967-01-28`) once the 2/8 daily staff journal
   confirms it as the day-of position.

## Tour-window estimation (bidirectional matcher)

The matcher runs **both directions**, which matters most for the men we know almost nothing about:

- **Forward — dates → places.** Given a service window (arrival → departure, or arrival → KIA/DOW),
  return every base the battalion held inside it. This is the crude-timeline generator for a
  data-poor soldier: "during your father's tour, his battalion held LZ X (dates), FB Y (dates)…"
- **Reverse — places → dates.** Given the bases a man is *remembered* at (e.g., family says "first
  base Silver, last base Jeffries"), infer the service window. This is the family-conversation case:
  no DD-214, but two place names still yield a dated arc.

### Anchors (how the window is bounded)

Treat each piece of evidence as a constraint on the `[arrival, departure]` interval:

- **Positive anchor ("was at X") — hard floor/ceiling.** The tour must overlap X's occupancy and
  **cannot predate the base's earliest use** (he can't be at a base before it existed). First known
  base sets the arrival floor; last known base sets the departure into its window.
- **Negative anchor ("never at Y") — exclusion wall.** Under the **continuous-presence assumption**,
  the unit's time at Y must fall *outside* the tour. A Y at the tail pulls the departure ceiling in
  to the **beginning of Y**; a Y at the head pushes the arrival floor out to the **end of Y**.
- **12-month tour norm — soft cross-check.** `departure ≤ arrival + ~12 mo` and vice-versa. When the
  positive/negative anchors and the 12-month norm agree, the window is corroborated; when the anchor
  bracket runs much longer than ~12 months, that itself flags an extension or a fuzzy memory.

**Worked example (real dates).** First base **FSB Silver** (D Co, Nov 1970 – 28 Jan 1971) → arrival
floor ≈ Nov 1970, no earlier. Last base **FSB Jeffries** (2/8 Cav, 14 Aug – 5 Dec 1971). Known
**never at FSB Makowski** (D/2/8, ~29 Nov – Dec 1971) → departure ceiling pulled in from end-of-
Jeffries (5 Dec) to **beginning of Makowski (~1 Dec)**. Result: **≈ Nov 1970 – ~1 Dec 1971**, ~12.5
months — lands on the one-year tour, so the anchors and the 12-month norm corroborate.

### Confidence ladder (forward output, scaled by echelon)

Once a window is set, **every D Co location inside it is at least a "possible"** for the soldier;
the rating rises with how specifically the occupancy record names the unit:

- **Possible** — the **battalion** (or a sub-element that may not include him) held the base in his
  window. The default floor for every location in the window. (Source note reads `2/8th Cav …`.)
- **Probable** — the **whole company (D Co)** is recorded at the base in his window; absent a
  continuity gap he was with it. (Source note reads `D/2/8th Cav …`.)
- **Confirmed** — independent first-person / photo / document / "I was there" evidence places the
  **individual** there. Overrides the derived rating (this is the existing confirmed tier).

**Platoon nuance (cuts both ways).** A platoon-level note (e.g., `D Co … Range Platoon` at Silver)
is **probable for members of that platoon**, but only **possible** for other D Co men — and if his
platoon is known to have been elsewhere, the same note becomes weak evidence of *absence*. So a more
specific record doesn't uniformly raise confidence; it raises it for the named element and can lower
it for the rest.

### Caveats (keep the output honest)

- The **negative/exclusion wall is softer than positive anchors** — it depends on continuous presence
  at the right granularity. **R&R, hospitalization, TDY, or a transfer** punches a gap that breaks it.
- **Echelon granularity is load-bearing:** a battalion-level note can't distinguish companies, and a
  company/platoon note only helps for members of that element. Always carry the source echelon.
- The **window itself is an estimate** — label the whole arc *inferred*, and widen/narrow it as real
  records (DD-214, journals, contributions) arrive.

**Output gating.** How these tiers feed different products — the **Finding Aid** (permissive; surfaces
*possible* as "does this ring a bell?" prompts) versus **Build My Book** (conservative; leads with
*confirmed/probable*, demotes *possible*) — is specced in `finding-aid-concept.md` (Finding Aid vs
Build My Book — threshold & voice).

*Provenance: firebase location gazetteer, `sources/fsb-locations/FSB-locations.pdf`. This is a
research/design note, not part of the public build.*
