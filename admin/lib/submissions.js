/**
 * submissions.js
 * Admin pull endpoint for SUBMISSIONS R2 bucket.
 * INFRA-TASK-068
 *
 * Uses R2's S3-compatible API via @aws-sdk/client-s3.
 * Credentials are read from admin/.env — see admin/.env.example.
 *
 * Endpoints registered:
 *   GET  /api/submissions/list         — list pending submission folders
 *   POST /api/submissions/pull/:id     — download folder to _intake/raw/
 *   POST /api/submissions/discard/:id  — delete folder from R2 after processing
 */

import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import fs   from 'fs';
import path from 'path';
import { Readable } from 'stream';
import { pipeline } from 'stream/promises';

const ACCOUNT_ID  = 'a147c21894e80723027ad746a073a7e9';
const BUCKET      = 'angryskipperarchive-submissions';

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

/**
 * List all pending submission folders.
 * Returns an array of folder objects with metadata.json contents merged in.
 */
async function listSubmissions() {
  const client  = getClient();
  const folders = {};

  // List all objects under submissions/ prefix
  let continuationToken;
  do {
    const cmd = new ListObjectsV2Command({
      Bucket:            BUCKET,
      Prefix:            'submissions/',
      ContinuationToken: continuationToken,
    });
    const res = await client.send(cmd);

    for (const obj of res.Contents || []) {
      const key   = obj.Key;              // e.g. submissions/photos/garvin-jim-1234/photo.jpg
      const parts = key.split('/');       // ['submissions', 'photos', 'garvin-jim-1234', 'photo.jpg']
      if (parts.length < 4) continue;

      const type     = parts[1];          // 'photos' | 'documents'
      const folderId = parts[2];
      const filename = parts.slice(3).join('/');

      const folderKey = `${type}/${folderId}`;
      if (!folders[folderKey]) {
        folders[folderKey] = { id: folderId, type, files: [], metadata: null };
      }
      if (filename === 'metadata.json') {
        // Fetch and parse metadata
        const metaCmd = new GetObjectCommand({ Bucket: BUCKET, Key: key });
        const metaRes = await client.send(metaCmd);
        const metaStr = await streamToString(metaRes.Body);
        folders[folderKey].metadata = JSON.parse(metaStr);
      } else {
        folders[folderKey].files.push({ key, filename, size: obj.Size });
      }
    }

    continuationToken = res.NextContinuationToken;
  } while (continuationToken);

  return Object.values(folders).sort((a, b) => {
    // Sort by submitted date descending
    const aDate = a.metadata?.submitted || '';
    const bDate = b.metadata?.submitted || '';
    return bDate.localeCompare(aDate);
  });
}

/**
 * Download a submission folder to _intake/raw/[type]/[folderId]/
 * Returns the local path it was written to.
 */
async function pullSubmission(folderId, repoRoot) {
  console.log(`[pull] starting — folderId="${folderId}" repoRoot="${repoRoot}"`);

  const client  = getClient();
  const folders = await listSubmissions();
  const folder  = folders.find(f => f.id === folderId);

  if (!folder) throw new Error(`Folder not found: ${folderId}`);
  console.log(`[pull] folder found — type="${folder.type}" files=${folder.files.length}`);

  const localDir = path.join(repoRoot, '_intake', 'raw', folder.type, folderId);
  console.log(`[pull] localDir="${localDir}"`);
  fs.mkdirSync(localDir, { recursive: true });
  console.log(`[pull] directory created`);

  // Download all files
  const allKeys = folder.files.map(f => f.key);
  // Also get metadata.json
  allKeys.push(`submissions/${folder.type}/${folderId}/metadata.json`);
  console.log(`[pull] keys to download (${allKeys.length}):`, allKeys);

  for (const key of allKeys) {
    const filename  = key.split('/').slice(3).join('/');
    const localPath = path.join(localDir, filename);
    console.log(`[pull] downloading "${key}" → "${localPath}"`);

    // Ensure subdirectory exists
    fs.mkdirSync(path.dirname(localPath), { recursive: true });

    const cmd = new GetObjectCommand({ Bucket: BUCKET, Key: key });
    const res = await client.send(cmd);
    const out = fs.createWriteStream(localPath);
    await pipeline(Readable.from(res.Body), out);
    console.log(`[pull] wrote "${filename}"`);
  }

  console.log(`[pull] done — ${allKeys.length} file(s) written to "${localDir}"`);
  return localDir;
}

/**
 * Delete a folder from R2 after it has been processed.
 */
async function discardSubmission(folderId) {
  const client  = getClient();
  const folders = await listSubmissions();
  const folder  = folders.find(f => f.id === folderId);
  if (!folder) throw new Error(`Folder not found: ${folderId}`);

  const allKeys = [
    ...folder.files.map(f => f.key),
    `submissions/${folder.type}/${folderId}/metadata.json`,
  ];

  for (const key of allKeys) {
    await client.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────

async function streamToString(stream) {
  const chunks = [];
  for await (const chunk of stream) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks).toString('utf-8');
}

// ── Route registration ────────────────────────────────────────────────────────

export function registerSubmissionsRoutes(app, repoRoot) {

  /**
   * GET /api/submissions/list
   * Returns all pending folders with metadata.
   */
  app.get('/api/submissions/list', async (req, res) => {
    try {
      const folders = await listSubmissions();
      res.json({ folders });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  /**
   * POST /api/submissions/pull/:id
   * Downloads a submission folder to _intake/raw/
   */
  app.post('/api/submissions/pull/:id', async (req, res) => {
    try {
      const localPath = await pullSubmission(req.params.id, repoRoot);
      res.json({ ok: true, path: localPath });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  /**
   * POST /api/submissions/discard/:id
   * Deletes a folder from R2 (after processing is confirmed complete).
   */
  app.post('/api/submissions/discard/:id', async (req, res) => {
    try {
      await discardSubmission(req.params.id);
      res.json({ ok: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
}
