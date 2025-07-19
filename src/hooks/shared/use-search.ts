'use client';

import { useState, useMemo, useCallback } from 'react';

export interface UseSearchOptions {
  searchableFields?: string[];
  minSearchLength?: number;
  debounceMs?: number;
}

/**
 * Hook for searching through data arrays with optional field specification and debouncing.
 * Searches are case-insensitive and match partial strings.
 * 
 * @template T - The type of items in the data array
 * @param data - The array of data to search through
 * @param options - Configuration options
 * @param options.searchableFields - Array of field names to search (searches all string fields if empty)
 * @param options.minSearchLength - Minimum query length to trigger search (default: 0)
 * @param options.debounceMs - Debounce delay in milliseconds (default: 0)
 * @returns Object containing search state and filtered results
 * 
 * @example
 * ```tsx
 * // Search all string fields
 * const users = [
 *   { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
 *   { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user' }
 * ];
 * 
 * const {
 *   searchQuery,
 *   filteredData,
 *   handleSearch,
 *   clearSearch,
 *   isEmpty,
 *   isSearching
 * } = useSearch(users, {
 *   searchableFields: ['name', 'email'], // Only search these fields
 *   minSearchLength: 2,                  // Don't search until 2+ characters
 *   debounceMs: 300                     // Wait 300ms after typing stops
 * });
 * 
 * return (
 *   <div>
 *     <input
 *       type="search"
 *       value={searchQuery}
 *       onChange={(e) => handleSearch(e.target.value)}
 *       placeholder="Search users..."
 *     />
 *     {isSearching && (
 *       <button onClick={clearSearch}>Clear search</button>
 *     )}
 *     {isEmpty && isSearching && (
 *       <p>No results found for "{searchQuery}"</p>
 *     )}
 *     {filteredData.map(user => (
 *       <UserCard key={user.id} user={user} />
 *     ))}
 *   </div>
 * );
 * ```
 */
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