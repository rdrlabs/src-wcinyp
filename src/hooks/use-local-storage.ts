'use client';

import { useState, useEffect, useCallback } from 'react';
import { logger } from '@/lib/logger';

type SetValue<T> = (value: T | ((prev: T) => T)) => void;

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
      logger.warn(`Error reading localStorage key "${key}"`, error, 'useLocalStorage');
      return initialValue;
    }
  }, [initialValue, key, deserialize]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue: SetValue<T> = useCallback((value) => {
    // Prevent build error "window is undefined" but keep functionality
    if (typeof window === 'undefined') {
      logger.warn(`Tried setting localStorage key "${key}" during SSG. Ignoring.`, undefined, 'useLocalStorage');
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
      logger.warn(`Error setting localStorage key "${key}"`, error, 'useLocalStorage');
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
      logger.warn(`Error removing localStorage key "${key}"`, error, 'useLocalStorage');
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