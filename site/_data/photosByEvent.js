// site/_data/photosByEvent.js
//
// Reverse lookup: { [event-slug]: [...photo entries] }
//
// Built from the same scan as photosBySlug — includes any photo whose
// `event` field is set, across all subfolders (field, field/events/*).
//
// Consumed by the event template to populate the Images tab with
// photos contributed by soldiers, without requiring the event's own
// front matter to list them manually.
//
// Usage in event.njk:
//   {% set crawlerPhotos = photosByEvent[slug] if photosByEvent[slug] else [] %}
//
// Each entry shape (same as photosBySlug entries):
//   { filename, caption, caption_short, credit, photographer,
//     date, date_known, event, contains, tagged,
//     subfolder, soldier_slug, url }

const photosBySlugFn = require("./photosBySlug");

module.exports = function () {
  return photosBySlugFn().byEvent || {};
};
