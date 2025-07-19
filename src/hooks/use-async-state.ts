'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

interface AsyncState<T> {
  data: T | undefined;
  loading: boolean;
  error: Error | null;
}

interface UseAsyncStateOptions {
  immediate?: boolean;
  onSuccess?: (data: unknown) => void;
  onError?: (error: Error) => void;
}

/**
 * Hook for managing asynchronous state with loading, error, and data states.
 * Provides manual execution control and automatic cleanup on unmount.
 * 
 * @template T - The type of data returned by the async function
 * @param asyncFunction - The async function to execute
 * @param options - Configuration options
 * @param options.immediate - Whether to execute immediately on mount (default: true)
 * @param options.onSuccess - Callback fired when the async operation succeeds
 * @param options.onError - Callback fired when the async operation fails
 * @returns Object containing state (data, loading, error) and control functions (execute, reset)
 * 
 * @example
 * ```tsx
 * const { data, loading, error, execute, reset } = useAsyncState(
 *   async () => {
 *     const response = await fetch('/api/data');
 *     return response.json();
 *   },
 *   {
 *     immediate: false,
 *     onSuccess: (data) => console.log('Data loaded:', data),
 *     onError: (error) => console.error('Failed to load:', error)
 *   }
 * );
 * ```
 */
export function useAsyncState<T>(
  asyncFunction: () => Promise<T>,
  options: UseAsyncStateOptions = {}
): AsyncState<T> & { execute: () => Promise<void>; reset: () => void } {
  const { immediate = true, onSuccess, onError } = options;
  
  const [state, setState] = useState<AsyncState<T>>({
    data: undefined,
    loading: false,
    error: null,
  });

  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const execute = useCallback(async () => {
    setState({ data: undefined, loading: true, error: null });

    try {
      const result = await asyncFunction();
      
      if (mountedRef.current) {
        setState({ data: result, loading: false, error: null });
        onSuccess?.(result);
      }
    } catch (error) {
      if (mountedRef.current) {
        const err = error as Error;
        setState({ data: undefined, loading: false, error: err });
        onError?.(err);
      }
    }
  }, [asyncFunction, onSuccess, onError]);

  const reset = useCallback(() => {
    setState({ data: undefined, loading: false, error: null });
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  return {
    ...state,
    execute,
    reset,
  };
}

/**
 * Hook for managing asynchronous effects that re-execute when dependencies change.
 * Similar to useEffect but designed for async operations with proper cleanup.
 * 
 * @template T - The type of data returned by the async function
 * @param asyncFunction - The async function to execute
 * @param deps - Dependency array that triggers re-execution when values change
 * @param options - Configuration options
 * @param options.onSuccess - Callback fired when the async operation succeeds
 * @param options.onError - Callback fired when the async operation fails
 * @returns Object containing current state (data, loading, error)
 * 
 * @example
 * ```tsx
 * const { data, loading, error } = useAsyncEffect(
 *   async () => {
 *     const response = await fetch(`/api/user/${userId}`);
 *     return response.json();
 *   },
 *   [userId], // Re-fetch when userId changes
 *   {
 *     onSuccess: (user) => console.log('User loaded:', user)
 *   }
 * );
 * ```
 */
export function useAsyncEffect<T>(
  asyncFunction: () => Promise<T>,
  deps: React.DependencyList,
  options: UseAsyncStateOptions = {}
): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({
    data: undefined,
    loading: false,
    error: null,
  });

  const { onSuccess, onError } = options;
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const execute = async () => {
      setState({ data: undefined, loading: true, error: null });

      try {
        const result = await asyncFunction();
        
        if (!cancelled && mountedRef.current) {
          setState({ data: result, loading: false, error: null });
          onSuccess?.(result);
        }
      } catch (error) {
        if (!cancelled && mountedRef.current) {
          const err = error as Error;
          setState({ data: undefined, loading: false, error: err });
          onError?.(err);
        }
      }
    };

    execute();

    return () => {
      cancelled = true;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}