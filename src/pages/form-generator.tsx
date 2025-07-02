import React from 'react';
import Layout from '@theme/Layout';
import ModernFormBuilder from '../components/ModernFormBuilder';

export default function FormGenerator(): React.ReactElement {
  return (
    <Layout
      title="Form Generator"
      description="Generate and print self-pay agreement forms"
    >
      <ModernFormBuilder />
    </Layout>
  );
}