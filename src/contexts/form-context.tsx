'use client'

import { logger } from '@/lib/logger';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { FormTemplate, FormField, FormSubmission } from '@/types';

interface FormValidationError {
  field: string;
  message: string;
}

interface FormContextValue {
  // Current form being edited/built
  currentForm: FormTemplate | null;
  setCurrentForm: (form: FormTemplate | null) => void;
  
  // Form fields management
  fields: FormField[];
  addField: (field: FormField) => void;
  updateField: (id: string, updates: Partial<FormField>) => void;
  removeField: (id: string) => void;
  reorderFields: (startIndex: number, endIndex: number) => void;
  
  // Form validation
  validationErrors: FormValidationError[];
  validateField: (field: FormField, value: unknown) => string | null;
  validateForm: () => boolean;
  clearValidationErrors: () => void;
  
  // Form submission state
  isSubmitting: boolean;
  submissionError: Error | null;
  submissionData: FormSubmission | null;
  submitForm: (data: Record<string, unknown>) => Promise<void>;
  clearSubmissionState: () => void;
  
  // Form templates
  savedTemplates: FormTemplate[];
  saveTemplate: (template: FormTemplate) => void;
  deleteTemplate: (id: string) => void;
  loadTemplate: (id: string) => void;
  
  // Form state
  isDirty: boolean;
  setIsDirty: (dirty: boolean) => void;
  resetForm: () => void;
}

const FormContext = createContext<FormContextValue | undefined>(undefined);

const TEMPLATES_KEY = 'form-templates';

export function FormProvider({ children }: { children: ReactNode }) {
  // Current form state
  const [currentForm, setCurrentForm] = useState<FormTemplate | null>(null);
  const [fields, setFields] = useState<FormField[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  
  // Validation state
  const [validationErrors, setValidationErrors] = useState<FormValidationError[]>([]);
  
  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<Error | null>(null);
  const [submissionData, setSubmissionData] = useState<FormSubmission | null>(null);
  
  // Templates
  const [savedTemplates, setSavedTemplates] = useState<FormTemplate[]>([]);
  
  // Initialize templates from localStorage
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(TEMPLATES_KEY);
      if (saved) {
        setSavedTemplates(JSON.parse(saved));
      }
    } catch (error) {
      logger.error('Failed to load form templates', error, 'FormContext');
    }
  }, []);
  
  // Field management
  const addField = useCallback((field: FormField) => {
    setFields(prev => [...prev, field]);
    setIsDirty(true);
  }, []);
  
  const updateField = useCallback((id: string, updates: Partial<FormField>) => {
    setFields(prev => prev.map(field => 
      field.id === id ? { ...field, ...updates } : field
    ));
    setIsDirty(true);
  }, []);
  
  const removeField = useCallback((id: string) => {
    setFields(prev => prev.filter(field => field.id !== id));
    setIsDirty(true);
  }, []);
  
  const reorderFields = useCallback((startIndex: number, endIndex: number) => {
    setFields(prev => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
    setIsDirty(true);
  }, []);
  
  // Validation
  const validateField = useCallback((field: FormField, value: unknown): string | null => {
    if (field.required && !value) {
      return `${field.label} is required`;
    }
    
    if (field.type === 'email' && value && typeof value === 'string') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Please enter a valid email address';
      }
    }
    
    if ((field.type === 'tel' || field.type === 'phone') && value && typeof value === 'string') {
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      if (!phoneRegex.test(value)) {
        return 'Please enter a valid phone number';
      }
    }
    
    return null;
  }, []);
  
  const validateForm = useCallback((): boolean => {
    const errors: FormValidationError[] = [];
    
    fields.forEach(field => {
      const error = validateField(field, null);
      if (error) {
        errors.push({ field: field.id, message: error });
      }
    });
    
    setValidationErrors(errors);
    return errors.length === 0;
  }, [fields, validateField]);
  
  const clearValidationErrors = useCallback(() => {
    setValidationErrors([]);
  }, []);
  
  // Form submission
  const submitForm = useCallback(async (data: Record<string, unknown>) => {
    setIsSubmitting(true);
    setSubmissionError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const submission: FormSubmission = {
        id: Date.now().toString(),
        formTemplateId: currentForm?.id ? String(currentForm.id) : 'custom',
        data,
        submittedAt: new Date().toISOString(),
      };
      
      setSubmissionData(submission);
      setIsDirty(false);
    } catch (error) {
      setSubmissionError(error as Error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [currentForm]);
  
  const clearSubmissionState = useCallback(() => {
    setSubmissionError(null);
    setSubmissionData(null);
  }, []);
  
  // Template management
  const saveTemplate = useCallback((template: FormTemplate) => {
    setSavedTemplates(prev => {
      const existing = prev.find(t => t.id === template.id);
      const updated = existing 
        ? prev.map(t => t.id === template.id ? template : t)
        : [...prev, template];
      localStorage.setItem(TEMPLATES_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);
  
  const deleteTemplate = useCallback((id: string) => {
    setSavedTemplates(prev => {
      const updated = prev.filter(t => t.id !== id);
      localStorage.setItem(TEMPLATES_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);
  
  const loadTemplate = useCallback((id: string) => {
    const template = savedTemplates.find(t => t.id === id);
    if (template) {
      setCurrentForm(template);
      // Handle both array of fields and field count
      if (Array.isArray(template.fields)) {
        setFields(template.fields);
      } else {
        // If it's a number, initialize with empty fields
        setFields([]);
      }
      setIsDirty(false);
    }
  }, [savedTemplates]);
  
  // Reset form
  const resetForm = useCallback(() => {
    setCurrentForm(null);
    setFields([]);
    setIsDirty(false);
    clearValidationErrors();
    clearSubmissionState();
  }, [clearValidationErrors, clearSubmissionState]);
  
  const value: FormContextValue = {
    currentForm,
    setCurrentForm,
    fields,
    addField,
    updateField,
    removeField,
    reorderFields,
    validationErrors,
    validateField,
    validateForm,
    clearValidationErrors,
    isSubmitting,
    submissionError,
    submissionData,
    submitForm,
    clearSubmissionState,
    savedTemplates,
    saveTemplate,
    deleteTemplate,
    loadTemplate,
    isDirty,
    setIsDirty,
    resetForm,
  };
  
  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
}

export function useFormContext() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within FormProvider');
  }
  return context;
}

// Convenience hooks
export function useFormFields() {
  const { fields, addField, updateField, removeField, reorderFields } = useFormContext();
  return { fields, addField, updateField, removeField, reorderFields };
}

export function useFormValidation() {
  const { validationErrors, validateField, validateForm, clearValidationErrors } = useFormContext();
  return { validationErrors, validateField, validateForm, clearValidationErrors };
}

export function useFormSubmission() {
  const { isSubmitting, submissionError, submissionData, submitForm, clearSubmissionState } = useFormContext();
  return { isSubmitting, submissionError, submissionData, submitForm, clearSubmissionState };
}

export function useFormTemplates() {
  const { savedTemplates, saveTemplate, deleteTemplate, loadTemplate } = useFormContext();
  return { savedTemplates, saveTemplate, deleteTemplate, loadTemplate };
}