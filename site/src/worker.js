export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // CORS preflight — covers all /submit/* routes
    if (method === "OPTIONS" && path.startsWith("/submit/")) {
      return corsPreflightResponse();
    }

    // Handle /media/* requests — serve from R2
    if (path.startsWith("/media/")) {
      return handleMedia(request, env, path);
    }

    // INFRA-TASK-064 — Contribute upload
    if (path === "/submit/contribute" && method === "POST") {
      return withCors(await handleContribute(request, env));
    }

    // INFRA-TASK-065 — Check folder exists
    if (path === "/submit/check" && method === "GET") {
      return withCors(await handleCheck(request, env));
    }

    // INFRA-TASK-066 — Request form submission
    if (path === "/submit/request" && method === "POST") {
      return withCors(await handleRequest(request, env));
    }

    // INFRA-TASK-068 — Account survey submission
    if (path === "/submit/account" && method === "POST") {
      return withCors(await handleAccount(request, env));
    }

    // Skipper Stories — submit a story
    if (path === "/submit/skipper-story" && method === "POST") {
      return withCors(await handleSkipperStory(request, env));
    }

    // Skipper Stories — list published stories by tab (client-side page load)
    if (path === "/api/skipper-stories/published" && method === "GET") {
      return withCors(await handleSkipperStoriesPublished(request, env));
    }

    // Photo ID Proposals — propose an identification/correction on a photo.
    // Held in pending/ — NEVER auto-promoted by cron. Admin approves manually.
    if (path === "/submit/photo-proposal" && method === "POST") {
      return withCors(await handlePhotoProposal(request, env));
    }

    // Everything else — pass through to static assets
    return env.ASSETS.fetch(request);
  },

  // Nightly cron: promote pending skipper stories to published
  async scheduled(event, env, ctx) {
    ctx.waitUntil(publishPendingSkipperStories(env));
  },
};

// ---------------------------------------------------------------------------
// INFRA-TASK-064 — POST /submit/contribute
// Accepts multipart form upload. Creates or appends to a SUBMISSIONS folder.
// Returns { folderId, isNew }.
// ---------------------------------------------------------------------------
async function handleContribute(request, env) {
  try {
    const formData = await request.formData();

    const type = formData.get("type"); // "photos" | "documents"
    const soldierName   = formData.get("soldier_name")       || "";
    const submitterName = formData.get("submitter_name")     || "";
    const submitterContact = formData.get("submitter_contact") || "";
    const permission    = formData.get("permission")         || "";
    const notes         = formData.get("notes")              || "";
    const provenanceConfirmed = formData.get("provenance_confirmed") === "true";
    const existingFolderId    = formData.get("folder_id")    || null;

    if (!type || !["photos", "documents"].includes(type)) {
      return jsonResponse({ error: "Invalid type" }, 400);
    }

    // Determine folder — reuse existing if still present, otherwise create new
    let folderId;
    let isNew = true;

    if (existingFolderId) {
      const metaKey = `submissions/${type}/${existingFolderId}/metadata.json`;
      const existing = await env.SUBMISSIONS.head(metaKey);
      if (existing) {
        folderId = existingFolderId;
        isNew = false;
      }
    }

    if (!folderId) {
      const slug = soldierName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      folderId = `${slug || "unknown"}-${Date.now()}`;
      isNew = true;
    }

    const prefix = `submissions/${type}/${folderId}`;

    // Upload each file to R2
    const files = formData.getAll("files");
    for (const file of files) {
      if (file && file.name) {
        const key = `${prefix}/${file.name}`;
        await env.SUBMISSIONS.put(key, file, {
          httpMetadata: { contentType: file.type || "application/octet-stream" },
        });
      }
    }

    // Write metadata.json (always overwrite — last submit wins for metadata fields)
    const metadata = {
      type,
      soldier_name:         soldierName,
      submitter_name:       submitterName,
      submitter_contact:    submitterContact,
      permission,
      notes,
      provenance_confirmed: provenanceConfirmed,
      submitted:            new Date().toISOString(),
      folder_id:            folderId,
      user_id:              null,
    };

    await env.SUBMISSIONS.put(
      `${prefix}/metadata.json`,
      JSON.stringify(metadata, null, 2),
      { httpMetadata: { contentType: "application/json" } }
    );

    // Notification email to admin — non-fatal
    try {
      await sendContributeNotificationEmail(env, metadata, folderId, isNew);
    } catch (emailErr) {
      console.error("Contribute email failed:", emailErr.message);
    }

    return jsonResponse({ folderId, isNew });
  } catch (err) {
    return jsonResponse({ error: err.message }, 500);
  }
}

