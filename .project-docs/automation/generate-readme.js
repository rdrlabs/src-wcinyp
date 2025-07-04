#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Configuration
const config = {
  projectRoot: path.resolve(__dirname, '../..'),
  scanPaths: ['.project-docs'],
  ignorePaths: ['content/', 'src/app/docs/', 'src/app/wiki/', 'node_modules/', '.next/', 'archive/'],
  outputFile: 'README.md',
  docIndex: '.project-docs/automation/doc-index.json'
};

// Documentation categories
const categories = {
  architecture: {
    title: 'Architecture & Design',
    description: 'System architecture, migration notes, and implementation details',
    icon: '🏗️'
  },
  development: {
    title: 'Development',
    description: 'Development guides, testing strategies, and contribution guidelines',
    icon: '🛠️'
  },
  status: {
    title: 'Project Status',
    description: 'Current deployment status and project health',
    icon: '📊'
  }
};

// Extract metadata from markdown files
function extractMetadata(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  // Extract title from first # heading
  const titleMatch = lines.find(line => line.startsWith('# '));
  const title = titleMatch ? titleMatch.replace('# ', '').trim() : path.basename(filePath, '.md');
  
  // Extract description from first paragraph after title
  let description = '';
  let foundTitle = false;
  for (const line of lines) {
    if (line.startsWith('# ')) {
      foundTitle = true;
      continue;
    }
    if (foundTitle && line.trim() && !line.startsWith('#')) {
      description = line.trim();
      break;
    }
  }
  
  // Extract status badges or indicators
  const hasStatus = content.includes('Status:') || content.includes('✅') || content.includes('⚠️');
  
  return {
    path: filePath,
    title,
    description: description || 'No description available',
    lastModified: fs.statSync(filePath).mtime,
    hasStatus
  };
}

// Scan documentation files
function scanDocumentation() {
  const docs = {};
  
  config.scanPaths.forEach(scanPath => {
    const pattern = path.join(config.projectRoot, scanPath, '**/*.md');
    const files = glob.sync(pattern, {
      ignore: config.ignorePaths.map(p => path.join(config.projectRoot, p, '**'))
    });
    
    files.forEach(file => {
      const relativePath = path.relative(config.projectRoot, file);
      const pathParts = relativePath.split(path.sep);
      const category = pathParts[1]; // .project-docs/category/file.md
      
      // Skip files not in a category subdirectory
      if (pathParts.length < 3 || !categories[category]) {
        return;
      }
      
      if (!docs[category]) {
        docs[category] = [];
      }
      
      docs[category].push(extractMetadata(file));
    });
  });
  
  return docs;
}

// Generate documentation section for README
function generateDocumentationSection(docs) {
  let section = '## 📚 Documentation Structure\n\n';
  section += 'All project documentation is organized in the `.project-docs/` directory:\n\n';
  
  Object.entries(categories).forEach(([key, category]) => {
    if (docs[key] && docs[key].length > 0) {
      section += `### ${category.icon} ${category.title}\n`;
      section += `${category.description}\n\n`;
      
      docs[key].forEach(doc => {
        const relativePath = path.relative(config.projectRoot, doc.path);
        section += `- [**${doc.title}**](${relativePath})`;
        
        if (doc.hasStatus) {
          section += ' 📊';
        }
        
        section += `\n  ${doc.description}\n`;
      });
      
      section += '\n';
    }
  });
  
  // Add references to user-facing documentation
  section += '### 📖 User Documentation\n';
  section += 'User-facing documentation is available at:\n';
  section += '- [Knowledge Base](/docs) - Technical documentation and guides\n';
  section += '- [Work Wiki](/wiki) - WCINYP procedures, policies, and workflows\n\n';
  
  return section;
}

