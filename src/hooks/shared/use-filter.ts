'use client';

import { useState, useMemo, useCallback } from 'react';

export interface FilterOption {
  label: string;
  value: string;
}

export interface UseFilterOptions<T> {
  filterKey: keyof T;
  defaultValue?: string;
  allLabel?: string;
  getFilterOptions?: (data: T[]) => FilterOption[];
}

/**
 * Hook for filtering data based on a specific property.
 * Automatically generates filter options from unique values or uses custom options.
 * 
 * @template T - The type of items in the data array
 * @param data - The array of data to filter
 * @param options - Configuration options
 * @param options.filterKey - The property key to filter by
 * @param options.defaultValue - Default filter value (default: 'all')
 * @param options.allLabel - Label for the "all" option (default: 'All')
 * @param options.getFilterOptions - Custom function to generate filter options
 * @returns Object containing filter state and controls
 * 
 * @example
 * ```tsx
 * // Basic usage with auto-generated options
 * const products = [
 *   { id: 1, name: 'Laptop', category: 'Electronics' },
 *   { id: 2, name: 'Shirt', category: 'Clothing' },
 *   { id: 3, name: 'Phone', category: 'Electronics' }
 * ];
 * 
 * const {
 *   selectedFilter,
 *   filterOptions,
 *   filteredData,
 *   handleFilterChange,
 *   clearFilter,
 *   isFiltered
 * } = useFilter(products, {
 *   filterKey: 'category',
 *   allLabel: 'All Categories'
 * });
 * 
 * // Custom filter options
 * const { filteredData: priorityFiltered } = useFilter(tasks, {
 *   filterKey: 'priority',
 *   getFilterOptions: (data) => [
 *     { label: 'High Priority', value: 'high' },
 *     { label: 'Medium Priority', value: 'medium' },
 *     { label: 'Low Priority', value: 'low' }
 *   ]
 * });
 * ```
 */
export function useFilter<T>(
  data: T[],
  options: UseFilterOptions<T>
) {
  const {
    filterKey,
    defaultValue = 'all',
    allLabel = 'All',
    getFilterOptions
  } = options;

  const [selectedFilter, setSelectedFilter] = useState(defaultValue);

  const filterOptions = useMemo(() => {
    if (getFilterOptions) {
      return [
        { label: allLabel, value: 'all' },
        ...getFilterOptions(data)
      ];
    }

    // Auto-generate filter options from unique values
    const uniqueValues = new Set<string>();
    data.forEach(item => {
      const value = (item as Record<string, unknown>)[filterKey as string];
      if (value && typeof value === 'string') {
        uniqueValues.add(value);
      }
    });

    return [
      { label: allLabel, value: 'all' },
      ...Array.from(uniqueValues).sort().map(value => ({
        label: value,
        value: value
      }))
    ];
  }, [data, filterKey, allLabel, getFilterOptions]);

  const filteredData = useMemo(() => {
    if (selectedFilter === 'all') {
      return data;
    }

    return data.filter(item => {
      const value = (item as Record<string, unknown>)[filterKey as string];
      return value === selectedFilter;
    });
  }, [data, selectedFilter, filterKey]);

  const handleFilterChange = useCallback((value: string) => {
    setSelectedFilter(value);
  }, []);

  const clearFilter = useCallback(() => {
    setSelectedFilter('all');
  }, []);

  return {
    selectedFilter,
    filterOptions,
    filteredData,
    handleFilterChange,
    clearFilter,
    isFiltered: selectedFilter !== 'all'
  };
}