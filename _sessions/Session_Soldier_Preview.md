# Session: Soldier Preview + Profile Photo — Restoration Guide

**Date:** 2026-05-20
**Repo:** `https://github.com/authormsmiller/d281staircav`
**Purpose:** This file exists to restore work lost in a git incident. It documents all changes made to the admin tool in full, with enough code to reconstruct from scratch.

---

## Overview of What Was Built

1. **`admin/lib/frontmatter.js`** — added soldier-specific array fields and boolean field support
2. **`admin/server.js`** — boolean coercion in `/api/edit`, 25mb body limit, new `/api/soldier/profile-photo` endpoint
3. **`admin/index.html`** — three major additions:
   - `EDIT_TABS.soldier` expanded from 1 tab to 5
   - `renderEditPreview` rewritten to be fully interactive (click-to-edit)
   - Profile photo modal (drop → crop → metadata → save)

---

## 1. `admin/lib/frontmatter.js`

### Add to `ARRAY_FIELDS`

```js
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
```

### Add `BOOLEAN_FIELDS` (insert after ARRAY_FIELDS, before READONLY_FIELDS)

```js
/**
 * Fields that hold YAML booleans.
 * String values 'true'/'false' from the admin form should be coerced to
 * actual JS booleans before writing so js-yaml emits `true` / `false`
 * rather than quoted strings.
 */
export const BOOLEAN_FIELDS = new Set([
  'family_contact',
  'wartime_content_notice',
  'associated',
]);
```

### Add `isBooleanField` export (after isReadonlyField)

```js
export function isBooleanField(field) {
  return BOOLEAN_FIELDS.has(field);
}
```

---

## 2. `admin/server.js`

### Imports — add `fs` and `SITE_ROOT`, import `isBooleanField`

```js
import { promises as fs } from 'fs';                          // add this line
import { resolvePath, listSlugs, SITE_ROOT } from './lib/records.js';  // add SITE_ROOT
import { readRecord, attachValue, detachValue, writeRecord, isArrayField, isReadonlyField, isBooleanField } from './lib/frontmatter.js';  // add isBooleanField
```

### Increase body size limit (required for base64 image uploads)

```js
app.use(express.json({ limit: '25mb' }));
```

### Coerce boolean values in `/api/edit`

In the existing `POST /api/edit` handler, replace the direct assignment:

```js
// Before:
data[field] = value;

// After:
const coercedValue = isBooleanField(field) && typeof value === 'string'
  ? (value === 'true' ? true : value === 'false' ? false : value)
  : value;
data[field] = coercedValue;
```

Also update the response to use `coercedValue`:
```js
res.json({ ok: true, field, previousValue, newValue: coercedValue, filePath });
```

### New endpoint — `POST /api/soldier/profile-photo`

Insert before the `registerPhotosRoutes(app)` line:

```js
// ─── profile photo ────────────────────────────────────────────────────────────

/**
 * POST /api/soldier/profile-photo
 * Body: { slug, imageData (base64 data URL), crop: {x,y,w,h}|null, credit, photographer }
 *
 * 1. Decodes base64 → sharp → optional crop → saves as {slug}-profile.jpg
 * 2. Writes site/soldiers/{slug}/photos/profile/index.md
 * 3. Sets profile_photo: {slug}-profile.jpg in the soldier stub
 */
app.post('/api/soldier/profile-photo', async (req, res) => {
  try {
    const { slug, imageData, crop, credit = '', photographer = '' } = req.body;
    if (!slug || !imageData) {
      return res.status(400).json({ error: 'slug and imageData are required' });
    }

    // Decode base64 data URL
    const matches = imageData.match(/^data:image\/(\w+);base64,(.+)$/s);
    if (!matches) return res.status(400).json({ error: 'Invalid image data URL' });
    const buffer = Buffer.from(matches[2], 'base64');

    // Ensure profile directory exists
    const profileDir = path.join(SITE_ROOT, 'soldiers', slug, 'photos', 'profile');
    await fs.mkdir(profileDir, { recursive: true });

    const filename = `${slug}-profile.jpg`;
    const outPath  = path.join(profileDir, filename);

    // Crop + convert with sharp (dynamic import — avoids Windows binary path issues)
    const { default: sharp } = await import('sharp');
    let pipeline = sharp(buffer);

    if (crop && crop.w > 0.02 && crop.h > 0.02) {
      const meta = await pipeline.metadata();
      pipeline = pipeline.extract({
        left:   Math.round(crop.x * meta.width),
        top:    Math.round(crop.y * meta.height),
        width:  Math.round(crop.w * meta.width),
        height: Math.round(crop.h * meta.height),
      });
    }

    await pipeline.jpeg({ quality: 90 }).toFile(outPath);

    // Write profile/index.md
    const creditStr       = credit      ? `"${credit.replace(/"/g, '\\"')}"` : '""';
    const photographerStr = photographer ? `"${photographer}"` : '""';
    const indexMd =
