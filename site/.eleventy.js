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
  
  // All photos across all soldiers — for cross-soldier contains queries
  eleventyConfig.addCollection("allPhotos", function(collectionApi) {
    const soldiers = collectionApi.getFilteredByGlob("./soldiers/*/*.md");
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
