# Session Handoff — 2026-07-16
**Session 100**
**Theme:** Positive-ID'd two more names out of the Skipper Journal ("Grannamann" and
the company's own namesake), built full profiles for both, and caught a build-breaking
bug along the way that had likely been silently killing every local build since one of
tonight's source files was added.

---

## What was completed this session

### Part 1 — CPT Rodney Grannemann (D Co CO, 24 May–8 Jun 1968)

Michael positively ID'd the Skipper Journal's "CPT Grannamann" (D Company command
element, co-briefing COL Stannard on 8 Jun 1968 alongside LTC Gibney) as **Rodney Floyd
Grannemann**, via his Silver Star citation (Hq, 1st Cav Div, General Orders No. 3649,
22 Jun 1968), which names him "Company Commander of Company D, 2d Battalion
(Airmobile), 8th Cavalry Regiment" for gallantry on 24 May 1968 — two weeks before the
journal entry, same unit and command role. Built:

- `soldiers/grannemann-rodney/grannemann-rodney.md` — full profile (status:
  researching). Rank shown as CPT (his rank at D Co command; retired full Colonel,
  1984, per Hall of Valor). Timeline: the 24 May 1968 Silver Star action, and the
  8 Jun 1968 command visit alongside Stannard/Gibney.
- `soldiers/grannemann-rodney/photos/profile/` — in-country candid photo, **courtesy
  of Jim Garvin** (credit added after Michael supplied it; initially flagged unsourced).
- `soldiers/grannemann-rodney/documents/` — Hall of Valor Silver Star citation page
  (raw HTML saved).
- Corrected `sources/dj/1968/skipper-journal-jun-jul-1968.digest.json` (personnel +
  event entries) and `.review.md` (Pass 5) — same pattern as the Stannard "COL
  Standard" fix from Session 99.

### Part 2 — CPT Edison Scholes ("Angry Skipper 6") — the company's namesake

Michael flagged that Scholes is the person who **indirectly gave the company — and
this archive — its name**. Per his obituary: he "earned the nickname Angry Skipper 6
from his commander in the 1st Cavalry Division due to his prickly disposition and
immense desire to keep his men safe. The Angry Skipper Association survives today,
representing the soldiers who served from 1968 through 1972, based on Ed's insistence
to live by this creed." Built:

- `soldiers/scholes-edison/scholes-edison.md` — full profile (status: veteran).
  Commanded D Co, 2/8 Cav (as "Angry Skipper 6") + S-3, 1/12 Cav, 1967-68 (1st
  Vietnam tour); Senior Advisor, I Corps Ranger Command (ARVN), 1970-71 (2nd tour);
  35-year career culminating in Major General, Deputy Commanding General XVIII
  Airborne Corps. Silver Star, Legion of Merit, multiple Bronze Stars, 2 Purple
  Hearts, 6 Air Medals, etc. Died 23 Oct 2024, Franklin, TN, age 85.
  **The "Angry Skipper" naming story is placed front-and-center in his own service
  timeline and the D Co command assignment notes — not buried in admin notes only —
  per Michael's explicit request.**
- Three source documents copied into `soldiers/scholes-edison/documents/`: Dignity
  Memorial obituary, Special Forces Green Beret Memorial career bio, Marquis Who's
  Who press release.
