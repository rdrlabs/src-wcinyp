import React from 'react';
import Layout from '@theme/Layout';
import DocumentSelector from '@site/src/components/DocumentSelector';

export default function DocumentHub(): React.ReactElement {
  return (
    <Layout
      title="Document Hub"
      description="Print screening forms and documents in batches"
    >
      <div className="container margin-vert--lg">
        <div className="text--center margin-bottom--lg">
          <h1>Document Hub</h1>
          <p className="hero__subtitle">
            Select and print multiple documents together as a single batch.
          </p>
        </div>
        
        <DocumentSelector />
      </div>
    </Layout>
  );
}