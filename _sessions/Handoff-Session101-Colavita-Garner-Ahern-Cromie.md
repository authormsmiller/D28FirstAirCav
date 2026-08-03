# Session Handoff — 2026-07-17
**Session 101**
**Theme:** Built Audis Garner's profile and corrected the D Co "Angry Skipper" command
chain to include him (Grannemann → Garner → Colavita, not a direct handoff); un-drafted
Raymond Ahern using two independent sources that overturn a prior "clerical artifact"
conclusion, and — per Michael — reframed him as a full D Company soldier rather than an
outside attachment, matching how CPT Colavita himself counted his own men; built a new
profile for Larry Hackett and wired his 2005 Virtual Wall tribute as a real document
under his own name; sharpened PFC Michael Cromie's death with new detail from Colavita's
memoir (engagement, RPG fragments, a candid command anecdote). Colavita's memoir is
turning out to be a major, still-mostly-untapped source — Michael is planning to drop
full chapters next session for systematic mining.

---

## What was completed this session

### Part 1 — Audis Garner profile + D Co command chain correction

Built `soldiers/garner-audis/garner-audis.md` from an obituary Michael linked in chat
(Columbus Ledger-Enquirer via Legacy.com, fetched directly — no file was ever dropped in
`profiles/garner-audis/` except the profile photo). Major (Ret.) Audis Walker "Buddy"
Garner: OCS 1961, two Vietnam tours (1966, 1968), Silver Star, Purple Heart, Bronze Star
w/ Valor + 3 OLC, ARCOM w/ Valor + 2 OLC, Vietnam Cross of Gallantry, Ranger Tab, Special
Forces Tab; retired 1981 from Fort Campbell as Major; taught JROTC 1981–97; OCS Hall of
Fame 2014; died 2016.

Initial identification of "CPT Garner" (named in the digested Skipper Journal, D Co,
filing a malaria-control report 24 Jun 1968) was cautious — treated as probable, role
unclear, possibly serving *under* Grannemann. **Michael then corrected this directly:
per Colavita's own book, the real chain is Grannemann → Garner → Colavita** — Garner
held full company command between the two of them. Corrected across four files:

- `soldiers/garner-audis/garner-audis.md` — upgraded his D Co entry to a `command`-type
  assignment (~Jun–Oct 1968), bracketed between Grannemann's last confirmed date (8 Jun
  1968) and Garner's own first confirmed date (24 Jun 1968 — now understood as him
  signing as commander, not a subordinate).
- `soldiers/grannemann-rodney/grannemann-rodney.md` — handoff target corrected from
  Colavita to Garner; his own confirmed window (24 May–8 Jun 1968) untouched.
- `soldiers/colavita-henry/colavita-henry.md` — now shown succeeding Garner (who'd
  succeeded Grannemann), callsign lineage updated to Scholes → Grannemann → Garner →
  Colavita.
- `documents/colavita-henry/colavita-henry-memoir-company-grade/index.md` — added this
  finding and partially resolved its own open question; flagged that it rests on
  Michael's report of the book's contents, not a pulled quote/page citation yet.

### Part 2 — Raymond Ahern un-drafted, then reframed as D Company (not an attachment)

Michael pasted a passage from Colavita's memoir naming SP4 Raymond Ahern as "Delta's
next casualty under my command" — RTO for the artillery FO attached to D Company, killed
26 Nov 1968 on LZ Rita, bunker took a direct rocket hit. This resolved a long-standing
`soldiers/ahern-raymond/ahern-raymond.md` `draft: true` flag: the profile had been held
back because his official unit (C Battery, 2/19 Artillery, admin. DS to 1st Brigade in
Tay Ninh) seemed to contradict his "D Co, 2/8 Cav" roster line. Fetched the actual
Virtual Wall memorial page (virtualwall.org/da/AhernRJ01a.htm) directly and found **an
independent, second confirmation**: a 07 Dec 2002 tribute stating Ahern was attached to
D Co as the FO's RTO "for most of his tour," reassigned to Rita one day before his death.

Un-drafted and published, with decorations updated from the Virtual Wall's own listing
(Bronze Star w/ Valor, Purple Heart, Air Medal, NDSM, VSM, VCM — replacing earlier
Honor-States guesses).

