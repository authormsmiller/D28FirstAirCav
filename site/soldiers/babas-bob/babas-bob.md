---
layout: layouts/soldier.njk
title: 2LT Bob Babas
slug: babas-bob
breadcrumb: Bob Babas
permalink: /soldiers/babas-bob/
tags:
  - soldier

# ── IDENTITY ──────────────────────────────────────
first_name: Bob
last_name: Babas
middle_name:
suffix:
nickname:
birth_year:

# ── RANK & ASSIGNMENT ─────────────────────────────
rank: 2LT
mos:
platoon: Range

# ── SERVICE ───────────────────────────────────────
arrived:
departed:
character_of_service: Honorable
status: researching

# ── POST-SERVICE ──────────────────────────────────
hometown:
current_location:
year_deceased:
cause_of_death:

# ── PROFILE PHOTO ─────────────────────────────────
profile_photo: "babas-bob-profile.png"

# ── DECORATIONS ───────────────────────────────────
decorations:

distinguished_decorations:

decorations_unconfirmed:

# ── SERVICE RECORD ────────────────────────────────
service_record:
  induction:
    status:
    location:
    date:
  assignments:
    - type: combat
      label: "Rifle Range 6 — Platoon Leader, Rifle Range (3rd Platoon), Company D, 2nd Battalion, 8th Cavalry"
      unit: "Company D, 2nd Battalion (Airmobile), 8th Cavalry Regiment, 1st Cavalry Division (Airmobile)"
      location: "Republic of Vietnam"
      from: "1968-12 (approx)"
      to: "1969-04 (approx)"
      notes: >
        Newly arrived, "green" 2LT, per CPT Henry Colavita's memoir. Colonel
        Frank Henry (battalion CO) swapped Babas into D Company at Christmas
        1968, taking Lt. Michael Johnson off Colavita's hands in exchange
        (Johnson was reassigned to battalion staff after a perimeter-
        discipline incident during the Dec 4-5, 1968 night assault). Babas
        took over Rifle Range (3rd) Platoon and, per the text, "remains
        Rifle Range platoon leader for the rest of Colavita's command" --
        paralleling 2LT David Spingath at Wild Cat (2nd Plt). End date is a
        working estimate only: Colavita's own command-end date is not yet
        fixed elsewhere in the archive (April or May 1969), so Babas's own
        departure/reassignment date is equally unconfirmed.

# ── CONTACT ───────────────────────────────────────
share_contact: false
contact:
  name:
  relation:
  last_verified:

# ── EXTERNAL LINKS ────────────────────────────────
links:
  wall:
  other:

# ── TIMELINE SOURCE NOTE ──────────────────────────
timeline_source: >
  Sourced entirely from CPT Henry Colavita's memoir, "Company Grade: Memoir
  of an Angry Skipper" (Hellgate Press, 2015), ch. 9, "Chicken Valley" --
  see the chapter digest at
  site/sources/colavita/09-chicken-valley/09-chicken-valley.digest.json. No
  independent service record yet.

# ── SERVICE TIMELINE ──────────────────────────────
timeline:
  - date: "1968-12 (approx)"
    phase: in-country
    type: assignment
    tags:
      - { type: s, label: "Platoon Leader" }
    headline: "Swapped into D Company at Christmas, takes Rifle Range platoon"
    body: >
      At Christmas 1968, Colonel Frank Henry (battalion CO) took Lt. Michael
      Johnson off Colavita's hands -- Johnson had been found lying at the
      bottom of the CP foxhole during the Dec 4-5 night mortar attack,
      claiming he was "checking the perimeter," and was privately judged by
      Colavita and the Rifle Range NCOs to have shown "no initiative, no
      leadership ability" -- and gave Colavita a newly arrived, "green"
      second lieutenant in return: Bob Babas. Babas took over Rifle Range
      (3rd Platoon) and held it for the remainder of Colavita's command,
      paralleling 2LT David Spingath's tenure at Wild Cat (2nd Platoon). See
      soldiers/colavita-henry and soldiers/spingath-dave.
    source_notice: >
      Per CPT Henry Colavita's memoir, ch. 9 ("Chicken Valley").

  - date: "1969-03 (approx)"
    phase: in-country
    type: other
    headline: "Named in a group photo as \"Rifle Range 6\""
    body: >
      Appears in a group photograph in Colavita's memoir, captioned "the
      author (far left) with platoon leaders (left to right) Bob Babas
      (Rifle Range 6), Dave Spingath (Wild Cat 6), and Preston Karr (White
      Skull 6)." The photo is undated in the book but must postdate 1LT
      John Karr's confirmed 12 March 1969 arrival in-country -- see
      soldiers/karr-john. This is a different photo from the one used for
      Babas's own profile portrait here, which was separately supplied.
    source_notice: >
      Per CPT Henry Colavita's memoir, ch. 9 photo caption; date bounded by
      Karr's confirmed arrival date. See also
      soldiers/spingath-dave/photos/profile/index.md, which uses a crop of
      this same group photo.

# ── PHOTOS ────────────────────────────────────────
photo_intro: >
  A wartime-era portrait, cropped to remove a burned-in text label from the
  original scan (see admin notes). Babas also appears, uncropped here, in a
  group photo from Colavita's memoir already used on David Spingath's
  profile.

wartime_content_notice: false

photos:

# ── DOCUMENTS ─────────────────────────────────────
documents:

# ── RELATED ───────────────────────────────────────
brothers:

related_events:

# ── ADMIN ─────────────────────────────────────────
date_added: 2026-07-27
last_updated: 2026-07-27
contributed_by:
notes: >
  STUB PROFILE (2026-07-27): built from CPT Henry Colavita's memoir,
  "Company Grade: Memoir of an Angry Skipper," ch. 9 "Chicken Valley" --
  see site/sources/colavita/09-chicken-valley/09-chicken-valley.digest.json
  and .review.md. Was on site/_docs/stub-candidates.md (Pending) before
  this session; move that row to Resolved.

  IDENTITY: no MOS, hometown, birth year, exact arrival/departure dates, or
  decorations sourced yet. Rank (2LT) and platoon (Rifle Range/3rd, callsign
  "Rifle Range 6") are both text-confirmed.

  PHOTO -- TEXT REMOVAL ATTEMPTED, NOT USED: Michael supplied two versions
  of a candid photo (arms crossed, field setting) -- an original with a
  burned-in "BOB Babbas" text label (misspelled) across the lower third,
  and a tighter crop that removes the label entirely. Asked whether the
  text could be cleanly removed from the original instead of using the
  crop. Attempted via OpenCV color-mask + inpainting (isolating the yellow
  text by HSV threshold, restricting to the text's bounding box to avoid
  false positives on skin tones, then cv2.inpaint with both TELEA and NS
  algorithms). Result: text was removed but left a visibly blurry/smudged
  patch on the jacket -- not clean at any tested radius/mask setting, given
  the image's small size (444x252) and the fabric texture behind the text.
  Judged not good enough to use per Michael's own fallback instruction --
  went with the supplied cropped version instead, tighter framing but no
  artifacts. The inpainting attempts were not saved into the site tree.

  RELATED: see soldiers/colavita-henry (commanding officer, this chapter's
  narrator), soldiers/spingath-dave (parallel platoon-leader swap-in,
  Wild Cat), soldiers/karr-john (third platoon leader in the same group
  photo, White Skull). Lt. Michael Johnson (the officer Babas replaced) and
  RTO Ray Haley remain unbuilt stub candidates from the same chapter -- see
  site/_docs/stub-candidates.md.
---
