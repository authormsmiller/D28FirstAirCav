// site/_data/photosBySlug.js
//
// Photo crawler — walks site/soldiers/[slug]/photos/[subfolder]/index.md,
// reads front matter, builds { [soldierSlug]: { profile:[...], field:[...], ... } }.
// Each photo entry gets a resolved `url` (Cloudflare Worker path).
//
// Reverse lookup maps (attached to the returned object):
//   .byContains[slug]  — photos whose contains[] includes slug
//   .byTagged[slug]    — photos whose tagged[] includes slug
//   .byEvent[slug]     — photos whose event == slug
//   .byFsb[loc-slug]   — photos whose fsb == loc-slug (projects onto a location page)
//
// Subfolders scanned:
//   profile, field            (flat KNOWN_SUBFOLDERS)
//   field/events[/slug]       (event photos, dynamic)
//   locations/[loc-slug]      (location-tied photos, dynamic — e.g. a contributor's
//                              firebase deck; each entry carries fsb: <loc-slug>)

const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const SOLDIERS_DIR = path.join(__dirname, "..", "soldiers");
const MEDIA_BASE = "/media/photos/soldiers";

const KNOWN_SUBFOLDERS = [
  "profile",
  "field",
];

function parsePhotoIndex(indexPath) {
  if (!fs.existsSync(indexPath)) return [];

  let raw;
  try {
    raw = fs.readFileSync(indexPath, "utf8");
  } catch (e) {
    return [];
  }

  let content = null;
  const closed = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (closed) {
    content = closed[1];
  } else if (raw.match(/^---\r?\n/)) {
    content = raw.replace(/^---\r?\n/, "");
  }

  if (!content) return [];

  let parsed;
  try {
    parsed = yaml.load(content);
  } catch (e) {
    console.warn(`[photosBySlug] YAML parse error in ${indexPath}:`, e.message);
    return [];
  }

  if (!parsed || !Array.isArray(parsed.photos)) return [];

  return parsed.photos;
}

function resolvePhoto(entry, soldierSlug, subfolder) {
  if (!entry.filename) return null;

  return {
    // Source fields (pass through as-is)
    filename: entry.filename,
    caption: entry.caption || "",
    caption_short: entry.caption_short || "",
    credit: entry.credit || "",
    credit_slug: entry.credit_slug || "",
    photographer: entry.photographer || "",
    date: entry.date || "",
    date_known: entry.date_known === true,
    event: entry.event || "",
    fsb: entry.fsb || "",
    subject: entry.subject || "",
    quality: entry.quality || "",
    note: entry.note || "",
    source_ref: entry.source_ref || "",
    source_file: entry.source_file || "",
    source_slide: entry.source_slide || "",
    contains: Array.isArray(entry.contains) ? entry.contains : [],
    tagged: Array.isArray(entry.tagged) ? entry.tagged : [],

    // Computed fields
    subfolder: subfolder,
    soldier_slug: soldierSlug,
    url: `${MEDIA_BASE}/${soldierSlug}/${subfolder}/${entry.filename}`,
  };
}

module.exports = function () {
  const result = {};
  const byContains = {};
  const byTagged = {};
  const byEvent = {};
  const byFsb = {};

  // Index a resolved photo into every reverse-lookup map it qualifies for.
  function indexReverse(photo) {
    for (const slug of photo.contains) {
      (byContains[slug] = byContains[slug] || []).push(photo);
    }
    for (const slug of photo.tagged) {
      (byTagged[slug] = byTagged[slug] || []).push(photo);
    }
    if (photo.event) {
      (byEvent[photo.event] = byEvent[photo.event] || []).push(photo);
    }
    if (photo.fsb) {
      (byFsb[photo.fsb] = byFsb[photo.fsb] || []).push(photo);
    }
  }

  if (!fs.existsSync(SOLDIERS_DIR)) {
    console.warn(`[photosBySlug] Soldiers directory not found: ${SOLDIERS_DIR}`);
    return result;
  }

  const soldierDirs = fs.readdirSync(SOLDIERS_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  for (const soldierSlug of soldierDirs) {
    const photosRoot = path.join(SOLDIERS_DIR, soldierSlug, "photos");
    if (!fs.existsSync(photosRoot)) continue;

    const soldierPhotos = {};

    // Flat known subfolders (profile, field)
    for (const subfolder of KNOWN_SUBFOLDERS) {
      const indexPath = path.join(photosRoot, subfolder, "index.md");
      const resolved = parsePhotoIndex(indexPath)
        .map(entry => resolvePhoto(entry, soldierSlug, subfolder))
        .filter(Boolean);

      if (resolved.length > 0) {
        soldierPhotos[subfolder] = resolved;
        resolved.forEach(indexReverse);
      }
    }

    // Dynamic: field/events/index.md (flat) and field/events/[slug]/index.md (nested)
    const eventsDir = path.join(photosRoot, "field", "events");
    if (fs.existsSync(eventsDir)) {
      const allEventPhotos = [];

      const flatIndexPath = path.join(eventsDir, "index.md");
      if (fs.existsSync(flatIndexPath)) {
        const resolved = parsePhotoIndex(flatIndexPath)
          .map(entry => resolvePhoto(entry, soldierSlug, "field/events"))
          .filter(Boolean);
        resolved.forEach(indexReverse);
        allEventPhotos.push(...resolved);
      }

      const eventSlugs = fs.readdirSync(eventsDir, { withFileTypes: true })
        .filter(d => d.isDirectory())
        .map(d => d.name);

      for (const eventSlug of eventSlugs) {
        const subfolderPath = `field/events/${eventSlug}`;
        const indexPath = path.join(eventsDir, eventSlug, "index.md");
        const resolved = parsePhotoIndex(indexPath)
          .map(entry => resolvePhoto(entry, soldierSlug, subfolderPath))
          .filter(Boolean);
        resolved.forEach(indexReverse);
        allEventPhotos.push(...resolved);
      }

      if (allEventPhotos.length > 0) {
        soldierPhotos["field/events"] = allEventPhotos;
      }
    }

    // Dynamic: locations/[loc-slug]/index.md — location-tied photos.
    // Each entry carries fsb: <loc-slug>, projecting it onto that location page.
    const locationsDir = path.join(photosRoot, "locations");
    if (fs.existsSync(locationsDir)) {
      const locSlugs = fs.readdirSync(locationsDir, { withFileTypes: true })
        .filter(d => d.isDirectory())
        .map(d => d.name);

      for (const locSlug of locSlugs) {
        const subfolderPath = `locations/${locSlug}`;
        const indexPath = path.join(locationsDir, locSlug, "index.md");
        const resolved = parsePhotoIndex(indexPath)
          .map(entry => resolvePhoto(entry, soldierSlug, subfolderPath))
          .filter(Boolean);
        if (resolved.length > 0) {
          soldierPhotos[subfolderPath] = resolved;
          resolved.forEach(indexReverse);
        }
      }
    }

    if (Object.keys(soldierPhotos).length > 0) {
      result[soldierSlug] = soldierPhotos;
    }
  }

  result.byContains = byContains;
  result.byTagged = byTagged;
  result.byEvent = byEvent;
  result.byFsb = byFsb;

  return result;
};
