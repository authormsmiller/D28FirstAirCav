# Session 57 Handoff — Stan Sargent Profile + April 20 Event Enrichment
Date: 2026-06-03

## What Was Built This Session

### Stan Sargent Profile — sargent-stan

Full profile built from four sources: Honor States, Virtual Wall, Wall of Faces, and the Maxey account (silver star story PDF). Key facts established:

- **Full name:** Stanton Gerald Sargent — **CPL**, Range Platoon, D/2-8 Cav ("Angry Skipper")
- **DOB:** January 15, 1950 — **Hometown:** Grenada, Grenada County, MS
- **Wall:** Panel 3W/1
- **Married:** Linda Harlow, December 10, 1970 (20 days before deployment)
- **Drafted:** Lottery number 17. Basic training Fort Polk, Louisiana.
- **Arrived Vietnam:** December 30, 1970
- **Role:** Assistant Machine Gunner, Range Platoon
- **KIA:** Died of wounds April 21, 1971. Wounded April 20 at Battle of Suoi Gia Ui.
- **Silver Star:** Confirmed — took over M-60 after CPL Joseph Hall was killed; held enemy while wounded were evacuated. Confirmed by Wall inscription ("SS"), SSG Stan Dillon (2005 interview with Maxey), and CPT William Neal.

**Files written:**
- `site/soldiers/sargent-stan/sargent-stan.md` — fully populated
- `site/soldiers/sargent-stan/photos/profile/index.md` + `sargent-stan-profile.jpg`
- `site/soldiers/sargent-stan/photos/field/index.md` + 4 field photos (see below)
- `site/soldiers/sargent-stan/documents/interview-with-linda-martin-transcript.pdf`

**Photos:**
- `sargent-stan-profile.jpg` — cropped from Wall of Faces solo portrait; credit: Wall of Faces / VVMF
- `sargent-stan-field-1.jpg` — solo portrait, full frame; credit: Wall of Faces / VVMF
- `sargent-stan-minesweeping-hwy331-fontaine.jpg` — group shot with Bill, Steve, Kirk on Hwy 331 near FSB Fontaine. **Contains: sargent-stan — others unidentified.** Likely Bill Small, Kirk Davis; needs confirmation to populate contains[].
- `sargent-stan-vietnam-1971.jpg` — extracted from Maxey PDF; no credit
- `sargent-stan-gia-ray-vietnam.jpg` — extracted from Maxey PDF; no credit

**All soldier photos uploaded to R2** via `scripts/upload-soldier-photos.cjs sargent-stan`.

**External links wired** (wall, Honor States, Virtual Wall, Angelo State oral history, LinkedIn Maxey article, maxey.info story page).

**Template bug fixed:** External Resources tab was hardcoded `style="display:none"` for all soldiers regardless of whether links existed. Fixed in `soldier.njk` to conditionally render the tab only when links are present.

---

### April 20 Event — contact-fsb-fontaine-1971-04-20

Significant enrichment from Maxey account and geographic analysis:

**Summary rewritten** to include:
- Enemy unit identified: 83rd NVA rear service unit + security detachment
- Stan's specific role: Assistant Machine Gunner; took over M-60 after Hall was killed
- CPT Neal's quote about the M-60
- Silver Star awarded to four Range Platoon members
- Terrain context: north bank of Suoi Gia Ui significantly higher than south bank; explains why Cat couldn't provide effective direct fire and why the crossing required a lateral flanking movement

**Location corrected:**
- Previous coordinates (107.560E) were derived from Suoi Tầm Bông — wrong stream, ~6km west
- Correct stream: **Suối Gia Ui** — 10°51'37.8"N, 107°29'55.1"E (MGRS approx. YS 728014–745013)
- **Critical note:** Suoi Gia Ui was dammed post-1975 to form Hồ Gia Ui reservoir. Modern satellite imagery shows standing water, not the 1971 stream course. The pre-dam military topo map in the event photos is the primary source for 1971 geography.
- oq-03 resolved with updated coordinates and dam caveat