**Then Michael pushed further:** since Colavita himself counted Ahern as one of his own
men and one of D Company's losses (not a supporting-arm outsider), the archive should
frame him that way too. Reframed across five files — platoon set to `HQ`, his D Co
service now leads the service record (parent artillery battery listed second, for
accuracy only), "attached duty" language replaced with "served with D Company"
throughout:
- `soldiers/ahern-raymond/ahern-raymond.md`
- `events/operation-sheridan-sabre-1968/index.md` (kia_note + prose)
- `events/operation-sheridan-sabre-1968-11-26/index.md` (new page, see below)
- `locations/fsb-rita/index.md`
- `soldiers/colavita-henry/colavita-henry.md`

Built new: `events/operation-sheridan-sabre-1968-11-26/index.md` — a full event page for
the rocket attack (relief-in-place timeline, the ten-day sweep, the attack itself),
modeled on the existing `operation-sheridan-sabre-1968-12-04` precedent.

### Part 3 — Larry Hackett: new profile + his tribute as its own document

Michael corrected the wiring here too: Hackett's tribute to Ahern (which Colavita's book
also reproduces) should be **its own document, attributed to Hackett, under his own
soldier profile** — not folded into Colavita's material. Found Michael had already
dropped a photo + notes file in `profiles/hackett-larry/`. Built:

- `soldiers/hackett-larry/hackett-larry.md` — thin profile (Range Platoon, D Co, 1968-69;
  no rank/MOS/hometown sourced yet), built almost entirely from his own tribute and
  Colavita's brief mentions of him. Notes he later died of cancer (per Colavita, learned
  secondhand at a Wall reunion); Colavita's own Agent-Orange speculation is preserved as
  speculation, not asserted as fact.
- `documents/hackett-larry/hackett-larry-tribute-ahern-raymond/index.md` — his full 2005
  Virtual Wall tribute, reproduced verbatim with attribution. **Judged safe to quote in
  full** (per Michael) because it's independently, permanently posted by its own author
  on a public memorial site — not solely dependent on reproducing Colavita's copyrighted
  book. `contains: [hackett-larry, ahern-raymond]`.
- Photo copied to `soldiers/hackett-larry/photos/profile/`.

### Part 4 — PFC Michael Cromie: engagement detail + a command anecdote

Michael added two more facts from the memoir:

1. Cromie's 18 Nov 1968 death was **an engagement** (direct contact, not a standoff
   shelling) and he was **hit by RPG fragments** — sharper than the prior "hostile
   indirect fire (artillery/rocket/mortar)" framing. Purple Heart moved from
   `decorations_unconfirmed` to confirmed on this basis.
2. A candid anecdote: Colavita, still new to command, didn't realize Cromie was dead
   until he casually asked a platoon leader where he'd been (wondering if he was on
   R&R) — and was told Cromie had been dead for a few weeks. No exact date given;
   placed on Colavita's own timeline as an approximate December 1968 entry, tagged
   "Reflection."

Cromie's 18 Nov death now **predates** Ahern's 26 Nov death within Colavita's own
command (which began Oct 1968) — flagged as the likely (not confirmed) earlier,
unnamed casualty Colavita's book references when introducing Ahern as "Delta's next
casualty under my command." Updated: `soldiers/cromie-michael/cromie-michael.md`,
`soldiers/colavita-henry/colavita-henry.md` (new Nov 18 timeline entry, ahead of the Nov
26 one), `events/operation-sheridan-sabre-1968/index.md`, and the memoir document.

### Part 5 — Copyright handling ground rules (discussed, not just applied)

Michael raised this directly: he doesn't want to quote Colavita's book too liberally,
but some information isn't available anywhere else. Agreed approach, applied
consistently above:
- **Facts** (names, dates, unit assignments, sequences of events) → extract and
  paraphrase in the archive's own words, cited as "per Colavita's memoir" or "per
  Michael." Not copyrightable, safe to state plainly.
