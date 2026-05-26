# Session 45 Handoff — d281staircav

**Date:** 2026-05-26
**Branch:** `admin/2026-05-22` (continuing)
**Repo:** `https://github.com/authormsmiller/d281staircav`
**Deploy:** `npx wrangler deploy` from `site/`. Push via GitHub Desktop only — terminal pushes fail (msm-illumia account lacks push access to authormsmiller/d281staircav).

---

## What Was Completed This Session

### Tincher-Dale — Profile Sanity Check + Photo Pipeline

Profile rebuilt from sparse stub to canonical template standard:

- `service_record.assignments` added: Battalion S-1 (primary duty) + Cat Platoon Leader (Cat 6, brief; exact dates unknown)
- `induction.status: commissioned`
- `profile_photo: tincher-dale-profile.png` wired up
- `last_updated: 2026-05-26`

**`site/soldiers/tincher-dale/photos/field/index.md`** — fully rewritten after discovering new photos had been placed after the closing `---` (invisible to YAML parser). Now contains 9 confirmed entries:
`alloway-romani-hurst.jpg`, `alloway-tincher.png`, `cortinas-degraff-ennis.png`, `davis-by-tincher.png`, `degraff-monkey.png`, `garvin-by-tincher.png`, `marr-bassford-hurst-tincher.png`, `murray-lynn.jpg`, `tincher-s1.png`

**`site/soldiers/tincher-dale/photos/profile/index.md`** — created for `tincher-dale-profile.png`.

---

### Platoon Normalization — ~25 Soldier Files

All `platoon:` values normalized to short names (Cat / Range / Skull / HQ). Key files:

| Short Name | Soldiers Updated |
|---|---|
| Cat | alloway-denny, cate-larry, fishell-larry, miller-marvin-dale, romani-val, sells-leroy, small-bill, tincher-dale, weaver-ken |
| Range | blais-dizzy, bott-bill, brothers-harvey, cardwell-james, collins-gary, davis-kirk, dillon-stan, drinkard-danny, guidara-frank, hall-joseph, harrington-william, hilts-doug, makowski-william, marr-bill, sargent-stan, schneck-steve, vollmar-tom, garvin-jim |
| HQ | neal-bill |

---

### Bug Fixes

**garvin-jim.md YAML error** — doubled double-quotes on document title (`""I Watched...""`). Fixed to `'"I Watched..."'` (single-quote outer wrap).

**soldier.njk — hero photo path** (resolves SITE-BUG-20260518000026):
- Removed spurious `Then & Now` caption div
- Fixed hero `<img>` src: `/soldiers/[slug]/photos/profile/` → `/media/photos/soldiers/[slug]/profile/`

**event.njk — empty src on event photos**:
- Template used `img.src` but data only has `img.filename` + `img.credit_slug`
- Added computed `_evtImgSrc` Nunjucks variable in both JS slides array and HTML fallback

**chieu-hoi-fsb-fontaine-1971-05 event photo**:
- Wrong filename (`HLMVietnam1971_0147positiveEdit.jpg` → `vc-prisoner-retouch.jpg`)
- Event photos stored flat (no event-slug subfolder) — added explicit `src:` field to event index.md as authoritative path

---

### Ice Cream / Sniper Anecdote — Published

**`site/anecdotes/cate-larry/ice-cream-culvert/index.md`** — created and published.

- `archive_id: MDM-ANECDOTE-CULVERT`
- `slug: ice-cream-culvert`
- Author: Larry Cate; contains: cate-larry, miller-marvin-dale
- CO order confirmed: Bedsole → Neal → Kutter (corrected in body text)
- Date: `"1971-07"` (quoted string — day `00` fails YAML timestamp parsing)
- Three editorial draft notes removed; text otherwise verbatim from Cate's account

---

### Garvin Memorial Speech — Published

**`site/documents/garvin-james/garvin-james-one-mans-story-colburn/index.md`** — created.

- Title: "Richard Colburn — One Man's Story"
- type: address; author: garvin-jim; event: memorial-colburn-2021; status: published
- New facts in `source_note`: W.J. Brooks (27th Maintenance Bn) as previously undocumented crash survivor; 35th Inf vs 4th Division discrepancy preserved

---

### Kutter Commemoration — Published

**`site/documents/kutter-wolf/kutter-wolf-commemoration-colburn-2021/index.md`** — created.

