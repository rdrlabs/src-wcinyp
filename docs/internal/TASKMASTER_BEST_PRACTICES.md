# Taskmaster Best Practices with Claude Code

## Current Status (July 2025)
- **Version**: 0.20.0 ✅
- **Integration**: Claude Code (no API key required)
- **Known Issue**: AI-powered features (research, expand, analyze-complexity) have integration issues with Claude Code

## Effective Workflow Without AI Features

### 1. Core Commands That Work Well
```bash
# Navigation and viewing
task-master next                           # Get next task
task-master show 6                         # Show specific task details
task-master list                           # List all tasks
task-master list --status=pending          # List pending tasks only

# Task management
task-master set-status --id=6 --status=in-progress
task-master set-status --id=6 --status=done

# Batch operations
task-master show 1,2,3,4,5                 # Show multiple tasks at once
```

### 2. Helper Scripts Integration
We've created helper scripts to streamline the workflow:
```bash
# Aliases (after running setup-taskmaster-aliases.sh)
tmn     # task-master next
tml     # task-master list
tms 6   # Show task 6 details (custom helper)
tmd 6   # Mark task 6 as done

# Test integration
tmt     # Run tests for current phase
tmv     # Validate task acceptance criteria
```

### 3. Manual Task Breakdown
Since `task-master expand` has issues, manually break down complex tasks:
1. Identify tasks that need subtasks
2. Create a markdown file with breakdown
3. Implement step by step

### 4. Research Alternative
Instead of `task-master research`, use:
1. WebSearch tool in Claude Code
2. WebFetch for specific documentation
3. Manual research and documentation

### 5. Phased Testing Approach
Our project uses a 3-phase testing strategy:
- **Phase 1**: Browser automation (Playwright) - ✅ Complete
- **Phase 2**: Visual testing (pixelmatch/pngjs) - In Progress
- **Phase 3**: Production hardening (coverage, CI)

### 6. Task Documentation Pattern
For each task, document:
- Acceptance criteria
- Commands to run
- Files to create/modify
- Validation steps

## Visual Testing Best Practices (Phase 2)

### Setup
```bash
# Install dependencies (Task 6) ✅
npm install --save-dev pixelmatch pngjs @types/pixelmatch @types/pngjs

# Create directory structure
mkdir -p tests/visual/{baseline,current,diff}

# Add test scripts to package.json
"test:visual": "playwright test tests/e2e/visual",
"test:visual:update": "playwright test tests/e2e/visual --grep 'update all baselines'"
```

### Implementation Pattern
1. **Capture baseline screenshots** on first run
2. **Compare current vs baseline** on subsequent runs
3. **Generate diff images** for failures
4. **Set appropriate thresholds** (0.1 = 10% difference allowed)

### Helper Functions (Task 7) ✅
```typescript
// src/test/visual-validator.ts
export async function captureAndCompare(
  page: Page,
  name: string,
  options: { threshold?: number } = {}
): Promise<boolean> {
  // Captures screenshot, compares with baseline
  // Creates baseline if it doesn't exist
  // Returns true if match, false if different
}

// Also includes:
// - captureAndCompareElement() for specific elements
// - updateBaseline() for manual updates
// - cleanupTestImages() for maintenance
// - getFailedTests() for debugging
```

### Test Structure (Task 8) ✅
```typescript
// tests/e2e/visual/fumadocs-visual.spec.ts
test('authentication handling', async ({ page }) => {
  await page.goto('/');
  
  // Handle authentication
  const demoButton = page.locator('button:has-text("Continue with Demo Mode")');
  if (await demoButton.isVisible()) {
    await demoButton.click();
  }
  
  // Visual test
  const isMatch = await captureAndCompare(page, 'authenticated-home');
  expect(isMatch).toBeTruthy();
});
```

### Key Learnings from Implementation

1. **Authentication Must Be Handled**: The app requires login, so tests need to handle the auth flow first
2. **Disable Animations**: Critical for stable visual tests
   ```typescript
   test.use({
     launchOptions: {
       args: ['--force-prefers-reduced-motion']
     }
   });
   ```
3. **Use Specific Selectors**: Generic selectors like 'h1' may not work; use more specific ones
4. **Baseline Creation**: Tests automatically create baselines on first run - no manual setup needed
5. **Cross-Browser Considerations**: Focus on Chromium for visual tests to avoid false positives

## Custom Research Functionality

Since the built-in research feature doesn't work with Claude Code, use our custom script:

```bash
# Basic research
tmr "Playwright visual testing best practices"

# Research with file context
tmr "Fumadocs configuration" -f "mdx-components.ts,source.config.ts"

# Research with task context
tmr "Visual testing implementation" -t "7,8,9"
```

The script provides:
- Formatted research prompts
- Quick tips for common topics
- Integration with project context
- WebSearch query suggestions

## Common Issues and Solutions

### Issue 1: Claude Code Integration
**Problem**: AI features fail with "Claude Code process exited with code 1"
**Solution**: Use custom helper scripts (tmr for research)

### Issue 2: Task Navigation
**Problem**: No `task-master current` command
**Solution**: Use `task-master show <id>` instead

### Issue 3: Complex Tasks
**Problem**: Can't use `expand` to break down tasks
**Solution**: Manually analyze and create subtasks

## Recommended Workflow

1. **Start of session**:
   ```bash
   tmn          # Get next task
   tms <id>     # Show task details
   ```

2. **During work**:
   ```bash
   task-master set-status --id=<id> --status=in-progress
   # Do the work
   tmt          # Run tests
   tmv          # Validate acceptance
   ```

3. **Complete task**:
   ```bash
   tmd <id>     # Mark as done
   tmn          # Get next task
   ```

4. **Review progress**:
   ```bash
   tml | grep -E "(done|pending)" | sort | uniq -c
   ```

## Future Improvements
1. Wait for Taskmaster Claude Code integration fixes
2. Consider using API key for full AI features
3. Create more helper scripts for common patterns
4. Document workarounds as they're discovered