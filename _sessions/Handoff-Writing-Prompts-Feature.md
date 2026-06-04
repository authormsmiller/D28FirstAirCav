# Handoff — Writing Prompts Feature (Skipper Stories)

**Date:** 2026-05-28
**Branch:** `admin/2026-05-22` (continuing)
**Repo:** `https://github.com/authormsmiller/d281staircav`
**Deploy:** `npx wrangler deploy` from `site/`. Push via GitHub Desktop only.

---

## Origin

This session began by reviewing the 4/20/71 survey config built in Session 47 (`site/_data/surveys/contact-fsb-fontaine-1971-04-20.json`) and identifying a strategic gap: event-specific surveys require a respondent to have been at a specific engagement. The pool of potential respondents is small, the emotional stakes are high, and open-ended contributions are likely to be rare.

The alternative: a dedicated section of the site built around lighter, universal prompts that any D Company veteran can answer — regardless of platoon, role, or whether they were at any specific event. These prompts lower the barrier to first contact, build trust, and create a return-visit destination where published stories recruit more stories.

---

## The Concept: Skipper Stories

**Name:** Skipper Stories
**Named for:** "Angry Skipper" — D Company's call sign. Inclusive of all ranks and MOSs. An officer, a door gunner, a medic — all Skippers.

**Purpose (in priority order):**
1. Low-barrier entry point for veterans who wouldn't otherwise contribute
2. Published community space — stories visible to other visitors, creating a return-visit dynamic
3. Contact information collection (secondary goal — email/phone captured at submission)
4. Source layer feeding soldier records over time (connection to soldier slugs handled post-submission by archivist, not at submission time)

**Tone:** Lighter than the rest of the site. Reunion table, not archive room. The prompts should sound like someone asking at a gathering — curious, a little playful, no obligation.

**Key insight:** Veterans tend to share amusing, relatable stories more readily than combat accounts. Easy stories first build trust. The heavier material, if it comes, comes later. The section is also designed for people to check back regularly as new stories appear.

---

## Tab Structure

### Tab 1: WTR? (What the Ruck?)

*Gear, food, load, the physical daily grind.*

**Prompts:**
- What was the one non-issue item that went in your ruck no matter what? The thing that weighed too much but wasn't negotiable.
- What was your go-to C-ration combination, and what did you add to make it edible? What was the pack you tried to trade away the moment you saw it?
- What did you eventually figure out to drop from your load — and what did you add that wasn't on any issued list?
- What piece of issued gear did everyone in your platoon quietly modify, and how?
- Where and when did you get your best sleep in Vietnam?
- What was the first thing you did when you got back to the firebase after a patrol?

**Notes:** The C-ration and rucksack questions are the strongest anchors — universal, specific, almost guaranteed to produce a story. The tab name is a deliberate play on a coarser rhyming phrase — meant to evoke a chuckle and an immediate desire to see what's inside.

---

### Tab 2: Cast & Crew

*Nicknames, personalities, characters, unit dynamics.*

**Prompts:**
- What was your nickname in the unit? Who gave it to you, and does the story behind it still track?
- Who was the guy in your platoon that everyone went to when something needed fixing — gear, a situation, a morale problem? What did he do that nobody else could?
- Who was the character — the one guy whose stories always got told at reunions? What's the one you'd tell?
- Who surprised you? Someone who seemed one way and turned out to be completely different when it mattered.
- Who kept everyone loose when things got heavy? What did he do?
- Is there someone from your time with D Company you've thought about over the years and never been able to track down?

**Notes:** The last prompt does double duty — it's a story prompt and a contact thread. A submission here might accidentally reconnect two people who haven't spoken in fifty years.

---

### Tab 3: Mail Call

*Letters, care packages, cassette tapes, the connection to home.*

**Prompts:**
- What was the one thing you requested most in your letters home?
- Do you remember a specific letter, care package, or cassette tape that shifted the mood of your squad or platoon when it arrived?
- Who was the best correspondent — the person back home whose letters everyone ended up hearing parts of?
- What did you write home about, and what did you leave out?
- Did you ever get something in a care package that made no sense for where you were — something that made you laugh?
- Joe Kint received formal English assignments from an 8th grade class throughout his tour. Other soldiers in his unit wanted to read them. Did you receive anything unexpected that became something the whole platoon shared?
- What did mail call feel like on a day you didn't get anything?

**Notes:** "What was the one thing you requested most" came directly from archive research — Marvin Miller's letters home frequently requested Kool-Aid packets, snack pack puddings, and cookies (which he knew would arrive as crumbs but appreciated anyway). A natural follow-up prompt worth considering: *What did you do to make the water drinkable?* — anyone who used iodine tablets knows why Kool-Aid packets were worth their weight.

---

### Tab 4: The Locals

*JoJo, Vietnamese civilians encountered, interpreters, Kit Carson scouts, children, animals adopted or encountered in the field.*

