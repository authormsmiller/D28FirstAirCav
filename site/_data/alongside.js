// site/_data/alongside.js
//
// Build-time crawler for the "Served Alongside" tab.
// Produces: { [slug]: { tier1: [], tier2: [], tier3: [], tier4: [] } }
// Each entry shape: { slug, notes }
//
// Tier 1 -- auto-detected at build time from photo/document contains[] arrays.
//           Always recalculated; never persisted to disk.
// Tier 2 -- same-platoon manual links (basis: "same-platoon" in
//           soldiers/{slug}/_alongside.json or _data/relationships.json).
// Tier 3 -- broader peer manual links (any other basis: verbal-account,
//           same-company/tour, etc.) in the same sources.
// Tier 4 -- commanding officer: the battalion LTC ("Stone Mountain 6"),
//           basis "commanding-officer" or "chain-of-command".
//
// Dedup: Tier 4 (CO) takes precedence -- a Tier-4 slug is removed from Tiers 1-3.
//        A slug in Tier 1 is excluded from Tier 2/3; a Tier-2 slug is excluded
//        from Tier 3. Duplicates within a tier are removed.

"use strict";
const fs   = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const SOLDIERS_DIR       = path.join(__dirname, "..", "soldiers");
const DOCUMENTS_DIR      = path.join(__dirname, "..", "documents");
const RELATIONSHIPS_FILE = path.join(__dirname, "relationships.json");

function parseFrontMatter(filePath) {
  if (!fs.existsSync(filePath)) return null;
  let raw;
  try {
    raw = fs.readFileSync(filePath, "utf8");
  } catch (e) {
    return null; // existsSync can lie on some filesystems
  }

  // Try standard front-matter block: ---\n ... \n---
  let content = null;
  const closed = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (closed) {
    content = closed[1];
  } else if (raw.match(/^---\r?\n/)) {
    // Front-matter-only file (no closing ---): take everything after the opening ---
    content = raw.replace(/^---\r?\n/, "");
  }

  if (!content) return null;
  try {
    return yaml.load(content) || null;
  } catch (e) {
    return null;
  }
}

