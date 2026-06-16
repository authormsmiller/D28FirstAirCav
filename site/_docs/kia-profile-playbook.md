# KIA Profile Build — Playbook

**Purpose:** the canonical, repo-versioned procedure for turning a same-day (or same-action)
multi-KIA cluster into published soldier profiles + an event page. Consolidates what's
scattered across the `_sessions/` handoffs and the `kia-profile` skill. When this doc and
the skill's `SKILL.md` disagree, **this doc wins** — the skill cache is read-only, partly
Chinook-specific, and carries stale absolute paths.

**Where this fits:** this playbook builds the **Tier 1 event page + profiles** for a KIA action.
For *why* we also add operation context pages and how the pieces relate, see
`coverage-model.md` (the 3-tier content model), and log every action you build in
`d-co-operational-timeline.md` (the coverage tracker).

**Last updated:** 2026-06-15 (after the 1969-05-25 / Hau Nghia cluster: garven-wayne,
karr-john, white-richard, + clooney-ray survivor stub).

---

## 0. Paths (read first)

- **Repo:** the `d281staircav` working folder (this repo).
- **KIA staging folder:** the top-level `KIA` folder (a separate drop folder, e.g.
  `…/Downloads/KIA`). It is **not** in git.
- **Build script:** `KIA/build_profile.py` — lives at the **top level of the KIA folder**,
  not in the skill cache. (The skill's documented script path is a stale session snapshot;
  ignore it and call the top-level script.)
- **Sandbox note:** in the Linux sandbox these mount under `/sessions/<session-id>/mnt/…`
  and the `<session-id>` **changes every session** — resolve the current paths from the
  "Shell access" list at the start of the session; don't hard-code an old one.

---

## 1. Build order (do not reorder)

1. **Identify the action** — web research (Virtual Wall, Honor States, VVMF Wall of Faces
   per man; cross-check unit operational history for the date).
2. **Event page first** (draft) — profiles reference it for body context.
3. **Stage each man's research** in the KIA folder (Section 3).
4. **Run the script** per man (Section 4).
5. **Manual enrichment** per man (Section 5).
6. **Cross-link** the cluster — `_alongside.json`, documents, survivor stubs (Section 6).
7. **Update records** — master KIA list + event casualty notes (Section 7).
8. **Publish + R2 photo upload + deploy** (Section 8).

---

## 2. The event page

- Location: `site/events/<event-slug>/index.md`. Slug pattern: descriptive + date, e.g.
  `trail-ambush-hau-nghia-1969-05-25`, `operation-sheridan-sabre-1968-12-04`.
- Start as `status: draft`, `publish: false`. Flip to published only after review.
- `type:` is usually `contact` (also: `crash`, `incident`, `memorial`). The unit-history
  page groups published events by this type.
