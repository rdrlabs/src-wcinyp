# Claude App Handoff Document - WCINYP Project

## Context7 Integration
**IMPORTANT**: Always use Context7 MCP for up-to-date documentation by adding "use context7" to prompts when working with:
- Next.js 15 (not 14!) App Router patterns
- React 19 features
- Tailwind CSS v4 syntax
- shadcn/ui components
- Fumadocs v15 MDX
- Supabase authentication
- Vitest 2.0 testing

## Current Situation

We're refactoring the WCINYP radiology administration application to:
1. Remove over-engineered features from the proof of concept
2. Focus on core backend functionality (Phase 2)
3. Implement a strict design system based on shadcn/ui + Tailwind v4 principles
4. Use Task Master to generate actionable development tasks

## What We've Completed

### 1. Documentation Cleanup ✅
- **Archived ambitious features** → `docs/FUTURE-IDEAS.md` (Epic EMR, ML features, etc.)
- **Removed long sections** → `docs/REMOVED-SECTIONS.md` (original roadmap content)
- **Cleaned README.md** → Now focuses only on Phase 2 core backend
- **Updated PRD** → Realistic goals in `.taskmaster/docs/prd.txt`

### 2. Code Cleanup ✅
- **Removed Wiki System** completely:
  - Deleted `/src/app/wiki` route
  - Removed `/content/wiki` directory
  - Removed `wiki-loader.ts`
  - Cleaned all references
  - App builds successfully

## Task Master Configuration

### Current Setup
- **Version**: 0.19.0 (installed globally and locally)
- **Mode**: Claude Code (no API key required)
- **Configuration**: `.taskmaster/config.json`
```json
{
  "models": {
    "main": { "provider": "claude-code", "modelId": "opus" },
    "research": { "provider": "claude-code", "modelId": "sonnet" },
    "fallback": { "provider": "claude-code", "modelId": "sonnet" }
  }
}
```

### MCP Server Configuration
- **VS Code**: `.vscode/mcp.json`
- **Command**: `npx -y --package=task-master-ai task-master-ai`

### Issue with Claude Code
The `parse-prd` command fails with Claude Code integration. Need to use Claude app or API key mode.

## Updated PRD Content

Location: `.taskmaster/docs/prd.txt`

### Core Features (Simplified)
1. **Document Management** - Browse/download 156+ PDFs
2. **Provider Directory** - Basic profiles with NPI, contact info
3. **Form Templates** - Client-side filling, backend submission (Phase 2)
4. **Contact Directory** - Staff contacts with search
5. **Knowledge Base** - Fumadocs documentation

### Phase 2 Priorities
1. **Backend**:
   - Simple form submission handler (Netlify Function)
   - Basic authentication (CWID later if needed)
   - Data storage decision (email vs database)
   - Form validation

2. **UI Refinement**:
   - Remove unnecessary features
   - Implement strict design system
   - Simplify provider cards
   - Clean navbar design
   - Apply 60/30/10 color rule

## Design System Guidelines

We need to implement these strict principles (saved in `docs/DESIGN-GUIDELINES.md`):

### Core Principles
1. **Typography**: ONLY 4 font sizes, 2 weights (regular, semibold)
2. **Spacing**: ALL values divisible by 8 or 4 (8pt grid)
3. **Colors**: 60% neutral, 30% complementary, 10% accent
4. **Simplicity**: Clean visual structure over flashiness

### Navbar Reference
- Follow Next.js.org style: Logo | Centered Nav | Right Actions
- Remove: Command palette, quick links dropdown, feedback button, fake login

## Features to Remove/Simplify

### Provider Cards (`src/components/ui/provider-table.tsx`)
Remove:
- Star ratings (no data source)
- Excessive affiliation badges
- Provider flags (VIP, urgent, new, teaching, research)
- "Available today" indicator
- Languages spoken section

Keep:
- Name, specialty, NPI
- Basic contact info
- Essential affiliations only

### Navbar (`src/components/navbar.tsx`)
Remove:
- Command palette (Cmd+K search dialog)
- Quick Links dropdown (Teams/Outlook)
- Feedback button
- Login/User system (fake CWID)

Simplify to:
- Logo | Knowledge, Directory, Documents, Providers | Theme Toggle

### Other Removals
- ✅ Wiki system (already removed)
- Complex search functionality
- Excessive badges and colors

## Next Steps for Task Master

1. **In Claude App**, run:
```bash
task-master parse-prd --input=.taskmaster/docs/prd.txt --num-tasks=15
```

2. **Expected Task Categories**:
   - Backend: Netlify Functions setup
   - Backend: Form submission handler
   - Backend: Basic authentication
   - UI: Remove provider complexity
   - UI: Simplify navbar
   - UI: Implement typography system
   - UI: Apply 8pt grid
   - UI: Apply color rules

3. **After tasks are generated**:
```bash
task-master list
task-master next
task-master expand --id=1 --num=5  # For complex tasks
```

## Current Project State

- **Next.js**: 15.3.5 (NOT 14!)
- **React**: 19.0.0
- **Tailwind CSS**: 4.0.0
- **Tests**: 327 passing (some may need updates after UI changes)
- **Build**: Successful
- **TypeScript**: No errors
- **ESLint**: Clean
- **Deployment**: Netlify static export

## Implementation Order

1. **Task Master Setup** (do first in Claude app)
2. **UI Simplification** (high priority):
   - Simplify provider cards
   - Redesign navbar
   - Remove command palette
3. **Design System** (medium priority):
   - Typography constants (4 sizes, 2 weights)
   - Spacing audit (8pt grid)
   - Color reduction (60/30/10)
4. **Backend** (after UI cleanup):
   - Netlify Function for forms
   - Basic auth if needed
   - Data storage decision

## Key Files to Reference

- **PRD**: `.taskmaster/docs/prd.txt`
- **Design Guidelines**: `docs/DESIGN-GUIDELINES.md`
- **Provider Component**: `src/components/ui/provider-table.tsx`
- **Navbar**: `src/components/navbar.tsx`
- **Navigation Config**: `src/config/navigation.ts`
- **Constants**: `src/constants/` (various files)

## Questions Needing Answers

1. **Forms**: Just email results or need database storage?
2. **Auth**: Is CWID required or can we start simpler?
3. **Providers**: Which affiliations are actually needed?
4. **Documents**: Need upload capability or just serve existing PDFs?

## Tailwind v4 Upgrade (Optional)

Consider upgrading for:
- Better OKLCH color support
- Native container queries
- Simplified configuration
- Better shadcn/ui integration

## Remember

The goal is a **clean, maintainable codebase** that:
- Follows strict design principles
- Has realistic features that work
- Is ready for backend integration
- Doesn't over-promise functionality

Focus on **removing complexity** before adding new features!