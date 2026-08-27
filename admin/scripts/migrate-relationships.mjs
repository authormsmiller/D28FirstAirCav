import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '../..');
const SITE_ROOT = path.join(REPO_ROOT, 'site');

const RELATIONSHIPS_FILE = path.join(SITE_ROOT, '_data/relationships.json');
const SOLDIERS_DIR = path.join(SITE_ROOT, 'soldiers');

async function migrateRelationships() {
  let rawData;
  try {
    rawData = await fs.readFile(RELATIONSHIPS_FILE, 'utf8');
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log('No relationships.json found. Nothing to migrate.');
      return;
    }
    throw err;
  }

  const relationships = JSON.parse(rawData);
  let filesTouched = 0;
  let linksAdded = 0;
  const pendingUpdates = new Map(); // slug -> list of entries

  // Fan out all ordered pairs for each relationship entry
  for (const entry of relationships) {
    const { soldiers = [], basis = 'unspecified' } = entry;
    if (!Array.isArray(soldiers) || soldiers.length < 2) continue;

    for (let i = 0; i < soldiers.length; i++) {
      for (let j = 0; j < soldiers.length; j++) {
        if (i === j) continue;
        const source = soldiers[i];
        const target = soldiers[j];

        if (!pendingUpdates.has(source)) {
          pendingUpdates.set(source, []);
        }
        pendingUpdates.get(source).push({
          slug: target,
          basis,
          notes: ''
        });
      }
    }
  }

  // Update or create _alongside.json for each soldier
  for (const [soldierSlug, newLinks] of pendingUpdates.entries()) {
    const soldierDir = path.join(SOLDIERS_DIR, soldierSlug);
    const alongsidePath = path.join(soldierDir, '_alongside.json');

    // Ensure soldier directory exists
    try {
      await fs.access(soldierDir);
    } catch {
      continue; // Skip if soldier directory does not exist
    }

    let existingLinks = [];
    try {
      const content = await fs.readFile(alongsidePath, 'utf8');
      existingLinks = JSON.parse(content);
    } catch (err) {
      if (err.code !== 'ENOENT') {
        console.error(`Error reading ${alongsidePath}:`, err.message);
        continue;
      }
    }

    let soldierModified = false;
    for (const link of newLinks) {
      const exists = existingLinks.some((l) => l.slug === link.slug);
      if (!exists) {
        existingLinks.push(link);
        linksAdded++;
        soldierModified = true;
      }
    }

    if (soldierModified) {
      await fs.writeFile(alongsidePath, JSON.stringify(existingLinks, null, 2) + '\n', 'utf8');
      filesTouched++;
    }
  }

  console.log(`Migration complete: ${filesTouched} files touched, ${linksAdded} links added.`);
}

migrateRelationships().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});