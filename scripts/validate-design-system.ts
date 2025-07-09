#!/usr/bin/env node

/**
 * Design System Validation Script
 * 
 * Checks codebase for violations of design system rules:
 * - Typography: Only 4 text sizes, 2 font weights
 * - Spacing: 8pt grid system
 * - Colors: Simplified palette
 */

import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

// Design system rules
const ALLOWED_TEXT_SIZES = ['text-sm', 'text-base', 'text-lg', 'text-2xl'];
const ALLOWED_FONT_WEIGHTS = ['font-normal', 'font-semibold'];
const FORBIDDEN_SPACING = ['gap-1.5', 'gap-1', 'gap-3', 'gap-5', 'gap-7', 'space-y-1', 'space-x-1', 'p-1', 'm-1'];
const FORBIDDEN_COLORS = ['bg-blue-', 'bg-green-', 'bg-purple-', 'bg-yellow-', 'bg-orange-', 'bg-pink-', 'bg-indigo-', 'bg-teal-', 'bg-red-'];

interface Violation {
  file: string;
  line: number;
  type: string;
  value: string;
  message: string;
}

async function findFiles(): Promise<string[]> {
  // Find all TypeScript/TSX files, excluding archives and node_modules
  const files = await glob('src/**/*.{ts,tsx}', {
    ignore: ['**/node_modules/**', '**/archive/**', '**/*.test.*', '**/*.spec.*']
  });
  return files;
}

function checkFile(filePath: string): Violation[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const violations: Violation[] = [];

  lines.forEach((line, index) => {
    const lineNumber = index + 1;

    // Check for forbidden text sizes
    const textSizeMatch = line.match(/text-(xs|3xl|4xl|5xl|6xl|7xl|8xl|9xl)/);
    if (textSizeMatch) {
      violations.push({
        file: filePath,
        line: lineNumber,
        type: 'typography',
        value: textSizeMatch[0],
        message: `Forbidden text size: ${textSizeMatch[0]}. Use one of: ${ALLOWED_TEXT_SIZES.join(', ')}`
      });
    }

    // Check for forbidden font weights
    const fontWeightMatch = line.match(/font-(thin|light|medium|bold|extrabold|black)/);
    if (fontWeightMatch) {
      violations.push({
        file: filePath,
        line: lineNumber,
        type: 'typography',
        value: fontWeightMatch[0],
        message: `Forbidden font weight: ${fontWeightMatch[0]}. Use: ${ALLOWED_FONT_WEIGHTS.join(' or ')}`
      });
    }

    // Check for non-grid spacing
    FORBIDDEN_SPACING.forEach(spacing => {
      if (line.includes(spacing)) {
        violations.push({
          file: filePath,
          line: lineNumber,
          type: 'spacing',
          value: spacing,
          message: `Non-grid spacing: ${spacing}. Use 8pt grid values (gap-2, gap-4, gap-6, gap-8, etc.)`
        });
      }
    });

    // Check for forbidden colors (excluding imports and type definitions)
    if (!line.includes('import') && !line.includes('type') && !line.includes('interface')) {
      FORBIDDEN_COLORS.forEach(colorPattern => {
        if (line.includes(colorPattern) && !line.includes('theme.ts') && !line.includes('constants')) {
          const colorMatch = line.match(new RegExp(`${colorPattern}\\d+`));
          if (colorMatch) {
            violations.push({
              file: filePath,
              line: lineNumber,
              type: 'color',
              value: colorMatch[0],
              message: `Forbidden color: ${colorMatch[0]}. Use design system colors (primary, secondary, muted, etc.)`
            });
          }
        }
      });
    }
  });

  return violations;
}

async function main() {
  console.log('🎨 Validating Design System Compliance...\n');

  const files = await findFiles();
  console.log(`Found ${files.length} files to check\n`);

  let totalViolations = 0;
  const violationsByType: Record<string, number> = {
    typography: 0,
    spacing: 0,
    color: 0
  };

  for (const file of files) {
    const violations = checkFile(file);
    
    if (violations.length > 0) {
      console.log(`\n📁 ${path.relative(process.cwd(), file)}`);
      violations.forEach(violation => {
        console.log(`  Line ${violation.line}: ${violation.message}`);
        violationsByType[violation.type]++;
        totalViolations++;
      });
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Summary\n');
  console.log(`Total violations: ${totalViolations}`);
  console.log(`  Typography: ${violationsByType.typography}`);
  console.log(`  Spacing: ${violationsByType.spacing}`);
  console.log(`  Colors: ${violationsByType.color}`);

  if (totalViolations === 0) {
    console.log('\n✅ All files comply with the design system!');
    process.exit(0);
  } else {
    console.log('\n❌ Design system violations found. Please fix them.');
    process.exit(1);
  }
}

main().catch(console.error);