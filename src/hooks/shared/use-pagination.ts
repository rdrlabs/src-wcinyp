'use client';

import { useState, useMemo, useCallback } from 'react';

export interface UsePaginationOptions {
  pageSize?: number;
  initialPage?: number;
}

/**
 * Hook for paginating data arrays with navigation controls.
 * Provides page navigation, page size control, and pagination metadata.
 * 
 * @template T - The type of items in the data array
 * @param data - The array of data to paginate
 * @param options - Configuration options
 * @param options.pageSize - Number of items per page (default: 10)
 * @param options.initialPage - Starting page number (default: 1)
 * @returns Object containing paginated data and pagination controls
 * 
 * @example
 * ```tsx
 * const items = Array.from({ length: 100 }, (_, i) => ({ id: i, name: `Item ${i}` }));
 * 
 * const {
 *   paginatedData,
 *   pageInfo,
 *   goToPage,
 *   nextPage,
 *   previousPage,
 *   changePageSize
 * } = usePagination(items, {
 *   pageSize: 20,
 *   initialPage: 1
 * });
 * 
 * return (
 *   <div>
 *     <ul>
 *       {paginatedData.map(item => (
 *         <li key={item.id}>{item.name}</li>
 *       ))}
 *     </ul>
 *     
 *     <div className="pagination">
 *       <button
 *         onClick={previousPage}
 *         disabled={!pageInfo.hasPreviousPage}
 *       >
 *         Previous
 *       </button>
 *       
 *       <span>
 *         Page {pageInfo.currentPage} of {pageInfo.totalPages}
 *       </span>
 *       
 *       <button
 *         onClick={nextPage}
 *         disabled={!pageInfo.hasNextPage}
 *       >
 *         Next
 *       </button>
 *       
 *       <select
 *         value={pageInfo.itemsPerPage}
 *         onChange={(e) => changePageSize(Number(e.target.value))}
 *       >
 *         <option value={10}>10 per page</option>
 *         <option value={20}>20 per page</option>
 *         <option value={50}>50 per page</option>
 *       </select>
 *     </div>
 *   </div>
 * );
 * ```
 */
export function usePagination<T>(
  data: T[],
  options: UsePaginationOptions = {}
) {
  const {
    pageSize = 10,
    initialPage = 1
  } = options;

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(pageSize);

  const totalPages = useMemo(() => {
    return Math.ceil(data.length / itemsPerPage);
  }, [data.length, itemsPerPage]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, itemsPerPage]);

  const goToPage = useCallback((page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
  }, [totalPages]);

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const previousPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  const changePageSize = useCallback((newSize: number) => {
    setItemsPerPage(newSize);
    setCurrentPage(1); // Reset to first page when changing page size
  }, []);

  const pageInfo = useMemo(() => ({
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems: data.length,
    startIndex: (currentPage - 1) * itemsPerPage + 1,
    endIndex: Math.min(currentPage * itemsPerPage, data.length),
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1
  }), [currentPage, totalPages, itemsPerPage, data.length]);

  return {
    paginatedData,
    pageInfo,
    goToPage,
    nextPage,
    previousPage,
    changePageSize
  };
}