# Cross-Reference & Scrape Verification — Skipper Daily Journal (Jun–Jul 1968)

*PHASE-3 TEST. Generated from `skipper-journal-jun-jul-1968.digest.json`. Purpose: confirm the digest scrape captures a Daily-Journal genre properly, and exercise the cross-reference passes on a high-fidelity source.*

**Triage:** primary daily journal · **company** echelon · daily granularity · veteran transcription (clean text) · D Company named throughout.
**Headline:** this genre scrapes *better* than the division ORLL — clean text, grid coordinates, platoon-level detail, and individual casualties. The catch is the opposite of OCR: **transcription noise** and a heavier **date-of-action vs date-of-record** reconciliation load.

---

## Pass 1 — KIA in range (roster vs journal)

The journal names **no individuals** — it gives date, time, grid, and circumstance. All matches below are date + unit (D Co) + circumstance inferences → **candidates to verify, not assertions.** But Delta-Company specificity makes them strong.

Journal records **3 US KIA**: 4 June (carried MIA, recovered/identified 7 June), 5 June, 1 July. Roster D-Co KIA in the window: Weldin (6-06), Winner (6-07), Wheeler (6-12), Ross (7-01).

| Roster KIA | Roster DOD | Journal event | Grade | Reasoning |
|---|---|---|---|---|
| `ross-robert` (SGT Robert Ross) | 1968-07-01 | 1 Jul, YD293319, WIA 0930 → KIA 1230 | **strong** | Date exact, D Co, single KIA that day. Enrichment: grid, time, circumstance (contact w/ 2–3 NVA). *Note: Ross's DOB is 1947-07-01 — killed on his 21st birthday.* |
| `winner-brian` (PFC Brian Winner) | 1968-06-07 | 4 Jun MIA, **recovered/identified 7 Jun** (YD325391) | medium | Roster date = the **recovery/identification** date (7 Jun); the journal shows the man was **killed 4 Jun** and carried MIA until the body was recovered. Classic date-of-record vs date-of-action offset. |
| `weldin-jacob` (SGT Jacob Weldin) | 1968-06-06 | 5 Jun, YD325393, WIA 1745 → KIA 1755 | medium | Roster date one day after the action; likely the same man. Flag the offset. |
| `wheeler-john` (PFC John Wheeler) | 1968-06-12 | — (no coverage) | none | Died 12 Jun during the **untranscribed 10–18 Jun gap** (LZ Betty base defense). Honest gap, not a miss. |

**This resolves cleanly:** 3 journal KIA ↔ Weldin + Winner + Ross (all in transcribed windows); Wheeler falls in the gap. None have profiles or event pages yet — all four are stub/enrichment opportunities.

## Pass 2 — Casualty reconciliation

The journal's self-tally ("3 US killed and four wounded... ten enemy... one POW") **matches the digest** (3 KIA, 4 WIA + 1 scout dog, 10 enemy KIA, 1 POW).

**Reconciliation model:** do **not** treat the journal date as the true date-of-action to "correct" the Wall against. The daily journal was kept **in the rear, not with the company in the field** — the note-takers logged what the field element reported, when it reached them over the net. Tactical traffic came through fast; **personnel and casualty status lagged**, because accurate accounting of who was hit, and whether KIA/MIA/WIA, trailed the fighting. So a casualty entry can be logged when the rear *learned* the status, not when it happened. That means **both** records are lagged administrative artifacts:

- **Operational data** in the journal (contact time, grid, materiel, movement) comes off the radio net in near-real-time → **high confidence.**
- **Personnel/status data** (who, and KIA vs MIA vs WIA) lags on the journal side, *and* the Wall/DCAS date reflects a separate official-determination lag.

So a casualty typically has **three dates** — action, journal-logged, and Wall-of-record — none guaranteed equal. Match by **circumstance + proximity**, record all three with their source, and **flag the spread; never auto-align to one.** The 4 June man (killed in the action, carried MIA, only resolved to KIA on the 7th) is the model case: the *action* is firmly 4 June from real-time net traffic, but the *status* resolved days later — the rear-reporting lag in plain view.

## Pass 3 — Locations (the DJ's superpower: grids)

Unlike the ORLL, this source gives **grid coordinates directly.**

| Site | Status | Action |
|---|---|---|
| LZ Carol | in gazetteer (`FB Carol` YD344194, 1968) | confirm; add journal as source |
| LZ Betty | known (`contact-lz-betty-1968-03-15` event) | confirm |
| LZ Anne, LZ Pedro, LZ Green | not in 2/8 gazetteer | **new-site candidates** — but the journal gives operating grids (Green ≈ YD300431; Anne ops ≈ YD285328) → higher-quality candidates than the ORLL ever produced |
| ~20 action grids (YD324393, YD293319, …) | operational fixes | feed the gazetteer / event maps |

## Pass 4 — Contact events (propose)

No June–July 1968 event pages exist. Propose:

- `contact-yd324393-1968-06-04` — the 4–7 June bunker-complex action vs 10th Sapper Bn (1 KIA/MIA + WIA; ties to Winner).
- `contact-1968-06-05` — 5 June KIA (ties to Weldin).
- `contact-1968-06-30` — 30 June (1 WIA + scout dog KIA).
- `contact-yd293319-1968-07-01` — 1 July (ties to Ross).

