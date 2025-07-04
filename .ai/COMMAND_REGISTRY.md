# Command Registry

Central definition of all AI commands with parameters, shortcuts, and execution patterns.

## Command Structure

Each command follows this pattern:
```
[command] [subcommand?] ["argument"?] [--flag value?]
```

## Registry

### [ship] - Deploy to Production
- **Shortcuts**: `[s]`, `[deploy]`
- **Parameters**:
  - `message` (string, optional) - Commit message
  - `--force` (boolean) - Skip confirmations
  - `--no-tests` (boolean) - Skip test suite (dangerous!)
- **Examples**:
  ```
  [ship]                          # Standard flow
  [ship "fix: update routes"]     # With message
  [ship! "hotfix"]               # Fast mode (--force)
  [s]                            # Using shortcut
  ```
- **Workflow**:
  1. Run tests (unless --no-tests)
  2. Type check
  3. Build project
  4. Commit changes
  5. Push to GitHub
  6. Report status

### [clean] - Architecture Audit
- **Shortcuts**: `[c]`, `[check]`
- **Parameters**:
  - `path` (string, optional) - Specific path to audit
  - `--fix` (boolean) - Auto-fix safe issues
  - `--strict` (boolean) - Include warnings as errors
- **Examples**:
  ```
  [clean]                    # Full audit
  [clean!]                   # Quick check (high priority only)
  [clean modules/users]      # Audit specific module
  [clean --fix]             # Fix what's safe to fix
  ```

### [test] - Run Tests
- **Shortcuts**: `[t]`
- **Parameters**:
  - `type` (unit|integration|e2e|all) - Test type
  - `--coverage` (boolean) - Include coverage report
  - `--watch` (boolean) - Watch mode
  - `file` (string, optional) - Specific file/pattern
- **Examples**:
  ```
  [test]                     # All tests
  [test unit]                # Unit tests only
  [test routes.test.tsx]     # Specific file
  [t --coverage]            # Run with coverage
  ```

### [sync] - Synchronize State
- **Shortcuts**: `[status]`, `[st]`
- **Parameters**:
  - `--fetch` (boolean) - Fetch from remote first
  - `--verbose` (boolean) - Detailed output
- **Examples**:
  ```
  [sync]                     # Local status
  [sync --fetch]            # Update from remote first
  [st]                      # Quick status
  ```

### [log] - Create Timestamped Log
- **Shortcuts**: `[l]`
- **Parameters**:
  - `title` (string, optional) - Log title
  - `--skip-preview` (boolean) - Don't preview
  - `--category` (string) - Log category
- **Examples**:
  ```
  [log]                      # Interactive log creation
  [log "Added auth system"]  # With title
  [log!]                     # Skip preview
  ```

### [recap] - Summarize Recent Work
- **Shortcuts**: `[r]`
- **Parameters**:
  - `period` (string) - Time period (1h, 24h, 3d)
  - `--commits` (boolean) - Include git commits
  - `--files` (boolean) - List changed files
- **Examples**:
  ```
  [recap]                    # Default period
  [recap 24h]               # Last 24 hours
  [recap 3d --commits]      # 3 days with commits
  ```

### [explore] - Deep Analysis
- **Shortcuts**: `[e]`, `[analyze]`
- **Parameters**:
  - `topic` (string, required) - What to explore
  - `--depth` (shallow|normal|deep) - Analysis depth
  - `--examples` (boolean) - Include code examples
- **Examples**:
  ```
  [explore "authentication"]     # Explore auth options
  [explore! "performance"]       # Deep dive
  [e "testing strategy"]        # Using shortcut
  ```

### [audit] - Code Review
- **Shortcuts**: `[review]`
- **Parameters**:
  - `path` (string, optional) - Path to audit
  - `--security` (boolean) - Focus on security
  - `--performance` (boolean) - Focus on performance
  - `--style` (boolean) - Include style issues
- **Examples**:
  ```
  [audit]                    # Full codebase
  [audit modules/users]      # Specific module
  [audit --security]         # Security focus
  ```

### [utd] - Update Documentation
- **Shortcuts**: `[update-docs]`, `[ud]`
- **Parameters**:
  - `file` (string, optional) - Specific file
  - `--check` (boolean) - Check only, don't update
  - `--force` (boolean) - Update even if seems current
- **Examples**:
  ```
  [utd]                      # Update all docs
  [utd README.md]           # Specific file
  [utd --check]             # Dry run
  ```

### [help] - Show Help
- **Shortcuts**: `[h]`, `[?]`
- **Parameters**:
  - `command` (string, optional) - Specific command
  - `--examples` (boolean) - Show more examples
- **Examples**:
  ```
  [help]                     # List all commands
  [help ship]               # Help for ship command
  [?]                       # Quick help
  ```

### [deploy-status] - Check Deployment Status
- **Shortcuts**: `[ds]`, `[deployment]`
- **Parameters**:
  - `--json` (boolean) - Output as JSON
  - `--watch` (boolean) - Watch for changes
- **Examples**:
  ```
  [deploy-status]            # Show latest deployment
  [ds]                       # Using shortcut
  [deploy-status --watch]    # Live updates
  ```
- **Workflow**:
  1. Connect to Netlify CLI
  2. Fetch latest deployment info
  3. Show state, timing, and URLs
  4. List recent deployments

### [deploy-logs] - View Deployment Logs
- **Shortcuts**: `[dl]`, `[logs]`
- **Parameters**:
  - `count` (number, optional) - Number of logs (default: 5)
  - `--error` (boolean) - Show only failed deploys
- **Examples**:
  ```
  [deploy-logs]              # Last 5 deployments
  [dl 10]                    # Last 10 deployments
  [deploy-logs --error]      # Failed deploys only
  ```

## Parameter Types

- **string**: Text value, quote if contains spaces
- **boolean**: Flag, presence means true
- **enum**: One of specific values
- **optional**: Can be omitted
- **required**: Must be provided

## Bang Syntax

Adding `!` to any command enables "fast mode":
- Skip confirmations
- Use defaults
- Minimize output
- Focus on speed

Examples:
```
[ship!]     # Ship with auto-generated message
[clean!]    # Quick audit, high priority only
[log!]      # Create log without preview
```

## Shortcuts

Quick aliases for common commands:
```
[s]   → [ship]
[c]   → [clean]
[t]   → [test]
[st]  → [sync]
[l]   → [log]
[r]   → [recap]
[e]   → [explore]
[h]   → [help]
[?]   → [help]
```

## Chaining

Commands can be chained with `&&`:
```
[sync] && [test] && [ship]
[clean --fix] && [test unit]
```

Only continues if previous command succeeds.

## Output Standards

All commands follow consistent output:
```
🚀 [Command Name]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Step 1: Description... ✅
Step 2: Description... ⏳ (in progress)
Step 3: Description... ⏸️  (pending)

📊 Results:
- Metric 1: value
- Metric 2: value

✅ Command completed successfully
```

Status indicators:
- ✅ Success
- ❌ Failed  
- ⚠️ Warning
- ⏳ In progress
- ⏸️ Pending
- 🔍 Analyzing
- 📊 Results
- 💡 Suggestion