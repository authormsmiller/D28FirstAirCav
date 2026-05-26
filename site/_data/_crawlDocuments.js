// site/_data/_crawlDocuments.js
// Shared crawl utility. Not exposed to Eleventy directly (underscore prefix).
// Called by documentsBySlug.js and documentsByEvent.js.
//
// Returns:
//   {
//     bySlug:  { [soldierSlug]: { authored: [], referenced: [], tagged: [] } }
//     byEvent: { [eventSlug]:   [...docs] }
//   }

const fs     = require('fs');
const path   = require('path');
const matter = require('gray-matter');

const DOCUMENTS_DIR = path.join(__dirname, '../documents');

module.exports = function crawlDocuments() {
  const bySlug  = {};
  const byEvent = {};

  // ── Helpers ────────────────────────────────────────────────────────────────

  function ensureSlug(slug) {
    if (!bySlug[slug]) {
      bySlug[slug] = { authored: [], referenced: [], tagged: [] };
    }
  }

  function addToEvent(eventSlug, doc) {
    if (!byEvent[eventSlug]) byEvent[eventSlug] = [];
    byEvent[eventSlug].push(doc);
  }

  // ── Crawl ──────────────────────────────────────────────────────────────────

  const topSlugs = fs.readdirSync(DOCUMENTS_DIR, { withFileTypes: true })
    .filter(e => e.isDirectory())
    .map(e => e.name);

  for (const topSlug of topSlugs) {
    const topDir = path.join(DOCUMENTS_DIR, topSlug);

    const docSlugs = fs.readdirSync(topDir, { withFileTypes: true })
      .filter(e => e.isDirectory())
      .map(e => e.name);

    for (const docSlug of docSlugs) {
      // Accept either the canonical ${docSlug}.md naming or index.md.
      // index.md is a valid alternative for documents that pre-date the
      // naming convention or were authored that way intentionally.
      const docFileCanonical = path.join(topDir, docSlug, `${docSlug}.md`);
      const docFileIndex     = path.join(topDir, docSlug, 'index.md');
      const docFile = fs.existsSync(docFileCanonical) ? docFileCanonical
                    : fs.existsSync(docFileIndex)     ? docFileIndex
                    : null;

      if (!docFile) continue;

      const { data: fm } = matter(fs.readFileSync(docFile, 'utf8'));

      // Minimal doc descriptor stored in indexes
      const doc = {
        slug:       docSlug,
        topSlug,
        title:      fm.title      || '',
        type:       fm.type       || '',
        date:       fm.doc_date   || fm.date || '',
        date_known: fm.date_known !== false, // missing field defaults to true
        status:     fm.status     || 'draft',
        source:     fm.source     || '',
        event:      fm.event      || '',
        path:       `${topSlug}/${docSlug}`,
      };

      // ── authored ────────────────────────────────────────────────────────────
      if (fm.author) {
        ensureSlug(fm.author);
        bySlug[fm.author].authored.push(doc);
      }

      // ── referenced (contains:) ──────────────────────────────────────────────
      // contains: items may be plain strings OR {slug, name} objects
      if (Array.isArray(fm.contains)) {
        for (const item of fm.contains) {
          const slugStr = (typeof item === 'string') ? item : (item && item.slug);
          if (!slugStr) continue;
          ensureSlug(slugStr);
          bySlug[slugStr].referenced.push(doc);
        }
      }

      // ── tagged ──────────────────────────────────────────────────────────────
      // Items may be plain strings OR {slug, name, ...} objects (same as contains).
      if (Array.isArray(fm.tagged)) {
        for (const item of fm.tagged) {
          const slugStr = (typeof item === 'string') ? item : (item && item.slug);
          if (!slugStr) continue;
          ensureSlug(slugStr);
          bySlug[slugStr].tagged.push(doc);
        }
      }

      // ── event index ─────────────────────────────────────────────────────────
      if (fm.event) {
        addToEvent(fm.event, doc);
      }
    }
  }

  return { bySlug, byEvent };
};
