# Session 44 Handoff — d281staircav

**Date:** 2026-05-22
**Branch:** `admin/2026-05-22`
**Repo:** `https://github.com/authormsmiller/d281staircav`
**Deploy:** `npx wrangler deploy` from `site/`. Push via GitHub Desktop only — terminal pushes fail (msm-illumia account lacks push access to authormsmiller/d281staircav).

---

## What Was Completed This Session

### Canonical Soldier Profile Template — Created

`site/soldiers/_template.md` written as the gold-standard schema. All future profiles and migrations use this file as the reference.

Key design decisions baked in:
- Section comment headers (`# ── IDENTITY ──`) for readability
- `decorations_unconfirmed:` field for documented-but-unsourced awards (distinct from confirmed `decorations:`)
- `share_contact: false` + `contact:` block replaces old `family_contact:` field — PII (phone/email/address) lives in `_private/contacts.json` (gitignored), NEVER in .md files
- `service_record.induction.status` values: `drafted | enlisted | ra | commissioned`
- `timeline` entries require `phase:` (training | staging | in-country | post-service) and `type:`
- `links.wall:` for VVMF Wall of Faces URL (KIA/MIA only); `links.other:` for obituaries, Honor States, VHPA, etc.

---

### Schema Migration — Group 1 (10 of ~26 files completed)

All files migrated to canonical template format. Files touched this session:

| Slug | Rank | Status | Notes |
|---|---|---|---|
| tincher-dale | LT | veteran | Rebuilt from 9-field stub; platoon: Cat |
| blagg-thomas | LTC | researching | profile_photo: blagg-thomas-profile.jpg |
| blais-dizzy | SGT | veteran | Real first name Jean; nickname Dizzy; slug stays blais-dizzy; Purple Heart (distinguished) |
| bott-bill | LT | researching | Range Platoon |
| brothers-harvey | SP4 | veteran | mos: "91A · Combat Medic"; Range Platoon |
| cardwell-james | CPL | kia | KIA 20 Apr 1971; basic at Fort Lewis 1970; Purple Heart unconfirmed; Wall entry; timeline entry for April 20 contact |
| colburn-richard | SGT | kia | Extensively rebuilt — see below |
| collins-gary | PFC | veteran | nickname: Indian; Range Platoon |
| dillon-stan | SSG | veteran | Range Platoon Sgt; Purple Heart unconfirmed (severely wounded 20 Apr 1971); timeline entry |
| drinkard-danny | CPL | kia | KIA 20 Apr 1971; middle name George; Purple Heart unconfirmed; Wall entry; timeline entry |
| fanning-martin | CPT | kia | Extensively rebuilt — see below |

#### colburn-richard — Key Updates
- Rank corrected SP4 → **SGT** (E5), confirmed by VHPA incident record
- middle_name: Eugene; birth_year: 1950; hometown: Hamlin, Monroe County, NY
- arrived: 19 Dec 1970; departed: 24 Apr 1971
- cause_of_death: accident (non-hostile crash — no Purple Heart)
- service_record.induction.status: ra
- Unit: HQ Co., 2nd Bn., 8th Cavalry (passenger on 229th Aviation bird at time of crash)
- decorations: NDSM, VSM, VCM
- decorations_unconfirmed: PUC, Vietnam Gallantry Cross, CIB (all probability-based per Honor States — CIB likely error for HQ unit, verify)
- links.wall: Panel 3W, Line 7 — same panel/line as CPT Fanning
- links.other: VHPA incident, Rochester Vietnam Memorial, Honor States, Facebook memorial group
- related_events: crash-fsb-fontaine-1971-04-24
- Timeline: full VHPA crash account (engine failure, autorotation attempt, tree contact, roll)
- notes: McCoy thread — O2 CJ McCoy listed as survivor in VHPA record; his son Dusty McCoy posted tribute to Colburn's Facebook memorial on 53rd anniversary (April 24, 2024). Service ID: 063429135. VVMF photo URL in notes.

