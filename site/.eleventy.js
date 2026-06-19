module.exports = function(eleventyConfig) {

  // Exclude archivist notes files and template scaffolding from build output
  eleventyConfig.ignores.add("**/_notes.md");
  eleventyConfig.ignores.add("**/_template.md");

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

  // Sort collection by a data field, descending. Blanks sort to end.
  eleventyConfig.addFilter("sortByData", function(arr, key) {
    if (!arr || !Array.isArray(arr)) return [];
    const toStr = v => {
      if (!v) return "";
      if (v instanceof Date) return v.toISOString().slice(0, 10);
      return String(v);
    };
    return [...arr].sort((a, b) => {
      const va = toStr(a.data?.[key]);
      const vb = toStr(b.data?.[key]);
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
