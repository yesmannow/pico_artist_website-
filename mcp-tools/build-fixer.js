#!/usr/bin/env node

/**
 * MCP Build Fixer for Cloudflare Pages
 * Fixes common issues that cause Cloudflare build failures:
 * - Removes export const metadata from 'use client' files
 * - Changes edge runtime to nodejs
 */

const fs = require('fs');
const path = require('path');

function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findFiles(filePath, fileList);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  const fixes = [];

  // Check if file has 'use client'
  const hasUseClient = content.includes("'use client'") || content.includes('"use client"');

  if (hasUseClient) {
    // Fix: Comment out export const metadata in 'use client' files
    const metadataPattern = /export\s+const\s+metadata\s*[:=]\s*({[\s\S]*?});?/g;
    const metadataMatches = content.match(metadataPattern);
    
    if (metadataMatches) {
      metadataMatches.forEach(match => {
        const commented = `// CLOUDFLARE FIX: Metadata exports not allowed in 'use client' files\n// ${match.replace(/\n/g, '\n// ')}`;
        content = content.replace(match, commented);
        modified = true;
        fixes.push(`Commented out metadata export`);
      });
    }

    // Also check for export const metadata with type annotation
    const metadataTypePattern = /export\s+const\s+metadata\s*:\s*Metadata\s*=\s*({[\s\S]*?});?/g;
    const metadataTypeMatches = content.match(metadataTypePattern);
    
    if (metadataTypeMatches) {
      metadataTypeMatches.forEach(match => {
        const commented = `// CLOUDFLARE FIX: Metadata exports not allowed in 'use client' files\n// ${match.replace(/\n/g, '\n// ')}`;
        content = content.replace(match, commented);
        modified = true;
        fixes.push(`Commented out typed metadata export`);
      });
    }
  }

  // Fix: Change edge runtime to nodejs
  const edgeRuntimePattern = /export\s+const\s+runtime\s*=\s*["']edge["'];?/g;
  if (edgeRuntimePattern.test(content)) {
    content = content.replace(edgeRuntimePattern, "export const runtime = 'nodejs'; // CLOUDFLARE FIX: Changed from edge to nodejs");
    modified = true;
    fixes.push(`Changed runtime from edge to nodejs`);
  }

  // Also handle commented edge runtime that might need to stay commented
  const commentedEdgePattern = /\/\/\s*export\s+const\s+runtime\s*=\s*["']edge["'];?/g;
  if (commentedEdgePattern.test(content)) {
    content = content.replace(commentedEdgePattern, "// export const runtime = 'nodejs'; // CLOUDFLARE FIX: Changed from edge to nodejs");
    modified = true;
    fixes.push(`Updated commented edge runtime`);
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    return fixes;
  }

  return null;
}

function fixBuild() {
  const srcAppPath = path.join(process.cwd(), 'src', 'app');
  
  if (!fs.existsSync(srcAppPath)) {
    console.error('❌ src/app directory not found');
    process.exit(1);
  }

  console.log('🔍 Scanning src/app for build issues...\n');

  const files = findFiles(srcAppPath);
  const fixedFiles = [];
  const issues = [];

  files.forEach(filePath => {
    const fixes = fixFile(filePath);
    if (fixes) {
      const relativePath = path.relative(process.cwd(), filePath);
      fixedFiles.push({ path: relativePath, fixes });
      console.log(`✅ Fixed: ${relativePath}`);
      fixes.forEach(fix => console.log(`   - ${fix}`));
    }
  });

  // Also check layout.tsx and other root files
  const rootFiles = [
    path.join(process.cwd(), 'src', 'app', 'layout.tsx'),
    path.join(process.cwd(), 'src', 'app', 'page.tsx'),
  ];

  rootFiles.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      const fixes = fixFile(filePath);
      if (fixes) {
        const relativePath = path.relative(process.cwd(), filePath);
        fixedFiles.push({ path: relativePath, fixes });
        console.log(`✅ Fixed: ${relativePath}`);
        fixes.forEach(fix => console.log(`   - ${fix}`));
      }
    }
  });

  console.log(`\n📊 Summary:`);
  console.log(`   Files scanned: ${files.length + rootFiles.filter(f => fs.existsSync(f)).length}`);
  console.log(`   Files fixed: ${fixedFiles.length}`);

  if (fixedFiles.length > 0) {
    console.log(`\n✅ Build fixes applied successfully!\n`);
    process.exit(0);
  } else {
    console.log(`\n✅ No build issues found!\n`);
    process.exit(0);
  }
}

// Run if called directly
if (require.main === module) {
  fixBuild();
}

module.exports = { fixBuild, fixFile };

