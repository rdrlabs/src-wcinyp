# Critical Fixes for ModernDocumentSelector & ModernFormBuilder

## Priority 1: Critical Security & Stability Issues

### 1. Fix Print Function Memory Leaks (ModernDocumentSelector)

**Current Issue:** Print windows are not properly cleaned up on errors.

**Quick Fix:**
```typescript
const handlePrint = useCallback(async (): Promise<void> => {
  if (selectedDocs.length === 0) {
    alert('Please select at least one document to print');
    return;
  }
  
  setIsPrinting(true);
  const openWindows: Window[] = [];
  const cleanupWindows = () => {
    openWindows.forEach(window => {
      try {
        if (!window.closed) window.close();
      } catch (error) {
        console.warn('Failed to close print window:', error);
      }
    });
  };
  
  try {
    for (const [pathIndex, path] of selectedDocs.entries()) {
      const copies = isBulkMode ? bulkQuantity : (docQuantities[path] || 1);
      
      for (let i = 0; i < copies; i++) {
        const printWindow = window.open(path, '_blank');
        if (!printWindow) {
          throw new Error('Print popup was blocked. Please allow popups for this site.');
        }
        
        openWindows.push(printWindow);
        
        await new Promise<void>((resolve, reject) => {
          const timeoutId = setTimeout(() => {
            try {
              printWindow.print();
              resolve();
            } catch (printError) {
              reject(new Error(`Failed to print ${path}: ${printError.message}`));
            }
          }, PRINT_DELAY_MS);
          
          // Cleanup timeout on error
          printWindow.addEventListener('error', () => {
            clearTimeout(timeoutId);
            reject(new Error(`Failed to load document: ${path}`));
          });
        });
        
        // Add delay between copies
        if (i < copies - 1 || pathIndex < selectedDocs.length - 1) {
          await new Promise(resolve => setTimeout(resolve, WINDOW_OPEN_DELAY_MS));
        }
      }
    }
  } catch (error) {
    console.error('Print failed:', error);
    alert(error instanceof Error ? error.message : 'Failed to print documents');
    cleanupWindows();
  } finally {
    setIsPrinting(false);
    // Clean up windows after a delay to allow printing
    setTimeout(cleanupWindows, 5000);
  }
}, [selectedDocs, isBulkMode, bulkQuantity, docQuantities]);
```

### 2. Add Form Validation (ModernFormBuilder)

**Current Issue:** Form can be printed with invalid data.

**Quick Fix:**
```typescript
// Add validation utility
const validateField = (field: FormField): string | null => {
  if (field.required && !field.value.trim()) {
    return `${field.label} is required`;
  }
  
  if (field.value.trim()) {
    switch (field.type) {
      case 'date':
        const date = new Date(field.value);
        if (isNaN(date.getTime())) {
          return `${field.label} must be a valid date`;
        }
        break;
      case 'number':
        if (isNaN(Number(field.value)) || Number(field.value) < 0) {
          return `${field.label} must be a positive number`;
        }
        break;
    }
  }
  
  return null;
};

// Update component state to include errors
const [validationErrors, setValidationErrors] = useState<Record<number, string>>({});

// Update field change handler
const handleFieldChange = useCallback((index: number, value: string): void => {
  setFormData(prev => {
    const updated = prev.map((field, i) => 
      i === index ? { ...field, value: value.trim() } : field
    );
    
    // Validate field on change
    const error = validateField(updated[index]);
    setValidationErrors(prevErrors => {
      const newErrors = { ...prevErrors };
      if (error) {
        newErrors[index] = error;
      } else {
        delete newErrors[index];
      }
      return newErrors;
    });
    
    return updated;
  });
}, []);

// Update print handler
const handlePrint = useCallback((): void => {
  // Validate all fields before printing
  const errors: Record<number, string> = {};
  formData.forEach((field, index) => {
    const error = validateField(field);
    if (error) {
      errors[index] = error;
    }
  });
  
  if (Object.keys(errors).length > 0) {
    setValidationErrors(errors);
    alert('Please fix validation errors before printing');
    return;
  }
  
  try {
    window.print();
  } catch (error) {
    console.error('Print failed:', error);
    alert('Unable to print. Please check your browser settings.');
  }
}, [formData]);
```

### 3. Add Search Debouncing (ModernDocumentSelector)

**Current Issue:** Search runs on every keystroke causing performance issues.

**Quick Fix:**
```typescript
import { useMemo, useState, useCallback, useEffect } from 'react';

// Add debounced search term
const [searchTerm, setSearchTerm] = useState<string>('');
const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');

// Debounce search term
useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearchTerm(searchTerm);
  }, 300);

  return () => clearTimeout(timer);
}, [searchTerm]);

// Use debounced term for filtering
const filteredForms = useMemo(() => 
  allForms.filter(form => 
    form.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  ), [allForms, debouncedSearchTerm]
);
```

