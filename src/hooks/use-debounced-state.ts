'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * Hook that provides a debounced version of state.
 * Updates to the state are delayed by the specified duration.
 * 
 * @template T - The type of the state value
 * @param initialValue - The initial state value
 * @param delay - Debounce delay in milliseconds (default: 500ms)
 * @returns Tuple of [currentValue, debouncedValue, setValue]
 * 
 * @example
 * ```tsx
 * const [search, debouncedSearch, setSearch] = useDebouncedState('', 300);
 * 
 * // search updates immediately, debouncedSearch updates after 300ms
 * <input value={search} onChange={(e) => setSearch(e.target.value)} />
 * ```
 */
export function useDebouncedState<T>(
  initialValue: T,
  delay: number = 500
): [T, T, (value: T) => void] {
  const [value, setValue] = useState<T>(initialValue);
  const [debouncedValue, setDebouncedValue] = useState<T>(initialValue);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return [value, debouncedValue, setValue];
}

/**
 * Hook that returns a debounced version of a callback function.
 * Multiple calls within the delay period will cancel previous calls.
 * 
 * @template T - The type of the callback function
 * @param callback - The function to debounce
 * @param delay - Debounce delay in milliseconds (default: 500ms)
 * @returns Debounced version of the callback
 * 
 * @example
 * ```tsx
 * const debouncedSave = useDebouncedCallback(
 *   async (value: string) => {
 *     await saveToDatabase(value);
 *   },
 *   1000
 * );
 * 
 * // Only saves after 1 second of no typing
 * <input onChange={(e) => debouncedSave(e.target.value)} />
 * ```
 */
export function useDebouncedCallback<T extends (...args: never[]) => unknown>(
  callback: T,
  delay: number = 500
): T {
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      const newTimeoutId = setTimeout(() => {
        callback(...args);
      }, delay);

      setTimeoutId(newTimeoutId);
    },
    [callback, delay, timeoutId]
  ) as T;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  return debouncedCallback;
}

/**
 * Hook that provides a debounced value with a loading/debouncing state indicator.
 * Useful when you need to show feedback that a value is being debounced.
 * 
 * @template T - The type of the value to debounce
 * @param value - The value to debounce
 * @param delay - Debounce delay in milliseconds (default: 500ms)
 * @returns Object with debounced value and debouncing state
 * 
 * @example
 * ```tsx
 * const { value: debouncedQuery, debouncing } = useDebouncedValue(searchQuery, 300);
 * 
 * return (
 *   <div>
 *     {debouncing && <Spinner />}
 *     <SearchResults query={debouncedQuery} />
 *   </div>
 * );
 * ```
 */
export function useDebouncedValue<T>(
  value: T,
  delay: number = 500
): { value: T; debouncing: boolean } {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const [debouncing, setDebouncing] = useState(false);

  useEffect(() => {
    setDebouncing(true);

    const handler = setTimeout(() => {
      setDebouncedValue(value);
      setDebouncing(false);
    }, delay);

    return () => {
      clearTimeout(handler);
      setDebouncing(false);
    };
  }, [value, delay]);

  return { value: debouncedValue, debouncing };
}