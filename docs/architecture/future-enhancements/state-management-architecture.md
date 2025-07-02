# State Management Architecture - Future Enhancement

## Current State Management Issues

### Problem: Manual Data Fetching Everywhere

```typescript
// Current approach in providers.tsx
import providersData from '../data/providers.json';

export default function Providers(): React.ReactElement {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  const providers: Provider[] = providersData.providers as Provider[];
  
  // Manual filtering logic on every render
  const filteredProviders = useMemo(() => {
    let filtered = providers;
    // Complex filtering logic...
    return filtered;
  }, [providers, searchTerm, activeFilters]);
```

**Issues**:
- No loading states
- No error handling for data fetching
- No caching strategy
- No background refetching
- Manual state management everywhere

### Problem: Scattered Loading States

```typescript
// Pattern repeated in multiple components
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [data, setData] = useState([]);

useEffect(() => {
  fetchData()
    .then(result => {
      setData(result);
      setLoading(false);
    })
    .catch(err => {
      setError(err);
      setLoading(false);
    });
}, []);
```

## Recommended Solution: TanStack Query + Zustand

### Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   TanStack      │    │     Zustand     │    │   Component     │
│   Query         │    │   (Client       │    │   Local State   │
│   (Server       │◄──►│    State)       │◄──►│   (UI State)    │
│    State)       │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Implementation Plan

#### 1. TanStack Query for Server State

```typescript
// api/providers.ts
export async function fetchProviders(): Promise<Provider[]> {
  const response = await fetch('/api/providers');
  if (!response.ok) {
    throw new Error('Failed to fetch providers');
  }
  return response.json();
}

// hooks/useProviders.ts
import { useQuery } from '@tanstack/react-query';

export function useProviders() {
  return useQuery({
    queryKey: ['providers'],
    queryFn: fetchProviders,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: true,
    retry: (failureCount, error) => {
      // Don't retry on 404
      if (error.status === 404) return false;
      return failureCount < 3;
    },
  });
}

// Enhanced with optimistic updates
export function useUpdateProvider() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateProvider,
    onMutate: async (newProvider) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['providers'] });
      
      // Snapshot previous value
      const previousProviders = queryClient.getQueryData(['providers']);
      
      // Optimistically update
      queryClient.setQueryData(['providers'], (old: Provider[]) => 
        old.map(p => p.id === newProvider.id ? { ...p, ...newProvider } : p)
      );
      
      return { previousProviders };
    },
    onError: (err, newProvider, context) => {
      // Rollback on error
      queryClient.setQueryData(['providers'], context?.previousProviders);
    },
    onSettled: () => {
      // Refetch after mutation
      queryClient.invalidateQueries({ queryKey: ['providers'] });
    },
  });
}
```

#### 2. Zustand for Client State

```typescript
// stores/uiStore.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface UIState {
  // Search & Filter State
  searchTerm: string;
  activeFilters: string[];
  sortBy: 'name' | 'specialty' | 'department';
  sortOrder: 'asc' | 'desc';
  
  // UI State
  sidebarOpen: boolean;
  theme: 'light' | 'dark' | 'system';
  viewMode: 'grid' | 'list';
  
  // Actions
  setSearchTerm: (term: string) => void;
  toggleFilter: (filter: string) => void;
  clearFilters: () => void;
  setSorting: (by: string, order: 'asc' | 'desc') => void;
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setViewMode: (mode: 'grid' | 'list') => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        searchTerm: '',
        activeFilters: [],
        sortBy: 'name',
        sortOrder: 'asc',
        sidebarOpen: false,
        theme: 'system',
        viewMode: 'grid',
        
        // Actions
        setSearchTerm: (term) => set({ searchTerm: term }),
        
        toggleFilter: (filter) => set((state) => ({
          activeFilters: state.activeFilters.includes(filter)
            ? state.activeFilters.filter(f => f !== filter)
            : [...state.activeFilters, filter]
        })),
        
        clearFilters: () => set({ activeFilters: [] }),
        
        setSorting: (by, order) => set({ sortBy: by, sortOrder: order }),
        
        toggleSidebar: () => set((state) => ({ 
          sidebarOpen: !state.sidebarOpen 
        })),
        
        setTheme: (theme) => set({ theme }),
        setViewMode: (mode) => set({ viewMode: mode }),
      }),
      {
        name: 'ui-store',
        partialize: (state) => ({
          theme: state.theme,
          viewMode: state.viewMode,
          // Don't persist search/filters
        }),
      }
    ),
    {
      name: 'ui-store',
    }
  )
);
```

