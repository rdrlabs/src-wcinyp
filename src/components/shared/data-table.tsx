'use client';

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DataTableColumn<T> {
  key: string;
  header: string;
  accessor: (row: T) => React.ReactNode;
  className?: string;
  sortable?: boolean;
}

export interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  searchValue?: string;
  filters?: React.ReactNode;
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    pageSize?: number;
    onPageSizeChange?: (size: number) => void;
  };
  emptyMessage?: string;
  className?: string;
  expandable?: {
    isExpanded: (row: T) => boolean;
    onToggle: (row: T) => void;
    renderExpanded: (row: T) => React.ReactNode;
  };
  onRowClick?: (row: T) => void;
  getRowKey: (row: T) => string | number;
}

export function DataTable<T>({
  data,
  columns,
  searchPlaceholder = "Search...",
  onSearch,
  searchValue = "",
  filters,
  pagination,
  emptyMessage = "No data found.",
  className,
  expandable,
  onRowClick,
  getRowKey
}: DataTableProps<T>) {
  return (
    <div className={cn("space-y-4", className)}>
      {/* Search and Filters */}
      {(onSearch || filters) && (
        <div className="flex flex-col md:flex-row gap-4 p-4 bg-muted-lighter rounded-lg border border-border">
          {onSearch && (
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => onSearch(e.target.value)}
                className="pl-10 bg-background border-border-strong focus:border-primary"
                data-testid="data-table-search"
              />
            </div>
          )}
          {filters}
        </div>
      )}

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key} className={column.className}>
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-8 text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => {
                const rowKey = getRowKey(row);
                const isExpanded = expandable?.isExpanded(row);
                
                return (
                  <React.Fragment key={rowKey}>
                    <TableRow
                      className={cn(
                        onRowClick || expandable ? "cursor-pointer hover:bg-muted-darker/50" : "",
                        "even:bg-muted-lighter/50"
                      )}
                      onClick={() => {
                        if (expandable) {
                          expandable.onToggle(row);
                        } else if (onRowClick) {
                          onRowClick(row);
                        }
                      }}
                    >
                      {columns.map((column) => (
                        <TableCell key={column.key} className={column.className}>
                          {column.accessor(row)}
                        </TableCell>
                      ))}
                    </TableRow>
                    {expandable && isExpanded && (
                      <TableRow>
                        <TableCell colSpan={columns.length} className="p-0">
                          {expandable.renderExpanded(row)}
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Page {pagination.currentPage} of {pagination.totalPages}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}