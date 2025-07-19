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

/**
 * Hook that combines search, filter, and pagination functionality for data tables.
 * Applies transformations in order: search → filter → pagination.
 * 
 * @template T - The type of items in the data array
 * @param data - The array of data to process
 * @param options - Configuration options for each feature
 * @param options.search - Search configuration options
 * @param options.filter - Filter configuration options
 * @param options.pagination - Pagination configuration options
 * @returns Object containing processed data and individual feature controls
 * 
 * @example
 * ```tsx
 * const users = [
 *   { id: 1, name: 'John Doe', role: 'admin', email: 'john@example.com' },
 *   { id: 2, name: 'Jane Smith', role: 'user', email: 'jane@example.com' }
 * ];
 * 
 * const {
 *   data: displayedUsers,
 *   search,
 *   filter,
 *   pagination,
 *   stats
 * } = useCombinedFilters(users, {
 *   search: {
 *     searchableFields: ['name', 'email'],
 *     minSearchLength: 2
 *   },
 *   filter: {
 *     filterKey: 'role',
 *     defaultValue: 'all'
 *   },
 *   pagination: {
 *     pageSize: 10,
 *     initialPage: 1
 *   }
 * });
 * 
 * return (
 *   <div>
 *     <input
 *       value={search.searchQuery}
 *       onChange={(e) => search.handleSearch(e.target.value)}
 *       placeholder="Search users..."
 *     />
 *     <select
 *       value={filter.selectedFilter}
 *       onChange={(e) => filter.handleFilterChange(e.target.value)}
 *     >
 *       {filter.filterOptions.map(option => (
 *         <option key={option.value} value={option.value}>
 *           {option.label}
 *         </option>
 *       ))}
 *     </select>
 *     <p>Showing {stats.displayedRecords} of {stats.filteredRecords} results</p>
 *     {displayedUsers.map(user => <UserCard key={user.id} user={user} />)}
 *     <Pagination {...pagination.pageInfo} onPageChange={pagination.goToPage} />
 *   </div>
 * );
 * ```
 */
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