# AI Assistant Prompting Script for Maximum Effectiveness

## 🎯 **Initial Context Setup Prompt**

```
You are working on the WCINYP (Weill Cornell Imaging at NewYork-Presbyterian) medical document management system. This system supports real clinical workflows for Senior Patient Coordinators (SPCs) who handle high-volume patient inquiries, registration, insurance verification, appointment scheduling, and pre-authorization for imaging procedures across 7 Manhattan sites. SPCs are the front-line staff ensuring optimal patient experiences, making system reliability, accessibility, and ease-of-use absolutely critical for patient care delivery.

Before starting ANY task:

1. **READ THESE FILES FIRST** (in this order):
   - README.md - Project overview and technical requirements
   - AI_CODEV_GUIDE.md - Development standards and critical reminders  
   - UI_PREFERENCES.md - User preferences for UI organization and layout
   - TESTING_PROTOCOL.md - Testing requirements and quality gates
   - package.json - Available scripts and dependencies

2. **CHECK PROJECT STATUS**:
   - Run: npm run test:ci (must pass 64/64 tests)
   - Run: npm run typecheck (must pass clean)
   - Run: npm run build (must succeed)

3. **FOLLOW THESE PRINCIPLES**:
   - Use TodoWrite tool to plan and track ALL tasks
   - Match Provider layout pattern EXACTLY for UI components
   - Update tests when making UI changes - don't just make them pass
   - Test coverage must be 85%+ on new components
   - All documentation must stay current with code changes

4. **VERIFY UNDERSTANDING**:
   - Confirm you understand the Provider layout standard
   - Acknowledge testing protocol compliance requirements
   - Confirm you will update documentation as you work

Only proceed after reading all reference files and confirming understanding.
```

## 🔧 **Task-Specific Prompt Templates**

### **For UI Component Work:**
```
Task: [DESCRIBE SPECIFIC UI TASK]

CRITICAL CONTEXT: This UI will be used by Senior Patient Coordinators handling high-volume patient inquiries, registration, and scheduling across multiple imaging modalities. Fast, intuitive workflows are essential as SPCs manage continuous streams of patient interactions while ensuring optimal patient experiences.

Requirements:
- Read src/pages/providers.tsx to understand the Provider layout pattern
- Match the exact header → search → filters → content structure
- Use inline styles consistent with existing components
- Update tests FIRST to expect new UI structure
- Verify accessibility with ARIA labels and keyboard navigation
- Run full test suite after changes

Expected deliverables:
- Component that matches Provider design exactly
- Updated tests with 85%+ coverage
- Documentation updates if needed
- All tests passing (64/64)
```

### **For Testing Implementation:**
```
Task: [DESCRIBE TESTING TASK]

CRITICAL CONTEXT: These tests validate medical workflow software used by healthcare professionals. Test failures could indicate potential issues affecting patient care or clinical efficiency.

Requirements:
- Follow TESTING_PROTOCOL.md standards exactly
- Test real user behavior, not implementation details
- Include accessibility testing (ARIA, keyboard navigation)
- Cover edge cases (empty states, errors, loading)
- Achieve 90%+ coverage on new components
- All tests must validate actual functionality

Expected deliverables:
- Test files following established patterns
- Coverage report showing 90%+ on new code
- Tests that would catch real bugs
- Documentation of any testing decisions
```

### **For Bug Fixes:**
```
Task: [DESCRIBE BUG]

Requirements:
- Write a failing test that reproduces the bug FIRST
- Fix the bug with minimal code changes
- Ensure fix doesn't break existing functionality
- Update documentation if behavior changes
- Run full test suite to verify no regressions

Expected deliverables:
- Failing test that proves the bug exists
- Minimal fix that makes test pass
- All existing tests still passing
- Updated documentation if needed
```

### **For Documentation Updates:**
```
Task: [DESCRIBE DOCUMENTATION TASK]

Requirements:
- Keep all badge URLs and metrics current
- Ensure consistency across all documentation files
- Test all links and verify they work
- Update coverage numbers to match reality
- Maintain professional, factual tone

Expected deliverables:
- Accurate, current documentation
- Working links and correct badges
- Consistency across all files
- No placeholder or dummy content
```

## 🚨 **Critical Reminders Checklist**

Before starting ANY task, the AI must confirm:

- [ ] I have read README.md, AI_CODEV_GUIDE.md, and TESTING_PROTOCOL.md
- [ ] I understand the Provider layout pattern is the design standard
- [ ] I will use TodoWrite to track all tasks and progress
- [ ] I will run tests after every significant change
- [ ] I will update tests when making UI changes
- [ ] I will maintain 85%+ coverage on new components
- [ ] I will keep documentation current with code changes
- [ ] I will commit with clear, descriptive messages

## 🎪 **Quality Gates - Must Pass Before Completion**

Every task must pass these gates:

1. **Testing Gate**: All 64 tests passing, no regressions
2. **TypeScript Gate**: Clean compilation with no errors
3. **Build Gate**: Production build succeeds without warnings
4. **Coverage Gate**: 85%+ coverage maintained on critical components
5. **Documentation Gate**: All docs current and accurate
6. **Accessibility Gate**: WCAG 2.1 AA compliance maintained

## 📋 **Standard Workflow Template**

```
1. **Setup Phase**:
   - Read reference documentation
   - Check current system status (tests, build, etc.)
   - Create todo list for the task

2. **Planning Phase**:
   - Understand requirements and constraints
   - Identify what tests need updating
   - Plan approach that follows established patterns

3. **Implementation Phase**:
   - Update tests FIRST if doing UI work
   - Make minimal, focused changes
   - Test incrementally as you work

4. **Verification Phase**:
   - Run full test suite (must pass 64/64)
   - Verify TypeScript compilation
   - Test production build
   - Update documentation

5. **Deployment Phase**:
   - Commit with clear message
   - Push to trigger automated deployment
   - Verify deployment succeeded
```

## 🔄 **Continuous Improvement Protocol**

After completing any task:

1. **Update AI_CODEV_GUIDE.md** if you learned new patterns
2. **Update TESTING_PROTOCOL.md** if you discovered new testing approaches
3. **Update this prompt script** if you found better ways to work
4. **Document any edge cases** or gotchas for future AI assistants

## 💡 **Pro Tips for Maximum Effectiveness**

1. **Remember the medical context** - this serves real healthcare professionals and patients
2. **Always read the Provider component first** - it's the design standard
3. **Use TodoWrite religiously** - it prevents missed tasks in critical healthcare software
4. **Test in the browser** - don't just rely on automated tests for medical workflows
5. **Keep commits small and focused** - easier to review and rollback in production healthcare systems
6. **Update documentation as you go** - essential for medical software compliance
7. **Ask for clarification** if requirements are ambiguous - clarity is critical in healthcare
8. **Follow the established patterns** - consistency reduces clinical errors

## 🎯 **Success Metrics**

An effective AI session should achieve:
- ✅ All tasks completed as requested
- ✅ All tests passing (64/64)
- ✅ No regressions introduced
- ✅ Documentation kept current
- ✅ Code follows established patterns
- ✅ User experience improved or maintained

---

**This script ensures every AI assistant starts with full context and follows proven patterns for maximum effectiveness and consistency.**