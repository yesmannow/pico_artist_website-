#!/usr/bin/env node

/**
 * MCP Dependency Checker
 * Checks for outdated, missing, or problematic dependencies in package.json
 */

const fs = require('fs');
const path = require('path');

const packageJsonPath = path.join(process.cwd(), 'package.json');

function checkDependencies() {
  try {
    if (!fs.existsSync(packageJsonPath)) {
      console.error('❌ package.json not found');
      process.exit(1);
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const issues = [];
    const warnings = [];
    const info = [];

    // Check for required dependencies
    const requiredDeps = {
      'next': 'Next.js framework',
      'react': 'React library',
      'react-dom': 'React DOM library',
    };

    const allDeps = {
      ...packageJson.dependencies || {},
      ...packageJson.devDependencies || {},
    };

    // Check for missing required dependencies
    for (const [dep, description] of Object.entries(requiredDeps)) {
      if (!allDeps[dep]) {
        issues.push(`❌ Missing required dependency: ${dep} (${description})`);
      }
    }

    // Check for version conflicts or problematic versions
    const problematicVersions = {
      'next': {
        '<16.0.0': 'Next.js version is too old, may have compatibility issues',
      },
      'react': {
        '>=19.0.0': 'React 19 may have compatibility issues with some packages',
      },
    };

    for (const [dep, versionChecks] of Object.entries(problematicVersions)) {
      if (allDeps[dep]) {
        const version = allDeps[dep];
        for (const [check, message] of Object.entries(versionChecks)) {
          if (checkVersion(version, check)) {
            warnings.push(`⚠️  ${dep} ${version}: ${message}`);
          }
        }
      }
    }

    // Check for common missing peer dependencies
    const peerDeps = {
      '@supabase/supabase-js': ['@supabase/ssr'],
      'react-tsparticles': ['tsparticles-slim', 'tsparticles-engine'],
    };

    for (const [dep, peers] of Object.entries(peerDeps)) {
      if (allDeps[dep]) {
        for (const peer of peers) {
          if (!allDeps[peer]) {
            warnings.push(`⚠️  ${dep} may require peer dependency: ${peer}`);
          }
        }
      }
    }

    // Summary
    info.push(`📦 Total dependencies: ${Object.keys(packageJson.dependencies || {}).length}`);
    info.push(`🔧 Total devDependencies: ${Object.keys(packageJson.devDependencies || {}).length}`);

    // Output results
    console.log('\n🔍 Dependency Check Results\n');

    if (issues.length > 0) {
      console.log('❌ Issues:');
      issues.forEach(issue => console.log(`  ${issue}`));
      console.log('');
    }

    if (warnings.length > 0) {
      console.log('⚠️  Warnings:');
      warnings.forEach(warning => console.log(`  ${warning}`));
      console.log('');
    }

    if (info.length > 0) {
      console.log('ℹ️  Info:');
      info.forEach(i => console.log(`  ${i}`));
      console.log('');
    }

    if (issues.length === 0 && warnings.length === 0) {
      console.log('✅ No dependency issues found!\n');
      process.exit(0);
    } else if (issues.length > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }

  } catch (error) {
    console.error('❌ Error checking dependencies:', error.message);
    process.exit(1);
  }
}

function checkVersion(version, check) {
  // Remove ^, ~, >=, <=, etc.
  const cleanVersion = version.replace(/^[\^~>=<]+/, '');
  const [major, minor, patch] = cleanVersion.split('.').map(Number);

  if (check.startsWith('<')) {
    const checkVersion = check.substring(1);
    const [checkMajor, checkMinor] = checkVersion.split('.').map(Number);
    return major < checkMajor || (major === checkMajor && minor < checkMinor);
  } else if (check.startsWith('>=')) {
    const checkVersion = check.substring(2);
    const [checkMajor, checkMinor] = checkVersion.split('.').map(Number);
    return major > checkMajor || (major === checkMajor && minor >= checkMinor);
  }

  return false;
}

// Run if called directly
if (require.main === module) {
  checkDependencies();
}

module.exports = { checkDependencies };

