/**
 * upload-event-photos.cjs
 *
 * Uploads event photos from site/events/[slug]/photos/ to the
 * angryskipperarchive-photos R2 bucket under events/[slug]/.
 *
 * Usage (from repo root):
 *   node scripts/upload-event-photos.cjs <event-slug>
 *
 * Examples:
 *   node scripts/upload-event-photos.cjs contact-fsb-fontaine-1971-04-20
 *   node scripts/upload-event-photos.cjs chinook-crash-1972-05-10
 *
 * Photos are read from:  site/events/[slug]/photos/
 * Uploaded to R2 under:  events/[slug]/[filename]
 * Served at URL:         /media/photos/events/[slug]/[filename]
 *
 * After uploading, add an images: block to the event's index.md frontmatter:
 *
 *   images:
 *     - src: "/media/photos/events/[slug]/[filename.jpg]"
 *       caption: "..."
 *       caption_short: "..."
 *       credit: "..."
 *       date: ""
 *
 * Requires R2 credentials in admin/.env:
 *   R2_ACCESS_KEY_ID=...
 *   R2_SECRET_ACCESS_KEY=...
 */

const fs   = require('fs');
const path = require('path');
const { S3Client, PutObjectCommand } = require(path.join(__dirname, '..', 'admin', 'node_modules', '@aws-sdk', 'client-s3'));

// Load credentials from admin/.env
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

const ACCESS_KEY = process.env.R2_ACCESS_KEY_ID     || envVars.R2_ACCESS_KEY_ID;
const SECRET_KEY = process.env.R2_SECRET_ACCESS_KEY  || envVars.R2_SECRET_ACCESS_KEY;
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

// ── Event slug from CLI arg ─────────────────────────────────────────────────
const EVENT_SLUG = process.argv[2];

if (!EVENT_SLUG) {
  console.error('Usage: node scripts/upload-event-photos.cjs <event-slug>');
  console.error('Example: node scripts/upload-event-photos.cjs contact-fsb-fontaine-1971-04-20');
  process.exit(1);
}

const photosDir = path.join(__dirname, '..', 'site', 'events', EVENT_SLUG, 'photos');

if (!fs.existsSync(photosDir)) {
  console.error(`ERROR: Photos folder not found: site/events/${EVENT_SLUG}/photos/`);
  console.error('Create the folder and add image files before running this script.');
  process.exit(1);
}

const uploads = fs
  .readdirSync(photosDir)
  .filter(f => /\.(jpg|jpeg|png|webp|gif|pdf)$/i.test(f))
  .map(f => ({
    localPath: path.join(photosDir, f),
    r2Key:     `events/${EVENT_SLUG}/${f}`,
  }));

if (uploads.length === 0) {
  console.log('No image files found in', photosDir);
  process.exit(0);
}

// ── Upload ──────────────────────────────────────────────────────────────────
async function run() {
  console.log(`Uploading ${uploads.length} file(s) to R2 bucket: ${BUCKET}\n`);

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
