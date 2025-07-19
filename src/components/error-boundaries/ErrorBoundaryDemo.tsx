'use client';

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { BaseErrorBoundary, FormBuilderErrorBoundary, DataTableErrorBoundary } from './index';

// Component that throws an error
function ErrorComponent({ shouldError }: { shouldError: boolean }) {
  if (shouldError) {
    throw new Error('This is a test error to demonstrate error boundaries');
  }
  return <div className="p-4 bg-green-100 rounded">Component is working normally!</div>;
}

// Demo component for testing error boundaries
export function ErrorBoundaryDemo() {
  const [showError, setShowError] = useState(false);
  const [formError, setFormError] = useState(false);
  const [tableError, setTableError] = useState(false);

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Error Boundary Demo</CardTitle>
          <CardDescription>
            Click the buttons below to trigger errors and see how error boundaries handle them.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Base Error Boundary Demo */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Base Error Boundary</h3>
            <BaseErrorBoundary
              fallbackTitle="Demo Error"
              fallbackMessage="This is a demonstration of the base error boundary."
              logContext="ErrorBoundaryDemo"
              onReset={() => setShowError(false)}
            >
              <ErrorComponent shouldError={showError} />
            </BaseErrorBoundary>
            <Button 
              onClick={() => setShowError(!showError)} 
              variant="destructive"
              className="mt-2"
            >
              {showError ? 'Fix Error' : 'Trigger Error'}
            </Button>
          </div>

          {/* Form Error Boundary Demo */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Form Error Boundary</h3>
            <FormBuilderErrorBoundary
              formName="Demo Form"
              onResetForm={() => setFormError(false)}
              onSaveDraft={() => alert('Draft saved!')}
            >
              <ErrorComponent shouldError={formError} />
            </FormBuilderErrorBoundary>
            <Button 
              onClick={() => setFormError(!formError)} 
              variant="destructive"
              className="mt-2"
            >
              {formError ? 'Fix Form Error' : 'Trigger Form Error'}
            </Button>
          </div>

          {/* Table Error Boundary Demo */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Table Error Boundary</h3>
            <DataTableErrorBoundary
              tableName="Demo Table"
              onRefreshData={() => setTableError(false)}
              onResetFilters={() => alert('Filters reset!')}
              onExportData={() => alert('Data exported!')}
            >
              <ErrorComponent shouldError={tableError} />
            </DataTableErrorBoundary>
            <Button 
              onClick={() => setTableError(!tableError)} 
              variant="destructive"
              className="mt-2"
            >
              {tableError ? 'Fix Table Error' : 'Trigger Table Error'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}