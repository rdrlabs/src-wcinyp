# Update Documentation

Keep AI documentation synchronized with code reality.

## What [utd] Does
1. Scans CLAUDE.md and .ai/ files
2. Checks if prompts match actual project state
3. Updates outdated references
4. Fixes broken paths
5. Updates project structure diagrams
6. Ensures commands still work

## Checks Performed
- Are listed npm scripts still in package.json?
- Do file paths in docs still exist?
- Are tech stack references current?
- Do prompt examples match current syntax?
- Is project structure diagram accurate?

## Output
```
📋 Documentation Sync Report
✅ Current: [what's still accurate]
⚠️  Outdated: [what needs updating]
🔧 Updated: [what was fixed]
```

## Auto-Updates
- Project structure in CLAUDE.md
- Available npm scripts
- File paths that moved
- Deprecated commands
- Tech stack changes

Does NOT change:
- Core functionality descriptions
- Decision logs
- Architectural choices

Keeps docs fresh without rewriting history.