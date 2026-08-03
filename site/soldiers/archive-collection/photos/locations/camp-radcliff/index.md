---
# ─────────────────────────────────────────────────────────────────────────────
# PHOTO-HOST PSEUDO-FOLDER — *NOT* a soldier.
#
# There is deliberately NO profile .md in site/soldiers/archive-collection/, so this
# host never appears in the roster, KIA list, Alongside engine, or search — the soldier
# collection is built from `soldiers/*/*.md`, and a folder with no .md can't match it.
# The photo crawler (site/_data/photosBySlug.js) scans the filesystem separately and still
# indexes anything here, projecting each entry's `fsb:` value onto that location's Photos tab.
#
# Use this host for location / community photos that have NO individual soldier owner.
# If a contributing D Co veteran took the shot, put it under HIS soldier folder instead
# (photos/locations/<loc>/) with fsb: <loc> — that also ties him to the location.
#
# TO ACTIVATE this Hòn Cong insignia photo:
#   1. Drop the licensed image in this folder as: hon-cong-insignia.jpg
#   2. Uncomment the entry below and fill `credit` with the source + license.
#   3. Upload:  node scripts/upload-soldier-photos.cjs archive-collection
#   → It will appear in the Camp Radcliff page's Photos tab automatically (fsb: camp-radcliff).
# ─────────────────────────────────────────────────────────────────────────────
permalink: false
eleventyExcludeFromCollections: true
photos: []
  # - filename: hon-cong-insignia.jpg
  #   caption: >
  #     The 1st Cavalry Division shoulder insignia laid into the face of Hòn Cong Mountain
  #     above Camp Radcliff (the "Golf Course") at An Khê — a landmark visible for miles.
  #   caption_short: "1st Cav insignia, Hòn Cong Mountain"
  #   credit: "SET ME — source + license (e.g. U.S. Army / public domain, or contributor name)"
  #   credit_slug: ""
  #   photographer: ""
  #   date: ""
  #   date_known: false
  #   event: ""
  #   fsb: camp-radcliff
  #   quality: ""
  #   contains: []
  #   tagged: []
---