- Title: "Commemoration of Sergeant Richard Eugene Colburn"
- type: address; author: kutter-wolf; event: memorial-colburn-2021; status: published
- contains: kutter-wolf, colburn-richard, garvin-jim; tagged: fanning-martin
- `source_note` flags all confirmed biographical/service facts: MOS 76Y40, Echo Recon CIB, 1/35th Inf / 4th Inf Div, 124th Signal BN, Germany posting, 2/12 Cav → 2/8 Cav transfer on 26 Mar 1971, FSB Fontaine location (SE of Xuan Loc, Highway 1, Long Khanh Province)

**`site/events/memorial-colburn-2021/index.md`** — updated to include both documents in `documents:` list.

---

### Colburn-Richard — Extensively Updated (Session Focal Point)

This is the most complete soldier profile in the archive. Changes this session:

| Field | Before | After |
|---|---|---|
| `mos` | `45B · Unit Armorer` (inferred) | `76Y40 · Unit Supply Sergeant` (confirmed — Kutter) |
| `profile_photo` | blank | `colburn-richard-profile.jpg` |
| `bio` | (field did not exist) | New paragraph — high school, hometown, age at death |
| `decorations` | NDSM, VSM, VCM | + CIB (moved from unconfirmed; confirmed via Kutter) |
| `decorations_unconfirmed` | PUC, VGC, CIB | PUC, VGC (CIB removed) |
| `service_record.induction.date` | blank | `"1968"` |
| `service_record.assignments` | empty | 5 assignments: Echo Recon → 124th Signal → Germany → 2/12 Cav → 2/8 Cav |
| `timeline` | 1 entry (crash) | 6 entries: first tour → Signal BN → Germany → second tour → 2/8 Cav transfer → crash |
| `documents` | 1 (Garvin) | 2 (Garvin + Kutter) |
| `photo_intro` | "Photographs pending." | VVMF credit line |
| `last_updated` | 2026-05-22 | 2026-05-26 |

**SSN removed** — "Service ID: 063429135" was in notes; removed. Army used real SSNs as service IDs in this era — do not republish.

**`bio:` field policy established** — KIA/DOW/MIA soldiers may receive a `bio:` block in frontmatter. Field is not yet rendered by templates; it is data-forward pending future template support. Colburn is the first populated example. Other KIA profiles should be populated when biographical material exists.

**Phase fix** — Germany/re-enlistment timeline entry had `phase: post-service` (wrong — still active duty between tours). Corrected to `phase: staging`.

---

### Colburn — Remaining Open Items

- **Burial location** — `current_location:` is blank. He is not buried at VFW Hinsdale (that was the memorial venue). Research needed.
- **`brothers:`** — Fanning and Jeffries died in the same crash. Garvin is the closest living connection. Convention not yet established for who qualifies.
- **`_private/contacts.json`** — Casualty notification names parents: Mr. & Mrs. Lyell J. Colburn, 565 Morton Road, Hamlin, NY 14464. Garvin's speech confirms he hugged Colburn's sister at the 2021 memorial. Sister may be reachable through Garvin.

---

## Key Research Findings (Session)

### 35th Infantry / 4th Division Discrepancy — Resolved
Garvin's two accounts contradicted each other (35th Infantry vs 4th Division). Kutter's speech resolves it: the unit was 1st Battalion, 35th Infantry **Regiment**, which was part of the 4th Infantry Division. Both descriptions were correct from different angles. No error in either account.

### Colburn's MOS — Confirmed
Official MOS was 76Y40 (Unit Supply Sergeant). He performed armorer duties by knowledge and reputation — but his official role was supply. The 45B inference in Session 44 was wrong.

### CIB — Confirmed Legitimate
Previous concern that CIB was an Honor States algorithm error (unusual for an HQ unit soldier). Kutter's speech resolves it: CIB was earned on the first tour with Echo Recon, 1/35th Infantry — a legitimate combat infantry assignment. Not an error.

### Casualty Notification Document (Photo Uploaded This Session)
User photographed the TAGO casualty notification (declassified). Key contents:
- Confirms SGT Richard **I.** Colburn (middle initial I on form — almost certainly a clerical error; Eugene confirmed by obituary and memorial service documents)
- Organization: 2nd Bn, 8th Cav, 1st Cav Div, APO SF 96490
- Date of Casualty: 24 Apr 71
- Next of kin: Mr. & Mrs. Lyell J. Colburn, 565 Morton Road, Hamlin, NY 14464 (parents) — contacts.json only
- Children: None (Single)
- Signed by Donald I. Goke, Colonel, Casualty Officer, TAGO

