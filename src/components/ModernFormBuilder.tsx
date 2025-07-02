import React, { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Printer, RotateCcw, FileText, Calendar, DollarSign, User } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    icon: <User className="h-4 w-4" />,
    required: true
  },
  { 
    label: 'Date of Birth', 
    value: '', 
    type: 'date',
    icon: <Calendar className="h-4 w-4" />,
    required: true
  },
  { 
    label: 'Service Date', 
    value: '', 
    type: 'date',
    icon: <Calendar className="h-4 w-4" />,
    required: true
  },
  { 
    label: 'Amount Due', 
    value: '', 
    type: 'number',
    icon: <DollarSign className="h-4 w-4" />,
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Form Generator</h1>
                <p className="text-muted-foreground">Create and customize self-pay agreement forms</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Progress Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Form Progress</CardTitle>
                  <CardDescription>
                    {completedFields} of {formData.length} fields completed
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    {Math.round(progressPercentage)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Complete</div>
                </div>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300 ease-in-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </CardHeader>
          </Card>

          {/* Form Card */}
          <Card>
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-2xl">Self-Pay Agreement Form</CardTitle>
              <CardDescription>
                Please fill out all required information below
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {formData.map((field, index) => {
                const inputId = `form-field-${index}`;
                return (
                  <div key={field.label} className="space-y-2">
                    <label 
                      htmlFor={inputId}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {field.icon}
                        {field.label}
                        <span className="text-destructive">*</span>
                      </div>
                    </label>
                    <Input
                      id={inputId}
                      type={field.type || 'text'}
                      value={field.value}
                      onChange={(e) => handleFieldChange(index, e.target.value)}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                      className={cn(
                        "transition-all duration-200",
                        field.value.trim() 
                          ? "ring-2 ring-green-500/20 border-green-500/50 bg-green-50/50" 
                          : "focus:ring-primary/20"
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
            <CardContent className="p-6">
              <div className="flex justify-center gap-4">
                <Button 
                  variant="outline"
                  onClick={handleReset}
                  disabled={isFormEmpty}
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Clear Form
                </Button>
                <Button 
                  onClick={handlePrint}
                  className="flex items-center gap-2"
                  disabled={isFormEmpty}
                >
                  <Printer className="h-4 w-4" />
                  Print Form
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Form Preview Card */}
          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle className="text-lg">Live Preview</CardTitle>
              <CardDescription>
                This is how your form will appear when printed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-white p-8 rounded-lg shadow-sm border min-h-[400px]">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">Self-Pay Agreement Form</h2>
                  <div className="w-24 h-1 bg-primary mx-auto mt-2"></div>
                </div>
                
                <div className="space-y-6">
                  {formData.map((field, index) => (
                    <div key={field.label} className="flex items-center justify-between border-b border-gray-200 pb-2">
                      <label className="font-medium text-gray-700 w-1/3">
                        {field.label}:
                      </label>
                      <div className="w-2/3 text-right">
                        {field.value ? (
                          <span className="text-gray-900 font-medium">
                            {field.type === 'number' && field.value ? `$${field.value}` : field.value}
                          </span>
                        ) : (
                          <span className="text-gray-400 italic">Not provided</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-12 pt-8 border-t border-gray-200">
                  <div className="text-center text-sm text-gray-600">
                    <p>I acknowledge that I understand the financial responsibility for services rendered.</p>
                    <div className="mt-8 flex justify-between">
                      <div className="text-left">
                        <div className="border-b border-gray-400 w-48 mb-1"></div>
                        <span>Patient Signature</span>
                      </div>
                      <div className="text-right">
                        <div className="border-b border-gray-400 w-32 mb-1"></div>
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