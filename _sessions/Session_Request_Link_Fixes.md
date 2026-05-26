# Session: Request Page Link Fixes

**Date:** 2026-05-21
**Repo:** `https://github.com/authormsmiller/d281staircav`
**Purpose:** The `/request/` page (contact/update request form) is complete and functional but is not reachable from site navigation. This session fixes the links.

---

## Background

The site has two separate intake paths:

| Path | Purpose |
|---|---|
| `/contribute/` | Contribute photos, documents, letters — material for a soldier's profile |
| `/intake/` | Start a new soldier profile (family-initiated) |
| `/request/` | Contact/update request form — corrections, missing soldiers, privacy takedowns, contact info requests, general messages |
| `/families/` | Landing page for families — explains the archive, links to `/intake/` |

The masthead nav has two CTAs — **Request** and **Contribute**. **Request** currently goes to `/families/`, but the actual request form is at `/request/`. The `/families/` page is a landing page, not the form.

---

## What Needs Fixing

### `site/_includes/partials/masthead.njk`

**Desktop nav** (2 occurrences):
```html
<!-- BEFORE -->
<a class="nav-btn cta {% if page.url == '/families/' %}active{% endif %}" href="/families/">Request</a>

<!-- AFTER -->
<a class="nav-btn cta {% if page.url == '/request/' %}active{% endif %}" href="/request/">Request</a>
```

**Drawer nav** (2 occurrences):
```html
<!-- BEFORE -->
<a class="nav-drawer-btn cta {% if page.url == '/families/' %}active{% endif %}" href="/families/">Request</a>

<!-- AFTER -->
<a class="nav-drawer-btn cta {% if page.url == '/request/' %}active{% endif %}" href="/request/">Request</a>
```

---

## What's Already Working

- **`/request/`** — fully built (`site/request/index.njk`). Six request types: correction, contact, add, broken, privacy, general. Type-specific field panels, success/error states, query string pre-selection (`?type=general`).
- **`POST /submit/request`** — backend submission handler in `admin/lib/submissions.js` (registered via `registerSubmissionsRoutes`).
- **`/families/`** — stays as-is. It's still a valid landing page for families wanting to start a profile (`/intake/`). The nav button just shouldn't point there.

---

## Scope

This session is **link fixes only** — no changes to the request form itself, the submissions handler, or the `/families/` page.

If there are other pages that should link to `/request/` (e.g., "Think something is wrong?" CTAs on soldier profiles), those are out of scope for this session and should be a separate pass.

---

## Verify After

1. Nav "Request" button goes to `/request/`
2. Active state highlights correctly when on `/request/`
3. `/families/` is still reachable (linked from `/` and anywhere else it appears)
4. Rebuild: `npx eleventy` from `site/`
