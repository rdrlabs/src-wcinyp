'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { useFormContext, useFormFields, useFormSubmission, useFormValidation } from '@/contexts/form-context';
import { FieldBuilder } from '@/components/features/forms/FieldBuilder';
import type { FormTemplate, FormField } from '@/types';

// Mock form field types
const fieldTypes = {
  text: { label: "Text Input", icon: "📝" },
  email: { label: "Email", icon: "✉️" },
  phone: { label: "Phone", icon: "📱" },
  date: { label: "Date", icon: "📅" },
  select: { label: "Dropdown", icon: "🔽" },
  checkbox: { label: "Checkbox", icon: "☑️" },
  textarea: { label: "Text Area", icon: "📄" },
  signature: { label: "Signature", icon: "✍️" }
};

interface FormBuilderProps {
  template: FormTemplate;
}

export default function FormBuilder({ template }: FormBuilderProps) {
  const router = useRouter();
  const { setCurrentForm, resetForm } = useFormContext();
  const { fields, addField, removeField } = useFormFields();
  const { isSubmitting, submitForm } = useFormSubmission();
  const { validateField } = useFormValidation();
  const [formData, setFormData] = useState<Record<string, string | boolean>>({});
  const [isPreview, setIsPreview] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Helper function to safely get boolean value
  const getCheckboxValue = (value: string | boolean | undefined): boolean => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value === 'true';
    return false;
  };

  // Initialize form with template
  useEffect(() => {
    setCurrentForm(template);
    
    // If template has predefined fields, use them; otherwise create mock fields
    if (template.fields && typeof template.fields === 'object' && Array.isArray(template.fields)) {
      // Template has actual field definitions
      template.fields.forEach(field => {
        addField(field);
      });
    } else {
      // Create mock fields based on field count
      const fieldCount = typeof template.fields === 'number' ? template.fields : 5;
      Array.from({ length: fieldCount }, (_, i) => {
        const fieldId = `field_${i + 1}`;
        addField({
          id: fieldId,
          label: `Field ${i + 1}`,
          type: Object.keys(fieldTypes)[i % Object.keys(fieldTypes).length] as FormField['type'],
          required: i % 3 === 0,
          placeholder: `Enter ${i % 2 === 0 ? 'patient' : 'insurance'} information`
        });
      });
    }
    
    return () => {
      resetForm();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [template.id]); // Only re-run when template ID changes
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields manually since context validation doesn't use formData
    let hasErrors = false;
    for (const field of fields) {
      if (field.required && !formData[field.id]) {
        hasErrors = true;
        break;
      }
    }
    
    if (hasErrors) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      await submitForm(formData);
      
      // Also send to Netlify function
      const response = await fetch('/.netlify/functions/submit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formId: template.id,
          formName: template.name,
          data: formData,
          submittedAt: new Date().toISOString()
        })
      });
      
      if (response.ok) {
        toast.success('Form submitted successfully!', {
          description: 'Your form has been submitted and saved.'
        });
        router.push('/documents');
      } else {
        toast.error('Failed to submit form', {
          description: 'Please try again later.'
        });
      }
    } catch (error) {
      toast.error('Error submitting form', {
        description: 'An unexpected error occurred. Please try again.'
      });
    }
  };
  
  const renderField = (field: FormField) => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
        return (
          <input
            type={field.type}
            name={field.id}
            placeholder={field.placeholder}
            className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md"
            value={String(formData[field.id] || '')}
            onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
            required={field.required}
          />
        );
      case 'date':
        return (
          <input
            type="date"
            name={field.id}
            className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md"
            value={String(formData[field.id] || '')}
            onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
            required={field.required}
          />
        );
      case 'select':
        return (
          <Select
            name={field.id}
            value={String(formData[field.id] || '')}
            onValueChange={(value) => setFormData({ ...formData, [field.id]: value })}
            required={field.required}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="option1">Option 1</SelectItem>
              <SelectItem value="option2">Option 2</SelectItem>
              <SelectItem value="option3">Option 3</SelectItem>
            </SelectContent>
          </Select>
        );
      case 'checkbox':
        return (
          <input
            type="checkbox"
            name={field.id}
            className="w-4 h-4"
            checked={getCheckboxValue(formData[field.id])}
            onChange={(e) => setFormData({ ...formData, [field.id]: e.target.checked })}
            onBlur={(e) => {
              const error = validateField(field, e.target.checked);
              if (error) {
                toast.error(error);
              }
            }}
          />
        );
      case 'textarea':
        return (
          <textarea
            name={field.id}
            placeholder={field.placeholder}
            className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md"
            rows={4}
            value={String(formData[field.id] || '')}
            onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
            required={field.required}
          />
        );
      case 'signature':
        return (
          <div className="border-2 border-dashed border-border rounded-md p-4 text-center text-muted-foreground">
            Signature pad would go here
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">{template.name}</h1>
          <p className="text-muted-foreground mt-2">{template.description}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsPreview(!isPreview)}
          >
            {isPreview ? 'Edit Mode' : 'Preview'}
          </Button>
          <Button variant="outline" onClick={() => router.push('/documents')}>
            Back to Documents
          </Button>
        </div>
      </div>
      
      {isPreview ? (
        <div className="space-y-6">
          <div className="bg-muted p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Form Preview</h2>
            <p className="text-muted-foreground mb-4">
              This is how your form will appear to users. Switch to edit mode to make changes.
            </p>
          </div>
          
          <div className="border border-border rounded-lg p-4">
            <h3 className="font-semibold mb-4">Form Fields</h3>
            <div className="space-y-2">
              {fields.map((field) => (
                <div key={field.id} className="flex items-center gap-4 p-2 border border-border rounded">
                  <span className="text-lg">
                    {fieldTypes[field.type as keyof typeof fieldTypes]?.icon}
                  </span>
                  <span className="font-semibold">{field.label}</span>
                  <span className="text-sm text-muted-foreground">
                    ({fieldTypes[field.type as keyof typeof fieldTypes]?.label})
                  </span>
                  {field.required && (
                    <span className="text-destructive text-sm">Required</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-card border border-border rounded-lg p-6">
            {fields.map((field) => (
              <div key={field.id} className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold">
                    {fieldTypes[field.type as keyof typeof fieldTypes]?.icon} {field.label}
                    {field.required && <span className="text-destructive ml-1">*</span>}
                  </label>
                  {isEditMode && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeField(field.id)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
                {renderField(field)}
              </div>
            ))}
            {isEditMode && (
              <div className="mt-4">
                <FieldBuilder />
              </div>
            )}
          </div>
          
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => setFormData({})}>
              Clear Form
            </Button>
            <Button type="button" variant="secondary" onClick={() => setIsEditMode(!isEditMode)}>
              {isEditMode ? 'Done Editing' : 'Edit Fields'}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Form'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

export { FormBuilder };