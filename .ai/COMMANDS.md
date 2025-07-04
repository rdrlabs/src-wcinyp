# AI Command Reference

Quick reference for all custom commands. Type the command name to execute.

## Core Commands

### [ship] - Deploy to Production
Runs tests, builds, commits, and pushes to GitHub
```
[ship]                    # Full workflow with commit message prompt
[ship "message"]          # With custom commit message
[ship!]                   # Fast mode, auto-generated message
```

### [clean] - Architecture & Organization Audit
Deep check for structural issues, broken links, and messy code
```
[clean]                   # Full comprehensive audit
[clean!]                  # Quick sanity check (high-priority only)
```

### [sync] - Synchronize State
Get current project status
```
[sync]                    # Full status report
```

### [test] - Run All Tests  
Execute complete test suite
```
[test]                    # All tests
[test unit]               # Unit tests only
[test e2e]                # E2E tests only
```

### [log] - Create Timestamped Log
Document significant changes
```
[log]                     # Create log with preview
[log!]                    # Create without preview
```

### [recap] - Summarize Recent Work
Show work without creating permanent log
```
[recap]                   # Last few hours
[recap 24h]               # Last 24 hours
```

### [explore] - Deep Analysis
Investigate specific aspect of codebase
```
[explore "topic"]         # Standard exploration
[explore! "topic"]        # Deep dive with recommendations
```

### [audit] - Code Review
Review code quality and patterns
```
[audit]                   # Full codebase
[audit "path"]            # Specific path/module
```

### [utd] - Update Documentation
Sync documentation with code reality
```
[utd]                     # Update all docs
[utd "specific.md"]       # Update specific file
```

## Command Patterns

- Base command: `[command]` - Standard execution
- Bang variant: `[command!]` - Fast/enhanced mode
- With args: `[command "argument"]` - Parameterized execution

## Implementation Status

✅ Defined: All commands have prompt templates
🚧 Evolving: Commands improve based on usage
📝 Documented: This reference + individual prompts in `.ai/prompts/`

## Future: Native Integration

Goal: Convert to native Claude commands when/if API supports:
- `/ship` instead of `[ship]`
- Auto-completion
- Built-in parameter validation
- Command history

For now, the `[command]` syntax works well and is consistent.