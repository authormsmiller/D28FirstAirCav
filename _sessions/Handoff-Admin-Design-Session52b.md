# Session 52b Handoff — Admin Tool Design

**Date:** 2026-05-29
**Context:** Design discussion — no code written this session.

---

## The Problem

Cowork is currently filling the gap between what the admin panel can do and what actually needs to happen. The goal is to close that gap enough that Cowork becomes optional for routine work — not necessarily eliminated, but not required.

Two major profile workflows were identified that need admin-panel-level automation:

---

## Use Case 1 — Photo Submission → Profile

A veteran or family member submits photos. The current photo intake (drag-and-drop, labeling) works fine for getting photos into the system with basic metadata.

**What's missing:** the path from "photos are in intake" to "soldier has a live profile with photos wired correctly" still requires too many manual steps outside the admin panel. The exact steps haven't been fully mapped yet.

**Design prompt for next session:**
Trace a photo submission end-to-end — from the moment photos arrive to the moment the profile is live — and mark every manual step. That map is the basis for the feature spec.

**Nice-to-haves on intake** were mentioned but not captured — surface these in the next session.

---

## Use Case 2 — KIA Profile from HTML Research Files

Currently handled by the `kia-profile` Cowork skill (see `Handoff-KIA-Skill-Session52.md`). The workflow:
1. Save Honor States, Virtual Wall, Wall of Faces HTML + profile JPG into `KIA/[slug]/`
2. Tell Cowork "build profile for [slug]"
3. Run `node admin/scripts/backfill-r2.js`
4. Push via GitHub Desktop

**Target state:** A drag-and-drop zone in the admin panel where you drop the HTML files and photo, hit Build, and the profile is created — including R2 upload and `relationships.json` wiring. No Cowork, no terminal.

The `build_profile.py` script from the skill is a working proof of concept for the parsing logic. The admin panel version would need to run equivalent logic server-side (in the worker or a separate admin endpoint) rather than as a local Python script.

---

## Open Design Questions

1. **Drag-and-drop target** — does the admin panel get a dedicated "New Profile" tab, or does this live under the existing soldier management UI?

2. **Build output** — the skill currently writes files to the local repo. An admin panel version would need to either (a) write directly to the repo via GitHub API, or (b) generate a downloadable zip the user drops into the repo manually. Option (a) is the real automation; option (b) is a stepping stone.

3. **R2 upload** — the backfill script runs locally with R2 credentials. An admin panel build flow could upload to R2 directly via the worker (which already has R2 bindings), eliminating the manual backfill step entirely.

4. **Photo metadata wiring** — for use case 1, the `photos/profile/index.md` and `contains[]` tagging still need to be generated. Does the admin UI prompt for this, or does it infer from intake metadata?

5. **`.gitkeep` files for empty folders** — mentioned as a need for stub creation. Eleventy ignores empty directories; stubs need placeholder files so the folder structure commits cleanly.

6. **Scope boundary** — what's the minimum admin panel state where Cowork is no longer required for routine profile work? Defining that line prevents over-engineering.

---

## Suggested Next Session Agenda

1. Walk through use case 1 step by step — map every manual touch from photo submission to live profile
2. Capture the intake nice-to-haves
3. Answer the open design questions above
4. Produce a feature spec for the admin panel "New Profile" flow
5. Decide: GitHub API writes vs. zip download as the delivery mechanism

---

## Related Files

- `Handoff-KIA-Skill-Session52.md` — kia-profile skill docs, Chinook batch status
- `Handoff-Chinook-Crash-KIA.md` — Honor States URLs for remaining stubs
- `site/soldiers/_template.md` — canonical profile template
- `admin/scripts/backfill-r2.js` — current R2 upload mechanism
- `site/_data/alongside.js` — Alongside tab build-time crawler
- `site/_data/relationships.json` — manual alongside relationships
