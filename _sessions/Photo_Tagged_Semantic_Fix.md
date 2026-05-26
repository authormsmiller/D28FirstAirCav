# Photo `tagged` — Semantic Fix & byTagged Implementation

**Date raised:** 2026-05-26
**Status:** Designed, not implemented
**Priority:** Medium — blocks Colburn profile completeness and the Keepsakes photo discovery feature

---

## The Problem

The `tagged` field on photo index entries currently has an ambiguous definition that makes it unusable as a reliable data signal:

- **Intended (loose):** "This soldier was probably nearby when this photo was taken" — a probabilistic guess based on context
- **Intended (meaningful):** "This soldier has a documentable connection to this photo even though they don't appear in it" — an intentional, specific claim

The loose use case is unmanageable at scale and produces noise. It has been **retired** as of Session 46.

Additionally, `tagged` on photos is currently ignored entirely by the photo gallery. The `byContains` reverse map drives "Photos of [First]" but there is no equivalent `byTagged` map. Tagged soldiers receive no representation in the photo tab regardless of how meaningful the connection is.

---

## New Semantic Definitions (Decided Session 46)

| Field | Meaning | Bar |
|---|---|---|
| `contains` | Soldier appears in the photo — visually identifiable | I can see this person in the frame |
| `tagged` | Soldier has a meaningful, documentable connection to the photo but does not appear in it | I can state specifically why this photo belongs in their story |

**Both are intentional, specific claims. Neither is a guess.**

### Examples

**Correct use of `tagged`:**
- Crash wreckage photos (`042471-hueycrash3.jpg`, `042471-hueycrash4.jpg`) — Fanning (pilot), Colburn (passenger), Jeffries (co-pilot), Stanfield (door gunner) all have documentable connections to these photos. None appear in the frame. All should be tagged.

**Incorrect use of `tagged` (to be removed):**
- "Larry Cate was probably standing next to Marvin when he took this" — not a meaningful connection, no evidence. Remove the tag. If a photo is later found showing both of them, it becomes `contains` on both.

### The boundary case
If you find a photo with both Cate and Miller in frame → `contains` on both.
If you can document Cate was present but he's not visible → `tagged`.
If you're guessing → nothing.

---

## The Canonical Case — Colburn's Profile

The crash photos are the clearest example of why this matters and why fixing it is tied to Colburn's profile being complete.

**File:** `site/soldiers/miller-marvin-dale/photos/field/events/index.md`

**`042471-hueycrash3.jpg`**
```yaml
contains:
  - colburn-richard
tagged:
  - fanning-martin
```
Missing from tagged: `jeffries-gabriel`, `stanfield-nathan`

**`042471-hueycrash4.jpg`**
```yaml
contains: []
tagged:
  - fanning-martin
```
Missing from tagged: `colburn-richard`, `jeffries-gabriel`, `stanfield-nathan`

Colburn, Fanning, Jeffries, and Stanfield were all on UH-1H tail number 69-15692 when it went down at FSB Fontaine on 24 April 1971. These photos document the immediate aftermath of their crash — Marvin Miller was among the first on scene and photographed the undisturbed wreckage. This is the most direct visual documentation of the event that defines Colburn's profile. It should be visible on all four soldiers' photo tabs.

Currently:
- Colburn's photo tab: `hueycrash3.jpg` *should* appear via byContains (contains: colburn-richard) — but may not be surfacing due to a possible scraper bug (see below). `hueycrash4.jpg` does not appear — empty contains.
- Fanning's photo tab: neither photo appears — he is only in `tagged`, which is not used by the gallery.
- Jeffries's photo tab: neither photo appears — not in contains or tagged on either photo yet.
- Stanfield's photo tab: neither photo appears — not in contains or tagged on either photo yet.

---

## Possible Scraper Bug — field/events Subfolder

`hueycrash3.jpg` has `colburn-richard` in `contains`. By the existing `byContains` logic, it should surface on Colburn's "Photos of Richard" gallery. It reportedly does not.

**Hypothesis:** The scraper may not be walking the `field/events` subfolder when building the `byContains` reverse map. The template handles `crawlerEntry["field/events"]` as a separate key for Gallery 2 (photos taken by the soldier), but the byContains build step in the data layer may only process `field/` and `profile/` — not nested subfolders.

**To investigate:** Check the scraper/data build file that constructs `photosBySlug` and `photosBySlug.byContains`. Confirm whether `field/events/index.md` entries are included in the byContains build pass.

---

## Implementation Plan

### Step 1 — Data audit (do first)
Review all existing `tagged` values on photo index.md files across the archive. Remove any that were added under the loose "probably nearby" definition. Apply the new standard: only keep tags where you can state a specific reason.

