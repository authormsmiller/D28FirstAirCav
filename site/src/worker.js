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

    // Everything else — pass through to static assets
    return env.ASSETS.fetch(request);
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

    // Email (thank-you on isNew) — wired in INFRA-TASK-067

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
// Media handler — unchanged
// ---------------------------------------------------------------------------
async function handleMedia(request, env, path) {
  let bucket;
  let key;

  if (path.startsWith("/media/photos/")) {
    bucket = env.PHOTOS;
    key = path.slice("/media/photos/".length);
  } else if (path.startsWith("/media/documents/")) {
    bucket = env.DOCUMENTS;
    key = path.slice("/media/documents/".length);
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
