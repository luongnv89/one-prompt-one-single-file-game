#!/usr/bin/env node

/**
 * Game Validation Script
 *
 * Comprehensive security and schema validation for game submissions.
 * Validates info.json schema, HTML security rules, and game structure.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GAMES_DIR = path.join(__dirname, '../public/games');

// Security validation patterns
const SECURITY_PATTERNS = {
  POST_REQUESTS: [
    {
      pattern: /fetch\s*\(\s*['"]\w+['"]\s*,\s*\{[\s\S]*?method\s*:\s*['"]POST['"]/gi,
      message: 'POST requests are forbidden',
    },
    { pattern: /method\s*:\s*['"]POST['"]/gi, message: 'POST method is forbidden' },
    {
      pattern: /XMLHttpRequest\s*\.\s*open\s*\(\s*['"]POST/gi,
      message: 'XMLHttpRequest POST is forbidden',
    },
    {
      pattern: /new\s+XMLHttpRequest\(\)[\s\S]*?\.send\([\s\S]*?POST/gi,
      message: 'POST requests via XMLHttpRequest are forbidden',
    },
  ],
  WEBSOCKETS: [
    { pattern: /new\s+WebSocket\(/gi, message: 'WebSockets are forbidden' },
    { pattern: /WebSocket\s*\(/gi, message: 'WebSocket usage is forbidden' },
  ],
  EVENTSOURCE: [{ pattern: /new\s+EventSource\(/gi, message: 'EventSource is forbidden' }],
  ANALYTICS: [
    { pattern: /gtag\(/gi, message: 'Google Analytics (gtag) is forbidden' },
    { pattern: /ga\(/gi, message: 'Google Analytics (ga) is forbidden' },
    { pattern: /analytics\.track/gi, message: 'Segment analytics is forbidden' },
    { pattern: /mixpanel\.track/gi, message: 'Mixpanel analytics is forbidden' },
    { pattern: /fbq\(/gi, message: 'Facebook Pixel is forbidden' },
  ],
  TRACKING: [
    {
      pattern: /localStorage\.setItem\s*\(\s*['"](?:user|session|track|analytics)/gi,
      message: 'User tracking via localStorage is forbidden',
    },
    {
      pattern: /document\.cookie\s*=/gi,
      message: 'Cookie setting is forbidden (may indicate tracking)',
    },
    {
      pattern: /navigator\.sendBeacon/gi,
      message: 'Beacon API is forbidden (may be used for tracking)',
    },
  ],
};

// Approved CDNs
const APPROVED_CDNS = [
  'cdn.jsdelivr.net',
  'unpkg.com',
  'cdnjs.cloudflare.com',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
];

// Required fields in info.json
const REQUIRED_FIELDS = ['name', 'description', 'model'];
const THUMBNAIL_CANDIDATES = [
  'thumbnail.png',
  'thumbnail.jpg',
  'thumbnail.jpeg',
  'thumbnail.webp',
  'screenshot.png',
  'cover.png',
];

// Validation results tracking
let validationErrors = [];
let validationWarnings = [];
let gamesValidated = 0;

/**
 * Log error message
 */
function logError(message, gameSlug = '') {
  const prefix = gameSlug ? `[${gameSlug}]` : '[ERROR]';
  console.error(`❌ ${prefix} ${message}`);
  validationErrors.push({ game: gameSlug, message });
}

/**
 * Log warning message
 */
function logWarning(message, gameSlug = '') {
  const prefix = gameSlug ? `[${gameSlug}]` : '[WARN]';
  console.warn(`⚠️  ${prefix} ${message}`);
  validationWarnings.push({ game: gameSlug, message });
}

/**
 * Log success message
 */
function logSuccess(message, gameSlug = '') {
  const prefix = gameSlug ? `[${gameSlug}]` : '[OK]';
  console.log(`✅ ${prefix} ${message}`);
}

/**
 * Validate info.json schema
 */
