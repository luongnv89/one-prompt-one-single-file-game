#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const usage = `
Usage:
  node scripts/create-info-from-html.js <path-to-game-folder-or-html> [options]

Options:
  --model <name>            AI model used (default: unknown-model)
  --genre <genre>           Game genre (default: Arcade)
  --difficulty <level>      Difficulty level (default: Medium)
  --tags tag1,tag2          Comma-separated tags
  --author-name <name>      Author name for info.json
  --author-url <url>        Author URL/GitHub profile
  --thumbnail <path>        Thumbnail path (relative to game folder) or absolute URL
  --one-shot <true|false>   Whether the game came from a single prompt (default: true)
  --controls-type <type>    Control type (default: keyboard)
  --controls-text <text>    Control instructions text
  --duration <time>         Estimated duration (default: 5-10 minutes)
  --model-version <version> Model/app version (default: 1.0.0)
  --force                   Overwrite existing info.json if present
  --help                    Show this message

Tip: embed optional meta tags (e.g., <meta name="ai-model" content="GPT-4o" />)
inside your HTML to auto-populate fields without CLI flags.
`.trim();

const providedFields = new Set();

const flagHandlers = {
  '--model': (state, value) => {
    providedFields.add('model');
    state.model = value;
  },
  '--genre': (state, value) => {
    providedFields.add('genre');
    state.genre = value;
  },
  '--difficulty': (state, value) => {
    providedFields.add('difficulty');
    state.difficulty = value;
  },
  '--tags': (state, value) => {
    providedFields.add('tags');
    state.tags = value
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
  },
  '--author-name': (state, value) => {
    providedFields.add('authorName');
    state.authorName = value;
  },
  '--author-url': (state, value) => {
    providedFields.add('authorUrl');
    state.authorUrl = value;
  },
  '--thumbnail': (state, value) => {
    providedFields.add('thumbnail');
    state.thumbnail = value;
  },
  '--one-shot': (state, value) => {
    providedFields.add('isOneShot');
    const normalized = value?.toString().trim().toLowerCase();
    if (normalized === 'true') {
      state.isOneShot = true;
    } else if (normalized === 'false') {
      state.isOneShot = false;
    } else {
      console.error('Flag --one-shot expects "true" or "false"');
      process.exit(1);
    }
  },
  '--controls-type': (state, value) => {
    providedFields.add('controlsType');
    state.controlsType = value;
  },
  '--controls-text': (state, value) => {
    providedFields.add('controlsText');
    state.controlsText = value;
  },
  '--duration': (state, value) => {
    providedFields.add('duration');
    state.duration = value;
  },
  '--model-version': (state, value) => {
    providedFields.add('version');
    state.version = value;
  },
};

async function main() {
  const args = process.argv.slice(2);
  if (!args.length || args.includes('--help')) {
    console.log(usage);
    process.exit(0);
  }

  const state = {
    model: 'unknown-model',
    genre: 'Arcade',
    difficulty: 'Medium',
    controlsType: 'keyboard',
    controlsText: 'Describe keyboard/mouse/touch controls here.',
    duration: '5-10 minutes',
    version: '1.0.0',
    tags: [],
    authorName: '',
    authorUrl: '',
    thumbnail: '',
    isOneShot: true,
    force: false,
  };

  let targetPath = null;

  for (let i = 0; i < args.length; i += 1) {
    const token = args[i];
    if (token === '--force') {
      state.force = true;
      continue;
    }

    if (token.startsWith('--')) {
      const [flag, inlineValue] = token.split('=');
      const handler = flagHandlers[flag];
      if (!handler) {
        console.error(`Unknown flag ${flag}`);
        console.error(usage);
        process.exit(1);
      }
      const value = inlineValue ?? args[++i];
      if (!value) {
        console.error(`Missing value for ${flag}`);
        process.exit(1);
      }
      handler(state, value);
      continue;
    }

    if (!targetPath) {
      targetPath = token;
    } else {
      console.error(`Unexpected argument "${token}"`);
      process.exit(1);
    }
  }

  if (!targetPath) {
    console.error('You must provide a path to a game folder or index.html file.');
    console.error(usage);
    process.exit(1);
  }

  const absoluteTarget = path.resolve(process.cwd(), targetPath);
  const htmlPath = absoluteTarget.endsWith('.html') ? absoluteTarget : path.join(absoluteTarget, 'index.html');
  const gameDir = path.dirname(htmlPath);
  const infoPath = path.join(gameDir, 'info.json');

  try {
    await fs.access(htmlPath);
  } catch {
    console.error(`Could not find HTML file at ${htmlPath}`);
    process.exit(1);
  }

  try {
    await fs.access(infoPath);
    if (!state.force) {
      console.error(`info.json already exists at ${infoPath}. Use --force to overwrite.`);
      process.exit(1);
    }
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.error('Unexpected error checking info.json:', err);
      process.exit(1);
    }
  }

  const htmlContent = await fs.readFile(htmlPath, 'utf8');
  const findMeta = (name) => {
    const regex = new RegExp(`<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']+)["']`, 'i');
    const match = htmlContent.match(regex);
    return match ? match[1].trim() : null;
  };

  const titleMatch = htmlContent.match(/<title>([^<]+)<\/title>/i);
  const metaMatch = htmlContent.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i);
  const name = titleMatch ? titleMatch[1].trim() : 'Update game title';
  const description = metaMatch ? metaMatch[1].trim() : 'Add a concise 1-2 sentence description of the game.';

  const metaMap = {
    model: findMeta('ai-model'),
    genre: findMeta('ai-genre'),
    difficulty: findMeta('ai-difficulty'),
    tags: findMeta('ai-tags'),
    authorName: findMeta('ai-author-name'),
    authorUrl: findMeta('ai-author-url'),
    thumbnail: findMeta('ai-thumbnail'),
    isOneShot: findMeta('ai-is-one-shot'),
    controlsType: findMeta('ai-controls-type'),
    controlsText: findMeta('ai-controls-text'),
    duration: findMeta('ai-duration'),
    version: findMeta('ai-model-version'),
  };

  if (metaMap.tags) {
    metaMap.tags = metaMap.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
  }
  if (metaMap.isOneShot) {
    const normalized = metaMap.isOneShot.toLowerCase();
    metaMap.isOneShot = normalized === 'true';
  }

  Object.entries(metaMap).forEach(([field, value]) => {
    if (value === undefined || value === null || value === '') return;
    if (providedFields.has(field)) return;
    if (field === 'tags') {
      state.tags = value;
      return;
    }
    if (field === 'isOneShot') {
      state.isOneShot = Boolean(value);
      return;
    }
    state[field] = value;
  });

  const info = {
    name,
    description,
    model: state.model,
    version: state.version,
    author: {
      name: state.authorName || '',
      url: state.authorUrl || '',
    },
    tags: state.tags,
    genre: state.genre,
    difficulty: state.difficulty,
    controls: {
      type: state.controlsType,
      instructions: state.controlsText,
    },
    duration: state.duration,
    dateAdded: new Date().toISOString().split('T')[0],
  };

  if (state.thumbnail) {
    info.thumbnail = state.thumbnail;
  }
  info.is_one_shot = Boolean(state.isOneShot);

  const prettyJSON = `${JSON.stringify(info, null, 2)}\n`;
  await fs.writeFile(infoPath, prettyJSON, 'utf8');

  console.log(`info.json created at ${infoPath}`);
  console.log('Remember to update metadata fields before submitting your PR.');
}

main().catch((err) => {
  console.error('Failed to create info.json');
  console.error(err);
  process.exit(1);
});