- `soldiers/scholes-edison/photos/profile/` — in-country photo, credit not yet
  supplied (flagged generically, same as Grannemann's was before Michael provided
  Jim Garvin's name — worth asking about this one too).
- Noted in admin notes: Scholes (Angry Skipper 6, 1967-68) and Grannemann (Skipper 6,
  May-Jun 1968) were likely back-to-back or near-back-to-back D Co commanders; exact
  handoff date not yet sourced — worth a cross-link once confirmed.

### Part 3 — Build-breaking bug found and fixed

`npm run build` failed completely ("Wrote 0 files") right after Scholes's documents
were added. Root cause: **Eleventy templates every `.html` file in the whole site
(`templateFormats: ["njk","md","html"]`, `htmlTemplateEngine: "njk"`), including raw
scraped source snapshots under any `documents/` folder.** The Dignity Memorial
obituary page contains 19 literal `{#` sequences (likely from an embedded
Handlebars-style widget template), which Nunjucks tried to parse as its own comment
syntax and failed on — silently breaking the *entire* site build, not just Scholes's
page. Gibney's and Stannard's existing raw HTML docs had just gotten lucky by not
containing this pattern.

**Fix (`site/.eleventy.js`):** added `eleventyConfig.ignores.add("**/documents/**/*.html")`
so raw scraped HTML under any `documents/` folder (soldier-level or top-level
`site/documents/`) is never templated. Tried `addPassthroughCopy` alongside it to keep
these files servable at the same path, but that hit a Windows `EPERM` unlink error on
an existing file (`documents/unit/vhpa-042471-report/710424101ACD.html`) — same class
of issue already documented for `assets/` passthrough in this repo. Removed the
passthrough call; raw documents are excluded from templating but not auto-copied
(matches the existing `assets/` convention of manual copying). **Verified: clean
rebuild, 579 files, zero errors**, both new profiles present and correctly rendered.

**Also re-hit the recurring stale-bash-mount-truncation bug** (documented in Sessions
98–99) twice on `.eleventy.js` itself while fixing this — `node -c` saw a truncated,
syntactically-broken file right after an Edit-tool write, while the Read tool showed
it complete and correct. Fixed both times with the now-standard workaround: rewrite
the file via a bash heredoc (forces the stale mount to resync) instead of trusting
Edit-tool + bash/node read. **Third+ occurrence of this bug on a different file each
time (`kia.json`, `.eleventy.js` twice this session, `.eleventy.js`/Skipper Journal
digest last session) — treat this as a standing hazard for any large Edit-tool write,
not a one-off.**

### Part 4 — Discovered the `documents:` front-matter field may be inert

While tracing the build bug, found that the soldier `.md` front-matter `documents:`
block (the rich inline-object format used for Gibney, and now Grannemann/Scholes) is
**not actually read by `soldier.njk`'s Documents tab**. The tab is driven entirely by
`documentsBySlug[slug]`, itself built by `_data/_crawlDocuments.js` scanning
**top-level** `site/documents/<slug>/<docSlug>/{docSlug or index}.md` files (front
matter: `layout: layouts/document.njk`, `contains:`/`author:`/`tagged:`, `status:
published`, etc. — see `site/documents/stannard-john/peters-vern-account/index.md`
for a working example). Stannard's own `documents:` field uses a *plain slug-list*
format that matches this real system; Gibney's (and now Grannemann's/Scholes's) rich
inline-object format does not correspond to anything the template reads.

**Net effect: none of Gibney's, Grannemann's, or Scholes's attached source documents
currently show up in their profile's "Documents" tab on the live site**, even though
the raw files are saved in the repo and referenced in front matter. Fixing this
properly means creating real `site/documents/<slug>/<docSlug>/index.md` records (like
Stannard's) for each — not done this session due to time; flagged here as the most
concrete next-session task.

### Part 5 — Deploy/git state clarified

Confirmed the live site (angryskipperarchive.org, via Cloudflare Worker +
`site/wrangler.jsonc`) is built locally (`npm run build` → `_site/`) then deployed
separately (presumably `wrangler deploy`) — not via any GitHub Actions auto-deploy.
The local `_site/` was stale from Jul 10–13, predating even Session 99's work, so
Gibney/Stannard weren't live either going into tonight. Git branch `admin/2026-05-27`
has ~1,300 uncommitted files (almost all pre-existing, unrelated to this session) and
is 4 commits ahead of its own remote — per Michael, **left untouched**; he'll handle
git himself. Tonight's fix is saved directly to disk, so his own build/deploy should
now pick up Grannemann, Scholes, and the digest corrections correctly.

---

## Pending / next priorities

1. **Build real `site/documents/` records** for Grannemann's, Scholes's (×3), and
   Gibney's source documents so they actually appear in each profile's Documents tab
   — follow the Stannard/`peters-vern-account` pattern (see Part 4 above). Also
   consider converting the soldier `.md` `documents:` field to the plain slug-list
   format to match, since the rich inline-object format renders nowhere.
2. **Scholes profile photo credit** — not yet supplied (same gap Grannemann's had
   before Michael named Jim Garvin). Worth asking.
3. **Grannemann/Scholes D Co command handoff date** — Scholes was "Angry Skipper 6"
   1967-68; Grannemann was "Skipper 6" by 24 May 1968. Exact transition date between
   them not sourced; cross-link the two profiles once it is.
4. **Grannemann's exact D Co command start/end dates** — only the 24 May–8 Jun 1968
   window is directly confirmed by two sources.
5. Standing items carried from Session 99 (still open, not touched this session):
   Gibney's hometown discrepancy (Oakdale NY vs. Clearwater FL); no in-country photo
   found for Gibney; "White Skull" identity (1st squad MG gunner); "Most Wanted"
   homepage section idea; the `operation-pershing-1967` "1st Brigade" framing
   correction; Nov 1967–Jan 1968 ORLL not yet pulled; WALLOWA standalone note; the
   May–Jun 1967 An Qui KIA lead.

---

## Key file locations

| Item | Path |
|---|---|
| Grannemann profile + photo + document | `soldiers/grannemann-rodney/` |
| Scholes profile + photo + 3 documents | `soldiers/scholes-edison/` |
| Skipper Journal digest/review (corrected again) | `sources/dj/1968/skipper-journal-jun-jul-1968.{digest.json,review.md}` |
| Eleventy config (documents/*.html excluded from templating) | `.eleventy.js` |
| Working example of the *real* Documents-tab system | `soldiers/stannard-john/documents:` field + `site/documents/stannard-john/peters-vern-account/index.md` |
| Documents crawler (reads `site/documents/**/*.md`, not soldier front matter) | `_data/_crawlDocuments.js`, `_data/documentsBySlug.js` |

---

## Carried-forward warnings

- **Every `.html` file anywhere under the site input is Nunjucks-templated by
  default** (`templateFormats` includes `"html"`, `htmlTemplateEngine: "njk"`). Any
  raw scraped/saved HTML dropped in as a source document is a landmine — if it
  contains a stray `{#`, `{%`, or unbalanced Nunjucks-like token (common in embedded
  third-party widget templates, e.g. Handlebars `{{#if}}`), the **entire site build
  silently produces zero files** with no other symptom. Now globally excluded via
  `.eleventy.js` (`ignores.add("**/documents/**/*.html")`) — but if raw HTML gets
  saved somewhere *outside* a `documents/` folder in the future, the same risk
  applies there too.
- **`addPassthroughCopy` is unreliable on this Windows-mounted repo** — hits `EPERM:
  operation not permitted, unlink` on existing files. This is why `assets/`
  passthrough was already disabled in favor of manual `xcopy`; now also true for any
  future attempt to passthrough-copy `documents/**/*.html`. Don't re-enable without
  a plan for the EPERM issue.
- **Stale-bash-mount-truncation is now a well-established, recurring hazard** — 5th+
  occurrence across Sessions 98–100, each time on a different file, always
  immediately after an Edit-tool write, always presenting as bash/node/python seeing
  a file truncated mid-token while the Read tool sees it complete and correct. Fix:
  rewrite the file via a bash heredoc (not Edit tool) when a script needs to
  read/execute/parse a file that was just edited; validate with the relevant parser
  (`node -c`, `json.load`, etc.) after the heredoc write, not before.
- **The soldier `.md` `documents:` front-matter field is decorative only** for at
  least the rich inline-object format (Gibney/Grannemann/Scholes) — it is not read by
  `soldier.njk`. Only Stannard's plain-slug-list format + matching top-level
  `site/documents/<slug>/<docSlug>/index.md` records actually render. Don't assume a
  soldier's attached documents are visible on the live site without checking this.
- **Live site build/deploy is manual and separate from git** — `_site/` is built
  locally via `npm run build`, then deployed (likely `wrangler deploy`) by Michael
  himself; nothing here auto-deploys from a git push. Git commits and live-site state
  can drift independently; don't assume one reflects the other.
- **Always check `_sessions/` handoffs before treating a source's findings as new** —
  still the standing process lesson (Sessions 98, 99, and now 100).