`---
soldier: ${slug}
subfolder: profile
photos:
  - filename: ${filename}
    caption: >

    caption_short: ""
    credit: ${creditStr}
    photographer: ${photographerStr}
    date:
    date_known: false
    event: ""
    quality:
    contains: []
    tagged: []
---
`;
    await fs.writeFile(path.join(profileDir, 'index.md'), indexMd, 'utf8');

    // Update soldier stub: set profile_photo field
    const soldierPath = await resolvePath('soldier', slug);
    if (soldierPath) {
      const { data, content } = await readRecord(soldierPath);
      data.profile_photo = filename;
      await writeRecord(soldierPath, data, content);
    }

    res.json({ ok: true, filename });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
```

---

## 3. `admin/index.html`

### 3a. CSS — insert after `.fm-val.just-changed` rule

```css
/* ── clickable preview rows ── */
.fm-row-clickable { cursor: pointer; border-radius: 2px; }
.fm-row-clickable:hover { background: #ede8da; }
.fm-row-clickable:hover .fm-editable { text-decoration: underline; text-decoration-style: dashed; text-decoration-color: var(--muted); }
.fm-edit-hint { font-size: 10px; color: var(--muted); margin-left: 6px; opacity: 0; transition: opacity 0.1s; }
.fm-row-clickable:hover .fm-edit-hint { opacity: 1; }
.fm-lock { font-size: 10px; color: var(--rule); margin-left: 4px; }
.fm-inline-input {
  font-family: 'Courier New', monospace;
  font-size: 13px;
  width: 100%;
  padding: 1px 5px;
  border: 1px solid var(--blue);
  border-radius: 2px;
  background: #fff;
  outline: none;
}

/* ── array / scalar popover ── */
.fm-popover {
  position: fixed;
  background: var(--paper);
  border: 1px solid var(--rule);
  border-radius: 3px;
  box-shadow: 0 4px 18px rgba(0,0,0,0.18);
  padding: 12px;
  width: 340px;
  z-index: 200;
  display: none;
}
.fm-popover.open { display: block; }
.fm-popover-title {
  font-family: var(--font-disp);
  font-size: 15px;
  letter-spacing: 0.05em;
  margin-bottom: 8px;
}
.fm-popover-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  min-height: 28px;
  padding: 5px;
  border: 1px solid var(--rule);
  border-radius: 2px;
  background: var(--cream);
  margin-bottom: 8px;
}
.fm-chip {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 2px 6px;
  background: #fff;
  border: 1px solid var(--rule);
  border-radius: 2px;
  font-size: 11px;
  font-family: monospace;
}
.fm-chip-remove { cursor: pointer; color: var(--muted); font-size: 13px; line-height: 1; padding: 0 1px; }
.fm-chip-remove:hover { color: var(--red); }
.fm-popover-footer { display: flex; justify-content: flex-end; gap: 6px; margin-top: 10px; }

