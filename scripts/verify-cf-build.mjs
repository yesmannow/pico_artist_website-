#!/usr/bin/env node

/**
 * Cloudflare Pages Build Verification Script
 * 
 * This script verifies that the Cloudflare Pages build output is correctly structured.
 * Run this after `npm run build:cloudflare` to ensure deployment will succeed.
 * 
 * Usage: node scripts/verify-cf-build.mjs
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');
const OUTPUT_DIR = path.join(ROOT_DIR, '.open-next', 'output');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
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

function logWarning(message) {
  log(`⚠ ${message}`, colors.yellow);
}

function logInfo(message) {
  log(`ℹ ${message}`, colors.cyan);
}

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function getFileCount(dirPath) {
  try {
    const files = await fs.readdir(dirPath);
    return files.length;
  } catch {
    return 0;
  }
}

async function getFilesRecursive(dirPath, extension = null) {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    const files = await Promise.all(entries.map(async (entry) => {
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        return getFilesRecursive(fullPath, extension);
      } else if (!extension || entry.name.endsWith(extension)) {
        return fullPath;
      }
      return [];
    }));
    return files.flat();
  } catch {
    return [];
  }
}

async function verifyFile(filePath, description) {
  const fullPath = path.join(OUTPUT_DIR, filePath);
  if (await exists(fullPath)) {
    logSuccess(`${description}: ${filePath}`);
    return true;
  } else {
    logError(`${description}: ${filePath} (MISSING)`);
    return false;
  }
}

async function verifyDirectory(dirPath, description, shouldHaveContent = true) {
  const fullPath = path.join(OUTPUT_DIR, dirPath);
  if (await exists(fullPath)) {
    const count = await getFileCount(fullPath);
    if (shouldHaveContent && count === 0) {
      logWarning(`${description}: ${dirPath} (EMPTY)`);
      return false;
    } else {
      logSuccess(`${description}: ${dirPath} (${count} items)`);
      return true;
    }
  } else {
    logError(`${description}: ${dirPath} (MISSING)`);
    return false;
  }
}

async function verifyRoutesJson() {
  const routesPath = path.join(OUTPUT_DIR, '_routes.json');
  
  if (!(await exists(routesPath))) {
    logError('_routes.json: MISSING');
    return false;
  }

  try {
    const content = await fs.readFile(routesPath, 'utf-8');
    const routes = JSON.parse(content);

    // Verify structure
    if (!routes.version || !routes.include || !routes.exclude) {
      logError('_routes.json: Invalid structure');
      return false;
    }

    // Verify critical exclusions
    const criticalExclusions = [
      '/_next/static/*',
      '/_next/image*',
      '/manifest.json',
      '/*.png',
      '/*.jpg',
      '/*.svg',
    ];

    const missingExclusions = criticalExclusions.filter(
      (pattern) => !routes.exclude.includes(pattern)
    );

    if (missingExclusions.length > 0) {
      logWarning(`_routes.json: Missing exclusions: ${missingExclusions.join(', ')}`);
    }

    logSuccess(`_routes.json: Valid (${routes.exclude.length} exclusions)`);
    return true;
  } catch (error) {
    logError(`_routes.json: Invalid JSON - ${error.message}`);
    return false;
  }
}

async function main() {
  log('\n┌────────────────────────────────────────────┐', colors.cyan);
  log('│ Cloudflare Pages Build Verification       │', colors.cyan);
  log('└────────────────────────────────────────────┘\n', colors.cyan);

  // Check if output directory exists
  if (!(await exists(OUTPUT_DIR))) {
    log('\n┌─────────────────────────────┐', colors.red);
    log('│ Verification Failed! ✗      │', colors.red);
    log('└─────────────────────────────┘\n', colors.red);
    
    logError('Output directory not found: .open-next/output');
    logInfo('Run "npm run build:cloudflare" first');
    process.exit(1);
  }

  logInfo('Verifying build output...\n');

  let allPassed = true;

  // Critical files
  log(`${colors.bold}Critical Files:${colors.reset}`);
  allPassed = await verifyFile('_worker.js', 'Worker') && allPassed;
  allPassed = await verifyRoutesJson() && allPassed;
  console.log();

  // Static assets
  log(`${colors.bold}Static Assets:${colors.reset}`);
  allPassed = await verifyDirectory('_next/static', 'Next.js Static', true) && allPassed;
  allPassed = await verifyDirectory('_next/static/chunks', 'JS Chunks', true) && allPassed;
  
  // Verify critical static files exist
  const staticDir = path.join(OUTPUT_DIR, '_next/static');
  const jsFiles = await getFilesRecursive(staticDir, '.js');
  const cssFiles = await getFilesRecursive(staticDir, '.css');
  
  if (jsFiles.length === 0) {
    logError('No .js files found in _next/static (CRITICAL)');
    allPassed = false;
  } else {
    logSuccess(`Found ${jsFiles.length} JS files in static output`);
  }
  
  if (cssFiles.length === 0) {
    logError('No .css files found in _next/static (CRITICAL)');
    allPassed = false;
  } else {
    logSuccess(`Found ${cssFiles.length} CSS files in static output`);
  }
  console.log();

  // Public assets
  log(`${colors.bold}Public Assets:${colors.reset}`);
  allPassed = await verifyFile('manifest.json', 'PWA Manifest') && allPassed;
  allPassed = await verifyFile('piko-logo.jpg', 'Logo') && allPassed;
  allPassed = await verifyFile('favicon.ico', 'Favicon') && allPassed;
  console.log();

  // Runtime files
  log(`${colors.bold}Runtime Files:${colors.reset}`);
  allPassed = await verifyDirectory('cloudflare', 'Cloudflare Runtime', false) && allPassed;
  allPassed = await verifyDirectory('middleware', 'Middleware', false) && allPassed;
  allPassed = await verifyDirectory('server-functions', 'Server Functions', false) && allPassed;
  
  // Verify API routes are included in build
  const serverFunctionsDir = path.join(OUTPUT_DIR, 'server-functions');
  if (await exists(serverFunctionsDir)) {
    const allFiles = await getFilesRecursive(serverFunctionsDir);
    const hasGalleryRoute = allFiles.some(f => f.includes('gallery') || f.includes('api'));
    if (hasGalleryRoute) {
      logSuccess('API routes included in server functions');
    } else {
      logWarning('API routes may be missing from server functions');
    }
  }
  console.log();

  // Summary
  if (allPassed) {
    log('┌──────────────────────────┐', colors.green);
    log('│ All Checks Passed! ✓     │', colors.green);
    log('└──────────────────────────┘\n', colors.green);
    
    logInfo('Build output is ready for Cloudflare Pages deployment');
    logInfo('Output directory: .open-next/output');
    logInfo('');
    logInfo('Next steps:');
    logInfo('1. Push to GitHub');
    logInfo('2. Cloudflare Pages will auto-deploy');
    logInfo('3. Verify no 404s in browser DevTools Network tab');
    
    process.exit(0);
  } else {
    log('┌─────────────────────────────┐', colors.red);
    log('│ Verification Failed! ✗      │', colors.red);
    log('└─────────────────────────────┘\n', colors.red);
    
    logError('One or more checks failed');
    logInfo('Run "npm run build:cloudflare" to rebuild');
    
    process.exit(1);
  }
}

main();
