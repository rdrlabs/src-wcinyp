import React from 'react';
import Layout from '@theme/Layout';
import FormBuilder from '@site/src/components/FormBuilder';

export default function FormGenerator(): React.ReactElement {
  return (
    <Layout
      title="Form Generator"
      description="Generate and print self-pay agreement forms"
    >
      <div className="container margin-vert--lg">
        <div className="text--center margin-bottom--lg">
          <h1>Self-Pay Form Generator</h1>
          <p className="hero__subtitle">
            Generate custom self-pay agreement forms for patients.
          </p>
        </div>
        
        <FormBuilder />
      </div>
    </Layout>
  );
}