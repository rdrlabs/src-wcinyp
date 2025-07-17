'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download, FileJson, FileSpreadsheet, FileText } from 'lucide-react';
import { exportToJSON, exportToCSV, exportPageHTML } from '@/lib/export-utils';
import { logger } from '@/lib/logger';

export interface ExportButtonProps {
  data: unknown | (() => Promise<unknown>);
  filename: string;
  pageType?: string;
  pageTitle?: string;
  csvHeaders?: Record<string, string>;
  htmlContent?: string;
  formats?: ('json' | 'csv' | 'html')[];
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

/**
 * Reusable export button with format options
 * 
 * AI IMPLEMENTATION NOTES:
 * - Provides consistent export UI across all pages
 * - Supports JSON, CSV, and HTML export formats
 * - Includes metadata for design tool integration
 * - Can be dropped into any page toolbar
 */
export function ExportButton({
  data,
  filename,
  pageType,
  pageTitle,
  csvHeaders,
  htmlContent,
  formats = ['json'],
  variant = 'outline',
  size = 'sm',
  className
}: ExportButtonProps) {
  const handleExport = async (format: 'json' | 'csv' | 'html') => {
    try {
      // Get data - either directly or by calling function
      const exportData = typeof data === 'function' ? await data() : data;
      
      switch (format) {
        case 'json':
          exportToJSON(exportData, filename, {
            pageUrl: window.location.href,
            pageTitle: pageTitle || document.title,
            description: `Exported ${pageType || 'page'} data from WCI@NYP`
          });
          break;
          
        case 'csv':
          if (Array.isArray(exportData) && csvHeaders) {
            exportToCSV(exportData, csvHeaders, filename);
          }
          break;
          
        case 'html':
          if (htmlContent && pageType) {
            exportPageHTML(pageType, pageTitle || document.title, htmlContent);
          }
          break;
      }
    } catch (error) {
      logger.error('Export failed', error, 'ExportButton');
    }
  };

  // If only one format, show simple button
  if (formats.length === 1) {
    return (
      <Button
        variant={variant}
        size={size}
        onClick={() => handleExport(formats[0])}
        className={className}
      >
        <Download className="h-4 w-4 mr-2" />
        Export
      </Button>
    );
  }

  // Multiple formats, show dropdown
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {formats.includes('json') && (
          <DropdownMenuItem onClick={() => handleExport('json')}>
            <FileJson className="h-4 w-4 mr-2" />
            Export as JSON
          </DropdownMenuItem>
        )}
        {formats.includes('csv') && csvHeaders && (
          <DropdownMenuItem onClick={() => handleExport('csv')}>
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Export as CSV
          </DropdownMenuItem>
        )}
        {formats.includes('html') && htmlContent && (
          <DropdownMenuItem onClick={() => handleExport('html')}>
            <FileText className="h-4 w-4 mr-2" />
            Export as HTML
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}