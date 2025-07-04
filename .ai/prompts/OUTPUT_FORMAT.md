# Command Output Formatting Standards

Consistent output formatting for all AI commands.

## Standard Command Output Structure

```
🚀 [Command Name]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Progress Section]
Step 1: Description... ✅
Step 2: Description... ⏳
Step 3: Description... ⏸️

[Results Section]
📊 Results:
- Metric 1: value
- Metric 2: value

[Status]
✅ Command completed successfully
```

## Status Indicators

### Progress States
- ✅ Complete
- ⏳ In progress
- ⏸️  Pending
- ❌ Failed
- ⚠️  Warning
- 🔍 Analyzing
- 💤 Skipped

### Icons by Category
- 🚀 Deployment/Action
- 🧪 Testing
- 🔍 Analysis/Search
- 📊 Results/Metrics
- 📝 Documentation
- 🛠️  Maintenance
- 💡 Suggestions
- 🎯 Goals/Targets
- 🏗️  Building
- 🧹 Cleaning

## Examples by Command

### [ship] Output
```
🚀 Ship to Production
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Running tests... ✅ (8/8 passed)
Type checking... ✅ 
Building project... ✅ (638ms)
Creating commit... ✅
Pushing to GitHub... ✅

📊 Summary:
- Tests: 8/8 passing
- Build size: 384kb
- Deploy time: 12.3s

✅ Successfully shipped to production!
→ View at: https://your-app.netlify.app
```

### [clean] Output
```
🔍 Architecture Audit
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Checking structure... 🔍
Validating imports... ✅
Scanning for issues... ⏳

📊 Issues Found:
❌ Critical (2):
  - Circular dependency: user.ts ↔ auth.ts
  - Missing error boundary: /routes/admin

⚠️ Warnings (3):
  - Inconsistent naming: getUserData vs fetchUserInfo
  - Large file: components/Dashboard.tsx (512 lines)
  - TODO older than 30 days: auth.ts:42

💡 Suggestions:
- Consider splitting Dashboard.tsx into smaller components
- Standardize data fetching function names

❌ Audit failed: 2 critical issues need attention
```

### [test] Output
```
🧪 Running Tests
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Running unit tests... ✅ (45/45)
Running integration tests... ✅ (12/12)
Running e2e tests... ⏳ (3/5)

Test Results:
✅ routes/home.test.tsx (250ms)
✅ routes/documents.test.tsx (180ms)
✅ modules/auth.test.tsx (340ms)
❌ e2e/navigation.spec.ts
  - Expected navigation to /admin
  - Timeout after 5000ms

📊 Coverage Report:
- Statements: 92% (184/200)
- Branches: 87% (61/70)
- Functions: 95% (38/40)
- Lines: 91% (182/200)

⚠️ Tests completed with 1 failure
```

### [sync] Output
```
📍 Project Status
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Repository: src-wcinyp
Branch: main ✅
Remote: origin (up to date)

📊 Local Status:
- Modified: 3 files
- Untracked: 1 file
- Staged: 0 files

🔄 Recent Activity:
- feat: add user authentication (2 hours ago)
- fix: resolve routing issue (5 hours ago)
- docs: update README (1 day ago)

💡 Next Steps:
- Stage and commit local changes
- Pull latest from develop branch
```

## Error Output Format

```
❌ Command Failed: [command name]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Error: [Brief error description]

Details:
[Detailed error message or stack trace]

💡 Suggestions:
- [Helpful suggestion 1]
- [Helpful suggestion 2]

Try: [help command] for usage information
```

## Multi-Step Progress

For long-running commands, show live progress:

```
🏗️ Building Project
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[■■■■■■■□□□] 70% - Optimizing assets...

✅ Compiled routes (2.1s)
✅ Generated types (0.8s)
⏳ Optimizing images...
⏸️ Minifying JavaScript
⏸️ Generating manifest
```

## Compact Mode (Bang Commands)

For `!` commands, use minimal output:

```
[ship!] ✅ Tests → Build → Commit → Push → Done (8.2s)
```

## Color Guidelines (When Supported)

- 🟢 Green: Success, complete
- 🟡 Yellow: Warning, in progress
- 🔴 Red: Error, failed
- 🔵 Blue: Info, suggestions
- ⚪ Gray: Disabled, skipped

## Formatting Rules

1. **Consistent Width**: Aim for ~50 character width for separators
2. **Spacing**: Single line between sections
3. **Alignment**: Align status indicators
4. **Truncation**: Long paths/messages should truncate with ...
5. **Numbers**: Right-align numeric values where possible

## Interactive Prompts

```
🤔 Commit Message Required
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Recent changes:
- Modified: auth.ts, user.ts
- Added: auth.test.ts

Suggested: "feat: implement user authentication"

Enter message (or press Enter to accept): _
```