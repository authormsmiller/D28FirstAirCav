/**
 * frontmatter.js
 * Read, mutate, and write YAML front matter in .md files.
 * Uses gray-matter for parsing; writes back with js-yaml for clean output.
 *
 * Field type map — determines whether a field is a scalar or an array.
 * The tool needs this so it knows whether to SET a value or APPEND to a list.
 */

import { promises as fs } from 'fs';
import matter from 'gray-matter';
import yaml from 'js-yaml';

// ─── field type registry ─────────────────────────────────────────────────────

/**
 * Fields that are YAML arrays (appending is the default action).
 * Everything not listed here is treated as a scalar (set/overwrite).
 */
const ARRAY_FIELDS = new Set([
  'contains',
  'tagged',
  'casualties',
  'related_events',
  'accounts',
  'open_questions',
  'units',
  'platoons',
  'records',
  'images',
  // soldier-specific array fields
  'decorations',
  'distinguished_decorations',
  'brothers',
  'documents',
]);

/**
 * Fields that hold YAML booleans.
 * String values 'true'/'false' from the admin form should be coerced to
 * actual JS booleans before writing so js-yaml emits `true` / `false`
 * rather than quoted strings.
 */
export const BOOLEAN_FIELDS = new Set([
  'family_contact',
  'share_contact',
  'wartime_content_notice',
  'associated',
]);

/**
 * Fields that are read-only — the tool will not allow writing to these.
 * Layout, permalink, and slug are structural; they should be changed
 * only by hand or by the New Record scaffolder.
 */
const READONLY_FIELDS = new Set([
  'layout',
  'permalink',
  'slug',
  'archive_id',
]);

export function isArrayField(field) {
  return ARRAY_FIELDS.has(field);
}

export function isReadonlyField(field) {
  // For dot paths (e.g. "contact.name"), check the top-level key only
  const topKey = field.split('.')[0];
  return READONLY_FIELDS.has(topKey);
}

export function isBooleanField(field) {
  // For dot paths, check the leaf key (e.g. "contact.share_contact" → "share_contact")
  const leafKey = field.split('.').pop();
  return BOOLEAN_FIELDS.has(leafKey);
}

// ─── nested field helpers ─────────────────────────────────────────────────────

/**
 * Get a value from a (possibly nested) field path.
 * "contact.name" → data.contact?.name
 */
export function getNestedValue(data, field) {
  return field.split('.').reduce((obj, key) => (obj != null ? obj[key] : undefined), data);
}

/**
 * Set a value on a (possibly nested) field path, creating intermediate
 * objects as needed.
 * "contact.name" → data.contact = { ...data.contact, name: value }
 */
export function setNestedValue(data, field, value) {
  const keys = field.split('.');
  if (keys.length === 1) {
    data[field] = value;
    return;
  }
  let obj = data;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (obj[key] == null || typeof obj[key] !== 'object') {
      obj[key] = {};
    }
    obj = obj[key];
  }
  obj[keys[keys.length - 1]] = value;
}

// ─── public API ──────────────────────────────────────────────────────────────

/**
 * Read a file and return its parsed front matter as a plain object.
 * { data, content, raw }
 *   data    — the front matter as a JS object
 *   content — the markdown body (after the closing ---)
 *   raw     — the original file text (for reference / diffing)
 */
export async function readRecord(filePath) {
  const raw = await fs.readFile(filePath, 'utf8');
  const { data, content } = matter(raw);
  return { data, content, raw };
}

/**
 * Attach a value to a field in a record file.
 *
 * For array fields: appends the value if not already present.
 * For scalar fields: sets the value (overwrites).
 *
 * Returns { changed: bool, previousValue, newValue }
 * Throws if the field is read-only.
 *
 * Does NOT write to disk — call writeRecord() after reviewing.
 */
export function attachValue(data, field, value) {
  if (isReadonlyField(field)) {
    throw new Error(`Field "${field}" is read-only and cannot be edited via the admin tool.`);
  }

  const previousValue = data[field];

  if (isArrayField(field)) {
    const current = Array.isArray(data[field]) ? data[field] : (data[field] ? [data[field]] : []);
    if (current.includes(value)) {
      return { changed: false, previousValue, newValue: current };
    }
    const newValue = [...current, value];
    data[field] = newValue;
    return { changed: true, previousValue: current, newValue };
  } else {
    if (data[field] === value) {
      return { changed: false, previousValue, newValue: value };
    }
    data[field] = value;
    return { changed: true, previousValue, newValue: value };
  }
}

/**
 * Remove a value from a field.
 *
 * For array fields: removes the value if present.
 * For scalar fields: sets to empty string.
 */
export function detachValue(data, field, value) {
  if (isReadonlyField(field)) {
    throw new Error(`Field "${field}" is read-only.`);
  }

  const previousValue = data[field];

  if (isArrayField(field)) {
    const current = Array.isArray(data[field]) ? data[field] : [];
    const newValue = current.filter(v => v !== value);
    data[field] = newValue;
    return { changed: current.length !== newValue.length, previousValue: current, newValue };
  } else {
    data[field] = '';
    return { changed: previousValue !== '', previousValue, newValue: '' };
  }
}

/**
 * Write a (possibly mutated) record back to disk.
 * Reconstructs the file as: ---\n[yaml]\n---\n[body]
 *
 * Gray-matter stringify is intentionally NOT used here — it can reorder
 * keys and mangle multiline strings. We serialize the front matter with
 * js-yaml directly for clean, predictable output.
 */
export async function writeRecord(filePath, data, content) {
  const frontMatter = yaml.dump(data, {
    lineWidth: -1,         // don't wrap long values
    quotingType: '"',      // consistent quoting
    forceQuotes: false,    // only quote when necessary
    noRefs: true,          // no YAML anchors
  });

  const output = `---\n${frontMatter}---\n${content}`;
  await fs.writeFile(filePath, output, 'utf8');
}

/**
 * Return a human-readable summary of what changed between two data objects.
 * Used to generate commit messages.
 */
export function describeDiff(before, after) {
  const lines = [];
  const allKeys = new Set([...Object.keys(before), ...Object.keys(after)]);
  for (const key of allKeys) {
    const bv = JSON.stringify(before[key]);
    const av = JSON.stringify(after[key]);
    if (bv !== av) {
      lines.push(`  ${key}: ${bv} → ${av}`);
    }
  }
  return lines.join('\n');
}
