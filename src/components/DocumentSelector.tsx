import React, { useState } from 'react';

interface Document {
  name: string;
  path: string;
  category: string;
  modality?: string;
  color?: string;
}

type SectionVisibility = Record<string, boolean>;
type ModalityColors = Record<string, string>;

// Constants
const LOCATIONS = ['55th Street', '61st Street', 'Beekman', 'Broadway', 'DHK', 'LIC', 'Spiral', 'York'] as const;
const INVOICE_TYPES = ['CT', 'MRI', 'PET (FDG)', 'PET', 'US', 'Mammo', 'Xray'] as const;
const BULK_QUANTITIES = [1, 2, 3, 4, 5, 10, 15, 20, 25, 50] as const;

const MODALITY_COLORS: ModalityColors = {
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

// Form data
const SCREENING_FORMS: Document[] = [
  { name: 'MRI Questionnaire', path: '/documents/MRI Questionnaire.pdf', category: 'screening', modality: 'MRI', color: MODALITY_COLORS.MRI },
  { name: 'MRI Cardiovascular Form', path: '/documents/MRI Cardiovascular Form.pdf', category: 'screening', modality: 'MRI', color: MODALITY_COLORS.MRI },
  { name: 'MRI Gynecologic Questionnaire', path: '/documents/MRI Gynecologic Questionnaire.pdf', category: 'screening', modality: 'MRI', color: MODALITY_COLORS.MRI },
  { name: 'MRI Prostate Questionnaire', path: '/documents/MRI Prostate Questionnaire.pdf', category: 'screening', modality: 'MRI', color: MODALITY_COLORS.MRI },
  { name: 'MRI Screening Non-Patient', path: '/documents/MRI Screening Non-Patient.pdf', category: 'screening', modality: 'MRI', color: MODALITY_COLORS.MRI },
  
  { name: 'CT Questionnaire', path: '/documents/CT Questionnaire.pdf', category: 'screening', modality: 'CT', color: MODALITY_COLORS.CT },
  { name: 'CT Disease Definitions', path: '/documents/CT Questionnaire Disease Definitions.pdf', category: 'screening', modality: 'CT', color: MODALITY_COLORS.CT },
  { name: 'Cardiac Questionnaire', path: '/documents/Cardiac Questionnaire.pdf', category: 'screening', modality: 'CT', color: MODALITY_COLORS.CT },
  
  { name: 'PETCT Questionnaire', path: '/documents/PETCT Questionnaire.pdf', category: 'screening', modality: 'PET', color: MODALITY_COLORS.PET },
  { name: 'PETMRI Questionnaire', path: '/documents/PETMRI Questionnaire.pdf', category: 'screening', modality: 'PET', color: MODALITY_COLORS.PET },
  
  { name: 'Ultrasound General Questionnaire', path: '/documents/Ultrasound General Questionnaire.pdf', category: 'screening', modality: 'US', color: MODALITY_COLORS.US },
  { name: 'Ultrasound Gynecologic Questionnaire', path: '/documents/Ultrasound Gynecologic Questionnaire.pdf', category: 'screening', modality: 'US', color: MODALITY_COLORS.US },
  { name: 'Ultrasound Soft Tissue Questionnaire', path: '/documents/Ultrasound Soft Tissue Questionnaire.pdf', category: 'screening', modality: 'US', color: MODALITY_COLORS.US },
  
  { name: 'Dexa Questionnaire', path: '/documents/Dexa Questionnaire.pdf', category: 'screening', modality: 'DEXA', color: MODALITY_COLORS.DEXA },
  
  { name: 'X-Ray Questionnaire', path: '/documents/X-Ray Questionnaire.pdf', category: 'screening', modality: 'XRAY', color: MODALITY_COLORS['X-Ray'] },
  { name: 'Fluoro Questionnaire', path: '/documents/Fluoro Questionnaire.pdf', category: 'screening', modality: 'XRAY', color: MODALITY_COLORS['X-Ray'] },
];

const BREAST_FORMS: Document[] = [
  { name: 'Mammogram Visit Confirmation Form', path: '/documents/Mammogram Visit Confirmation Form.pdf', category: 'breast', color: MODALITY_COLORS.Breast },
  { name: 'Mammography History Sheet', path: '/documents/Mammography History Sheet.pdf', category: 'breast', color: MODALITY_COLORS.Breast },
  { name: 'Mammography Recall Form', path: '/documents/AOB Recalled Diag Mammo and Ultrasound Breast -2025.pdf', category: 'breast', color: MODALITY_COLORS.Breast },
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

const FINANCIAL_FORMS = {
  OFF_HOURS_WAIVER: '/documents/Waiver of Liability Form- Insurance Off-Hours.pdf',
  SELF_PAY_WAIVER: '/documents/Waiver of Liability Form - Self Pay.pdf',
} as const;

const QUICK_ADD_PATHS = {
  CHAPERONE: '/documents/Outpatient Medical Chaperone Form.pdf',
  MINOR_AUTH: '/documents/Minor Auth Form.pdf',
} as const;

export default function DocumentSelector(): React.ReactElement {
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [docQuantities, setDocQuantities] = useState<Record<string, number>>({});
  const [selectedAbnLocation, setSelectedAbnLocation] = useState<string>('');
  const [selectedInvoiceType, setSelectedInvoiceType] = useState<string>('');
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [bulkQuantity, setBulkQuantity] = useState(1);
  const [showQueueDetails, setShowQueueDetails] = useState(false);
  const [visibleSections, setVisibleSections] = useState<SectionVisibility>({
    MRI: true,
    CT: true,
    PET: true,
    US: true,
    Breast: true,
    'X-Ray': true,
    Financial: true,
    Other: false
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isPrinting, setIsPrinting] = useState(false);

  const allForms = [...SCREENING_FORMS, ...BREAST_FORMS, ...QUICK_ADD_FORMS, ...OTHER_FORMS];

  const toggleSection = (section: string): void => {
    setVisibleSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const filteredForms = allForms.filter(form => 
    form.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleDocument = (path: string): void => {
    setSelectedDocs(prev => {
      if (prev.includes(path)) {
        setDocQuantities(current => {
          const updated = { ...current };
          delete updated[path];
          return updated;
        });
        return prev.filter(p => p !== path);
      } else {
        setDocQuantities(current => ({ ...current, [path]: 1 }));
        return [...prev, path];
      }
    });
  };

  const updateQuantity = (path: string, quantity: number): void => {
    const clampedQuantity = Math.max(1, Math.min(99, quantity));
    setDocQuantities(prev => ({ ...prev, [path]: clampedQuantity }));
  };

  const removeDocument = (path: string): void => {
    setSelectedDocs(prev => prev.filter(p => p !== path));
    setDocQuantities(prev => {
      const updated = { ...prev };
      delete updated[path];
      return updated;
    });
  };

  const clearSelectedDocs = (): void => {
    setSelectedDocs([]);
    setDocQuantities({});
  };

  const unselectAllSections = (): void => {
    setVisibleSections(prev => 
      Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: false }), {})
    );
  };

  const selectAllSections = (): void => {
    setVisibleSections(prev => 
      Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: true }), {})
    );
  };

  const addFormByPath = (path: string): void => {
    if (!selectedDocs.includes(path)) {
      setSelectedDocs(prev => [...prev, path]);
      setDocQuantities(prev => ({ ...prev, [path]: 1 }));
    }
  };

  const addAbn = (): void => {
    if (selectedAbnLocation) {
      addFormByPath(`/documents/ABN/ABN - ${selectedAbnLocation}.pdf`);
    }
  };

  const addInvoice = (): void => {
    if (selectedInvoiceType) {
      addFormByPath(`/documents/Invoices/Invoice Form - ${selectedInvoiceType}.pdf`);
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
    return doc?.name || path.split('/').pop() || path;
  };

  // PDF processing functions
  const loadPDFLib = async () => {
    try {
      const { PDFDocument } = await import('pdf-lib');
      return { PDFDocument };
    } catch (error) {
      throw new Error('Failed to load PDF processing library');
    }
  };

  const fetchPDFs = async (paths: string[]): Promise<ArrayBuffer[]> => {
    const responses = await Promise.allSettled(
      paths.map(path => 
        fetch(path).then(response => {
          if (!response.ok) {
            throw new Error(`Failed to fetch ${path.split('/').pop()}: ${response.status}`);
          }
          return response.arrayBuffer();
        })
      )
    );

    const failed = responses.filter(r => r.status === 'rejected') as PromiseRejectedResult[];
    if (failed.length > 0) {
      throw new Error(`Failed to load ${failed.length} document(s)`);
    }

    return responses.map(r => (r as PromiseFulfilledResult<ArrayBuffer>).value);
  };

  const mergePDFs = async (pdfBuffers: ArrayBuffer[], documentPaths: string[]): Promise<Uint8Array> => {
    const { PDFDocument } = await loadPDFLib();
    const mergedPdf = await PDFDocument.create();
    
    if (isBulkMode) {
      // Bulk mode: add each document once
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

  const openPrintDialog = (pdfBytes: Uint8Array): void => {
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    
    const printWindow = window.open(url, '_blank');
    if (printWindow) {
      printWindow.addEventListener('load', () => {
        printWindow.print();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      });
    } else {
      // Fallback for popup blockers
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
      const pdfBuffers = await fetchPDFs(selectedDocs);
      const mergedPdfBytes = await mergePDFs(pdfBuffers, selectedDocs);
      openPrintDialog(mergedPdfBytes);
    } catch (error) {
      console.error('Print failed:', error);
      const message = error instanceof Error ? error.message : 'Failed to prepare documents for printing';
      alert(message + '. Please try again.');
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
        padding: '0.5rem',
        marginBottom: '0.25rem',
        backgroundColor: selectedDocs.includes(form.path) ? '#e7f3ff' : '#f8f9fa',
        borderRadius: '6px',
        borderLeft: form.color ? `4px solid ${form.color}` : '4px solid transparent',
        cursor: 'pointer',
        fontSize: '0.9em',
        transition: 'all 0.2s ease',
        boxShadow: selectedDocs.includes(form.path) ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
      }}
      onClick={() => toggleDocument(form.path)}
      onMouseEnter={(e) => {
        if (!selectedDocs.includes(form.path)) {
          e.currentTarget.style.backgroundColor = '#f1f5f9';
          e.currentTarget.style.transform = 'translateX(2px)';
        }
      }}
      onMouseLeave={(e) => {
        if (!selectedDocs.includes(form.path)) {
          e.currentTarget.style.backgroundColor = '#f8f9fa';
          e.currentTarget.style.transform = 'translateX(0)';
        }
      }}
    >
      <input
        type="checkbox"
        checked={selectedDocs.includes(form.path)}
        onChange={() => toggleDocument(form.path)}
        style={{ margin: 0, transform: 'scale(1.1)' }}
      />
      <span style={{ fontWeight: selectedDocs.includes(form.path) ? '500' : '400' }}>{form.name}</span>
    </div>
  );

  const renderToggleSwitch = () => (
    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9em' }}>
      <div 
        style={{ 
          width: '36px', 
          height: '20px', 
          backgroundColor: isBulkMode ? '#0d6efd' : '#dee2e6',
          borderRadius: '10px',
          position: 'relative',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }} 
        onClick={() => setIsBulkMode(!isBulkMode)}
      >
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
  );

  const renderSectionButton = (section: string, isVisible: boolean) => (
    <button
      key={section}
      onClick={() => toggleSection(section)}
      style={{
        padding: '0.5rem 1rem',
        border: `2px solid ${isVisible ? MODALITY_COLORS[section] : '#d1d5db'}`,
        backgroundColor: isVisible ? MODALITY_COLORS[section] : 'transparent',
        color: isVisible ? 'white' : '#9ca3af',
        borderRadius: '25px',
        fontSize: '0.85em',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: isVisible ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
      }}
      onMouseEnter={(e) => {
        if (!isVisible) {
          e.currentTarget.style.backgroundColor = MODALITY_COLORS[section];
          e.currentTarget.style.color = 'white';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isVisible) {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = '#9ca3af';
          e.currentTarget.style.transform = 'translateY(0)';
        }
      }}
    >
      {section}
    </button>
  );

  return (
    <div>
      {/* Comprehensive Header Bar */}
      <div style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 100, 
        backgroundColor: selectedDocs.length > 0 ? '#e7f3ff' : '#ffffff',
        border: selectedDocs.length > 0 ? '2px solid #0d6efd' : '1px solid #dee2e6',
        borderRadius: '12px',
        padding: '1rem',
        marginBottom: '1.5rem',
        boxShadow: selectedDocs.length > 0 ? '0 4px 12px rgba(13,110,253,0.15)' : '0 1px 3px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {/* Left: Cart Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontWeight: 'bold' }}>
              🛒 {selectedDocs.length} items, {getTotalCopies()} copies
            </span>
            {selectedDocs.length > 0 && (
              <button
                className="button button--outline button--sm"
                onClick={clearSelectedDocs}
                style={{ padding: '0.25rem 0.5rem', fontSize: '0.8em', color: '#dc3545' }}
              >
                Clear Cart
              </button>
            )}
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

          {/* Center: Search */}
          <div style={{ flex: '1', maxWidth: '300px', minWidth: '200px' }}>
            <input
              type="text"
              placeholder="🔍 Search all forms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ 
                width: '100%',
                padding: '0.375rem 0.75rem', 
                border: '1px solid #d1d5db', 
                borderRadius: '20px',
                fontSize: '0.9em'
              }}
            />
          </div>

          {/* Right: Quick Add + Controls + Print */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* Quick Add removed - moved to Other Forms section */}

            {/* Bulk Toggle */}
            {selectedDocs.length > 0 && (
              <>
                {renderToggleSwitch()}
                {isBulkMode && (
                  <select
                    value={bulkQuantity}
                    onChange={(e) => setBulkQuantity(Number(e.target.value))}
                    style={{ padding: '0.25rem', fontSize: '0.9em' }}
                  >
                    {BULK_QUANTITIES.map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                )}
              </>
            )}

            {/* Print Button */}
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

        {/* Selected Documents - Always Show When Items in Cart */}
        {selectedDocs.length > 0 && (
          <div style={{ 
            marginTop: '0.75rem', 
            padding: '0.75rem', 
            backgroundColor: '#fff', 
            borderRadius: '4px',
            border: '1px solid #e9ecef'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 'bold', fontSize: '0.9em' }}>Selected Documents</span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className="button button--outline button--sm"
                  onClick={() => setShowQueueDetails(!showQueueDetails)}
                  style={{ padding: '0.25rem 0.5rem', fontSize: '0.8em' }}
                >
                  {showQueueDetails ? 'Hide Details' : 'Show Details'}
                </button>
                <button
                  className="button button--outline button--sm"
                  onClick={clearSelectedDocs}
                  style={{ padding: '0.25rem 0.5rem', fontSize: '0.8em' }}
                >
                  Clear All
                </button>
              </div>
            </div>
            {/* Compact view - just document count and names */}
            {!showQueueDetails ? (
              <div style={{ fontSize: '0.85em', color: '#666' }}>
                {selectedDocs.slice(0, 3).map(path => getDocumentName(path)).join(', ')}
                {selectedDocs.length > 3 && ` +${selectedDocs.length - 3} more`}
              </div>
            ) : (
              /* Detailed view with quantity controls */
              selectedDocs.map(path => (
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
              ))
            )}
          </div>
        )}
      </div>

      {/* Section Controls */}
      <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        {(() => {
          const totalSections = Object.keys(visibleSections).length;
          const visibleCount = Object.values(visibleSections).filter(Boolean).length;
          const hiddenCount = totalSections - visibleCount;
          
          // Show "Expand All" when majority are hidden (60% or more)
          const shouldShowExpandAll = hiddenCount >= Math.ceil(totalSections * 0.6);
          // Show "Collapse All" when most are visible (75% or more) 
          const shouldShowCollapseAll = visibleCount >= Math.ceil(totalSections * 0.75);
          
          return (
            <>
              {shouldShowExpandAll && (
                <button
                  onClick={selectAllSections}
                  style={{ 
                    padding: '0.375rem 0.75rem',
                    fontSize: '0.8em',
                    fontWeight: '500',
                    backgroundColor: '#f8f9fa',
                    color: '#495057',
                    border: '1px solid #dee2e6',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    marginRight: '0.5rem'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#22c55e';
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.borderColor = '#22c55e';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8f9fa';
                    e.currentTarget.style.color = '#495057';
                    e.currentTarget.style.borderColor = '#dee2e6';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  ↗ Expand All ({hiddenCount} hidden)
                </button>
              )}
              
              {shouldShowCollapseAll && (
                <button
                  onClick={unselectAllSections}
                  style={{ 
                    padding: '0.375rem 0.75rem',
                    fontSize: '0.8em',
                    fontWeight: '500',
                    backgroundColor: '#f8f9fa',
                    color: '#495057',
                    border: '1px solid #dee2e6',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    marginRight: '0.5rem'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#6c757d';
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.borderColor = '#6c757d';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8f9fa';
                    e.currentTarget.style.color = '#495057';
                    e.currentTarget.style.borderColor = '#dee2e6';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  ↙ Collapse All
                </button>
              )}
            </>
          );
        })()}
        
        {Object.entries(visibleSections).map(([section, isVisible]) => 
          renderSectionButton(section, isVisible)
        )}
      </div>

      <div>
        {/* Quick Add Forms - Always at Top */}
        {!searchTerm && (
          <div style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #e9ecef' }}>
            <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '1rem', color: '#495057' }}>Quick Add</h4>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95em', fontWeight: '500' }}>
                <input
                  type="checkbox"
                  checked={selectedDocs.includes(QUICK_ADD_PATHS.CHAPERONE)}
                  onChange={() => toggleDocument(QUICK_ADD_PATHS.CHAPERONE)}
                  style={{ margin: 0, transform: 'scale(1.1)' }}
                />
                Medical Chaperone Form
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95em', fontWeight: '500' }}>
                <input
                  type="checkbox"
                  checked={selectedDocs.includes(QUICK_ADD_PATHS.MINOR_AUTH)}
                  onChange={() => toggleDocument(QUICK_ADD_PATHS.MINOR_AUTH)}
                  style={{ margin: 0, transform: 'scale(1.1)' }}
                />
                Minor Authorization Form
              </label>
            </div>
          </div>
        )}

        {/* Search Results */}
        {searchTerm ? (
          <div style={{ marginBottom: '0.75rem' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>Search Results ({filteredForms.length})</h4>
            {filteredForms.map(renderFormCheckbox)}
          </div>
        ) : (
          <>
            {/* Screening Forms by Modality */}
            {visibleSections.MRI && (
              <div style={{ marginBottom: '0.75rem' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: MODALITY_COLORS.MRI, fontSize: '1rem' }}>MRI Forms</h4>
                {SCREENING_FORMS.filter(f => f.modality === 'MRI').map(renderFormCheckbox)}
              </div>
            )}
            
            {visibleSections.CT && (
              <div style={{ marginBottom: '0.75rem' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: MODALITY_COLORS.CT, fontSize: '1rem' }}>CT Forms</h4>
                {SCREENING_FORMS.filter(f => f.modality === 'CT').map(renderFormCheckbox)}
              </div>
            )}
            
            {visibleSections.PET && (
              <div style={{ marginBottom: '0.75rem' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: MODALITY_COLORS.PET, fontSize: '1rem' }}>PET Forms</h4>
                {SCREENING_FORMS.filter(f => f.modality === 'PET').map(renderFormCheckbox)}
              </div>
            )}
            
            {visibleSections.US && (
              <div style={{ marginBottom: '0.75rem' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: MODALITY_COLORS.US, fontSize: '1rem' }}>Ultrasound Forms</h4>
                {SCREENING_FORMS.filter(f => f.modality === 'US').map(renderFormCheckbox)}
              </div>
            )}
            
            
            {visibleSections.Breast && (
              <div style={{ marginBottom: '0.75rem' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: MODALITY_COLORS.Breast, fontSize: '1rem' }}>Breast Imaging Forms</h4>
                {BREAST_FORMS.map(renderFormCheckbox)}
              </div>
            )}
            
            {visibleSections['X-Ray'] && (
              <div style={{ marginBottom: '0.75rem' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: MODALITY_COLORS['X-Ray'], fontSize: '1rem' }}>X-Ray & DEXA Forms</h4>
                {SCREENING_FORMS.filter(f => f.modality === 'DEXA').map(renderFormCheckbox)}
                {SCREENING_FORMS.filter(f => f.modality === 'XRAY').map(renderFormCheckbox)}
              </div>
            )}

            {/* Financial Forms */}
            {visibleSections.Financial && (
              <div style={{ marginBottom: '0.75rem' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: MODALITY_COLORS.Financial, fontSize: '1rem' }}>Financial Forms</h4>
                
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.375rem',
                  marginBottom: '0.25rem',
                  backgroundColor: selectedDocs.includes(FINANCIAL_FORMS.OFF_HOURS_WAIVER) ? '#e7f3ff' : '#f8f9fa',
                  borderRadius: '4px',
                  borderLeft: '3px solid #06b6d4',
                  cursor: 'pointer',
                  fontSize: '0.9em'
                }} onClick={() => toggleDocument(FINANCIAL_FORMS.OFF_HOURS_WAIVER)}>
                  <input
                    type="checkbox"
                    checked={selectedDocs.includes(FINANCIAL_FORMS.OFF_HOURS_WAIVER)}
                    onChange={() => toggleDocument(FINANCIAL_FORMS.OFF_HOURS_WAIVER)}
                    style={{ margin: 0 }}
                  />
                  <span>Insurance Off-Hours Waiver</span>
                </div>

                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.375rem',
                  marginBottom: '0.25rem',
                  backgroundColor: selectedDocs.includes(FINANCIAL_FORMS.SELF_PAY_WAIVER) ? '#e7f3ff' : '#f8f9fa',
                  borderRadius: '4px',
                  borderLeft: '3px solid #06b6d4',
                  cursor: 'pointer',
                  fontSize: '0.9em'
                }} onClick={() => toggleDocument(FINANCIAL_FORMS.SELF_PAY_WAIVER)}>
                  <input
                    type="checkbox"
                    checked={selectedDocs.includes(FINANCIAL_FORMS.SELF_PAY_WAIVER)}
                    onChange={() => toggleDocument(FINANCIAL_FORMS.SELF_PAY_WAIVER)}
                    style={{ margin: 0 }}
                  />
                  <span>Self-Pay Waiver</span>
                </div>

                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.375rem',
                  marginBottom: '0.25rem',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '4px',
                  borderLeft: '3px solid #06b6d4',
                  fontSize: '0.9em'
                }}>
                  <span>Invoice:</span>
                  <select 
                    value={selectedInvoiceType} 
                    onChange={(e) => setSelectedInvoiceType(e.target.value)}
                    style={{ padding: '0.25rem', fontSize: '0.9em', marginRight: '0.5rem' }}
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
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.8em' }}
                  >
                    Add
                  </button>
                </div>

                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.375rem',
                  marginBottom: '0.25rem',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '4px',
                  borderLeft: '3px solid #06b6d4',
                  fontSize: '0.9em'
                }}>
                  <span>ABN:</span>
                  <select 
                    value={selectedAbnLocation} 
                    onChange={(e) => setSelectedAbnLocation(e.target.value)}
                    style={{ padding: '0.25rem', fontSize: '0.9em', marginRight: '0.5rem' }}
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
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.8em' }}
                  >
                    Add
                  </button>
                </div>
              </div>
            )}

            {/* Other Forms */}
            {visibleSections.Other && (
              <div style={{ marginBottom: '0.75rem' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: MODALITY_COLORS.Other, fontSize: '1rem' }}>Other Forms</h4>
                {OTHER_FORMS.map(renderFormCheckbox)}
              </div>
            )}
          </>
        )}
      </div>
      
    </div>
  );
}