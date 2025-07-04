'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";

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

interface FormTemplate {
  id: number;
  name: string;
  category: string;
  fields: number;
  description: string;
}

interface FormBuilderProps {
  template: FormTemplate;
}

export default function FormBuilder({ template }: FormBuilderProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<Record<string, string | boolean>>({});
  const [isPreview, setIsPreview] = useState(false);
  
  // Helper function to safely get boolean value
  const getCheckboxValue = (value: string | boolean | undefined): boolean => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value === 'true';
    return false;
  };

  // Mock form fields based on template
  const mockFields = Array.from({ length: template.fields }, (_, i) => ({
    id: `field_${i + 1}`,
    name: `Field ${i + 1}`,
    type: Object.keys(fieldTypes)[i % Object.keys(fieldTypes).length],
    required: i % 3 === 0,
    placeholder: `Enter ${i % 2 === 0 ? 'patient' : 'insurance'} information`
  }));
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
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
        alert('Form submitted successfully!');
        router.push('/forms');
      } else {
        alert('Failed to submit form');
      }
    } catch (error) {
      alert('Error submitting form');
    }
  };
  
  interface MockField {
    id: string;
    name: string;
    type: string;
    required: boolean;
    placeholder?: string;
  }
  
  const renderField = (field: MockField) => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
        return (
          <input
            type={field.type}
            name={field.id}
            placeholder={field.placeholder}
            className="w-full px-3 py-2 border rounded-md"
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
            className="w-full px-3 py-2 border rounded-md"
            value={String(formData[field.id] || '')}
            onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
            required={field.required}
          />
        );
      case 'select':
        return (
          <select
            name={field.id}
            className="w-full px-3 py-2 border rounded-md"
            value={String(formData[field.id] || '')}
            onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
            required={field.required}
          >
            <option value="">Select an option</option>
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option>
          </select>
        );
      case 'checkbox':
        return (
          <input
            type="checkbox"
            name={field.id}
            className="w-4 h-4"
            checked={getCheckboxValue(formData[field.id])}
            onChange={(e) => setFormData({ ...formData, [field.id]: e.target.checked })}
          />
        );
      case 'textarea':
        return (
          <textarea
            name={field.id}
            placeholder={field.placeholder}
            className="w-full px-3 py-2 border rounded-md"
            rows={4}
            value={String(formData[field.id] || '')}
            onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
            required={field.required}
          />
        );
      case 'signature':
        return (
          <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center text-gray-500">
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
          <h1 className="text-3xl font-bold">{template.name}</h1>
          <p className="text-gray-600 mt-2">{template.description}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsPreview(!isPreview)}
          >
            {isPreview ? 'Edit Mode' : 'Preview'}
          </Button>
          <Button variant="outline" onClick={() => router.push('/forms')}>
            Back to Forms
          </Button>
        </div>
      </div>
      
      {isPreview ? (
        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Form Preview</h2>
            <p className="text-gray-600 mb-4">
              This is how your form will appear to users. Switch to edit mode to make changes.
            </p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-4">Form Fields</h3>
            <div className="space-y-2">
              {mockFields.map((field) => (
                <div key={field.id} className="flex items-center gap-3 p-2 border rounded">
                  <span className="text-xl">
                    {fieldTypes[field.type as keyof typeof fieldTypes].icon}
                  </span>
                  <span className="font-medium">{field.name}</span>
                  <span className="text-sm text-gray-500">
                    ({fieldTypes[field.type as keyof typeof fieldTypes].label})
                  </span>
                  {field.required && (
                    <span className="text-red-500 text-sm">Required</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white border rounded-lg p-6">
            {mockFields.map((field) => (
              <div key={field.id} className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  {field.name}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {renderField(field)}
              </div>
            ))}
          </div>
          
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => setFormData({})}>
              Clear Form
            </Button>
            <Button type="submit">
              Submit Form
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}