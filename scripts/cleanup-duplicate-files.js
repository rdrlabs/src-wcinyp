#!/usr/bin/env node

import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
};

// Pattern to match duplicate files with numbers
const DUPLICATE_PATTERN = /^(.+?)\s+(\d+)(\.[^.]+)$/;

async function getFileHash(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    return crypto.createHash('md5').update(content).digest('hex');
  } catch (error) {
    console.error(`${colors.red}Error reading file ${filePath}: ${error.message}${colors.reset}`);
    return null;
  }
}

async function findDuplicateFiles(dir) {
  const duplicates = new Map(); // originalFile -> [duplicate1, duplicate2, ...]
  
  async function scanDir(currentDir) {
    try {
      const entries = await fs.readdir(currentDir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);
        
        if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
          await scanDir(fullPath);
        } else if (entry.isFile()) {
          const match = entry.name.match(DUPLICATE_PATTERN);
          if (match) {
            const baseName = match[1];
            const number = match[2];
            const extension = match[3];
            const originalName = baseName + extension;
            const originalPath = path.join(currentDir, originalName);
            
            const key = originalPath;
            if (!duplicates.has(key)) {
              duplicates.set(key, []);
            }
            duplicates.get(key).push({
              path: fullPath,
              number: parseInt(number),
              name: entry.name
            });
          }
        }
      }
    } catch (error) {
      console.error(`${colors.red}Error scanning directory ${currentDir}: ${error.message}${colors.reset}`);
    }
  }
  
  await scanDir(dir);
  
  // Sort duplicates by number
  for (const [key, dupes] of duplicates.entries()) {
    dupes.sort((a, b) => a.number - b.number);
  }
  
  return duplicates;
}

async function analyzeDuplicates(duplicates) {
  const analysis = [];
  
  for (const [originalPath, dupes] of duplicates.entries()) {
    const group = {
      original: originalPath,
      originalExists: false,
      originalHash: null,
      duplicates: []
    };
    
    // Check if original file exists
    try {
      await fs.access(originalPath);
      group.originalExists = true;
      group.originalHash = await getFileHash(originalPath);
    } catch {
      // Original doesn't exist
    }
    
    // Analyze each duplicate
    for (const dupe of dupes) {
      const hash = await getFileHash(dupe.path);
      if (hash) {
        const stat = await fs.stat(dupe.path);
        group.duplicates.push({
          ...dupe,
          hash,
          modified: stat.mtime,
          size: stat.size,
          identical: group.originalExists && hash === group.originalHash
        });
      }
    }
    
    analysis.push(group);
  }
  
  return analysis;
}

function generateReport(analysis) {
  console.log(`\n${colors.cyan}=== Duplicate Files Analysis Report ===${colors.reset}\n`);
  
  let totalDuplicates = 0;
  let identicalDuplicates = 0;
  let uniqueDuplicates = 0;
  let orphanedDuplicates = 0;
  
  for (const group of analysis) {
    const duplicateCount = group.duplicates.length;
    totalDuplicates += duplicateCount;
    
    if (!group.originalExists) {
      orphanedDuplicates += duplicateCount;
      console.log(`${colors.yellow}⚠️  Orphaned duplicates (no original):${colors.reset}`);
      console.log(`   Original: ${group.original} ${colors.red}[MISSING]${colors.reset}`);
    } else {
      const identicalCount = group.duplicates.filter(d => d.identical).length;
      const differentCount = duplicateCount - identicalCount;
      
      identicalDuplicates += identicalCount;
      uniqueDuplicates += differentCount;
      
      if (differentCount > 0) {
        console.log(`${colors.yellow}⚠️  Group with differences:${colors.reset}`);
      } else {
        console.log(`${colors.green}✓  Group with identical duplicates:${colors.reset}`);
      }
      console.log(`   Original: ${group.original}`);
    }
    
    // Show duplicates
    for (const dupe of group.duplicates) {
      const status = !group.originalExists ? 'ORPHANED' :
                     dupe.identical ? 'IDENTICAL' : 'DIFFERENT';
      const color = status === 'IDENTICAL' ? colors.green :
                    status === 'DIFFERENT' ? colors.yellow : colors.red;
      
      console.log(`   ${color}[${status}]${colors.reset} ${dupe.name} (modified: ${dupe.modified.toISOString().split('T')[0]})`);
    }
    console.log('');
  }
  
  // Summary
  console.log(`${colors.cyan}=== Summary ===${colors.reset}`);
  console.log(`Total duplicate files: ${totalDuplicates}`);
  console.log(`${colors.green}Identical to original: ${identicalDuplicates}${colors.reset}`);
  console.log(`${colors.yellow}Different from original: ${uniqueDuplicates}${colors.reset}`);
  console.log(`${colors.red}Orphaned (no original): ${orphanedDuplicates}${colors.reset}`);
  
  return {
    totalDuplicates,
    identicalDuplicates,
    uniqueDuplicates,
    orphanedDuplicates
  };
}

async function promptUser(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.toLowerCase());
    });
  });
}

