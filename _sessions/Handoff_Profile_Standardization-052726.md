# Handoff — D281 Staircav: Profile Standardization & Session Work
**Date:** 2026-05-27
**Sessions covered:** ~2026-05-26 – 2026-05-27 (two context windows)
**Project:** authormsmiller/d281staircav — D Company, 2/8 Cav, 1st Cavalry Division (Airmobile)
**Site generator:** Eleventy (11ty) v2 · Nunjucks templates · Cloudflare Pages

---

## 1. What Was Accomplished This Session

### 1.1 Profile Standardization — Group 1 (Complete)

Four soldier profiles were fully migrated to the canonical template format:

| Slug | Status |
|---|---|
| hurst-fred | Migrated |
| alloway-denny | Migrated |
| kutter-wolf | Migrated |
| makowski-william | Migrated + research-enriched |

**Makowski** received additional work beyond migration:
- Virtual Wall, VVMF Wall of Faces, and Honor States researched (JS-blocked pages; final VVMF URL not confirmed)
- Document record created: `site/documents/makowski-william/makowski-memorial-booklet-2021/index.md` (access: restricted — family/unit booklet)
- `contact-nui-ba` event updated with memorial booklet narrative data
- `blagg-thomas.md` rank confirmed: **COL** (from booklet source; previously uncertain LTC vs. COL)

---

### 1.2 Kint, Joe — Full VHP Interview Processing (Complete)

**Source:** Veterans History Project oral history, YouTube: https://www.youtube.com/watch?v=ihaGJZqxUYE
Five segments processed in full. See `Handoff_Kint_Transcripts` for detailed transcript content.

**Files created/modified:**

| File | Action |
|---|---|
| `site/soldiers/kint-joe/kint-joe.md` | Fully enriched from all 5 segments; timeline trimmed to in-country only |
| `site/documents/kint-joe/kint-joe-vhp-interview/index.md` | Created; all 5 segments marked reviewed |
| `site/documents/kint-joe/kint-joe-biography/index.md` | Created; full prose biography, public access |

**Key data confirmed from interview:**

| Field | Value | Confidence |
|---|---|---|
| Birth | February 1945, Iowa City, IA | Confirmed |
| MOS | 11B · Light Weapons Infantryman | Confirmed |
| Arrived Vietnam | December 10, 1970 | Confirmed ("I arrived the tenth") |
| Departed Vietnam | December 8, 1971 | Confirmed ("I went home the eighth") |
| Lottery number | 182 | Confirmed |
| Initial unit | D/1-8 Cav | Confirmed |
| Final unit | D/2-8 Cav (post-redesignation) | Confirmed |
| Platoon | Cat (Wild Cat = 3rd Platoon) | Confirmed |
| Hometown | Manchester, IA | Confirmed |
| Current location | Davenport, IA | Confirmed |
| Rear assignment | Company clerk typist, Biên Hòa, ~October 1971 | Confirmed |

**Timeline (9 in-country entries — what appears on the website):**
1. `1970-12-10` — Arrived Vietnam, D/1-8 Cav
2. `1970` — Assigned to walk point, first week in-country
3. `1970` — First firefight (VC uniform factory, MR3)
4. `1971` — Unit redesignated D/1-8 → D/2-8 Cav
5. `1971` — Issued M16/M79 over-under grenade launcher
6. `1971` — Received 8th grade letters from Iowa colleague
7. `1971-10` — Reassigned to Biên Hòa as company clerk typist
8. `1971` — Vũng Tàu R&R ×2 + logistics run as clerk
9. `1971-12-08` — Departed Vietnam, two days short of 12 months

**Decision made:** All pre-service and post-service timeline entries moved to biography document, not shown on site. Consistent with Makowski and other profiles that show only in-country entries.

**Note on `phase` field:** `soldier.njk` does NOT filter timeline entries by phase — it renders everything in the `timeline` array. Phase is a data-only classification field. Trimming to in-country entries is the correct solution.

---

### 1.3 FSB Donna — Research Notes Updated

**File:** `site/_docs/locations/fsb-donna.md`

**Updates made (2026-05-27):**
- Added coordinate corroboration note: user's self-pinned map at ~10°51'11.1"N, 106°41'10.9"E matches Gemini value to within arc-seconds. Not an independent source, but consistent.
- Added Section 5: Working Hypothesis — connecting early May 1971 Donna posting to the April 20, 1971 contact, the April 24 crash, and a likely Vũng Tàu R&R rotation
- Donna's position (~40 miles west/southwest of Fontaine, near Biên Hòa rear base) is geographically consistent with a transit or reconstitution stop
- Key open question: McGrew calendar shows "Range" (McDonald, Norm) at Donna — is this an individual assignment or a company movement?