---

## Pending Work

### Priority
- **jeffries-gabriel** — Full KIA profile build. WO1, co-pilot, killed 24 Apr 1971 in FSB Fontaine crash. VHPA: `https://www.vhpa.org/KIA/incident/710424101ACD.HTM`. Panel 03W likely near Fanning/Colburn.
- **W.J. Brooks stub** — 27th Maintenance Battalion; passenger on 69-15692; survived. No profile exists. Identified in Garvin's speech.
- **Fanning profile photo** — formal Army dress portrait (B&W) still pending. Drop into `_intake/raw/photos/`, process through admin pipeline, `dest: profile`.

### Schema / Template
- **`bio:` field rendering** — Field is populated on Colburn. Wire up in soldier.njk for KIA/DOW/MIA profiles when a few are populated enough to merit the section.
- **`nbd` status value** — Consider adding `nbd` (non-battle death) as a `status` variant for Wall-inscribed soldiers killed in non-hostile incidents (Fanning, Colburn). Currently using `kia`. Not blocking.

### Remaining Migration Targets

| Slug | Notes |
|---|---|
| fishell-larry | nickname: Pops |
| fults-john | nickname: Peanut |
| guidara-frank | |
| hall-joseph | |
| harrington-william | |
| hilts-doug | |
| **jeffries-gabriel** | **Priority — full KIA build** |
| kint-joe | |
| marr-bill | |
| neal-bill | |
| rosenberg-kenneth | |
| sargent-stan | |
| schneck-steve | |
| small-bill | |
| **stanfield-nathan** | On crash flight as door gunner; survived |
| vitucci-stephen | |
| vollmar-tom | |

Groups 3 & 4 (hurst-style + miller contact-block) still pending from Session 44.

### Chieu-Hoi Event Photos
Two additional photos of the chieu-hoi event exist; user believes one may be Kirk Davis's. Attribution still to be confirmed. Intake pending.

---

## Carry-Forward (From Sessions 43–44)

1. **`git rm --cached`** — remove committed photo binaries from git tracking (command in Session 43 handoff)
2. **Lightbox index offset** (`SITE-BUG-20260518000025`) — flat index map needed
3. **Event slug `[]` literal bug** (`ADMIN-BUG-20260518000022`)
4. **Fuzzy match scorer** (`ADMIN-BUG-20260518000024`) — Levenshtein needed
5. **Missing soldier stubs** — caruthers-tom, kinsey-charles, ryneska-john, kahnke-steve, martin-michael, mcgrew-harold, bedsole-jim, louisell
6. **Tab 5 (Todo/Flags)** — fully spec'd in Session 32 handoff, not yet built
7. **Email sending** (`INFRA-TASK-20260518000067`) — thank-you + continuation link via MailChannels/Resend
8. **Event data not propagating to index.md** (`ADMIN-BUG-20260518111112324`)
9. **davis-kirk** — full canonical template migration still needed (missing layout, permalink, tags, post-service block, etc.)

---

## Architecture Notes

**CRLF** — repo built on Windows, all files use `\r\n`.

**R2 key format** — `soldiers/[slug]/[subfolder]/[filename]` (no `photos/` segment). Served at `/media/photos/soldiers/[slug]/[subfolder]/[filename]`.

**Event photos** — stored flat at `soldiers/[credit_slug]/field/events/[filename]` (no event-slug subfolder). Use explicit `src:` field in event index.md rather than relying on template path construction.

**Photo pipeline** — files go to `_intake/raw/photos/[Name-MMDDYY-HHMMSS]/`, staged via admin UI, flushed to R2 + index.md. WebP fully supported.

**Deployment** — `npx wrangler deploy` from `site/`. Push via GitHub Desktop only.

**Admin server** — `npm start` from `admin/`. Requires `.env` with `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `CLOUDFLARE_ACCOUNT_ID`.

**R2 buckets:**
- `angryskipperarchive-photos` — public media, served at `/media/photos/`
- `angryskipperarchive-documents` — documents
- `angryskipperarchive-submissions` — public form submissions, private

**`_private/contacts.json`** — gitignored; holds phone/email/address for living contacts. NEVER commit PII to .md files. Army-era service IDs are real SSNs — do not publish in any field.
