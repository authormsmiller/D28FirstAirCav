/**
 * backfill-r2.js
 * ADMIN-TASK-20260519000079 — One-time migration: upload existing committed
 * photo image files to R2 (angryskipperarchive-photos).
 *
 * Run from the repo root:
 *   node admin/scripts/backfill-r2.js
 *
 * Or with --dry-run to preview what would be uploaded without touching R2:
 *   node admin/scripts/backfill-r2.js --dry-run
 *
 * After a successful run, remove committed image files from git:
 *   git rm --cached $(git ls-files site/soldiers/ | grep -E '\.(jpg|jpeg|png|gif|webp|tiff|tif)$')
 *   git commit -m "Remove committed photo binaries — images now live in R2"
 *
 * Key format: soldiers/[slug]/[subfolder]/[filename]
 * e.g. site/soldiers/miller-marvin-dale/photos/field/4-soldiers.jpg
 *   →  soldiers/miller-marvin-dale/photos/field/4-soldiers.jpg
 */

import fs   from 'fs';
import fsp  from 'fs/promises';
import path from 'path';
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { fileURLToPath } from 'url';
import { config as dotenvConfig } from 'dotenv';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const __dirname     = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT     = path.resolve(__dirname, '..', '..');

// Load .env from admin/ regardless of where the script is invoked from
dotenvConfig({ path: path.join(__dirname, '..', '.env') });
const SITE_SOLDIERS = path.join(REPO_ROOT, 'site', 'soldiers');
const ACCOUNT_ID    = 'a147c21894e80723027ad746a073a7e9';
const BUCKET        = 'angryskipperarchive-photos';
const IMAGE_RE      = /\.(jpg|jpeg|png|gif|webp|tiff|tif)$/i;
const CONTENT_TYPES = {
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png':  'image/png',
  '.gif':  'image/gif',
  '.webp': 'image/webp',
  '.tiff': 'image/tiff',
  '.tif':  'image/tiff',
};

const DRY_RUN = process.argv.includes('--dry-run');

// ---------------------------------------------------------------------------
// R2 client
// ---------------------------------------------------------------------------
function getClient() {
  const accessKeyId     = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  if (!accessKeyId || !secretAccessKey) {
    throw new Error('R2 credentials not set. Add R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY to admin/.env');
  }
  return new S3Client({
    region: 'auto',
    endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });
}

// ---------------------------------------------------------------------------
// Walk site/soldiers/ and collect all image files
// ---------------------------------------------------------------------------
function collectImages() {
  const results = [];
  if (!fs.existsSync(SITE_SOLDIERS)) {
    console.error(`ERROR: site/soldiers/ not found at ${SITE_SOLDIERS}`);
    process.exit(1);
  }

  for (const slugEntry of fs.readdirSync(SITE_SOLDIERS, { withFileTypes: true })) {
    if (!slugEntry.isDirectory()) continue;
    const slug      = slugEntry.name;
    const photosDir = path.join(SITE_SOLDIERS, slug, 'photos');
    if (!fs.existsSync(photosDir)) continue;

    // Walk photos/ recursively.
    // R2 key format: soldiers/[slug]/[subfolder]/[filename]
    // — the "photos/" directory level is NOT included in the key.
    function walk(dir, relBase) {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);
        const relPath  = relBase ? `${relBase}/${entry.name}` : entry.name;
        if (entry.isDirectory()) {
          walk(fullPath, relPath);
        } else if (IMAGE_RE.test(entry.name)) {
          // relPath is relative to photosDir, e.g. "profile/garvin-james.png"
          // r2Key: soldiers/[slug]/[relPath]
          results.push({
            localPath: fullPath,
            r2Key:     `soldiers/${slug}/${relPath}`,
            slug,
          });
        }
      }
    }
    walk(photosDir, '');
  }

  return results;
}

// ---------------------------------------------------------------------------
// Check whether a key already exists in R2
// ---------------------------------------------------------------------------
async function existsInR2(client, key) {
  try {
    await client.send(new HeadObjectCommand({ Bucket: BUCKET, Key: key }));
    return true;
  } catch (err) {
    if (err.name === 'NotFound' || err.$metadata?.httpStatusCode === 404) return false;
    throw err;
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log(`\nD Co. 2/8 CAV Archive — R2 Photo Backfill`);
  console.log(`Bucket : ${BUCKET}`);
  console.log(`Mode   : ${DRY_RUN ? 'DRY RUN (no uploads)' : 'LIVE'}\n`);

  const images = collectImages();
  if (!images.length) {
    console.log('No image files found under site/soldiers/. Nothing to do.');
    return;
  }

  console.log(`Found ${images.length} image files.\n`);

  const client  = DRY_RUN ? null : getClient();
  let uploaded  = 0;
  let skipped   = 0;
  let errors    = 0;

  for (const { localPath, r2Key } of images) {
    if (DRY_RUN) {
      console.log(`  [dry-run] would upload → ${r2Key}`);
      continue;
    }

    // Skip if already in R2
    try {
      const exists = await existsInR2(client, r2Key);
      if (exists) {
        console.log(`  skip (exists) ${r2Key}`);
        skipped++;
        continue;
      }
    } catch (err) {
      console.error(`  ERROR checking ${r2Key}: ${err.message}`);
      errors++;
      continue;
    }

    // Upload
    try {
      const body        = await fsp.readFile(localPath);
      const ext         = path.extname(localPath).toLowerCase();
      const contentType = CONTENT_TYPES[ext] || 'application/octet-stream';
      await client.send(new PutObjectCommand({
        Bucket:      BUCKET,
        Key:         r2Key,
        Body:        body,
        ContentType: contentType,
      }));
      console.log(`  ✓ uploaded ${r2Key}`);
      uploaded++;
    } catch (err) {
      console.error(`  ✗ FAILED  ${r2Key}: ${err.message}`);
      errors++;
    }
  }

  console.log(`\n──────────────────────────────────────────`);
  if (DRY_RUN) {
    console.log(`Dry run complete. ${images.length} files would be uploaded.`);
  } else {
    console.log(`Done.  uploaded=${uploaded}  skipped=${skipped}  errors=${errors}`);
    if (errors) {
      console.log(`\nSome uploads failed. Fix the errors above, then re-run.`);
      console.log(`The script skips already-uploaded files, so re-running is safe.`);
      process.exit(1);
    } else {
      console.log(`\nAll files uploaded successfully.`);
      console.log(`Next step — remove committed binaries from git:`);
      console.log(`  git rm --cached $(git ls-files site/soldiers/ | grep -E '\\.(jpg|jpeg|png|gif|webp|tiff|tif)$')`);
      console.log(`  git commit -m "Remove committed photo binaries — images now live in R2"`);
    }
  }
}

main().catch(err => {
  console.error('\nFATAL:', err.message);
  process.exit(1);
});