**Prompts:**
- JoJo was a monkey who lived at one of the D Company firebases. Do you remember JoJo — how he came to be there, how the men treated him, what happened to him?
- Were there other animals — at any firebase or on any operation — that the unit adopted or that just showed up and stayed?
- Did you have an interpreter or Kit Carson scout attached to your unit? What do you remember about him?
- Did you interact with Vietnamese civilians — in villages, on patrol, at the wire — in a way that stayed with you?
- Children gathered near the firebases. Do you remember a specific interaction with a Vietnamese child?
- What surprised you most about the Vietnamese people you encountered — something that didn't match what you expected going in?

**Notes:** JoJo has enough material on his own to anchor this tab and potentially warrant his own profile page — treat him as the lead prompt. The tab covers both animal mascots and human encounters because they share the same function: the non-American presences in soldiers' daily lives that almost never make it into the official record. The Chieu Hoi event already in the archive (photographs, named soldiers, documented incident near Highway 331) is a natural companion piece to the civilian encounter prompts.

---

### Tab 5: The AO

*FSB life, the bush, field postings, operational terrain.*

**Prompts:**
- Which firebase did you spend the most time on? What do you remember most about it — the layout, the smell, the sounds at night?
- What did the jungle sound like before first light?
- What was the strangest or most unexpected thing you came across on patrol?
- Every firebase had its own personality. What made yours different from the others you passed through?
- Relay Mountain had a reputation. What do you remember about being posted there?
- What did it feel like to come back to the wire after a long patrol?
- What's something about operating in that terrain that you've never been able to fully explain to someone who wasn't there?

**Notes:** Deliberately grouped with R&R — the AO and the beach are opposite emotional registers, but both are place-based and sit naturally together ahead of the homeward-facing tabs. Relay Mountain is called out by name because it was a known posting with its own character.

---

### Tab 6: R&R

*Vũng Tàu, the rear at Biên Hòa, in-country and out-of-country R&R.*

**Prompts:**
- Where did you go for R&R, and what's the first thing you did when you got there?
- What do you remember about Vũng Tàu — the beach, the strip, a specific bar or meal?
- What was the hardest part about going back to the field after R&R?
- What did the rear feel like after time in the bush — did it ever feel normal, or always slightly wrong?
- Did anything happen on R&R that you've dined out on ever since?

