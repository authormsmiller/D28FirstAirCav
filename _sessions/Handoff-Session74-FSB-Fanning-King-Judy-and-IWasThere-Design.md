# d281staircav — Session 74 Handoff
**Date:** June 22, 2026
**Continues from:** Session 73 (CAVALAIR sweep; Dog's Head; Wiseman; FSB Silver / Garvin v04 deck)
**Theme:** Processed Jim Garvin's **v06_fanning** deck into three live location pages (**FSB
Fanning, FSB King, FSB Judy**), reconciled their coordinates and dates against the firebase
gazetteer, established a **platoon-vs-battalion dating principle**, fixed a `location.njk`
template gap, and held a **design discussion on an "I was there" / profile-claim feature** —
which we decided to **defer** in favor of manual, Facebook-comment-driven updates for now.

---

## What this session built / changed

### FSB Fanning / King / Judy — Garvin v06_fanning deck (Silver/Fontaine pattern)
- **3 location pages:** `locations/{fsb-fanning,fsb-king,fsb-judy}/index.md`.
- **12 photos** extracted from the deck (6 Fanning / 4 King / 2 Judy) into
  `soldiers/garvin-jim/photos/locations/{fsb-fanning,fsb-king,fsb-judy}/`, each with an
  `index.md` photo index. Tagged `fsb: <slug>` so they surface on the location pages via `byFsb`.
- Slide handling per Michael's instructions: **slide 1 ignored**; **slides 3 & 4 are the same
  photo** (deduped, captions merged); slide 8 (Hwy 1) filed under Fanning; slide 11 tied to King
  by the shared ammo-box stack.
- **`contains`:** Fanning → garvin-jim, collins-gary; King → graham-ray, guidara-frank, bacon-wg;
  Judy → none identified. (collins-gary renders as "Collins Gary · No profile yet" — its stub has
  no `slug:` field, so the present-card macro can't match it; same as on the Silver page.)
- Build clean (350 files). **NOT yet deployed** — see Carry-forward.

### Coordinate / date reconciliation (firebase gazetteer, refs 377/394 = military-registry, confirmed)
- **Fanning** — YS 751 995 (10.8436, 107.5123); 2/8 Cav **8 May – 20 Aug 71**. A second survey
  **YS759987** (10.8365, 107.5195) covers a 5–14 Jul 71 Operation Overlord period. **Named for
  Martin V. Fanning** (KIA 24 Apr 71) — gazetteer note "For Martin V. Fanning USA KNBC 24Apr71";
  linked to existing soldier `fanning-martin`.
- **King** — YS 898 858 (10.7187, 107.6456); 2/8 Cav **20 May – 1 Jun 71**. **Dismantled 1 Jun**
  (McGrew calendar "Dismantled FSB King" + gazetteer end date). Split off from Fanning.
- **Judy** — YT 662 042 (10.8868, 107.4313); 2/8 Cav **30 Jun – 1 Aug 71** (battalion window).
  Garvin's photos + McGrew's "CA to FB Julie" both date **4 Jun 71** (Range Platoon visit).
  **NAMING:** the gazetteer lists this position as **"Judy"** and has **no "Julie" entry**, so
  **Judy is the correct name** and McGrew's "Julie" is a calendar mis-transcription (Michael's call).

### Platoon-vs-battalion dating — STANDING PRINCIPLE (new)
- Gazetteer dates are **battalion-level** (2/8 Cav). Garvin and McGrew record **Range Platoon's**
  own movements. Because platoons occupied and left bases on their own schedules, platoon dates
  routinely differ from the battalion window — **treat the gap as expected, not as an error to
  reconcile.** (e.g., King: another platoon likely held it from 20 May while Range arrived ~24 May.)
- **Michael's anchoring example:** his dad's early-Feb-71 letter — **Cat Platoon stayed at FSB
  Silver an extra day** to finish the teardown.
- Applied in the Judy and King page notes/open-questions this session.

### Template fix — location.njk
- `related_bases.split_into` was a **documented schema field that was never rendered**. Added
  rendering (and cleaned a dangling "·" separator after `split_from`). Fanning now shows
  "Split into King"; King shows "Split from Fanning." Patched via python on the bash mount, rebuilt
  clean (per the standing truncation rule — do not trust Edit/Write on built repo files).

---

## DESIGN DISCUSSION — "I was there" / profile claim (LOGGED, DEFERRED)

Explored a feature letting veterans/family mark their presence at a location or event.

