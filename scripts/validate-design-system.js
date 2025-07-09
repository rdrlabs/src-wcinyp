#!/usr/bin/env node

/**
 * Design System Validation Script
 * 
 * Checks codebase for violations of design system patterns:
 * - Typography: No extreme sizes (text-6xl and above)
 * - Colors: Semantic tokens only, no direct Tailwind colors
 */

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Design system rules - now more flexible!
const FORBIDDEN_TEXT_SIZES = ['text-6xl', 'text-7xl', 'text-8xl', 'text-9xl'];
const FORBIDDEN_COLORS = [
  'bg-blue-', 'bg-green-', 'bg-purple-', 'bg-yellow-', 'bg-orange-', 
  'bg-pink-', 'bg-indigo-', 'bg-teal-', 'bg-red-', 'bg-gray-', 'bg-slate-',
  'text-blue-', 'text-green-', 'text-purple-', 'text-yellow-', 'text-orange-', 
  'text-pink-', 'text-indigo-', 'text-teal-', 'text-red-', 'text-gray-', 'text-slate-',
  'border-blue-', 'border-green-', 'border-purple-', 'border-yellow-', 'border-orange-',
  'border-pink-', 'border-indigo-', 'border-teal-', 'border-red-', 'border-gray-', 'border-slate-'
];

// Allowed patterns (to avoid false positives)
const ALLOWED_PATTERNS = [
  'text-gray-matter', // npm package name
  'gray-matter', // npm package reference
];

async function findFiles() {
  // Find all TypeScript/TSX files, excluding test files and archives
  const files = await glob('src/**/*.{ts,tsx}', {
    ignore: [
      '**/node_modules/**', 
      '**/archive/**', 
      '**/*.test.*', 
      '**/*.spec.*',
      '**/design-system-migration.ts',
      '**/theme-selector.tsx', // Needs direct colors for theme preview swatches
      '**/test-colors/**' // Test pages for color validation
    ]
  });
  return files;
}

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const violations = [];

  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    
    // Skip lines that contain allowed patterns
    const containsAllowedPattern = ALLOWED_PATTERNS.some(pattern => line.includes(pattern));
    if (containsAllowedPattern) return;

    // Check for extreme text sizes
    FORBIDDEN_TEXT_SIZES.forEach(size => {
      if (line.includes(size)) {
        violations.push({
          file: filePath,
          line: lineNumber,
          type: 'typography',
          value: size,
          message: `Extreme text size: ${size}. Consider using text-5xl or smaller.`
        });
      }
    });

    // Check for direct color usage
    FORBIDDEN_COLORS.forEach(colorPattern => {
      // Create regex to match the color pattern followed by a number
      const regex = new RegExp(`${colorPattern}\\d{2,3}`, 'g');
      const matches = line.match(regex);
      
      if (matches) {
        matches.forEach(match => {
          violations.push({
            file: filePath,
            line: lineNumber,
            type: 'color',
            value: match,
            message: `Direct color usage: ${match}. Use semantic tokens like bg-primary, text-destructive, etc.`
          });
        });
      }
    });
  });

  return violations;
}

function formatViolation(violation) {
  const relativePath = path.relative(process.cwd(), violation.file);
  return `  ${relativePath}:${violation.line} - ${violation.message}`;
}

async function main() {
  console.log('🎨 Validating Design System Compliance...\n');

  const files = await findFiles();
  console.log(`Found ${files.length} files to check\n`);

  let totalViolations = 0;
  const violationsByType = {
    typography: [],
    color: []
  };

  for (const file of files) {
    const violations = checkFile(file);
    violations.forEach(v => {
      violationsByType[v.type].push(v);
      totalViolations++;
    });
  }

  // Report violations by type
  if (violationsByType.typography.length > 0) {
    console.log('❌ Typography Violations:');
    violationsByType.typography.forEach(v => {
      console.log(formatViolation(v));
    });
    console.log('');
  }

  if (violationsByType.color.length > 0) {
    console.log('❌ Color Violations:');
    violationsByType.color.forEach(v => {
      console.log(formatViolation(v));
    });
    console.log('');
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Summary\n');
  console.log(`Total violations: ${totalViolations}`);
  console.log(`  Typography: ${violationsByType.typography.length}`);
  console.log(`  Colors: ${violationsByType.color.length}`);

  if (totalViolations === 0) {
    console.log('\n✅ All files comply with the design system!');
    process.exit(0);
  } else {
    console.log('\n❌ Design system violations found. Please fix them before committing.');
    console.log('\n💡 Tips:');
    console.log('  - Use semantic color tokens (bg-primary, text-destructive, etc.)');
    console.log('  - Avoid extreme text sizes (text-6xl and above)');
    console.log('  - Refer to DESIGN-SYSTEM-GUIDE.md for patterns and examples');
    process.exit(1);
  }
}

main().catch(console.error);