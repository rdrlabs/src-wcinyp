# Internal Documentation Inventory

This file tracks what documentation has been moved to the internal docs directory and why.

## Documents Moved to Internal

### Developer Tools & Workflows

1. **CLAUDE.md**
   - Contains Claude Code specific instructions
   - Includes Context7 MCP integration details
   - Has internal shortcuts and commands
   - Location: `/docs/internal/CLAUDE.md`

2. **TASKMASTER_*.md files**
   - TASKMASTER_COMMANDS.md - Internal task management commands
   - TASKMASTER_BEST_PRACTICES.md - Developer workflow practices
   - TASKMASTER_TESTING_WORKFLOW.md - Internal testing workflows
   - Contains internal task IDs and helper scripts

3. **CLAUDE-HANDOFF.md**
   - Developer handoff document
   - Contains internal implementation decisions
   - Task Master configuration details
   - MCP server setup information

4. **CODERABBIT_WORKFLOW.md**
   - Claude Code hooks configuration
   - MCP integration details
   - Internal automation workflows

5. **CODERABBIT_LOCAL_GUIDE.md**
   - VSCode extension setup for internal use
   - Local development workflows

### Technical Assessments

6. **TECH_DEBT.md**
   - Internal technical debt assessment
   - Security vulnerabilities discussion
   - Infrastructure weaknesses
   - Should not be public as it reveals system issues

## Public Documentation Created

To replace internal docs, we created public-facing versions:

1. **docs/SUPABASE_SETUP_PUBLIC.md**
   - Public guide for Supabase setup
   - No internal implementation details
   - Uses example credentials only

2. **docs/CODERABBIT_SETUP_PUBLIC.md**
   - Public guide for CodeRabbit usage
   - Removed Claude Code specific workflows
   - Removed MCP integration details
   - Focuses on general usage

## Archived Files

### Numbered Duplicates
All numbered duplicate documentation files (e.g., "* 2.md", "* 3.md") have been moved to:
- `/archive/numbered-doc-backups/`
- These appear to be file sync conflicts
- Kept for reference but not active documentation

## Guidelines for Future Documentation

### What Goes in Internal Docs

1. **Developer-specific tools**
   - Claude Code configurations
   - Task management systems
   - Internal helper scripts

2. **Security-sensitive information**
   - Technical debt assessments
   - Known vulnerabilities
   - System architecture details that could aid attackers

3. **Internal workflows**
   - Handoff documents
   - Team-specific processes
   - Automation configurations

### What Stays Public

1. **Setup guides** (without internal details)
2. **User documentation**
3. **API documentation**
4. **Contributing guidelines**
5. **General architecture overviews**

## Security Notes

- Never include real credentials, even in internal docs
- Use clearly fake examples (e.g., `sk-example-*`)
- Review internal docs before sharing with contractors
- Keep this directory out of public documentation builds

## Maintenance

This inventory should be updated whenever:
- New internal documentation is created
- Documentation is moved between public/internal
- Public versions of internal docs are created