**User's hypothesis (recorded in file):** The Donna posting in early May 1971 may reflect the company pulling off the forward line after taking 4 KIA and 6+ WIA in the 4/20 contact, with elements transiting through the Biên Hòa defensive ring en route to Vũng Tàu R&R.

---

## 2. Current File States

### Canonical Template
The established soldier profile template uses section comment headers in YAML:
```yaml
# ── IDENTITY ──
# ── SERVICE ──
# ── RELATIONSHIPS ──
# ── CONTENT ──
```
All Group 1 soldiers now use this format. See any migrated profile for the full structure.

### Document Format
Follows `garvin-jim-one-mans-story-colburn` pattern:
- YAML frontmatter with `layout`, `permalink`, `slug`, `title`, `author`, `date`, `type`, `status`, `access`, `contains`, `tagged`, `source_note`
- Full prose narrative below `---`
- `contains:` lists every soldier slug named substantively in the document
- `tagged:` lists soldiers mentioned but not the document's primary subject

### `_docs/locations/` Directory
Working research notes (not published). Current files:
- `fsb-fontaine.md` — Primary base, spring 1971; coordinates Gemini-sourced, user map consistent
- `fsb-fanning.md` — May 1971 onward; distinct from Fontaine (different grid zones confirm two separate bases)
- `fsb-donna.md` — Updated this session (see §1.3 above)
- `relay-mountain.md` — Miller, Marvin Dale's detachment assignment ~March–April 1971
- `fsb-mace.md` — Battalion rear base; Garvin notes it moved from Mace to Biên Hòa before April 24 crash

---

## 3. Pending Work — Priority Order

### 3.1 Immediate / High Priority

**sargent-stan** — Dedicated profile build session pending
- PFC Stanton Gerald Sargent, Range Platoon, KIA
- Widow's transcript on file — described as containing a LOT of information
- Full name confirmed: Stanton Gerald Sargent (nickname Stan)
- Do NOT do piecemeal work on this profile — reserve for a dedicated session with the transcript as primary source
- Needs: Virtual Wall / VVMF research, KIA date, panel/line, full biography from transcript

**jeffries-gabriel** — Full KIA profile build (marked priority)
- WO1, co-pilot, KIA April 24, 1971 (crash-fsb-fontaine-1971-04-24)
- Referenced in crash event; no profile yet
- Requires: VVMF research, records, panel/line lookup

**W.J. Brooks stub**
- 27th Maintenance Battalion; crash survivor, April 24, 1971
- First documented in Garvin's Colburn memorial speech (garvin-jim-one-mans-story-colburn)
- Minimal data known; stub creation with survivor status and source citation

**Group 4 Profile Migrations** (Complete — 2026-05-27)

| Slug | Status | Notes |
|---|---|---|
| miller-marvin-dale | Migrated | Added permalink, tags, split IDENTITY/RANK sections, added POST-SERVICE, SERVICE RECORD, EXTERNAL LINKS, RELATED, ADMIN; added `phase` field to all timeline entries |
| cate-larry | Migrated | Full rewrite from stub; year_deceased filled as 2011 (from ice-cream-culvert anecdote source); Janice Cate listed as widow contact |
| davis-kirk | Migrated | Added permalink, tags, all missing sections; moved current_location to POST-SERVICE; preserved timeline and photo array intact |
| romani-val | Migrated | Rank confirmed as LT / Cat 6 (Platoon Commander) from romani-testimony; status veteran confirmed (contacted 2024–2025); role and assignment notes filled from anecdote sources |
| sells-leroy | Migrated | Status deceased confirmed from MDM photo caption; year of death unknown; no contact on file |
| weaver-ken | Migrated | Added permalink, tags, all missing sections; rank SGT from prior title (not independently confirmed) |

**Group 2 Verify** (migrated but unverified)
- bacon-wg
- garvin-jim
- woo-robin

### 3.2 Research / Verification

**FSB location coordinates**
- User shared a self-pinned map with 8 Firebase positions
- Coordinates for Fontaine and Donna match Gemini data closely
- Remaining bases on the map: Fanning, Jeffries, Silver, Relay Mountain, Mace, and one other — verify each against `_docs/locations/` files
- Source note is critical: user-self-pinned ≠ independent corroboration of Gemini data; treat as "consistent" only until verified against operational maps

**Makowski VVMF Wall of Faces URL**
- Site is JS-rendered; web fetch returned empty shell
- Need Claude in Chrome or direct browser visit to confirm URL
- Likely: https://www.vvmf.org/Wall-of-Faces/32430/WILLIAM-J-MAKOWSKI/