#### fanning-martin — Key Updates
- Rank: **CPT** (NOT CW2 — CW2 was an error in the original event file)
- middle_name: Vincent; birth_year: 1947; hometown: Albuquerque, NM
- arrived: 31 May 1970; departed: 24 Apr 1971
- cause_of_death: accident (non-hostile crash — no Purple Heart)
- mos: "Rotary Wing Aviator"; induction: commissioned (entered via Reserve Military — likely ROTC/OCS)
- decorations: NDSM, VSM, VCM
- decorations_unconfirmed: Army Aviator Badge (certain for rated pilot — awaiting primary source), PUC, Vietnam Gallantry Cross, CIB (likely Honor States error for aviation MOS — verify and remove)
- links.wall: Panel 03W, Line 7 — same as Colburn
- links.other: VVMF Wall of Faces, Honor States, The Virtual Wall, VHPA incident
- related_events: crash-fsb-fontaine-1971-04-24
- Timeline: full VHPA crash account naming WO1 Gabriel Jeffries as co-pilot and SGT Colburn as passenger
- notes: Service ID: 585263489. FSB renamed FSB Fanning in his honor. CIB flagged as likely Honor States algorithm error — not authorized for aviation MOS.
- **Profile photo:** User wants the formal Army dress portrait (black and white) as profile_photo. Photos are WebP format — intake via admin photo pipeline (`_intake/raw/photos/`). Suggested filename: `fanning-martin-profile.webp`. Wire up `profile_photo:` after flush.

---

### Event File Update — crash-fsb-fontaine-1971-04-24

`site/events/crash-fsb-fontaine-1971-04-24/index.md` updated:

- **Rank corrections:** Fanning CW2 → CPT; Jeffries CW2 → WO1 throughout (frontmatter, prose, context_note)
- **Jeffries full name:** Gabriel Augustus Jeffries Jr. added to casualties block
- **Colburn:** rank SGT + unit (HQ Co., 2nd Bn., 8th Cavalry) added to casualties block
- **Supporting unit:** corrected from "2/8 CAV Battalion Aviation" → "A Company, 229th Assault Helicopter Battalion, 1st Cavalry Division"
- **oq-02** (cause of crash): closed — `publish: false`, `resolved: true`, resolution text from VHPA
- **oq-04** (check VHPA): closed — resolved; NARA accident report still outstanding
- **Sources:** VHPA URL added (`https://www.vhpa.org/KIA/incident/710424101ACD.HTM`)
- **McCoy thread:** added as `mccoy_thread` field in archivist_notes
- **last_updated:** 2026-05-22

---

## Key Research Findings (Session)

### Jeffries-Gabriel — KIA, Newly Confirmed
Previously an unknown stub. VHPA incident record 710424101ACD confirms:
- **Full name:** Gabriel Augustus Jeffries Jr.
- **Rank:** WO1
- **Role:** Co-pilot, UH-1H 69-15692
- **Date:** 24 Apr 1971
- **Status:** KIA (killed in crash at FSB Fontaine)
- Needs a full KIA profile build — next priority after current migration batch

### Stanfield-Nathan — Confirmed on Crash Flight
Existing stub. VHPA record confirms Nathan Stanfield was door gunner aboard 69-15692. Survived with wounds. Note should be added to his profile when it's migrated.

### McCoy Thread
VHPA incident record lists O2 CJ McCoy as a survivor aboard 69-15692. His son Dusty McCoy posted a tribute to Colburn's Facebook memorial group on April 24, 2024 (53rd anniversary), confirming his father was a passenger who survived. Potential living contact — thread should be pursued when creating Colburn's public page.

### Decorations Policy (Established This Session)
- **Wound/death documented in accounts** → `decorations_unconfirmed: Purple Heart`
- **Primary source document confirms** → `decorations: Purple Heart`
- **Non-hostile death** (Fanning, Colburn — aviation accident) → NO Purple Heart, regardless of source
- CIB in Honor States `decorations_unconfirmed` for aviation or HQ unit soldiers is likely an algorithm error — flag and verify

---

## Pending Work (Immediate)

### Next Migration Targets
Group 1 still has ~16 files remaining:

