---
layout: layouts/location.njk
title:
slug:
breadcrumb:
permalink: /locations/[slug]/
tags:
  - location

# ── IDENTITY ──────────────────────────────────────
display_name:           # Full display name: "FSB Fanning"
short_name:             # Used in running text: "Fanning"
type:                   # fsb | lz | relay | r-and-r | base-camp | other
also_known_as:          # Alternate names or spellings (free text)

# ── NAMESAKE ──────────────────────────────────────
named_for:              # Soldier slug if named for an archive soldier (e.g., fanning-martin)
                        # Leave blank if not named for a known archive soldier
named_for_note:         # Free text — use if named_for is unknown or outside the archive

# ── LOCATION ──────────────────────────────────────
location:
  mgrs:                 # Military Grid Reference: "YT 525 155"
  lat:                  # Decimal degrees: 10.986389
  lon:                  # Decimal degrees: 107.311667
  province:             # Province name as of 1971: "Long Khánh Province"
  modern_landmark:      # One sentence describing the modern-day location
  coordinate_source:    # military-registry | vhpa | mcgrew | letter | gemini | unknown
  coordinate_confidence: confirmed | high | low | unverified

# ── DATES ─────────────────────────────────────────
dates:
  established:
    date:               # YYYY-MM or YYYY-MM-DD
    source:             # mcgrew-calendar | letter | vhpa | gemini | unknown
    confidence:         # confirmed | high | low | unverified
  closed:
    date:
    source:
    confidence:
  notes: >              # Narrative note on date uncertainty or discrepancies

# ── RELATED BASES ─────────────────────────────────
# Use to express the chain of bases a unit moved through.
# A base can both split_from another AND have a successor.
related_bases:
  predecessor:          # Slug of base this replaced (e.g., fsb-fontaine)
  successor:            # Slug of base that replaced this (e.g., fsb-jeffries)
  split_from:           # Slug — if this base was split off from another (e.g., fsb-king → fsb-fanning)
  split_into:           # List — if this base split into two simultaneous bases
    # - fsb-fanning
    # - fsb-king

# ── PHOTO SOURCES ─────────────────────────────────
# One entry per contributor/source document. Drives photo attribution.
photo_sources:
  # - contributor:      # Soldier slug (e.g., garvin-jim)
  #   source_type:      # pptx | print | scan | unknown
  #   source_file:      # Original filename (e.g., v06_fanning.pptx)
  #   contributor_dates: # Date range contributor was present: "11 May – 30 Jun 1971"

# ── RELATED ───────────────────────────────────────
# Soldiers confirmed present at this base (named in photos, letters, or other primary sources).
related_soldiers:
  # - slug:             # Soldier slug
  #   note:             # Brief note: "Photographed at base, May 1971 (Garvin)"
  #   confidence:       # confirmed | probable | possible

related_events:
  # - event-slug

# ── ADMIN ─────────────────────────────────────────
# Internal fields — not rendered on the site.
status:                 # research | published
date_added:             # YYYY-MM-DD
last_updated:           # YYYY-MM-DD
contributed_by:         # Name or handle
notes:                  # Internal notes only

---

# ── OVERVIEW ──────────────────────────────────────

<!--
  One to two paragraphs. What was this base, what was its strategic purpose,
  and what unit(s) operated from it? Write for a general audience — not assumed
  military knowledge.
-->


# ── NAMESAKE ──────────────────────────────────────

<!--
  Who was the base named for? Link to their soldier profile if one exists.
  If the namesake is not in the archive, describe them briefly here.
  Omit this section entirely if the base name origin is unknown.
-->


# ── LOCATION ──────────────────────────────────────

<!--
  Coordinates, terrain, and modern landmark. Note coordinate confidence.
  If coordinates are unverified, say so explicitly — do not present as fact.
-->


# ── DATES ─────────────────────────────────────────

<!--
  When was the base established and closed? Cite primary sources where available.
  Use the source table format from the research docs if multiple sources differ.
-->


# ── LAYOUT ────────────────────────────────────────

<!--
  Physical description of the base — berm, gun positions, TOC, LZ, structures.
  Prefer first-person accounts (Garvin captions, Miller letters) over secondary.
  Label any Gemini-sourced description clearly.
-->


# ── PHOTOS ────────────────────────────────────────

<!--
  Do not list individual photos here. Photo metadata lives in photos/index.md.
  Use this section for a brief introduction to the photo collection:
  who took them, when, and what they show.
-->


# ── SOURCES ───────────────────────────────────────

<!--
  Source quality table. Mirror the format from the research docs.

  | Claim | Source | Confidence |
  |---|---|---|
  | ... | ... | ... |
-->


# ── OPEN QUESTIONS ────────────────────────────────

<!--
  Carry-forward research tasks. Use checkbox format:
  - [ ] Item
-->


# ── ADMIN ─────────────────────────────────────────

<!--
  Internal notes. Not rendered on the site.
-->
