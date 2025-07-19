import React, { ReactNode } from 'react';
import { BaseErrorBoundary } from './BaseErrorBoundary';
import { Button } from '../ui/button';
import { Save, RotateCcw } from 'lucide-react';
import { logger } from '@/lib/logger';

interface FormBuilderErrorBoundaryProps {
  children: ReactNode;
  onResetForm?: () => void;
  onSaveDraft?: () => void;
  formName?: string;
}

export function FormBuilderErrorBoundary({ 
  children, 
  onResetForm, 
  onSaveDraft,
  formName = 'form'
}: FormBuilderErrorBoundaryProps) {
  const handleReset = () => {
    if (onResetForm) {
      onResetForm();
    }
  };

  const handleSaveDraft = () => {
    if (onSaveDraft) {
      try {
        onSaveDraft();
      } catch (error) {
        logger.error('Failed to save draft:', error, 'Component.error-boundaries.FormBuilderErrorBoundary');
      }
    }
  };

  const customActions = (
    <>
      {onSaveDraft && (
        <Button onClick={handleSaveDraft} variant="secondary" size="sm">
          <Save className="h-4 w-4 mr-2" />
          Save Draft
        </Button>
      )}
      {onResetForm && (
        <Button onClick={handleReset} variant="secondary" size="sm">
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset Form
        </Button>
      )}
    </>
  );

  return (
    <BaseErrorBoundary
      fallbackTitle="Form Error"
      fallbackMessage={`There was an error with the ${formName}. You can try again or save your progress as a draft.`}
      onReset={handleReset}
      customActions={customActions}
      logContext="FormBuilder"
    >
      {children}
    </BaseErrorBoundary>
  );
}