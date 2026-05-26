# Session Handoff — 2026-05-22
**Repo:** `https://github.com/authormsmiller/d281staircav`
**Deploy:** `cd site && npm run build && npx wrangler deploy`
**Push:** GitHub Desktop only (terminal push lacks authormsmiller creds)

---

## What Was Completed This Session

### 1. Verbal Accounts Tab — Filter Bug Fixed
`site/_includes/layouts/soldier.njk`

The accounts tab was filtering `collections.anecdotes` by `anecdote.data.soldiers`, but all anecdote files use `contains`. Changed to `anecdote.data.contains`. No anecdotes were appearing on any profile before this fix.

### 2. Letters — New Collection and Tab Rewire
**`site/.eleventy.js`** — Added letters collection:
```js
eleventyConfig.addCollection("letters", function(collectionApi) {
  return collectionApi.getFilteredByGlob("./soldiers/*/letters/*.md");
});
```

**`site/_includes/layouts/soldier.njk`** — Letters tab now reads from `collections.letters` filtered by `contains` (same pattern as anecdotes), replacing the old `documentsBySlug` path. Link target uses `letter.data.permalink`.

**Convention established:** Letters live at `site/soldiers/[slug]/letters/[slug-letter-YYYYMMDD].md`. Flat files, no subdirectory per letter. Front matter fields: `layout`, `slug`, `title`, `type: letter`, `author`, `doc_date`, `date_known`, `recipient`, `source`, `status`, `contains` (plain slug strings), `tagged`, `permalink`. Body: transcription followed by archivist notes.

### 3. Three Letter Files Created for Marvin
`site/soldiers/miller-marvin-dale/letters/`

- `miller-marvin-dale-letter-19710522.md` — "There Isn't Much Going On Over Here" — 22 May 1971. First letter after the April 20 contact. No reference to the deaths; reads as deliberate protection of his mother.
- `miller-marvin-dale-letter-19710824.md` — "Mothers Are About the Only Really Consistent Writers" — 24 Aug 1971. Most detailed account of his photography operation and the COD/greenbacks logistics.
- `miller-marvin-dale-letter-19710903.md` — "The Days Keep Chugging By" — 3 Sep 1971. Primary source for the FSB Jeffreys move. Short-timer psychology. Birthday mention.

### 4. Two Draft Anecdotes Published
- `site/anecdotes/miller-marvin-dale/romani-testimony/index.md` — `status: draft` → `published`
- `site/anecdotes/miller-marvin-dale/platoon-names/index.md` — `status: draft` → `published`

Verbal Accounts tab on Marvin's profile now surfaces all three anecdotes: Claymore Incident, Lt. Val Romani on SGT Marvin Miller, The Platoon Names.

### 5. External Resources Tab Hidden
`site/_includes/layouts/soldier.njk` — Added `style="display:none"` to the External Resources tab button. No data system exists behind it. Easy to restore when a use case is defined.

### 6. Served Alongside — Hybrid Display (Bubbles + Rows)
**Design rationale:** Tier 1 (evidence-based, squad-level, ~30 max) stays as bubble grid — faces matter when people co-appear in photos and documents. Tier 2 (platoon, ~60) and Tier 3 (company, ~140-200) switch to row lists because rank, role, and context notes are more useful than faces at that scale. Tier 3 is collapsed by default.