/* ── profile photo modal ── */
.pph-drop-zone {
  border: 2px dashed var(--rule);
  border-radius: 3px;
  padding: 36px 24px;
  text-align: center;
  color: var(--muted);
  font-size: 13px;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
  margin-bottom: 12px;
}
.pph-drop-zone:hover, .pph-drop-zone.drag-over { border-color: var(--blue); background: rgba(26,58,92,0.04); }
.pph-crop-wrap {
  position: relative;
  display: inline-block;
  max-width: 100%;
  margin-bottom: 8px;
  line-height: 0;
}
.pph-crop-img { display: block; max-width: 100%; max-height: 320px; user-select: none; }
.pph-crop-overlay { position: absolute; inset: 0; cursor: crosshair; }
.pph-crop-rect {
  position: absolute;
  border: 2px solid var(--yellow);
  box-shadow: 0 0 0 9999px rgba(0,0,0,0.45);
  pointer-events: none;
  display: none;
}
.pph-step { display: none; }
.pph-step.active { display: block; }
.pph-meta-grid {
  display: grid;
  grid-template-columns: 110px 1fr;
  gap: 8px 12px;
  align-items: center;
  margin: 12px 0 16px;
}
.pph-meta-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); }
```

### 3b. EDIT_TABS.soldier — replace existing soldier entry

```js
soldier: {
  'Record info': [
    { field: 'title',                type: 'scalar' },
    { field: 'status',               type: 'scalar', options: ['veteran','deceased','kia','researching'] },
    { field: 'rank',                 type: 'scalar' },
    { field: 'mos',                  type: 'scalar' },
    { field: 'platoon',              type: 'scalar' },
    { field: 'hometown',             type: 'scalar' },
    { field: 'arrived',              type: 'scalar' },
    { field: 'departed',             type: 'scalar' },
    { field: 'character_of_service', type: 'scalar', options: ['Honorable','General','Other than Honorable','Bad Conduct','Dishonorable'] },
  ],
  'Identity': [
    { field: 'first_name',  type: 'scalar' },
    { field: 'last_name',   type: 'scalar' },
    { field: 'middle_name', type: 'scalar' },
    { field: 'nickname',    type: 'scalar' },
    { field: 'breadcrumb',  type: 'scalar' },
  ],
  'Flags': [
    { field: 'family_contact',         type: 'scalar', options: ['true','false'] },
    { field: 'wartime_content_notice', type: 'scalar', options: ['true','false'] },
    { field: 'associated',             type: 'scalar', options: ['true','false'] },
    { field: 'associated_unit',        type: 'scalar' },
    { field: 'profile_photo',          type: 'scalar' },
  ],
  'Decorations': [
    { field: 'decorations',               type: 'array_text' },
    { field: 'distinguished_decorations', type: 'array_text' },
  ],
  'Links': [
    { field: 'brothers',  type: 'array', source: 'soldier' },
    { field: 'documents', type: 'array', source: 'document' },
  ],
},
```

### 3c. HTML — add inside `editArrayArea` (replace the existing add section)

Inside the `<div id="editArrayArea">` block, replace the single add section with:

```html
<!-- Slug-backed add (source array fields) -->
<div id="editArrayAddSelect">
  <div class="form-hint" style="margin-bottom:4px;">Add entries</div>
  <select multiple id="editArrayAdd" size="6" style="width:100%"></select>
  <span class="form-hint" id="editArrayHint" style="margin-top:3px;display:block;"></span>
</div>
<!-- Free-text add (array_text fields: decorations, etc.) -->
<div id="editArrayAddText" style="display:none">
  <div class="form-hint" style="margin-bottom:4px;">Add entry</div>
  <input type="text" id="editArrayTextVal" placeholder="Enter value…" style="width:100%">
  <span class="form-hint" style="margin-top:3px;display:block;">Press Apply &amp; Continue to add, then enter the next.</span>
</div>
```

### 3d. HTML — add popover and profile photo modal before `</body>`

```html
<!-- ARRAY / SCALAR FIELD POPOVER -->
<div id="fm-popover" class="fm-popover">
  <div class="fm-popover-title" id="fm-popover-title"></div>
  <div style="font-size:11px;color:var(--muted);margin-bottom:4px;">Current entries — click × to remove</div>
  <div class="fm-popover-chips" id="fm-popover-chips"></div>

  <!-- Slug-backed add -->
  <div id="fm-popover-add-select">
    <div style="font-size:11px;color:var(--muted);margin-bottom:4px;">Add</div>
    <select multiple id="fm-popover-select" size="5" style="width:100%"></select>
    <div style="font-size:11px;color:var(--muted);margin-top:3px;" id="fm-popover-select-hint"></div>
  </div>

  <!-- Free-text add -->
  <div id="fm-popover-add-text" style="display:none">
    <div style="font-size:11px;color:var(--muted);margin-bottom:4px;">Add</div>
    <input type="text" id="fm-popover-text" placeholder="Enter value…" style="width:100%"
           onkeydown="if(event.key==='Enter'){event.preventDefault();fmPopoverAdd();}">
  </div>

  <div class="fm-popover-footer">
    <button class="btn btn-secondary btn-sm" onclick="fmPopoverClose()">Close</button>
    <button class="btn btn-primary btn-sm" onclick="fmPopoverAdd()">Add</button>
  </div>
</div>