**Foundation already present:** location pages have a "Soldiers present" tab split into
**Confirmed / Circumstantial** tiers, and the confirmed note already reads "Tied here by a letter,
photo, account, or *'I was there' submission*." Presence flows from `contains`/`tagged` + the
`byContains`/`byFsb`/`byEvent` reverse maps. So "I was there" is the missing *input path* to an
existing display.

**Proposed mechanism (Michael):** tie a soldier slug to the visitor in localStorage; an
"I was there" onClick writes a `{ target, slug }` record; Michael pulls these at intervals and on
approval writes the slug into the target's front-matter `contains` (he leans `contains` over an
overlay). This is essentially the **existing photo-ID-proposal pipeline** (`admin/lib/proposals.js`
+ `admin/lib/frontmatter.js`): public submit → R2 `pending/` → admin review → front-matter write,
with pending/held/approved/dismissed states. `frontmatter.js` does a safe YAML parse-mutate-write,
which also sidesteps the truncation gremlin.

**Architecture worked out — three data planes:**
- **Public / git:** only the approved result (the slug in `contains`). Nothing private or churny.
- **Private / R2 submissions:** the real work — contact info, geo/IP, timestamps,
  pending/approved/withdrawn state, claim registry.
- **Client / localStorage:** identity + cached button state only; never authoritative.
Two linked record types: a **profile claim** (identity + contact + geo → feeds Garvin's roster and
claim-once) and an **"I was there" presence claim** (claimant + target + geo + timestamp → feeds
`contains`); the first-time flow bundles both.

**Considerations Michael raised:**
1. Capture **non-shareable contact info** (helps Garvin update his roster) — stays in the private
   R2 record, never in a built file; exportable as a roster feed.
2. **Claim-once vs cross-device** — cannot be enforced in localStorage (per-device, bot-clearable);
   needs a **server-side claim registry** (R2) keyed by slug. Bots deterred by review + Cloudflare
   Turnstile + rate-limiting + geo, not localStorage. Mobile-then-desktop = re-select your entry,
   server links it to the existing claim.
