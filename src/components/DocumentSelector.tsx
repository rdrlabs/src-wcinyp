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
  
  { name: 'Dexa Questionnaire', path: '/documents/Dexa Questionnaire.pdf', category: 'screening', modality: 'DEXA', color: MODALITY_COLORS['X-Ray'] },
  
  { name: 'X-Ray Questionnaire', path: '/documents/X-Ray Questionnaire.pdf', category: 'screening', modality: 'XRAY', color: MODALITY_COLORS['X-Ray'] },
  { name: 'Fluoro Questionnaire', path: '/documents/Fluoro Questionnaire.pdf', category: 'screening', modality: 'XRAY', color: MODALITY_COLORS['X-Ray'] },
];

const BREAST_FORMS: Document[] = [
  { name: 'Mammography History Sheet', path: '/documents/Mammography History Sheet.pdf', category: 'breast', color: MODALITY_COLORS.Breast },
  { name: 'Biopsy Questionnaire', path: '/documents/Biopsy Questionnaire.pdf', category: 'breast', color: MODALITY_COLORS.Breast },
  { name: 'Mammography Recall Form', path: '/documents/AOB Recalled Diag Mammo and Ultrasound Breast -2025.pdf', category: 'breast', color: MODALITY_COLORS.Breast },
  { name: 'Mam/US Recall Form', path: '/documents/Mammogram Visit Confirmation Form.pdf', category: 'breast', color: MODALITY_COLORS.Breast },
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

  const renderFormCheckbox = (form: Document) => {
    const isSelected = selectedDocs.includes(form.path);
    
    return (
      <div 
        key={form.path}
        style={{ 
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem',
          marginBottom: '0.25rem',
          backgroundColor: isSelected ? '#e7f3ff' : '#f8f9fa',
          borderRadius: '6px',
          borderLeft: form.color ? `4px solid ${form.color}` : '4px solid transparent',
          cursor: 'pointer',
          fontSize: '0.9em',
          transition: 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)',
          boxShadow: isSelected ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
          transform: 'translateX(0)',
          willChange: 'transform, background-color'
        }}
        onClick={(e) => {
          e.preventDefault();
          toggleDocument(form.path);
        }}
        onMouseEnter={(e) => {
          if (!isSelected) {
            e.currentTarget.style.backgroundColor = '#f1f5f9';
            e.currentTarget.style.transform = 'translateX(2px)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isSelected) {
            e.currentTarget.style.backgroundColor = '#f8f9fa';
            e.currentTarget.style.transform = 'translateX(0)';
          }
        }}
      >
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => {
            e.stopPropagation();
            toggleDocument(form.path);
          }}
          style={{ 
            margin: 0, 
            transform: 'scale(1.1)',
            transition: 'transform 0.1s ease'
          }}
        />
        <span style={{ 
          fontWeight: isSelected ? '500' : '400',
          transition: 'font-weight 0.2s ease',
          userSelect: 'none'
        }}>
          {form.name}
        </span>
      </div>
    );
  };

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
        transition: 'all 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)',
        boxShadow: isVisible ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
        transform: 'translateY(0)',
        willChange: 'transform, background-color, color'
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
    <div style={{ 
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#f8f9fa'
    }}>
      {/* Sidebar */}
      <div style={{
        width: '280px',
        backgroundColor: '#ffffff',
        borderRight: '1px solid #dee2e6',
        position: 'fixed',
        height: '100vh',
        overflowY: 'auto',
        zIndex: 100,
        padding: '1.5rem 1rem',
        boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
        '@media (max-width: 768px)': {
          transform: 'translateX(-100%)',
          transition: 'transform 0.3s ease'
        }
      }}>
        {/* Search */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ margin: '0 0 0.75rem 0', fontSize: '1.1rem', fontWeight: '600', color: '#374151' }}>Search Documents</h3>
          <input
            type="text"
            placeholder="🔍 Search forms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              width: '100%',
              padding: '0.75rem', 
              border: '2px solid #e5e7eb', 
              borderRadius: '8px',
              fontSize: '0.9em',
              transition: 'border-color 0.2s ease'
            }}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          />
        </div>

        {/* Cart Summary */}
        <div style={{ 
          marginBottom: '1.5rem',
          padding: '1rem',
          backgroundColor: selectedDocs.length > 0 ? '#eff6ff' : '#f9fafb',
          borderRadius: '8px',
          border: selectedDocs.length > 0 ? '2px solid #3b82f6' : '1px solid #e5e7eb',
          transition: 'all 0.2s ease'
        }}>
          <h3 style={{ margin: '0 0 0.75rem 0', fontSize: '1.1rem', fontWeight: '600', color: '#374151' }}>
            Print Queue ({selectedDocs.length})
          </h3>
          
          <div style={{ marginBottom: '0.75rem' }}>
            <span style={{ 
              fontSize: '0.9em',
              color: selectedDocs.length > 0 ? '#1d4ed8' : '#6b7280',
              fontWeight: '500'
            }}>
              {selectedDocs.length} items, {getTotalCopies()} copies
            </span>
          </div>

          {selectedDocs.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {/* Bulk Toggle */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {renderToggleSwitch()}
                {isBulkMode && (
                  <select
                    value={bulkQuantity}
                    onChange={(e) => setBulkQuantity(Number(e.target.value))}
                    style={{ 
                      padding: '0.25rem', 
                      fontSize: '0.85em',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px'
                    }}
                  >
                    {BULK_QUANTITIES.map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button
                  className="button button--primary"
                  onClick={handlePrint}
                  disabled={isPrinting}
                  style={{ 
                    width: '100%',
                    fontWeight: 'bold', 
                    padding: '0.75rem'
                  }}
                >
                  {isPrinting ? 'Preparing...' : `PRINT ${getTotalCopies()} ↗`}
                </button>
                
                <button
                  className="button button--outline"
                  onClick={clearSelectedDocs}
                  style={{ 
                    width: '100%',
                    padding: '0.5rem',
                    fontSize: '0.85em',
                    color: '#dc3545',
                    borderColor: '#dc3545'
                  }}
                >
                  Clear All
                </button>
              </div>

              {/* Selected Items Preview */}
              <div style={{ 
                marginTop: '0.5rem',
                padding: '0.75rem',
                backgroundColor: '#ffffff',
                borderRadius: '6px',
                border: '1px solid #e5e7eb',
                maxHeight: '120px',
                overflowY: 'auto'
              }}>
                <div style={{ fontSize: '0.8em', fontWeight: '600', marginBottom: '0.5rem', color: '#374151' }}>
                  Selected:
                </div>
                {selectedDocs.slice(0, 5).map(path => (
                  <div key={path} style={{ 
                    fontSize: '0.75em', 
                    color: '#6b7280',
                    marginBottom: '0.25rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span>{getDocumentName(path)}</span>
                    <span>×{docQuantities[path] || 1}</span>
                  </div>
                ))}
                {selectedDocs.length > 5 && (
                  <div style={{ fontSize: '0.75em', color: '#9ca3af', fontStyle: 'italic' }}>
                    +{selectedDocs.length - 5} more items
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Quick Add */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ margin: '0 0 0.75rem 0', fontSize: '1.1rem', fontWeight: '600', color: '#374151' }}>Quick Add</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              padding: '0.5rem',
              backgroundColor: selectedDocs.includes(QUICK_ADD_PATHS.CHAPERONE) ? '#eff6ff' : '#f9fafb',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease'
            }}>
              <input
                type="checkbox"
                checked={selectedDocs.includes(QUICK_ADD_PATHS.CHAPERONE)}
                onChange={() => toggleDocument(QUICK_ADD_PATHS.CHAPERONE)}
                style={{ margin: 0 }}
              />
              <span style={{ fontSize: '0.9em', fontWeight: '500' }}>Medical Chaperone</span>
            </label>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              padding: '0.5rem',
              backgroundColor: selectedDocs.includes(QUICK_ADD_PATHS.MINOR_AUTH) ? '#eff6ff' : '#f9fafb',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease'
            }}>
              <input
                type="checkbox"
                checked={selectedDocs.includes(QUICK_ADD_PATHS.MINOR_AUTH)}
                onChange={() => toggleDocument(QUICK_ADD_PATHS.MINOR_AUTH)}
                style={{ margin: 0 }}
              />
              <span style={{ fontSize: '0.9em', fontWeight: '500' }}>Minor Authorization</span>
            </label>
          </div>
        </div>

        {/* Section Filters */}
        <div>
          <h3 style={{ margin: '0 0 0.75rem 0', fontSize: '1.1rem', fontWeight: '600', color: '#374151' }}>Form Sections</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {Object.entries(visibleSections).map(([section, isVisible]) => (
              <button
                key={section}
                onClick={() => toggleSection(section)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.5rem 0.75rem',
                  backgroundColor: isVisible ? MODALITY_COLORS[section] : '#f9fafb',
                  color: isVisible ? 'white' : '#6b7280',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.85em',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  if (!isVisible) {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isVisible) {
                    e.currentTarget.style.backgroundColor = '#f9fafb';
                  }
                }}
              >
                <span>{section}</span>
                <span style={{ fontSize: '0.75em' }}>
                  {isVisible ? '●' : '○'}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{
        marginLeft: '280px',
        padding: '2rem',
        flex: 1,
        minHeight: '100vh',
        '@media (max-width: 768px)': {
          marginLeft: '0',
          padding: '1rem'
        }
      }}>
        <div style={{ maxWidth: '1200px' }}>

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
      
    </div>
  );
}