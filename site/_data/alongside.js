// site/_data/alongside.js
//
// Build-time crawler for the "Served Alongside" tab.
//
// Output shape (consumed by soldier.njk as `alongside[slug]`):
//   {
//     "miller-marvin-dale": {
//       tier1: [ { slug, basis, source } ],   // auto-detected from photos/docs — never persisted
//       tier2: [ { slug, basis, source } ],   // same-platoon manual links
//       tier3: [ { slug, basis, source } ],   // same-company / broader manual links
//     },
//     ...
//   }
//
// Tier rules:
//   Tier 1  basis "photo" or "document"  — co-identified in a contains[] array
//   Tier 2  basis "same-platoon"         — manually linked, close association
//   Tier 3  everything else manual       — verbal-account, same-company, manual, etc.
//
// Sources (Tier 1 — build-time only, never written to disk):
//   1. soldiers/{slug}/photos/**/index.md  — photo contains[] pairs
//   2. site/documents/{top}/{doc}/{doc}.md — document contains[] pairs (two flavours: string or {slug})
//
// Sources (Tier 2/3 — persisted, admin-written):
//   3. soldiers/{slug}/_alongside.json    — per-soldier manual file
//        format: [ { "slug": "other-slug", "basis": "same-platoon", "notes": "..." }, ... ]
//   4. _data/relationships.json           — legacy manual links (same format as above but global)
//
// Dedup: any slug already in Tier 1 is silently dropped from Tier 2/3.

"use strict";

const fs   = require("fs");
const path = require("path");
const yaml = require("js-yaml");

const SOLDIERS_DIR       = path.join(__dirname, "..", "soldiers");
const DOCUMENTS_DIR      = path.join(__dirname, "..", "documents");
const RELATIONSHIPS_FILE = path.join(__dirname, "relationships.json");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function toSlug(entry) {
  if (!entry) return null;
  if (typeof entry === "string") return entry.trim() || null;
  if (typeof entry === "object" && entry.slug) return String(entry.slug).trim() || null;
  return null;
}

function parseFrontMatter(filePath) {
  if (!fs.existsSync(filePath)) return null;
  try {
    const raw   = fs.readFileSync(filePath, "utf8");
    const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!match) return null;
    return yaml.load(match[1]) || null;
  } catch (e) {
    return null;
  }
}

function findIndexFiles(dir, results = []) {
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) findIndexFiles(full, results);
    else if (entry.name === "index.md") results.push(full);
  }
  return results;
}

// ---------------------------------------------------------------------------
// Tier 1 builder — photo and document co-appearances
// ---------------------------------------------------------------------------

function buildTier1() {
  // Map: slugA → Set<slugB> (bidirectional pairs with source info)
  // We store: slugA → Map<slugB, {basis, source}>
  const pairs = {}; // slug → { otherSlug: { basis, source } }

  function ensure(slug) {
    if (!pairs[slug]) pairs[slug] = {};
  }

  function link(slugA, slugB, basis, source) {
    if (!slugA || !slugB || slugA === slugB) return;
    ensure(slugA); ensure(slugB);
    if (!pairs[slugA][slugB]) pairs[slugA][slugB] = { basis, source };
    if (!pairs[slugB][slugA]) pairs[slugB][slugA] = { basis, source };
  }

  function linkAll(slugs, basis, source) {
    for (let i = 0; i < slugs.length; i++)
      for (let j = i + 1; j < slugs.length; j++)
        link(slugs[i], slugs[j], basis, source);
  }

  // Photos
  // Primary rule: the folder owner (soldiers/{slug}/) gets linked to every slug
  // in any contains[] entry across their photo indexes. It's their collection —
  // if they photographed or kept a photo of someone, that person is Tier 1.
  // Co-presence pairs within the same contains[] are also linked as a bonus.
  if (fs.existsSync(SOLDIERS_DIR)) {
    for (const soldierEntry of fs.readdirSync(SOLDIERS_DIR, { withFileTypes: true })) {
      if (!soldierEntry.isDirectory()) continue;
      const owner = soldierEntry.name;
      for (const indexPath of findIndexFiles(path.join(SOLDIERS_DIR, owner, "photos"))) {
        const fm = parseFrontMatter(indexPath);
        if (!fm || !Array.isArray(fm.photos)) continue;
        for (const photo of fm.photos) {
          if (!Array.isArray(photo.contains)) continue;
          const slugs = photo.contains.map(toSlug).filter(Boolean);
          const src   = photo.filename || "";
          // Owner → each person in contains
          for (const s of slugs) link(owner, s, "photo", src);
          // Also pair the contains members with each other (co-presence)
          if (slugs.length >= 2) linkAll(slugs, "photo", src);
        }
      }
    }
  }

  // Documents
  // Primary rule: the folder owner (documents/{topSlug}/) and the explicit
  // author field both get linked to every slug in contains[].
  if (fs.existsSync(DOCUMENTS_DIR)) {
    for (const topEntry of fs.readdirSync(DOCUMENTS_DIR, { withFileTypes: true })) {
      if (!topEntry.isDirectory()) continue;
      const owner  = topEntry.name;
      const topDir = path.join(DOCUMENTS_DIR, owner);
      for (const docEntry of fs.readdirSync(topDir, { withFileTypes: true })) {
        if (!docEntry.isDirectory()) continue;
        const docFile = path.join(topDir, docEntry.name, `${docEntry.name}.md`);
        if (!fs.existsSync(docFile)) continue;
        const fm = parseFrontMatter(docFile);
        if (!Array.isArray(fm && fm.contains)) continue;
        const src    = docEntry.name;
        const author = fm.author ? toSlug(fm.author) : null;
        const slugs  = fm.contains.map(toSlug).filter(Boolean);
        // Folder owner → each person in contains
        for (const s of slugs) link(owner, s, "document", src);
        // Explicit author → each person in contains (may differ from folder owner)
        if (author && author !== owner) {
          for (const s of slugs) link(author, s, "document", src);
        }
        // Co-presence pairs within the same document
        const allSlugs = author ? [author, ...slugs.filter(s => s !== author)] : slugs;
        if (allSlugs.length >= 2) linkAll(allSlugs, "document", src);
      }
    }
  }

  // Convert to array-of-objects per slug
  const result = {};
  for (const [slug, others] of Object.entries(pairs)) {
    result[slug] = Object.entries(others).map(([otherSlug, meta]) => ({
      slug: otherSlug, basis: meta.basis, source: meta.source,
    }));
  }
  return result;
}

