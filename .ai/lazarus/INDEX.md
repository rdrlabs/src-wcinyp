# Lazarus Documentation Index

> "I have called this principle, by which each slight variation, if useful, is preserved, by the term of Natural Selection." - Charles Darwin

These documents were resurrected from the failed Docusaurus implementation. They contain valuable knowledge that survived the architectural apocalypse.

## 📋 Context (Read First)
- [CONTEXT.md](./CONTEXT.md) - Why these docs exist and what went wrong

## 🎯 Strategy Documents
Documents about planning, decisions, and lessons learned:

- [archived-learnings.md](./strategy/archived-learnings.md) - Comprehensive learnings from the Docusaurus + shadcn/ui integration attempt
- [postmortem-frankenstein-architecture.md](./strategy/postmortem-frankenstein-architecture.md) - Detailed analysis of why the three technologies were incompatible
- [AI_CODEV_GUIDE.md](./strategy/AI_CODEV_GUIDE.md) - Original AI development guide (approach failed but context valuable)

## 🏗️ Architecture Documents
Technical implementation details and patterns:

- [overview.md](./architecture/overview.md) - System architecture overview
- [error-boundaries.md](./architecture/error-boundaries.md) - Error handling strategy for medical workflows
- [typescript-migration.md](./architecture/typescript-migration.md) - TypeScript strict mode implementation
- [testing-infrastructure-issues.md](./architecture/testing-infrastructure-issues.md) - Testing challenges and solutions
- [implementation-impact-analysis.md](./architecture/implementation-impact-analysis.md) - Analysis of implementation decisions

## 🏥 Domain Knowledge
Business logic and medical imaging workflows:

### Admin Operations
- [epic-reports.md](./domain/admin/epic-reports.md) - EPIC system integration and reporting
- [insurance.md](./domain/admin/insurance.md) - Insurance verification workflows
- [scheduling.md](./domain/admin/scheduling.md) - Appointment scheduling processes

### Clinical Workflows
- [patient-preparation.md](./domain/clinical/patient-preparation.md) - Patient prep requirements by modality
- [pet-imaging.md](./domain/clinical/pet-imaging.md) - PET/CT and PET/MRI specific workflows

### Facilities
- [contacts.md](./domain/facilities/contacts.md) - Facility contact information
- [locations.md](./domain/facilities/locations.md) - WCINYP location details

### Provider Management
- [directory.md](./domain/providers/directory.md) - Provider directory structure

### Staff Operations
- [confirmation-calls.md](./domain/staff-operations/confirmation-calls.md) - Patient confirmation call scripts
- [facilitation.md](./domain/staff-operations/facilitation.md) - Workflow facilitation procedures
- [gpcp.md](./domain/staff-operations/gpcp.md) - GPCP (General Patient Care Protocol) guidelines

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