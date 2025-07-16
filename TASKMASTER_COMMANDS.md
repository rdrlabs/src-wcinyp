# Taskmaster Command Reference

## Essential Commands for Testing Workflow

### Task Navigation
```bash
task-master next                    # Get next available task
task-master show <id>               # Show detailed info for specific task
task-master list                    # List all tasks
task-master list --status=pending   # List only pending tasks
```

### Task Status Management
```bash
task-master set-status --id=<id> --status=in-progress  # Start working on task
task-master set-status --id=<id> --status=done         # Mark task complete
task-master set-status --id=<id> --status=deferred     # Defer blocked task
```

### Common Workflow
```bash
# 1. Get next task and view details
task-master next
task-master show 2

# 2. Start working on it
task-master set-status --id=2 --status=in-progress

# 3. Complete the task
task-master set-status --id=2 --status=done

# 4. Move to next
task-master next
```

## Common Mistakes to Avoid

❌ **WRONG Commands**:
- `task-master current` - Does not exist
- `task-master get --id=2` - Does not exist
- `task-master complete 2` - Use `set-status` instead

✅ **CORRECT Commands**:
- `task-master show 2` - Show task details
- `task-master set-status --id=2 --status=done` - Mark complete
- `task-master next` - Get next task

## Testing Integration Commands

These are from our helper scripts:
```bash
# Aliases (after running setup-taskmaster-aliases.sh)
tmn     # task-master next
tml     # task-master list
tmd 2   # task-master set-status --id=2 --status=done
tms 2   # Show task 2 (custom helper)

# Test helpers
tmt     # Run tests for current phase
tmv     # Validate current task completion
```

## Task Status Values
- `pending` - Not started
- `in-progress` - Currently working
- `done` - Completed
- `review` - Needs review
- `deferred` - Blocked/postponed
- `cancelled` - Won't complete

## Quick Reference for Testing Tasks

### Phase 1 (Browser Automation)
```bash
task-master show 1  # Playwright install
task-master show 2  # Create config
task-master show 3  # Fumadocs tests
task-master show 4  # Test utilities
task-master show 5  # Update scripts
```

### Phase 2 (Visual Testing)
```bash
task-master show 6  # Install deps
task-master show 7  # Visual helper
task-master show 8  # Visual tests
task-master show 9  # Documentation
```

### Phase 3 (Production)
```bash
task-master show 10  # Coverage
task-master show 11  # Performance
task-master show 12  # CI workflow
task-master show 13  # Optimization
task-master show 14  # Maintenance
```