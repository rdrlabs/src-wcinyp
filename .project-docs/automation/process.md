# Documentation Management Process

This document describes how to maintain and update the project documentation structure.

## Overview

The WCINYP project uses an automated documentation management system that:
- Centralizes all project documentation in `.project-docs/`
- Automatically updates README.md with documentation structure
- Tracks project health metrics
- Maintains clear separation from user-facing documentation

## Directory Structure

```
.project-docs/          # Internal project documentation
├── architecture/       # System design and architecture
├── development/        # Development guides and processes
├── status/            # Project status and health
└── automation/        # Documentation tools and scripts
```

## Automated README Updates

### Running the Generator

```bash
# From project root
node .project-docs/automation/generate-readme.js

# Or make it executable
chmod +x .project-docs/automation/generate-readme.js
./.project-docs/automation/generate-readme.js
```

### What Gets Updated

The script automatically updates these README sections:
1. **Documentation Structure** - Lists all project docs with descriptions
2. **Project Health** - Test coverage and technical debt metrics

### Markers

The script uses HTML comments as markers to update specific sections:
- `<!-- DOCUMENTATION:START -->` and `<!-- DOCUMENTATION:END -->`
- `<!-- HEALTH:START -->` and `<!-- HEALTH:END -->`

## Adding New Documentation

1. Create your `.md` file in the appropriate `.project-docs/` subdirectory
2. Start with a `# Title` heading
3. Add a description paragraph after the title
4. Run the generator script to update README

Example:
```markdown
# My New Feature Documentation

This document explains how the new feature works and how to maintain it.

## Details
...
```

## Documentation Types

### Project Documentation (`.project-docs/`)
- **Purpose**: Internal development documentation
- **Audience**: Developers, contributors, maintainers
- **Examples**: Architecture decisions, testing guides, tech debt

### User Documentation (`content/docs/`)
- **Purpose**: How to use the application
- **Audience**: End users of WCINYP
- **Technology**: Fumadocs MDX
- **Access**: Via `/docs` route

### Work Wiki (`content/wiki/`)
- **Purpose**: WCINYP procedures and policies
- **Audience**: WCINYP staff
- **Technology**: Fumadocs MDX
- **Access**: Via `/wiki` route

## Best Practices

1. **Keep Docs Current**: Update documentation when making changes
2. **Use Clear Titles**: First `#` heading becomes the doc title in README
3. **Add Descriptions**: First paragraph becomes the description
4. **Run Generator**: After adding/updating docs, run the generator
5. **Check README**: Verify the updates look correct

## Automation Integration

### Git Hooks (Future)
```bash
# .git/hooks/pre-commit
node .project-docs/automation/generate-readme.js
git add README.md
```

### CI/CD (Future)
```yaml
# .github/workflows/docs.yml
- name: Update Documentation
  run: node .project-docs/automation/generate-readme.js
```

## Troubleshooting

### Script Errors
- Ensure you have `glob` package installed: `npm install glob`
- Run from project root directory
- Check file permissions

### Missing Sections
- Verify marker comments exist in README
- Check that files have `.md` extension
- Ensure files are in correct subdirectory

## Future Enhancements

1. **Auto-commit**: Automatically commit README changes
2. **Watch Mode**: Update on file changes
3. **Validation**: Check for broken links
4. **Metrics**: More project health indicators
5. **Badges**: Generate status badges