// ---------------------------------------------------------------------------
// INFRA-TASK-065 — GET /submit/check?folder=[id]
// Verifies a folder_id still exists in SUBMISSIONS.
// Returns { exists: true | false }.
// ---------------------------------------------------------------------------
async function handleCheck(request, env) {
  const url = new URL(request.url);
  const folderId = url.searchParams.get("folder");

  if (!folderId) {
    return jsonResponse({ error: "Missing folder param" }, 400);
  }

  for (const type of ["photos", "documents"]) {
    const key = `submissions/${type}/${folderId}/metadata.json`;
    const obj = await env.SUBMISSIONS.head(key);
    if (obj) return jsonResponse({ exists: true });
  }

  return jsonResponse({ exists: false });
}

// ---------------------------------------------------------------------------
// INFRA-TASK-066 — POST /submit/request
// Writes a typed request JSON to SUBMISSIONS requests/ prefix.
// Notification email wired in INFRA-TASK-067.
// ---------------------------------------------------------------------------
async function handleRequest(request, env) {
  try {
    const body = await request.json();

    const type = body.type;
    if (!type) {
      return jsonResponse({ error: "Missing type" }, 400);
    }

    const timestamp = Date.now();
    const key = `requests/${timestamp}-${type}.json`;

    const payload = {
      ...body,
      submitted:    new Date().toISOString(),
      page_url:     body.page_url     || null,
      referrer_url: body.referrer_url || null,
      user_id:      null,
    };

    await env.SUBMISSIONS.put(
      key,
      JSON.stringify(payload, null, 2),
      { httpMetadata: { contentType: "application/json" } }
    );

    // INFRA-TASK-067 — Notification email to admin
    try {
      await sendNotificationEmail(env, payload);
    } catch (emailErr) {
      // Log but don't fail the request if email blows up
      console.error("Email send failed:", emailErr.message);
    }

    return jsonResponse({ ok: true });
  } catch (err) {
    return jsonResponse({ error: err.message }, 500);
  }
}

// ---------------------------------------------------------------------------
// INFRA-TASK-067 — Email notification helper
// Sends a plain-text notification to admin@angryskipperarchive.org via
// Cloudflare Email Workers. Requires send_email binding in wrangler.jsonc
// and Email Routing enabled on the domain.
// ---------------------------------------------------------------------------
async function sendNotificationEmail(env, payload) {
  const { EmailMessage } = await import("cloudflare:email");

  const typeLabels = {
    correction: "Correction",
    contact:    "Contact Info Request",
    add:        "Add a Soldier",
    broken:     "Something is Broken",
    privacy:    "Privacy / Takedown",
    general:    "General Message",
  };

  const label = typeLabels[payload.type] || payload.type;

  // Build a readable plain-text body from the payload fields
  const skip = new Set(["type", "submitted", "user_id", "page_url", "referrer_url",
                         "submitter_name", "submitter_contact"]);
  const lines = [
    `Type: ${label}`,
    `From: ${payload.submitter_name || "(no name)"}`,
    `Contact: ${payload.submitter_contact || "(none)"}`,
    `Submitted: ${payload.submitted}`,
    ``,
  ];
  for (const [k, v] of Object.entries(payload)) {
    if (!skip.has(k) && v !== null && v !== "") {
      lines.push(`${k}: ${v}`);
    }
  }
  if (payload.page_url)     lines.push(``, `Page: ${payload.page_url}`);
  if (payload.referrer_url) lines.push(`Referrer: ${payload.referrer_url}`);

  const body = lines.join("\n");

  const raw = [
    `From: D Co. Archive <admin@angryskipperarchive.org>`,
    `To: admin@angryskipperarchive.org`,
    `Subject: [Archive Request] ${label} — ${payload.submitter_name || "anonymous"}`,
    `MIME-Version: 1.0`,
    `Content-Type: text/plain; charset=utf-8`,
    ``,
    body,
  ].join("\r\n");

  const encoder = new TextEncoder();
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  writer.write(encoder.encode(raw));
  writer.close();

  const message = new EmailMessage(
    "admin@angryskipperarchive.org",
    "admin@angryskipperarchive.org",
    readable
  );

  await env.SEND_EMAIL.send(message);
}

