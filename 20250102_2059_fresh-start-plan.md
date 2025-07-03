# Fresh Start Plan: WCI Administrative Tools

## Quick Reference from Archived Learnings

### ❌ What Failed
- **Docusaurus + shadcn/ui**: Fundamental CSS conflicts ("water and oil")
- **Foundation backwards**: Built app inside documentation framework
- **Progressive deterioration**: Each fix made styling worse
- **Testing collapsed**: React 19 + JSDOM incompatibility

### ✅ What Worked
- **shadcn/ui components**: 96% test coverage when isolated
- **Error boundaries**: Production resilience
- **TypeScript strict**: Prevented runtime errors
- **Documentation**: Captured all learnings

### 🎯 Recommended Stack
```javascript
{
  "framework": "Next.js 14+ (App Router)",
  "ui": "shadcn/ui + Tailwind CSS",
  "state": "Zustand",
  "testing": "Vitest + Testing Library",
  "docs": "Separate Docusaurus instance"
}
```

### 🏗️ Build Order (TDD + Design First)
1. **Design System Setup**
   - Install shadcn/ui
   - Configure Tailwind properly
   - Set up component library

2. **Core Features (with tests first)**
   - Document Hub
   - Form Generator
   - Provider Directory

3. **Infrastructure**
   - Error boundaries
   - State management
   - Performance optimization

### 📁 Archive Reference
See `/archive/ARCHIVED_LEARNINGS.md` for detailed analysis of what went wrong and why.

### 🚀 Ready to Start?
The foundation is cleared. Pick your framework and let's build it right this time with:
- Design-first approach
- Test-driven development
- Proper architectural boundaries
- Performance from day one