<!-- PROFILE PHOTO MODAL -->
<div id="pph-modal" class="modal-overlay" onclick="pphCloseBg(event)">
  <div class="modal" style="width:580px;max-width:95vw;position:relative;">
    <button onclick="pphClose()" style="position:absolute;top:16px;right:16px;background:none;border:none;font-size:18px;cursor:pointer;color:var(--muted);" title="Close">✕</button>
    <h2>Set Profile Photo</h2>

    <!-- Step 1: Drop -->
    <div class="pph-step active" id="pph-step-drop">
      <p class="section-desc" style="margin-bottom:12px;">Drop a photo, or click to browse. JPEG or PNG.</p>
      <div class="pph-drop-zone" id="pph-drop-zone"
           onclick="document.getElementById('pph-file-input').click()">
        <div style="font-size:24px;margin-bottom:8px;">↓</div>
        <div>Drop photo here or click to browse</div>
      </div>
      <input type="file" id="pph-file-input" accept="image/jpeg,image/png"
             style="display:none" onchange="pphFileSelected(event)">
    </div>

    <!-- Step 2: Crop + metadata -->
    <div class="pph-step" id="pph-step-crop">
      <p style="font-size:12px;color:var(--muted);margin-bottom:8px;">
        Drag to select a crop area, or leave empty to use the full image.
      </p>
      <div style="text-align:center;">
        <div class="pph-crop-wrap" id="pph-crop-wrap">
          <img class="pph-crop-img" id="pph-crop-img" draggable="false" alt="">
          <div class="pph-crop-overlay" id="pph-crop-overlay">
            <div class="pph-crop-rect" id="pph-crop-rect"></div>
          </div>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
        <button class="btn btn-secondary btn-sm" onclick="pphCropReset()">Reset crop</button>
        <span id="pph-crop-coords" style="font-size:11px;color:var(--muted);">drag to select — or skip for full image</span>
      </div>
      <div class="pph-meta-grid">
        <span class="pph-meta-label">Credit</span>
        <input type="text" id="pph-credit" placeholder="e.g. Photographed by Dale Tincher">
        <span class="pph-meta-label">Photographer</span>
        <input type="text" id="pph-photographer" placeholder="soldier slug (optional)"
               list="pph-photographer-list">
        <datalist id="pph-photographer-list"></datalist>
      </div>
      <div style="display:flex;gap:8px;justify-content:flex-end;">
        <button class="btn btn-secondary" onclick="pphBack()">← Back</button>
        <button class="btn btn-primary" onclick="pphSave()">Save Profile Photo</button>
      </div>
    </div>
  </div>