// ---------------------------------------------------------------------------
// INFRA-TASK-068 — POST /submit/account
// Accepts a survey response JSON and writes to SUBMISSIONS bucket under
// submissions/accounts/[event-slug]-[platoon]-[lastname]-[timestamp].json
// ---------------------------------------------------------------------------
async function handleAccount(request, env) {
  try {
    const body = await request.json();

    const eventSlug  = (body.event_slug  || "unknown").replace(/[^a-z0-9-]/g, "-");
    const platoon    = (body.platoon     || "unknown").replace(/[^a-z0-9-]/g, "-");
    const lastName   = (body.last_name   || "anonymous")
                         .toLowerCase()
                         .replace(/[^a-z0-9]+/g, "-")
                         .replace(/^-|-$/g, "");
    const timestamp  = Date.now();

    const key = `submissions/accounts/${eventSlug}-${platoon}-${lastName}-${timestamp}.json`;

    const payload = {
      ...body,
      submitted: new Date().toISOString(),
      user_id:   null,
    };

    await env.SUBMISSIONS.put(
      key,
      JSON.stringify(payload, null, 2),
      { httpMetadata: { contentType: "application/json" } }
    );

    // Notification email — non-fatal if it fails
    try {
      await sendAccountNotificationEmail(env, payload, key);
    } catch (emailErr) {
      console.error("Account email send failed:", emailErr.message);
    }

    return jsonResponse({ ok: true, key });
  } catch (err) {
    return jsonResponse({ error: err.message }, 500);
  }
}

async function sendAccountNotificationEmail(env, payload, key) {
  const { EmailMessage } = await import("cloudflare:email");

  const subject = `[Archive Account] ${payload.event_slug || "unknown"} — ${payload.platoon || ""} — ${payload.last_name || "anonymous"}`;

  const body = [
    `New account survey submission`,
    ``,
    `Event:    ${payload.event_slug || "(unknown)"}`,
    `Platoon:  ${payload.platoon    || "(unknown)"}`,
    `Name:     ${payload.first_name || ""} ${payload.last_name || ""}`.trim(),
    `Contact:  ${payload.contact    || "(none provided)"}`,
    `Submitted: ${payload.submitted}`,
    ``,
    `R2 key: ${key}`,
    ``,
    `Review in the admin panel or fetch directly from R2.`,
  ].join("\n");

  const raw = [
    `From: D Co. Archive <admin@angryskipperarchive.org>`,
    `To: admin@angryskipperarchive.org`,
    `Subject: ${subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: text/plain; charset=utf-8`,
    ``,
    body,
  ].join("\r\n");

  const encoder = new TextEncoder();
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  writer.write(encoder.encode(raw));
  writer.close();

  const message = new EmailMessage(
    "admin@angryskipperarchive.org",
    "admin@angryskipperarchive.org",
    readable
  );

  await env.SEND_EMAIL.send(message);
}

