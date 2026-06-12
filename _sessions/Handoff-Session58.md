# Session 58 Handoff — Footnotes, Maxey Decision, ASA Roster Analysis
Date: 2026-06-04

## What Was Built This Session

### Maxey Account — Editorial Decision

Decided NOT to surface the Maxey account (`sargent-stan-silver-star-story.pdf`) as a document on the site. Rationale: the Maxey document is a compiled secondary account drawing on Neal's written account (already in the archive) and a 2005 Dillon phone interview. Surfacing it alongside first-hand accounts blurs the editorial line between primary and secondary sources, and reproducing it risks straying into copying.

**Unique facts Maxey adds over the first-hand accounts already in the archive:**
1. Bible verse — 2 Corinthians 5:7 ("for we walk by faith, not by sight"). Dillon's written account mentions the Bible stopping the bullet but not the verse.
2. Sargent explicitly named as taking over the M-60 after Hall was killed. Neal's account notes an M-60 was active on the north bank but does not name the operator. Dillon's written account also does not name Sargent at the gun.
3. 83rd NVA rear service unit identification — not in Neal's account. Source attribution within Maxey is unclear; may be from a separate Neal communication.
4. Four Silver Stars enumerated — not in Neal's written account.

**Resolution:** Facts 1–4 are already woven into the event summary and soldier profiles from last session. Added footnote citations pointing to maxey.info for facts 1 and 2. Maxey PDF stays in `site/soldiers/sargent-stan/documents/` for internal reference but is not added to `collections.documents` and does not appear on the public Documents tab. The `archivist_notes.sources` entry remains the internal record.

---

### Footnote Support — New Infrastructure

**Problem:** The site had no footnote rendering. npm registry is blocked in the build sandbox, so `markdown-it-footnote` could not be installed.

**Solution:** Custom `processFootnotes` filter added to `.eleventy.js`. No external dependencies. Post-processes rendered HTML:
- Collects `<p>[^id]: citation text</p>` definitions, strips them from the body
- Replaces inline `[^id]` references with numbered `<sup>` links
- Appends a `<section class="footnotes">` at the end of the content

**Files changed:**
- `site/.eleventy.js` — added `processFootnotes` filter (lines ~134–169)
- `site/_includes/layouts/document.njk` — `{{ content | processFootnotes | safe }}`
- `site/_includes/layouts/event.njk` — `{{ content | processFootnotes | safe }}`
- `site/assets/css/main.css` — added `.footnote-ref`, `.footnotes`, `.footnotes-sep`, `.footnotes-list`, `.footnote-item`, `.footnote-backref` styles

**⚠️ CSS SYNC REQUIRED:** `main.css` is managed manually (not via Eleventy passthrough). Footnote styles will NOT be live until you run:
```
xcopy /E /Y assets _site\assets
```

**Footnotes added:**

1. `site/documents/dillon-stan/dillon-stan-account-042071/dillon-stan-account-042071.md`
   - Inline ref `[^dillon-bible]` added after the Bible passage
   - Definition: credits 2005 Dillon/Maxey phone interview; links to maxey.info/stan-sargent-story.html

2. `site/events/contact-fsb-fontaine-1971-04-20/index.md`
   - Inline ref `[^sargent-m60]` added to "Sargent took over the M-60 machine gun"
   - Definition: credits Dillon phone interview via Maxey; notes Neal's account confirms M-60 active but does not name operator

---

### ASA Roster Checklist

Built a working checklist from the ASA Master Roster Excel file (April 2020 version). Normalized year formats and platoon names. Saved to:
- `_private/asa-roster-checklist.md` — 627 entries, grouped by tour year then platoon

**Important:** This is the roster Jim Garvin referred to as "a mess." Treat as a name-finding starting point only. Do not create profiles or add roster.json entries based solely on this list without independent corroboration.

---

### Cat Platoon 70–72 Analysis

Cross-referenced ASA roster Cat entries for years 70, 70-71, 71-72, and 72 against the live site.

**Total Cat 70–72 ASA entries: 64**
- Have a soldier profile: **11**
- In roster.json only (no profile): **27**
- Not on the site at all: **26**

**Not on site (26):** Dominated by the pure year-`70` single-year entries (no tour range — likely data quality issue) and most of the 71-72 cohort. See checklist for full list.

**Duplicates removed from roster.json (8):** Tincher, Alloway, Kint, Fishell, Randt, Schaffer, Small, Hryniw — all now have profiles and were rendering twice on the roster page. Removed from `_data/roster.json`. Build confirmed clean at 49 entries.

**Note:** Other platoons likely have similar duplicates as profiles accumulate. Worth a sweep before each deploy or when adding a new profile.

---

## Deferred / Still Open (from Session 57 + this session)

### Documents Tab Wiring — sargent-stan (Session 57 carry-over)
The `documents:` block in `sargent-stan.md` references two files already in `site/soldiers/sargent-stan/documents/`:
- `interview-with-linda-martin-transcript.pdf`
- `sargent-stan-silver-star-story.pdf` (stay internal — do not add to collections.documents)

Documents appear to stay in the repo and are served directly — no R2 upload needed. Verify the documents tab is rendering correctly on the Sargent profile and that the Linda Martin PDF link resolves.

### Minesweeping Photo — contains[] (on hold)
`sargent-stan-minesweeping-hwy331-fontaine.jpg` shows "Stan, Bill, Steve, Kirk." If Bill = Bill Small and Kirk = Kirk Davis, add their slugs to `contains[]` in the field photo index. Needs visual confirmation.

### Hillclimbers Photo (on hold)
`sargent-pdf-img-005.jpg` (Chinook on hilltop coastal firebase) extracted from Maxey PDF. In outputs only — not committed. Hold until participant confirms it's Relay Mountain.

### Tactical Sub-Point Coordinates
Three tactical points for `contact-fsb-fontaine-1971-04-20` (crossover, LZ, bunker complex) are estimates. Should be re-derived from the pre-dam military topo map using the confirmed Suoi Gia Ui location.

### Photo Enhancement — Unresolved
User attempted to share a photo for cleanup. Could not be processed — came through as inline chat image rather than file attachment. To retry: use the paperclip/attachment button to attach as a file.

### Roster Cleanup — Other Platoons
The duplicate-removal sweep this session only covered Cat 70–72. Range and Skull platoons likely have similar roster.json entries for soldiers who now have profiles. Run the same analysis before the next deploy.
