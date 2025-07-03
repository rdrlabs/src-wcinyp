# AI Prompt Templates

## Available Commands

### [sync]
Pull latest changes from GitHub to your local repository.
- Usage: `[sync]`
- Location: `@.ai/prompts/sync.md`

### [test]
Run the full test suite including coverage, type checking, and linting.
- Usage: `[test]`
- Location: `@.ai/prompts/test.md`

### [commit]
Commit and push changes to GitHub. Auto-generates conventional commit message if none provided.
- Usage: `[commit]` or `[commit "fix: resolve navigation bug"]`
- Location: `@.ai/prompts/commit.md`

### [ship]
All-in-one: sync, test, update docs, commit, and push workflow.
- Usage: `[ship]` or `[ship "feat: new feature"]`
- Effect: Runs [sync] → [test] → [utd] → [commit] in sequence
- Location: `@.ai/prompts/ship.md`

### [log]
Document important findings (always previews before creating).
- Usage: `[log]` - Shows what will be logged, then you approve/modify
- Output: Creates timestamped file in `/logs/` after approval
- Location: `@.ai/prompts/log.md`

### [recap]
Summarize all work done since the last log entry.
- Usage: `[recap]` - Shows activity without creating a log
- Output: Summary of changes since last log file
- Location: `@.ai/prompts/recap.md`

### [explore]
Explore implementation paths before building - think like a senior dev.
- Usage: `[explore]` for 2-3 options, `[explore!]` for deep 4-5 option analysis
- Output: Implementation paths with trade-offs and recommendations
- Location: `@.ai/prompts/explore.md`

### [audit]  
Assess current implementation quality and find improvements.
- Usage: `[audit] our form validation` or `Let's [audit] the auth flow`
- Output: Current state analysis, what's working, gaps, risks
- Location: `@.ai/prompts/audit.md`

### [utd]
Update documentation to match current code reality.
- Usage: `[utd]` - runs documentation sync check
- Output: Updates outdated paths, commands, and structure
- Location: `@.ai/prompts/utd.md`

### [help]
Show all available commands with descriptions.
- Usage: `[help]` - displays command reference
- Output: Organized list of all prompt commands
- Location: `@.ai/prompts/help.md`

## Examples

```
"Please [sync] with GitHub"
"Run [test] before we deploy"
"[commit] these changes" 
"We decided to use Next.js [log]"
```