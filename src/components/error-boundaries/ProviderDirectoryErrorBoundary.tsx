import React, { ReactNode } from 'react';
import { BaseErrorBoundary } from './BaseErrorBoundary';
import { Button } from '../ui/button';
import { Search, MapPin, UserPlus } from 'lucide-react';
import { logger } from '@/lib/logger';

interface ProviderDirectoryErrorBoundaryProps {
  children: ReactNode;
  onRefreshProviders?: () => void;
  onResetSearch?: () => void;
  onSearchNearby?: () => void;
  onAddProvider?: () => void;
  sectionName?: string;
}

export function ProviderDirectoryErrorBoundary({ 
  children, 
  onRefreshProviders, 
  onResetSearch,
  onSearchNearby,
  onAddProvider,
  sectionName = 'provider directory'
}: ProviderDirectoryErrorBoundaryProps) {
  const handleRefresh = () => {
    if (onRefreshProviders) {
      onRefreshProviders();
    }
  };

  const handleResetSearch = () => {
    if (onResetSearch) {
      try {
        onResetSearch();
      } catch (error) {
        logger.error('Failed to reset search:', error, 'Component.error-boundaries.ProviderDirectoryErrorBoundary');
      }
    }
  };

  const handleSearchNearby = () => {
    if (onSearchNearby) {
      try {
        onSearchNearby();
      } catch (error) {
        logger.error('Failed to search nearby providers:', error, 'Component.error-boundaries.ProviderDirectoryErrorBoundary');
      }
    }
  };

  const handleAddProvider = () => {
    if (onAddProvider) {
      try {
        onAddProvider();
      } catch (error) {
        logger.error('Failed to initiate add provider:', error, 'Component.error-boundaries.ProviderDirectoryErrorBoundary');
      }
    }
  };

  const customActions = (
    <>
      {onResetSearch && (
        <Button onClick={handleResetSearch} variant="secondary" size="sm">
          <Search className="h-4 w-4 mr-2" />
          Clear Search
        </Button>
      )}
      {onSearchNearby && (
        <Button onClick={handleSearchNearby} variant="secondary" size="sm">
          <MapPin className="h-4 w-4 mr-2" />
          Search Nearby
        </Button>
      )}
      {onAddProvider && (
        <Button onClick={handleAddProvider} variant="secondary" size="sm">
          <UserPlus className="h-4 w-4 mr-2" />
          Add Provider
        </Button>
      )}
    </>
  );

  return (
    <BaseErrorBoundary
      fallbackTitle="Provider Directory Error"
      fallbackMessage={`There was an error loading the ${sectionName}. You can try refreshing or adjusting your search criteria.`}
      onReset={handleRefresh}
      customActions={customActions}
      logContext="ProviderDirectory"
    >
      {children}
    </BaseErrorBoundary>
  );
}