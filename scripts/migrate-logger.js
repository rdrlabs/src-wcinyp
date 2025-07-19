#!/usr/bin/env node

/**
 * Migration script to update logger imports from logger.ts to logger-v2.ts
 * Features:
 * - Updates import statements
 * - Adds context to logger calls where appropriate
 * - Preserves existing functionality
 * - Creates backup of modified files
 */

import { promises as fs } from 'fs';
import path from 'path';
import { glob } from 'glob';

const DRY_RUN = process.argv.includes('--dry-run');
const VERBOSE = process.argv.includes('--verbose');
const CREATE_BACKUP = !process.argv.includes('--no-backup');

// Patterns to identify logger usage
const IMPORT_PATTERNS = [
  /import\s*{\s*logger\s*}\s*from\s*['"]\.\.?\/.*?logger['"]/g,
  /import\s*{\s*Logger\s*}\s*from\s*['"]\.\.?\/.*?logger['"]/g,
  /const\s*{\s*logger\s*}\s*=\s*require\(['"]\.\.?\/.*?logger['"]\)/g,
];

// Pattern to identify logger method calls
const LOGGER_CALLS = /logger\.(debug|info|warn|error|securityWarn)\(/g;

// Files to exclude from migration
const EXCLUDE_PATTERNS = [
  '**/node_modules/**',
  '**/dist/**',
  '**/build/**',
  '**/.next/**',
  '**/logger.ts',
  '**/logger-v2.ts',
  '**/*.test.ts',
  '**/*.test.tsx',
  '**/*.spec.ts',
  '**/*.spec.tsx',
];

async function findFilesToMigrate() {
  const patterns = [
    'src/**/*.ts',
    'src/**/*.tsx',
    'netlify/functions/**/*.ts',
  ];

  const files = [];
  for (const pattern of patterns) {
    const matches = await glob(pattern, { ignore: EXCLUDE_PATTERNS });
    files.push(...matches);
  }

  return files;
}

function getRelativeImportPath(fromFile, toFile) {
  const fromDir = path.dirname(fromFile);
  let relativePath = path.relative(fromDir, toFile);
  
  // Ensure forward slashes
  relativePath = relativePath.replace(/\\/g, '/');
  
  // Add ./ if needed
  if (!relativePath.startsWith('.')) {
    relativePath = './' + relativePath;
  }
  
  // Remove .ts extension
  relativePath = relativePath.replace(/\.ts$/, '');
  
  return relativePath;
}

function extractContextFromPath(filePath) {
  // Extract meaningful context from file path
  const parts = filePath.split('/');
  const fileName = path.basename(filePath, path.extname(filePath));
  
  // Common patterns for context extraction
  if (filePath.includes('/components/')) {
    const componentIndex = parts.indexOf('components');
    if (componentIndex !== -1 && parts[componentIndex + 1]) {
      return `Component.${parts[componentIndex + 1]}.${fileName}`;
    }
  }
  
  if (filePath.includes('/lib/')) {
    return `Lib.${fileName}`;
  }
  
  if (filePath.includes('/app/')) {
    const appIndex = parts.indexOf('app');
    if (appIndex !== -1 && parts[appIndex + 1]) {
      return `App.${parts[appIndex + 1]}.${fileName}`;
    }
  }
  
  if (filePath.includes('/functions/')) {
    return `Function.${fileName}`;
  }
  
  // Default context
  return fileName;
}

function migrateImports(content, filePath) {
  let modified = content;
  let hasChanges = false;

  // Update import statements
  IMPORT_PATTERNS.forEach(pattern => {
    if (pattern.test(modified)) {
      hasChanges = true;
      const loggerV2Path = getRelativeImportPath(filePath, 'src/lib/logger-v2.ts');
      
      modified = modified.replace(pattern, (match) => {
        if (match.includes('Logger')) {
          return `import { EnhancedLogger as Logger } from '${loggerV2Path}'`;
        }
        return `import { logger } from '${loggerV2Path}'`;
      });
    }
  });

  return { content: modified, hasChanges };
}

function addContextToLoggerCalls(content, filePath) {
  const context = extractContextFromPath(filePath);
  let modified = content;
  let hasChanges = false;

  // Pattern to match logger calls and capture the method and arguments
  const loggerCallPattern = /logger\.(debug|info|warn|error|securityWarn)\((.*?)\);/gs;
  
  modified = modified.replace(loggerCallPattern, (match, method, args) => {
    // Check if context is already provided (look for third argument)
    const argParts = args.split(',');
    
    // Simple check - if there are less than 3 arguments, we can add context
    if (argParts.length < 3 && !args.includes('context:')) {
      hasChanges = true;
      
      // Handle different argument patterns
      if (argParts.length === 1) {
        // Only message
        return `logger.${method}(${args}, undefined, '${context}');`;
      } else if (argParts.length === 2) {
        // Message and data
        return `logger.${method}(${args}, '${context}');`;
      }
    }
    
    return match;
  });

  return { content: modified, hasChanges: hasChanges || modified !== content };
}

async function migrateFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    
    // Skip if file doesn't use logger
    if (!content.includes('logger')) {
      return { migrated: false, reason: 'No logger usage found' };
    }

    // Step 1: Migrate imports
    let { content: modifiedContent, hasChanges } = migrateImports(content, filePath);
    
    // Step 2: Add context to logger calls (optional enhancement)
    const contextResult = addContextToLoggerCalls(modifiedContent, filePath);
    modifiedContent = contextResult.content;
    hasChanges = hasChanges || contextResult.hasChanges;

    if (!hasChanges) {
      return { migrated: false, reason: 'No changes needed' };
    }

    if (!DRY_RUN) {
      // Create backup
      if (CREATE_BACKUP) {
        await fs.writeFile(`${filePath}.backup`, content);
      }

      // Write modified content
      await fs.writeFile(filePath, modifiedContent);
    }

    return { migrated: true, hasContext: contextResult.hasChanges };
  } catch (error) {
    return { migrated: false, error: error.message };
  }
}

async function main() {
  console.log('🔄 Logger Migration Script');
  console.log('========================');
  
  if (DRY_RUN) {
    console.log('🏃 Running in DRY RUN mode - no files will be modified');
  }
  
  if (!CREATE_BACKUP) {
    console.log('⚠️  Backup creation disabled');
  }

  const files = await findFilesToMigrate();
  console.log(`\n📁 Found ${files.length} files to check`);

  const results = {
    migrated: 0,
    withContext: 0,
    skipped: 0,
    errors: 0,
  };

  for (const file of files) {
    const result = await migrateFile(file);
    
    if (result.migrated) {
      results.migrated++;
      if (result.hasContext) {
        results.withContext++;
      }
      
      if (VERBOSE || DRY_RUN) {
        console.log(`✅ ${file} - Migrated${result.hasContext ? ' (with context)' : ''}`);
      }
    } else if (result.error) {
      results.errors++;
      console.error(`❌ ${file} - Error: ${result.error}`);
    } else {
      results.skipped++;
      if (VERBOSE) {
        console.log(`⏭️  ${file} - ${result.reason}`);
      }
    }
  }

  console.log('\n📊 Migration Summary');
  console.log('==================');
  console.log(`✅ Migrated: ${results.migrated} files`);
  console.log(`🏷️  With context: ${results.withContext} files`);
  console.log(`⏭️  Skipped: ${results.skipped} files`);
  console.log(`❌ Errors: ${results.errors} files`);

  if (DRY_RUN) {
    console.log('\n💡 Run without --dry-run to apply changes');
  }

  if (results.migrated > 0 && !DRY_RUN) {
    console.log('\n✨ Migration complete!');
    console.log('📝 Next steps:');
    console.log('   1. Review the changes');
    console.log('   2. Run tests to ensure everything works');
    console.log('   3. Delete backup files when satisfied: find . -name "*.backup" -delete');
  }
}

// Run the migration
main().catch(console.error);