// ---------------------------------------------------------------------------
// INFRA-TASK-067 (contribute email) — Admin notification for contribute uploads
// Fires on every submission (new folder or appended). Non-fatal.
// ---------------------------------------------------------------------------
async function sendContributeNotificationEmail(env, metadata, folderId, isNew) {
  const { EmailMessage } = await import("cloudflare:email");

  const typeLabel = metadata.type === "photos" ? "Photos" : "Documents";
  const action    = isNew ? "New folder" : "Files added to existing folder";
  const subject   = `[Contribute] ${typeLabel} — ${metadata.soldier_name || "(unknown)"} — ${metadata.submitter_name || "anonymous"}`;

  const body = [
    `${action}`,
    ``,
    `Type:        ${typeLabel}`,
    `Soldier:     ${metadata.soldier_name    || "(not provided)"}`,
    `From:        ${metadata.submitter_name  || "(anonymous)"}`,
    `Contact:     ${metadata.submitter_contact || "(none)"}`,
    `Permission:  ${metadata.permission     || "(not set)"}`,
    `Provenance:  ${metadata.provenance_confirmed ? "Confirmed" : "Not confirmed"}`,
    `Notes:       ${metadata.notes          || "(none)"}`,
    `Submitted:   ${metadata.submitted}`,
    ``,
    `R2 folder: submissions/${metadata.type}/${folderId}/`,
    ``,
    `Review in the admin panel (Site Feedback → Documents).`,
  ].join("\n");

  const raw = [
    `From: D Co. Archive <admin@angryskipperarchive.org>`,
    `To: admin@angryskipperarchive.org`,
    `Subject: ${subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: text/plain; charset=utf-8`,
    ``,
    body,
  ].join("\r\n");

  const encoder = new TextEncoder();
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  writer.write(encoder.encode(raw));
  writer.close();

  const message = new EmailMessage(
    "admin@angryskipperarchive.org",
    "admin@angryskipperarchive.org",
    readable
  );

  await env.SEND_EMAIL.send(message);
}

// ---------------------------------------------------------------------------
// Skipper Stories — POST /submit/skipper-story
// Writes story JSON to SUBMISSIONS submissions/skipper-stories/pending/
// ---------------------------------------------------------------------------
async function handleSkipperStory(request, env) {
  try {
    const body = await request.json();

    if (!body.name || !body.response || !body.prompt_id) {
      return jsonResponse({ error: "Missing required fields: name, response, prompt_id" }, 400);
    }

    const nanoid    = await generateNanoid();
    const timestamp = Date.now();
    const storyId   = `${timestamp}-${nanoid}`;
    const key        = `submissions/skipper-stories/pending/${storyId}.json`;

    const payload = {
      ...body,
      story_id:  storyId,
      submitted: new Date().toISOString(),
      status:    "pending",
    };

    await env.SUBMISSIONS.put(
      key,
      JSON.stringify(payload, null, 2),
      { httpMetadata: { contentType: "application/json" } }
    );

    // Notification email to admin — non-fatal
    try {
      await sendSkipperStoryNotificationEmail(env, payload, key);
    } catch (emailErr) {
      console.error("Skipper story email failed:", emailErr.message);
    }

    return jsonResponse({ ok: true, story_id: storyId });
  } catch (err) {
    return jsonResponse({ error: err.message }, 500);
  }
}

// ---------------------------------------------------------------------------
// Photo ID Proposals — POST /submit/photo-proposal
// Accepts JSON: { target:{soldier_slug,subfolder,filename}, changes:{...},
//                 source, submitter_name, submitter_contact, page_url, hp }
// Writes to submissions/photo-proposals/pending/. NEVER auto-promoted.
// ---------------------------------------------------------------------------
const SLUG_SAFE = /^[a-z0-9][a-z0-9/_.-]*$/i;