**Makowski National Guard connection**
- Mentioned but not confirmed in records — needs clarification

**McGrew calendar entries**
- Donna entry date not yet transcribed (confirmed early May 1971 by user recollection)
- "CA to Fontaine" — May 2, 1971 — already recorded
- Full calendar intake session still pending

**Miller, Marvin Dale letters intake**
- February 1971 letter: "the new firebase" (Fontaine), map drawn for colonel
- Mid-April 1971 letter: returned from Relay Mountain; CPT Neal newly arrived
- Whether these are the same letter or separate letters: unresolved
- Map of FSB Fontaine drawn by Miller — if it survives, significant artifact

### 3.3 Kint Narrative Development

See `Handoff_Kint_Transcripts` for the full stories catalog. High-potential items:

- The green tracer convergence story (first firefight) — complete narrative arc
- The school board battle — complete narrative arc with resolution
- The MOS argument × 2 — compact, illustrative
- The 8th grade letters — psychological anchor story, emotional resonance
- Wild elephants and rats — sensory contrast piece
- The Bob Hope bookends (missed 1970 as cherry; gone before 1971)

---

## 4. Open Bugs / Technical Debt

| Issue | Status | Notes |
|---|---|---|
| Lightbox index offset | Open | Lightbox opens wrong photo (index off by 1) |
| Event slug `[]` literal | Open | Some event slugs rendering as literal `[]` in output |
| Fuzzy match scorer | Open | Search fuzzy matching needs calibration |
| Email sending | Open | Contact/submission email not functioning |
| Event data not propagating | Open | Some event data not appearing in rendered pages |
| Photo binaries in git | Open | `git rm --cached` needed to remove committed photo binaries from git tracking |
| Non-D Company soldiers in roster | Open | Fanning, Jeffries, Colburn, Stanfield, and others are not D Company soldiers but currently live in the soldier directory alongside D Company profiles. Roster display needs a way to separate or classify these (e.g., `affiliation: flight-crew`, `affiliation: battalion`, etc.). Stanfield specifically was associated with the April 24, 1971 flight, not a D Company member. |

---

## 5. Security & Deployment Constraints

- **PII policy:** `_private/contacts.json` (gitignored) holds phone/email/address for living contacts. NEVER commit PII to any `.md` file. Army-era service IDs are real SSNs — never publish.
- **Git pushes:** Use GitHub Desktop only. Terminal pushes fail — `msm-illumia` account lacks push access to `authormsmiller/d281staircav`.
- **R2 storage buckets:** `angryskipperarchive-photos`, `angryskipperarchive-documents`, `angryskipperarchive-submissions`
- **Deploy:** Cloudflare Pages; automatic on push to main

---

## 6. Site Architecture Reference

```
site/
  soldiers/[slug]/[slug].md        — Soldier profiles (YAML only, no prose body)
  documents/[author]/[slug]/index.md — Document pages (YAML + prose)
  events/[slug]/index.md           — Event records
  _docs/locations/                 — Research notes (not published)
  _data/                           — JS/JSON data files
  _private/contacts.json           — Gitignored PII
```

**Soldier profile key fields:** `name`, `nickname`, `rank`, `mos`, `platoon`, `status`, `birth_year`, `hometown`, `arrived`, `departed`, `kia_date` (if applicable), `service_record`, `bio` (short), `timeline` (array), `documents` (array), `relationships` (array)

**Timeline entry fields:** `date`, `title`, `detail`, `source`, `phase` (pre-service | training | staging | in-country | post-service)

**Document frontmatter key fields:** `layout`, `permalink`, `slug`, `title`, `author`, `event`, `date`, `date_known`, `type`, `status`, `access`, `contains`, `tagged`, `source_note`

---

## 7. Where Things Live

| Resource | Path / URL |
|---|---|
| Project root | `/sessions/.../mnt/d281staircav/` |
| Archive (outputs) | `/sessions/.../mnt/Archive/` |
| Knowledge base | `/sessions/.../mnt/.projects/019de3d7.../` |
| Kint VHP interview | https://www.youtube.com/watch?v=ihaGJZqxUYE |
| Site repo | authormsmiller/d281staircav (GitHub) |
| Kint soldier profile | `site/soldiers/kint-joe/kint-joe.md` |
| Kint biography doc | `site/documents/kint-joe/kint-joe-biography/index.md` |
| Kint VHP doc record | `site/documents/kint-joe/kint-joe-vhp-interview/index.md` |
| FSB Donna notes | `site/_docs/locations/fsb-donna.md` |
| FSB Fontaine notes | `site/_docs/locations/fsb-fontaine.md` |
