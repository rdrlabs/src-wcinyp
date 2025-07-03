# WCINYP Development Guide

## 🚀 Available Commands
When starting a session, I have these commands ready:

**Quick Actions:**
- `[ship]` - All-in-one: sync → test → commit
- `[sync]` - Pull latest from GitHub
- `[test]` - Run full test suite  
- `[commit]` - Save & push to GitHub

**Documentation:**
- `[log]` - Document findings (previews first)
- `[recap]` - Summarize work since last log

**Analysis:**
- `[explore]` - Show paths (`[explore!]` for deep dive)
- `[audit]` - Review existing code quality

**Help:**
- `[utd]` - Update docs to match reality
- `[help]` - Show all commands

Example: "Fixed the bug [ship]" or "Add auth [explore]"

## Project Context
Fresh React application replacing the Docusaurus hybrid approach. All legacy code archived in `/archive/v1-docusaurus-hybrid/`.

## Project Structure
```
src-wcinyp/
├── src/          # Application code (to be created)
├── logs/         # Decision & finding logs
├── .ai/          # AI templates and config
└── archive/      # Legacy Docusaurus code
```

## Key Scripts
```bash
npm install       # Install dependencies
npm start         # Start dev server
npm test          # Run tests
npm run build     # Production build
```

## Development Standards
- TypeScript with strict mode (when implemented)
- 90% test coverage target
- Conventional commits
- Document key decisions with [log]

## AI Prompts
@.ai/INDEX.md