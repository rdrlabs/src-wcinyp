# Design System Guide

## Overview
This guide documents the design patterns and conventions for the WCINYP application, following shadcn/ui and Tailwind CSS v4 standards. The goal is consistency through patterns, not rigid restrictions.

## Typography

### Text Sizes
We use Tailwind's standard text size scale. Common sizes for different contexts:

| Size | Pixels | Common Usage |
|------|--------|--------------|
| `text-xs` | 12px | Tiny labels, badges, footnotes |
| `text-sm` | 14px | UI elements, buttons, form labels |
| `text-base` | 16px | Body text, descriptions |
| `text-lg` | 18px | Section headings |
| `text-xl` | 20px | Larger headings |
| `text-2xl` | 24px | Page titles |
| `text-3xl` | 30px | Hero headings |
| `text-4xl` | 36px | Large hero text |
| `text-5xl` | 48px | Extra large displays |

**Note**: Avoid `text-6xl` through `text-9xl` as they're too large for most UI contexts.

### Font Weights
| Weight | Value | Usage |
|--------|-------|-------|
| `font-normal` | 400 | Body text, descriptions |
| `font-medium` | 500 | Subtle emphasis, active states |
| `font-semibold` | 600 | Headings, buttons, important text |
| `font-bold` | 700 | Strong emphasis when needed |

### Typography Patterns
```tsx
// Page Title
<h1 className="text-2xl font-semibold">Page Title</h1>

// Section Heading
<h2 className="text-lg font-semibold">Section Title</h2>

// Body Text
<p className="text-base">Content goes here...</p>

// Small UI Text
<span className="text-sm text-muted-foreground">Helper text</span>

// Badge
<Badge className="text-xs">New</Badge>
```

## Colors

### Semantic Color System
Always use semantic color tokens instead of Tailwind's direct colors:

| Token | Usage |
|-------|-------|
| `bg-background` / `text-foreground` | Main content |
| `bg-card` / `text-card-foreground` | Card surfaces |
| `bg-primary` / `text-primary-foreground` | Primary actions, links |
| `bg-secondary` / `text-secondary-foreground` | Secondary elements |
| `bg-muted` / `text-muted-foreground` | Subtle backgrounds, disabled states |
| `bg-accent` / `text-accent-foreground` | Hover states, accents |
| `bg-destructive` / `text-destructive` | Errors, destructive actions |

**Never use**: Direct color utilities like `bg-blue-500`, `text-red-600`, etc.

### Color Examples
```tsx
// ✅ Good
<Button className="bg-primary text-primary-foreground hover:bg-primary/90">
  Submit
</Button>

<Alert className="border-destructive/20 bg-destructive/10 text-destructive">
  Error message
</Alert>

// ❌ Bad
<Button className="bg-blue-600 text-white hover:bg-blue-700">
  Submit
</Button>
```

## Spacing & Sizing

### Component Heights
Following shadcn/ui standards:

| Component | Small | Default | Large |
|-----------|-------|---------|-------|
| Button | `h-9` (36px) | `h-10` (40px) | `h-11` (44px) |
| Input | `h-9` (36px) | `h-10` (40px) | - |
| Badge | - | `h-6` (24px) | - |

### Padding & Margins
Use Tailwind's standard spacing scale:

```tsx
// Buttons
<Button className="h-10 px-4 py-2">Default</Button>
<Button size="sm" className="h-9 px-3">Small</Button>
<Button size="lg" className="h-11 px-8">Large</Button>

// Cards
<Card className="p-6">...</Card>

// Sections
<section className="py-8 md:py-12">...</section>

// Gaps
<div className="flex gap-4">...</div>
<div className="space-y-6">...</div>
```

### Icon Sizes
| Context | Size | Usage |
|---------|------|-------|
| `h-4 w-4` | 16px | Default UI icons |
| `h-5 w-5` | 20px | Medium icons, emphasized contexts |
| `h-6 w-6` | 24px | Large icons, feature sections |

## Component Patterns

### Buttons
```tsx
// Default Button
<Button>Click me</Button>

// With Icon
<Button>
  <Plus className="h-4 w-4" />
  Add Item
</Button>

// Icon Only
<Button size="icon" className="h-10 w-10">
  <X className="h-4 w-4" />
</Button>
```

### Forms
```tsx
<div className="space-y-4">
  <div className="space-y-2">
    <Label htmlFor="email" className="text-sm font-medium">
      Email
    </Label>
    <Input 
      id="email" 
      type="email" 
      placeholder="Enter your email"
      className="h-10"
    />
    <p className="text-sm text-muted-foreground">
      We'll never share your email.
    </p>
  </div>
</div>
```

### Cards
```tsx
<Card>
  <CardHeader>
    <CardTitle className="text-lg font-semibold">Card Title</CardTitle>
    <CardDescription className="text-sm text-muted-foreground">
      Brief description of the card content.
    </CardDescription>
  </CardHeader>
  <CardContent>
    <p className="text-base">Main content goes here.</p>
  </CardContent>
</Card>
```

### Tables
```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead className="text-sm font-medium">Name</TableHead>
      <TableHead className="text-sm font-medium">Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell className="text-sm">John Doe</TableCell>
      <TableCell>
        <Badge variant="secondary" className="text-xs">
          Active
        </Badge>
      </TableCell>
    </TableRow>
  </TableBody>
</Table>
```

## Best Practices

### Do's
- ✅ Use semantic color tokens
- ✅ Follow component height standards (h-9, h-10, h-11)
- ✅ Use appropriate text sizes for context
- ✅ Keep consistent spacing patterns
- ✅ Use CVA for component variants

### Don'ts
- ❌ Use direct color utilities (bg-blue-500)
- ❌ Use extreme text sizes (text-6xl+)
- ❌ Mix different design patterns
- ❌ Create custom spacing values when standard ones work

## Dark Mode
All components automatically support dark mode through semantic color tokens. The theme toggle switches between light and dark color schemes.

```tsx
// Colors automatically adapt
<div className="bg-background text-foreground">
  This works in both light and dark mode
</div>
```

## Validation

Run design system validation to check for common issues:
```bash
npm run validate:design
```

The validator checks for:
- Direct color usage (should use semantic tokens)
- Extreme text sizes (text-6xl and above)
- Consistency with design patterns

## Migration from Old System

If you're updating components from the old restrictive system:

1. **Text sizes**: Replace `text-size-1` → `text-2xl`, `text-size-2` → `text-lg`, etc.
2. **Heights**: Update forced h-8, h-12 to standard h-9, h-10, h-11
3. **Spacing**: Use natural Tailwind spacing instead of forced 8pt grid
4. **Icons**: Adjust oversized h-6 w-6 icons back to h-4 w-4 where appropriate

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- Component examples throughout the codebase