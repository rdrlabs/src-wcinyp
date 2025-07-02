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
  General: '#64748b',
  MRI: '#10b981',
  CT: '#3b82f6', 
  PET: '#8b5cf6',
  US: '#f59e0b',
  DEXA: '#64748b',
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

const GENERAL_FORMS: Document[] = [
  { name: 'Medical Chaperone Form', path: '/documents/Outpatient Medical Chaperone Form.pdf', category: 'general', modality: 'General', color: MODALITY_COLORS.Other },
  { name: 'Minor Authorization Form', path: '/documents/Minor Auth Form.pdf', category: 'general', modality: 'General', color: MODALITY_COLORS.Other },
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


export default function DocumentSelector(): React.ReactElement {
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [docQuantities, setDocQuantities] = useState<Record<string, number>>({});
  const [selectedAbnLocation, setSelectedAbnLocation] = useState<string>('');
  const [selectedInvoiceType, setSelectedInvoiceType] = useState<string>('');
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [bulkQuantity, setBulkQuantity] = useState(1);
  const [showQueueDetails, setShowQueueDetails] = useState(false);
  const [visibleSections, setVisibleSections] = useState<SectionVisibility>({
    General: true,
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

  const allForms = [...SCREENING_FORMS, ...BREAST_FORMS, ...GENERAL_FORMS, ...OTHER_FORMS];

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

  // Print handling - opens each PDF in its own window for individual print settings

  const handlePrint = async (): Promise<void> => {
    if (selectedDocs.length === 0) {
      alert('Please select at least one document to print');
      return;
    }
    
    setIsPrinting(true);
    
    try {
      // Open each document in its own popup for individual print settings
      for (const path of selectedDocs) {
        const copies = isBulkMode ? bulkQuantity : (docQuantities[path] || 1);
        
        // Open the same document multiple times if needed
        for (let i = 0; i < copies; i++) {
          const printWindow = window.open(path, '_blank');
          if (printWindow) {
            // Wait a bit to ensure the window is loaded
            setTimeout(() => {
              printWindow.print();
            }, 500);
          } else {
            throw new Error('Unable to open print dialog. Please check your popup blocker settings.');
          }
          
          // Small delay between opening multiple windows
          if (i < copies - 1 || path !== selectedDocs[selectedDocs.length - 1]) {
            await new Promise(resolve => setTimeout(resolve, 300));
          }
        }
      }
    } catch (error) {
      console.error('Print failed:', error);
      const message = error instanceof Error ? error.message : 'Failed to prepare documents for printing';
      alert(message);
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
          gap: '12px',
          padding: '12px 16px',
          marginBottom: '8px',
          backgroundColor: isSelected ? '#f0f9ff' : 'white',
          borderRadius: '8px',
          borderLeft: form.color ? `4px solid ${form.color}` : '4px solid transparent',
          border: isSelected ? '1px solid #0284c7' : '1px solid #e2e8f0',
          cursor: 'pointer',
          fontSize: '14px',
          transition: 'all 0.2s ease',
          transform: 'translateX(0)'
        }}
        onClick={(e) => {
          e.preventDefault();
          toggleDocument(form.path);
        }}
        onMouseEnter={(e) => {
          if (!isSelected) {
            e.currentTarget.style.backgroundColor = '#f8fafc';
            e.currentTarget.style.transform = 'translateX(2px)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isSelected) {
            e.currentTarget.style.backgroundColor = 'white';
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
          fontWeight: isSelected ? '600' : '500',
          color: '#1e293b',
          userSelect: 'none'
        }}>
          {form.name}
        </span>
      </div>
    );
  };

  const renderToggleSwitch = () => (
    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '500', color: '#1e293b' }}>
      <div 
        style={{ 
          width: '40px', 
          height: '20px', 
          backgroundColor: isBulkMode ? '#3b82f6' : '#d1d5db',
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
          left: isBulkMode ? '22px' : '2px',
          transition: 'all 0.2s ease',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }} />
      </div>
      Bulk Mode
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
      backgroundColor: '#f8fafc'
    }}>
      {/* Sidebar */}
      <div style={{
        width: '280px',
        backgroundColor: 'white',
        borderRight: '1px solid #e2e8f0',
        position: 'fixed',
        height: '100vh',
        overflowY: 'auto',
        zIndex: 100,
        padding: '24px 20px',
        boxShadow: '2px 0 8px rgba(0,0,0,0.05)'
      }}>
        {/* Print Queue Summary */}
        <div style={{ 
          marginBottom: '20px',
          padding: '16px',
          backgroundColor: selectedDocs.length > 0 ? '#f0f9ff' : '#f8fafc',
          borderRadius: '8px',
          border: selectedDocs.length > 0 ? '1px solid #3b82f6' : '1px solid #e2e8f0',
          transition: 'all 0.2s ease'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: '12px'
          }}>
            <h3 style={{ 
              margin: 0, 
              fontSize: '16px', 
              fontWeight: '600', 
              color: '#1e293b' 
            }}>
              Print Queue
            </h3>
            <span style={{
              fontSize: '14px',
              fontWeight: '600',
              color: selectedDocs.length > 0 ? '#3b82f6' : '#64748b'
            }}>
              {selectedDocs.length} items
            </span>
          </div>
          
          <div style={{ marginBottom: '12px' }}>
            <span style={{ 
              fontSize: '13px',
              color: selectedDocs.length > 0 ? '#0369a1' : '#64748b',
              fontWeight: '500'
            }}>
              Total copies: {getTotalCopies()}
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
                      padding: '4px 8px', 
                      fontSize: '13px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      backgroundColor: 'white',
                      color: '#1e293b',
                      fontWeight: '500',
                      cursor: 'pointer',
                      outline: 'none'
                    }}
                  >
                    {BULK_QUANTITIES.map(n => (
                      <option key={n} value={n}>{n} copies</option>
                    ))}
                  </select>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button
                  onClick={handlePrint}
                  disabled={isPrinting}
                  style={{ 
                    width: '100%',
                    padding: '10px 16px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: isPrinting ? 'not-allowed' : 'pointer',
                    opacity: isPrinting ? 0.7 : 1,
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isPrinting) {
                      e.currentTarget.style.backgroundColor = '#2563eb';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#3b82f6';
                  }}
                >
                  {isPrinting ? 'Opening Print Dialogs...' : `Print ${getTotalCopies()} Copies`}
                </button>
                
                <button
                  onClick={clearSelectedDocs}
                  style={{ 
                    width: '100%',
                    padding: '8px 16px',
                    backgroundColor: 'white',
                    color: '#dc2626',
                    border: '1px solid #dc2626',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#fef2f2';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                  }}
                >
                  Clear All
                </button>
              </div>

              {/* Selected Items Preview */}
              <div style={{ 
                marginTop: '8px',
                padding: '12px',
                backgroundColor: 'white',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                maxHeight: '120px',
                overflowY: 'auto'
              }}>
                <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '8px', color: '#1e293b' }}>
                  Selected Documents:
                </div>
                {selectedDocs.slice(0, 5).map(path => (
                  <div key={path} style={{ 
                    fontSize: '12px', 
                    color: '#64748b',
                    marginBottom: '4px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: '8px' }}>
                      {getDocumentName(path)}
                    </span>
                    <span style={{ fontWeight: '600', flexShrink: 0 }}>×{isBulkMode ? bulkQuantity : (docQuantities[path] || 1)}</span>
                  </div>
                ))}
                {selectedDocs.length > 5 && (
                  <div style={{ fontSize: '11px', color: '#94a3b8', fontStyle: 'italic', marginTop: '4px' }}>
                    +{selectedDocs.length - 5} more documents
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Search */}
        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              width: '100%',
              padding: '10px 12px 10px 36px', 
              border: '1px solid #d1d5db', 
              borderRadius: '8px',
              fontSize: '14px',
              backgroundColor: 'white',
              outline: 'none',
              transition: 'all 0.2s ease',
              paddingLeft: '36px'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#3b82f6';
              e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#d1d5db';
              e.target.style.boxShadow = 'none';
            }}
          />
          <div style={{
            position: 'absolute',
            left: '32px',
            top: '164px',
            color: '#64748b',
            fontSize: '16px',
            pointerEvents: 'none'
          }}>🔍</div>
        </div>


        {/* Section Filters */}
        <div>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>Form Sections</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {Object.entries(visibleSections).map(([section, isVisible]) => (
              <button
                key={section}
                onClick={() => toggleSection(section)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  backgroundColor: isVisible ? MODALITY_COLORS[section] : 'white',
                  color: isVisible ? 'white' : '#374151',
                  border: `1px solid ${isVisible ? MODALITY_COLORS[section] : '#d1d5db'}`,
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'left',
                  width: '100%'
                }}
                onMouseEnter={(e) => {
                  if (!isVisible) {
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isVisible) {
                    e.currentTarget.style.backgroundColor = 'white';
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
        flex: 1,
        minHeight: '100vh',
        backgroundColor: '#f8fafc'
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: 'white',
          padding: '24px 32px',
          borderBottom: '1px solid #e2e8f0'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ 
              fontSize: '24px',
              fontWeight: '600',
              color: '#1e293b',
              margin: 0,
              letterSpacing: '-0.025em'
            }}>
              Document Hub
            </h1>
          </div>
        </div>

        {/* Content */}
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto',
          padding: '32px'
        }}>

        {/* Search Results */}
        {searchTerm ? (
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ 
              margin: '0 0 12px 0', 
              fontSize: '16px',
              fontWeight: '600',
              color: '#1e293b'
            }}>Search Results ({filteredForms.length})</h4>
            {filteredForms.map(renderFormCheckbox)}
          </div>
        ) : (
          <>
            {/* General Forms */}
            {visibleSections.General && (
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ 
                  margin: '0 0 12px 0', 
                  color: MODALITY_COLORS.General, 
                  fontSize: '16px',
                  fontWeight: '600'
                }}>General Forms</h4>
                {GENERAL_FORMS.map(renderFormCheckbox)}
              </div>
            )}

            {/* Screening Forms by Modality */}
            {visibleSections.MRI && (
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ 
                  margin: '0 0 12px 0', 
                  color: MODALITY_COLORS.MRI, 
                  fontSize: '16px',
                  fontWeight: '600'
                }}>MRI Forms</h4>
                {SCREENING_FORMS.filter(f => f.modality === 'MRI').map(renderFormCheckbox)}
              </div>
            )}
            
            {visibleSections.CT && (
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ 
                  margin: '0 0 12px 0', 
                  color: MODALITY_COLORS.CT, 
                  fontSize: '16px',
                  fontWeight: '600'
                }}>CT Forms</h4>
                {SCREENING_FORMS.filter(f => f.modality === 'CT').map(renderFormCheckbox)}
              </div>
            )}
            
            {visibleSections.PET && (
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ 
                  margin: '0 0 12px 0', 
                  color: MODALITY_COLORS.PET, 
                  fontSize: '16px',
                  fontWeight: '600'
                }}>PET Forms</h4>
                {SCREENING_FORMS.filter(f => f.modality === 'PET').map(renderFormCheckbox)}
              </div>
            )}
            
            {visibleSections.US && (
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ 
                  margin: '0 0 12px 0', 
                  color: MODALITY_COLORS.US, 
                  fontSize: '16px',
                  fontWeight: '600'
                }}>Ultrasound Forms</h4>
                {SCREENING_FORMS.filter(f => f.modality === 'US').map(renderFormCheckbox)}
              </div>
            )}
            
            
            {visibleSections.Breast && (
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ 
                  margin: '0 0 12px 0', 
                  color: MODALITY_COLORS.Breast, 
                  fontSize: '16px',
                  fontWeight: '600'
                }}>Breast Imaging Forms</h4>
                {BREAST_FORMS.map(renderFormCheckbox)}
              </div>
            )}
            
            {visibleSections['X-Ray'] && (
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ 
                  margin: '0 0 12px 0', 
                  color: MODALITY_COLORS['X-Ray'], 
                  fontSize: '16px',
                  fontWeight: '600'
                }}>X-Ray & DEXA Forms</h4>
                {SCREENING_FORMS.filter(f => f.modality === 'DEXA').map(renderFormCheckbox)}
                {SCREENING_FORMS.filter(f => f.modality === 'XRAY').map(renderFormCheckbox)}
              </div>
            )}

            {/* Financial Forms */}
            {visibleSections.Financial && (
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ 
                  margin: '0 0 12px 0', 
                  color: MODALITY_COLORS.Financial, 
                  fontSize: '16px',
                  fontWeight: '600'
                }}>Financial Forms</h4>
                
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
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ 
                  margin: '0 0 12px 0', 
                  color: MODALITY_COLORS.Other, 
                  fontSize: '16px',
                  fontWeight: '600'
                }}>Other Forms</h4>
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