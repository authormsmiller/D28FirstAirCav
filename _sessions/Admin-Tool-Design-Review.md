# Admin Tool — Design Review & Use-Case Catalog

**Date:** 2026-06-12
**Scope:** The local admin tool (`admin/server.js` + `admin/lib/*.js` + `admin/index.html`), reviewed against ~50 session/handoff notes in `_sessions/` and the live code.
**Goal of this document:** (1) capture the full set of use cases the tool serves today, (2) review the design and name the concrete problems, (3) decide what to refactor, and (4) identify which Claude-dependent tasks can become self-serve admin UI features so the tool no longer needs Cowork "to wire up a photo."

---

## 1. What the tool is today

A single-user, local-only Express app. No auth by design. It writes directly to the local git repo and to Cloudflare R2, and deploy stays manual (GitHub Desktop push + `wrangler deploy`).

| Piece | Size | Role |
|---|---|---|
| `server.js` | 814 lines | App entry; session/git routes + a block of soldier routes inline; mounts the lib route modules |
| `lib/*.js` (9 modules) | ~3,380 lines | Route modules: `photos`, `feedback`, `todo`, `add-record`, `proposals`, `submissions`, `soldiers`, plus helpers `frontmatter`, `records`, `session` |
| `index.html` | 7,181 lines / 276 KB | Entire frontend: ~1,700 lines inline CSS, ~3,350 lines inline JS across 6 `<script>` blocks, vanilla DOM, no framework |
| `data/todo.json` | — | Authoritative bug/feature list driving the Todo tab |

**Backend route count:** ~85 endpoints. **Frontend:** 6 tabs (Attach, Edit, Photos, New Profile, Todo, Feedback), ~245 JS functions, global per-feature state objects (`PH`, `TODO`, `NP`, `PHE`, `slugCache`, `currentRecord`).

The build history in `_sessions/` shows the tool grew reactively — each feature was triggered by a specific real bottleneck (garbage filenames from a phone upload → rename table; photos 404ing → flush-to-R2). The one deliberate consolidation was the New Profile tool (Sessions 52b–56). [Handoff-Admin-Design-Session52b.md, Handoff-Profile-Tool-Design-Session53.md]

---

## 2. Use-case catalog

This is the full set of use cases the tool covers, grouped by feature area. "State" is the honest current status from the notes and code.

### A. Session / git
| Use case | Endpoint(s) | State |
|---|---|---|
| Show current branch + pending change count | `GET /api/session` | Working |
| Auto-create a working branch | `ensureWorkingBranch()` | Working |
| Commit pending changes from the UI | `POST /api/session/commit` | **Unreliable — not trusted** (`ADMIN-BUG-...030`); push done in GitHub Desktop |
| Push branch | `POST /api/session/push` | Present, not trusted |

### B. Attach / Edit any record (generic frontmatter engine)
| Use case | Endpoint(s) | State |
|---|---|---|
| List slugs by type (soldier/document/event/anecdote) | `GET /api/slugs` | Working |
| Read a record's frontmatter | `GET /api/record` | Working |
| Attach a value to a field (scalar or array) | `POST /api/attach` | Working |
| Detach a value | `POST /api/detach` | Working |
| Edit a scalar field (dot-notation paths) | `POST /api/edit` | Working |
| Remove an item from an array field | `POST /api/remove-from-array` | Working |

