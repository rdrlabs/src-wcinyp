# Component Guidelines

This document defines the standards and patterns for creating and maintaining React components in the WCI@NYP application.

## Table of Contents
- [Component Structure](#component-structure)
- [Naming Conventions](#naming-conventions)
- [TypeScript Requirements](#typescript-requirements)
- [Documentation Standards](#documentation-standards)
- [Styling Patterns](#styling-patterns)
- [Testing Requirements](#testing-requirements)
- [Accessibility Standards](#accessibility-standards)
- [Performance Considerations](#performance-considerations)

## Component Structure

All components should follow this standard structure:

```tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// 1. Define variants using CVA
const componentVariants = cva(
  "base-classes", // Base classes that always apply
  {
    variants: {
      variant: {
        default: "default-variant-classes",
        secondary: "secondary-variant-classes",
      },
      size: {
        default: "default-size-classes",
        sm: "small-size-classes",
        lg: "large-size-classes",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// 2. Define TypeScript interface with JSDoc
/**
 * Component description
 * @interface ComponentProps
 * @extends {React.HTMLAttributes<HTMLElement>}
 * @extends {VariantProps<typeof componentVariants>}
 * 
 * @property {string} [variant] - Visual style variant
 * @property {string} [size] - Size variant
 * @property {string} [className] - Additional CSS classes
 * @property {boolean} [asChild] - Render as Radix UI Slot
 * 
 * @example
 * ```tsx
 * <Component variant="secondary" size="lg">
 *   Content
 * </Component>
 * ```
 */
export interface ComponentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof componentVariants> {
  asChild?: boolean
}

// 3. Create component with forwardRef
const Component = React.forwardRef<HTMLDivElement, ComponentProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(componentVariants({ variant, size, className }))}
        data-testid="component-name"
        {...props}
      />
    )
  }
)
Component.displayName = "Component"

// 4. Export component and types
export { Component, type ComponentProps, componentVariants }
```

## Naming Conventions

### Files and Folders
- Components: `PascalCase.tsx` (e.g., `Button.tsx`, `DataTable.tsx`)
- Utilities: `kebab-case.ts` (e.g., `format-date.ts`)
- Types: `PascalCase` for interfaces, `camelCase` for type aliases
- Test files: `ComponentName.test.tsx`

### Component Props
```tsx
interface ComponentProps {
  // Boolean props: use "is" or "has" prefix
  isLoading?: boolean
  hasError?: boolean
  
  // Event handlers: use "on" prefix
  onClick?: () => void
  onChange?: (value: string) => void
  
  // Render props: use "render" prefix
  renderItem?: (item: Item) => React.ReactNode
  
  // Children variants: be explicit
  children?: React.ReactNode
  leftIcon?: React.ReactNode
  rightElement?: React.ReactElement
}
```

### CSS Classes and Variants
```tsx
// Use semantic names for variants
variant: {
  default: "...",     // Not "primary" - use semantic meaning
  destructive: "...", // Not "red" - describe intent
  outline: "...",     // Not "bordered" - be specific
}

// Use t-shirt sizes for sizing
size: {
  sm: "...",
  md: "...", // or "default"
  lg: "...",
  xl: "...",
}
```

## TypeScript Requirements

### No `any` Types
```tsx
// ❌ Bad
const handleClick = (event: any) => {}

// ✅ Good
const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {}
```

### Generic Components
```tsx
// For components that work with different data types
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  // Implementation
}
```

### Strict Event Handler Types
```tsx
// ❌ Bad
onChange: (e) => void

// ✅ Good
onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
```

## Documentation Standards

### Component JSDoc
Every exported component must have JSDoc documentation:

```tsx
/**
 * A flexible button component with multiple variants and sizes
 * 
 * @component
 * @example
 * ```tsx
 * // Default button
 * <Button>Click me</Button>
 * 
 * // Destructive variant with icon
 * <Button variant="destructive">
 *   <TrashIcon className="mr-2 h-4 w-4" />
 *   Delete
 * </Button>
 * ```
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(...)
```

### Props Documentation
All props should be documented in the interface:

```tsx
export interface ButtonProps {
  /**
   * The visual style variant of the button
   * @default "default"
   */
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  
  /**
   * The size of the button
   * @default "default"
   */
  size?: "default" | "sm" | "lg" | "icon"
  
  /**
   * Whether the button is in a loading state
   * Shows a spinner and disables interaction
   */
  isLoading?: boolean
}
```

## Styling Patterns

### Use CVA for Variants
All components with visual variants should use `class-variance-authority`:

```tsx
import { cva } from "class-variance-authority"

const buttonVariants = cva(
  // Base classes
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
  {
    variants: {
      variant: { /* ... */ },
      size: { /* ... */ },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

### Theme-Aware Classes
Always use semantic color classes that work with light/dark themes:

```tsx
// ❌ Bad - hardcoded colors
className="bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100"

// ✅ Good - semantic colors
className="bg-background text-foreground"
className="bg-card text-card-foreground"
className="bg-primary text-primary-foreground"
```

### Consistent Spacing
Use Tailwind spacing utilities consistently:

```tsx
// Padding/Margin scale: 0, 1, 2, 3, 4, 6, 8, 12, 16, 20, 24
// Common patterns:
className="p-4"        // Standard padding
className="px-3 py-2"  // Button padding
className="space-y-4"  // Vertical spacing between children
className="gap-2"      // Flexbox/Grid gap
```

## Testing Requirements

### Required Test Coverage
Every component must have:

1. **Basic Rendering Test**
```tsx
it('renders without crashing', () => {
  render(<Component />)
  expect(screen.getByTestId('component-name')).toBeInTheDocument()
})
```

2. **Props Testing**
```tsx
it('applies variant classes correctly', () => {
  const { rerender } = render(<Button variant="destructive" />)
  expect(screen.getByRole('button')).toHaveClass('destructive-classes')
  
  rerender(<Button variant="outline" />)
  expect(screen.getByRole('button')).toHaveClass('outline-classes')
})
```

3. **Theme Testing**
```tsx
describe('Theme Tests', () => {
  it('renders correctly in both themes', () => {
    const { light, dark } = renderInBothThemes(<Component />)
    
    expectSemanticColors(light.getByTestId('component'))
    expectSemanticColors(dark.getByTestId('component'))
  })
})
```

4. **Accessibility Testing**
```tsx
it('meets accessibility standards', async () => {
  const { container } = render(<Component />)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

### Data Test IDs
All interactive elements must have data-testid attributes:

```tsx
<button data-testid="submit-button" />
<input data-testid="email-input" />
<div data-testid="error-message" />
```

## Accessibility Standards

### ARIA Labels
Provide appropriate ARIA labels for all interactive elements:

```tsx
// Icon-only buttons
<Button aria-label="Delete item">
  <TrashIcon />
</Button>

// Form inputs
<Input aria-label="Email address" />

// Loading states
<Spinner aria-label="Loading..." />
```

### Keyboard Navigation
All interactive components must be keyboard accessible:

```tsx
// Support keyboard events
onKeyDown={(e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    handleClick()
  }
}}

// Proper focus management
const buttonRef = useRef<HTMLButtonElement>(null)
useEffect(() => {
  if (shouldFocus) {
    buttonRef.current?.focus()
  }
}, [shouldFocus])
```

### Focus Indicators
Never remove focus indicators without providing alternatives:

```tsx
// ❌ Bad
className="focus:outline-none"

// ✅ Good
className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
```

## Performance Considerations

### Memoization
Use React.memo for expensive components:

```tsx
export const ExpensiveComponent = React.memo(({ data }: Props) => {
  // Component implementation
})

// With custom comparison
export const Component = React.memo(
  ({ items }: Props) => { /* ... */ },
  (prevProps, nextProps) => {
    return prevProps.items.length === nextProps.items.length
  }
)
```

### Lazy Loading
Split code for large components:

```tsx
const HeavyComponent = React.lazy(() => import('./HeavyComponent'))

function App() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <HeavyComponent />
    </Suspense>
  )
}
```

### Event Handler Optimization
Use useCallback for event handlers passed to child components:

```tsx
const handleClick = useCallback((id: string) => {
  // Handle click
}, [/* dependencies */])

return items.map(item => (
  <Item key={item.id} onClick={() => handleClick(item.id)} />
))
```

## Component Categories

### 1. UI Components (`/components/ui/`)
- Pure presentational components
- No business logic
- Fully theme-aware
- Examples: Button, Card, Input, Select

### 2. Feature Components (`/components/features/`)
- Domain-specific components
- May contain business logic
- Composed of UI components
- Examples: DocumentViewer, FormBuilder

### 3. Layout Components (`/components/layout/`)
- Page structure components
- Navigation elements
- Examples: Navbar, Footer, Sidebar

### 4. Utility Components (`/components/shared/`)
- Reusable patterns
- Higher-order components
- Examples: ErrorBoundary, LoadingBoundary

## Common Patterns

### Compound Components
For complex components with multiple parts:

```tsx
const Card = ({ children, className }: CardProps) => { /* ... */ }
const CardHeader = ({ children, className }: CardHeaderProps) => { /* ... */ }
const CardContent = ({ children, className }: CardContentProps) => { /* ... */ }
const CardFooter = ({ children, className }: CardFooterProps) => { /* ... */ }

// Export as compound component
export { Card, CardHeader, CardContent, CardFooter }

// Usage
<Card>
  <CardHeader>Title</CardHeader>
  <CardContent>Content</CardContent>
  <CardFooter>Actions</CardFooter>
</Card>
```

### Polymorphic Components
For components that can render as different elements:

```tsx
import { Slot } from "@radix-ui/react-slot"

interface ButtonProps {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp ref={ref} {...props} />
  }
)

// Usage
<Button asChild>
  <Link href="/home">Home</Link>
</Button>
```

## Migration Checklist

When updating existing components to follow these guidelines:

- [ ] Remove any TypeScript `any` types
- [ ] Add comprehensive JSDoc documentation
- [ ] Implement CVA for variants (if applicable)
- [ ] Add data-testid attributes
- [ ] Ensure theme compatibility (semantic colors)
- [ ] Add missing tests (rendering, props, theme, a11y)
- [ ] Verify keyboard navigation
- [ ] Add proper ARIA labels
- [ ] Remove duplicate files
- [ ] Update imports throughout codebase