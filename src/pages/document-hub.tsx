import React from 'react';
import Layout from '@theme/Layout';
import ModernDocumentSelector from '../components/ModernDocumentSelector';

export default function DocumentHub(): React.ReactElement {
  return (
    <Layout
      title="Document Hub"
      description="Modern document management for medical forms"
    >
      <ModernDocumentSelector />
    </Layout>
  );
}