module.exports = function () {

  const tier1Map = {};

  function addTier1(a, b) {
    if (!a || !b || a === b) return;
    if (!tier1Map[a]) tier1Map[a] = new Set();
    tier1Map[a].add(b);
  }

  function linkPair(a, b) {
    addTier1(a, b);
    addTier1(b, a);
  }

  if (fs.existsSync(SOLDIERS_DIR)) {
    const soldierDirs = fs.readdirSync(SOLDIERS_DIR, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name);

    for (const soldierSlug of soldierDirs) {
      const photosRoot = path.join(SOLDIERS_DIR, soldierSlug, "photos");
      if (!fs.existsSync(photosRoot)) continue;

      const indexPaths = [];

      for (const sub of ["profile", "field"]) {
        indexPaths.push(path.join(photosRoot, sub, "index.md"));
      }

      const eventsDir = path.join(photosRoot, "field", "events");
      if (fs.existsSync(eventsDir)) {
        indexPaths.push(path.join(eventsDir, "index.md"));
        fs.readdirSync(eventsDir, { withFileTypes: true })
          .filter(d => d.isDirectory())
          .forEach(d => indexPaths.push(path.join(eventsDir, d.name, "index.md")));
      }

      for (const indexPath of indexPaths) {
        const fm = parseFrontMatter(indexPath);
        if (!fm || !Array.isArray(fm.photos)) continue;

        for (const photo of fm.photos) {
          if (!photo) continue;
          const slugs = Array.isArray(photo.contains)
            ? photo.contains.filter(s => s && typeof s === "string")
            : [];

          for (const s of slugs) {
            linkPair(soldierSlug, s);
          }

          for (let i = 0; i < slugs.length; i++) {
            for (let j = i + 1; j < slugs.length; j++) {
              linkPair(slugs[i], slugs[j]);
            }
          }
        }
      }
    }
  }

  if (fs.existsSync(DOCUMENTS_DIR)) {
    const topSlugs = fs.readdirSync(DOCUMENTS_DIR, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name);

    for (const topSlug of topSlugs) {
      const topDir = path.join(DOCUMENTS_DIR, topSlug);
      const docSlugs = fs.readdirSync(topDir, { withFileTypes: true })
        .filter(d => d.isDirectory())
        .map(d => d.name);

      for (const docSlug of docSlugs) {
        const docFile = path.join(topDir, docSlug, `${docSlug}.md`);
        const fm = parseFrontMatter(docFile);
        if (!fm) continue;

        const author = fm.author && typeof fm.author === "string" ? fm.author : null;
        const contains = Array.isArray(fm.contains) ? fm.contains : [];
        const containsSlugs = contains
          .map(c => (typeof c === "string" ? c : c && c.slug ? c.slug : null))
          .filter(Boolean);

        if (author) {
          for (const s of containsSlugs) {
            linkPair(author, s);
          }
        }

        for (let i = 0; i < containsSlugs.length; i++) {
          for (let j = i + 1; j < containsSlugs.length; j++) {
            linkPair(containsSlugs[i], containsSlugs[j]);
          }
        }
      }
    }
  }

  // tNEntries: { soldierSlug: Map<otherSlug, { notes }> }
  // Tier 2 = same platoon; Tier 3 = broader peer (verbal-account, same-company/tour);
  // Tier 4 = commanding officer (the battalion LTC, "Stone Mountain 6").
  const t2Entries = {};
  const t3Entries = {};
  const t4Entries = {};

  // Map a relationship "basis" string to its Served-Alongside tier.
  function basisTier(basis) {
    if (basis === "same-platoon") return 2;
    if (basis === "commanding-officer" || basis === "chain-of-command") return 4;
    return 3;
  }

  function addManual(a, b, tier, notes) {
    if (!a || !b || a === b) return;
    const store = tier === 2 ? t2Entries : tier === 4 ? t4Entries : t3Entries;
    if (!store[a]) store[a] = new Map();
    if (!store[a].has(b)) store[a].set(b, { notes: notes || "" });
  }

  function addManualPair(a, b, tier, notesForA, notesForB) {
    addManual(a, b, tier, notesForA || "");
    addManual(b, a, tier, notesForB || "");
  }

  if (fs.existsSync(RELATIONSHIPS_FILE)) {
    let rels = [];
    try {
      rels = JSON.parse(fs.readFileSync(RELATIONSHIPS_FILE, "utf8"));
    } catch (e) { /* skip */ }

    for (const rel of rels) {
      if (!Array.isArray(rel.soldiers) || rel.soldiers.length < 2) continue;
      addManualPair(rel.soldiers[0], rel.soldiers[1], basisTier(rel.basis));
    }
  }

  if (fs.existsSync(SOLDIERS_DIR)) {
    const soldierDirs = fs.readdirSync(SOLDIERS_DIR, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name);

    for (const soldierSlug of soldierDirs) {
      const alFile = path.join(SOLDIERS_DIR, soldierSlug, "_alongside.json");
      if (!fs.existsSync(alFile)) continue;

      let entries = [];
      try {
        entries = JSON.parse(fs.readFileSync(alFile, "utf8"));
      } catch (e) { /* skip */ }

      for (const entry of entries) {
        if (!entry.slug) continue;
        // Notes are directional: attach to this soldier's view of the other only
        addManual(soldierSlug, entry.slug, basisTier(entry.basis), entry.notes || "");
        addManual(entry.slug, soldierSlug, basisTier(entry.basis), "");
      }
    }
  }

  const allSlugs = new Set([
    ...Object.keys(tier1Map),
    ...Object.keys(t2Entries),
    ...Object.keys(t3Entries),
    ...Object.keys(t4Entries),
  ]);

  const result = {};

  for (const slug of allSlugs) {
    // Tier 4 (commanding officer) takes precedence — a man's CO is shown only as CO,
    // never duplicated into the peer tiers.
    const t4map = t4Entries[slug] || new Map();
    const t4set = new Set(t4map.keys());
    const tier4 = Array.from(t4map.entries())
      .map(([s, data]) => ({ slug: s, notes: data.notes || "" }));

    const t1set = tier1Map[slug] || new Set();
    const tier1 = Array.from(t1set)
      .filter(s => !t4set.has(s))
      .map(s => ({ slug: s }));
    const tier1slugs = new Set(tier1.map(e => e.slug));

    const t2map = t2Entries[slug] || new Map();
    const tier2 = Array.from(t2map.entries())
      .filter(([s]) => !tier1slugs.has(s) && !t4set.has(s))
      .map(([s, data]) => ({ slug: s, notes: data.notes || "" }));

    const t3map = t3Entries[slug] || new Map();
    const tier2slugs = new Set(tier2.map(e => e.slug));
    const tier3 = Array.from(t3map.entries())
      .filter(([s]) => !tier1slugs.has(s) && !tier2slugs.has(s) && !t4set.has(s))
      .map(([s, data]) => ({ slug: s, notes: data.notes || "" }));
    result[slug] = { tier1, tier2, tier3, tier4 };
  }

  return result;
};