3. **Click timestamps** — capture `created_at` now (free, can't backfill); use TBD.
4. **Pending toggle + Cancel** — three per-visitor states (button / "Pending" + Cancel / "✓ listed").
   Pre-approval cancel = delete the pending R2 object (approve step re-reads the object so a
   cancelled one is skipped). Post-approval cancel = a **removal request** — reuse the existing
   skipper-stories `/request/?type=removal` path against `contains`.
5. **Browser geo/IP** — free via Cloudflare `request.cf` (country/city/region/timezone + IP + UA);
   stamp every claim so the review screen can bin obvious fakes ("claim on davis-kirk from Yerevan").
   It's a **signal, not proof** (VPNs, travel) — flag, don't auto-reject; keep private; disclose on form.

**Key reframe (login):** Michael flagged that the cobbled-together approach has security holes and
wondered if a **full login system** is needed. Conclusion: **authentication proves "controls this
account," not "is the real 1971 soldier."** Identity-proofing a specific 75-year-old veteran against
a 1971 roster stays a **manual** judgment (Michael/Garvin) regardless of auth. Auth's real value is
narrower — **persistent cross-device identity + verified contact** (helps #1/#2/#4). If accounts are
ever pursued, use **managed passwordless (magic link) or social (Facebook) sign-in**, NOT a custom
username/password system (bad fit for a 74–82-yr-old audience; PII/credential liability for a near-
solo maintainer). No-auth (Turnstile + review) still keeps the **public archive** safe because
nothing reaches `contains` without review. The review pipeline is identical whichever path, so
deferring auth costs no rework later.

**DECISION:** **Defer the entire feature for now.** Michael will update `contains`/`tagged`
**manually** as Facebook comments come in about specific events/locations. Revisit auth/automation
later if volume justifies it.

**WORKED EXAMPLE (manual FB-comment update, 22 Jun 2026)** — event
`events/duds-firebase-fontaine-1971-03/`:
- Facebook feedback: **Norm McDonald** (Range, no profile yet) and **Kirk Davis** both said they
  remember the incident. Added both to the event's `contains` (confirmed presence): Davis links to
  his profile (`davis-kirk`); McDonald renders as a named fallback card (`slug: mcdonald-norm` +
  `name: "Norm McDonald"`) since he has no profile yet.
- **Date narrowed to 6-9 March 1971** and set as `date: "1971-03-06"` + `date_end: "1971-03-09"`
  (hero now shows the range). Reasoning, recorded in `date_note` + `archivist_notes`:
  - EARLY bound — McDonald officially joined the unit **6 Mar 1971**.
  - LATE bound — the account ran in CAVALAIR Vol. 5 No. 10 (10 Mar 1971); period production
    (physical typesetting, two-color masthead, ~8-10 hr copy-to-press lead) means it could not
    have happened later than ~early morning **9 Mar** and still made that issue.
- This is the template for future manual updates: add the man to `contains` (with `name` if no
  profile), drop the provenance in the note, refine dates in `date`/`date_end` + `date_note`.

**Stub created:** **Norm McDonald** (`soldiers/mcdonald-norm/`, Range, `arrived: 1971-03-06`,
status researching, linked to the Duds event via `related_events`). His card now links.
**MAJOR FUTURE SOURCE:** Michael holds period photographs and a book of in-country letters
McDonald wrote — to be processed into a full profile down the road.

---

## DTIC / Texas Tech sweep for Fanning / King / Judy (22 Jun 2026) — logged, low priority

Re-searched the institutional archives for anything tied to the three new FSBs that the original
passes missed. **Result: nothing names Fanning, King, or Judy.** General web has no coverage of
these bases (expected). Pulled four DTIC PDFs (now in the `locations/` folder) and full-text
searched them, including OCR-garbled spellings — confirmed misses:
- **AD0530055** — Lessons Learned, HQ 3rd Bde (Separate) 1st Cav (13 Nov 71). Right period; thematic
  only (CI sweeps, FSB closing). Names FSB Pace, not ours.
- **AD0520447** — BG Jonathan Burton senior-officer debrief, 3rd Bde (Separate) (13 Nov 71). Right
  period. Useful context (below), no base names.
- **AD0523510** — Senior Officer Debrief, 3rd Bde (25 Jun 72): covers mid-Dec 71 -> 1972. WRONG
  (later) period.
- **AD0509007** — Lessons Learned, 1st Cav DivArty: reads as 1970. WRONG period. Names FSB Ike, Alice.

These are brigade/division-level reports — one level too high to name individual firebases.

**Context they DO confirm (kept for possible later use, NOT folded into the pages):**
- Parent unit = **3rd Brigade (Separate) 1st Cav, the "Garryowen Task Force"** (activated 30 Apr 71);
  four maneuver battalions **2/5, 1/7, 2/8, 1/12 Cav** + OPCON 2/11 ACR; AO Binh Tuy / Long Khanh /
  Phuoc Tuy (~3,500 sq mi).
- **"Leave FSBs intact for reuse" policy** (AD0520447) — corroborates the Fanning->King split and base
  reuse; "relocated major FSBs near roads" matches Garvin's road/convoy notes and Fontaine.
- CI sweeps on base closings instituted Jul 71 (relevant to Judy closing ~1 Aug).

**Where the base names actually live (confirmed):** NARA RG 472 — the **2/8 Cav daily staff journals
(DA Form 1594) and duty logs** — already on the carry-forward, not the DTIC Lessons Learned. Also
unread by text search: AO **map overlays / "Inclosure 1"** (firebases often plotted by name) —
likely image pages AD0523510 p.36 and AD0509007 p.4.

**Op Overlord note still open:** the gazetteer's "Fanning, 5-14 Jul 71, Op Overlord (1 ATF)" remains
unconfirmed — the Australian Operation Overlord was 6-14 *June* 1971 (AWM / Battle of Long Khanh).
Possible Jun/Jul transcription slip; none of the four DTIC docs mention Overlord.

**Decision:** operations/lessons-learned material is interesting but unlikely to trigger living-vet
feedback (Michael's call) — do not mine these further for the FSBs right now; revisit if another use
arises. PDFs retained in `locations/`.

## CARRY-FORWARD
- **DEPLOYED 22 Jun 2026 (Michael).** R2 backfill (12 FSB photos) + `npm run build` + `wrangler
  deploy` all run; everything from this session is LIVE — the FSB Fanning/King/Judy pages and photos,
  the Duds event update (Davis + McDonald added; date 6-9 Mar 71), Norm McDonald's stub, and Kirk
  Davis's anecdote.
- **HOLD — FSB Silver:** do NOT touch the Silver page or write the platoon-vs-battalion methodology
  note yet — Michael wants the **exact Silver teardown dates pinned first** (the Cat Platoon
  extra-day detail anchors it).
- **Fanning open Q:** reconcile the 5–14 Jul 71 re-survey coordinate (YS759987) — move or re-reading?
- **King open Q:** confirm "Col. Bacon" (`bacon-wg`) vs the late-1970 "Chuck Chuck" commander;
  identify the unnamed "Top Miller ?" in the slide-10 log photo.
- **Judy open Q:** Range Platoon's full window vs the battalion 30 Jun–1 Aug gazetteer window; namesake.
- **"I was there" feature:** deferred; manual FB-driven updates for now (see design discussion above).
