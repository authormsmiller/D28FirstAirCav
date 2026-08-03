// site/_data/searchIndex.js
// Two-pass search index builder.
//
// Pass 1 — Soldiers
//   Walk soldiers/[slug]/[slug].md → build soldierMap { slug → record }
//   Each entry initialised with photo_count: 0
//
// Pass 2 — Content cross-references
//   2a  events    — contains + tagged + casualties
//   2b  documents — contains + tagged
//   2c  anecdotes — contains + tagged
//   2d  photos    — walk soldiers/*/photos/** recursively;
//                   count every photo for owning soldier + contains slugs
//
//   Unknown slugs in 2a–2c emit a build-time console.warn.
//   Unknown slugs in 2d are silently skipped (pre-profile subjects).
//
// Soldier records are pushed to the output array AFTER Pass 2 so that
// photo_count is accurate before they are serialised.

const fs   = require("fs");
const path = require("path");
const yaml = require("js-yaml");

// ── Helpers ────────────────────────────────────────────────────────────────

// Parse YAML front matter from a raw .md string.
function parseFrontMatter(raw, label) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;
  try {
    return yaml.load(match[1]);
  } catch (e) {
    console.warn(`searchIndex: failed to parse front matter for ${label}`, e);
    return null;
  }
}

// Extract first prose paragraph from body (after front matter).
function extractExcerpt(raw) {
  const body = raw.replace(/^---[\s\S]*?---\r?\n/, "").trim();
  const firstPara = body.split(/\r?\n\r?\n/)[0] || "";
  return firstPara.replace(/^#+\s+/, "").replace(/\s+/g, " ").trim().slice(0, 300);
}

// Flatten a contains/tagged array (object-format or flat-string) to a
// space-separated slug string.
function slugList(arr) {
  if (!Array.isArray(arr)) return "";
  return arr
    .map(s => (typeof s === "string" ? s.trim() : (s.slug || "").trim()))
    .filter(Boolean)
    .join(" ");
}

// Extract all slugs from a casualties object (kia / dow / wia / nbw / …).
// String-valued keys like kia_count_note are skipped automatically.
function casualtySlugList(casualties) {
  if (!casualties || typeof casualties !== "object") return "";
  const slugs = [];
  for (const group of Object.values(casualties)) {
    if (!Array.isArray(group)) continue;
    for (const entry of group) {
      if (entry && typeof entry === "object" && entry.slug) {
        const s = String(entry.slug).trim();
        if (s) slugs.push(s);
      }
    }
  }
  return slugs.join(" ");
}

// Merge two space-separated slug strings, deduplicating.
function mergeSlugStrings(a, b) {
  const seen = new Set();
  return [a, b]
    .join(" ")
    .split(" ")
    .filter(s => s && !seen.has(s) && seen.add(s))
    .join(" ");
}

// Recursively collect every index.md path under a directory.
function findIndexFiles(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (fs.statSync(full).isDirectory()) {
      results.push(...findIndexFiles(full));
    } else if (entry === "index.md") {
      results.push(full);
    }
  }
  return results;
}

// ── Main export ────────────────────────────────────────────────────────────

