import * as React from "react";
import type { ColumnDef, Row } from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Type definitions
export interface TableColumn<TData> extends ColumnDef<TData> {
  meta?: {
    filterType?: 'text' | 'number' | 'date' | 'select' | 'multiselect';
    filterOptions?: Array<{ label: string; value: string }>;
    formatType?: 'date' | 'currency' | 'percentage' | 'fileSize' | 'phone';
  };
}

export interface ColumnFactoryOptions {
  sortable?: boolean;
  filterable?: boolean;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

export interface ActionItem<TData> {
  label: string;
  onClick: (row: TData) => void;
  icon?: React.ReactNode;
  destructive?: boolean;
  disabled?: boolean | ((row: TData) => boolean);
}

export interface BulkActionOptions<TData> {
  onDelete?: (rows: TData[]) => void;
  onExport?: (rows: TData[]) => void;
  onUpdate?: (rows: TData[], updates: Partial<TData>) => void;
  customActions?: Array<{
    label: string;
    onClick: (rows: TData[]) => void;
    icon?: React.ReactNode;
  }>;
}

// Column Factory Functions
export function createSelectColumn<TData = any>(): ColumnDef<TData> {
  return {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        onClick={(e) => e.stopPropagation()}
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 40,
  };
}

export function createSortableColumn<TData>(
  accessorKey: keyof TData,
  header: string,
  options?: ColumnFactoryOptions
): TableColumn<TData> {
  const column: TableColumn<TData> = {
    accessorKey: accessorKey as string,
    header: ({ column }) => {
      if (options?.sortable !== false) {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="-ml-4"
          >
            {header}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      }
      return header;
    },
    cell: ({ row }) => {
      const value = row.getValue(accessorKey as string);
      const formatted = formatCellValue(value, column.meta?.formatType);
      return (
        <div className={options?.className} style={{ textAlign: options?.align }}>
          {formatted}
        </div>
      );
    },
  };

  if (options?.filterable) {
    column.filterFn = 'includesString';
  }

  return column;
}

export function createActionColumn<TData>(
  actions: ActionItem<TData>[] | ((row: TData) => ActionItem<TData>[])
): ColumnDef<TData> {
  return {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const actionsForRow = typeof actions === 'function' ? actions(row.original) : actions;
      
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {actionsForRow.map((action, index) => {
              const isDisabled = typeof action.disabled === 'function' 
                ? action.disabled(row.original) 
                : action.disabled;
              
              return (
                <DropdownMenuItem
                  key={index}
                  onClick={() => action.onClick(row.original)}
                  disabled={isDisabled}
                  className={action.destructive ? "text-destructive" : ""}
                >
                  {action.icon && <span className="mr-2">{action.icon}</span>}
                  {action.label}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableHiding: false,
    size: 40,
  };
}

export function createTextColumn<TData>(
  accessorKey: keyof TData,
  header: string,
  options?: ColumnFactoryOptions & { format?: (value: any) => string }
): TableColumn<TData> {
  return {
    accessorKey: accessorKey as string,
    header,
    cell: ({ row }) => {
      const value = row.getValue(accessorKey as string);
      const formatted = options?.format ? options.format(value) : String(value || '');
      return (
        <div className={options?.className} style={{ textAlign: options?.align }}>
          {formatted}
        </div>
      );
    },
    filterFn: options?.filterable ? 'includesString' : undefined,
  };
}

export function createDateColumn<TData>(
  accessorKey: keyof TData,
  header: string,
  options?: ColumnFactoryOptions & { dateFormat?: string }
): TableColumn<TData> {
  return {
    accessorKey: accessorKey as string,
    header: options?.sortable !== false ? ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-4"
      >
        {header}
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ) : header,
    cell: ({ row }) => {
      const value = row.getValue(accessorKey as string);
      const formatted = formatDate(value, options?.dateFormat);
      return (
        <div className={options?.className} style={{ textAlign: options?.align }}>
          {formatted}
        </div>
      );
    },
    sortingFn: 'datetime',
    meta: { formatType: 'date' },
  };
}

export function createStatusColumn<TData>(
  accessorKey: keyof TData,
  header: string,
  statusConfig: Record<string, { label: string; variant: string; icon?: React.ReactNode }>
): TableColumn<TData> {
  return {
    accessorKey: accessorKey as string,
    header,
    cell: ({ row }) => {
      const status = row.getValue(accessorKey as string) as string;
      const config = statusConfig[status] || { label: status, variant: 'default' };
      
      return (
        <div className="flex items-center gap-2">
          {config.icon}
          <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${config.variant}`}>
            {config.label}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    meta: {
      filterType: 'multiselect',
      filterOptions: Object.entries(statusConfig).map(([value, config]) => ({
        value,
        label: config.label,
      })),
    },
  };
}

// Common Formatters
export function formatDate(value: any, dateFormat: string = "MMM d, yyyy"): string {
  if (!value) return "";
  
  try {
    const date = value instanceof Date ? value : parseISO(String(value));
    return format(date, dateFormat);
  } catch {
    return String(value);
  }
}

export function formatCurrency(
  value: any,
  currency: string = "USD",
  locale: string = "en-US"
): string {
  if (value == null || isNaN(Number(value))) return "";
  
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(Number(value));
}

export function formatPercentage(
  value: any,
  decimals: number = 0,
  locale: string = "en-US"
): string {
  if (value == null || isNaN(Number(value))) return "";
  
  return new Intl.NumberFormat(locale, {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(Number(value) / 100);
}

export function formatFileSize(bytes: number): string {
  if (!bytes || bytes === 0) return "0 Bytes";
  
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function formatPhoneNumber(value: string): string {
  if (!value) return "";
  
  // Remove all non-numeric characters
  const cleaned = value.replace(/\D/g, "");
  
  // Format as (XXX) XXX-XXXX
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  // Format as +X (XXX) XXX-XXXX
  if (cleaned.length === 11 && cleaned[0] === "1") {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  return value;
}

function formatCellValue(value: any, formatType?: string): string {
  if (value == null) return "";
  
  switch (formatType) {
    case 'date':
      return formatDate(value);
    case 'currency':
      return formatCurrency(value);
    case 'percentage':
      return formatPercentage(value);
    case 'fileSize':
      return formatFileSize(Number(value));
    case 'phone':
      return formatPhoneNumber(String(value));
    default:
      return String(value);
  }
}

// Filter Utilities
export function createSearchFilter<TData>(
  searchableColumns: Array<keyof TData>
): (row: Row<TData>, query: string) => boolean {
  return (row, query) => {
    if (!query) return true;
    
    const searchQuery = query.toLowerCase();
    return searchableColumns.some((column) => {
      const value = row.getValue(column as string);
      return String(value || "").toLowerCase().includes(searchQuery);
    });
  };
}

export function createDateRangeFilter<TData>(
  dateColumn: keyof TData
): (row: Row<TData>, range: { from: Date; to: Date }) => boolean {
  return (row, range) => {
    if (!range.from && !range.to) return true;
    
    const value = row.getValue(dateColumn as string);
    if (!value) return false;
    
    const date = value instanceof Date ? value : parseISO(String(value));
    
    if (range.from && !range.to) {
      return date >= range.from;
    }
    
    if (!range.from && range.to) {
      return date <= range.to;
    }
    
    return date >= range.from && date <= range.to;
  };
}

export function createSelectFilter<TData>(
  column: keyof TData
): (row: Row<TData>, value: string) => boolean {
  return (row, value) => {
    if (!value || value === "all") return true;
    return row.getValue(column as string) === value;
  };
}

export function createMultiSelectFilter<TData>(
  column: keyof TData
): (row: Row<TData>, values: string[]) => boolean {
  return (row, values) => {
    if (!values || values.length === 0) return true;
    const rowValue = row.getValue(column as string);
    return values.includes(String(rowValue));
  };
}

// Bulk Action Handlers
export function createBulkDeleteHandler<TData extends { id: string | number }>(
  onDelete: (ids: Array<string | number>) => Promise<void>,
  options?: {
    confirmMessage?: string;
    onSuccess?: () => void;
    onError?: (error: Error) => void;
  }
): (rows: TData[]) => void {
  return async (rows) => {
    const confirmMessage = options?.confirmMessage || 
      `Are you sure you want to delete ${rows.length} item(s)?`;
    
    if (!confirm(confirmMessage)) return;
    
    try {
      const ids = rows.map(row => row.id);
      await onDelete(ids);
      options?.onSuccess?.();
    } catch (error) {
      options?.onError?.(error as Error);
    }
  };
}

export function createBulkExportHandler<TData>(
  columns: Array<{ key: keyof TData; label: string }>,
  options?: {
    filename?: string;
    format?: 'csv' | 'json';
  }
): (rows: TData[]) => void {
  return (rows) => {
    const format = options?.format || 'csv';
    const filename = options?.filename || `export-${new Date().toISOString()}.${format}`;
    
    if (format === 'json') {
      const json = JSON.stringify(rows, null, 2);
      downloadFile(json, filename, 'application/json');
    } else {
      const csv = convertToCSV(rows, columns);
      downloadFile(csv, filename, 'text/csv');
    }
  };
}

export function createBulkUpdateHandler<TData extends { id: string | number }>(
  onUpdate: (ids: Array<string | number>, updates: Partial<TData>) => Promise<void>,
  options?: {
    fields: Array<{ key: keyof TData; label: string; type: string }>;
    onSuccess?: () => void;
    onError?: (error: Error) => void;
  }
): (rows: TData[], updates: Partial<TData>) => void {
  return async (rows, updates) => {
    try {
      const ids = rows.map(row => row.id);
      await onUpdate(ids, updates);
      options?.onSuccess?.();
    } catch (error) {
      options?.onError?.(error as Error);
    }
  };
}

// Helper functions
function convertToCSV<TData>(
  data: TData[],
  columns: Array<{ key: keyof TData; label: string }>
): string {
  const headers = columns.map(col => col.label).join(',');
  const rows = data.map(item =>
    columns.map(col => {
      const value = item[col.key];
      // Escape quotes and wrap in quotes if contains comma
      const stringValue = String(value || '');
      return stringValue.includes(',') || stringValue.includes('"')
        ? `"${stringValue.replace(/"/g, '""')}"`
        : stringValue;
    }).join(',')
  );
  
  return [headers, ...rows].join('\n');
}

function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

// Re-export commonly used table utilities for convenience
export { flexRender } from "@tanstack/react-table";
export type { ColumnDef, Row, Table } from "@tanstack/react-table";