async function handlePhotoProposal(request, env) {
  try {
    const body = await request.json();

    // Honeypot — silently accept (200) so bots don't learn, but store nothing.
    if (body.hp) return jsonResponse({ ok: true });

    const target = body.target || {};
    const { soldier_slug, subfolder, filename } = target;

    if (!soldier_slug || !subfolder || !filename) {
      return jsonResponse({ error: "Missing target.soldier_slug, target.subfolder or target.filename" }, 400);
    }
    if (![soldier_slug, subfolder, filename].every(v => typeof v === "string" && SLUG_SAFE.test(v))) {
      return jsonResponse({ error: "Invalid target identifiers" }, 400);
    }

    // Normalize changes — keep only recognized, non-empty keys.
    const c = body.changes || {};
    const changes = {};
    if (Array.isArray(c.contains_add) && c.contains_add.length) {
      changes.contains_add = c.contains_add.filter(s => typeof s === "string" && SLUG_SAFE.test(s));
    }
    if (Array.isArray(c.contains_add_freetext) && c.contains_add_freetext.length) {
      changes.contains_add_freetext = c.contains_add_freetext
        .filter(s => typeof s === "string" && s.trim()).map(s => s.trim().slice(0, 120));
    }
    if (typeof c.caption === "string" && c.caption.trim()) {
      changes.caption = c.caption.trim().slice(0, 2000);
    }
    if (typeof c.date === "string" && c.date.trim()) {
      changes.date = c.date.trim().slice(0, 80);
      changes.date_approximate = c.date_approximate !== false;
    }
    if (typeof c.notes === "string" && c.notes.trim()) {
      changes.notes = c.notes.trim().slice(0, 2000);
    }

    if (!Object.keys(changes).length) {
      return jsonResponse({ error: "No usable changes provided" }, 400);
    }

    const nanoid    = await generateNanoid();
    const timestamp = Date.now();
    const proposalId = `${timestamp}-${nanoid}`;
    const key = `submissions/photo-proposals/pending/${proposalId}.json`;

    const payload = {
      proposal_id: proposalId,
      submitted:   new Date().toISOString(),
      status:      "pending",
      target:      { soldier_slug, subfolder, filename },
      changes,
      source:            typeof body.source === "string" ? body.source.trim().slice(0, 500) : "",
      submitter_name:    typeof body.submitter_name === "string" ? body.submitter_name.trim().slice(0, 200) : "",
      submitter_contact: typeof body.submitter_contact === "string" ? body.submitter_contact.trim().slice(0, 200) : "",
      page_url:          typeof body.page_url === "string" ? body.page_url.slice(0, 500) : "",
    };

    await env.SUBMISSIONS.put(
      key,
      JSON.stringify(payload, null, 2),
      { httpMetadata: { contentType: "application/json" } }
    );

    try {
      await sendPhotoProposalNotificationEmail(env, payload, key);
    } catch (emailErr) {
      console.error("Photo proposal email failed:", emailErr.message);
    }

    return jsonResponse({ ok: true, proposal_id: proposalId });
  } catch (err) {
    return jsonResponse({ error: err.message }, 500);
  }
}

// ---------------------------------------------------------------------------
// Skipper Stories — GET /api/skipper-stories/published?tab=wtr
// Returns published stories for a given tab (or all if no tab param).
// ---------------------------------------------------------------------------
async function handleSkipperStoriesPublished(request, env) {
  try {
    const url    = new URL(request.url);
    const tabId  = url.searchParams.get("tab") || null;

    const prefix = "submissions/skipper-stories/published/";
    const items  = [];
    let continuationToken;

    do {
      const list = await env.SUBMISSIONS.list({
        prefix,
        cursor: continuationToken,
        limit:  1000,
      });
      for (const obj of list.objects || []) {
        try {
          const obj2 = await env.SUBMISSIONS.get(obj.key);
          if (!obj2) continue;
          const data = JSON.parse(await obj2.text());
          if (data.publication === "archive") continue;  // never send archive-only
          if (data.status === "withdrawn") continue;    // soft-deleted — excluded from feed
          if (tabId && data.tab_id !== tabId) continue;
          items.push(data);
        } catch { /* skip malformed */ }
      }
      continuationToken = list.truncated ? list.cursor : null;
    } while (continuationToken);

    // Newest first
    items.sort((a, b) => (b.submitted || "").localeCompare(a.submitted || ""));

    return jsonResponse({ stories: items });
  } catch (err) {
    return jsonResponse({ error: err.message }, 500);
  }
}

