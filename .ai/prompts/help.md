# [help] - Show Available Commands

Display all available commands or detailed help for a specific command.

## Usage
```
[help]              # Show all commands
[help ship]         # Detailed help for ship command
[help shortcuts]    # List all shortcuts
[?]                 # Quick help (shortcut)
```

## Output: All Commands
```
🤖 AI Command Reference
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📦 Deployment
  [ship]    Deploy to production (test → build → commit → push)
  [s]       Shortcut for [ship]

🔍 Analysis  
  [clean]   Deep architecture audit
  [audit]   Code quality review
  [explore] Deep dive into topic

🧪 Development
  [test]    Run test suite
  [sync]    Show project status
  [t]       Shortcut for [test]

📝 Documentation
  [log]     Create timestamped log
  [recap]   Summarize recent work
  [utd]     Update docs to match code

Type [help command] for detailed usage.
```

## Output: Specific Command
```
📘 Help for [ship]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Deploy the current project to production.

USAGE:
  [ship]                    Standard flow with confirmations
  [ship "message"]          With custom commit message
  [ship!]                   Fast mode (skip confirmations)
  [s]                       Shortcut

FLAGS:
  --force                   Skip all confirmations
  --no-tests               Skip test suite (dangerous!)

WORKFLOW:
  1. Run tests ✓
  2. Type check ✓
  3. Build project ✓
  4. Commit changes ✓
  5. Push to GitHub ✓

EXAMPLES:
  [ship]
  [ship "feat: add user authentication"]
  [ship! "hotfix: resolve critical bug"]
  [s]

RELATED:
  [test]    Run tests before shipping
  [clean]   Check architecture before shipping
```

## Output: Shortcuts
```
⚡ Command Shortcuts
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[s]   → [ship]      Deploy to production
[c]   → [clean]     Architecture audit
[t]   → [test]      Run tests
[st]  → [sync]      Project status
[l]   → [log]       Create log
[r]   → [recap]     Summarize work
[e]   → [explore]   Deep analysis
[h]   → [help]      Show help
[?]   → [help]      Show help

TIP: Add ! for fast mode: [s!] = [ship!]
```