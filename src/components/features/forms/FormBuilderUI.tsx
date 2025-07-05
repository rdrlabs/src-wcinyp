'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Save, Eye, Trash2, MoveUp, MoveDown } from 'lucide-react';
import { toast } from 'sonner';

interface FormField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'phone' | 'date' | 'select' | 'checkbox' | 'textarea';
  required: boolean;
  placeholder?: string;
  options?: string[];
}

export function FormBuilderUI() {
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [fields, setFields] = useState<FormField[]>([]);
  const [isPreview, setIsPreview] = useState(false);

  const fieldTypes = [
    { value: 'text', label: 'Text Input' },
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },
    { value: 'date', label: 'Date' },
    { value: 'select', label: 'Dropdown' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'textarea', label: 'Text Area' },
  ];

  const addField = () => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      label: 'New Field',
      type: 'text',
      required: false,
      placeholder: '',
    };
    setFields([...fields, newField]);
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map(field => 
      field.id === id ? { ...field, ...updates } : field
    ));
  };

  const deleteField = (id: string) => {
    setFields(fields.filter(field => field.id !== id));
  };

  const moveField = (index: number, direction: 'up' | 'down') => {
    const newFields = [...fields];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < fields.length) {
      [newFields[index], newFields[newIndex]] = [newFields[newIndex], newFields[index]];
      setFields(newFields);
    }
  };

  const saveForm = () => {
    // TODO: Implement save to Netlify Function or database
    // Would save: { name: formName, description: formDescription, fields, createdAt }
    // In production, save to Netlify Function or GitHub
    toast.success('Form template saved!', {
      description: 'Your form has been saved successfully.'
    });
  };

  if (isPreview) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Preview Mode</h3>
          <Button onClick={() => setIsPreview(false)} variant="outline">
            Back to Editor
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{formName || 'Untitled Form'}</CardTitle>
            <CardDescription>{formDescription || 'No description'}</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              {fields.map(field => (
                <div key={field.id}>
                  <label className="block text-sm font-medium mb-1">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea 
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder={field.placeholder}
                      rows={4}
                    />
                  ) : field.type === 'select' ? (
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map((opt, idx) => (
                          <SelectItem key={idx} value={opt}>{opt}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : field.type === 'checkbox' ? (
                    <input type="checkbox" className="h-4 w-4" />
                  ) : (
                    <input 
                      type={field.type}
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder={field.placeholder}
                    />
                  )}
                </div>
              ))}
              <Button type="button" className="w-full">Submit Form</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Form Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Form Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Form Name</label>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter form name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter form description"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Form Fields */}
      <Card>
        <CardHeader>
          <CardTitle>Form Fields</CardTitle>
          <CardDescription>Add and configure form fields</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {fields.map((field, index) => (
            <Card key={field.id} className="p-4">
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={field.label}
                    onChange={(e) => updateField(field.id, { label: e.target.value })}
                    className="flex-1 px-3 py-2 border rounded-md"
                    placeholder="Field label"
                  />
                  <Select
                    value={field.type}
                    onValueChange={(value) => updateField(field.id, { type: value as FormField['type'] })}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fieldTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={field.placeholder || ''}
                    onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                    className="flex-1 px-3 py-2 border rounded-md"
                    placeholder="Placeholder text"
                  />
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={field.required}
                      onChange={(e) => updateField(field.id, { required: e.target.checked })}
                    />
                    <span className="text-sm">Required</span>
                  </label>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => moveField(index, 'up')}
                      disabled={index === 0}
                    >
                      <MoveUp className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => moveField(index, 'down')}
                      disabled={index === fields.length - 1}
                    >
                      <MoveDown className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteField(field.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
          
          <Button onClick={addField} variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Field
          </Button>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button onClick={() => setIsPreview(true)} variant="outline">
          <Eye className="h-4 w-4 mr-2" />
          Preview
        </Button>
        <Button onClick={saveForm} disabled={!formName || fields.length === 0}>
          <Save className="h-4 w-4 mr-2" />
          Save Form
        </Button>
      </div>
    </div>
  );
}