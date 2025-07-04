# Log Decision/Finding

Document important findings, decisions, or architectural changes.

## Usage
`[log]` - Always shows preview before creating file

You can then:
- Approve it as-is
- Ask to modify it
- Split into multiple logs
- Skip creating it

## Preview Mode (default)
Shows proposed log content for review:
```
📝 Proposed Log: auth-implementation.md
---
# Auth Implementation Decision

**Summary**: Chose NextAuth over custom JWT implementation...

**Key Points**:
- ✅ Built-in providers
- ✅ Session management
---
Create this log? (yes/modify/split/skip)
```

## File Format
Creates file in `/logs/YYYYMMDD_HHMM_descriptive-name.md`
Uses local system time (EDT/EST)

## Content Structure
- Clear title
- 2-3 sentence summary  
- Key points (bullet list)
- Why it matters
- Keep under 200 words

Example:
- "We decided to use Vite [log]" shows preview, then creates:
  `/logs/20250103_2215_vite-decision.md`