import React, { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Printer, RotateCcw, FileText, Calendar, DollarSign, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import styles from './ModernFormBuilder.module.css';

interface FormField {
  label: string;
  value: string;
  type?: 'text' | 'date' | 'number';
  icon?: React.ReactNode;
  required?: boolean;
}

const INITIAL_FORM_DATA: FormField[] = [
  { 
    label: 'Patient Name', 
    value: '', 
    type: 'text',
    icon: <User className={styles.iconWrapper} />,
    required: true
  },
  { 
    label: 'Date of Birth', 
    value: '', 
    type: 'date',
    icon: <Calendar className={styles.iconWrapper} />,
    required: true
  },
  { 
    label: 'Service Date', 
    value: '', 
    type: 'date',
    icon: <Calendar className={styles.iconWrapper} />,
    required: true
  },
  { 
    label: 'Amount Due', 
    value: '', 
    type: 'number',
    icon: <DollarSign className={styles.iconWrapper} />,
    required: true
  },
];

const ModernFormBuilder = React.memo(function ModernFormBuilder(): React.ReactElement {
  const [formData, setFormData] = useState<FormField[]>(INITIAL_FORM_DATA);

  const handleFieldChange = useCallback((index: number, value: string): void => {
    setFormData(prev => 
      prev.map((field, i) => 
        i === index ? { ...field, value } : field
      )
    );
  }, []);

  const handlePrint = useCallback((): void => {
    try {
      window.print();
    } catch (error) {
      console.error('Print failed:', error);
      alert('Unable to print. Please check your browser settings.');
    }
  }, []);

  const handleReset = useCallback((): void => {
    setFormData(INITIAL_FORM_DATA.map(field => ({ ...field, value: '' })));
  }, []);

  // Memoize computed values to prevent unnecessary recalculations
  const { isFormEmpty, completedFields, progressPercentage } = useMemo(() => {
    const completed = formData.filter(field => field.value.trim()).length;
    const isEmpty = formData.every(field => !field.value.trim());
    const progress = (completed / formData.length) * 100;
    
    return {
      isFormEmpty: isEmpty,
      completedFields: completed,
      progressPercentage: progress
    };
  }, [formData]);

  return (
    <div>
      {/* Header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Form Generator</h1>
        <p className={styles.pageSubtitle}>Create and customize self-pay agreement forms</p>
      </div>

      {/* Content */}
      <div className={styles.container}>
        <div className={cn(styles.contentWrapper, styles.sectionSpacing)}>
          {/* Progress Card */}
          <Card>
            <CardHeader>
              <div className={styles.progressHeader}>
                <div>
                  <CardTitle className={styles.progressTitle}>Form Progress</CardTitle>
                  <CardDescription>
                    {completedFields} of {formData.length} fields completed
                  </CardDescription>
                </div>
                <div className={styles.progressText}>
                  <div className={styles.progressPercentage}>
                    {Math.round(progressPercentage)}%
                  </div>
                  <div className={styles.progressLabel}>Complete</div>
                </div>
              </div>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill}
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </CardHeader>
          </Card>

          {/* Form Card */}
          <Card>
            <CardHeader className={styles.formHeader}>
              <CardTitle className={styles.formTitle}>Self-Pay Agreement Form</CardTitle>
              <CardDescription>
                Please fill out all required information below
              </CardDescription>
            </CardHeader>
            <CardContent className={styles.formContent}>
              {formData.map((field, index) => {
                const inputId = `form-field-${index}`;
                return (
                  <div key={field.label} className={styles.fieldWrapper}>
                    <label 
                      htmlFor={inputId}
                      className={styles.fieldLabel}
                    >
                      <div className={styles.fieldLabelContent}>
                        {field.icon}
                        {field.label}
                        <span className={styles.fieldRequired}>*</span>
                      </div>
                    </label>
                    <Input
                      id={inputId}
                      type={field.type || 'text'}
                      value={field.value}
                      onChange={(e) => handleFieldChange(index, e.target.value)}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                      className={cn(
                        styles.fieldInput,
                        field.value.trim() && styles.fieldInputCompleted
                      )}
                      aria-required="true"
                    />
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Actions Card */}
          <Card>
            <CardContent className={styles.actionsWrapper}>
              <div className={styles.actionsContent}>
                <Button 
                  variant="outline"
                  onClick={handleReset}
                  disabled={isFormEmpty}
                  className={styles.actionButton}
                >
                  <RotateCcw className={styles.iconWrapper} />
                  Clear Form
                </Button>
                <Button 
                  onClick={handlePrint}
                  className={styles.actionButton}
                  disabled={isFormEmpty}
                >
                  <Printer className={styles.iconWrapper} />
                  Print Form
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Form Preview Card */}
          <Card className={styles.previewCard}>
            <CardHeader className={styles.previewHeader}>
              <CardTitle>Live Preview</CardTitle>
              <CardDescription>
                This is how your form will appear when printed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className={styles.previewContainer}>
                <div className={styles.previewHeader}>
                  <h2 className={styles.previewTitle}>Self-Pay Agreement Form</h2>
                  <div className={styles.previewDivider}></div>
                </div>
                
                <div className={styles.previewFields}>
                  {formData.map((field, index) => (
                    <div key={field.label} className={styles.previewField}>
                      <label className={styles.previewFieldLabel}>
                        {field.label}:
                      </label>
                      <div className={styles.previewFieldValue}>
                        {field.value ? (
                          <span className={styles.previewFieldValueText}>
                            {field.type === 'number' && field.value ? `$${field.value}` : field.value}
                          </span>
                        ) : (
                          <span className={styles.previewFieldEmpty}>Not provided</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className={styles.previewFooter}>
                  <div className={styles.previewFooterText}>
                    <p>I acknowledge that I understand the financial responsibility for services rendered.</p>
                    <div className={styles.previewSignatures}>
                      <div className={styles.previewSignatureSection}>
                        <div className={styles.previewSignatureLine}></div>
                        <span>Patient Signature</span>
                      </div>
                      <div>
                        <div className={styles.previewDateLine}></div>
                        <span>Date</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
});

export default ModernFormBuilder;