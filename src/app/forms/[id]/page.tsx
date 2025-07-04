'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import formTemplatesData from "@/data/form-templates.json";

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

export default function FormBuilderPage() {
  const params = useParams();
  const router = useRouter();
  const formId = Number(params.id);
  
  const template = formTemplatesData.templates.find(t => t.id === formId);
  
  const [formData, setFormData] = useState<Record<string, string | boolean>>({});
  const [isPreview, setIsPreview] = useState(false);
  
  if (!template) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Form not found</h1>
          <Button onClick={() => router.push('/forms')}>
            Back to Forms
          </Button>
        </div>
      </div>
    );
  }
  
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
      console.error('Submission error:', error);
      alert('Error submitting form');
    }
  };
  
  interface MockField {
    id: string;
    name: string;
    type: string;
    required: boolean;
    placeholder: string;
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
            checked={!!formData[field.id]}
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
          <div className="w-full h-32 border-2 border-dashed rounded-md flex items-center justify-center text-gray-400">
            Signature Pad (Click to sign)
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{template.name}</h1>
          <p className="text-muted-foreground mt-2">{template.description}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={isPreview ? "outline" : "default"}
            onClick={() => setIsPreview(!isPreview)}
          >
            {isPreview ? "Edit" : "Preview"}
          </Button>
          <Button variant="outline" onClick={() => router.push('/forms')}>
            Back
          </Button>
        </div>
      </div>
      
      {!isPreview ? (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Form Builder Mode</h3>
            <p className="text-sm text-gray-600">
              This form has {template.fields} fields. In a real implementation, 
              you would be able to drag and drop fields, configure validation, 
              and customize the layout.
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