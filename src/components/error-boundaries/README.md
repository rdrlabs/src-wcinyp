# Error Boundaries Documentation

This directory contains comprehensive error boundary components for the application. These components help catch and handle errors gracefully, providing users with helpful recovery options.

## Components

### BaseErrorBoundary
The base error boundary component that provides common error handling functionality:
- Catches errors and displays user-friendly messages
- Logs errors using the logger service
- Shows detailed error information in development mode
- Provides common recovery actions (reset, reload, go home)

### FormBuilderErrorBoundary
Specialized error boundary for form components:
- Handles form-related errors
- Provides form-specific recovery options (save draft, reset form)
- Preserves user input when possible

### DataTableErrorBoundary
Error boundary for data table components:
- Handles table loading and rendering errors
- Provides table-specific recovery options (refresh data, reset filters, export data)
- Maintains table state when possible

### DocumentViewerErrorBoundary
Error boundary for document viewing components:
- Handles document loading and rendering errors
- Provides document-specific recovery options (reload, download, open external)
- Supports fallback document viewing options

### ProviderDirectoryErrorBoundary
Error boundary for provider directory components:
- Handles provider data loading errors
- Provides directory-specific recovery options (refresh, reset search, add provider)
- Maintains search state when possible

## Usage Examples

### Basic Usage
```tsx
import { BaseErrorBoundary } from '@/components/error-boundaries';

function MyComponent() {
  return (
    <BaseErrorBoundary
      fallbackTitle="Component Error"
      fallbackMessage="Something went wrong with this component."
      logContext="MyComponent"
    >
      <YourComponentContent />
    </BaseErrorBoundary>
  );
}
```

### Form Component with Error Boundary
```tsx
import { FormBuilderErrorBoundary } from '@/components/error-boundaries';

function MyForm() {
  const handleResetForm = () => {
    // Reset form logic
  };

  const handleSaveDraft = () => {
    // Save draft logic
  };

  return (
    <FormBuilderErrorBoundary
      onResetForm={handleResetForm}
      onSaveDraft={handleSaveDraft}
      formName="Patient Registration Form"
    >
      <FormContent />
    </FormBuilderErrorBoundary>
  );
}
```

### Data Table with Error Boundary
```tsx
import { DataTable } from '@/components/ui/data-table';

function MyTable() {
  const handleRefreshData = async () => {
    // Refresh data logic
  };

  const handleResetFilters = () => {
    // Reset filters logic
  };

  return (
    <DataTable
      columns={columns}
      data={data}
      onRefreshData={handleRefreshData}
      onResetFilters={handleResetFilters}
      tableName="Patient Records"
    />
  );
}
```

## Best Practices

1. **Always provide recovery options**: Give users meaningful ways to recover from errors
2. **Log errors appropriately**: Use the logger service to capture error details
3. **Show helpful messages**: Provide context-specific error messages
4. **Preserve user data**: When possible, save user input before errors occur
5. **Test error scenarios**: Ensure error boundaries work correctly in different failure modes

## Testing Error Boundaries

To test error boundaries in development:

```tsx
// Throw an error to test the boundary
function TestError() {
  throw new Error('Test error for error boundary');
}

// Use in component
<FormBuilderErrorBoundary>
  <TestError />
</FormBuilderErrorBoundary>
```

## Notes

- Error boundaries only catch errors in the component tree below them
- They don't catch errors in event handlers (use try-catch for those)
- They don't catch errors in async code (use error handling in async functions)
- They don't catch errors during server-side rendering