**Notes:** The Vũng Tàu bar list compiled in the locations file (Tommy's, The Lucky Strike, The Beachcomber, The Kangaroo Bar, etc.) is a natural companion prompt anchor — displaying it alongside the Vũng Tàu question could jog specific memories the same way it did during the locations session.

---

### Tab 7: The Real World

*Going home, DEROS, things missed while away, the public mood, reentry.*

**Prompts:**
- What's the one thing that happened back home while you were gone that you still feel like you missed — a championship, a birth, a moment that everyone else has as a shared memory and you have as a news clipping?
- What was the first thing you did, ate, or saw when you got back stateside?
- What surprised you most about coming home — from people, from the country, from your own reaction to ordinary things?
- Did anyone say something to you when you got back that you've never forgotten — good or bad?
- What music, film, or news had piled up while you were gone that hit you differently because of where you'd been?
- What felt normal right away, and what felt permanently wrong?
- How long before you felt like you were actually home — not just back?

**Notes:** "The Real World" was Vietnam-era soldier slang for life back home. The tab covers more than just the physical act of going home — it includes cultural dislocation, the public mood about the war, and specific things missed. The prompt about missing a championship is grounded in a real detail: Marvin Miller was a Pittsburgh Pirates fan who was in Vietnam for the entire 1971 World Series. Every veteran missed something specific and civilian-accessible; those concrete things are an easier entry into the dislocation experience than asking directly about reception or readjustment. The last question ("how long before you felt like you were actually home") is the deepest on the page and earns its place at the end.

---

## Page Design Decisions

### Page-level intro
Brief, warm, one short paragraph. Sets the tone: these aren't official accounts, no wrong answers, say as much or as little as you want. Individual tab intros are probably unnecessary — the tab names and prompts do the work.

### Prompt display
Cards or clean list items per tab. Each prompt has the question text prominent and a **Share** button below (warmer than "Answer" for the tone of this section).

### The modal (triggered by Share button)

Fields in order:
1. **Name** — free-form text. Full name, first name, or nickname all acceptable. Required.
   - Checkbox beneath: *Publish anonymously*
2. **Contact** — Email and/or phone, with visible note that this will never be shared. Captures contact info as a secondary goal.
3. **Platoon** — Dropdown: Skull / Cat / Range / HQ / Other
4. **Year(s) with D Company** — Short text field
5. **[Prompt question displayed here]** — The selected prompt shown above the response field as a reminder
6. **Response** — Open textarea, no word limit. Placeholder: *"Say as much or as little as you'd like."*
7. **Publication preference** — Radio group (three states):
   - ○ Publish with my name
   - ○ Publish anonymously
   - ○ Archive use only — don't publish

   *(Note: "Publish anonymously" appears both as the checkbox under Name and as an option here — these should sync. Consider whether one or the other is redundant in final implementation.)*

8. **Submit / Cancel**

### Confirmation
On submit, the confirmation screen/message includes:
- Acknowledgment that the story will appear on the page soon
- The **removal link** directly: a pre-populated URL to the request page (`/request?type=removal&story=[story-id]`) so the submitter has it in hand immediately, before the story goes live

---

## Technical Architecture

### Stories as a source layer
Skipper Stories submissions are **not** filed into soldier records at submission time. The connection between a story and a soldier slug is made by the archivist after the fact, in the admin panel. Anonymous stories and unattributable ones live only on the Skipper Stories page permanently — that's fine. Build My Book / verbal accounts work happens separately, on the archivist's schedule.

### R2 paths
- Pending: `submissions/skipper-stories/pending/[timestamp]-[nanoid].json`
- Published: `submissions/skipper-stories/published/[timestamp]-[nanoid].json`
- Held: `submissions/skipper-stories/held/[timestamp]-[nanoid].json`

### Soft queue / nightly publish
- Submissions land in `pending/` on arrival
- Admin panel shows pending stories with three actions: **Approve**, **Hold**, **Discard**
- Held stories stay in `pending/` (or move to `held/`) indefinitely
- At **00:01 nightly**, a Cloudflare Workers Cron Trigger promotes all unflagged submissions received before midnight from `pending/` to `published/`
- The Skipper Stories page loads stories **client-side from R2** at page load — no Eleventy build or Wrangler deploy required for new stories to appear
- The cron job is a single Workers function: read `pending/`, filter by timestamp < midnight, move to `published/`

### Removal flow
- Each published story card has a low-weight **"Request removal"** link at the bottom
- Link URL: `/request?type=removal&story=[story-id]`
- Pre-populates the existing request queue in the admin panel (new request type: `removal`, alongside existing types)
- Also sent to submitter at confirmation time so they have it before the story goes live
- Handles both submitter regret and third-party objections (a named veteran who didn't consent)

### Admin panel additions needed
- New subtab under Site Feedback: **Skipper Stories** (alongside existing Requests / Survey Responses / Documents)
- Story cards with Approve / Hold / Discard actions
- Story preview showing name, platoon, year, prompt question, response text, publication preference
- After approval: ability to tag a story with a soldier slug for future Build My Book connection

### Seeding the page before launch
The page should not go live empty. Seed each tab with 1-2 curated stories before launch using existing archive material:
- Kint interview anecdotes (gear, field life, Vũng Tàu trips) → WTR?, The AO, R&R
- Marvin Miller's letters (Kool-Aid/pudding/cookies requests, Pirates reference) → Mail Call, The Real World
- McGrew calendar entries reframed as first-person vignettes → Mail Call, The AO

---

## Config Schema (Not Yet Built)

The existing event survey schema (`site/_data/surveys/[event-slug].json`) is not the right container for this. Skipper Stories needs a new config type. Suggested path: `site/_data/skipper-stories/prompts.json` — a single file with all six tabs, their display names, and their prompt arrays. The submission worker endpoint will be new: `POST /submit/skipper-story`.

---

## What Has Not Been Built Yet

Everything in this document is design and planning. No code, no config files, no schema, no page has been created. Next session picks up from here.

**Suggested build order:**
1. `site/_data/skipper-stories/prompts.json` — the full prompt config
2. `site/skipper-stories/index.njk` — the page with tab UI
3. `site/assets/js/skipper-stories.js` — tab switching, modal, submission POST, client-side story load from R2
4. `site/assets/css/main.css` additions — Skipper Stories visual register (lighter than rest of site)
5. `workers/functions/submit/skipper-story.js` — new worker endpoint, writes to R2 `pending/`
6. `workers/functions/cron/publish-skipper-stories.js` — nightly cron, promotes pending → published
7. Admin panel subtab — Skipper Stories review queue
8. Removal request type — extend existing `/request` flow

---

## Late-Breaking UX Notes (Captured Before Next Session)

### Stories Display — Tabbed, Sorted, with Viral Prompt Mechanic

The published stories view should mirror the prompt structure exactly — same six tabs, same names. Within each tab, stories are sorted newest to oldest by prompt question, so returning visitors always see fresh content at the top.

Each published story card should include a **"Share Your Version"** button (or similar) that pre-selects the same prompt and opens the submission modal. This creates a tagged/related relationship between stories answering the same question — a cluster of responses to "what was in your ruck" rather than an undifferentiated stream — and drives additional submissions directly from reading someone else's answer.

The viral mechanic here is intentional: someone reads a story, recognizes their own experience, and the path to sharing their version is one click away. Discuss implementation details (how the related/tagged relationship is stored and surfaced) in the next session.

---

## Carry-Forward from Session 47

All items from the Session 47 pending list remain open. See `Session_47_Handoff.md` for the full list.
