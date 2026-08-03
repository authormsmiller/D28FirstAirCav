---
layout: layouts/location.njk
title: FSB Saint Barbara
slug: fsb-st-barbara
breadcrumb: FSB Saint Barbara
permalink: /locations/fsb-st-barbara/
tags:
  - location

display_name: FSB Saint Barbara
short_name: Saint Barbara
type: fsb
also_known_as: "Fire Support Base Saint Barbara, LZ Saint Barbara, LZ St. Barbara; per the firebase gazetteer, also 'The French Fort' and 'FSB Bao Co'"

named_for:
named_for_note: >
  Named for Saint Barbara, patron saint of artillery — per CPT Henry Colavita's own aside in
  his memoir, explicitly NOT named for a commander's wife (a naming pattern he contrasts
  elsewhere in the book). Not a dedication to an archive soldier. The gazetteer's separate
  alias "FSB Bao Co" is likely a Vietnamese-language designation rather than a second
  namesake; not yet explained further.

location:
  mgrs: "XT 275 684"
  lat: 11.4748
  lon: 106.1651
  province: Tay Ninh Province, III Corps, RVN
  modern_landmark: >
    Roughly 12 km north of Nui Ba Den ("Black Virgin Mountain"), consistent with Colavita's
    own account of the base sitting close to the mountain. (Nui Ba Den's own coordinates are
    general geographic knowledge, not sourced from this archive's own materials — treat this
    specific distance as an approximate cross-check, not an archive-confirmed measurement.)
  coordinate_source: military-registry
  coordinate_confidence: confirmed

dates:
  established:
    date:
    source: fsb-locations-gazetteer
    confidence: low
  closed:
    date:
    source:
    confidence: unverified
  notes: >
    The gazetteer's note for this grid reads "25th ID, 1st ACD '68" — placing some element of
    the 1st Air Cavalry Division here as early as 1968, a year before D Company's own
    February-March 1969 stay documented below. No specific establishment or closing date is
    given in the gazetteer entry itself. D Company's own tenure (per Colavita's memoir) ran
    from early February 1969 through most of March 1969, after which the company moved on
    toward the new LZ Carolyn area in April — but this reflects D Company's occupancy, not
    necessarily the base's full operational lifespan on either end.

occupancies:
  - start: "1968"
    end:
    company: 25th Infantry Division; 1st Air Cavalry Division (per gazetteer note, unit-level detail not further broken down)
    grid: "XT 275 684"
    source: "FSB-locations gazetteer (sources/fsb-locations/FSB-locations.pdf), 1:50,000 map sheet 6231-4"
    confidence: confirmed (grid); low (specific unit/dates within 1968)
    note: >
      Gazetteer note: "25th ID, 1st ACD '68," with aliases "The French Fort" and "FSB Bao
      Co." The "French Fort" alias is an independent, primary-source corroboration of
      Colavita's own description of the base as a former French fort — the two sources were
      developed completely separately and agree.
  - start: "1969-02"
    end: "1969-03"
    company: D Company, 2nd Battalion, 8th Cavalry, 1st Cavalry Division (tenant unit; the 25th Infantry Division held the perimeter)
    grid: "XT 275 684"
    source: "CPT Henry Colavita, \"Company Grade: Memoir of an Angry Skipper\" (Hellgate Press, 2015), ch. 9 \"Chicken Valley\" and ch. 10 \"Homeless on Saint Barbara\""
    confidence: high (narrative); confirmed (grid, via the gazetteer cross-check above)
    note: >
      D Company (and the rest of 2/8 Cav) moved here after abandoning FSB Rita, per
      then-battalion-commander LTC Frank Henry's advance briefing that the move would free
      all four line companies for simultaneous search-and-destroy, since the 25th Infantry
      Division — not 2/8 Cav — provided perimeter security here. Colavita's memoir places
      the company at Saint Barbara "during the month of February and most of March 1969,"
      before moving toward the new LZ Carolyn area in April 1969.

related_bases:
  predecessor: fsb-rita
  successor: fsb-carolyn
  split_from:
  split_into:

related_events:
  - operation-sheridan-sabre-1969-02-05
  - operation-montana-scout-1969