// ---------------------------------------------------------------------------
// Tier 2/3 builder — manual links from _alongside.json and relationships.json
// ---------------------------------------------------------------------------

function buildManual() {
  // slug → [ { slug, basis, source, notes } ]
  const manual = {};

  function ensure(slug) {
    if (!manual[slug]) manual[slug] = [];
  }

  function addLink(slugA, slugB, basis, source, notes) {
    if (!slugA || !slugB || slugA === slugB) return;
    ensure(slugA); ensure(slugB);
    // Avoid exact duplicates (same slug+basis pair)
    const alreadyA = manual[slugA].some(e => e.slug === slugB);
    const alreadyB = manual[slugB].some(e => e.slug === slugA);
    if (!alreadyA) manual[slugA].push({ slug: slugB, basis, source: source || "", notes: notes || "" });
    if (!alreadyB) manual[slugB].push({ slug: slugA, basis, source: source || "", notes: notes || "" });
  }

  // Per-soldier _alongside.json
  if (fs.existsSync(SOLDIERS_DIR)) {
    for (const soldierEntry of fs.readdirSync(SOLDIERS_DIR, { withFileTypes: true })) {
      if (!soldierEntry.isDirectory()) continue;
      const slug     = soldierEntry.name;
      const filePath = path.join(SOLDIERS_DIR, slug, "_alongside.json");
      if (!fs.existsSync(filePath)) continue;
      let entries;
      try { entries = JSON.parse(fs.readFileSync(filePath, "utf8")); } catch (e) { continue; }
      if (!Array.isArray(entries)) continue;
      for (const entry of entries) {
        const other = toSlug(entry.slug || entry);
        if (other) addLink(slug, other, entry.basis || "manual", entry.source || "", entry.notes || "");
      }
    }
  }

  // relationships.json (legacy)
  if (fs.existsSync(RELATIONSHIPS_FILE)) {
    let rels;
    try { rels = JSON.parse(fs.readFileSync(RELATIONSHIPS_FILE, "utf8")); } catch (e) { return manual; }
    if (Array.isArray(rels)) {
      for (const rel of rels) {
        if (!Array.isArray(rel.soldiers) || rel.soldiers.length < 2) continue;
        for (let i = 0; i < rel.soldiers.length; i++)
          for (let j = i + 1; j < rel.soldiers.length; j++)
            addLink(rel.soldiers[i], rel.soldiers[j], rel.basis || "manual", rel.source || "", rel.notes || "");
      }
    }
  }

  return manual;
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

module.exports = function () {
  const tier1All = buildTier1();
  const manualAll = buildManual();

  // Collect all slugs across both sources
  const allSlugs = new Set([...Object.keys(tier1All), ...Object.keys(manualAll)]);

  const result = {};

  for (const slug of allSlugs) {
    const t1entries = tier1All[slug] || [];
    const manualEntries = manualAll[slug] || [];

    // Build a set of slugs already in Tier 1 for fast dedup lookup
    const tier1Slugs = new Set(t1entries.map(e => e.slug));

    const t2entries = [];
    const t3entries = [];

    for (const entry of manualEntries) {
      // Drop if already covered by Tier 1
      if (tier1Slugs.has(entry.slug)) continue;
      // Manual entries are always Tier 2 or 3 — never Tier 1 regardless of basis label.
      // Tier 2 = same-platoon; everything else = Tier 3.
      if (entry.basis === "same-platoon") t2entries.push(entry);
      else                                t3entries.push(entry);
    }

    // Only include soldiers that have at least one connection
    if (t1entries.length || t2entries.length || t3entries.length) {
      result[slug] = { tier1: t1entries, tier2: t2entries, tier3: t3entries };
    }
  }

  return result;
};
