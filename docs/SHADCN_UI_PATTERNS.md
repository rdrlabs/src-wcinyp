# shadcn/ui Usage Patterns Guide

## Table of Contents
- [Introduction](#introduction)
- [Component Usage Guidelines](#component-usage-guidelines)
- [Common Patterns](#common-patterns)
- [Code Examples](#code-examples)
- [Do's and Don'ts](#dos-and-donts)
- [Migration Guide](#migration-guide)

## Introduction

### What is shadcn/ui?
shadcn/ui is not a component library but a collection of beautifully designed, accessible, and customizable components that you can copy and paste into your apps. Built on top of Radix UI primitives and styled with Tailwind CSS.

### Why We Use shadcn/ui
- **Full Control**: Components live in our codebase, allowing complete customization
- **Type Safety**: Built with TypeScript for excellent developer experience
- **Accessibility**: Built on Radix UI primitives with ARIA compliance
- **Theme Integration**: Seamlessly works with our dual-theme system
- **Modern Stack**: Leverages React 19, Tailwind CSS v4, and latest patterns

### Benefits of Consistent Usage
- Predictable component behavior across the application
- Easier onboarding for new team members
- Reduced bugs from inconsistent implementations
- Better maintainability and refactoring capabilities

## Component Usage Guidelines

### Import Patterns
Always use consistent import paths from `@/components/ui/*`:

```tsx
// ✅ CORRECT - Use path aliases
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

// ❌ INCORRECT - Don't use relative paths
import { Button } from '../../../components/ui/button';
```

### Component Composition
Leverage compound components for complex UI:

```tsx
// ✅ GOOD - Using compound components
<Card>
  <CardHeader>
    <CardTitle>Provider Details</CardTitle>
    <CardDescription>Manage provider information</CardDescription>
  </CardHeader>
  <CardContent>
    <ProviderForm />
  </CardContent>
  <CardFooter>
    <Button>Save Changes</Button>
  </CardFooter>
</Card>

// ❌ AVOID - Building everything from scratch
<div className="border rounded-lg p-4">
  <h3>Provider Details</h3>
  <p>Manage provider information</p>
  <form>...</form>
  <button>Save Changes</button>
</div>
```

### Styling and Customization
Use the `cn()` utility for conditional styling:

```tsx
import { cn } from '@/lib/utils';

// ✅ CORRECT - Using cn() for conditional classes
<Button 
  className={cn(
    "w-full",
    isActive && "bg-primary",
    isDisabled && "opacity-50 cursor-not-allowed"
  )}
>
  Click Me
</Button>

// ❌ INCORRECT - String concatenation
<Button className={`w-full ${isActive ? 'bg-primary' : ''}`}>
  Click Me
</Button>
```

### Accessibility Considerations
Always ensure proper ARIA attributes and keyboard navigation:

```tsx
// ✅ GOOD - Accessible implementation
<Dialog>
  <DialogTrigger asChild>
    <Button aria-label="Open settings dialog">Settings</Button>
  </DialogTrigger>
  <DialogContent aria-describedby="dialog-description">
    <DialogHeader>
      <DialogTitle>Settings</DialogTitle>
      <DialogDescription id="dialog-description">
        Manage your application settings
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
```

## Common Patterns

### Data Tables with useDataTable Hook
Our custom `useDataTable` hook standardizes table implementations:

```tsx
// Example from src/app/directory/page.tsx
import { useDataTable } from '@/hooks/use-data-table';
import { DataTable } from '@/components/ui/data-table';

export default function DirectoryPage() {
  const { 
    filteredData, 
    searchQuery, 
    setSearchQuery,
    tableProps 
  } = useDataTable({
    data: contacts,
    columns: contactColumns,
    searchFields: ['name', 'email', 'department'],
    enableRowSelection: true,
    enableColumnVisibility: true,
    defaultPageSize: 10,
    onRowClick: (row) => handleContactClick(row),
  });

  return (
    <div>
      <Input
        placeholder="Search contacts..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="max-w-sm"
      />
      <DataTable {...tableProps} />
    </div>
  );
}
```

### Forms with React Hook Form
Integrate forms using our standardized patterns:

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
});

export function ContactForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormDescription>
                Enter the contact's full name
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
```

### Dialogs and Modals
State management pattern for dialogs:

```tsx
// ✅ GOOD - Controlled dialog with proper state
export function EditProviderDialog({ provider, onUpdate }: Props) {
  const [open, setOpen] = useState(false);
  
  const handleSubmit = async (data: ProviderData) => {
    await onUpdate(data);
    setOpen(false); // Close on success
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Provider</DialogTitle>
        </DialogHeader>
        <ProviderForm 
          provider={provider} 
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}
```

### Navigation Components
Using NavigationMenu for complex navigation:

```tsx
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export function MainNav() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Documents</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px]">
              <li>
                <NavigationMenuLink asChild>
                  <a href="/documents">
                    <div className="text-sm font-medium">All Documents</div>
                    <p className="text-sm text-muted-foreground">
                      Browse and manage documents
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
```

### Theme-Aware Components
Components that adapt to our theme system:

```tsx
// Using theme-aware styling
import { useTheme } from 'next-themes';

export function ThemedCard({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  
  return (
    <Card className={cn(
      "transition-colors duration-200",
      theme === 'dark' && "border-gray-800"
    )}>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
```

## Code Examples

### Complete Table Implementation
From `src/app/directory/page.tsx`:

```tsx
// Column definitions with sorting and actions
const contactColumns: ColumnDef<Contact>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <SortableHeader column={column} title="Name" />,
    cell: ({ row }) => (
      <ContactInfo
        name={row.getValue('name')}
        email={row.original.email}
        avatar={row.original.avatar}
      />
    ),
  },
  {
    accessorKey: 'department',
    header: ({ column }) => <SortableHeader column={column} title="Department" />,
    cell: ({ row }) => <StatusBadge status={row.getValue('department')} />,
  },
  {
    id: 'actions',
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => (
      <ActionsColumn
        row={row}
        actions={[
          { label: 'View Details', onClick: () => handleView(row.original) },
          { label: 'Edit', onClick: () => handleEdit(row.original) },
          { label: 'Delete', onClick: () => handleDelete(row.original), destructive: true },
        ]}
      />
    ),
  },
];
```

### Custom UI Components
Example of extending shadcn/ui components:

```tsx
// src/components/ui/table-columns.tsx
export function SortableHeader({ 
  column, 
  title 
}: { 
  column: Column<any>; 
  title: string;
}) {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="h-8 p-0 font-medium hover:bg-transparent"
    >
      {title}
      {column.getIsSorted() === "asc" ? (
        <ChevronUp className="ml-2 h-4 w-4" />
      ) : column.getIsSorted() === "desc" ? (
        <ChevronDown className="ml-2 h-4 w-4" />
      ) : (
        <ChevronsUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
      )}
    </Button>
  );
}
```

## Do's and Don'ts

### ✅ DO's
- **DO** use consistent import paths (`@/components/ui/*`)
- **DO** follow accessibility guidelines and include ARIA labels
- **DO** use the `cn()` utility for conditional styling
- **DO** leverage compound components for complex UI
- **DO** use TypeScript for type safety
- **DO** follow the existing theme system integration
- **DO** use semantic HTML elements when possible
- **DO** test components with keyboard navigation

### ❌ DON'Ts
- **DON'T** override core component styles directly in CSS files
- **DON'T** mix UI libraries (stick to shadcn/ui components)
- **DON'T** use string concatenation for className
- **DON'T** ignore TypeScript errors in component props
- **DON'T** create duplicate components when shadcn/ui provides them
- **DON'T** forget to handle loading and error states
- **DON'T** skip accessibility attributes
- **DON'T** use inline styles unless absolutely necessary

## Migration Guide

### Step 1: Identify Legacy Components
Look for components not using shadcn/ui patterns:
```tsx
// Legacy component example
<div className="custom-button" onClick={handleClick}>
  Click Me
</div>
```

### Step 2: Map to shadcn/ui Equivalents
Find the appropriate shadcn/ui component:
```tsx
// Migrated to shadcn/ui
<Button onClick={handleClick}>
  Click Me
</Button>
```

### Step 3: Update Imports
Change from relative to absolute imports:
```tsx
// Before
import Button from '../../../components/Button';

// After
import { Button } from '@/components/ui/button';
```

### Step 4: Apply Consistent Styling
Use Tailwind utilities and cn() helper:
```tsx
// Before
<button className="btn btn-primary custom-styles">

// After
<Button className={cn("w-full", isPrimary && "bg-primary")}>
```

### Step 5: Add Accessibility
Ensure proper ARIA attributes:
```tsx
// Enhanced with accessibility
<Button 
  onClick={handleClick}
  aria-label="Submit form"
  aria-busy={isLoading}
  disabled={isLoading}
>
  {isLoading ? <Spinner /> : 'Submit'}
</Button>
```

### Step 6: Test Thoroughly
- Verify keyboard navigation works
- Check screen reader compatibility
- Test in both light and dark themes
- Ensure responsive behavior on mobile

## Best Practices Summary

1. **Consistency is Key**: Use the same patterns throughout the application
2. **Accessibility First**: Always consider keyboard and screen reader users
3. **Type Safety**: Leverage TypeScript for better developer experience
4. **Performance**: Use React.memo and useMemo where appropriate
5. **Testing**: Write tests for custom component behaviors
6. **Documentation**: Comment complex component logic
7. **Reusability**: Extract common patterns into shared components

## Resources
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Radix UI Primitives](https://www.radix-ui.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Tanstack Table](https://tanstack.com/table/latest)

---

*Last updated: January 2025*