| Slug | Notes |
|---|---|
| fishell-larry | nickname: Pops |
| fults-john | nickname: Peanut |
| guidara-frank | |
| hall-joseph | |
| harrington-william | |
| hilts-doug | |
| **jeffries-gabriel** | **Priority — full KIA build; WO1, co-pilot, 24 Apr 1971** |
| kint-joe | |
| marr-bill | |
| neal-bill | |
| rosenberg-kenneth | |
| sargent-stan | |
| schneck-steve | |
| small-bill | |
| **stanfield-nathan** | Note: on crash flight as door gunner, survived |
| vitucci-stephen | |
| vollmar-tom | |

**jeffries-gabriel should be the first file in the next session** — full KIA treatment, same depth as Fanning/Colburn. Known data:
- Rank: WO1
- Full name: Gabriel Augustus Jeffries Jr.
- Role: Co-pilot
- Date of death: 24 Apr 1971
- Cause: accident (non-hostile crash)
- Wall entry: likely — check VVMF. Panel/line will be near Fanning and Colburn (Panel 03W).
- VHPA incident: `https://www.vhpa.org/KIA/incident/710424101ACD.HTM`

### Other Pending Groups
- **Group 3** (hurst-style, 4 files): hurst-fred, alloway-denny, kutter-wolf, makowski-william
- **Group 4** (miller contact-block, 6 files): miller-marvin-dale, cate-larry, davis-kirk, romani-val, sells-leroy, weaver-ken
- **Group 2 verify** (3 files): bacon-wg, garvin-jim, woo-robin

### Template: Add `nbd` Status Value
`cause_of_death` or `status` should have a value for non-battle deaths. Currently using `accident` for cause_of_death and `kia` for status on Fanning/Colburn (appropriate — both are on the Wall). Consider adding `nbd` as a `status` variant for soldiers killed in non-hostile incidents who are on the Wall. Not blocking — note for schema review.

---

## Carry-Forward (From Session 43)

1. **`git rm --cached`** — remove committed photo binaries from git tracking (command in Session 43 handoff)
2. **Hero photo path bug** (`SITE-BUG-20260518000026`) — hero `<img>` src still uses `/soldiers/` not `/media/photos/soldiers/`
3. **Lightbox index offset** (`SITE-BUG-20260518000025`) — flat index map needed
4. **Event slug `[]` literal bug** (`ADMIN-BUG-20260518000022`)
5. **Fuzzy match scorer** (`ADMIN-BUG-20260518000024`) — Levenshtein needed
6. **Missing soldier stubs** — caruthers-tom, kinsey-charles, ryneska-john, kahnke-steve, martin-michael, mcgrew-harold, bedsole-jim, louisell
7. **Tab 5 (Todo/Flags)** — fully spec'd in Session 32 handoff, not yet built
8. **Email sending** (`INFRA-TASK-20260518000067`) — thank-you + continuation link via MailChannels/Resend
9. **Event data not propagating to index.md** (`ADMIN-BUG-20260518111112324`)
10. **Fanning profile photo** — 4 WebP files from Honor States; formal Army portrait = profile photo. Drop into `_intake/raw/photos/`, process through admin pipeline, `dest: profile` on flush.

---

## Architecture Notes

**CRLF** — repo built on Windows, all files use `\r\n`.

**R2 key format** — `soldiers/[slug]/[subfolder]/[filename]` (no `photos/` segment). Served at `/media/photos/soldiers/[slug]/[subfolder]/[filename]`.

**Photo pipeline** — files go to `_intake/raw/photos/[Name-MMDDYY-HHMMSS]/`, staged via admin UI, flushed to R2 + index.md. WebP fully supported.

**Soldier slug format** — `lastname-firstname` or `lastname-firstname-middlename`.

**Deployment** — `npx wrangler deploy` from `site/`. Push via GitHub Desktop only.

**Admin server** — `npm start` from `admin/`. Requires `.env` with `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `CLOUDFLARE_ACCOUNT_ID`.

**R2 buckets:**
- `angryskipperarchive-photos` — public media, served at `/media/photos/`
- `angryskipperarchive-documents` — documents
- `angryskipperarchive-submissions` — public form submissions, private

**_private/contacts.json** — gitignored; holds phone/email/address for living contacts. NEVER commit PII to .md files.