// Generate project health section
function generateHealthSection() {
  let section = '## 🏥 Project Health\n\n';
  
  // Read test coverage if available
  const coveragePath = path.join(config.projectRoot, 'coverage/coverage-summary.json');
  if (fs.existsSync(coveragePath)) {
    const coverage = JSON.parse(fs.readFileSync(coveragePath, 'utf8'));
    const total = coverage.total;
    
    section += '### Test Coverage\n';
    section += `- Statements: ${total.statements.pct}%\n`;
    section += `- Branches: ${total.branches.pct}%\n`;
    section += `- Functions: ${total.functions.pct}%\n`;
    section += `- Lines: ${total.lines.pct}%\n\n`;
  }
  
  // Check for tech debt
  const techDebtPath = path.join(config.projectRoot, '.project-docs/development/TECH_DEBT.md');
  if (fs.existsSync(techDebtPath)) {
    const content = fs.readFileSync(techDebtPath, 'utf8');
    const resolvedCount = (content.match(/✅/g) || []).length;
    const pendingCount = (content.match(/❌|⚠️/g) || []).length;
    
    section += '### Technical Debt\n';
    section += `- Resolved Issues: ${resolvedCount} ✅\n`;
    section += `- Pending Issues: ${pendingCount} ⚠️\n\n`;
  }
  
  return section;
}

// Update README file
function updateReadme(docs) {
  const readmePath = path.join(config.projectRoot, config.outputFile);
  let content = fs.readFileSync(readmePath, 'utf8');
  
  // Generate new sections
  const docSection = generateDocumentationSection(docs);
  const healthSection = generateHealthSection();
  
  // Find markers or append at end
  const docMarkerStart = '<!-- DOCUMENTATION:START -->';
  const docMarkerEnd = '<!-- DOCUMENTATION:END -->';
  const healthMarkerStart = '<!-- HEALTH:START -->';
  const healthMarkerEnd = '<!-- HEALTH:END -->';
  
  // Update documentation section
  if (content.includes(docMarkerStart) && content.includes(docMarkerEnd)) {
    const before = content.substring(0, content.indexOf(docMarkerStart) + docMarkerStart.length);
    const after = content.substring(content.indexOf(docMarkerEnd));
    content = before + '\n' + docSection + after;
  } else {
    // Insert before deployment section or at end
    const deploymentIndex = content.indexOf('## Deployment');
    if (deploymentIndex > -1) {
      content = content.substring(0, deploymentIndex) + 
                docMarkerStart + '\n' + docSection + docMarkerEnd + '\n\n' +
                content.substring(deploymentIndex);
    } else {
      content += '\n\n' + docMarkerStart + '\n' + docSection + docMarkerEnd;
    }
  }
  
  // Update health section
  if (content.includes(healthMarkerStart) && content.includes(healthMarkerEnd)) {
    const before = content.substring(0, content.indexOf(healthMarkerStart) + healthMarkerStart.length);
    const after = content.substring(content.indexOf(healthMarkerEnd));
    content = before + '\n' + healthSection + after;
  } else {
    // Insert after documentation section
    const docEndIndex = content.indexOf(docMarkerEnd);
    if (docEndIndex > -1) {
      const insertPoint = docEndIndex + docMarkerEnd.length;
      content = content.substring(0, insertPoint) + 
                '\n\n' + healthMarkerStart + '\n' + healthSection + healthMarkerEnd +
                content.substring(insertPoint);
    }
  }
  
  fs.writeFileSync(readmePath, content);
  console.log('✅ README.md updated successfully');
}

// Save documentation index
function saveDocIndex(docs) {
  const index = {
    generated: new Date().toISOString(),
    categories,
    documents: docs
  };
  
  fs.writeFileSync(
    path.join(config.projectRoot, config.docIndex),
    JSON.stringify(index, null, 2)
  );
  console.log('✅ Documentation index saved');
}

// Main function
function main() {
  console.log('📚 Scanning documentation...');
  const docs = scanDocumentation();
  
  console.log('📝 Updating README.md...');
  updateReadme(docs);
  
  console.log('💾 Saving documentation index...');
  saveDocIndex(docs);
  
  console.log('\n✨ Documentation update complete!');
  
  // Summary
  const totalDocs = Object.values(docs).flat().length;
  console.log(`\nFound ${totalDocs} documentation files in ${Object.keys(docs).length} categories`);
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { scanDocumentation, generateDocumentationSection };