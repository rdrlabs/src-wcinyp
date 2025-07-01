import React, { useState, useEffect } from 'react';

interface Document {
  name: string;
  path: string;
  category: string;
  modality?: string;
  color?: string;
}

const LOCATIONS = ['55th Street', '61st Street', 'Beekman', 'Broadway', 'DHK', 'LIC', 'Spiral', 'York'];
const INVOICE_TYPES = ['CT', 'MRI', 'PET (FDG)', 'PET', 'US', 'Mammo', 'Xray'];

const SCREENING_FORMS: Document[] = [
  { name: 'MRI Questionnaire', path: '/documents/MRI Questionnaire.pdf', category: 'screening', modality: 'MRI', color: '#22c55e' },
  { name: 'MRI Cardiovascular Form', path: '/documents/MRI Cardiovascular Form.pdf', category: 'screening', modality: 'MRI', color: '#22c55e' },
  { name: 'MRI Gynecologic Questionnaire', path: '/documents/MRI Gynecologic Questionnaire.pdf', category: 'screening', modality: 'MRI', color: '#22c55e' },
  { name: 'MRI Prostate Questionnaire', path: '/documents/MRI Prostate Questionnaire.pdf', category: 'screening', modality: 'MRI', color: '#22c55e' },
  { name: 'MRI Screening Non-Patient', path: '/documents/MRI Screening Non-Patient.pdf', category: 'screening', modality: 'MRI', color: '#22c55e' },
  
  { name: 'CT Questionnaire', path: '/documents/CT Questionnaire.pdf', category: 'screening', modality: 'CT', color: '#3b82f6' },
  { name: 'CT Disease Definitions', path: '/documents/CT Questionnaire Disease Definitions.pdf', category: 'screening', modality: 'CT', color: '#3b82f6' },
  { name: 'Cardiac Questionnaire', path: '/documents/Cardiac Questionnaire.pdf', category: 'screening', modality: 'CT', color: '#3b82f6' },
  
  { name: 'PETCT Questionnaire', path: '/documents/PETCT Questionnaire.pdf', category: 'screening', modality: 'PET', color: '#8b5cf6' },
  { name: 'PETMRI Questionnaire', path: '/documents/PETMRI Questionnaire.pdf', category: 'screening', modality: 'PET', color: '#8b5cf6' },
  
  { name: 'Ultrasound General Questionnaire', path: '/documents/Ultrasound General Questionnaire.pdf', category: 'screening', modality: 'US', color: '#f97316' },
  { name: 'Ultrasound Gynecologic Questionnaire', path: '/documents/Ultrasound Gynecologic Questionnaire.pdf', category: 'screening', modality: 'US', color: '#f97316' },
  { name: 'Ultrasound Soft Tissue Questionnaire', path: '/documents/Ultrasound Soft Tissue Questionnaire.pdf', category: 'screening', modality: 'US', color: '#f97316' },
  
  { name: 'Dexa Questionnaire', path: '/documents/Dexa Questionnaire.pdf', category: 'screening', modality: 'DEXA', color: '#6b7280' },
  
  { name: 'X-Ray Questionnaire', path: '/documents/X-Ray Questionnaire.pdf', category: 'screening', modality: 'XRAY', color: '#ef4444' },
  { name: 'Fluoro Questionnaire', path: '/documents/Fluoro Questionnaire.pdf', category: 'screening', modality: 'XRAY', color: '#ef4444' },
];

const BREAST_FORMS: Document[] = [
  { name: 'Mammogram Visit Confirmation Form', path: '/documents/Mammogram Visit Confirmation Form.pdf', category: 'breast', color: '#ec4899' },
  { name: 'Mammography History Sheet', path: '/documents/Mammography History Sheet.pdf', category: 'breast', color: '#ec4899' },
  { name: 'Mammography Recall Form', path: '/documents/AOB Recalled Diag Mammo and Ultrasound Breast -2025.pdf', category: 'breast', color: '#ec4899' },
];

