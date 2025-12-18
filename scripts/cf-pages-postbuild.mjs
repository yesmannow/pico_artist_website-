#!/usr/bin/env node

/**
 * Cloudflare Pages Post-Build Script
 * 
 * This script prepares the OpenNext output for Cloudflare Pages deployment by:
 * 1. Moving worker.js to _worker.js in the output directory
 * 2. Copying all necessary assets and server functions
 * 3. Generating _routes.json to exclude static assets from Worker routing
 * 4. Verifying all critical files are present
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');
const OPEN_NEXT_DIR = path.join(ROOT_DIR, '.open-next');
const OUTPUT_DIR = path.join(OPEN_NEXT_DIR, 'output');

// Static asset patterns to exclude from Worker routing
const STATIC_ASSET_EXCLUSIONS = [
  // Next.js static assets
  '/_next/static/*',
  '/_next/image*',
  
  // Common static files
  '/favicon.ico',
  '/manifest.json',
  '/robots.txt',
  '/sitemap.xml',
  '/sw.js',
  
  // Image formats
  '/*.png',
  '/*.jpg',
  '/*.jpeg',
  '/*.webp',
  '/*.svg',
  '/*.ico',
  '/*.avif',
  
  // Other static assets
  '/*.wav',
  '/*.mp3',
  '/*.woff',
  '/*.woff2',
  '/*.ttf',
  '/*.eot',
  '/*.otf',
];

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✓ ${message}`, colors.green);
}

function logError(message) {
  log(`✗ ${message}`, colors.red);
}

function logInfo(message) {
  log(`ℹ ${message}`, colors.cyan);
}

/**
 * Recursively copy a directory
 */
async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

/**
 * Check if a file or directory exists
 */
async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Generate _routes.json for Cloudflare Pages
 * This file tells Cloudflare which routes should bypass the Worker
 */
async function generateRoutesJson() {
  const routesConfig = {
    version: 1,
    include: ['/*'],
    exclude: STATIC_ASSET_EXCLUSIONS,
  };

  const routesPath = path.join(OUTPUT_DIR, '_routes.json');
  await fs.writeFile(routesPath, JSON.stringify(routesConfig, null, 2));
  logSuccess(`Generated _routes.json`);
}

/**
 * Prepare the output directory structure
 */
async function prepareOutputDirectory() {
  logInfo('Preparing output directory...');

  // Clean and create output directory
  if (await exists(OUTPUT_DIR)) {
    await fs.rm(OUTPUT_DIR, { recursive: true, force: true });
    logInfo('Removed existing output directory');
  }
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  logSuccess('Created output directory');

  // Copy worker.js to _worker.js
  const workerSrc = path.join(OPEN_NEXT_DIR, 'worker.js');
  const workerDest = path.join(OUTPUT_DIR, '_worker.js');
  
  if (!(await exists(workerSrc))) {
    throw new Error('worker.js not found in .open-next directory');
  }
  
  await fs.copyFile(workerSrc, workerDest);
  logSuccess('Moved worker.js → _worker.js');

  // Copy necessary directories
  const dirsToCopy = [
    'cloudflare',
    'middleware',
    'server-functions',
    '.build',
  ];

  for (const dir of dirsToCopy) {
    const srcPath = path.join(OPEN_NEXT_DIR, dir);
    if (await exists(srcPath)) {
      const destPath = path.join(OUTPUT_DIR, dir);
      await copyDir(srcPath, destPath);
      logSuccess(`Copied ${dir}/`);
    } else {
      logInfo(`Skipped ${dir}/ (not found)`);
    }
  }

  // Copy all assets from .open-next/assets/* to output root
  const assetsSrc = path.join(OPEN_NEXT_DIR, 'assets');
  if (await exists(assetsSrc)) {
    const entries = await fs.readdir(assetsSrc, { withFileTypes: true });
    
    for (const entry of entries) {
      const srcPath = path.join(assetsSrc, entry.name);
      const destPath = path.join(OUTPUT_DIR, entry.name);
      
      if (entry.isDirectory()) {
        await copyDir(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    }
    logSuccess('Copied all assets to output root');
  } else {
    throw new Error('Assets directory not found');
  }

  // Generate _routes.json
  await generateRoutesJson();
}

/**
 * Verify that all critical files are present
 */
async function verifyOutput() {
  logInfo('Verifying output directory...');

  const criticalFiles = [
    '_worker.js',
    '_routes.json',
    '_next/static',
  ];

  const errors = [];

  for (const file of criticalFiles) {
    const filePath = path.join(OUTPUT_DIR, file);
    if (!(await exists(filePath))) {
      errors.push(`Missing critical file/directory: ${file}`);
    } else {
      logSuccess(`Verified ${file}`);
    }
  }

  // Check that _next/static has content
  const staticDir = path.join(OUTPUT_DIR, '_next/static');
  if (await exists(staticDir)) {
    const files = await fs.readdir(staticDir);
    if (files.length === 0) {
      errors.push('_next/static directory is empty');
    } else {
      logSuccess(`_next/static contains ${files.length} items`);
    }
  }

  if (errors.length > 0) {
    logError('Verification failed:');
    errors.forEach((error) => logError(`  ${error}`));
    throw new Error('Output verification failed');
  }

  logSuccess('All critical files verified!');
}

/**
 * Main execution
 */
async function main() {
  try {
    log('\n┌─────────────────────────────────────────┐', colors.cyan);
    log('│ Cloudflare Pages Post-Build Processing │', colors.cyan);
    log('└─────────────────────────────────────────┘\n', colors.cyan);

    await prepareOutputDirectory();
    await verifyOutput();

    log('\n┌──────────────────────┐', colors.green);
    log('│ Build Complete! ✓    │', colors.green);
    log('└──────────────────────┘\n', colors.green);

    logInfo('Output directory: .open-next/output');
    logInfo('Ready for Cloudflare Pages deployment');
    
    process.exit(0);
  } catch (error) {
    log('\n┌──────────────────────┐', colors.red);
    log('│ Build Failed! ✗      │', colors.red);
    log('└──────────────────────┘\n', colors.red);
    
    logError(error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    
    process.exit(1);
  }
}

main();
