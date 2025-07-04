# WCINYP - Weill Cornell Imaging at NewYork-Presbyterian

A modern Next.js 14 application for medical imaging administration, featuring document management, provider directories, and automated form generation.

## Features

- **Document Hub** - Access and manage 156+ medical forms and documents
- **Provider Directory** - Search and manage medical staff information
- **Form Generator** - Automate self-pay forms and document creation
- **Master Directory** - Comprehensive contact database for all stakeholders
- **Knowledge Base** - Documentation powered by Fumadocs

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS v3 + shadcn/ui
- **Documentation**: Fumadocs (native MDX support)
- **Theme**: Dark mode support with next-themes
- **Language**: TypeScript

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # Reusable React components
│   └── ui/          # shadcn/ui components
├── lib/             # Utility functions
└── content/         # MDX documentation content
    └── docs/        # Fumadocs content

public/
└── documents/       # 156 PDF documents organized by category
```

## Key Pages

- `/` - Dashboard with quick access to all features
- `/documents` - Document management with category filtering
- `/providers` - Provider directory with search
- `/forms` - Form generator and template management
- `/directory` - Master contact directory
- `/docs` - Knowledge base and documentation

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Run production server
npm start

# Type checking
npm run type-check

# Run tests
npm test

# Run tests with UI
npm run test:watch

# Test coverage
npm run test:coverage

# Linting
npm run lint

# Format code
npm run format

# Check formatting
npm run format:check
```

## Deployment

This application is configured for deployment on Netlify with automatic builds from the main branch.

The `netlify.toml` file includes:
- Next.js plugin configuration
- Node.js v20 requirement
- Security headers

## Migration Notes

This application was migrated from React Router v7 to Next.js 14 to enable:
- Better documentation support with Fumadocs
- Improved performance with static generation
- Native MDX support
- Enhanced SEO capabilities

The React Router version is archived in `/archive/react-router-version/` for reference.

## License

Private - Weill Cornell Medicine