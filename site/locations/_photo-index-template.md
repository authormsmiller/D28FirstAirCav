---
# Photo index for a location profile.
# Lives at: site/locations/[slug]/photos/index.md
# Mirrors the pattern at site/soldiers/[slug]/photos/[subfolder]/index.md
# but adds location-specific provenance fields.

location: fsb-[slug]

photos:

  # ── EXAMPLE ENTRY ──
  # - filename:           # e.g., 19710511-fanning-aerial-01.jpg
  #   caption: >
  #     Full caption text from the original source.
  #     Preserve Garvin's exact words where possible.
  #   caption_short:      # One line for thumbnails / hover text
  #   credit:             # "Photographed by Jim Garvin · May 1971"
  #   photographer:       # Soldier slug (e.g., garvin-jim)
  #   date:               # YYYY-MM-DD or partial (YYYY-MM or YYYY)
  #   date_known:         # true if exact date is certain; false if approximate
  #
  #   # Location-specific fields (not in soldier photo index):
  #   fsb:                # Slug of the FSB shown — use when one source covers multiple bases
  #                       # e.g., v06_fanning.pptx covers fsb-fanning, fsb-king, fsb-judy
  #   subject:            # aerial | ground | equipment | personnel | convoy | other
  #   source_file:        # Original source filename (e.g., v06_fanning.pptx)
  #   source_slide:       # Slide number in original PPT (integer)
  #
  #   # Shared with soldier photo index:
  #   contains:           # Soldier slugs of identified individuals visible in photo
  #     # - garvin-jim
  #   event:              # Related event slug if applicable
  #   quality:            # leave blank unless flagged (low | damaged | duplicate)
  #   tagged: []          # Reserved for future use

---
