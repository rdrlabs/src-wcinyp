'use client';

import { useState, useMemo, useCallback } from 'react';

export interface UseSearchOptions {
  searchableFields?: string[];
  minSearchLength?: number;
  debounceMs?: number;
}

export function useSearch<T>(
  data: T[],
  options: UseSearchOptions = {}
) {
  const {
    searchableFields = [],
    minSearchLength = 0,
    debounceMs = 0
  } = options;

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce logic
  useState(() => {
    if (debounceMs > 0) {
      const timer = setTimeout(() => {
        setDebouncedQuery(searchQuery);
      }, debounceMs);
      return () => clearTimeout(timer);
    } else {
      setDebouncedQuery(searchQuery);
    }
  });

  const query = debounceMs > 0 ? debouncedQuery : searchQuery;

  const filteredData = useMemo(() => {
    if (!query || query.length < minSearchLength) {
      return data;
    }

    const lowerQuery = query.toLowerCase();

    return data.filter(item => {
      if (searchableFields.length === 0) {
        // Search all string fields if no specific fields provided
        return Object.values(item as Record<string, unknown>).some(value => {
          if (typeof value === 'string') {
            return value.toLowerCase().includes(lowerQuery);
          }
          return false;
        });
      }

      // Search only specified fields
      return searchableFields.some(field => {
        const value = (item as Record<string, unknown>)[field];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(lowerQuery);
        }
        return false;
      });
    });
  }, [data, query, searchableFields, minSearchLength]);

  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setDebouncedQuery('');
  }, []);

  return {
    searchQuery,
    filteredData,
    handleSearch,
    clearSearch,
    isEmpty: filteredData.length === 0,
    isSearching: searchQuery.length > 0
  };
}