- **Scenes/voice** (where the book's specific phrasing carries the weight) → at most a
  short quoted phrase, heavily outweighed by paraphrase around it.
- **Third-party tributes reproduced in the book** (like Hackett's) → prefer sourcing
  directly from their original independent public posting (Virtual Wall) and attribute
  to the actual author, rather than treating them as part of Colavita's copyright.

---

## Pending / next priorities

1. **Michael is planning to drop full "Angry Skipper" chapters from Colavita's book next
   session** for systematic mining — he described this as "a wealth of information."
   Next session should: read the dropped material, extract facts for profiles/events (D
   Co roster names, dates, locations, KIAs) using the rules in Part 5, flag anything
   quote-worthy for a judgment call before reproducing it, and hold larger inserts until
   Michael confirms scope/placement — the standing instruction pattern this session
   (Michael narrates a fact → it gets integrated; Michael pastes an existing public
   tribute → it can be reproduced with attribution) should carry forward.
2. **Garner's command dates are still approximate** — bracketed only between 8 Jun 1968
   (Grannemann's last confirmed date) and 24 Jun 1968 (Garner's first). Exact start/end
   not sourced; worth firming up once more of the book is available.
3. **Colavita's own D Co command end date** — still "April or May 1969," unconfirmed
   (carried from Session 100/earlier this session).
4. **~7 minutes of Colavita's oral history video remain untranscribed** (carried from
   before this session).
5. **St. Barbara's true coordinates remain unconfirmed** (carried forward; do not use
   the 199th LIB "FB Barbara" coordinate — confirmed false match).
6. **A company/battery-level primary source** (2/8 Cav or 2/19 Arty daily journal, NARA
   RG 472) would still independently corroborate the Ahern and Cromie firsthand accounts
   — division-level ORLLs don't itemize either incident.
7. **Hackett's rank, MOS, hometown, and exact death date** are all unsourced — his
   profile is built almost entirely from his own tribute and Colavita's brief mentions.
8. Site was rebuilt and spot-checked after every change this session (`npm run build` →
   594 files, zero errors each time) but **not deployed** — deploy remains Michael's own
   manual step (per Session 100's finding: local build → separate `wrangler deploy`,
   nothing here auto-deploys from git).

---

## Key file locations

| Item | Path |
|---|---|
| Garner profile | `soldiers/garner-audis/` |
| Ahern profile (un-drafted, reframed) | `soldiers/ahern-raymond/ahern-raymond.md` |
| Hackett profile + photo | `soldiers/hackett-larry/` |
| Hackett's tribute (real document, full text) | `documents/hackett-larry/hackett-larry-tribute-ahern-raymond/index.md` |
| Cromie profile (engagement/RPG update) | `soldiers/cromie-michael/cromie-michael.md` |
| Colavita profile (chain correction + new timeline entries) | `soldiers/colavita-henry/colavita-henry.md` |
| Colavita memoir document (all book-derived facts logged here) | `documents/colavita-henry/colavita-henry-memoir-company-grade/index.md` |
| New event page — Ahern's death | `events/operation-sheridan-sabre-1968-11-26/index.md` |
| Parent Sheridan Sabre event (Ahern + Cromie both updated) | `events/operation-sheridan-sabre-1968/index.md` |
| FSB Rita location page (Ahern added) | `locations/fsb-rita/index.md` |
| Grannemann profile (handoff target corrected) | `soldiers/grannemann-rodney/grannemann-rodney.md` |

---

## Carried-forward warnings

- **Stale-bash-mount-truncation** — not hit this session (used Edit tool throughout
  without incident), but still a documented recurring hazard per Sessions 98–100. If
  bash/node ever shows a file truncated right after an Edit-tool write while the Read
  tool shows it complete, rewrite via a bash heredoc rather than trusting the mount.
- **`service_record.assignments[].notes` and the top-level admin `notes:` field are
  never rendered publicly** — confirmed again this session. Only `timeline`, `photos`,
  and real `site/documents/<slug>/<docSlug>/index.md` records show up on the live page.
  Any fact meant to be visible to visitors must go into a `timeline` entry, not just
  service-record or admin notes. This bit us on Grannemann in Session 100 and was
  re-applied correctly throughout this session (e.g., Colavita's Nov 18/Dec 1968
  entries, Ahern's D Company reframing all landed in `timeline`, not just notes).
- **Only the real `site/documents/<slug>/<docSlug>/index.md` system renders in the
  Documents tab** — the rich inline-object `documents:` format (Gibney/Grannemann/
  Scholes-style) is inert. All new documents this session (Garner's obituary, Hackett's
  tribute) used the real system.
- **Live site build/deploy is manual and separate from git** — local `npm run build` →
  `_site/`, deployed separately by Michael. Don't assume a rebuild here means the public
  site is updated.
- **Always check `_sessions/` handoffs before treating a source's findings as new** —
  standing process lesson, unchanged.