**New open question oq-08:** Skull Platoon's role in the Maxey account is disputed. The passage and diagrams attributing a stream crossing to Skull during the firefight likely misidentify Cat's trail squad. The terrain analysis (high north bank requiring lateral movement to find a crossing) supports this interpretation. Needs participant confirmation.

**Event photos added** (`site/events/contact-fsb-fontaine-1971-04-20/photos/index.md`):
- `diagram-positions-noon.jpg` — Neal's platoon position diagram, just after noon
- `diagram-positions-firefight.jpg` — Neal's platoon position diagram, during firefight
- `topo-map-xuan-loc-suoi-gia-ui.jpg` — annotated military topo map (pre-dam; primary 1971 source)
- `satellite-gia-ray-firefight-site.jpg` — 2009 Google Earth with firefight placemark (may be post-dam)

**Uploaded to R2** under `events/contact-fsb-fontaine-1971-04-20/` via `scripts/upload-event-photos.cjs`.

**Images: block added** to event frontmatter — photos now display under the Images tab.

**Stan's rank corrected** in event casualties: PFC → CPL.

**Sources list updated** to include the Maxey account (sargent-stan-silver-star-story.pdf).

---

### New Scripts

`scripts/upload-event-photos.cjs [event-slug]`
- Uploads all images from `site/events/[slug]/photos/` to R2 under `events/[slug]/`
- Usage: `node scripts/upload-event-photos.cjs contact-fsb-fontaine-1971-04-20`

`scripts/upload-soldier-photos.cjs [soldier-slug]`
- Uploads all images from `site/soldiers/[slug]/photos/**` to R2 under `soldiers/[slug]/`
- Usage: `node scripts/upload-soldier-photos.cjs sargent-stan`

Both scripts read credentials from `admin/.env` automatically.

---

## Next Session To-Do

### Stan Sargent Documents (deferred from this session)
The documents block in `sargent-stan.md` has two entries wired but the full treatment is incomplete:

1. **Linda Martin oral history** (`interview-with-linda-martin-transcript.pdf`) — already in repo at `site/soldiers/sargent-stan/documents/`. Needs upload to R2 under `soldiers/sargent-stan/documents/` and wiring to the documents tab. The Angelo State URL is in external links but should also surface in documents.

2. **Maxey Silver Star account** — PDF (`sargent-stan-silver-star-story.pdf`) needs to be manually downloaded from `https://www.maxey.info/docs/3f36b1_62c867243d8847c29ed12fa948dacdbe.pdf` (couldn't be fetched from sandbox) and placed in `site/soldiers/sargent-stan/documents/`. Then upload to R2 and wire to documents tab.

3. **Event page link** — The Maxey account should also appear in the accounts or sources section of `contact-fsb-fontaine-1971-04-20/index.md`. Currently it's in `archivist_notes.sources` but not surfaced publicly on the event page.

### Minesweeping photo — contains[] identification
`sargent-stan-minesweeping-hwy331-fontaine.jpg` shows "Stan, Bill, Steve, Kirk" per the filename. If Bill = Bill Small and Kirk = Kirk Davis, their slugs should be added to `contains[]` in the field photo index so the photo cross-indexes to their pages. Needs visual confirmation of who is who in the photo.

### Hillclimbers photo — hold for confirmation
`sargent-pdf-img-005.jpg` (Chinook on hilltop coastal firebase) extracted from Maxey PDF. Currently in outputs only — not committed to repo. User believes it may be Relay Mountain. Hold until confirmed by a participant.

### Tactical sub-point coordinates
The three tactical points for contact-fsb-fontaine-1971-04-20 (crossover, LZ, bunker complex) are estimates. Should be re-derived from the pre-dam military topo map using the Suoi Gia Ui location.
