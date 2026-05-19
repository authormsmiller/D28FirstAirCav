# Session 37 Handoff — 2026-05-18

## Session Summary
Design and spec session — no code written. Built interactive wireframes for all public form flows, fixed families copy, completed the request JSON schema, added priority/staleness logic, catalogued all form touch points, and added future-login rails.

---

## Completed This Session

### families.njk — Copy Fix
Removed "Takes about ten minutes." from two instances:
- Step 1 of How It Works (hiw-step body)
- Footer CTA section (land-foot-body)

### Wireframes — `site/_docs/wireframes-public-forms.html`
Interactive 9-screen wireframe using the site's actual design language (Bebas Neue / Space Grotesk / Crimson Pro, yellow/parchment/black). Clickable nav bar across all screens:

1. Contribute Landing — type selector (Documents / Photos)
2. Contribute · Documents · Step 1 — About You
3. Contribute · Documents · Step 2 — Upload + Drive link
4. Contribute · Photos · Step 1 — About You
5. Contribute · Photos · Step 2 — Upload
6. Contribute · Returning — continuation banner, pre-filled fields, Submit & Continue
7. Request Landing — 6-type card selector
8. Request · Correction — full structured flow (type → typeahead → field → value → source)
9. Request · Other Types — all 5 remaining forms side-by-side

### Design Spec Updates — `site/_docs/design-public-forms.md`
Several additions beyond what was in the spec after Session 36:

**Request JSON shape** — fully specced for all 6 types. Shared base fields (`type`, `submitted`, `submitter_name`, `submitter_contact`, `user_id`, `page_url`, `referrer_url`) plus type-specific fields for each. `type` field is authoritative inside the JSON body; filename encoding is convenience only.

**Request priority order:**
| Priority | Type | Rationale |
|---|---|---|
| 1 | `privacy` | Legal/family sensitivity |
| 2 | `broken` | Site actively broken |
| 3 | `correction` | Public record is wrong |
| 4 | `contact` | Someone waiting on response |
| 5 | `general` | Time-flexible |
| 6 | `add` | No urgency |

**Staleness escalation** — `date-limit` CSS class applied to any request older than 30 days, regardless of priority. Client-side only (`Date.now() - new Date(submitted) > 30 * 86400000`). Same class and same utility function will apply to todo.json items using their `created` field — both parse cleanly with `new Date()`.

**`user_id: null`** — added to both `metadata.json` shape (submissions) and request JSON shared fields. Future login/auth rails. When login exists, backfill to real IDs. Enables delegated admin and collaborative draft workflows down the road without a schema change.

**`page_url` and `referrer_url`** — on shared base for all request types (not just "broken"). Captured silently by JS at submit. Useful context for corrections and contact requests too.

### Form Touch Points — `admin/data/todo.json` (SITE-TASK-20260518000069)
Full inventory of all Contribute and Request entry points across the site, added as a single task. Key points:
- 19 existing links (mostly to `/contribute/`) need query string params added: `?soldier=[slug]`, `?type=photos`, `?type=documents`
- `Contact Family` mailto button on soldier profile hero → convert to `/request/?type=contact&soldier=[slug]` (also removes archive email from page source)
- `masthead` "Request a Profile" → update to `/request/?type=add` once form exists
- Net-new touch points to add: Correction link on soldier/event/document heroes; "Missing from roster?" on Roster; "Not finding someone?" on Search; "Report an issue" in footer

---

## Key Files Changed This Session

| File | Change |
|---|---|
| `site/families.njk` | Removed "takes about ten minutes" (2 instances) |
| `site/_docs/wireframes-public-forms.html` | Created — 9-screen interactive wireframe |
| `site/_docs/design-public-forms.md` | Wireframe status, request JSON shape, priority order, staleness escalation, touch points inventory, user_id rails, Still To Do updated |
| `admin/data/todo.json` | Added SITE-TASK-20260518000069 (form touch points) |
| `_sessions/Session_37_Handoff.md` | This file |

---

## Next Session

Design and spec work is complete. Ready to build.

**Suggested build order:**
1. `INFRA-TASK-061` — Fix worker.js asset passthrough (`env.ASSETS.fetch()`) — unblocks everything else
2. `INFRA-TASK-062 + 063` — Create SUBMISSIONS R2 bucket + add binding to wrangler.jsonc
3. `INFRA-TASK-064 + 065 + 066` — Worker routes (`POST /submit/contribute`, `GET /submit/check`, `POST /submit/request`)
4. `INFRA-TASK-067` — MailChannels email (thank-you + notification)
5. Contribute page markup and CSS (replace current Formspree form in `contribute.njk`)
6. Request page markup and CSS
7. `SITE-TASK-069` — Wire touch points with query string params
8. `INFRA-TASK-068` — Admin pull endpoint (submissions → `_intake/raw/`)

Read `site/_docs/design-public-forms.md` at the start of any build session — it is the authoritative spec for all of the above.
