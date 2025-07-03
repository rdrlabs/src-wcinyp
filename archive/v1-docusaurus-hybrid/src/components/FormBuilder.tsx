import React, { useState } from 'react';

interface FormField {
  label: string;
  value: string;
  type?: 'text' | 'date' | 'number';
}

const INITIAL_FORM_DATA: FormField[] = [
  { label: 'Patient Name', value: '', type: 'text' },
  { label: 'Date of Birth', value: '', type: 'date' },
  { label: 'Service Date', value: '', type: 'date' },
  { label: 'Amount Due', value: '', type: 'number' },
];

export default function FormBuilder(): React.ReactElement {
  const [formData, setFormData] = useState<FormField[]>(INITIAL_FORM_DATA);

  const handleFieldChange = (index: number, value: string): void => {
    setFormData(prev => 
      prev.map((field, i) => 
        i === index ? { ...field, value } : field
      )
    );
  };

  const handlePrint = (): void => {
    window.print();
  };

  const handleReset = (): void => {
    setFormData(INITIAL_FORM_DATA);
  };

  const isFormEmpty = formData.every(field => !field.value.trim());

  return (
    <div>
      <div className="card margin-bottom--lg">
        <div className="card__header">
          <h2 className="text--center">Self-Pay Agreement Form</h2>
        </div>
        <div className="card__body">
          {formData.map((field, index) => (
            <div key={field.label} className="margin-bottom--md">
              <label className="margin-bottom--sm" style={{ display: 'block', fontWeight: 'bold' }}>
                {field.label}:
              </label>
              <input
                type={field.type || 'text'}
                value={field.value}
                onChange={(e) => handleFieldChange(index, e.target.value)}
                placeholder={`Enter ${field.label.toLowerCase()}`}
                className="input"
                style={{ width: '100%' }}
              />
            </div>
          ))}
        </div>
      </div>
      
      <div className="text--center">
        <button 
          className="button button--secondary margin-right--sm"
          onClick={handleReset}
          disabled={isFormEmpty}
        >
          Clear Form
        </button>
        <button 
          className="button button--primary"
          onClick={handlePrint}
        >
          Print Form
        </button>
      </div>
    </div>
  );
}