module.exports = function(eleventyConfig) {

  // Exclude archivist notes files and template scaffolding from build output
  eleventyConfig.ignores.add("**/_notes.md");
  eleventyConfig.ignores.add("**/_template.md");

  // Raw scraped/saved HTML source snapshots under any "documents" folder
  // (soldier documents/, top-level site/documents/) are provenance copies,
  // not site templates -- exclude from Nunjucks templating (their embedded
  // scripts/CSS can contain stray "{#" / "{%" sequences that break the
  // Nunjucks parser and silently kill the entire build -- "Wrote 0 files"
  // with no other symptom). NOT passthrough-copied here — same Windows EPERM
  // issue documented below for assets/; copy manually if a raw snapshot needs
  // to be served directly (most are provenance-only, not linked from the site).
  eleventyConfig.ignores.add("**/documents/**/*.html");

  // Assets passthrough disabled — _site/assets/ is managed manually to avoid
  // EPERM on Windows when files are held open by the browser or dev server.
  // Run: xcopy /E /Y assets _site\assets to sync manually when assets change.
  // eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addWatchTarget("assets/");

  // Collections
  // All soldier profiles — sorted by last name
  eleventyConfig.addCollection("soldiers", function(collectionApi) {
    return collectionApi
      .getFilteredByGlob("./soldiers/*/*.md")
      .filter(s => !s.data.draft)
      .sort((a, b) => {
        const nameA = (a.data.last_name || "").toLowerCase();
        const nameB = (b.data.last_name || "").toLowerCase();
        return nameA.localeCompare(nameB);
      });
  });

  // KIA soldiers only — for the Never Forgotten section
  eleventyConfig.addCollection("kia", function(collectionApi) {
    return collectionApi
      .getFilteredByGlob("./soldiers/*/*.md")
      .filter(s => !s.data.draft)
      .filter(s => s.data.status === "KIA");
  });

  // Document pages — sorted by contributor then slug
  // _notes.md files are archivist research notes, not renderable pages
  eleventyConfig.addCollection("documents", function(collectionApi) {
  return collectionApi.getFilteredByGlob("./documents/**/*.md")
    .filter(p => !p.inputPath.includes("/_notes.md"));
  });

  eleventyConfig.addCollection("anecdotes", function(collectionApi) {
  return collectionApi.getFilteredByGlob("./anecdotes/**/*.md");
  });
  eleventyConfig.addCollection("letters", function(collectionApi) {
  return collectionApi.getFilteredByGlob("./soldiers/*/letters/*.md");
  });
  eleventyConfig.addCollection("events", function(collectionApi) {
  return collectionApi.getFilteredByGlob("./events/**/*.md");
  });

  // Location / firebase profiles — sorted by first occupancy date, then name.
  // _template.md and _notes.md are scaffolding, not renderable pages.
  eleventyConfig.addCollection("locations", function(collectionApi) {
    const firstDate = (d) => {
      const occ = (d.occupancies && d.occupancies.length) ? d.occupancies : null;
      let v = occ ? (occ[0].start || occ[0].date) : (d.dates && d.dates.established ? d.dates.established.date : null);
      if (!v) return "9999";
      if (v instanceof Date) return v.toISOString().slice(0, 10);
      return String(v);
    };
    return collectionApi.getFilteredByGlob("./locations/**/*.md")
      .filter(p => !p.inputPath.includes("/_template") && !p.inputPath.includes("/_notes") && !p.inputPath.includes("/_photo-index-template") && !p.data.draft)
      .sort((a, b) => {
        const da = firstDate(a.data), db = firstDate(b.data);
        if (da !== db) return da.localeCompare(db);
        return (a.data.display_name || "").localeCompare(b.data.display_name || "");
      });
  });

  // All photos across all soldiers — for cross-soldier contains queries
  eleventyConfig.addCollection("allPhotos", function(collectionApi) {
    const soldiers = collectionApi.getFilteredByGlob("./soldiers/*/*.md").filter(s => !s.data.draft);
    const allPhotos = [];
    for (const soldier of soldiers) {
      const photos = soldier.data.photos || [];
      for (const photo of photos) {
        allPhotos.push({
          ...photo,
          source_soldier_slug: soldier.data.slug,
          source_soldier_name: soldier.data.first_name + " " + soldier.data.last_name,
        });
      }
    }
    return allPhotos;
  });

  // Filters
  // Format a date string nicely: "December 1970"
  eleventyConfig.addFilter("dateDisplay", function(dateStr) {
    if (!dateStr) return "—";
    return dateStr;
  });

  // Join an array with a separator
  eleventyConfig.addFilter("join", function(arr, sep = ", ") {
    if (!arr || !Array.isArray(arr)) return "";
    return arr.join(sep);
  });

  // Return first item of array (for profile photo)
  eleventyConfig.addFilter("first", function(arr) {
    if (!arr || !arr.length) return null;
    return arr[0];
  });

  // Nickname display — wraps in quotes if present
  eleventyConfig.addFilter("nickname", function(nick) {
    if (!nick) return "";
    return `"${nick}"`;
  });

  // Limit array to N items
  eleventyConfig.addFilter("limit", function(arr, n) {
    if (!arr || !Array.isArray(arr)) return [];
    return arr.slice(0, n);
  });

  // Format a date value (string or Date object) as YYYY-MM-DD
  eleventyConfig.addFilter("isoDate", function(val) {
    if (!val) return "";
    let d;
    if (val instanceof Date) {
      d = val;
    } else {
      const parts = String(val).slice(0, 10).split("-");
      d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    }
    if (isNaN(d)) return String(val).slice(0, 10);
    return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  });

  // Format a partial date for locations: accepts a year ("1971"),
  // year-month ("1971-03"), full date ("1971-03-09"), or a Date object
  // (YAML auto-parses unquoted YYYY-MM-DD to a Date). Returns "" for blanks.
  //   "1971"       -> "1971"
  //   "1971-03"    -> "Mar 1971"
  //   "1971-03-09" -> "9 Mar 1971"
  eleventyConfig.addFilter("locDate", function(val) {
    if (!val) return "";
    const MON = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    let y, m, d;
    if (val instanceof Date) {
      y = val.getUTCFullYear(); m = val.getUTCMonth() + 1; d = val.getUTCDate();
    } else {
      const parts = String(val).trim().slice(0, 10).split("-");
      y = Number(parts[0]);
      m = parts[1] ? Number(parts[1]) : null;
      d = parts[2] ? Number(parts[2]) : null;
    }
    if (!y || isNaN(y)) return String(val);
    if (!m || isNaN(m)) return String(y);
    if (!d || isNaN(d)) return MON[m - 1] + " " + y;
    return d + " " + MON[m - 1] + " " + y;
  });

  // Convert a variety of date formats used across the archive into a
  // zero-padded YYYYMMDD string for chronological sorting. Handles:
  //   ISO: "1971", "1971-04", "1971-04-20" (also unquoted YAML Dates)
  //   Prose: "24 Jan 1971", "May 1971", "Late Jan 1971", "16–22 Jul 1971"
  // Falls back to "99999999" (sorts last) rather than throwing or
  // silently mis-sorting on a format we don't recognize.
  function timelineSortKey(dateStr) {
    if (!dateStr) return "99999999";
    if (dateStr instanceof Date) {
      const y = dateStr.getUTCFullYear();
      const m = dateStr.getUTCMonth() + 1;
      const d = dateStr.getUTCDate();
      return String(y).padStart(4, "0") + String(m).padStart(2, "0") + String(d).padStart(2, "0");
    }
    let s = String(dateStr).trim();
    if (!s) return "99999999";

    const MONTHS = { jan:1, feb:2, mar:3, apr:4, may:5, jun:6, jul:7, aug:8, sep:9, oct:10, nov:11, dec:12 };

    // ISO: YYYY, YYYY-MM, YYYY-MM-DD
    let m = s.match(/^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?$/);
    if (m) {
      const y = m[1], mo = m[2] || "01", da = m[3] || "01";
      return y + mo + da;
    }

    // Strip a leading qualifier ("Late"/"Early"/"Mid") and remember an
    // approximate day-of-month bias to use for month-only prose dates.
    let qualifierDay = null;
    const qm = s.match(/^(late|early|mid)\s+(.*)$/i);
    if (qm) {
      const q = qm[1].toLowerCase();
      qualifierDay = q === "early" ? "05" : (q === "mid" ? "15" : "25");
      s = qm[2];
    }

    // Day range, sort on the first day: "16–22 Jul 1971"
    let pm = s.match(/^(\d{1,2})\s*[-–—]\s*\d{1,2}\s+([A-Za-z]{3,})\s+(\d{4})$/);
    // Single day: "24 Jan 1971" / "1 Mar 1971"
    if (!pm) pm = s.match(/^(\d{1,2})\s+([A-Za-z]{3,})\s+(\d{4})$/);
    if (pm) {
      const day = pm[1].padStart(2, "0");
      const mo = MONTHS[pm[2].slice(0, 3).toLowerCase()];
      if (mo) return pm[3] + String(mo).padStart(2, "0") + day;
    }

    // Month + year only: "May 1971"
    const pm2 = s.match(/^([A-Za-z]{3,})\s+(\d{4})$/);
    if (pm2) {
      const mo = MONTHS[pm2[1].slice(0, 3).toLowerCase()];
      if (mo) return pm2[2] + String(mo).padStart(2, "0") + (qualifierDay || "01");
    }

    // Last resort: pull any 4-digit year out of the string.
    const ym = s.match(/(\d{4})/);
    if (ym) return ym[1] + "0101";

    return "99999999";
  }
  eleventyConfig.addFilter("timelineSortKey", timelineSortKey);

  // Merge a soldier's hand-authored timeline entries with the
  // event-injected entries built at template render time (in soldier.njk)
  // into one chronologically sorted array. Each entry is tagged with
  // _source so the template can render the right markup:
  //   "hand"  — archivist-authored entry (tags/body/source_notice)
  //   "event" — auto-injected pointer to a matched event page (tier badge)
  // Previously these rendered as two separate blocks — hand-authored
  // entries first, then every injected entry after them regardless of
  // date — which stranded auto-injected entries (e.g. a corroborated-but-
  // not-directly-authored contact) out of chronological order at the
  // bottom of the timeline.
  eleventyConfig.addFilter("mergeTimeline", function(handAuthored, injected) {
    const hand = (handAuthored || []).map(e => Object.assign({}, e, { _source: "hand", _sortKey: timelineSortKey(e.date) }));
    const evts = (injected || []).map(e => Object.assign({}, e, { _source: "event", _sortKey: timelineSortKey(e.date) }));
    return hand.concat(evts).sort((a, b) => a._sortKey < b._sortKey ? -1 : (a._sortKey > b._sortKey ? 1 : 0));
  });

  // Sort collection by a data field, descending. Blanks sort to end.
  // Supports dot-path keys for nested fields, e.g. "archivist_notes.created".
  eleventyConfig.addFilter("sortByData", function(arr, key) {
    if (!arr || !Array.isArray(arr)) return [];
    const toStr = v => {
      if (!v) return "";
      if (v instanceof Date) return v.toISOString().slice(0, 10);
      return String(v);
    };
    const getPath = (obj, path) =>
      String(path).split(".").reduce((o, k) => (o == null ? o : o[k]), obj);
    return [...arr].sort((a, b) => {
      const va = toStr(getPath(a.data, key));
      const vb = toStr(getPath(b.data, key));
      if (!va && !vb) return 0;
      if (!va) return 1;
      if (!vb) return -1;
      return vb.localeCompare(va);
    });
  });

  // Filter collection to items where a data field matches a value
  eleventyConfig.addFilter("whereData", function(arr, key, value) {
    if (!arr || !Array.isArray(arr)) return [];
    return arr.filter(item => item.data?.[key] === value);
  });

  // Post-process rendered HTML to handle footnote syntax.
  // Footnote definitions:  [^id]: citation text   (rendered by markdown-it as a paragraph)
  // Footnote references:   [^id]                  (rendered by markdown-it as literal text)
  // Outputs numbered superscript links inline and a footnotes section at the end.
  eleventyConfig.addFilter("processFootnotes", function(html) {
    if (!html || !html.includes('[^')) return html;

    const defs = {};

    // Collect and remove footnote definition paragraphs: <p>[^id]: text</p>
    html = html.replace(/<p>\[\^([^\]]+)\]:\s*([\s\S]*?)<\/p>/g, function(match, id, text) {
      defs[id] = text.trim();
      return '';
    });

    // Number refs in order of first appearance, replace with superscript links
    const order = [];
    html = html.replace(/\[\^([^\]]+)\]/g, function(match, id) {
      if (!order.includes(id)) order.push(id);
      const num = order.indexOf(id) + 1;
      return '<sup id="fnref-' + id + '" class="footnote-ref"><a href="#fn-' + id + '">' + num + '</a></sup>';
    });

    // Append footnotes section
    if (order.length > 0) {
      let section = '<section class="footnotes"><hr class="footnotes-sep"><ol class="footnotes-list">';
      for (const id of order) {
        const text = defs[id] || '';
        section += '<li id="fn-' + id + '" class="footnote-item">' + text + ' <a href="#fnref-' + id + '" class="footnote-backref" aria-label="Back to reference ' + id + '">&#x21A9;</a></li>';
      }
      section += '</ol></section>';
      html += section;
    }

    return html;
  });

  return {
    dir: {
      input:    ".",
      output:   "_site",
      includes: "_includes",
      data:     "_data"
    },
    templateFormats: ["njk", "md", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};