async function performCleanup(analysis, options = {}) {
  const { dryRun = false, interactive = true } = options;
  const deletionPlan = [];
  
  console.log(`\n${colors.cyan}=== Cleanup Plan ===${colors.reset}\n`);
  
  for (const group of analysis) {
    // Determine which files to delete
    const toDelete = [];
    
    if (!group.originalExists) {
      // Keep the lowest numbered duplicate as the "original"
      const sorted = [...group.duplicates].sort((a, b) => a.number - b.number);
      const keepFile = sorted[0];
      toDelete.push(...sorted.slice(1));
      
      console.log(`${colors.yellow}Will rename:${colors.reset} ${keepFile.name} -> ${path.basename(group.original)}`);
      deletionPlan.push({
        action: 'rename',
        from: keepFile.path,
        to: group.original
      });
    } else {
      // Delete all identical duplicates
      const identical = group.duplicates.filter(d => d.identical);
      toDelete.push(...identical);
      
      // For different duplicates, ask user or keep based on modification date
      const different = group.duplicates.filter(d => !d.identical);
      if (different.length > 0) {
        console.log(`${colors.yellow}Manual review needed for:${colors.reset} ${group.original}`);
        for (const dupe of different) {
          console.log(`  - ${dupe.name} (modified: ${dupe.modified.toISOString()})`);
        }
      }
    }
    
    // Add deletions to plan
    for (const file of toDelete) {
      console.log(`${colors.red}Will delete:${colors.reset} ${file.path}`);
      deletionPlan.push({
        action: 'delete',
        path: file.path
      });
    }
  }
  
  // Execute plan
  if (deletionPlan.length > 0) {
    console.log(`\n${colors.cyan}Total operations: ${deletionPlan.length}${colors.reset}`);
    
    if (interactive && !dryRun) {
      const answer = await promptUser('\nProceed with cleanup? (y/n): ');
      if (answer !== 'y' && answer !== 'yes') {
        console.log('Cleanup cancelled.');
        return;
      }
    }
    
    if (!dryRun) {
      console.log('\nExecuting cleanup...');
      let successCount = 0;
      let errorCount = 0;
      
      for (const operation of deletionPlan) {
        try {
          if (operation.action === 'delete') {
            await fs.unlink(operation.path);
            console.log(`${colors.green}✓${colors.reset} Deleted: ${operation.path}`);
          } else if (operation.action === 'rename') {
            await fs.rename(operation.from, operation.to);
            console.log(`${colors.green}✓${colors.reset} Renamed: ${operation.from} -> ${operation.to}`);
          }
          successCount++;
        } catch (error) {
          console.error(`${colors.red}✗ Error:${colors.reset} ${error.message}`);
          errorCount++;
        }
      }
      
      console.log(`\n${colors.cyan}Cleanup complete!${colors.reset}`);
      console.log(`${colors.green}Success: ${successCount}${colors.reset}`);
      if (errorCount > 0) {
        console.log(`${colors.red}Errors: ${errorCount}${colors.reset}`);
      }
    } else {
      console.log(`\n${colors.gray}(Dry run - no files were actually modified)${colors.reset}`);
    }
  } else {
    console.log('\nNo automatic cleanup actions available.');
  }
}

async function main() {
  const args = process.argv.slice(2);
  const flags = {
    help: args.includes('--help') || args.includes('-h'),
    dryRun: args.includes('--dry-run') || args.includes('-d'),
    auto: args.includes('--auto') || args.includes('-a'),
    clean: args.includes('--clean') || args.includes('-c')
  };
  
  if (flags.help) {
    console.log(`
${colors.cyan}Duplicate Files Cleanup Tool${colors.reset}

Usage: node cleanup-duplicate-files.js [options]

Options:
  -h, --help     Show this help message
  -d, --dry-run  Show what would be done without making changes
  -c, --clean    Perform cleanup (delete identical duplicates)
  -a, --auto     Non-interactive mode (use with --clean)

Examples:
  node cleanup-duplicate-files.js           # Analyze only
  node cleanup-duplicate-files.js --clean   # Interactive cleanup
  node cleanup-duplicate-files.js -c -d     # Dry run cleanup
  node cleanup-duplicate-files.js -c -a     # Auto cleanup (careful!)
`);
    return;
  }
  
  console.log(`${colors.cyan}Scanning for duplicate files...${colors.reset}`);
  
  const srcDir = path.join(__dirname, '..', 'src');
  const duplicates = await findDuplicateFiles(srcDir);
  
  if (duplicates.size === 0) {
    console.log(`${colors.green}No duplicate files found!${colors.reset}`);
    return;
  }
  
  console.log(`Found ${duplicates.size} groups of duplicates. Analyzing...`);
  
  const analysis = await analyzeDuplicates(duplicates);
  const summary = generateReport(analysis);
  
  if (flags.clean && summary.totalDuplicates > 0) {
    await performCleanup(analysis, {
      dryRun: flags.dryRun,
      interactive: !flags.auto
    });
  } else if (!flags.clean && summary.totalDuplicates > 0) {
    console.log(`\n${colors.gray}Run with --clean flag to remove duplicates${colors.reset}`);
  }
}

// Run the script
main().catch(console.error);