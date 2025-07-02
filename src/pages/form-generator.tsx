import React from 'react';
import Layout from '@theme/Layout';
import ModernFormBuilder from '../components/ModernFormBuilder';
import '../css/shadcn-pages.css';
import '../css/shadcn-pages.css';

export default function FormGenerator(): React.ReactElement {
  return (
    <Layout
      title="Form Generator"
      description="Generate and print self-pay agreement forms"
    >
      <div className="shadcn-page">
        <ModernFormBuilder />
      </div>
    </Layout>
  );
}