module.exports = function () {
  const base    = path.join(__dirname, "..");
  const records = [];   // final output — events/documents/anecdotes pushed here immediately;
                        // soldier records pushed last (after photo_count is known)

  // ── PASS 1: Build soldier map ──────────────────────────────────────────

  const soldierMap  = {};   // slug → record (mutable during Pass 2)
  const soldiersDir = path.join(base, "soldiers");

  if (fs.existsSync(soldiersDir)) {
    for (const slug of fs.readdirSync(soldiersDir)) {
      if (!fs.statSync(path.join(soldiersDir, slug)).isDirectory()) continue;
      const filePath = path.join(soldiersDir, slug, slug + ".md");
      if (!fs.existsSync(filePath)) continue;
      const raw  = fs.readFileSync(filePath, "utf8");
      const data = parseFrontMatter(raw, slug);
      if (!data) continue;

      const id   = data.slug || slug;
      const name = [data.rank, data.first_name, data.middle_name, data.last_name]
        .filter(Boolean).join(" ");

      soldierMap[id] = {
        type:          "soldier",
        id,
        slug:          id,
        url:           `/soldiers/${id}/`,
        name,
        first_name:    data.first_name   || "",
        last_name:     data.last_name    || "",
        nickname:      data.nickname     || "",
        rank:          data.rank         || "",
        platoon:       data.platoon      || "",
        mos:           data.mos          || "",
        arrived:       data.arrived      || "",
        departed:      data.departed     || "",
        hometown:      data.hometown     || "",
        status:        data.status       || "",
        excerpt:       data.timeline_source
                         ? data.timeline_source.replace(/\s+/g, " ").trim()
                         : extractExcerpt(raw),
        profile_photo: data.profile_photo || "",
        profile_photo_url: data.profile_photo
                         ? `/media/photos/soldiers/${id}/profile/${data.profile_photo}`
                         : "",
        photo_count:   0,
      };
    }
  }

  // Warn at build time when a slug referenced in content has no soldier folder.
  function warnUnknown(slugStr, source) {
    slugStr.split(" ").filter(Boolean).forEach(s => {
      if (!soldierMap[s]) {
        console.warn(`searchIndex: unknown slug "${s}" in ${source}`);
      }
    });
  }

  // ── PASS 2a: Events ────────────────────────────────────────────────────

  const eventsDir = path.join(base, "events");
  if (fs.existsSync(eventsDir)) {
    for (const slug of fs.readdirSync(eventsDir)) {
      if (!fs.statSync(path.join(eventsDir, slug)).isDirectory()) continue;
      const filePath = path.join(eventsDir, slug, "index.md");
      if (!fs.existsSync(filePath)) continue;
      const raw  = fs.readFileSync(filePath, "utf8");
      const data = parseFrontMatter(raw, slug);
      if (!data || data.status === "draft") continue;

      const contains = mergeSlugStrings(
        slugList(data.contains),
        casualtySlugList(data.casualties)
      );
      const tagged = slugList(data.tagged);

      warnUnknown(contains, slug);
      warnUnknown(tagged,   slug);

      records.push({
        type:     "event",
        id:       data.slug || slug,
        slug:     data.slug || slug,
        url:      `/events/${data.slug || slug}/`,
        name:     data.title    || slug,
        date:     data.date     || "",
        location: data.location || "",
        contains,
        tagged,
        excerpt:  extractExcerpt(raw),
      });
    }
  }

  // ── PASS 2b: Documents ─────────────────────────────────────────────────

  const docsDir = path.join(base, "documents");
  if (fs.existsSync(docsDir)) {
    for (const contributor of fs.readdirSync(docsDir)) {
      const contribPath = path.join(docsDir, contributor);
      if (!fs.statSync(contribPath).isDirectory()) continue;

      for (const docSlug of fs.readdirSync(contribPath)) {
        const docPath  = path.join(contribPath, docSlug);
        if (!fs.statSync(docPath).isDirectory()) continue;
        // Accept the canonical <docSlug>.md naming OR index.md. index.md is a
        // valid document file (letters, biographies, interviews, commemorations);
        // mirrors _crawlDocuments.js so search and the crawler agree.
        const docFileCanonical = path.join(docPath, docSlug + ".md");
        const docFileIndex     = path.join(docPath, "index.md");
        const filePath = fs.existsSync(docFileCanonical) ? docFileCanonical
                       : fs.existsSync(docFileIndex)     ? docFileIndex
                       : null;
        if (!filePath) continue;
        const raw  = fs.readFileSync(filePath, "utf8");
        const data = parseFrontMatter(raw, docSlug);
        if (!data || data.status === "draft") continue;

        const contains = slugList(data.contains);
        const tagged   = slugList(data.tagged);

        warnUnknown(contains, docSlug);
        warnUnknown(tagged,   docSlug);

        records.push({
          type:        "document",
          id:          data.slug || docSlug,
          slug:        data.slug || docSlug,
          url:         `/documents/${contributor}/${docSlug}/`,
          name:        data.title || docSlug,
          date:        data.date  || "",
          contributor,
          event:       data.event || "",
          contains,
          tagged,
          excerpt:     extractExcerpt(raw),
        });
      }
    }
  }

  // ── PASS 2c: Anecdotes ─────────────────────────────────────────────────

  const anecdotesDir = path.join(base, "anecdotes");
  if (fs.existsSync(anecdotesDir)) {
    for (const soldier of fs.readdirSync(anecdotesDir)) {
      const soldierPath = path.join(anecdotesDir, soldier);
      if (!fs.statSync(soldierPath).isDirectory()) continue;

      for (const anecdoteSlug of fs.readdirSync(soldierPath)) {
        const anecdotePath = path.join(soldierPath, anecdoteSlug);
        if (!fs.statSync(anecdotePath).isDirectory()) continue;
        const filePath = path.join(anecdotePath, "index.md");
        if (!fs.existsSync(filePath)) continue;
        const raw  = fs.readFileSync(filePath, "utf8");
        const data = parseFrontMatter(raw, anecdoteSlug);
        if (!data || data.status === "draft") continue;

        const contains = slugList(data.contains);
        const tagged   = slugList(data.tagged);

        warnUnknown(contains, anecdoteSlug);
        warnUnknown(tagged,   anecdoteSlug);

        records.push({
          type:     "anecdote",
          id:       data.slug || anecdoteSlug,
          slug:     data.slug || anecdoteSlug,
          url:      `/anecdotes/${soldier}/${anecdoteSlug}/`,
          name:     data.title || anecdoteSlug,
          date:     data.date  || "",
          event:    data.event || "",
          contains,
          tagged,
          excerpt:  extractExcerpt(raw),
        });
      }
    }
  }

  // ── PASS 2d: Photos ────────────────────────────────────────────────────
  // Walk every soldiers/[slug]/photos/**/index.md.
  // Each photo entry is counted once for:
  //   - the owning soldier (data.soldier field, or directory slug as fallback)
  //   - every slug in the photo's own contains/tagged arrays
  // Unknown slugs are silently skipped — photos often predate profiles.

  if (fs.existsSync(soldiersDir)) {
    for (const soldierSlug of fs.readdirSync(soldiersDir)) {
      const photosDir = path.join(soldiersDir, soldierSlug, "photos");
      if (!fs.existsSync(photosDir)) continue;

      for (const indexFile of findIndexFiles(photosDir)) {
        const raw  = fs.readFileSync(indexFile, "utf8");
        const data = parseFrontMatter(raw, indexFile);
        if (!data || !Array.isArray(data.photos)) continue;

        const owner = (data.soldier || soldierSlug).trim();

        for (const photo of data.photos) {
          if (!photo) continue;

          // Build the set of slugs to credit for this photo.
          const toCount = new Set();
          toCount.add(owner);
          slugList(photo.contains).split(" ").filter(Boolean).forEach(s => toCount.add(s));
          slugList(photo.tagged).split(" ").filter(Boolean).forEach(s => toCount.add(s));

          for (const s of toCount) {
            if (soldierMap[s]) soldierMap[s].photo_count++;
          }
        }
      }
    }
  }

  // ── FINAL: Push soldier records with accurate photo_count ──────────────

  // ---- PASS 2e: Letters ----
  // Letters live at soldiers/[slug]/letters/[file].md (migrated out of documents/).
  // Indexed as type "letter" so they remain searchable after the move.
  if (fs.existsSync(soldiersDir)) {
    for (const soldierSlug of fs.readdirSync(soldiersDir)) {
      const lettersDir = path.join(soldiersDir, soldierSlug, "letters");
      if (!fs.existsSync(lettersDir) || !fs.statSync(lettersDir).isDirectory()) continue;
      for (const fname of fs.readdirSync(lettersDir)) {
        if (!fname.endsWith(".md")) continue;
        const filePath = path.join(lettersDir, fname);
        const raw  = fs.readFileSync(filePath, "utf8");
        const data = parseFrontMatter(raw, fname);
        if (!data || data.status === "draft") continue;

        const contains = slugList(data.contains);
        const tagged   = slugList(data.tagged);
        warnUnknown(contains, fname);

        const lslug = data.slug || fname.replace(/\.md$/, "");
        records.push({
          type:        "letter",
          id:          lslug,
          slug:        lslug,
          url:         data.permalink || `/soldiers/${soldierSlug}/letters/${lslug}/`,
          name:        data.title || lslug,
          date:        data.doc_date || data.date || "",
          contributor: soldierSlug,
          event:       "",
          contains,
          tagged,
          excerpt:     extractExcerpt(raw),
        });
      }
    }
  }

  for (const record of Object.values(soldierMap)) {
    records.push(record);
  }

  return records;
};
