# WCINYP Task Master Rules

## Project Context

You are working on WCINYP (Weill Cornell Imaging at NewYork-Presbyterian), a medical imaging center application built with:
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- Fumadocs for documentation
- Vitest for testing

## Task Management Principles

### 1. Task Creation
- Every task must have clear acceptance criteria
- Break down tasks with complexity > 3 into subtasks
- Include testing requirements in task definition
- Reference relevant documentation or code files

### 2. Task Prioritization
- **High Priority**: Blocking other work, security issues, broken functionality
- **Medium Priority**: Feature development, planned improvements
- **Low Priority**: Nice-to-have features, documentation, refactoring

### 3. Development Workflow
1. Read task requirements thoroughly
2. Check CLAUDE.md for project conventions
3. Review existing similar code for patterns
4. Write tests first (TDD approach)
5. Implement solution
6. Run validation commands
7. Update documentation
8. Mark task complete

### 4. Required Validations
Before marking any task complete, run:
```bash
npm run lint
npm run type-check
npm test -- --run
```

### 5. Documentation Requirements
- Update CLAUDE.md if introducing new patterns
- Update technical.md for architecture changes
- Update README.md as the master development reference (dev-facing, not user-facing)
- Add inline comments for complex logic

### 6. Git Workflow
- Create feature branch for each task
- Use conventional commits: `feat:`, `fix:`, `docs:`, `test:`
- Reference task ID in commit messages
- Create PR with clear description

### 7. Testing Standards
- Minimum 80% coverage for new code
- Test user interactions, not implementation
- Include edge cases and error states
- Mock external dependencies

### 8. Code Standards
- All components must use `'use client'` directive
- Follow existing shadcn/ui patterns
- Use TypeScript strictly (no `any` types)
- Implement proper error handling
- Consider accessibility (WCAG 2.1 AA)

### 9. Performance Considerations
- Lazy load heavy components
- Optimize images with Next.js Image
- Minimize bundle size
- Use proper caching strategies

### 10. Security Requirements
- Sanitize all user inputs
- No sensitive data in code
- Use environment variables for secrets
- Follow OWASP guidelines

## Task Templates

Use provided templates in `tasks/templates/`:
- `feature.md` - For new features
- `bug-fix.md` - For bug fixes

## Special Considerations

### Netlify Deployment
- Remember: static export only
- No server components
- Use Netlify Functions for backend

### Fumadocs Integration
- Knowledge base uses isolated styling
- Don't modify RootProvider usage
- Follow Fumadocs MDX conventions

### Archive Management
- Failed attempts go in `/archive/`
- Keep source code, remove node_modules
- Document lessons learned

## Communication

When working on tasks:
- Update task status promptly
- Document blockers immediately
- Ask for clarification if needed
- Share learnings in task notes

Remember: The goal is maintainable, tested, and well-documented code that serves medical imaging professionals effectively.