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
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [bulkQuantity, setBulkQuantity] = useState(1);
  const [showQueueDetails, setShowQueueDetails] = useState(false);
  const [visibleSections, setVisibleSections] = useState({
    MRI: true,
    CT: true,
    PET: true,
    US: true,
    DEXA: true,
    Breast: true,
    'X-Ray': true,
    Financial: true,
    Other: false
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grouped' | 'list'>('grouped');
  const [isPrinting, setIsPrinting] = useState(false);

  const allForms = [...SCREENING_FORMS, ...BREAST_FORMS, ...QUICK_ADD_FORMS, ...OTHER_FORMS];

  const toggleSection = (section: string) => {
    setVisibleSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const filteredForms = allForms.filter(form => 
    form.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  // Lazy load PDF-lib only when needed
  const loadPDFLib = async () => {
    const { PDFDocument } = await import('pdf-lib');
    return { PDFDocument };
  };

  // Fetch PDFs in parallel for efficiency
  const fetchPDFs = async (paths: string[]) => {
    try {
      const responses = await Promise.all(
        paths.map(path => fetch(path).then(response => {
          if (!response.ok) throw new Error(`Failed to fetch ${path}`);
          return response.arrayBuffer();
        }))
      );
      return responses;
    } catch (error) {
      console.error('Failed to fetch PDFs:', error);
      throw error;
    }
  };

  // Efficient PDF merging with memory management
  const mergePDFs = async (pdfBuffers: ArrayBuffer[], documentPaths: string[]) => {
    const { PDFDocument } = await loadPDFLib();
    const mergedPdf = await PDFDocument.create();
    
    // In individual mode, add each document the specified number of times
    // In bulk mode, add all documents once, then user prints the specified bulk quantity
    if (isBulkMode) {
      // Bulk mode: add each document once, user will print bulkQuantity copies
      for (const buffer of pdfBuffers) {
        const pdf = await PDFDocument.load(buffer);
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        pages.forEach(page => mergedPdf.addPage(page));
      }
    } else {
      // Individual mode: add each document the specified number of times
      for (let i = 0; i < documentPaths.length; i++) {
        const buffer = pdfBuffers[i];
        const path = documentPaths[i];
        const copies = docQuantities[path] || 1;
        
        for (let copy = 0; copy < copies; copy++) {
          const pdf = await PDFDocument.load(buffer);
          const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
          pages.forEach(page => mergedPdf.addPage(page));
        }
      }
    }
    
    return mergedPdf.save();
  };

  // Create blob URL and trigger print
  const openPrintDialog = (pdfBytes: Uint8Array) => {
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    
    // Open in new window and trigger print dialog
    const printWindow = window.open(url, '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
        // Clean up blob URL after a delay
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      };
    } else {
      // Fallback if popup blocked
      const link = document.createElement('a');
      link.href = url;
      link.download = 'selected-documents.pdf';
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const handlePrint = async (): Promise<void> => {
    if (selectedDocs.length === 0) {
      alert('Please select at least one document to print');
      return;
    }
    
    setIsPrinting(true);
    
    try {
      // Fetch all PDFs in parallel
      const pdfBuffers = await fetchPDFs(selectedDocs);
      
      // Merge PDFs efficiently
      const mergedPdfBytes = await mergePDFs(pdfBuffers, selectedDocs);
      
      // Open print dialog
      openPrintDialog(mergedPdfBytes);
      
    } catch (error) {
      console.error('Print failed:', error);
      alert('Failed to prepare documents for printing. Please try again.');
    } finally {
      setIsPrinting(false);
    }
  };

  const renderFormCheckbox = (form: Document) => (
    <div 
      key={form.path}
      style={{ 
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.375rem',
        marginBottom: '0.25rem',
        backgroundColor: selectedDocs.includes(form.path) ? '#e7f3ff' : '#f8f9fa',
        borderRadius: '4px',
        borderLeft: form.color ? `3px solid ${form.color}` : '3px solid transparent',
        cursor: 'pointer',
        fontSize: '0.9em',
        transition: 'all 0.15s ease'
      }}
      onClick={() => toggleDocument(form.path)}
    >
      <input
        type="checkbox"
        checked={selectedDocs.includes(form.path)}
        onChange={() => toggleDocument(form.path)}
        style={{ margin: 0 }}
      />
      <span>{form.name}</span>
    </div>
  );

  return (
    <div>
      {/* Compact Header Bar */}
      <div style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 100, 
        backgroundColor: selectedDocs.length > 0 ? '#e7f3ff' : '#f8f9fa',
        border: '1px solid #dee2e6',
        borderRadius: '6px',
        padding: '0.75rem',
        marginBottom: '1rem',
        boxShadow: selectedDocs.length > 0 ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
        transition: 'all 0.2s ease'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontWeight: 'bold' }}>
              🛒 {selectedDocs.length} items, {getTotalCopies()} copies
            </span>
            {selectedDocs.length > 0 && (
              <button
                className="button button--outline button--sm"
                onClick={() => setShowQueueDetails(!showQueueDetails)}
                style={{ padding: '0.25rem 0.5rem' }}
              >
                Details {showQueueDetails ? '▲' : '▼'}
              </button>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {selectedDocs.length > 0 && (
              <>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9em' }}>
                  <div style={{ 
                    width: '36px', 
                    height: '20px', 
                    backgroundColor: isBulkMode ? '#0d6efd' : '#dee2e6',
                    borderRadius: '10px',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }} onClick={() => setIsBulkMode(!isBulkMode)}>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      backgroundColor: 'white',
                      borderRadius: '50%',
                      position: 'absolute',
                      top: '2px',
                      left: isBulkMode ? '18px' : '2px',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }} />
                  </div>
                  Bulk
                </label>
                {isBulkMode && (
                  <select
                    value={bulkQuantity}
                    onChange={(e) => setBulkQuantity(Number(e.target.value))}
                    style={{ padding: '0.25rem', fontSize: '0.9em' }}
                  >
                    {[1,2,3,4,5,10,15,20,25,50].map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                )}
              </>
            )}
            <button
              className="button button--primary"
              onClick={handlePrint}
              disabled={selectedDocs.length === 0 || isPrinting}
              style={{ fontWeight: 'bold', padding: '0.5rem 1rem' }}
            >
              {isPrinting ? 'Preparing...' : `PRINT ${selectedDocs.length > 0 ? getTotalCopies() : ''} ↗`}
            </button>
          </div>
        </div>

        {/* Queue Details */}
        {showQueueDetails && selectedDocs.length > 0 && (
          <div style={{ 
            marginTop: '0.75rem', 
            padding: '0.75rem', 
            backgroundColor: '#fff', 
            borderRadius: '4px',
            border: '1px solid #e9ecef'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 'bold', fontSize: '0.9em' }}>Selected Documents</span>
              <button
                className="button button--outline button--sm"
                onClick={clearAll}
                style={{ padding: '0.25rem 0.5rem', fontSize: '0.8em' }}
              >
                Clear All
              </button>
            </div>
            {selectedDocs.map(path => (
              <div key={path} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '0.375rem',
                backgroundColor: '#f8f9fa',
                borderRadius: '3px',
                marginBottom: '0.25rem',
                fontSize: '0.9em'
              }}>
                <span style={{ flex: 1 }}>{getDocumentName(path)}</span>
                {!isBulkMode && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <button
                      className="button button--outline button--sm"
                      onClick={() => updateQuantity(path, (docQuantities[path] || 1) - 1)}
                      disabled={(docQuantities[path] || 1) <= 1}
                      style={{ padding: '0.125rem 0.375rem', fontSize: '0.8em' }}
                    >
                      -
                    </button>
                    <span style={{ minWidth: '1.5rem', textAlign: 'center', fontSize: '0.8em' }}>
                      {docQuantities[path] || 1}
                    </span>
                    <button
                      className="button button--outline button--sm"
                      onClick={() => updateQuantity(path, (docQuantities[path] || 1) + 1)}
                      disabled={(docQuantities[path] || 1) >= 99}
                      style={{ padding: '0.125rem 0.375rem', fontSize: '0.8em' }}
                    >
                      +
                    </button>
                  </div>
                )}
                <button
                  className="button button--outline button--sm"
                  onClick={() => removeDocument(path)}
                  style={{ marginLeft: '0.5rem', color: '#dc3545', padding: '0.125rem 0.375rem', fontSize: '0.8em' }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Add */}
      <div style={{ marginBottom: '0.75rem' }}>
        <span style={{ fontWeight: 'bold', marginRight: '1rem' }}>Quick:</span>
        {QUICK_ADD_FORMS.map(form => (
          <label key={form.path} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginRight: '1rem', fontSize: '0.9em' }}>
            <input
              type="checkbox"
              checked={selectedDocs.includes(form.path)}
              onChange={() => toggleDocument(form.path)}
            />
            {form.name.replace(' Form', '')}
          </label>
        ))}
      </div>

      {/* View Controls */}
      <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {Object.entries(visibleSections).map(([section, isVisible]) => {
            const colors = {
              MRI: '#22c55e',
              CT: '#3b82f6', 
              PET: '#8b5cf6',
              US: '#f97316',
              DEXA: '#6b7280',
              Breast: '#ec4899',
              'X-Ray': '#ef4444',
              Financial: '#06b6d4',
              Other: '#64748b'
            };
            return (
              <button
                key={section}
                onClick={() => toggleSection(section)}
                style={{
                  padding: '0.375rem 0.75rem',
                  border: `2px solid ${isVisible ? colors[section] : '#d1d5db'}`,
                  backgroundColor: 'transparent',
                  color: isVisible ? colors[section] : '#9ca3af',
                  borderRadius: '20px',
                  fontSize: '0.8em',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {section}
              </button>
            );
          })}
        </div>
        {isBulkMode && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="text"
              placeholder="Search forms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ 
                padding: '0.375rem 0.75rem', 
                border: '1px solid #d1d5db', 
                borderRadius: '20px',
                fontSize: '0.9em',
                width: '200px'
              }}
            />
          </div>
        )}
      </div>

      <div>
        {/* List View for Bulk Mode */}
        {isBulkMode && searchTerm ? (
          <div style={{ marginBottom: '0.75rem' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>Search Results ({filteredForms.length})</h4>
            {filteredForms.map(renderFormCheckbox)}
          </div>
        ) : (
          <>
            {/* Screening Forms by Modality */}
            {visibleSections.MRI && (
              <div style={{ marginBottom: '0.75rem' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#22c55e', fontSize: '1rem' }}>MRI Forms</h4>
                {SCREENING_FORMS.filter(f => f.modality === 'MRI').map(renderFormCheckbox)}
              </div>
            )}
            
            {visibleSections.CT && (
              <div style={{ marginBottom: '0.75rem' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#3b82f6', fontSize: '1rem' }}>CT Forms</h4>
                {SCREENING_FORMS.filter(f => f.modality === 'CT').map(renderFormCheckbox)}
              </div>
            )}
            
            {visibleSections.PET && (
              <div style={{ marginBottom: '0.75rem' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#8b5cf6', fontSize: '1rem' }}>PET Forms</h4>
                {SCREENING_FORMS.filter(f => f.modality === 'PET').map(renderFormCheckbox)}
              </div>
            )}
            
            {visibleSections.US && (
              <div style={{ marginBottom: '0.75rem' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#f97316', fontSize: '1rem' }}>Ultrasound Forms</h4>
                {SCREENING_FORMS.filter(f => f.modality === 'US').map(renderFormCheckbox)}
              </div>
            )}
            
            {visibleSections.DEXA && (
              <div style={{ marginBottom: '0.75rem' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#6b7280', fontSize: '1rem' }}>DEXA Forms</h4>
                {SCREENING_FORMS.filter(f => f.modality === 'DEXA').map(renderFormCheckbox)}
              </div>
            )}
            
            {visibleSections.Breast && (
              <div style={{ marginBottom: '0.75rem' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#ec4899', fontSize: '1rem' }}>Breast Imaging Forms</h4>
                {BREAST_FORMS.map(renderFormCheckbox)}
              </div>
            )}
            
            {visibleSections['X-Ray'] && (
              <div style={{ marginBottom: '0.75rem' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#ef4444', fontSize: '1rem' }}>X-Ray Forms</h4>
                {SCREENING_FORMS.filter(f => f.modality === 'XRAY').map(renderFormCheckbox)}
              </div>
            )}

            {/* Financial Forms */}
            {visibleSections.Financial && (
              <div style={{ marginBottom: '0.75rem' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#06b6d4', fontSize: '1rem' }}>Financial Forms</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', fontSize: '0.9em' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <input
                      type="checkbox"
                      checked={selectedDocs.includes('/documents/Waiver of Liability Form- Insurance Off-Hours.pdf')}
                      onChange={() => toggleDocument('/documents/Waiver of Liability Form- Insurance Off-Hours.pdf')}
                    />
                    Off-Hours Waiver
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <input
                      type="checkbox"
                      checked={selectedDocs.includes('/documents/Waiver of Liability Form - Self Pay.pdf')}
                      onChange={() => toggleDocument('/documents/Waiver of Liability Form - Self Pay.pdf')}
                    />
                    Self-Pay Waiver
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>Invoice:</span>
                    <select 
                      value={selectedInvoiceType} 
                      onChange={(e) => setSelectedInvoiceType(e.target.value)}
                      style={{ padding: '0.25rem', fontSize: '0.8em' }}
                    >
                      <option value="">Type</option>
                      {INVOICE_TYPES.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    <button 
                      className="button button--outline button--primary button--sm"
                      onClick={addInvoice}
                      disabled={!selectedInvoiceType}
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.8em' }}
                    >
                      Add
                    </button>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>ABN:</span>
                    <select 
                      value={selectedAbnLocation} 
                      onChange={(e) => setSelectedAbnLocation(e.target.value)}
                      style={{ padding: '0.25rem', fontSize: '0.8em' }}
                    >
                      <option value="">Location</option>
                      {LOCATIONS.map(location => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>
                    <button 
                      className="button button--outline button--primary button--sm"
                      onClick={addAbn}
                      disabled={!selectedAbnLocation}
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.8em' }}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Other Forms */}
            {visibleSections.Other && (
              <div style={{ marginBottom: '0.75rem' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#64748b', fontSize: '1rem' }}>Other Forms</h4>
                {OTHER_FORMS.map(renderFormCheckbox)}
              </div>
            )}
          </>
        )}
      </div>
      
    </div>
  );
}