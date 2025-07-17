# Project Structure & Organization

## Directory Structure

```
src/
├── app/              # Next.js App Router pages
│   ├── auth/         # Authentication pages
│   ├── documents/    # Document management pages
│   ├── directory/    # Contact directory pages
│   ├── knowledge/    # Knowledge base (Fumadocs)
│   ├── providers/    # Provider directory pages
│   ├── wiki/         # Staff wiki pages
│   ├── layout.tsx    # Root layout with providers
│   └── page.tsx      # Homepage
├── components/       # Reusable React components
│   ├── features/     # Feature-specific components
│   ├── shared/       # Shared utility components
│   └── ui/           # shadcn/ui components
├── contexts/         # React context providers
├── hooks/            # Custom React hooks
├── lib/              # Utility functions
│   ├── supabase.ts   # Supabase client
│   └── utils.ts      # General utilities
├── types/            # TypeScript type definitions
└── test/             # Test utilities and mocks

content/
└── docs/             # Fumadocs MDX content
    ├── features/     # Feature documentation
    ├── getting-started/ # Onboarding docs
    ├── guides/       # How-to guides
    └── meta.json     # Documentation metadata

public/
└── documents/        # PDF documents organized by category

netlify/
└── functions/        # Netlify serverless functions
```

## Key Files

- `next.config.mjs` - Next.js configuration with Fumadocs setup
- `tailwind.config.ts` - Tailwind CSS configuration with theme variables
- `components.json` - shadcn/ui configuration
- `mdx-components.tsx` - MDX component overrides
- `source.config.ts` - Fumadocs source configuration

## Code Organization Patterns

### 1. Page Structure

Each page follows this structure:
```tsx
'use client' // Required for Netlify static export

import { useState } from 'react'
import { PageHeader } from '@/components/page-header'

export default function FeaturePage() {
  // State and handlers
  const [state, setState] = useState()
  
  // Component rendering
  return (
    <div className="container py-6">
      <PageHeader title="Feature Name" description="Feature description" />
      {/* Page content */}
    </div>
  )
}
```

### 2. Component Organization

Components follow this pattern:
```tsx
'use client'

import { cn } from '@/lib/utils'
import type { ComponentProps } from '@/types'

interface MyComponentProps extends ComponentProps {
  title: string
  description?: string
}

export function MyComponent({
  title,
  description,
  className,
  ...props
}: MyComponentProps) {
  return (
    <div className={cn("base-styles", className)} {...props}>
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
    </div>
  )
}
```

### 3. Feature Organization

Feature-specific code is organized by domain:
- Components in `components/features/{feature-name}/`
- Pages in `app/{feature-name}/`
- Types in `types/{feature-name}.ts`
- Hooks in `hooks/use-{feature-name}.ts`

### 4. Test Organization

Tests are co-located with their components:
- `component-name.test.tsx` next to `component-name.tsx`
- Page tests in `app/page-name/page.test.tsx`
- Utility tests in `lib/util-name.test.ts`

## Naming Conventions

1. **Files & Folders**
   - Use kebab-case for file and folder names
   - React components are PascalCase
   - Utility functions are camelCase

2. **Components**
   - PascalCase for component names
   - Export named functions, not default exports
   - Include 'use client' directive for all components

3. **Types & Interfaces**
   - PascalCase with descriptive names
   - Suffix props with `Props`
   - Suffix context with `Context`

4. **CSS Classes**
   - Use Tailwind utility classes
   - Follow BEM-like naming for custom classes
   - Use `cn()` utility for conditional classes

## Import Order

Follow this import order pattern:
```tsx
// 1. React and Next.js imports
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// 2. Third-party libraries
import { motion } from 'framer-motion'
import { format } from 'date-fns'

// 3. UI components
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

// 4. Project components
import { PageHeader } from '@/components/page-header'
import { DocumentCard } from '@/components/features/documents/document-card'

// 5. Hooks, utils, and types
import { useDocuments } from '@/hooks/use-documents'
import { cn } from '@/lib/utils'
import type { Document } from '@/types'

// 6. Assets and styles (if any)
import '@/styles/custom.css'
```

## Best Practices

1. **Component Structure**
   - Keep components small and focused
   - Extract complex logic to custom hooks
   - Use composition over inheritance

2. **State Management**
   - Use React Context for global state
   - Keep state as local as possible
   - Consider Zustand for complex state

3. **Performance**
   - Use React.memo for expensive components
   - Implement proper dependency arrays in hooks
   - Avoid unnecessary re-renders

4. **Accessibility**
   - Use semantic HTML elements
   - Include proper ARIA attributes
   - Ensure keyboard navigation works