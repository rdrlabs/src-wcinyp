# WCINYP - Weill Cornell Imaging at NewYork-Presbyterian

WCINYP is a modern radiology administration application built with Next.js 15, providing document management, provider directories, and automated form generation for medical imaging operations.

## Critical Context for AI Development

This project uses **Claude Task Master** for persistent task tracking and development workflow management. All development work should be tracked through the task management system located in `.taskmaster/` directory.

## Business Context

This is a **healthcare administration application** for radiology departments at Weill Cornell Medicine and NewYork-Presbyterian Hospital. The application serves medical staff, administrators, and support personnel who need to:

- Access and manage medical forms and documents
- Look up provider information and contact details
- Process self-pay patient forms
- Access institutional knowledge and procedures
- Manage contact directories for all stakeholders

## Core Features

- **Knowledge Base**: Fumadocs-powered documentation with sidebar navigation for technical documentation and guides
- **Master Directory**: Comprehensive contact database for all stakeholders (medical staff, administrators, support)
- **Documents & Forms**: Integrated document repository (156+ forms) with form generator for self-pay automation
- **Provider Directory**: Enhanced provider profiles with NPI numbers, affiliations, and expandable notes (Epic EMR style)
- **Staff Wiki**: MDX-based wiki for WCINYP work documentation (policies, procedures, emergency info)

## Key User Workflows

1. **Document Management**: Staff search for and download medical forms, with category filtering and rapid access
2. **Provider Lookup**: Find provider contact information, specialties, affiliations, and availability
3. **Self-Pay Processing**: Generate and process patient self-pay forms with automated validation
4. **Contact Management**: Search and export contact information for various departments and roles
5. **Knowledge Access**: Browse technical documentation and institutional procedures

## Business Requirements

- **Compliance**: Must handle medical information appropriately (no PHI storage)
- **Accessibility**: WCAG 2.1 AA compliance for healthcare accessibility standards
- **Performance**: Fast document access for time-sensitive medical workflows
- **Reliability**: High uptime for critical healthcare operations
- **Security**: Secure handling of institutional data and forms

## User Experience

- Dark mode support with next-themes for different work environments
- Responsive design for desktop, tablet, and mobile access
- Accessibility-focused UI components for healthcare compliance
- Command palette for quick navigation (Command+K) for power users
- Toast notifications instead of browser alerts for better UX

## Integration Points

- **Supabase**: Authentication and user management
- **Upstash Redis**: Rate limiting and caching
- **Netlify Functions**: Backend processing for form submissions
- **External APIs**: Potential integration with hospital systems

## Deployment Architecture

The application is deployed on Netlify as a static site export, which means:
- No server components (client components only)
- No API routes (use Netlify Functions instead)
- No SSR (Static Site Generation only)
- Client-side data fetching and state management
- CDN distribution for fast global access

## Current Status & Roadmap

**Phase 1 Completed (Jan 2025)**: ✅
- UI modernization with shadcn/ui components
- Comprehensive test coverage (327 tests)
- Fumadocs integration with style isolation
- Dark mode implementation
- Toast notification system

**Phase 2 (Current Priority)**:
- Form submission backend with Netlify Functions
- Basic authentication system
- Data persistence for user preferences
- Enhanced search capabilities

**Phase 3 (Future)**:
- Advanced provider management features
- Integration with hospital systems
- Enhanced reporting and analytics
- Mobile app considerations

## Project Health Status

**Test Suite**: 327 tests across 28 test files (93.9% success rate)
**Technical Debt**: Minimal - most critical issues resolved in Jan 2025
**Build Status**: ✅ All builds passing
**Deployment**: ✅ Automated via Netlify
**Code Quality**: ✅ ESLint, Prettier, TypeScript all passing

## Known Constraints & Limitations

1. **Netlify Free Tier**: Static export only, no server components
2. **Healthcare Compliance**: No PHI storage, accessibility requirements
3. **Design System**: Strict enforcement via automated validation
4. **Testing**: Some timeout issues in Claude Code environment
5. **Performance**: Large inline wiki content needs optimization

## Success Metrics

- **User Experience**: Fast document access, intuitive navigation
- **Developer Experience**: Comprehensive testing, clear documentation
- **Maintainability**: Consistent patterns, automated validation
- **Accessibility**: WCAG 2.1 AA compliance target
- **Performance**: Sub-3s page loads, smooth interactions