### C. New Profile / Edit Profile (10-pane soldier tool)
| Use case | Endpoint(s) | State |
|---|---|---|
| Create a soldier stub from the full template + scaffold 4 folders | `POST /api/soldiers/create`, `/api/soldiers/check` | Working (route was silently unmounted until S35) |
| Edit identity/rank/service frontmatter | `/api/edit` | Working |
| **Import from KIA sites / FindAGrave** | — | **Never built** (designed S53) — still done via external skill |
| Set/upload profile photo | `POST /api/soldier/profile-photo` | Working |
| Set profile photo from an existing archive photo (find→crop→R2) | `POST /api/soldier/profile-photo/from-existing` | Working (built S55–56) |
| Create + attach a document stub | `POST /api/soldier/documents/create` | Working; **docx conversion never built** |
| Set induction; add/remove assignments | `/api/soldier/service-record/*` | Working |
| Decorations checklists + "Apply Base Set" | (client-side + `/api/edit`) | Working; broader presets deferred |
| Add/remove timeline entries (auto-sorted) | `/api/soldier/timeline/*` | Working; narrative text written manually by design |
| Manage `brothers[]` (Alongside) | `/api/edit` | Partial — **Tier 2/3 relationships not managed here** |
| External resources: `links.wall` + `links.other` | `/api/soldier/links/other/*` | Working |
| Contact: safe fields + private block to gitignored `_private/contacts.json` | `/api/private/contact` | Working |

### D. Photo intake pipeline
| Use case | Endpoint(s) | State |
|---|---|---|
| Pull public submissions from R2 into Raw | `lib/submissions.js`, `lib/feedback.js` | Working |
| Upload a folder of photos | `POST /api/photos/raw/upload` | Working |
| Rename garbage filenames before staging | (client + stage) | Working |
| Interactive drag-to-crop | `POST /api/photos/raw/crop` (sharp) | Working |
| Stage raw → soldier slug; revert; cancel | `POST /api/photos/raw/stage`, `DELETE /api/photos/staging/:slug` | Working |
| Per-photo metadata (routing, caption, credit, date, event, `contains`, `tagged`) | staging UI | Working |
| Atomic flush to R2 + write `index.md` (images never committed) | `POST /api/photos/flush` | Working |
| **Edit metadata of an already-indexed photo** ("I know that guy on the left") | `GET/PATCH /api/photos/edit/:slug` | Working (built S43) |

### E. Public submission + feedback intake
| Use case | Endpoint(s) | State |
|---|---|---|
| List/pull/discard contribution & request submissions | `lib/submissions.js`, `lib/feedback.js` | Working |
| Requests / Survey Responses / Document Contributions subtabs | `/api/feedback/*` | Working |
| Survey "Create Draft" → Q&A markdown for human narrative | `/api/feedback/create-draft/account` | Working |
| Skipper Stories moderation: approve/hold/withdraw/restore/discard + nightly publish | `/api/feedback/stories/*` | Working; intermittent JSON error (`Unexpected token '<'`) unresolved |
| Photo-ID proposals from public lightbox | `lib/proposals.js` | Working |
| Admin notification email on new submission | (worker) | **Never confirmed working** (`INFRA-TASK-...067`, open since S38) |

### F. Issue tracking (Todo) + health checks
| Use case | Endpoint(s) | State |
|---|---|---|
| List/create/update/delete todo items | `/api/todo/items` | Working (API) |
| Run health-check scanners (missing first name, broken slug refs, dup names) | `/api/todo/scans/:key/run` | Working |
| Promote a scan finding to a tracked item | `/api/todo/promote` | Working |
| **Tab 5 "Todo/Flags" full UI** | — | **Spec'd Session 32, never built** — the longest-standing TODO |

### G. Utilities run *outside* the UI (terminal/skill only)
`backfill-r2.js`, `upload-soldier-photos.cjs`, `upload-event-photos.cjs`, and the entire KIA build path (`build_profile.py` + `kia-profile` skill). These are the clearest "not yet self-serve" gaps.

---

## 3. Design review — the concrete problems

### Backend

1. **Routes defined after `app.listen()`.** `app.listen()` is at line 464; ~340 more lines of routes follow (lines 475–814). They happen to register because Express keeps appending to its router, but it's fragile and misleading. This is the single clearest fingerprint of bolt-on growth.

2. **Three dead duplicate routes.** `POST /api/private/contact` (388 & 475), `/api/soldier/links/other/add` (409 & 492), and `/api/soldier/links/other/remove` (428 & 509) are each defined twice. Express matches the first, so the post-`listen()` copies are dead code. (Noted as cleanup debt back in S55.)

