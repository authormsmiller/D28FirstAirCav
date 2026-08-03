// site/_data/photosByFsb.js
//
// Reverse lookup: { [location-slug]: [...photo entries] }
//
// Built from the same scan as photosBySlug — includes any photo whose
// `fsb` field is set, across all subfolders (notably locations/[slug]).
// Lets a location page populate its Photos tab from contributors' collections
// without listing photos in the location's own front matter.
//
// Usage in location.njk:
//   {% set locPhotos = photosByFsb[slug] if photosByFsb[slug] else [] %}

const photosBySlugFn = require("./photosBySlug");

module.exports = function () {
  return photosBySlugFn().byFsb || {};
};
