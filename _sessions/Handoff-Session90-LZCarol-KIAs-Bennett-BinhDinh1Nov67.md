# Session Handoff — 2026-07-08

## Completed this session

### golden-ronald — SP4 Ronald Duane Golden
- `site/soldiers/golden-ronald/golden-ronald.md` — complete
- `site/soldiers/golden-ronald/photos/profile/index.md` — complete
- D/2-8 Cav, KIA 08/20/1968, small arms fire, Thua Thien Province
- related_events: lz-carol-1968
- Service ID 56959597 — DO NOT PUBLISH

### fast-roger — PFC Roger Theodore Fast
- `site/soldiers/fast-roger/fast-roger.md` — complete
- `site/soldiers/fast-roger/photos/profile/index.md` — complete
- D/2-8 Cav, arrived 07/24/1968, KIA 08/19/1968 (26 days in-country), small arms fire, Thua Thien Province
- related_events: lz-carol-1968
- Photo credit: Courtesy of William Fast (via Herb Reckinger Jr.)
- No Find A Grave. Service ID 56565673 — DO NOT PUBLISH

### bennett-michael — 2LT Michael E. Bennett
- `site/soldiers/bennett-michael/bennett-michael.md` — complete; updated this session to add contact-binh-dinh-1967-11-01 to related_events
- `site/soldiers/bennett-michael/photos/profile/index.md` — complete
- `site/soldiers/bennett-michael/photos/clipping/index.md` — complete (newspaper clipping bennett-michael-clipping.jpg)
- D/2-8 Cav, OCS commission Feb 1967, arrived 08/30/1967, KIA 11/01/1967 (63 days in-country), small arms fire, Binh Dinh Province
- related_events: contact-binh-dinh-1967-11-01, operation-pershing-1967
- Service ID O5337355 (officer serial, "O" prefix) — DO NOT PUBLISH
- Mother: Mrs. Mary R. Bennett, Brentwood, NH. First KIA from Brentwood; 73rd in NH.
- Newspaper clipping says "near DMZ" — reporter error; official records say Binh Dinh Province

### contact-binh-dinh-1967-11-01 — new event page
- `site/events/contact-binh-dinh-1967-11-01/index.md` — created this session
- Sparse contact event (single casualty, no grid, no contact narrative)
- LZ English confirmed at BS885008 (14.4747°N, 109.0331°E) from 1/1 ACD OPORD 3-67, entry dated 13 Nov 67 (FSB location database)
- Operational context: battalion returned to LZ English 14 Oct after Bolling; deployed to Dak To ~3 Nov; Bennett KIA 1 Nov at end of Bong Son phase
- open_questions: oq-02 (pin the contact via 2/8 Cav staff journal, NARA RG 472) and oq-03 (confirm exact Dak To departure date)

---

## Pending / open research

### Division HQ ORLL, period ending 31 October 1968
- Needed for LZ Carol (August 1968) context
- Companion document AD0500295 (1st Cav Div Artillery ORLL, Aug–Oct 1968) is already in `locations/`
- The Arty ORLL references LZ Carol; the missing HQ ORLL would confirm D Company's movements
- Estimated AD range: AD0499xxx–AD0502xxx based on neighboring documents
- Dead ends: AD0508303 = Oct 1969 (not 1968); AD0504261 not found in locations folder
- **Action needed**: search apps.dtic.mil directly in browser

### FSB-locations.pdf search for 2/8 Cav Oct–Nov 1967 Binh Dinh entries
- File: `sources/fsb-locations/FSB-locations.pdf` (553 pages)
- Goal: find any 2/8 Cav firebase or patrol base entries for October–November 1967 in Binh Dinh Province
- Previous attempt timed out (large PDF, shell 45s limit)
- Approach: use `pdftotext` to convert first, then grep — faster than pdfplumber page-by-page
- Would potentially locate Bennett more precisely than "somewhere on the Bong Son plain"

### ORLL-31-Jul-68.pdf alias
- File is confirmed as AD393815: 1st Cav Division Artillery ORLL, period ending 31 July 1968
- Should be aliased/noted as AD0393815 in the locations folder for discoverability
- Low priority

---

## KIA folder — remaining stubs
- The KIA folder had golden-ronald, fast-roger, and bennett-michael; all three are done
- Check `C:\Users\michael.miller\Downloads\KIA` for any remaining slugs

---

## Key reference: Bennett operational timeline
- Aug 30: Bennett arrives in-country
- Sep 19 – Oct 14: Operation Bolling (2/8 Cav OPCON to 173rd Airborne, Song Re Valley)
- Oct 14: Battalion returns to LZ English (BS885008), Bong Son, Binh Dinh Province
- **Nov 1: Bennett KIA, small arms fire, Binh Dinh Province**
- ~Nov 3: 2/8 Cav deploys to Dak To, Kontum Province (Battle of Dak To, Nov 3–22)
- Dec: Battle of Tam Quan, return to Binh Dinh

Dak To is NOT Tam Quan. They are separate operations in different provinces (Kontum vs. Binh Dinh). Tam Quan is the December follow-on after the battalion returns from Dak To.

---

## Site / repo notes
- Repo: `C:\Users\michael.miller\archive\d281staircav`
- Deploy: Cloudflare Pages / Wrangler
- Event slugs follow pattern: `contact-[province]-[YYYY-MM-DD]` for sparse contacts
- Service IDs (Army-era SSNs / officer numbers) go in admin `notes:` only, never in published fields
- `decorations_unconfirmed` = Honor States probability-based items; move to `decorations` when primary source located
