# Lazarus Documentation Index

> "I have called this principle, by which each slight variation, if useful, is preserved, by the term of Natural Selection." - Charles Darwin

These documents were resurrected from the failed Docusaurus implementation. They contain valuable knowledge that survived the architectural apocalypse.

## 📋 Context (Read First)
- [CONTEXT.md](./CONTEXT.md) - Why these docs exist and what went wrong

## 🚀 For Gemini Research
- [GEMINI_RESEARCH_PROMPT.md](./GEMINI_RESEARCH_PROMPT.md) - Stack compatibility research request
- [TECHNICAL_LESSONS_COMPILED.md](./TECHNICAL_LESSONS_COMPILED.md) - All technical failures and lessons in one file

## 🏗️ Technical Lessons
Failed architecture and what we learned:

### In `technical-lessons/` directory:
- `archived-learnings.md` - Docusaurus + shadcn/ui integration failures
- `postmortem-frankenstein-architecture.md` - Why the three technologies were incompatible
- `overview.md` - Original system architecture attempts
- `error-boundaries.md` - Error handling (one thing that worked well)
- `typescript-migration.md` - TypeScript strict mode benefits
- `testing-infrastructure-issues.md` - React 19 + Jest problems
- `implementation-impact-analysis.md` - Cascading failure analysis

## 🏥 Knowledge Base
Medical imaging workflows and operations (still valid):

### In `knowledge-base/domain/` directory:
- `admin/` - EPIC reports, insurance, scheduling
- `clinical/` - Patient prep, PET imaging workflows
- `facilities/` - Contacts and locations
- `providers/` - Provider directory structure
- `staff-operations/` - Call scripts, facilitation, GPCP

## Key Takeaways

1. **Framework Incompatibility**: Docusaurus + Tailwind + shadcn/ui = disaster
2. **Domain Knowledge**: The medical workflows and business logic remain valid
3. **Architecture Lessons**: Start with the right foundation for your use case
4. **Testing First**: Don't accumulate testing debt
5. **Simple > Clever**: Over-engineering kills projects

## Using These Docs

When building the new system:
- Extract domain knowledge from the `/domain/` folder
- Learn from architectural mistakes in `/architecture/`
- Apply lessons from `/strategy/` documents
- Ignore all Docusaurus-specific implementation details
- Focus on business value, not technical cleverness