// ---------------------------------------------------------------------------
// Skipper Stories — Cron: promote pending → published
// Runs at 00:01 nightly. Moves stories submitted before midnight to published/.
// ---------------------------------------------------------------------------
async function publishPendingSkipperStories(env) {
  const prefix    = "submissions/skipper-stories/pending/";
  const midnight  = new Date();
  midnight.setHours(0, 0, 0, 0);
  const cutoff    = midnight.getTime();

  let continuationToken;
  const promoted = [];

  do {
    const list = await env.SUBMISSIONS.list({
      prefix,
      cursor: continuationToken,
      limit:  1000,
    });

    for (const obj of list.objects || []) {
      try {
        const obj2 = await env.SUBMISSIONS.get(obj.key);
        if (!obj2) continue;
        const data = JSON.parse(await obj2.text());

        // Only promote stories submitted before tonight's midnight
        const submittedMs = new Date(data.submitted || 0).getTime();
        if (submittedMs >= cutoff) continue;

        // Skip if already held (admin flagged it)
        if (data.status === "held") continue;

        // Write to published/
        const storyId    = data.story_id || obj.key.split("/").pop().replace(".json", "");
        const publishKey = `submissions/skipper-stories/published/${storyId}.json`;
        const publishedPayload = { ...data, status: "published", published_at: new Date().toISOString() };

        await env.SUBMISSIONS.put(
          publishKey,
          JSON.stringify(publishedPayload, null, 2),
          { httpMetadata: { contentType: "application/json" } }
        );

        // Delete from pending
        await env.SUBMISSIONS.delete(obj.key);
        promoted.push(storyId);

      } catch (err) {
        console.error("Failed to promote story:", obj.key, err.message);
      }
    }

    continuationToken = list.truncated ? list.cursor : null;
  } while (continuationToken);

  console.log(`Skipper Stories cron: promoted ${promoted.length} stories to published.`);
}

// ---------------------------------------------------------------------------
// Skipper Stories — Email notification
// ---------------------------------------------------------------------------
async function sendSkipperStoryNotificationEmail(env, payload, key) {
  const { EmailMessage } = await import("cloudflare:email");

  const displayName = payload.publication === "anonymous"
    ? "Anonymous"
    : (payload.name || "(no name)");

  const subject = `[Skipper Story] ${payload.tab_label || payload.tab_id || "Unknown tab"} — ${displayName}`;

  const body = [
    `New Skipper Story submission`,
    ``,
    `Tab:       ${payload.tab_label || payload.tab_id || "(unknown)"}`,
    `Prompt:    ${payload.prompt_text || payload.prompt_id || "(unknown)"}`,
    `Name:      ${payload.name || "(none)"}`,
    `Platoon:   ${payload.platoon || "(none)"}`,
    `Years:     ${payload.years || "(none)"}`,
    `Email:     ${payload.email || "(none)"}`,
    `Phone:     ${payload.phone || "(none)"}`,
    `Publish:   ${payload.publication || "(not set)"}`,
    `Submitted: ${payload.submitted}`,
    ``,
    `Response:`,
    `----------`,
    payload.response || "(empty)",
    `----------`,
    ``,
    `R2 key: ${key}`,
    ``,
    `Pending — will auto-publish at 00:01 unless held in admin panel.`,
  ].join("\n");

  const raw = [
    `From: D Co. Archive <admin@angryskipperarchive.org>`,
    `To: admin@angryskipperarchive.org`,
    `Subject: ${subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: text/plain; charset=utf-8`,
    ``,
    body,
  ].join("\r\n");

  const encoder = new TextEncoder();
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  writer.write(encoder.encode(raw));
  writer.close();

  const message = new EmailMessage(
    "admin@angryskipperarchive.org",
    "admin@angryskipperarchive.org",
    readable
  );

  await env.SEND_EMAIL.send(message);
}