**Addendum (2026-07-15, post-build review):** this pass originally proposed
only the four KIA-tied contacts above, on the assumption that non-fatal
contacts weren't event-page-worthy. Michael flagged this as wrong — no-KIA
contacts get pages too (precedent: `contact-1968-06-30` above, and 1971 events
like `bunker-complex-1971-06-24`). Four more incidents in this digest were
missed by this pass and have since been built:

- `contact-yd324398-1968-06-04` — 1210 hrs, friendly artillery WIA (separate incident from the 1345 hrs bunker contact same day).
- `contact-yd353475-1968-06-20` — booby-trap WIA + the month's only POW detention (YD347482, same day).
- `contact-yd288321-1968-06-26` — S/A contact, no casualties either side.
- `contact-1968-06-28` — 1st Plt contact, 1 NVA KIA, no US casualties; also the "White Skull" personnel lead (Pass 5).

**Schema/behavior note for the skill:** Pass 4 should propose an event page
for *every* `contact`, `casualty_medevac`, and comparable incident-type entry
in the `events` array by default, not just ones that resolve to a roster KIA.
Absence of a fatality is a reason to note "no casualties" in the page, not a
reason to skip the page.

## Pass 5 — Personnel (roster/stub candidates)

Officers named: **LTC Gibney** (CO 2-8 Cav), **CPT Grannemann** (D Co), **COL Stannard** (CO 1st Bde), **CPT Garner**, **Lt Kingston**. Plus nicknames "White Skull" (MG gunner) and Tommy "Smiley" Harris (photo). These are command-chain data — high value for unit-history, and stub candidates (ask before creating).

**Correction (2026-07-16):** the digest originally transcribed the 8 June brigade-CO name as "COL Standard." Michael identified this as LTC John Edward Stannard — CO 2/8 Cav 30 Jul 1967-early Feb 1968, promoted to Colonel and CO 1st Brigade from early Feb 1968 (site already has a full profile: soldiers/stannard-john). Rank, timing, and brigade all match exactly; this is not a stub candidate but an enrichment to an existing profile. Corrected in the digest.json personnel and events entries.

**Correction (2026-07-16):** the digest also originally transcribed the D Co command element's name as "CPT Grannamann." Michael identified this as CPT Rodney Floyd Grannemann, per his Silver Star citation (Hq, 1st Cav Div, General Orders No. 3649, 22 Jun 1968), which names him "Company Commander of Company D, 2d Battalion (Airmobile), 8th Cavalry Regiment" for gallantry on 24 May 1968 — two weeks before this journal entry, same unit and command role. This one *is* a new stub: built as `soldiers/grannemann-rodney` (status: researching). Corrected in the digest.json personnel and events entries.

## Pass 6 — Enemy intel

**10th Sapper Battalion (NVA)** — the battalion's assessed opponent; journal gives its 4 June CP/company grids. Feeds unit-history / context.

---

## Scrape completeness & accuracy check ✅

| Check | Result |
|---|---|
| All US casualties captured | ✅ 3 KIA, 4 WIA, 1 scout dog — matches the journal's own tally |
| All LZ names | ✅ 5 (Anne, Betty, Pedro, Green, Carol) |
| All operational grids | ✅ ~20 captured with their events |
| All named personnel | ✅ 7 |
| Enemy unit | ✅ 10th Sapper Bn |
| Coverage gap acknowledged | ✅ 10–18 June flagged (explains Wheeler) |
| Faithful to source | ✅ transcription quirks preserved, not silently "fixed" |

## What this test teaches the skill (schema/behavior notes)

1. **The digest needs `time` (HHMM) and `grid` (MGRS) fields for the DJ genre** — added here; they're optional/null for ORLLs. Same schema, finer fields populated.
2. **WIA→KIA transitions within a day** (4 Jun, 5 Jun, 1 Jul): the same man appears first as WIA then KIA. The scrape must **not double-count** — captured as one casualty with a state note. A cleaner model would link the transition explicitly.
3. **Three dates, not two — and the journal is not ground truth.** The daily journal was kept in the rear off delayed field reporting, so its personnel/status data lagged. Separate the journal's **operational** fields (real-time, high confidence) from its **personnel/status** fields (lagged). A casualty carries action / journal-logged / Wall-of-record dates; match on circumstance + proximity and flag the spread — never auto-align to any one. This is a bigger and subtler reconciliation load than the ORLL genre implied.
4. **Transcription noise, not OCR noise, is the risk here:** the source inconsistently types grid prefixes (`TD353475` vs `YD…` in the same AO) and has minor typos ("VIV", "Ar 1210", "96)"). The scrape should **normalize grids cautiously and flag**, not silently correct — the raw note stays authoritative (same principle as the gazetteer).
5. **Verdict:** the digest approach handles this genre well — arguably the best-yield source we've tested. The pipeline's job on a DJ is less about extraction difficulty and more about disciplined reconciliation (dates) and faithful noise-handling (grids).
