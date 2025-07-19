import React, { ReactNode } from 'react';
import { BaseErrorBoundary } from './BaseErrorBoundary';
import { Button } from '../ui/button';
import { RefreshCw, Download, Filter } from 'lucide-react';
import { logger } from '@/lib/logger';

interface DataTableErrorBoundaryProps {
  children: ReactNode;
  onRefreshData?: () => void;
  onResetFilters?: () => void;
  onExportData?: () => void;
  tableName?: string;
}

export function DataTableErrorBoundary({ 
  children, 
  onRefreshData, 
  onResetFilters,
  onExportData,
  tableName = 'table'
}: DataTableErrorBoundaryProps) {
  const handleRefresh = () => {
    if (onRefreshData) {
      onRefreshData();
    }
  };

  const handleResetFilters = () => {
    if (onResetFilters) {
      try {
        onResetFilters();
      } catch (error) {
        logger.error('Failed to reset filters:', error, 'Component.error-boundaries.DataTableErrorBoundary');
      }
    }
  };

  const handleExport = () => {
    if (onExportData) {
      try {
        onExportData();
      } catch (error) {
        logger.error('Failed to export data:', error, 'Component.error-boundaries.DataTableErrorBoundary');
      }
    }
  };

  const customActions = (
    <>
      {onRefreshData && (
        <Button onClick={handleRefresh} variant="secondary" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      )}
      {onResetFilters && (
        <Button onClick={handleResetFilters} variant="secondary" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Reset Filters
        </Button>
      )}
      {onExportData && (
        <Button onClick={handleExport} variant="secondary" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      )}
    </>
  );

  return (
    <BaseErrorBoundary
      fallbackTitle="Table Error"
      fallbackMessage={`There was an error loading the ${tableName}. Try refreshing the data or resetting filters.`}
      onReset={handleRefresh}
      customActions={customActions}
      logContext="DataTable"
    >
      {children}
    </BaseErrorBoundary>
  );
}