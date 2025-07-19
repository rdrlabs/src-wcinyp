'use client';

import { useState, useEffect, useCallback } from 'react';
import { logger } from '@/lib/logger-v2';

type SetValue<T> = (value: T | ((prev: T) => T)) => void;

/**
 * Hook for syncing state with localStorage, with SSR support and cross-tab synchronization.
 * Includes error handling and custom serialization options.
 * 
 * @template T - The type of value to store
 * @param key - The localStorage key
 * @param initialValue - The initial value if nothing is in localStorage
 * @param options - Configuration options
 * @param options.serialize - Custom serialization function (default: JSON.stringify)
 * @param options.deserialize - Custom deserialization function (default: JSON.parse)
 * @returns Tuple of [storedValue, setValue, removeValue]
 * 
 * @example
 * ```tsx
 * // Basic usage
 * const [user, setUser, removeUser] = useLocalStorage('user', null);
 * 
 * // With custom serialization
 * const [settings, setSettings] = useLocalStorage(
 *   'settings',
 *   { theme: 'dark', fontSize: 16 },
 *   {
 *     serialize: (value) => btoa(JSON.stringify(value)),
 *     deserialize: (value) => JSON.parse(atob(value))
 *   }
 * );
 * 
 * // Update value
 * setSettings({ ...settings, theme: 'light' });
 * 
 * // Remove from storage
 * removeUser();
 * ```
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options?: {
    serialize?: (value: T) => string;
    deserialize?: (value: string) => T;
  }
): [T, SetValue<T>, () => void] {
  const serialize = options?.serialize || JSON.stringify;
  const deserialize = options?.deserialize || JSON.parse;

  // Get from local storage then parse stored json or return initialValue
  const readValue = useCallback((): T => {
    // Prevent build error "window is undefined" but keep functionality
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? deserialize(item) : initialValue;
    } catch (error) {
      logger.warn(`Error reading localStorage key "${key}"`, { key, error });
      return initialValue;
    }
  }, [initialValue, key, deserialize]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue: SetValue<T> = useCallback((value) => {
    // Prevent build error "window is undefined" but keep functionality
    if (typeof window === 'undefined') {
      logger.warn(`Tried setting localStorage key "${key}" during SSG. Ignoring.`, { key });
      return;
    }

    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;

      // Save to local storage
      window.localStorage.setItem(key, serialize(valueToStore));

      // Save state
      setStoredValue(valueToStore);

      // We dispatch a custom event so every useLocalStorage hook are notified
      window.dispatchEvent(new Event('local-storage'));
    } catch (error) {
      logger.warn(`Error setting localStorage key "${key}"`, { key, error });
    }
  }, [key, serialize, storedValue]);

  // Remove from storage
  const removeValue = useCallback(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
      window.dispatchEvent(new Event('local-storage'));
    } catch (error) {
      logger.warn(`Error removing localStorage key "${key}"`, { key, error });
    }
  }, [key, initialValue]);

  useEffect(() => {
    setStoredValue(readValue());
  }, [readValue]);

  useEffect(() => {
    const handleStorageChange = () => {
      setStoredValue(readValue());
    };

    // This only works for other documents, not the current one
    window.addEventListener('storage', handleStorageChange);

    // This is a custom event, triggered in setValue and removeValue
    window.addEventListener('local-storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('local-storage', handleStorageChange);
    };
  }, [readValue]);

  return [storedValue, setValue, removeValue];
}