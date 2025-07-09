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