Known files to check:
- `miller-marvin-dale/photos/field/events/index.md` — crash photos (update needed, see above)
- Any other photo index files that use `tagged`

### Step 2 — Update crash photo tags
In `miller-marvin-dale/photos/field/events/index.md`:

**`042471-hueycrash3.jpg`** — add to tagged:
```yaml
tagged:
  - fanning-martin
  - jeffries-gabriel
  - stanfield-nathan
```
(colburn-richard stays in `contains` — he is named in the caption)

**`042471-hueycrash4.jpg`** — update contains and tagged:
```yaml
contains: []
tagged:
  - colburn-richard
  - fanning-martin
  - jeffries-gabriel
  - stanfield-nathan
```

### Step 3 — Investigate and fix the scraper bug
Confirm whether `field/events/index.md` is being processed by the byContains build step. If not, fix the scraper to include all subfolders when building the reverse map.

### Step 4 — Build byTagged reverse map
In the same scraper/data file that builds `photosBySlug.byContains`, add a parallel `photosBySlug.byTagged` map. Same structure, sourced from `tagged` arrays instead of `contains` arrays.

```js
// Pseudocode — same pattern as byContains build
for (const photo of allPhotos) {
  for (const slug of photo.tagged || []) {
    if (!byTagged[slug]) byTagged[slug] = [];
    byTagged[slug].push(photo);
  }
}
```

### Step 5 — Add "Related Photographs" section to soldier.njk photos tab
After the existing "Photos of [First]" gallery, add a conditional section:

```njk
{% set relatedPhotos = [] %}
{% if photosBySlug.byTagged and photosBySlug.byTagged[slug] %}
  {% set relatedPhotos = photosBySlug.byTagged[slug] %}
{% endif %}

{% if relatedPhotos.length %}
<div class="gallery-sublabel">Related Photographs</div>
<p class="timeline-intro" style="font-style:italic;">
  These photographs are connected to {{ first_name }}'s service but do not show {{ first_name }} directly.
</p>
<script>
  var PHOTO_SLIDES_RELATED = [
    {% for photo in relatedPhotos %}
    {
      src: {{ photo.url | dump | safe }},
      caption: {{ (photo.caption or photo.caption_short or photo.filename) | dump | safe }},
      credit: {{ (photo.credit or "") | dump | safe }},
      date: {{ (photo.date or "") | dump | safe }}
    }{% if not loop.last %},{% endif %}
    {% endfor %}
  ];
</script>
<div class="photo-grid">
  {% for photo in relatedPhotos %}
    <div class="photo-card" onclick="lbOpen({{ loop.index0 }}, PHOTO_SLIDES_RELATED)">
      <img src="{{ photo.url }}"
           alt="{{ photo.caption_short if photo.caption_short else photo.filename }}"
           loading="lazy">
    </div>
  {% endfor %}
</div>
{% endif %}
```

### Step 6 — wartime_content_notice
Set `wartime_content_notice: true` in the frontmatter for colburn-richard, fanning-martin, jeffries-gabriel, and stanfield-nathan. The template already handles this flag — it adds a content notice to the photos tab. The crash wreckage photos warrant it.

---

## Gallery Order Note

When the Related Photographs section is live, photo gallery order on KIA profiles should be:
1. Portrait photos (profile subfolder)
2. Field photos (field subfolder)
3. **Related Photographs** (byTagged) — crash documentation last

Wreckage appearing before you've seen the person is a gut punch. Wreckage appearing after you know them is documentation.

---

## Relation to Keepsakes / Book Builder

The `byTagged` map is also a discovery path for the book builder. A family assembling a collection about Colburn would want the crash documentation photos even though Colburn doesn't appear in them. Under the old system those photos were invisible to any Colburn query. Once byTagged is built, they surface naturally.

This is part of why "good enough for a researcher" requires the tagged semantics to be precise — a researcher building a complete picture of Colburn's service needs these photos, and the system has to be able to find them reliably.

---

## Files To Touch

| File | Change |
|---|---|
| `miller-marvin-dale/photos/field/events/index.md` | Add missing tagged slugs on both crash photos |
| Scraper/data build file (photosBySlug) | Fix field/events inclusion in byContains; add byTagged map |
| `site/_includes/layouts/soldier.njk` | Add Related Photographs section in photos tab |
| `colburn-richard.md`, `fanning-martin.md`, `jeffries-gabriel.md`, `stanfield-nathan.md` | Add `wartime_content_notice: true` |
| Any other photo index.md files using `tagged` | Audit and remove loose associations |