</div>
```

### 3e. JS — `onEditFieldChange` and `doEdit` updates for `array_text`

In `onEditFieldChange`, change the array branch condition and add toggle logic:

```js
} else if (editFieldDef.type === 'array' || editFieldDef.type === 'array_text') {
  document.getElementById('editScalarArea').style.display = 'none';
  document.getElementById('editArrayArea').style.display = 'block';
  document.getElementById('btnEditRemove').style.display = 'block';
  document.getElementById('btnEditRemove').disabled = true;

  renderArrayCurrent(currentVal || []);

  if (editFieldDef.type === 'array_text') {
    document.getElementById('editArrayAddSelect').style.display = 'none';
    document.getElementById('editArrayAddText').style.display = 'block';
    document.getElementById('editArrayTextVal').value = '';
    hint.textContent = 'array (free text)';
  } else {
    document.getElementById('editArrayAddSelect').style.display = 'block';
    document.getElementById('editArrayAddText').style.display = 'none';

    const addSel = document.getElementById('editArrayAdd');
    addSel.innerHTML = '';
    const source = editFieldDef.source;
    if (source) {
      const populate = (items) => {
        items.forEach(({ slug }) => addSel.appendChild(new Option(slug, slug)));
        document.getElementById('editArrayHint').textContent =
          `Ctrl/Cmd+click to select multiple · ${items.length} options`;
      };
      if (slugCache[source]?.length) { populate(slugCache[source]); }
      else {
        fetch(`${API}/slugs?type=${source}`)
          .then(r => r.json())
          .then(d => { slugCache[source] = d; populate(d); });
      }
    }
    hint.textContent = 'array field';
  }

  document.getElementById('btnEditApply').disabled = false;
  document.getElementById('btnEditDone').disabled = false;
}
```

In `doEdit`, add the `array_text` branch between the scalar and array branches:

```js
} else if (editFieldDef.type === 'array_text') {
  const val = document.getElementById('editArrayTextVal').value.trim();
  if (!val) { toast('Enter a value to add.', 'error'); return; }

  try {
    await api('POST', '/attach', { type, slug, field, value: val });
    toast(`Added to ${field}: "${val}"`, 'success');
    logChange(`EDIT  ${type}:${slug}  ${field} += "${val}"`);
    const rec = await api('GET', `/record?type=${type}&slug=${encodeURIComponent(slug)}`);
    editRecord = rec;
    renderEditPreview(rec.data, rec.filePath);
    renderArrayCurrent(rec.data[field] || []);
    document.getElementById('editArrayTextVal').value = '';
    await refreshSessionStatus();
  } catch (e) { toast(e.message, 'error'); return; }

} else {
  // existing slug-backed array branch — unchanged
```

### 3f. JS — replace `renderEditPreview` and add all interactive functions

Replace the existing `renderEditPreview` function and add all the following after it, before the `// ── utilities ──` comment:

```js
function renderEditPreview(fm, filePath) {
  const type         = editRecord?.type;
  const skipKeys     = new Set(['layout', 'permalink']);
  const readonlyKeys = new Set(['slug', 'archive_id']);

  // Flatten all field defs for this record type into a map
  const fieldDefs = {};
  if (type && EDIT_TABS[type]) {
    for (const fields of Object.values(EDIT_TABS[type])) {
      for (const def of fields) fieldDefs[def.field] = def;
    }
  }

  const rows = Object.entries(fm)
    .filter(([k]) => !skipKeys.has(k))
    .map(([k, v]) => {
      const isArr     = Array.isArray(v);
      const isComplex = isArr && v.length > 0 && typeof v[0] === 'object';
      const isEmpty   = v === '' || v === null || v === undefined || (isArr && v.length === 0);

      const display = isComplex
        ? `[${v.length} entr${v.length === 1 ? 'y' : 'ies'}]`
        : isArr
          ? (v.length ? v.join(', ') : '(empty)')
          : (isEmpty ? '(empty)' : String(v));

      const valCls  = `fm-val${isArr ? ' is-array' : ''}${isEmpty ? ' is-empty' : ''}`;
      const isReadonly = readonlyKeys.has(k);
      const def        = fieldDefs[k];
      const canEdit    = !isReadonly && !!def && !isComplex;

      if (!canEdit) {
        const lockIcon = isReadonly ? ` <span class="fm-lock" title="read-only">⊘</span>` : '';
        return `<div class="fm-row"><span class="fm-key">${escHtml(k)}${lockIcon}</span><span class="${valCls}">${escHtml(display)}</span></div>`;
      }

      if (k === 'profile_photo') {
        return `<div class="fm-row fm-row-clickable" onclick="openProfilePhotoModal()">
          <span class="fm-key">${escHtml(k)}</span>
          <span class="${valCls} fm-editable">${escHtml(display)}<span class="fm-edit-hint">📷 set photo</span></span>
        </div>`;
      }

      if (def.type === 'array' || def.type === 'array_text') {
        return `<div class="fm-row fm-row-clickable" onclick="openArrayPopover(this, '${k}')">
          <span class="fm-key">${escHtml(k)}</span>
          <span class="${valCls} fm-editable">${escHtml(display)}<span class="fm-edit-hint">✏ edit</span></span>
        </div>`;
      }

      return `<div class="fm-row fm-row-clickable" onclick="activateInlineEdit(this, '${k}')">
        <span class="fm-key">${escHtml(k)}</span>
        <span class="${valCls} fm-editable" id="fm-val-${k}">${escHtml(display)}<span class="fm-edit-hint">✏</span></span>
      </div>`;
    }).join('');

  const shortPath = filePath.replace(/^.*\/site\//, 'site/');
  document.getElementById('editPreviewArea').innerHTML = `
    <div class="record-preview" style="margin-top:20px;">
      <div class="preview-header">
        <span>Front matter — click any field to edit</span>
        <span style="font-family:monospace;font-weight:400">${escHtml(shortPath)}</span>
      </div>
      <div class="preview-body">${rows}</div>
    </div>`;
}

// ── field def lookup ───────────────────────────────────────────────────────
function getFieldDef(type, field) {
  if (!type || !EDIT_TABS[type]) return null;
  for (const fields of Object.values(EDIT_TABS[type])) {
    const def = fields.find(f => f.field === field);
    if (def) return def;
  }
  return null;
}

// ── inline scalar editing ──────────────────────────────────────────────────
function activateInlineEdit(row, field) {
  const existing = document.querySelector('.fm-inline-active');
  if (existing && existing !== row) cancelInlineEdit(existing);
  if (row.classList.contains('fm-inline-active')) return;

  row.classList.add('fm-inline-active');

  const type       = editRecord?.type;
  const def        = getFieldDef(type, field);
  const currentVal = editRecord?.data?.[field];
  const valSpan    = row.querySelector('.fm-val');

  let input;
  if (def?.options) {
    input = document.createElement('select');
    input.className = 'fm-inline-input';
    def.options.forEach(o => {
      const opt = new Option(o, o);
      if (String(currentVal) === o) opt.selected = true;
      input.appendChild(opt);
    });
  } else {
    input = document.createElement('input');
    input.type = 'text';
    input.className = 'fm-inline-input';
    input.value = (currentVal === null || currentVal === undefined) ? '' : String(currentVal);
  }

  valSpan.style.display = 'none';
  row.appendChild(input);
  input.focus();
  if (input.tagName === 'INPUT') input.select();

  input.addEventListener('keydown', async e => {
    if (e.key === 'Enter') { e.preventDefault(); await saveInlineEdit(row, field, input.value); }
    else if (e.key === 'Escape') cancelInlineEdit(row);
  });

  if (input.tagName === 'SELECT') {
    input.addEventListener('change', async () => saveInlineEdit(row, field, input.value));
  }

  input.addEventListener('blur', () => setTimeout(() => {
    if (row.classList.contains('fm-inline-active')) cancelInlineEdit(row);
  }, 160));
}

function cancelInlineEdit(row) {
  row.classList.remove('fm-inline-active');
  row.querySelector('.fm-inline-input')?.remove();
  const valSpan = row.querySelector('.fm-val');
  if (valSpan) valSpan.style.display = '';
}

async function saveInlineEdit(row, field, newVal) {
  const type    = editRecord?.type;
  const slug    = editRecord?.slug;
  const trimmed = String(newVal).trim();
  if (!type || !slug || !trimmed) { cancelInlineEdit(row); return; }

  try {
    await api('POST', '/edit', { type, slug, field, value: trimmed });
    toast(`${field} → ${trimmed}`, 'success');
    logChange(`EDIT  ${type}:${slug}  ${field} → "${trimmed}"`);
    const rec = await api('GET', `/record?type=${type}&slug=${encodeURIComponent(slug)}`);
    editRecord = rec;
    renderEditPreview(rec.data, rec.filePath);
    await refreshSessionStatus();
  } catch (e) {
    toast(e.message, 'error');
    cancelInlineEdit(row);
  }
}

// ── array field popover ────────────────────────────────────────────────────
let fmPopoverField = null;

function openArrayPopover(row, field) {
  const activeInline = document.querySelector('.fm-inline-active');
  if (activeInline) cancelInlineEdit(activeInline);

  fmPopoverField = field;
  const type = editRecord?.type;
  const def  = getFieldDef(type, field);
  const arr  = editRecord?.data?.[field] || [];

  document.getElementById('fm-popover-title').textContent = field;
  renderPopoverChips(field, arr);

  if (def?.type === 'array_text') {
    document.getElementById('fm-popover-add-select').style.display = 'none';
    document.getElementById('fm-popover-add-text').style.display   = 'block';
    document.getElementById('fm-popover-text').value = '';
  } else {
    document.getElementById('fm-popover-add-select').style.display = 'block';
    document.getElementById('fm-popover-add-text').style.display   = 'none';
    const sel    = document.getElementById('fm-popover-select');
    sel.innerHTML = '';
    const source = def?.source;
    if (source) {
      const populate = items => {
        items.forEach(({ slug }) => sel.appendChild(new Option(slug, slug)));
        document.getElementById('fm-popover-select-hint').textContent =
          `Ctrl/Cmd+click for multiple · ${items.length} options`;
      };
      if (slugCache[source]?.length) populate(slugCache[source]);
      else fetch(`${API}/slugs?type=${source}`)
        .then(r => r.json())
        .then(d => { slugCache[source] = d; populate(d); });
    }
  }

  const popover = document.getElementById('fm-popover');
  popover.classList.add('open');
  const rowRect = row.getBoundingClientRect();
  let top  = rowRect.bottom + window.scrollY + 4;
  let left = rowRect.left   + window.scrollX;
  if (left + 348 > window.innerWidth) left = window.innerWidth - 356;
  if (left < 4) left = 4;
  popover.style.top  = top  + 'px';
  popover.style.left = left + 'px';
}

function renderPopoverChips(field, arr) {
  const container = document.getElementById('fm-popover-chips');
  if (!arr.length) {
    container.innerHTML = '<span style="font-size:11px;color:var(--muted);font-style:italic;">(empty)</span>';
    return;
  }
  container.innerHTML = '';
  arr.forEach((item, i) => {
    const label = typeof item === 'object' ? (item.slug || JSON.stringify(item)) : String(item);
    const chip  = document.createElement('span');
    chip.className = 'fm-chip';
    chip.innerHTML = `${escHtml(label)} <span class="fm-chip-remove" onclick="fmPopoverRemove(${i})" title="remove">×</span>`;
    container.appendChild(chip);
  });
}

async function fmPopoverRemove(index) {
  const type  = editRecord?.type;
  const slug  = editRecord?.slug;
  const field = fmPopoverField;
  if (!field) return;

  const arr   = editRecord?.data?.[field] || [];
  const label = typeof arr[index] === 'object' ? (arr[index].slug || JSON.stringify(arr[index])) : String(arr[index]);
  if (!confirm(`Remove "${label}" from ${field}?`)) return;

  try {
    await api('POST', '/remove-from-array', { type, slug, field, index });
    toast(`Removed from ${field}`, 'success');
    logChange(`REMOVE  ${type}:${slug}  ${field} − "${label}"`);
    const rec = await api('GET', `/record?type=${type}&slug=${encodeURIComponent(slug)}`);
    editRecord = rec;
    renderPopoverChips(field, rec.data[field] || []);
    renderEditPreview(rec.data, rec.filePath);
    await refreshSessionStatus();
  } catch (e) { toast(e.message, 'error'); }
}

async function fmPopoverAdd() {
  const type  = editRecord?.type;
  const slug  = editRecord?.slug;
  const field = fmPopoverField;
  const def   = getFieldDef(type, field);
  if (!field) return;

  let toAdd = [];
  if (def?.type === 'array_text') {
    const val = document.getElementById('fm-popover-text').value.trim();
    if (!val) { toast('Enter a value.', 'error'); return; }
    toAdd = [val];
    document.getElementById('fm-popover-text').value = '';
  } else {
    const sel = document.getElementById('fm-popover-select');
    toAdd = Array.from(sel.selectedOptions).map(o => o.value);
    if (!toAdd.length) { toast('Select at least one value.', 'error'); return; }
  }

  for (const value of toAdd) {
    try { await api('POST', '/attach', { type, slug, field, value }); }
    catch (e) { toast(`Error adding "${value}": ${e.message}`, 'error'); return; }
  }
  toast(`Added to ${field}: ${toAdd.join(', ')}`, 'success');
  logChange(`EDIT  ${type}:${slug}  ${field} += ${toAdd.join(', ')}`);

  const rec = await api('GET', `/record?type=${type}&slug=${encodeURIComponent(slug)}`);
  editRecord = rec;
  renderPopoverChips(field, rec.data[field] || []);
  renderEditPreview(rec.data, rec.filePath);
  await refreshSessionStatus();
}

function fmPopoverClose() {
  document.getElementById('fm-popover').classList.remove('open');
  fmPopoverField = null;
}

document.addEventListener('click', e => {
  const pop = document.getElementById('fm-popover');
  if (pop?.classList.contains('open')
      && !pop.contains(e.target)
      && !e.target.closest('.fm-row-clickable')) {
    fmPopoverClose();
  }
});

// ── profile photo modal ────────────────────────────────────────────────────
const PPH = { file: null, dataUrl: null, crop: null, dragging: false, startX: 0, startY: 0, imgRect: null };

function openProfilePhotoModal() {
  if (!editRecord) return;
  Object.assign(PPH, { file: null, dataUrl: null, crop: null, dragging: false });
  document.getElementById('pph-credit').value = '';
  document.getElementById('pph-photographer').value = '';
  document.getElementById('pph-file-input').value = '';
  pphCropReset();
  pphShowStep('drop');

  const dl = document.getElementById('pph-photographer-list');
  dl.innerHTML = '';
  const fill = items => items.forEach(({ slug }) => dl.appendChild(new Option(slug, slug)));
  if (slugCache.soldier?.length) fill(slugCache.soldier);
  else fetch(`${API}/slugs?type=soldier`).then(r => r.json())
        .then(d => { slugCache.soldier = d; fill(d); });

  const dz = document.getElementById('pph-drop-zone');
  dz.ondragover  = e => { e.preventDefault(); dz.classList.add('drag-over'); };
  dz.ondragleave = () => dz.classList.remove('drag-over');
  dz.ondrop      = e => { e.preventDefault(); dz.classList.remove('drag-over'); const f = e.dataTransfer.files[0]; if (f) pphLoadFile(f); };

  document.getElementById('pph-modal').classList.add('open');
}

function pphClose()        { document.getElementById('pph-modal').classList.remove('open'); }
function pphCloseBg(e)     { if (e.target === document.getElementById('pph-modal')) pphClose(); }
function pphShowStep(step) {
  document.querySelectorAll('.pph-step').forEach(el => el.classList.remove('active'));
  document.getElementById(`pph-step-${step}`).classList.add('active');
}
function pphBack()         { pphShowStep('drop'); }
function pphFileSelected(e) { const f = e.target.files[0]; if (f) pphLoadFile(f); }

function pphLoadFile(file) {
  PPH.file = file;
  const reader = new FileReader();
  reader.onload = ev => {
    PPH.dataUrl = ev.target.result;
    const img = document.getElementById('pph-crop-img');
    img.onload = pphBindCropEvents;
    img.src = PPH.dataUrl;
    pphShowStep('crop');
  };
  reader.readAsDataURL(file);
}

function pphBindCropEvents() {
  const overlay = document.getElementById('pph-crop-overlay');
  overlay.onmousedown = pphCropStart;
  document.addEventListener('mousemove', pphCropMove);
  document.addEventListener('mouseup',   pphCropEnd);
}

function pphCropStart(e) {
  const img = document.getElementById('pph-crop-img');
  if (!img.complete || !img.naturalWidth) return;
  e.preventDefault();
  PPH.dragging = true;
  PPH.imgRect  = img.getBoundingClientRect();
  PPH.startX   = e.clientX;
  PPH.startY   = e.clientY;
  PPH.crop     = null;
  document.getElementById('pph-crop-rect').style.display = 'none';
}

function pphCropMove(e) {
  if (!PPH.dragging) return;
  const ib   = PPH.imgRect;
  const wrap = document.getElementById('pph-crop-wrap').getBoundingClientRect();
  const x1 = Math.max(ib.left,   Math.min(PPH.startX, e.clientX));
  const y1 = Math.max(ib.top,    Math.min(PPH.startY, e.clientY));
  const x2 = Math.min(ib.right,  Math.max(PPH.startX, e.clientX));
  const y2 = Math.min(ib.bottom, Math.max(PPH.startY, e.clientY));
  const rect = document.getElementById('pph-crop-rect');
  rect.style.display = 'block';
  rect.style.left    = (x1 - wrap.left) + 'px';
  rect.style.top     = (y1 - wrap.top)  + 'px';
  rect.style.width   = (x2 - x1) + 'px';
  rect.style.height  = (y2 - y1) + 'px';
  PPH.crop = {
    x: (x1 - ib.left) / ib.width,
    y: (y1 - ib.top)  / ib.height,
    w: (x2 - x1)      / ib.width,
    h: (y2 - y1)      / ib.height,
  };
  document.getElementById('pph-crop-coords').textContent =
    `${Math.round(PPH.crop.w * 100)}×${Math.round(PPH.crop.h * 100)}%`;
}

function pphCropEnd() {
  if (!PPH.dragging) return;
  PPH.dragging = false;
  if (!PPH.crop || PPH.crop.w < 0.02 || PPH.crop.h < 0.02) pphCropReset();
}

function pphCropReset() {
  const r = document.getElementById('pph-crop-rect');
  const c = document.getElementById('pph-crop-coords');
  if (r) r.style.display = 'none';
  if (c) c.textContent   = 'drag to select — or skip for full image';
  PPH.crop = null;
}

async function pphSave() {
  const slug = editRecord?.slug;
  if (!slug || !PPH.dataUrl) return;

  const credit       = document.getElementById('pph-credit').value.trim();
  const photographer = document.getElementById('pph-photographer').value.trim();
  const crop         = (PPH.crop && PPH.crop.w > 0.02 && PPH.crop.h > 0.02) ? PPH.crop : null;

  try {
    const r = await api('POST', '/soldier/profile-photo', { slug, imageData: PPH.dataUrl, crop, credit, photographer });
    toast('Profile photo saved.', 'success');
    logChange(`PROFILE PHOTO  ${slug}  → ${r.filename}`);
    pphClose();
    const rec = await api('GET', `/record?type=soldier&slug=${encodeURIComponent(slug)}`);
    editRecord = rec;
    renderEditPreview(rec.data, rec.filePath);
    await refreshSessionStatus();
  } catch (e) {
    toast('Save failed: ' + e.message, 'error');
  }
}
```

---

## Architecture Notes

**CRLF** — soldier stub `.md` files are CRLF on Windows. Use `strings` not `grep` when scanning for field values in bash. Example: `strings soldier.md | grep "profile_photo:"`.

**Profile photo naming** — `{slug}-profile.jpg` inside `site/soldiers/{slug}/photos/profile/`. Several older records predate this convention (`larry-cate2.jpg`, `val_romani2.jpg`, etc.).

**Express body limit** — must be `25mb` to accommodate base64-encoded image payloads. Default is 100kb.

**sharp** — installed on Windows via `npm install` run on Windows (not WSL). Loaded via `await import('sharp')` (dynamic) throughout to avoid binary path issues.

**`array_text` type** — for free-text array fields (decorations). Uses `/api/attach` which requires the field to be in `ARRAY_FIELDS` in `frontmatter.js`.

**Boolean fields** — `family_contact`, `wartime_content_notice`, `associated`. Must be coerced from string in `/api/edit` so js-yaml writes `true`/`false` (not `"true"`/`"false"`).
