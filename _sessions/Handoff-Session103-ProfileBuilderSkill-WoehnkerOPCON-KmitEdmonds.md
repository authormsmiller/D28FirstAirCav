# Session Handoff — 2026-07-20
**Session 103**
**Theme:** Rebuilt the general-purpose KIA profile-builder script from scratch (it existed
only as a skill description, no actual code) and packaged it as an installable `.skill`
bundle. Used it to build three new profiles — Matthei, Kmit, Edmonds — and along the way
opened a real unit-attribution mystery around Harrison Woehnker (D Co 2/8 Cav vs. C Battery
2/19 Arty) that turned into a 1968 ORLL research thread and a research-stub event page.
Also did overdue roster housekeeping: struck an erroneous entry (Gulley), fixed 42+1 stale
profile-status markers, and caught a real slug typo that had silently kept Woehnker's
profile from ever joining the roster. Closed the session by building a second stub event
for the shared Feb 5, 1969 Edmonds/Kmit loss, and adding two newly-surfaced personal-history
sources to Kmit's profile. Michael ran the build at the end of the session.

---

## What was completed this session

### Part 1 — Rebuilt `build_profile.py` and packaged the `kia-profile-general` skill

The `kia-profile-general` skill only had a `SKILL.md` — the actual `scripts/build_profile.py`
was missing from the mounted skill cache. Wrote it from scratch, modeled on the sibling
`kia-profile` (Chinook-batch) skill's script and existing reference profiles. Key pieces:
HTML stripping/field extraction (id-based, for Virtual Wall), name/suffix splitting, unit
abbreviation normalization (`UNIT_ABBR` dict — added `'btry': 'Battery'`, which was missing),
decorations parsing (confirmed vs. unconfirmed), and an identity-resolution fallback
(`resolve_identity()`) that fills in name/rank/DOB/hometown from Virtual Wall or Wall of
Faces when Honor States isn't present — this last piece was added mid-session after testing
on Woehnker exposed the gap. Also added a two-stage "Wounded in Action" → "Died of Wounds"
timeline pattern (matching the repo's existing convention) for men who didn't die on the day
they were hit.

Packaged as `kia-profile-general.skill` (a zip of `SKILL.md` + `scripts/build_profile.py`) —
the app's uploader rejected a bare `.py` file, so this had to be a proper skill bundle.
Building the zip directly in the outputs mount failed repeatedly (`zip I/O error` on
rename/replace); building it in `/tmp` first and copying the finished file over fixed it.
Delivered twice (once initial, once patched after the identity-fallback fix). Michael
installs skills via **Customize**, not Settings > Capabilities — corrected my own bad
advice on this mid-session.

### Part 2 — Three new profiles built

- **`soldiers/matthei-peter/matthei-peter.md`** — CPL Peter Karl Matthei, D Co 2/8 Cav, KIA
  1969-11-20, Binh Duong Province. First real test of the rebuilt script.
- **`soldiers/kmit-chester/kmit-chester.md`** — SP4 Chester Jon Kmit, D Co 2/8 Cav, KIA
  1969-02-05, Tay Ninh Province, small arms fire.
- **`soldiers/edmonds-james/edmonds-james.md`** — CPL James Thomas Edmonds, D Co 2/8 Cav, KIA
  1969-02-05 (same date as Kmit), Tay Ninh Province, small arms fire, buried Pine Hill
  Cemetery, Burlington, NC.

Each got its `photos/profile/index.md` built alongside it, and each roster row in
`_docs/d-co-kia-list.md` updated from `—` to `**stub**`.

### Part 3 — The Woehnker unit-attribution question and 1968 ORLL research

Michael flagged a conflict on `woehnker-harrison`: Honor States lists his unit as D Co, 2/8
Cav (the same designation used for the well-documented May 1972 Chinook batch), but Virtual
Wall gives C Battery, 2nd Battalion, 19th Artillery — which actually matches his rank (1LT)
and MOS (1193, Field Artillery Unit Commander). Working theory: he was serving as a forward
observer or liaison officer attached to D Company when he was wounded.

Indexed two new 1968 ORLL PDFs Michael found in `locations/`:
- **AD391571 / AD392381** — both Period Ending 30 Apr 1968, too early to cover Woehnker's 24
  May wounding.
- **AD393815** — Period Ending 31 Jul 1968, the right quarter — confirms 2/19 Arty was in
  direct support of 1st Brigade (which included 2/8 Cav) for this entire period, and places
  C Battery, 2/19 Arty at **LZ Anne**, the same LZ the "Skipper Journal" (a veteran's D/2-8
  Cav daily-log transcription) places D Company at on **June 3, 1968** — the closest
  geographic link found between Woehnker's battery and the company Honor States credits him
  to. Documented in `sources/orll-1cd-1968/README.md`.

Also cross-checked three "surrounding" D Co KIAs for corroboration: `ross-robert` (KIA 1 Jul
1968, same province, grid YD293319, inside Woehnker's wounding-to-death window — supports the
company's presence but doesn't name him) and `fast-roger`/`golden-ronald` (KIA 19-20 Aug 1968,
different province — shows the company had moved on by then).

Built **`events/woehnker-wounding-1968-05-24/index.md`** as a research stub — explicitly
built to record the open unit-attribution question, not a confirmed action account. Updated
`soldiers/woehnker-harrison/woehnker-harrison.md` with the full research trail.

### Part 4 — Roster housekeeping

- **Struck Gulley** — Michael verified this listing was an error across multiple sources.
  Corrected properly in the source-of-truth `_docs/d-co-kia-list.md` (with a `**REMOVED
  (2026-07-20).**` note preserving the audit trail, plus updated 1969 header count and Open
  Items entry) — **not** by hand-editing the generated `kia.json`, which I did briefly and
  wrongly before catching myself via the file's own "regenerate, don't hand-edit" header.
- **Fixed 42+1 stale profile-status markers** — cells still reading `—` for soldiers who
  actually have profile files. All marked `**stub**` per the roster's own literal definition.
  Flagged `ross-robert`, `weldin-jacob`, `winner-brian`, `wheeler-john` as having enough
  narrative depth that Michael may want to judgment-call them up to `✅`/full — not decided.
- **Caught a real data-integrity bug**: the roster had `woehner-harrison` (missing the "k") in
  both slug and name column, which is why Woehnker's profile — despite existing — had never
  joined into `kia.json` at all. Fixed both the slug and the name text.
- Regenerated `kia.json` after each of these (109 rows final).

### Part 5 — The Feb 5, 1969 Edmonds/Kmit event stub, and the 1969 OPCON question

While building Edmonds' profile, a Wall of Faces remembrance (Dennis Wriston) stated he
served under **2nd Brigade** — the first explicit brigade attribution found anywhere near
1969. Logged this as a new, explicitly low-confidence entry in
`_docs/2-8-cav-opcon-timeline.md` ("First 1969 data point"), since the existing 1967-only
OPCON table had nothing for this year.

Michael then asked for a stub event for the shared Feb 5 loss, using **Operation Sheridan
Sabre** (the only named operation covering this window) as "a signal that we need more
information" rather than a resolved finding — mirroring the Woehnker stub's pattern. Built
**`events/operation-sheridan-sabre-1969-02-05/index.md`**:
- Confirms Tay Ninh Province (both men agree, no conflict there — unlike the Jan 28, 1969
  cluster where casualty records disagreed with the documented brigade AO).
- Surfaces a **new** tension instead: Wriston's "2nd Brigade" claim vs. the fact that Tay
  Ninh was the **1st Brigade's** documented AO during this same operation (per the Jan 28
  event page's own sourcing) — explicitly left unresolved.
- Open questions flag the still-missing 1st Cav Div HQ ORLL for Period Ending 30 Apr 1969
  (would cover this date; not in the collection) and whether Edmonds/Kmit died in the same
  engagement.
- Linked via `related_events` on both soldier profiles; `kia.json` regenerated and confirmed
  both auto-joined to the new event slug via the generator's deterministic
  `casualties.kia[]` scan (no manual roster edit needed for this join).

### Part 6 — Two new sources added to Kmit's profile

Michael added two items to Kmit's KIA folder:
1. **A 1st Cav Div Association newsletter tribute** (James Glenn "Top Gun" Dotson, c. 2021)
   — a third independent source (with Honor States, Virtual Wall) confirming D Co 2/8 Cav in
   Tay Ninh at his death. Flags two conflicts, left unresolved rather than silently
   corrected: it gives his MOS as "11-B" infantryman (Virtual Wall says 11C20), and its
   stated tour-start year ("May 13, 1969") is almost certainly a typo for 1968, since a
   tour starting after his own death date would be impossible.
2. **A Daily Hampshire Gazette article** (Emily Thurlow, Oct 16, 2022) about a Haydenville
   veterans' memorial-plaque restoration project — volunteer Russ Warriner recalls growing
   up with Kmit and running into him in Vietnam the same day he was killed, learning of the
   death only after returning to his own unit. First personal, named recollection on file for
   Kmit. Does not confirm whether Kmit has a memorial plaque at that specific cemetery.

Both written up as proper `site/documents/kmit-chester/` entries (paraphrased, not
reproduced at length, per copyright handling — the Gazette piece in particular is
commercial news content, not a public memorial tribute) and linked in `kmit-chester.md`'s
`documents:` list, with the newsletter clipping image preserved for provenance.

---

## Pending / next priorities

1. **8 named 1969 KIAs remain undocumented** (no profile yet): `velez-rodriguez-elliot`,
   `brown-george`, `dunkle-james`, `marchand-thomas`, `zuniga-daniel`, `muse-michael`,
   `anderson-william`, `carlucci-anthony`. Build as Michael drops their KIA folders.
2. **Woehnker's unit attribution is still unresolved.** Next source needed: a NARA RG 472
   daily staff journal (2/8 Cav or 2/19 Arty, 24 May 1968, Quang Tri Province) — the only
   thing likely to name-confirm which unit he was actually with.
3. **The 1969 OPCON/brigade question is barely started.** Only one low-confidence data point
   (Wriston's "2nd Brigade" remembrance) exists, and it now sits in direct tension with Tay
   Ninh being the 1st Brigade's documented AO. `AD0502597` (Nov 68-Jan 69) hasn't been
   digested for a task-org table; the Apr 1969 quarter ORLL is still unlocated entirely.
4. **Ross/Weldin/Winner/Wheeler stub→full upgrade** — flagged last session as having enough
   narrative depth to warrant it; still Michael's call, not made.
5. **Kmit's Haydenville-cemetery connection is unconfirmed** — the Gazette article implies
   he may be memorialized at St. Mary of the Assumption in Leeds, MA, but doesn't say so
   directly.
6. **Build was run by Michael at the end of this session** — I have not independently
   re-verified the render; only front-matter YAML was checked on every new/edited file this
   session (same caveat as Session 102's #6).

---

## Key file locations

| Item | Path |
|---|---|
| Rebuilt profile-builder script | `outputs/build_profile.py` (packaged as `kia-profile-general.skill`) |
| Matthei profile | `soldiers/matthei-peter/matthei-peter.md` |
| Woehnker profile (updated with ORLL research) | `soldiers/woehnker-harrison/woehnker-harrison.md` |
| Woehnker wounding event stub | `events/woehnker-wounding-1968-05-24/index.md` |
| Kmit profile (updated with two new sources) | `soldiers/kmit-chester/kmit-chester.md` |
| Edmonds profile | `soldiers/edmonds-james/edmonds-james.md` |
| Feb 5, 1969 shared event stub | `events/operation-sheridan-sabre-1969-02-05/index.md` |
| 1968 ORLL index (AD391571/AD392381/AD393815) | `sources/orll-1cd-1968/README.md` |
| 2/8 Cav OPCON timeline (new 1969 entry) | `_docs/2-8-cav-opcon-timeline.md` |
| Kmit — 1CDA newsletter tribute doc | `documents/kmit-chester/kmit-chester-1cda-tribute-2021/index.md` |
| Kmit — Gazette article doc | `documents/kmit-chester/kmit-chester-gazette-tribute-2022/index.md` |
| Roster source of truth (Gulley strike, stub fixes, typo fix) | `_docs/d-co-kia-list.md` |
| Generated roster (109 rows) | `_data/kia.json` |

---

## Carried-forward warnings

- **`_data/kia.json` and `_docs/kia-json-qa-report.md` are both build output — regenerate via
  `node scripts/generate-kia-json.cjs`, never hand-edit.** I violated this briefly this
  session (fixing Gulley directly in the JSON) before catching it from the file's own header.
- **Event-to-roster joins are automatic and deterministic** — the generator scans every
  `site/events/*/index.md`'s `casualties.kia[]`/`casualties.dow[]` for a matching slug. Adding
  a soldier to an event's `casualties.kia[]` and regenerating is sufficient; no manual `event:`
  field edit on the roster row is needed or wanted.
- **Skills install via Customize, not Settings > Capabilities.**
- **Zip files must be built in `/tmp`, then copied into the outputs mount** — writing/renaming
  a zip directly in the mounted outputs folder fails intermittently.
- **DTIC AD-number web searches are unreliable** — the same AD number has come back with
  contradictory titles/units/periods across different queries more than once this project.
  Prefer direct `pdftotext` verification of the actual document over trusting search
  snippets.
- **Copyright handling on new source material**: paraphrase substantially; at most one short
  (<15 word) attributed quote per new document. This applies going forward even though some
  older documents in this repo (obituaries, full tribute reproductions) were built under a
  looser convention in earlier sessions — don't extend that older pattern to new sources.
- **Always check `_sessions/` handoffs before treating a source's findings as new.**