const QUICK_ADD_FORMS: Document[] = [
  { name: 'Medical Chaperone Form', path: '/documents/Outpatient Medical Chaperone Form.pdf', category: 'quickadd' },
  { name: 'Minor Authorization Form', path: '/documents/Minor Auth Form.pdf', category: 'quickadd' },
];

const OTHER_FORMS: Document[] = [
  { name: 'Change Verbal Order Forms', path: '/documents/Change Verbal Order Forms.pdf', category: 'other' },
  { name: 'Appointment Verification Letter', path: '/documents/Appointment Verification Letter.pdf', category: 'other' },
  { name: 'General Medical Records Release Form', path: '/documents/General Medical Records Release Form.pdf', category: 'other' },
];

export default function DocumentSelector(): React.ReactElement {
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [docQuantities, setDocQuantities] = useState<Record<string, number>>({});
  const [selectedAbnLocation, setSelectedAbnLocation] = useState<string>('');
  const [selectedInvoiceType, setSelectedInvoiceType] = useState<string>('');
  const [showOtherForms, setShowOtherForms] = useState(false);
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [bulkQuantity, setBulkQuantity] = useState(1);
  const [showQueueDetails, setShowQueueDetails] = useState(false);

  const allForms = [...SCREENING_FORMS, ...BREAST_FORMS, ...QUICK_ADD_FORMS, ...OTHER_FORMS];

  const toggleDocument = (path: string): void => {
    setSelectedDocs(prev => {
      if (prev.includes(path)) {
        // Remove document and its quantity
        const newQuantities = { ...docQuantities };
        delete newQuantities[path];
        setDocQuantities(newQuantities);
        return prev.filter(p => p !== path);
      } else {
        // Add document with default quantity
        setDocQuantities(prev => ({ ...prev, [path]: 1 }));
        return [...prev, path];
      }
    });
  };

  const updateQuantity = (path: string, quantity: number): void => {
    setDocQuantities(prev => ({ ...prev, [path]: Math.max(1, Math.min(99, quantity)) }));
  };

  const removeDocument = (path: string): void => {
    setSelectedDocs(prev => prev.filter(p => p !== path));
    setDocQuantities(prev => {
      const newQuantities = { ...prev };
      delete newQuantities[path];
      return newQuantities;
    });
  };

  const clearAll = (): void => {
    setSelectedDocs([]);
    setDocQuantities({});
  };

  const addAbn = (): void => {
    if (selectedAbnLocation) {
      const abnPath = `/documents/ABN/ABN - ${selectedAbnLocation}.pdf`;
      if (!selectedDocs.includes(abnPath)) {
        setSelectedDocs(prev => [...prev, abnPath]);
      }
    }
  };

  const addInvoice = (): void => {
    if (selectedInvoiceType) {
      const invoicePath = `/documents/Invoices/Invoice Form - ${selectedInvoiceType}.pdf`;
      if (!selectedDocs.includes(invoicePath)) {
        setSelectedDocs(prev => [...prev, invoicePath]);
      }
    }
  };

  const getTotalCopies = (): number => {
    if (isBulkMode) {
      return selectedDocs.length * bulkQuantity;
    }
    return selectedDocs.reduce((total, path) => total + (docQuantities[path] || 1), 0);
  };

  const getDocumentName = (path: string): string => {
    const doc = allForms.find(f => f.path === path);
    return doc ? doc.name : path.split('/').pop() || path;
  };

  const handlePrint = (): void => {
    if (selectedDocs.length === 0) {
      alert('Please select at least one document to print');
      return;
    }
    
    selectedDocs.forEach(path => {
      const copies = isBulkMode ? bulkQuantity : (docQuantities[path] || 1);
      for (let i = 0; i < copies; i++) {
        window.open(path, '_blank');
      }
    });
  };

  const renderFormCheckbox = (form: Document) => (
    <div 
      key={form.path}
      className={`alert ${selectedDocs.includes(form.path) ? 'alert--info' : 'alert--secondary'}`}
      style={{ 
        cursor: 'pointer', 
        marginBottom: '0.5rem',
        borderLeft: form.color ? `4px solid ${form.color}` : undefined
      }}
      onClick={() => toggleDocument(form.path)}
    >
      <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <input
          type="checkbox"
          checked={selectedDocs.includes(form.path)}
          onChange={() => toggleDocument(form.path)}
        />
        {form.name}
      </label>
    </div>
  );

  return (
    <div>
      {/* Floating Print Bar */}
      <div style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 100, 
        backgroundColor: selectedDocs.length > 0 ? '#e7f3ff' : '#f8f9fa',
        border: '1px solid #dee2e6',
        borderRadius: '8px',
        padding: '1rem',
        marginBottom: '1rem',
        boxShadow: selectedDocs.length > 0 ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
        transition: 'all 0.2s ease'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontWeight: 'bold', fontSize: '1.1em' }}>
              🛒 Print Queue: {selectedDocs.length} {selectedDocs.length === 1 ? 'item' : 'items'}
            </span>
            {selectedDocs.length > 0 && (
              <>
                <button
                  className={`button button--sm ${isBulkMode ? 'button--primary' : 'button--outline'}`}
                  onClick={() => setIsBulkMode(!isBulkMode)}
                >
                  {isBulkMode ? 'Bulk Mode' : 'Individual Mode'}
                </button>
                {isBulkMode && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>All:</span>
                    <select
                      value={bulkQuantity}
                      onChange={(e) => setBulkQuantity(Number(e.target.value))}
                      style={{ padding: '0.25rem' }}
                    >
                      {[1,2,3,4,5,10,15,20,25,50].map(n => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                )}
                <button
                  className="button button--outline button--sm"
                  onClick={() => setShowQueueDetails(!showQueueDetails)}
                >
                  {showQueueDetails ? 'Hide Details' : 'Show Details'}
                </button>
              </>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {selectedDocs.length > 0 && (
              <span style={{ fontSize: '0.9em', color: '#666' }}>
                Total: {getTotalCopies()} copies
              </span>
            )}
            <button
              className="button button--primary"
              onClick={handlePrint}
              disabled={selectedDocs.length === 0}
              style={{ fontWeight: 'bold' }}
            >
              PRINT {selectedDocs.length > 0 ? getTotalCopies() : ''} ↗
            </button>
          </div>
        </div>

        {/* Queue Details */}
        {showQueueDetails && selectedDocs.length > 0 && (
          <div style={{ 
            marginTop: '1rem', 
            padding: '1rem', 
            backgroundColor: '#fff', 
            borderRadius: '4px',
            border: '1px solid #e9ecef'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <h4 style={{ margin: 0 }}>Selected Documents</h4>
              <button
                className="button button--outline button--sm"
                onClick={clearAll}
              >
                Clear All
              </button>
            </div>
            {selectedDocs.map(path => (
              <div key={path} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '0.5rem',
                backgroundColor: '#f8f9fa',
                borderRadius: '4px',
                marginBottom: '0.5rem'
              }}>
                <span style={{ flex: 1 }}>{getDocumentName(path)}</span>
                {!isBulkMode && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                      className="button button--outline button--sm"
                      onClick={() => updateQuantity(path, (docQuantities[path] || 1) - 1)}
                      disabled={(docQuantities[path] || 1) <= 1}
                    >
                      -
                    </button>
                    <span style={{ minWidth: '2rem', textAlign: 'center' }}>
                      {docQuantities[path] || 1}
                    </span>
                    <button
                      className="button button--outline button--sm"
                      onClick={() => updateQuantity(path, (docQuantities[path] || 1) + 1)}
                      disabled={(docQuantities[path] || 1) >= 99}
                    >
                      +
                    </button>
                  </div>
                )}
                <button
                  className="button button--outline button--sm"
                  onClick={() => removeDocument(path)}
                  style={{ marginLeft: '0.5rem', color: '#dc3545' }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
      {/* Screening Forms */}
      <div className="card margin-bottom--md">
        <div className="card__header">
          <h3>Screening Forms</h3>
        </div>
        <div className="card__body">
          {SCREENING_FORMS.map(renderFormCheckbox)}
        </div>
      </div>

      {/* Breast Imaging Forms */}
      <div className="card margin-bottom--md">
        <div className="card__header">
          <h3>Breast Imaging Forms</h3>
        </div>
        <div className="card__body">
          {BREAST_FORMS.map(renderFormCheckbox)}
        </div>
      </div>

      {/* Quick Add */}
      <div className="card margin-bottom--md">
        <div className="card__header">
          <h3>Quick Add</h3>
        </div>
        <div className="card__body">
          {QUICK_ADD_FORMS.map(renderFormCheckbox)}
        </div>
      </div>

      {/* Financial Forms */}
      <div className="card margin-bottom--md">
        <div className="card__header">
          <h3>Financial Forms</h3>
        </div>
        <div className="card__body">
          {/* Insurance Off-Hours Waiver */}
          <div 
            className={`alert ${selectedDocs.includes('/documents/Waiver of Liability Form- Insurance Off-Hours.pdf') ? 'alert--info' : 'alert--secondary'}`}
            style={{ cursor: 'pointer', marginBottom: '0.5rem' }}
            onClick={() => toggleDocument('/documents/Waiver of Liability Form- Insurance Off-Hours.pdf')}
          >
            <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                checked={selectedDocs.includes('/documents/Waiver of Liability Form- Insurance Off-Hours.pdf')}
                onChange={() => toggleDocument('/documents/Waiver of Liability Form- Insurance Off-Hours.pdf')}
              />
              Insurance Off-Hours Waiver
            </label>
          </div>

          {/* Self-Pay Waiver */}
          <div 
            className={`alert ${selectedDocs.includes('/documents/Waiver of Liability Form - Self Pay.pdf') ? 'alert--info' : 'alert--secondary'}`}
            style={{ cursor: 'pointer', marginBottom: '0.5rem' }}
            onClick={() => toggleDocument('/documents/Waiver of Liability Form - Self Pay.pdf')}
          >
            <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                checked={selectedDocs.includes('/documents/Waiver of Liability Form - Self Pay.pdf')}
                onChange={() => toggleDocument('/documents/Waiver of Liability Form - Self Pay.pdf')}
              />
              Self-Pay Waiver
            </label>
          </div>

          {/* Invoice */}
          <div className="alert alert--secondary" style={{ marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>Invoice:</span>
              <select 
                value={selectedInvoiceType} 
                onChange={(e) => setSelectedInvoiceType(e.target.value)}
                style={{ padding: '0.25rem', marginRight: '0.5rem' }}
              >
                <option value="">Select Type</option>
                {INVOICE_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <button 
                className="button button--outline button--primary button--sm"
                onClick={addInvoice}
                disabled={!selectedInvoiceType}
              >
                Add
              </button>
            </div>
          </div>

          {/* ABN */}
          <div className="alert alert--secondary" style={{ marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>ABN:</span>
              <select 
                value={selectedAbnLocation} 
                onChange={(e) => setSelectedAbnLocation(e.target.value)}
                style={{ padding: '0.25rem', marginRight: '0.5rem' }}
              >
                <option value="">Select Location</option>
                {LOCATIONS.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
              <button 
                className="button button--outline button--primary button--sm"
                onClick={addAbn}
                disabled={!selectedAbnLocation}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Other Forms */}
      <div className="card margin-bottom--md">
        <div className="card__header" onClick={() => setShowOtherForms(!showOtherForms)} style={{ cursor: 'pointer' }}>
          <h3>Other Forms {showOtherForms ? '▼' : '▶'}</h3>
        </div>
        {showOtherForms && (
          <div className="card__body">
            {OTHER_FORMS.map(renderFormCheckbox)}
          </div>
        )}
      </div>
      
    </div>
    </div>
  );
}