**`site/_data/alongside.js`** — Refactored `t2Entries` and `t3Entries` from `Set<slug>` to `Map<slug, { notes }>`. Notes are directional — they attach to the soldier whose `_alongside.json` defined them, so the note appears on their profile only. The reverse link (other soldier's view) carries no note unless that soldier has their own `_alongside.json` entry.

**`site/_includes/layouts/soldier.njk`** — Tier 2 and 3 sections replaced with `.alongside-row-list`. Each row: 36px avatar, rank + name, platoon/role, optional notes line. Tier 3 `<details>` has no `open` attribute.

**`site/assets/css/main.css`** — Added: `.alongside-row-list`, `.alongside-row`, `.alongside-row-avatar`, `.alongside-row-info`, `.alongside-row-name` (hover: `--y2`), `.alongside-row-meta`, `.alongside-row-note` (truncated, 0.63rem).

### 7. Neal and Kutter Added to Marvin's Alongside
`site/soldiers/miller-marvin-dale/_alongside.json`

```json
{
  "slug": "neal-bill",
  "basis": "company-co",
  "notes": "CPT Neal commanded D Company from before Miller's arrival in December 1970 through approximately July–August 1971 — covering the April 20 contact north of FSB Fanning and the April 24 Huey crash at FSB Fontaine. Miller served as an E4 specialist under Neal's command for the majority of that period."
},
{
  "slug": "kutter-wolf",
  "basis": "company-co",
  "notes": "CPT Kutter succeeded Neal as D Company CO in approximately July–August 1971. Miller was promoted to E-5 squad leader on August 4, 1971 — the same transition period. As a squad leader, Miller would have briefed Kutter directly when the CP traveled with Cat Platoon on Combat Assaults. Kutter commanded the company through the remainder of Miller's tour, ending December 2, 1971."
}
```

**Basis convention established:** `"company-co"` is distinct from `"same-company"` — it identifies a specific command relationship rather than general unit membership, which would otherwise imply everyone in D Company during overlapping dates belongs in Tier 3.

---

## Tomorrow — Immediate Tasks

### 1. Commit Everything
All session changes are uncommitted. Commit via GitHub Desktop with a clear message covering the session's scope: letters system, alongside hybrid display, anecdote filter fix.

### 2. Create MVP Branch
After commit, create a branch (e.g. `mvp-freeze` or `v0.1-beta`) from the current state. This is a code-freeze preservation point — the site as it exists when it goes to the beta group. Future feature work branches off main; the MVP branch is never touched except for critical hotfixes.

### 3. Live Site / Feature Branch Strategy
Discussion item: how to develop new features without touching the live site. Options to evaluate:
- **Branch-based preview deploys** — Wrangler supports deploying to named environments. A `dev` Worker environment can serve a feature branch build at a separate URL (e.g. `dev.angryskipperarchive.org`) while `production` stays on main.
- **Environment config in `wrangler.jsonc`** — Add a `[env.dev]` block pointing to a separate Worker name and R2 binding if needed.
- The build command stays the same; only the deploy target changes.

---

## Outstanding Bugs (Carried Forward)

- **SITE-BUG-20260518000026** — Hero photo path. `soldier.njk` lines 30 and 32 still build `_heroPhotoSrc` as `/soldiers/[slug]/photos/profile/[filename]`. Photos served from R2 at `/media/photos/soldiers/[slug]/profile/[filename]`. Profile photos broken for all soldiers flushed to R2. Fix: update both lines to use `/media/photos/` prefix.
- **SITE-BUG-20260518000025** — Lightbox index offset. `loop.index0` resets to 0 between Gallery 1 and Gallery 2. Gallery 2 photos open wrong slide.
- **Contact request live test** — Modal built, no soldier has `family_contact: true` yet. Set one soldier, deploy, submit test to confirm R2 write and email.
- **Contribute form email** — `handleContribute()` in `worker.js` has a placeholder comment for email (`// Email (thank-you on isNew) — wired in INFRA-TASK-067`); call never fires.
- **`git rm --cached` on committed photo binaries** — Images excluded going forward but already-committed binaries still tracked. PowerShell command from Session-2026-05-21-Afternoon-Handoff.md.

---

## Beta Group

Outreach ready — all four have existing phone relationships.

| Name | Role | Notes |
|------|------|-------|
| Kirk Davis | Veteran, professional designer | Has written accounts in archive (`davis-kirk-account-042071`, `davis-kirk-essay-19710600`). Will see his own contributions rendered. Also the natural choice for cover design on Path 2 books — potentially at minimal or no cost. |
| Ken Weaver | Veteran | Connected to photo index; Tier 1 connection to Miller noted in prior session. Photo-centric perspective. |
| Jim Garvin | Veteran | Has account in archive (`garvin-james-account-042471`). Same dynamic as Davis — will see his words in context. |
| Robin Woo | TBD | Relationship and role TBD. |

**For beta outreach:** Give them specific things to look at rather than "take a look." Marvin's profile is the full example — all tabs populated. Ask them to look at their own profiles and tell you what's wrong or missing. Give explicit permission to say if something *feels* wrong, not just if it's technically broken.

---

## Product Roadmap — Discussed This Session

### Path 1: Build My Album
Personal photo curation tool. A veteran or family member selects photos from the archive (their own + any others they want) and downloads a curated photo collection — likely a PDF laid out as a photo book, or a clean ZIP. The selection UI is the main build; generation is relatively straightforward. Intended for living veterans who want a personal copy of their own materials.

### Path 2: Build My Book
Compiled soldier keepsake in ePub format, printable via Amazon KDP.

**Editorial model:** Monthly narrative sections (one per month of service) provide unit-level context. As data accumulates, writing these becomes more "connecting dots" than "filling blanks." Howard McGrew is a primary source for 1971; other years will require more inferential editorial work. The narrative sections are write-once, serve-many — every soldier whose service window includes that month gets it in their book.

**Book structure (proposed):**
- Front matter: soldier profile/bio, service summary
- Body (chronological): for each month in service window — narrative section, events, photos, documents
- Back matter: letters, anecdotes/verbal accounts, service record, served alongside

**Workflow:**
1. Request comes in (personal channel for now; public form as site matures)
2. Content assessment: rich data → auto-compile draft epub, email with "draft" note; sparse data → contact requester for materials, or send unit-history-focused epub
3. Incorporate feedback/additional materials → polished version
4. Cover design: basic system-generated cover included; Kirk Davis available for professional covers
5. KDP instructions/assistance for print-on-demand

**Build to KDP spec from the start** — trim size, margins, image resolution, metadata structure. Retrofitting later costs a revision cycle.

---

## Mission Context

> *"The whole goal of the site is being the guardian of the history — not just the unit, but the soldier — to honor my father's service by trying to give other families the same thing I've been looking for: a collection of information about their loved one that can be passed to the generations who will never know them."*

For the veterans themselves, the archive and the book it produces is the welcome home they never received. Many feel Americans have been misled by the dominant narrative of the past 50 years. The archive doesn't argue that case — it presents the record honestly and completely, and lets it speak.

Larry Fishell lost nearly all of his Vietnam materials in a house fire 15–20 years ago. He doesn't know this archive exists. When he receives a book compiled from what the archive already has on him — photos, accounts, the events of his service period — that moment is the proof of concept for everything the site is trying to do.

The beta group will feel the weight of this. Be ready for that.
