'use client';

import { useMemo } from 'react';
import { useSearch, UseSearchOptions } from './use-search';
import { useFilter, UseFilterOptions } from './use-filter';
import { usePagination, UsePaginationOptions } from './use-pagination';

export interface UseCombinedFiltersOptions<T> {
  search?: UseSearchOptions;
  filter?: UseFilterOptions<T>;
  pagination?: UsePaginationOptions;
}

export function useCombinedFilters<T>(
  data: T[],
  options: UseCombinedFiltersOptions<T> = {}
) {
  // Apply search
  const search = useSearch(data, options.search);
  
  // Apply filter to search results
  const filter = useFilter(
    search.filteredData,
    options.filter || { filterKey: 'type' as keyof T }
  );
  
  // Apply pagination to filtered results
  const pagination = usePagination(
    filter.filteredData,
    options.pagination
  );

  const finalData = pagination.paginatedData;

  const stats = useMemo(() => ({
    totalRecords: data.length,
    filteredRecords: filter.filteredData.length,
    displayedRecords: finalData.length,
    isFiltered: search.isSearching || filter.isFiltered
  }), [data.length, filter.filteredData.length, finalData.length, search.isSearching, filter.isFiltered]);

  return {
    data: finalData,
    search,
    filter,
    pagination,
    stats
  };
}