3. **Inconsistent modularization.** Seven feature areas live in tidy `lib/*.js` modules that register their own routes; but all soldier-specific routes (profile-photo, links, service-record, timeline, photos, documents — ~18 endpoints) sit inline in `server.js`. They should be a `lib/soldiers-profile.js` module like the rest.

4. **No restart-free reloading.** Any `lib/*.js` change needs a manual server restart to pick up routes (noted repeatedly S34/S43/S54).

### Frontend

5. **One 7,181-line file.** CSS, JS, and markup all inline. This is the direct cause of the recurring *file-truncation* failures when Claude edits it (silent truncation above ~6.5 KB writes forced Python whole-file writes). Splitting the file removes that whole class of failure and shrinks the tokens needed to touch any one feature. The notes already flag pulling New Profile JS into `admin/np.js` (S54).

6. **Copy-pasted form logic.** The slug-load / populate-select / form-reset patterns are duplicated 4–5 times (e.g. lines 1782–1810, 1870–1911, 2313–2342). One shared helper would collapse them.

7. **Inconsistent module + event patterns.** `NP`/`PHE` are IIFE-wrapped; `PH`/`TODO` are globals; event binding mixes 50+ inline `onclick=` with `addEventListener`. Pick one of each.

8. **No slug-cache invalidation.** `slugCache` is filled once at load; server-side data changes require a hard refresh.

9. **Long multi-branch functions** (`onEditFieldChange` ~88 lines, `npSwitchSubTab`) and **no CSS spacing/size tokens** (hardcoded px everywhere) — minor but cheap to fix during a split.

### Hygiene / process

10. **Cruft in the repo:** `index.html.tmp.36176.4df8b54d97b7` (an incomplete ~5,862-line older checkpoint) and `miller-marvin-dale-OLD.md` should be deleted. `todo.json`/`package.json` have a history of truncation/null-byte corruption on the bash mount — worth a guard.

11. **`node_modules` is committed** (sharp ships an 18 MB platform DLL). Confirm `.gitignore` covers `admin/node_modules/`.

---

## 4. The velocity question — task triage

You asked how to keep the same speed without spending me on mechanical work like "wiring up a photo." The lever is your stated north star: **make the panel self-serve enough that Cowork is optional for routine work.** Below is every recurring manual task from the notes, sorted by where it should live. "UI" tasks are the build targets.

### → Should become self-serve admin UI features (highest ROI)

| Recurring manual task | Why it kept needing Claude | Proposed UI feature |
|---|---|---|
| **Build a KIA/soldier profile from saved HTML + photo** | Runs entirely via `build_profile.py` + `kia-profile` skill, outside the tool | Port `build_profile.py` server-side behind a **drag-and-drop "Build Profile" zone** in New Profile (drop Honor States / Virtual Wall / Wall of Faces HTML + photo → parse → scaffold → R2 upload). This was the S53 "Import" design — never built; it is the biggest single win. |
| **Wire up a profile photo** (set frontmatter, create `photos/profile/index.md`, copy image, PNG→JPG, crop) | Many micro-variants done by hand every profile session; 6 soldiers had an image but no index file (fixed by hand S64) | Extend the existing profile-photo flow to do all of it in one action, incl. PNG→JPG conversion and writing the missing `index.md`. Most pieces already exist; this is wiring, not new infra. |
| **Tag a person into a group photo** (`contains[]` / `tagged[]`) | Constant — "I know the guy on the left" | The Edit subtab already does this; add a faster slug-autocomplete + "add to this photo" affordance so it's one click, no Claude. |
| **Create stub profiles** | Done ad hoc / via workaround modal; recurring missing-stub lists every session | Already an endpoint; surface a bulk "paste a list of names → create stubs" action. |
| **Decorations: promote NDSM/VSM/VCM to confirmed for every Vietnam KIA** | Manual after each script run | A "Confirm Vietnam KIA base set" preset button (you already have "Apply Base Set"). |
| **Roster dedupe** (remove a soldier from `roster.json` on profile creation) | Manual rule since S34 | Auto-remove from roster as a side-effect of `soldiers/create`. |
| **Run R2 backfill / photo uploads** | Terminal-only scripts; every photo session ends with a reminder to run them | Wrap `backfill-r2.js` / `upload-*` as a **"Sync to R2" button** in the Photos tab. |
| **Build Tab 5 / Todo UI** | The scanners exist; only the UI is missing | Finish the long-spec'd Todo/Flags tab so flagged data issues are fixed in-app. |

