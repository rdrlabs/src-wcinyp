# Internal Developer Documentation

This directory contains internal developer documentation that should NOT be included in public-facing documentation or exposed to end users.

## What Belongs Here

1. **Internal Development Workflows**
   - Task management commands (Taskmaster, etc.)
   - Claude Code specific instructions
   - Internal tooling setup

2. **Technical Debt & Architecture Decisions**
   - Known vulnerabilities or security concerns
   - Technical debt assessments
   - Internal architecture decisions that could reveal security weaknesses

3. **Developer-Specific Setup**
   - Local development environment setup
   - Internal API keys or service configurations (use examples only)
   - Debugging tools and commands

4. **Team Communication**
   - Handoff documents between developers
   - Internal notes and reminders
   - Work-in-progress documentation

## Security Guidelines

- NEVER commit real credentials, even in internal docs
- Use clearly fake examples (e.g., `sk-example-*`, `ghp_example_*`)
- Keep sensitive architecture details here, not in public docs
- Review before sharing with external contractors

## Files to Move Here

The following files should be relocated to this directory:
- CLAUDE.md (Claude Code instructions)
- TASKMASTER_*.md files
- TECH_DEBT.md
- Developer handoff documents
- Internal workflow guides

## Access Control

This directory should be:
1. Excluded from any public documentation builds
2. Only accessible to authorized developers
3. Not referenced in public-facing documentation