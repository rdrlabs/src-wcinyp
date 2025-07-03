import React from 'react';
import Layout from '@theme/Layout';
import { PageErrorBoundary, AppErrorBoundary } from '@/components/ErrorBoundary';
import ModernDocumentSelector from '../components/ModernDocumentSelector';
import '../css/shadcn-pages.css';
import '../css/shadcn-pages.css';

export default function DocumentHub(): React.ReactElement {
  return (
    <Layout
      title="Document Hub"
      description="Modern document management for medical forms"
    >
      <PageErrorBoundary>
        <AppErrorBoundary>
          <div className="shadcn-page">
            <ModernDocumentSelector />
          </div>
        </AppErrorBoundary>
      </PageErrorBoundary>
    </Layout>
  );
}