- Keep operation/AO claims **hedged** unless confirmed against unit records ("likely within
  Operation X — not yet confirmed"). DCAS province fields are frequently wrong; treat the
  event's reconstructed location as source of truth and flag the discrepancy.
- Carry casualties with a `note:` ending "Profile pending." → change to "Profile created."
  as each profile is built.
- Use `open_questions:` (publish flag per item) for unresolved facts and the documentary
  next step (NARA RG 472 unit journals; the Texas Tech / Vietnam Center & Archive ORLLs).
- **Public contribution prompt (the one `publish: true` open question):** write it as an
  *invitation*, not a research question. A veteran who was there already knows the date;
  he can't Google it and gives up. Lead with "If you served with D Company, 2/8 Cav … or
  knew [name the men], we'd like to hear from you," give a one-line plain-language summary
  of what we believe happened, and **always end with this standard low-barrier line:**

  > *You don't need to have researched anything or know the operation's name — a nickname,
  > a face, or a fragment of that day all help us complete the record.*

---

## 3. Staging convention

One folder per man: `KIA/<batch>/<slug>/` (e.g. `KIA/1969-may25/garven-wayne/`).

Drop in, per man:

- **Three saved web pages**, each via the browser's **Save As → "Webpage, Complete"**
  (this also writes the `_files` resource folder the parser expects — *not* HTML-only):
  - **Honor States** — service details + decorations (the "awardlist" star colors).
  - **Virtual Wall "Profile" popup** — MOS, start tour, location, casualty type/reason.
  - **VVMF Wall of Faces** — canonical URL, photos, and the remembrances (gold for
    first-person leads).
- **Profile photo** named exactly `<slug>-profile.jpg`. If it saved as PNG, convert:
  ```python
  from PIL import Image
  Image.open('<slug>-profile.png').convert('RGB').save('<slug>-profile.jpg','JPEG',quality=92)
  ```

The script auto-detects each HTML file by its content, so the HTML filenames don't matter —
only the photo name does.

Notes:
- Not every man has a Virtual Wall **individual** page; the "Profile" popup is a different
  (search-result) artifact and contains **no decoration data** — those live on the VVMF /
  individual VW page.
- A `field/` subfolder with an `info.txt` (plus images) will be picked up and written to the
  soldier's `photos/field/`.

---

## 4. Running the script

From the repo root:

```bash
python3 <KIA>/build_profile.py \
  --slug <slug> \
  --event <event-slug> \
  --platoon Skull|Cat|Range \
  --kia-dir <KIA>/<batch> \
  --repo-dir <repo> \
  --date $(date +%Y-%m-%d)
```

- `--kia-dir` points at the **batch** folder (the parent of `<slug>/`), not the slug folder.
- Platoon names are **Skull, Cat, Range** — no numbers. Default Skull; set per the man.
- It writes `site/soldiers/<slug>/<slug>.md` and `…/photos/profile/index.md`, and copies the
  jpg. For non-Chinook events it skips `relationships.json` (use `_alongside.json` instead).
- Read the printed summary: Name / Rank / DOB / Hometown / Wall / Arrived / MOS / casualty
  type / decorations. **Officer records often miss DOB + hometown** — fill manually (Sec 5).

---

## 5. Manual enrichment (per profile, every time)

- [ ] **Promote NDSM / VSM / VCM** from `decorations_unconfirmed` to `decorations`. These
      three are certain for any in-country Vietnam-era KIA even when Honor States shows them
      grey-star. (Leave CIB, Marksmanship, PUC, Gallantry Cross unconfirmed unless sourced.)
- [ ] **Check the VVMF / individual Virtual Wall page** for Bronze Star / Air Medal not in
      Honor States; promote if confirmed.
- [ ] **Fill DOB + hometown** if the parser left them blank (use VVMF). Set `birth_year`.
- [ ] **Replace the KIA timeline `# TODO` body** with a real narrative tied to the event
      (what happened, the men beside him, cause from the casualty record, age, time
      in-country). Link `/events/<event-slug>/` and any account doc.
- [ ] **Set the assignment** label/unit/location/dates and platoon.
- [ ] **Log every discrepancy** in admin `notes:` — DOB, rank, hometown, province, platoon
      conflicts — with the competing sources. Don't silently "fix" the master list without
      flagging.
- [ ] **Never publish service IDs** — Army-era IDs are SSNs; script keeps them in admin
      notes only.

---

## 6. Cross-linking the cluster

- **`_alongside.json`** in each soldier's folder — array of `{slug, basis, notes}`. Use
  `basis: "same-action"` and point every man at the others. Include survivors too (see
  below) with a note that they survived.
- **`related_events:`** in each profile front matter → the event slug.
- **First-person accounts** → `site/documents/<author-slug>/<doc-slug>/<doc-slug>.md` with
  `layout: layouts/document.njk`, `type: account`, `author: <soldier-slug>`, `event:`, and a
  `tagged:` list (`{slug, name, note}`) of every man it mentions. The author/tagged slugs
  must resolve to real soldier profiles for the cards to render. Reproduce quoted source
  **verbatim**; cite it in `source:`. (See `documents/clooney-ray/clooney-ray-coin-flip/`
  and `documents/wilson-david/wilson-david-troopers-tale/`.)
- **Survivor / veteran stubs** — if a source names a survivor or witness (e.g. an RTO who
  lived), create a `status: veteran` stub mirroring `clooney-ray` / `wilson-david`. Fill
  what the source gives; flag the rest. Drop their photo via the `profiles/` folder workflow
  (drop image in `profiles/`, convert, write `photos/profile/index.md`, move source to
  `profiles/done/`).
- **`photos/profile/index.md`** must exist for every soldier with an image — the hero and
  the alongside cards resolve crawler-first (`photosBySlug[slug].profile[0]`).

---

## 7. Records to update

- **Master KIA list** — `site/_docs/d-co-kia-list.md`. Set the man's last column to
  `**stub**` when his profile is built. Correct data errors here (e.g. wrong state) only
  when confirmed, and note the correction.
- **Event page** — change each man's casualty `note:` from "Profile pending." to
  "Profile created."

---

## 8. Publish + deploy

- **R2 photo upload** (photos live in R2, not git): `node scripts/upload-soldier-photos.cjs <slug>`
  for each new soldier (KIA and survivors).
- **Flip to published** — event page (`status: published`, `publish: true`) and any account
  document (`status: published`).
- **Asset sync on build** — Eleventy does NOT copy `assets/`. After a `_site` rebuild run
  `cp -r assets _site/assets` locally, or `xcopy /E /Y assets _site\assets` from `site/`
  before `wrangler deploy`. Forgetting this strips all CSS.
- **Push** via GitHub Desktop.

---

## 9. Gotchas (hard-won)

- **Mount write truncation (~7KB):** the Read/Write/Edit file tools on this repo mount can
  silently truncate larger writes while reporting success. For any non-trivial file write or
  insertion, use a bash `cat > file <<'EOF' … EOF` heredoc and verify with `wc -c` and `tail`.
  (Small one-line edits are fine.)
- **PNG → JPG before the script runs;** it expects `<slug>-profile.jpg`.
- **DCAS province is unreliable** — agreement across all of a cluster's records is a strong
  same-action signal, but the province itself can still be wrong. Reconcile against the unit's
  documented AO; don't take DCAS at face value.
