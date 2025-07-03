# Lazarus Documentation Context

## Why This Exists

These documents were salvaged from the failed Docusaurus v3 implementation that attempted to merge:
- Documentation site (Docusaurus)
- Interactive tools (Next.js + shadcn/ui)
- Testing infrastructure

## What Went Wrong

1. **Framework Collision**: Docusaurus and Next.js fought over routing, rendering, and build processes
2. **Testing Nightmare**: Jest couldn't handle the hybrid setup, leading to 80+ failing tests
3. **Over-Engineering**: Tried to do too much in one system instead of keeping concerns separate
4. **Type System Chaos**: Mixed TypeScript configurations between frameworks

## Lessons Learned

- Keep documentation and application code separate
- Don't force incompatible frameworks together
- Simple beats clever every time
- Test infrastructure must be rock solid from day one

## How to Use These Docs

These documents contain valuable domain knowledge and architectural decisions. When reading:
1. Focus on the content, not the implementation
2. Extract business logic and requirements
3. Ignore Docusaurus-specific formatting
4. Learn from the architectural mistakes documented

## Structure

- **strategy/**: High-level planning and decision documents
- **architecture/**: Technical implementation details and patterns
- **domain/**: Business domain knowledge (medical imaging, workflows, etc.)