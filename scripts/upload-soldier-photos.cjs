/**
 * upload-soldier-photos.cjs
 *
 * Uploads all photos for a soldier from site/soldiers/[slug]/photos/
 * to the angryskipperarchive-photos R2 bucket under soldiers/[slug]/.
 *
 * Usage (from repo root):
 *   node scripts/upload-soldier-photos.cjs <soldier-slug>
 *
 * Examples:
 *   node scripts/upload-soldier-photos.cjs sargent-stan
 *   node scripts/upload-soldier-photos.cjs miller-marvin-dale
 *
 * Photos are read from:  site/soldiers/[slug]/photos/**
 * Uploaded to R2 under:  soldiers/[slug]/[subfolder]/[filename]
 * Served at URL:         /media/photos/soldiers/[slug]/[subfolder]/[filename]
 *
 * Requires R2 credentials in admin/.env:
 *   R2_ACCESS_KEY_ID=...
 *   R2_SECRET_ACCESS_KEY=...
 */

const fs   = require('fs');
const path = require('path');
const { S3Client, PutObjectCommand } = require(path.join(__dirname, '..', 'admin', 'node_modules', '@aws-sdk', 'client-s3'));

// ── Load credentials ────────────────────────────────────────────────────────
const envPath = path.join(__dirname, '..', 'admin', '.env');
const envVars = {};
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8')
    .split(/\r?\n/)
    .forEach(line => {
      const m = line.match(/^([^#=\s][^=]*)=(.+)$/);
      if (m) envVars[m[1].trim()] = m[2].trim();
    });
}

const ACCESS_KEY = process.env.R2_ACCESS_KEY_ID    || envVars.R2_ACCESS_KEY_ID;
const SECRET_KEY = process.env.R2_SECRET_ACCESS_KEY || envVars.R2_SECRET_ACCESS_KEY;
const ACCOUNT_ID = 'a147c21894e80723027ad746a073a7e9';
const BUCKET     = 'angryskipperarchive-photos';

if (!ACCESS_KEY || !SECRET_KEY) {
  console.error('ERROR: R2 credentials not found. Check admin/.env');
  process.exit(1);
}

const client = new S3Client({
  region:      'auto',
  endpoint:    `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: ACCESS_KEY, secretAccessKey: SECRET_KEY },
});

const EXT_TYPES = {
  jpg:  'image/jpeg',
  jpeg: 'image/jpeg',
  png:  'image/png',
  webp: 'image/webp',
  gif:  'image/gif',
  pdf:  'application/pdf',
};

// ── Soldier slug from CLI arg ───────────────────────────────────────────────
const SLUG = process.argv[2];

if (!SLUG) {
  console.error('Usage: node scripts/upload-soldier-photos.cjs <soldier-slug>');
  console.error('Example: node scripts/upload-soldier-photos.cjs sargent-stan');
  process.exit(1);
}

const photosRoot = path.join(__dirname, '..', 'site', 'soldiers', SLUG, 'photos');

if (!fs.existsSync(photosRoot)) {
  console.error(`ERROR: Photos folder not found: site/soldiers/${SLUG}/photos/`);
  process.exit(1);
}

// ── Walk subfolders (profile, field, etc.) ─────────────────────────────────
function collectUploads(dir, r2Prefix) {
  const uploads = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      uploads.push(...collectUploads(path.join(dir, entry.name), `${r2Prefix}/${entry.name}`));
    } else if (/\.(jpg|jpeg|png|webp|gif|pdf)$/i.test(entry.name)) {
      uploads.push({
        localPath: path.join(dir, entry.name),
        r2Key:     `${r2Prefix}/${entry.name}`,
      });
    }
  }
  return uploads;
}

const uploads = collectUploads(photosRoot, `soldiers/${SLUG}`);

if (uploads.length === 0) {
  console.log(`No image files found under site/soldiers/${SLUG}/photos/`);
  process.exit(0);
}

// ── Upload ──────────────────────────────────────────────────────────────────
async function run() {
  console.log(`Uploading ${uploads.length} file(s) for ${SLUG} to R2 bucket: ${BUCKET}\n`);

  let ok = 0, fail = 0;

  for (const { localPath, r2Key } of uploads) {
    const ext         = path.extname(localPath).slice(1).toLowerCase();
    const contentType = EXT_TYPES[ext] || 'application/octet-stream';

    try {
      const body = fs.readFileSync(localPath);
      await client.send(new PutObjectCommand({
        Bucket:      BUCKET,
        Key:         r2Key,
        Body:        body,
        ContentType: contentType,
      }));
      console.log('  ✓', r2Key);
      ok++;
    } catch (err) {
      console.error('  ✗', r2Key, '\n    ', err.message);
      fail++;
    }
  }

  console.log(`\nDone: ${ok} uploaded, ${fail} failed.`);
  if (fail > 0) process.exit(1);
}

run();