function validateInfoJson(gamePath, gameSlug) {
  const infoPath = path.join(gamePath, 'info.json');

  if (!fs.existsSync(infoPath)) {
    logError('info.json file is missing', gameSlug);
    return null;
  }

  let info;
  try {
    const content = fs.readFileSync(infoPath, 'utf-8');
    info = JSON.parse(content);
  } catch (error) {
    logError(`info.json is not valid JSON: ${error.message}`, gameSlug);
    return null;
  }

  // Check required fields
  for (const field of REQUIRED_FIELDS) {
    if (!info[field]) {
      logError(`Required field "${field}" is missing in info.json`, gameSlug);
    } else if (typeof info[field] !== 'string' || info[field].trim() === '') {
      logError(`Required field "${field}" must be a non-empty string`, gameSlug);
    }
  }

  // Validate optional fields
  if (info.tags && !Array.isArray(info.tags)) {
    logWarning(`Field "tags" should be an array`, gameSlug);
  }

  if (info.author && typeof info.author !== 'object') {
    logWarning(`Field "author" should be an object`, gameSlug);
  }

  if (info.version && typeof info.version !== 'string') {
    logWarning(`Field "version" should be a string`, gameSlug);
  }

  const normalizedOneShot =
    typeof info.is_one_shot === 'boolean'
      ? info.is_one_shot
      : typeof info.isOneShot === 'boolean'
        ? info.isOneShot
        : undefined;
  if (normalizedOneShot === undefined) {
    logWarning(
      'Field "is_one_shot" is missing. Defaulting to true in the manifest; please add it explicitly to info.json.',
      gameSlug,
    );
  } else if (typeof normalizedOneShot !== 'boolean') {
    logWarning(`Field "is_one_shot" should be boolean`, gameSlug);
  }

  if (info.thumbnail) {
    if (typeof info.thumbnail !== 'string' || !info.thumbnail.trim()) {
      logWarning(`Field "thumbnail" should be a non-empty string or removed`, gameSlug);
    } else if (!/^https?:\/\//i.test(info.thumbnail)) {
      const relative = info.thumbnail.replace(/^\.?\//, '');
      const thumbPath = path.join(gamePath, relative);
      if (!fs.existsSync(thumbPath)) {
        logWarning(`Thumbnail file "${info.thumbnail}" not found. Default placeholder will be used.`, gameSlug);
      }
    }
  } else {
    const hasLocalThumbnail = THUMBNAIL_CANDIDATES.some((candidate) =>
      fs.existsSync(path.join(gamePath, candidate)),
    );
    if (!hasLocalThumbnail) {
      logWarning('No thumbnail image found. A generic placeholder will be used in the gallery.', gameSlug);
    }
  }

  return info;
}

/**
 * Validate HTML file security
 */
function validateHtmlSecurity(gamePath, gameSlug) {
  const htmlPath = path.join(gamePath, 'index.html');

  if (!fs.existsSync(htmlPath)) {
    logError('index.html file is missing', gameSlug);
    return;
  }

  let htmlContent;
  try {
    htmlContent = fs.readFileSync(htmlPath, 'utf-8');
  } catch (error) {
    logError(`Failed to read index.html: ${error.message}`, gameSlug);
    return;
  }

  // Check for security violations
  for (const [category, patterns] of Object.entries(SECURITY_PATTERNS)) {
    for (const { pattern, message } of patterns) {
      const matches = htmlContent.match(pattern);
      if (matches) {
        logError(`${message}`, gameSlug);
      }
    }
  }

  // Check for external scripts and styles
  const externalScriptMatches = htmlContent.match(/<script[^>]*src\s*=\s*['"]([^'"]+)['"]/gi) || [];
  const externalStyleMatches =
    htmlContent.match(/<link[^>]*href\s*=\s*['"]([^'"]+\.css[^'"]*)['"]/gi) || [];

  // Validate external script CDNs
  for (const match of externalScriptMatches) {
    const srcMatch = match.match(/src\s*=\s*['"]([^'"]+)['"]/i);
    if (srcMatch) {
      const src = srcMatch[1];
      const isApproved = APPROVED_CDNS.some((cdn) => src.includes(cdn));

      if (!isApproved && (src.startsWith('http://') || src.startsWith('https://'))) {
        logError(`External script from unapproved CDN: ${src}`, gameSlug);
      }
    }
  }

  // Validate external style CDNs
  for (const match of externalStyleMatches) {
    const hrefMatch = match.match(/href\s*=\s*['"]([^'"]+)['"]/i);
    if (hrefMatch) {
      const href = hrefMatch[1];
      const isApproved = APPROVED_CDNS.some((cdn) => href.includes(cdn));

      if (!isApproved && (href.startsWith('http://') || href.startsWith('https://'))) {
        logError(`External stylesheet from unapproved CDN: ${href}`, gameSlug);
      }
    }
  }

  logSuccess('Security validation passed', gameSlug);
}

/**
 * Validate prompt.md exists
 */
function validatePromptFile(gamePath, gameSlug) {
  const promptPath = path.join(gamePath, 'prompt.md');

  if (!fs.existsSync(promptPath)) {
    logWarning('prompt.md file is missing (optional but recommended)', gameSlug);
    return;
  }

  let content;
  try {
    content = fs.readFileSync(promptPath, 'utf-8');
  } catch (error) {
    logError(`Failed to read prompt.md: ${error.message}`, gameSlug);
    return;
  }

  // Check if prompt contains actual content
  if (content.trim().length < 20) {
    logWarning('prompt.md seems too short. Make sure to include the full AI prompt', gameSlug);
  }

  logSuccess('Prompt file validation passed', gameSlug);
}

/**
 * Scan and validate a single game folder
 */
function validateGame(gameSlug) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Validating: ${gameSlug}`);
  console.log('='.repeat(60));

  const gamePath = path.join(GAMES_DIR, gameSlug);

  // Validate info.json
  const info = validateInfoJson(gamePath, gameSlug);

  // Validate HTML security
  validateHtmlSecurity(gamePath, gameSlug);

  // Validate prompt file
  validatePromptFile(gamePath, gameSlug);

  gamesValidated++;

  const hasErrors = validationErrors.some((err) => err.game === gameSlug);

  if (!hasErrors) {
    console.log(`\n${'✅'.repeat(60)}`);
    console.log(`All checks passed for: ${gameSlug}`);
    console.log(`${'✅'.repeat(60)}\n`);
  } else {
    console.log(`\n${'❌'.repeat(60)}`);
    console.log(`Validation failed for: ${gameSlug}`);
    console.log(`${'❌'.repeat(60)}\n`);
  }
}

/**
 * Scan all games and validate
 */
function scanAndValidate() {
  console.log('🔍 Scanning games directory...\n');

  if (!fs.existsSync(GAMES_DIR)) {
    logError('Games directory does not exist');
    process.exit(1);
  }

  const entries = fs.readdirSync(GAMES_DIR, { withFileTypes: true });
  const gameFolders = entries.filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'));

  if (gameFolders.length === 0) {
    console.log('⚠️  No game folders found to validate');
    return;
  }

  console.log(`Found ${gameFolders.length} game(s) to validate\n`);

  for (const entry of gameFolders) {
    validateGame(entry.name);
  }
}

/**
 * Print validation summary
 */
function printSummary() {
  console.log('\n' + '='.repeat(60));
  console.log('VALIDATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`Games validated: ${gamesValidated}`);
  console.log(`Errors: ${validationErrors.length}`);
  console.log(`Warnings: ${validationWarnings.length}`);
  console.log('='.repeat(60) + '\n');

  if (validationErrors.length > 0) {
    console.log('ERRORS:');
    validationErrors.forEach((err) => {
      console.log(`  ❌ ${err.game ? `[${err.game}] ` : ''}${err.message}`);
    });
    console.log('');
  }

  if (validationWarnings.length > 0) {
    console.log('WARNINGS:');
    validationWarnings.forEach((warn) => {
      console.log(`  ⚠️  ${warn.game ? `[${warn.game}] ` : ''}${warn.message}`);
    });
    console.log('');
  }
}

/**
 * Main validation function
 */
function main() {
  console.log('🎮 AI One-File Arcade - Game Validator');
  console.log('🔒 Security-first validation\n');

  try {
    scanAndValidate();
    printSummary();

    // Exit with error code if there are validation errors
    if (validationErrors.length > 0) {
      console.log('❌ Validation failed. Please fix the errors above.');
      process.exit(1);
    } else {
      console.log('✅ All validations passed!');
      process.exit(0);
    }
  } catch (error) {
    console.error('💥 Fatal error during validation:', error);
    process.exit(1);
  }
}

// Run the validator
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { validateGame, validateInfoJson, validateHtmlSecurity };