related_soldiers:
  - slug: colavita-henry
    note: "D Company commander throughout D Co's tenure at Saint Barbara (Feb-March 1969); primary source for this page."
    confidence: confirmed
  - slug: edmonds-james
    note: "KIA 5 Feb 1969 at a creek crossing in D Company's AO near Saint Barbara, an engagement the company later nicknamed 'Colavita Creek.'"
    confidence: confirmed
  - slug: kmit-chester
    note: "KIA 5 Feb 1969, same engagement as Edmonds, near Saint Barbara."
    confidence: confirmed
  - slug: karr-john
    note: "Arrived and was assigned as White Skull (1st Plt) platoon leader during this window, per Colavita's memoir; his own profile's confirmed 12 Mar 1969 in-country date falls inside the Feb-March Saint Barbara period."
    confidence: probable

command_post: true

status: research
date_added: 2026-07-23
last_updated: 2026-07-23
contributed_by:
notes: >
  Built 2026-07-23 from CPT Henry Colavita's memoir (ch. 9 "Chicken Valley" and ch. 10
  "Homeless on Saint Barbara" — see sources/colavita/09-chicken-valley/ and
  sources/colavita/10-st-barbara/) plus a firebase-gazetteer lookup Michael supplied directly
  in chat (FSB-locations.pdf, map sheet 6231-4): FB Saint Barbara, 11.4748 / 106.1651,
  XT275684, aka "The French Fort" and "FSB Bao Co," noted "25th ID, 1st ACD '68." This grid
  is a genuinely different site from the "FB Barbara" false match already flagged in
  soldiers/colavita-henry.md's admin notes (10.7240/106.4364, XS575855 — tied to the 199th
  Light Infantry Brigade near Xuan Loc, ~150 km southeast of 2/8 Cav's actual III Corps AO).
  Cross-checks: (1) the gazetteer's own "French Fort" alias independently matches Colavita's
  description without either source having informed the other; (2) the grid sits roughly 12
  km from Nui Ba Den, matching his account of the base's proximity to the mountain; (3) the
  gazetteer's separate FB Carolyn entry (XT278788, opened by 2/8 Cav 20 Apr 69) sits almost
  exactly 10.4 km north of this grid, matching Colavita's own "about 10km due north" account
  of the April 1969 move almost exactly. This is treated as sufficient corroboration to mark
  the coordinate itself "confirmed," even though no task-organization table or unit journal
  has independently verified 2/8 Cav's specific occupancy dates or brigade attachment here —
  see events/operation-sheridan-sabre-1969-02-05 for that separate, still-inferential
  question. FLAG FOR A FUTURE SESSION: the same gazetteer lookup surfaced that FB Carolyn was
  "Overrun 6May69" — a significant new fact not yet reflected anywhere in this archive (the
  existing operation-montana-scout-1969 and colavita-henry pages only note Carolyn's
  construction/occupation, not an overrun). Not actioned this session — a KIA-scale event
  page would need Michael's go-ahead before building, same as any new combat event.
  UPDATED 2026-07-23: Michael added four photos, sourced from a third-party site (Larry
  Kleinschmidt, larrykleinschmidt.com/VietnamGallery17.htm — a gallery titled "The French
  Fort"). This gallery's own title is a FOURTH independent corroboration of the "French
  Fort" identification (memoir description, gazetteer alias, and now a photographer's own
  gallery name), developed with no apparent connection to either of the other two sources.
  CORRECTED 2026-07-23: photos were initially filed at locations/fsb-st-barbara/photos/ —
  wrong location. The site's photo pipeline (site/_data/photosBySlug.js, photosByFsb.js)
  only crawls site/soldiers/[slug]/photos/**, not site/locations/[slug]/photos/; a location
  page's Photos tab is populated automatically via photosByFsb[slug], sourced from a
  contributor's own soldier-photo directory (photos/locations/[loc-slug]/index.md, each
  entry carrying fsb: <loc-slug>). Since Kleinschmidt has no soldier profile — he's not a
  documented D Co veteran, just a photo source — a minimal DRAFT (unpublished) stub was
  created at soldiers/kleinschmidt-larry/ solely to give the pipeline a directory to find;
  it does not appear on the roster or anywhere else on the live site (draft: true). The
  four photos now live at soldiers/kleinschmidt-larry/photos/locations/fsb-st-barbara/, and
  should appear in this page's Photos tab automatically once the site is rebuilt (no build
  was run this session — see carried-forward warning in every session handoff). The old
  locations/fsb-st-barbara/photos/index.md could not be deleted (filesystem denies unlink on
  this mount) and was left emptied with a pointer to the corrected location instead.
---

## Overview

**FSB Saint Barbara** was a fire support base in **Tay Ninh Province**, III Corps, near the
Cambodian border — a former French fort that by 1968 hosted elements of the **25th Infantry
Division** and the **1st Air Cavalry Division**. For the d281 archive, it matters as the base
**D Company, 2nd Battalion, 8th Cavalry** operated from during **February and most of March
1969**, immediately after abandoning **[FSB Rita](/locations/fsb-rita/)** — the period in which
**[CPL James Edmonds](/soldiers/edmonds-james/)** and **[SP4 Chester Kmit](/soldiers/kmit-chester/)**
were killed at a creek crossing nearby, and **[1LT Preston Karr](/soldiers/karr-john/)** joined
the company as its new White Skull platoon leader.

## Namesake

Named for **Saint Barbara**, the patron saint of artillery — company commander **[CPT Henry
Colavita](/soldiers/colavita-henry/)** notes this explicitly in his memoir, contrasting it with
bases named for a commander's wife or girlfriend elsewhere in his account. The firebase
gazetteer separately records "FSB Bao Co" as an alias, likely a Vietnamese-language
designation rather than a second namesake — not yet explained further.

## Location

The gazetteer fixes Saint Barbara at **XT275684 (11.4748, 106.1651)**, 1:50,000 map sheet
**6231-4**. This grid resolves a genuine identification puzzle the archive had carried for
several sessions: an earlier candidate coordinate for "FB Barbara" (10.7240, 106.4364 /
XS575855) turned out to be a **false match** tied to the 199th Light Infantry Brigade near
Xuan Loc, a different division operating roughly 150 km southeast of 2/8 Cav's actual III
Corps AO.

Three independent details line up to confirm the real site: the gazetteer's own alias **"The
French Fort"** matches Colavita's description of Saint Barbara as a former French fort — a
detail neither source could have taken from the other; the grid sits roughly 12 km from **Nui
Ba Den** ("Black Virgin Mountain"), matching his account of the base's proximity to that
landmark; and the gazetteer's separate entry for **FB Carolyn** (XT278788, opened by 2/8 Cav
20 April 1969) sits almost exactly **10.4 km north** of this grid — matching Colavita's own
account of an "about 10km due north" move to the Carolyn area in April 1969 almost exactly.

The gazetteer note for this grid reads simply **"25th ID, 1st ACD '68"** — placing some element
of the 1st Air Cavalry Division here as early as 1968, a year before D Company's own stay.

## D Company's tenure (February-March 1969)

D Company (and the rest of 2/8 Cav) moved to Saint Barbara after abandoning FSB Rita, on
then-battalion-commander LTC Frank Henry's advance briefing: the move would free all four of
his line companies for simultaneous search-and-destroy operations, since Saint Barbara sat in
the **25th Infantry Division's** AO — meaning 25th ID troops held the perimeter here, not 2/8
Cav itself. Colavita's memoir places the company at Saint Barbara "during the month of
February and most of March 1969." The base hosted Corps-level artillery beyond the usual
105mm/155mm — 175mm pieces and 8-inch guns — supporting RVN, ROK, and other allied units within
range as well, and had an airstrip large enough to lift the whole company at once.

## The February 5 creek-crossing ambush

On **February 5, 1969**, D Company was ambushed at a creek crossing in its AO near Saint
Barbara — an action the company later nicknamed **"Colavita Creek."** SP4 Chester Kmit was
killed instantly as point man; CPL James Edmonds was mortally wounded and died during
evacuation. See **[the full event page](/events/operation-sheridan-sabre-1969-02-05/)** for
the complete account, including the cable-cutting incident during Edmonds's medevac and the
brigade-attachment question this base's location helps resolve.

## Life on the base

Colavita's memoir describes Saint Barbara as one of "an annoying string of fire bases strung
along the Cambodian border," each kept within mutual 105mm howitzer support range of the next
specifically to counter NVA supply caching. Three short-lived attachments arrived and departed
during D Company's stay: a tracker-dog team (a German Shepherd and handler, judged "worthless"
after about a week and sent away), a PsyOps team (one soldier, one interpreter, and a
megaphone, which never obtained a surrender), and a Pathfinder corporal for landing/departure
control, who refused to dig a foxhole and departed with the battalion staff, never seen again.
An "impact award" ceremony — the 1st Cavalry Division's program for presenting awards promptly
after the actions that earned them — was also held at a resupply LZ near the company's AO
during this period, attended by LTC Richard Wood and Maj. James Bramlett.

Not itself a D Company matter, but recorded here as base-level context: the day before Tet, a
1st Cav Aviation Battalion "Blues" security platoon was ambushed nearby while recovering a
downed helicopter, and a second aircraft was shot down during the fight — an incident D Company
helped respond to, though none of the casualties were D Company soldiers and are out of scope
for individual profiles under this archive's conventions.

## The move to LZ Carolyn

In April 1969, D Company left Saint Barbara for a new area of operations roughly 10 km to the
north, near the soon-to-be-built **[FSB Carolyn](/locations/fsb-carolyn/)** — a move that lines
up closely with **[Operation Montana Scout](/events/operation-montana-scout-1969/)'s** official
April 1, 1969 start. The gazetteer independently confirms Carolyn's own grid (XT278788) and gives
its opening date as 20 April 1969 — and records that it was **overrun on 6 May 1969**. That
battle is now written up on Carolyn's own page rather than here, since it was fought by Companies
C and E, not D Company. Whether it also warrants its own dedicated event page (as opposed to
background narrated on the location page) remains an open question there.

## Sources

| Claim | Source | Confidence |
|---|---|---|
| Grid XT275684 (11.4748, 106.1651), map sheet 6231-4; aliases "The French Fort," "FSB Bao Co"; note "25th ID, 1st ACD '68" | FSB-locations gazetteer (sources/fsb-locations/FSB-locations.pdf) | confirmed |
| Former French fort, 25th ID's AO, Corps-level artillery, named for the patron saint of artillery, near Nui Ba Den | CPT Henry Colavita memoir, ch. 9 "Chicken Valley" | high (author's own account) |
| D Co tenure Feb-most of March 1969; firebase-string context; three attachments; impact-award ceremony; move to Carolyn area in April 1969 | CPT Henry Colavita memoir, ch. 10 "Homeless on Saint Barbara" | high (author's own account) |
| FB Carolyn grid XT278788, opened by 2/8 Cav 20 Apr 69, overrun 6 May 69 | FSB-locations gazetteer | confirmed (grid/dates); not yet cross-checked against a unit-level record for the overrun itself |
| "FB Barbara" at 10.7240/106.4364 (XS575855) is a false match, tied to 199th LIB near Xuan Loc | soldiers/colavita-henry.md admin notes, citing a 199th LIB / D/2/40th Arty daily staff journal (dated 21 Jan 69) | confirmed (as a false match) |
| Site independently photographed under the name "The French Fort," matching the gazetteer alias | Larry Kleinschmidt, larrykleinschmidt.com/VietnamGallery17.htm | corroborating (third-party, non-archive source; not itself a primary military record) |

## Open Questions

- [ ] Establish the base's specific establishment and closing dates beyond the gazetteer's bare "1968" note and D Company's own Feb-March 1969 window.
- [ ] Confirm 2/8 Cav's brigade attachment while at Saint Barbara against a task-organization table or unit journal — the grid confirms the location and its Tay Ninh Province setting, but does not by itself confirm which brigade 2/8 Cav was under (see events/operation-sheridan-sabre-1969-02-05, oq-02).
- [ ] Pull the 2/8 Cav daily staff journal (NARA RG 472) for Feb-March 1969 to fix the exact grid of the February 5 creek-crossing ambush relative to this base.
- [x] ~~Decide whether the FB Carolyn overrun (6 May 1969) warrants its own event page.~~ —
      **Partially resolved (2026-07-27):** FSB Carolyn's own page is now built and narrates the
      battle as background/history there. Whether it should *also* get a dedicated event page
      (this archive's usual treatment for combat actions) remains open — see
      `/locations/fsb-carolyn/` Open Questions.
