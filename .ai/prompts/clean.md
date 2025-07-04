# [clean] - Deep Architecture & Organization Audit

Performs a comprehensive audit of the codebase to detect structural problems, broken links, corrupted organizational decisions, and architectural issues introduced by changes or overlooked mistakes.

## What [clean] Does

### 1. Structural Integrity Check
- Verify directory structure matches intended architecture
- Check for orphaned files and dead code
- Identify duplicate or conflicting files
- Validate file naming conventions
- Ensure proper module boundaries

### 2. Link & Reference Validation
- Check all imports resolve correctly
- Verify internal documentation links
- Validate relative paths in configs
- Check for broken asset references
- Verify API endpoint consistency

### 3. Organizational Coherence
- Review recent logs for stated vs actual changes
- Cross-check implementation against documented decisions
- Identify architectural drift from original design
- Check for consistent patterns across modules
- Verify separation of concerns

### 4. Code Quality Audit
- Detect mixed paradigms (e.g., old Docusaurus + new React Router)
- Find inconsistent naming conventions
- Identify circular dependencies
- Check for proper error handling coverage
- Verify TypeScript coverage and strictness

### 5. Recent Changes Verification
- Compare git history with documented changes
- Verify all promised features were implemented
- Check for incomplete migrations
- Identify temporary fixes that became permanent
- Review TODOs and FIXMEs

## Usage
```
[clean]        # Full comprehensive audit
[clean!]       # Quick sanity check (high-priority issues only)
```

## Output Format
```
🔍 Architecture & Organization Audit

📁 Structural Issues:
- ❌ Found wcinyp-app/ subdirectory (should be in root)
- ⚠️  Mixed Docusaurus files in /src with React Router in /app
- ❌ Duplicate node_modules in parent directory

🔗 Broken References:
- ❌ Import './components/Header' not found (3 files)
- ⚠️  Dead link in README.md: ./docs/setup.md

🏗️ Architectural Problems:
- ❌ Promised in log: "Clean module boundaries"
   Reality: Domain logic mixed with UI in /app/routes
- ⚠️  Inconsistent: Using both CSS modules and Tailwind

📝 Recent Changes Audit:
- ❌ Log says: "Removed all Docusaurus files"
   Found: .docusaurus/ directory still exists
- ⚠️  Incomplete: Error boundaries only on 3/5 routes

🧹 Cleanup Actions:
1. Move all files from wcinyp-app/ to root
2. Remove .docusaurus/ directory
3. Fix broken imports in 3 files
4. Complete error boundary implementation
5. Remove duplicate node_modules

Severity: HIGH - Immediate action required
```

## Deep Check Areas

### Directory Structure
- No nested project directories
- Clear separation: /app, /public, /tests
- Config files in root
- Documentation in /.ai or /docs

### Import Hygiene
- Absolute imports use aliases
- No circular dependencies
- External deps from node_modules only
- Internal imports use consistent paths

### Git & Version Control
- No large binary files committed
- .gitignore properly configured
- No sensitive data in history
- Clean commit messages

### Dependencies
- Single package.json in root
- No duplicate dependencies
- Version conflicts resolved
- Dev/prod dependencies properly separated

### Testing
- Test files near source files
- Consistent test naming
- No broken test imports
- Coverage reports excluded from git

## Red Flags to Detect
1. **Frankenstein Architecture**: Mixed frameworks/approaches
2. **Inception Directories**: Projects within projects
3. **Zombie Code**: Dead code that's still imported
4. **Promise Drift**: Documented features not implemented
5. **Convention Chaos**: Multiple competing patterns
6. **Hidden State**: Hardcoded values that should be config
7. **Security Smells**: API keys, passwords in code

This command ensures architectural integrity and catches the "messy mf" mistakes before they compound.