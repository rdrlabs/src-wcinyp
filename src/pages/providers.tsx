import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

export default function Providers(): React.ReactElement {
  return (
    <Layout
      title="Provider Directory"
      description="Access provider information and contact details"
    >
      <div className="container margin-vert--lg">
        <div className="text--center margin-bottom--lg">
          <h1>Provider Directory</h1>
          <p className="hero__subtitle">
            Access comprehensive provider information and contact details.
          </p>
        </div>
        
        <div className="card">
          <div className="card__header">
            <h3>Medical Providers</h3>
          </div>
          <div className="card__body">
            <p>
              View detailed contact information, specialties, and office locations for all providers.
            </p>
            <Link 
              className="button button--primary button--lg" 
              to="/docs/providers/directory"
            >
              View Directory
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}