### → Better as deterministic scripts/skills (not worth UI chrome)

Frontmatter/YAML repair (unquoted colons, missing `---`, scrambled fields, field-name mismatches), null-byte stripping, and bulk field renames. These are rare-ish and varied; a small validate-and-fix script (or a "lint frontmatter" health check in Todo) is a better fit than buttons.

### → Genuinely needs Claude (keep)

Writing narrative — timeline action narratives, Skipper Story drafting/enrichment, survey-response prose, and Tier 2/3 relationship judgment calls. The notes are explicit that these stay human-in-the-loop; the right pattern is the existing "Create Draft" handoff, where I produce a draft and you approve.

**Decision rule (from your own notes, S53):** automate against *real* recurring examples, not hypotheticals. Everything in the first table above has repeated across many sessions, so it clears that bar.

---

## 5. Recommended refactor plan (phased)

Ordered so the cheap, risk-reducing cleanup happens first and each phase makes the next cheaper — including cheaper in tokens for me.

**Phase 0 — Hygiene (low risk, do first).** Delete `index.html.tmp.*` and `*-OLD.md`; confirm `admin/node_modules` is gitignored; move the post-`listen()` routes above `app.listen()`; delete the 3 dead duplicate routes. No behavior change.

**Phase 1 — Backend modularize.** Extract the inline soldier routes into `lib/soldiers-profile.js` registered like the others. Optional: a tiny dev-reload (nodemon) so route changes don't need manual restarts. Backend becomes uniform and easy to reason about.

**Phase 2 — Frontend split (kills the truncation problem).** Break `index.html` into `admin/css/*.css` and per-feature JS modules (`session.js`, `records.js`, `newprofile.js`, `photos.js`, `photoedit.js`, `todo.js`, `feedback.js`), plus shared helpers for slug-load/populate/reset. After this, editing one feature touches a small file — faster for you, far fewer tokens for me, no truncation.

**Phase 3 — Velocity features.** Build the items in §4's first table, in ROI order: profile-photo one-shot → photo tagging speedups → "Sync to R2" button → Todo/Flags tab → server-side "Build Profile" import (the big one) → bulk stub create. Each removes a standing reason to call me.

**Phase 4 — Backlog cleanup.** Work the carried-forward bugs: event slug `[]` literal (`...022`), fuzzy matcher (`...024`), event data not reaching `index.md` (`...112324`), commit-button reliability (`...030`), em-dash mangling (`...031`), Skipper Stories JSON error, and confirm submission email (`...067`).

---

## 6. Carried-forward backlog (reference)

**Never built:** Tab 5 Todo/Flags UI · KIA/FindAGrave import in UI · docx conversion · decoration presets beyond base · Tier 2/3 alongside management · bulk field-write · slug rename.
**Open bugs:** `...022` event slug `[]` · `...024` fuzzy matcher · `...112324` event→index.md · `...030` commit button · `...031` em-dash · `...033` author-slug routing signal · Skipper Stories JSON error · `...067` admin email.
**Deferred features:** Build My Book / Keepsakes (waits on story volume + `archive-index.json`).

---

## 7. Suggested next step

Phases 0–1 are nearly mechanical and safe — a good place to start because they shrink the surface before the bigger frontend split. If you agree with this triage, the natural sequence is: do Phase 0 now, then decide whether to tackle the frontend split (Phase 2) or jump to a specific velocity feature (e.g. the one-shot profile photo) depending on what's biting you most this week.
