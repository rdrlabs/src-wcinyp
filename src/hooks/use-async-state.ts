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

// Version with dependencies for re-execution
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