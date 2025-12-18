#!/usr/bin/env node

/**
 * MCP Config Validator
 * Validates Next.js configuration files and project structure
 */

const fs = require('fs');
const path = require('path');

function validateConfig() {
  const issues = [];
  const warnings = [];
  const info = [];

  // Check for required config files
  const requiredFiles = {
    'package.json': 'Package configuration',
    'tsconfig.json': 'TypeScript configuration',
    'next.config.ts': 'Next.js configuration',
  };

  for (const [file, description] of Object.entries(requiredFiles)) {
    const filePath = path.join(process.cwd(), file);
    if (!fs.existsSync(filePath)) {
      issues.push(`❌ Missing required file: ${file} (${description})`);
    } else {
      info.push(`✅ Found: ${file}`);
    }
  }

  // Validate package.json
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

      // Check for required scripts
      const requiredScripts = ['dev', 'build', 'start'];
      const scripts = packageJson.scripts || {};

      for (const script of requiredScripts) {
        if (!scripts[script]) {
          warnings.push(`⚠️  Missing recommended script: ${script}`);
        }
      }

      // Check for Next.js
      if (!packageJson.dependencies?.next && !packageJson.devDependencies?.next) {
        issues.push('❌ Next.js not found in dependencies');
      }
    } catch (error) {
      issues.push(`❌ Error parsing package.json: ${error.message}`);
    }
  }

  // Validate tsconfig.json
  const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');
  if (fs.existsSync(tsconfigPath)) {
    try {
      const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));

      if (!tsconfig.compilerOptions) {
        warnings.push('⚠️  tsconfig.json missing compilerOptions');
      } else {
        if (!tsconfig.compilerOptions.paths) {
          warnings.push('⚠️  tsconfig.json missing paths configuration (recommended for @/* aliases)');
        }
      }
    } catch (error) {
      issues.push(`❌ Error parsing tsconfig.json: ${error.message}`);
    }
  }

  // Validate next.config.ts
  const nextConfigPath = path.join(process.cwd(), 'next.config.ts');
  if (fs.existsSync(nextConfigPath)) {
    try {
      const content = fs.readFileSync(nextConfigPath, 'utf8');
      if (!content.includes('NextConfig')) {
        warnings.push('⚠️  next.config.ts may not be properly typed');
      }
    } catch (error) {
      warnings.push(`⚠️  Could not validate next.config.ts: ${error.message}`);
    }
  }

  // Check for environment files
  const envFiles = ['.env.local', '.env.example'];
  let hasEnvFile = false;
  for (const envFile of envFiles) {
    const envPath = path.join(process.cwd(), envFile);
    if (fs.existsSync(envPath)) {
      hasEnvFile = true;
      info.push(`✅ Found: ${envFile}`);
      break;
    }
  }
  if (!hasEnvFile) {
    warnings.push('⚠️  No .env.local or .env.example found (environment variables may be missing)');
  }

  // Check for src directory structure
  const srcPath = path.join(process.cwd(), 'src');
  if (fs.existsSync(srcPath)) {
    const requiredDirs = ['app', 'components'];
    for (const dir of requiredDirs) {
      const dirPath = path.join(srcPath, dir);
      if (!fs.existsSync(dirPath)) {
        warnings.push(`⚠️  Missing recommended directory: src/${dir}`);
      } else {
        info.push(`✅ Found: src/${dir}`);
      }
    }
  } else {
    warnings.push('⚠️  No src/ directory found (using root directory structure)');
  }

  // Output results
  console.log('\n🔍 Configuration Validation Results\n');

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
    console.log('✅ Configuration is valid!\n');
    process.exit(0);
  } else if (issues.length > 0) {
    console.log('❌ Configuration has critical issues\n');
    process.exit(1);
  } else {
    console.log('⚠️  Configuration has warnings but no critical issues\n');
    process.exit(0);
  }
}

// Run if called directly
if (require.main === module) {
  validateConfig();
}

module.exports = { validateConfig };

