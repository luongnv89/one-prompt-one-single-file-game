#!/usr/bin/env node

/**
 * Generate Games Manifest
 *
 * Scans the /public/games folder for game folders, validates info.json,
 * and generates a games-manifest.json file with all game metadata.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GAMES_DIR = path.join(__dirname, '../public/games');
const OUTPUT_FILE = path.join(__dirname, '../public/games-manifest.json');

// Required fields in info.json
const REQUIRED_FIELDS = ['name', 'description', 'model'];

// Optional fields
const OPTIONAL_FIELDS = [
  'version',
  'author',
  'tags',
  'genre',
  'difficulty',
  'controls',
  'duration',
  'dateAdded',
];

/**
 * Recursively scan the games directory
 */
function scanGamesDir(dir) {
  const games = [];

  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory() && !entry.name.startsWith('.')) {
        const gamePath = path.join(dir, entry.name);
        const game = validateGameFolder(gamePath, entry.name);

        if (game) {
          games.push(game);
        } else {
          console.warn(`⚠️  Skipped invalid game folder: ${entry.name}`);
        }
      }
    }
  } catch (error) {
    console.error('❌ Error reading games directory:', error.message);
    process.exit(1);
  }

  return games;
}

/**
 * Validate a game folder and extract metadata
 */
function validateGameFolder(gamePath, gameSlug) {
  try {
    // Check for index.html
    const indexPath = path.join(gamePath, 'index.html');
    if (!fs.existsSync(indexPath)) {
      console.warn(`  ⚠️  Missing index.html in ${gameSlug}`);
      return null;
    }

    // Check for info.json
    const infoPath = path.join(gamePath, 'info.json');
    if (!fs.existsSync(infoPath)) {
      console.warn(`  ⚠️  Missing info.json in ${gameSlug}`);
      return null;
    }

    // Read and parse info.json
    const infoContent = fs.readFileSync(infoPath, 'utf-8');
    let info;

    try {
      info = JSON.parse(infoContent);
    } catch (error) {
      console.warn(`  ❌ Invalid JSON in info.json: ${gameSlug}`);
      return null;
    }

    // Validate required fields
    for (const field of REQUIRED_FIELDS) {
      if (!info[field]) {
        console.warn(`  ❌ Missing required field "${field}" in ${gameSlug}/info.json`);
        return null;
      }
    }

    // Validate field types
    if (typeof info.name !== 'string' || info.name.trim() === '') {
      console.warn(`  ❌ Field "name" must be a non-empty string in ${gameSlug}/info.json`);
      return null;
    }

    if (typeof info.description !== 'string' || info.description.trim() === '') {
      console.warn(`  ❌ Field "description" must be a non-empty string in ${gameSlug}/info.json`);
      return null;
    }

    if (typeof info.model !== 'string' || info.model.trim() === '') {
      console.warn(`  ❌ Field "model" must be a non-empty string in ${gameSlug}/info.json`);
      return null;
    }

    // Validate optional fields
    if (info.tags && !Array.isArray(info.tags)) {
      console.warn(`  ⚠️  Field "tags" should be an array in ${gameSlug}/info.json`);
    }

    if (info.author && typeof info.author !== 'object') {
      console.warn(`  ⚠️  Field "author" should be an object in ${gameSlug}/info.json`);
    }

    // Check for prompt.md (optional)
    const promptPath = path.join(gamePath, 'prompt.md');
    const hasPrompt = fs.existsSync(promptPath);

    // Build game object
    const game = {
      slug: gameSlug,
      name: info.name,
      description: info.description,
      model: info.model,
      path: `/games/${gameSlug}/index.html`,
      hasPrompt: hasPrompt,
      version: info.version || '1.0.0',
      author: info.author || { name: 'Anonymous', url: null },
      tags: info.tags || [],
      genre: info.genre || 'Unknown',
      difficulty: info.difficulty || 'Unknown',
      controls: info.controls || null,
      duration: info.duration || null,
      dateAdded: info.dateAdded || new Date().toISOString().split('T')[0],
    };

    console.log(`✓ Validated: ${game.name} (${gameSlug})`);
    return game;
  } catch (error) {
    console.warn(`  ❌ Error validating ${gameSlug}:`, error.message);
    return null;
  }
}

/**
 * Generate and write manifest file
 */
function generateManifest() {
  console.log('🔍 Scanning games directory...\n');

  const games = scanGamesDir(GAMES_DIR);

  if (games.length === 0) {
    console.warn('\n⚠️  No valid games found.');
    const manifest = { games: [], generatedAt: new Date().toISOString() };

    try {
      fs.writeFileSync(OUTPUT_FILE, JSON.stringify(manifest, null, 2));
      console.log(`\n📝 Generated empty manifest: ${OUTPUT_FILE}`);
    } catch (error) {
      console.error('❌ Error writing manifest file:', error.message);
      process.exit(1);
    }
    return;
  }

  const manifest = {
    games: games,
    generatedAt: new Date().toISOString(),
    count: games.length,
  };

  try {
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(manifest, null, 2));
    console.log(`\n✅ Successfully generated manifest with ${games.length} game(s)`);
    console.log(`📁 Output: ${OUTPUT_FILE}`);
  } catch (error) {
    console.error('❌ Error writing manifest file:', error.message);
    process.exit(1);
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  generateManifest();
}

export { generateManifest };