// ---------------------------------------------------------------------------
// Photo ID Proposal — admin notification email
// ---------------------------------------------------------------------------
async function sendPhotoProposalNotificationEmail(env, payload, key) {
  const { EmailMessage } = await import("cloudflare:email");

  const t = payload.target;
  const c = payload.changes;
  const subject = `[Photo ID] ${t.soldier_slug}/${t.filename}`;

  const changeLines = [];
  if (c.contains_add)          changeLines.push(`Add to contains: ${c.contains_add.join(", ")}`);
  if (c.contains_add_freetext) changeLines.push(`Add (not in roster): ${c.contains_add_freetext.join(", ")}`);
  if (c.caption !== undefined) changeLines.push(`Caption → ${c.caption}`);
  if (c.date !== undefined)    changeLines.push(`Date → ${c.date}${c.date_approximate ? " (approximate)" : ""}`);
  if (c.notes !== undefined)   changeLines.push(`Notes: ${c.notes}`);

  const body = [
    `New photo ID proposal`,
    ``,
    `Photo:     ${t.soldier_slug} / ${t.subfolder} / ${t.filename}`,
    `Page:      ${payload.page_url || "(unknown)"}`,
    ``,
    `Proposed changes:`,
    `----------`,
    ...changeLines,
    `----------`,
    ``,
    `How they know: ${payload.source || "(not given)"}`,
    `From:          ${payload.submitter_name || "(anonymous)"}`,
    `Contact:       ${payload.submitter_contact || "(none)"}`,
    `Submitted:     ${payload.submitted}`,
    ``,
    `R2 key: ${key}`,
    ``,
    `HELD for review — will NOT auto-publish. Approve in the admin Proposals tab.`,
  ].join("\n");

  const raw = [
    `From: D Co. Archive <admin@angryskipperarchive.org>`,
    `To: admin@angryskipperarchive.org`,
    `Subject: ${subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: text/plain; charset=utf-8`,
    ``,
    body,
  ].join("\r\n");

  const encoder = new TextEncoder();
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  writer.write(encoder.encode(raw));
  writer.close();

  const message = new EmailMessage(
    "admin@angryskipperarchive.org",
    "admin@angryskipperarchive.org",
    readable
  );

  await env.SEND_EMAIL.send(message);
}

// ---------------------------------------------------------------------------
// Nanoid-lite — generates a short random ID without importing nanoid
// ---------------------------------------------------------------------------
async function generateNanoid(size = 10) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  const bytes = crypto.getRandomValues(new Uint8Array(size));
  let id = "";
  for (const b of bytes) id += chars[b % chars.length];
  return id;
}

// ---------------------------------------------------------------------------
// Media handler — unchanged
// ---------------------------------------------------------------------------
async function handleMedia(request, env, path) {
  let bucket;
  let key;

  if (path.startsWith("/media/photos/")) {
    bucket = env.PHOTOS;
    key = decodeURIComponent(path.slice("/media/photos/".length));
  } else if (path.startsWith("/media/documents/")) {
    bucket = env.DOCUMENTS;
    key = decodeURIComponent(path.slice("/media/documents/".length));
  } else {
    return new Response("Not found", { status: 404 });
  }

  if (!key) {
    return new Response("Not found", { status: 404 });
  }

  const object = await bucket.get(key);

  if (!object) {
    return new Response("Not found", { status: 404 });
  }

  const contentType = getContentType(key);

  const headers = new Headers();
  headers.set("Content-Type", contentType);
  headers.set("Cache-Control", "public, max-age=31536000, immutable");
  headers.set("ETag", object.httpEtag);

  const ifNoneMatch = request.headers.get("If-None-Match");
  if (ifNoneMatch === object.httpEtag) {
    return new Response(null, { status: 304, headers });
  }

  return new Response(object.body, { status: 200, headers });
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

function withCors(response) {
  const r = new Response(response.body, response);
  r.headers.set("Access-Control-Allow-Origin", "*");
  return r;
}

function corsPreflightResponse() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

function getContentType(key) {
  const ext = key.split(".").pop().toLowerCase();
  const types = {
    jpg:  "image/jpeg",
    jpeg: "image/jpeg",
    png:  "image/png",
    gif:  "image/gif",
    webp: "image/webp",
    svg:  "image/svg+xml",
    pdf:  "application/pdf",
    mp3:  "audio/mpeg",
    mp4:  "video/mp4",
  };
  return types[ext] || "application/octet-stream";
}
