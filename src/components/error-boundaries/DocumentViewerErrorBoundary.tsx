import React, { ReactNode } from 'react';
import { BaseErrorBoundary } from './BaseErrorBoundary';
import { Button } from '../ui/button';
import { Download, ExternalLink, FileText } from 'lucide-react';
import { logger } from '@/lib/logger';

interface DocumentViewerErrorBoundaryProps {
  children: ReactNode;
  onReloadDocument?: () => void;
  onDownloadDocument?: () => void;
  onOpenExternal?: () => void;
  documentName?: string;
  documentUrl?: string;
}

export function DocumentViewerErrorBoundary({ 
  children, 
  onReloadDocument, 
  onDownloadDocument,
  onOpenExternal,
  documentName = 'document',
  documentUrl
}: DocumentViewerErrorBoundaryProps) {
  const handleReload = () => {
    if (onReloadDocument) {
      onReloadDocument();
    }
  };

  const handleDownload = () => {
    if (onDownloadDocument) {
      try {
        onDownloadDocument();
      } catch (error) {
        logger.error('Failed to download document:', error, 'Component.error-boundaries.DocumentViewerErrorBoundary');
      }
    }
  };

  const handleOpenExternal = () => {
    if (onOpenExternal) {
      try {
        onOpenExternal();
      } catch (error) {
        logger.error('Failed to open document externally:', error, 'Component.error-boundaries.DocumentViewerErrorBoundary');
      }
    } else if (documentUrl) {
      window.open(documentUrl, '_blank');
    }
  };

  const customActions = (
    <>
      {onReloadDocument && (
        <Button onClick={handleReload} variant="secondary" size="sm">
          <FileText className="h-4 w-4 mr-2" />
          Reload Document
        </Button>
      )}
      {onDownloadDocument && (
        <Button onClick={handleDownload} variant="secondary" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
      )}
      {(onOpenExternal || documentUrl) && (
        <Button onClick={handleOpenExternal} variant="secondary" size="sm">
          <ExternalLink className="h-4 w-4 mr-2" />
          Open External
        </Button>
      )}
    </>
  );

  return (
    <BaseErrorBoundary
      fallbackTitle="Document Error"
      fallbackMessage={`There was an error loading the ${documentName}. You can try reloading it or downloading it to view locally.`}
      onReset={handleReload}
      customActions={customActions}
      logContext="DocumentViewer"
    >
      {children}
    </BaseErrorBoundary>
  );
}