#### 3. Refactored Providers Component

```typescript
// pages/providers.tsx
import { useProviders } from '@/hooks/useProviders';
import { useUIStore } from '@/stores/uiStore';

export default function Providers(): React.ReactElement {
  // Server state (data)
  const { data: providers = [], isLoading, error } = useProviders();
  
  // Client state (UI)
  const {
    searchTerm,
    activeFilters,
    sortBy,
    sortOrder,
    viewMode,
    setSearchTerm,
    toggleFilter,
    setSorting,
    setViewMode,
  } = useUIStore();

  // Derived state (computed)
  const filteredProviders = useMemo(() => {
    return applyFiltersAndSort(providers, {
      searchTerm,
      activeFilters,
      sortBy,
      sortOrder,
    });
  }, [providers, searchTerm, activeFilters, sortBy, sortOrder]);

  if (isLoading) return <ProvidersLoadingSkeleton />;
  if (error) return <ProvidersErrorState error={error} />;

  return (
    <Layout title="Provider Database">
      <PageErrorBoundary>
        <div className="min-h-screen bg-background">
          {/* Search and filters */}
          <ProvidersHeader
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            activeFilters={activeFilters}
            onToggleFilter={toggleFilter}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
          
          {/* Results */}
          <ProvidersGrid 
            providers={filteredProviders}
            viewMode={viewMode}
          />
        </div>
      </PageErrorBoundary>
    </Layout>
  );
}
```

### Benefits of This Architecture

#### 1. Automatic Loading States
```typescript
// Before: Manual loading management
const [loading, setLoading] = useState(true);

// After: Automatic from TanStack Query
const { isLoading, isFetching, isError } = useProviders();
```

#### 2. Smart Caching
```typescript
// Automatic background refetching
// Stale-while-revalidate pattern
// Intelligent cache invalidation
// Optimistic updates
```

#### 3. Error Recovery
```typescript
// Automatic retries with exponential backoff
// Error boundaries integration
// Graceful degradation
```

#### 4. Developer Experience
```typescript
// Redux DevTools integration
// Time-travel debugging
// State persistence
// Hot reloading support
```

### Migration Path

#### Phase 1: Setup Infrastructure
```bash
npm install @tanstack/react-query zustand
```

#### Phase 2: Convert Server State
1. Create API functions
2. Add React Query provider
3. Replace direct imports with useQuery hooks
4. Add loading/error states

#### Phase 3: Convert Client State
1. Create Zustand stores
2. Move UI state from components
3. Add persistence for user preferences
4. Connect to Redux DevTools

#### Phase 4: Optimize
1. Add optimistic updates
2. Implement background sync
3. Add offline support
4. Performance monitoring

### Code Organization

```
src/
├── api/
│   ├── providers.ts      # API functions
│   ├── documents.ts
│   └── index.ts
├── hooks/
│   ├── useProviders.ts   # TanStack Query hooks
│   ├── useDocuments.ts
│   └── index.ts
├── stores/
│   ├── uiStore.ts        # Zustand stores
│   ├── userStore.ts
│   └── index.ts
├── utils/
│   ├── queryClient.ts    # Query client config
│   └── filters.ts        # Filter/sort logic
```

## Related Enhancements

### 1. Form State Management
```typescript
// Future: React Hook Form + Zod validation
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const providerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  specialty: z.string().min(1, 'Specialty is required'),
  npi: z.string().regex(/^\d{10}$/, 'NPI must be 10 digits'),
});
```

### 2. Real-time Updates
```typescript
// Future: WebSocket integration
const { data: providers } = useQuery({
  queryKey: ['providers'],
  queryFn: fetchProviders,
  refetchInterval: 30000, // Poll every 30 seconds
});
```

### 3. Offline Support
```typescript
// Future: Background sync
const { mutate } = useMutation({
  mutationFn: updateProvider,
  onError: (error, variables) => {
    // Queue for background sync when online
    backgroundSync.queue('updateProvider', variables);
  },
});
```

---

**Priority**: Medium (current manual approach workable for demo)
**Effort**: 3-4 days
**Impact**: Significant developer experience and maintainability improvement