'use client'

import { Suspense, type ReactNode, type ComponentType } from 'react'
import { ErrorBoundary } from './error-boundary'
import { 
  Skeleton, 
  CardSkeleton, 
  TableSkeleton, 
  ListSkeleton,
  FormSkeleton,
  ChartSkeleton,
  ProfileSkeleton,
  NavigationSkeleton,
  StatsSkeleton,
  GallerySkeleton,
  CommentSkeleton
} from './loading-skeletons'

export interface LoadingBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  errorFallback?: (error: Error, reset: () => void) => ReactNode
  loadingType?: 'skeleton' | 'card' | 'table' | 'list' | 'form' | 'chart' | 'profile' | 'navigation' | 'stats' | 'gallery' | 'comment' | 'custom'
  loadingProps?: Record<string, any>
  showError?: boolean
  isolate?: boolean
}

// Default loading components for each type
const loadingComponents: Record<string, ComponentType<any>> = {
  skeleton: Skeleton,
  card: CardSkeleton,
  table: TableSkeleton,
  list: ListSkeleton,
  form: FormSkeleton,
  chart: ChartSkeleton,
  profile: ProfileSkeleton,
  navigation: NavigationSkeleton,
  stats: StatsSkeleton,
  gallery: GallerySkeleton,
  comment: CommentSkeleton,
}

export function LoadingBoundary({
  children,
  fallback,
  errorFallback,
  loadingType = 'skeleton',
  loadingProps = {},
  showError = true,
  isolate = false,
}: LoadingBoundaryProps) {
  // Determine loading component
  const loadingFallback = fallback || (
    loadingType === 'custom' ? (
      <div className="flex items-center justify-center p-8">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    ) : (
      (() => {
        const LoadingComponent = loadingComponents[loadingType]
        return LoadingComponent ? <LoadingComponent {...loadingProps} /> : <Skeleton className="h-32 w-full" />
      })()
    )
  )

  return (
    <ErrorBoundary
      level="component"
      isolate={isolate}
      fallback={showError ? errorFallback : undefined}
    >
      <Suspense fallback={loadingFallback}>
        {children}
      </Suspense>
    </ErrorBoundary>
  )
}

// HOC to wrap async components with loading boundary
export function withLoadingBoundary<P extends object>(
  Component: ComponentType<P>,
  options: Omit<LoadingBoundaryProps, 'children'> = {}
) {
  const WrappedComponent = (props: P) => (
    <LoadingBoundary {...options}>
      <Component {...props} />
    </LoadingBoundary>
  )
  
  WrappedComponent.displayName = `withLoadingBoundary(${Component.displayName || Component.name || 'Component'})`
  
  return WrappedComponent
}

// Specialized loading boundaries for common patterns
export function DataLoadingBoundary({ children, ...props }: Omit<LoadingBoundaryProps, 'loadingType'>) {
  return <LoadingBoundary loadingType="table" {...props}>{children}</LoadingBoundary>
}

export function CardLoadingBoundary({ children, count = 3, ...props }: Omit<LoadingBoundaryProps, 'loadingType'> & { count?: number }) {
  return <LoadingBoundary loadingType="card" loadingProps={{ count }} {...props}>{children}</LoadingBoundary>
}

export function ListLoadingBoundary({ children, items = 5, ...props }: Omit<LoadingBoundaryProps, 'loadingType'> & { items?: number }) {
  return <LoadingBoundary loadingType="list" loadingProps={{ items }} {...props}>{children}</LoadingBoundary>
}

export function FormLoadingBoundary({ children, fields = 4, ...props }: Omit<LoadingBoundaryProps, 'loadingType'> & { fields?: number }) {
  return <LoadingBoundary loadingType="form" loadingProps={{ fields }} {...props}>{children}</LoadingBoundary>
}

export function ChartLoadingBoundary({ children, height = 300, ...props }: Omit<LoadingBoundaryProps, 'loadingType'> & { height?: number }) {
  return <LoadingBoundary loadingType="chart" loadingProps={{ height }} {...props}>{children}</LoadingBoundary>
}

// Utility for creating async components with built-in loading
export function createAsyncComponent<P extends object>(
  loader: () => Promise<{ default: ComponentType<P> }>,
  options: Omit<LoadingBoundaryProps, 'children'> = {}
) {
  const AsyncComponent = async (props: P) => {
    const Component = (await loader()).default
    return <Component {...props} />
  }
  
  const WrappedAsyncComponent = (props: P) => (
    <LoadingBoundary {...options}>
      <AsyncComponent {...props} />
    </LoadingBoundary>
  )
  
  WrappedAsyncComponent.displayName = 'AsyncComponentWithLoadingBoundary'
  
  return WrappedAsyncComponent
}