'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFormFields } from '@/contexts/form-context';
import type { FormField } from '@/types';
import { PlusCircle } from 'lucide-react';

const fieldTypes = [
  { value: 'text', label: 'Text Input' },
  { value: 'email', label: 'Email' },
  { value: 'tel', label: 'Phone' },
  { value: 'number', label: 'Number' },
  { value: 'date', label: 'Date' },
  { value: 'select', label: 'Dropdown' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'radio', label: 'Radio' },
  { value: 'textarea', label: 'Text Area' },
  { value: 'file', label: 'File Upload' },
  { value: 'signature', label: 'Signature' }
];

export function FieldBuilder() {
  const { addField } = useFormFields();
  const [isAdding, setIsAdding] = useState(false);
  const [newField, setNewField] = useState<Partial<FormField>>({
    type: 'text',
    required: false,
    label: '',
    placeholder: ''
  });

  const handleAddField = () => {
    if (!newField.label) return;

    const field: FormField = {
      id: `field_${Date.now()}`,
      label: newField.label,
      type: newField.type as FormField['type'],
      required: newField.required || false,
      placeholder: newField.placeholder,
      options: newField.type === 'select' || newField.type === 'radio' 
        ? ['Option 1', 'Option 2', 'Option 3'] 
        : undefined
    };

    addField(field);
    setNewField({
      type: 'text',
      required: false,
      label: '',
      placeholder: ''
    });
    setIsAdding(false);
  };

  if (!isAdding) {
    return (
      <Button 
        type="button"
        variant="outline" 
        className="w-full"
        onClick={() => setIsAdding(true)}
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Add New Field
      </Button>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Field</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="field-label">Field Label</Label>
          <Input
            id="field-label"
            value={newField.label || ''}
            onChange={(e) => setNewField({ ...newField, label: e.target.value })}
            placeholder="Enter field label"
          />
        </div>

        <div>
          <Label htmlFor="field-type">Field Type</Label>
          <Select
            value={newField.type}
            onValueChange={(value) => setNewField({ ...newField, type: value as FormField['type'] })}
          >
            <SelectTrigger id="field-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fieldTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="field-placeholder">Placeholder Text</Label>
          <Input
            id="field-placeholder"
            value={newField.placeholder || ''}
            onChange={(e) => setNewField({ ...newField, placeholder: e.target.value })}
            placeholder="Enter placeholder text"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="field-required"
            checked={newField.required || false}
            onCheckedChange={(checked) => setNewField({ ...newField, required: checked })}
          />
          <Label htmlFor="field-required">Required field</Label>
        </div>

        <div className="flex gap-2 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setIsAdding(false);
              setNewField({
                type: 'text',
                required: false,
                label: '',
                placeholder: ''
              });
            }}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleAddField}
            disabled={!newField.label}
          >
            Add Field
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}