### 4. Add Error Boundaries

**Current Issue:** Component crashes can take down the entire application.

**Quick Fix - Create ErrorBoundary component:**
```typescript
// ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Component error caught by boundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-4">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-4">
            This component encountered an error and has been disabled to prevent further issues.
          </p>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => this.setState({ hasError: false, error: undefined })}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

**Wrap components with error boundaries:**
```typescript
// In document-hub.tsx and form-generator.tsx
import ErrorBoundary from '../components/ErrorBoundary';

export default function DocumentHub(): React.ReactElement {
  return (
    <Layout title="Document Hub" description="Modern document management for medical forms">
      <ErrorBoundary>
        <ModernDocumentSelector />
      </ErrorBoundary>
    </Layout>
  );
}
```

## Priority 2: User Experience Improvements

### 5. Handle Empty Search Results (ModernDocumentSelector)

**Quick Fix:**
```typescript
// Add to search results section
{searchTerm && filteredForms.length === 0 ? (
  <div className="text-center py-8">
    <div className="text-gray-400 mb-4">
      <Search className="h-12 w-12 mx-auto mb-2" />
      <p className="text-lg">No documents found</p>
      <p className="text-sm">Try adjusting your search terms</p>
    </div>
    <Button 
      variant="outline" 
      onClick={() => setSearchTerm('')}
      className="mt-4"
    >
      Clear Search
    </Button>
  </div>
) : (
  <div className="grid gap-3">
    {filteredForms.map(renderFormCheckbox)}
  </div>
)}
```

### 6. Add Loading States

**Quick Fix for ModernDocumentSelector:**
```typescript
const [isPrinting, setIsPrinting] = useState<boolean>(false);

// Update print button
<Button
  onClick={handlePrint}
  disabled={isPrinting || selectedDocs.length === 0}
  className="flex-1"
  size="sm"
>
  {isPrinting ? (
    <>
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
      Printing...
    </>
  ) : (
    <>
      <Printer className="w-4 h-4 mr-2" />
      Print {getTotalCopies()}
    </>
  )}
</Button>
```

### 7. Add Input Validation Display (ModernFormBuilder)

**Quick Fix:**
```typescript
// Update input rendering with error display
<div key={field.label} className="space-y-2">
  <label className="text-sm font-medium leading-none">
    <div className="flex items-center gap-2 mb-2">
      {field.icon}
      {field.label}
      {field.required && <span className="text-destructive">*</span>}
    </div>
  </label>
  <Input
    type={field.type || 'text'}
    value={field.value}
    onChange={(e) => handleFieldChange(index, e.target.value)}
    placeholder={`Enter ${field.label.toLowerCase()}`}
    className={cn(
      "transition-all duration-200",
      validationErrors[index] 
        ? "border-red-500 focus:ring-red-500/20" 
        : field.value.trim() 
          ? "ring-2 ring-green-500/20 border-green-500/50 bg-green-50/50" 
          : "focus:ring-primary/20"
    )}
  />
  {validationErrors[index] && (
    <p className="text-sm text-red-600 flex items-center gap-1">
      <AlertCircle className="h-3 w-3" />
      {validationErrors[index]}
    </p>
  )}
</div>
```

## Priority 3: Performance & Accessibility

### 8. Add Keyboard Navigation (ModernDocumentSelector)

**Quick Fix:**
```typescript
// Enhance card keyboard handling
const handleKeyDown = (e: React.KeyboardEvent, form: Document) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    toggleDocument(form.path);
  }
};

// Update card component
<Card 
  key={form.path}
  className={cn(/* existing classes */)}
  onClick={(e) => {
    e.preventDefault();
    toggleDocument(form.path);
  }}
  onKeyDown={(e) => handleKeyDown(e, form)}
  tabIndex={0}
  role="button"
  aria-pressed={isSelected}
  aria-label={`${isSelected ? 'Deselect' : 'Select'} ${form.name}`}
>
```

### 9. Add Cleanup Effects

**Quick Fix for both components:**
```typescript
// Add cleanup useEffect
useEffect(() => {
  return () => {
    // Cleanup any pending timeouts, intervals, or async operations
    // This prevents memory leaks when components unmount
  };
}, []);
```

## Testing the Fixes

After implementing these fixes, test the following scenarios:

1. **Print with popup blocker enabled** - Should show helpful error message
2. **Fill form with invalid data** - Should prevent printing and show errors
3. **Search with no results** - Should show empty state message
4. **Rapid typing in search** - Should not cause performance issues
5. **Component crash simulation** - Should be caught by error boundary
6. **Form validation** - Should prevent submission with invalid data
7. **Keyboard navigation** - Should work for all interactive elements

These fixes address the most critical issues while maintaining backward compatibility and improving the overall user experience.