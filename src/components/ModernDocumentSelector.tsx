import React, { useState, useCallback, useMemo } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Search, FileText, Printer, Trash2 } from 'lucide-react';

interface Document {
  name: string;
  path: string;
  category: 'general' | 'screening' | 'financial';
  modality?: string;
  color?: string;
}

const MODALITY_COLORS = {
  General: '#64748b',
  Financial: '#dc2626',
  MRI: '#3b82f6',
  CT: '#10b981',
  PET: '#f59e0b',
  US: '#8b5cf6',
  Other: '#64748b'
};

const GENERAL_FORMS: Document[] = [
  { name: 'Minor Auth Form', path: '/documents/Minor Auth Form.pdf', category: 'general', color: MODALITY_COLORS.General },
  { name: 'Outpatient Medical Chaperone Form', path: '/documents/Outpatient Medical Chaperone Form.pdf', category: 'general', color: MODALITY_COLORS.General },
  { name: 'General Medical Records Release Form', path: '/documents/General Medical Records Release Form.pdf', category: 'general', color: MODALITY_COLORS.General },
];

const FINANCIAL_FORMS: Document[] = [
  { name: 'Waiver of Liability Form - Self Pay', path: '/documents/Waiver of Liability Form - Self Pay.pdf', category: 'financial', color: MODALITY_COLORS.Financial },
  { name: 'Waiver of Liability Form- Insurance Off-Hours', path: '/documents/Waiver of Liability Form- Insurance Off-Hours.pdf', category: 'financial', color: MODALITY_COLORS.Financial },
];

const SCREENING_FORMS: Document[] = [
  { name: 'MRI Questionnaire', path: '/documents/MRI Questionnaire.pdf', category: 'screening', modality: 'MRI', color: MODALITY_COLORS.MRI },
  { name: 'MRI Cardiovascular Form', path: '/documents/MRI Cardiovascular Form.pdf', category: 'screening', modality: 'MRI', color: MODALITY_COLORS.MRI },
  { name: 'MRI Gynecologic Questionnaire', path: '/documents/MRI Gynecologic Questionnaire.pdf', category: 'screening', modality: 'MRI', color: MODALITY_COLORS.MRI },
  { name: 'MRI Prostate Questionnaire', path: '/documents/MRI Prostate Questionnaire.pdf', category: 'screening', modality: 'MRI', color: MODALITY_COLORS.MRI },
  { name: 'CT Questionnaire', path: '/documents/CT Questionnaire.pdf', category: 'screening', modality: 'CT', color: MODALITY_COLORS.CT },
  { name: 'Cardiac Questionnaire', path: '/documents/Cardiac Questionnaire.pdf', category: 'screening', modality: 'CT', color: MODALITY_COLORS.CT },
  { name: 'PETCT Questionnaire', path: '/documents/PETCT Questionnaire.pdf', category: 'screening', modality: 'PET', color: MODALITY_COLORS.PET },
  { name: 'PETMRI Questionnaire', path: '/documents/PETMRI Questionnaire.pdf', category: 'screening', modality: 'PET', color: MODALITY_COLORS.PET },
  { name: 'Ultrasound General Questionnaire', path: '/documents/Ultrasound General Questionnaire.pdf', category: 'screening', modality: 'US', color: MODALITY_COLORS.US },
  { name: 'Ultrasound Gynecologic Questionnaire', path: '/documents/Ultrasound Gynecologic Questionnaire.pdf', category: 'screening', modality: 'US', color: MODALITY_COLORS.US },
  { name: 'Ultrasound Soft Tissue Questionnaire', path: '/documents/Ultrasound Soft Tissue Questionnaire.pdf', category: 'screening', modality: 'US', color: MODALITY_COLORS.US },
  { name: 'X-Ray Questionnaire', path: '/documents/X-Ray Questionnaire.pdf', category: 'screening', modality: 'Other', color: MODALITY_COLORS.Other },
  { name: 'Fluoro Questionnaire', path: '/documents/Fluoro Questionnaire.pdf', category: 'screening', modality: 'Other', color: MODALITY_COLORS.Other },
];

const ALL_DOCUMENTS = [...GENERAL_FORMS, ...FINANCIAL_FORMS, ...SCREENING_FORMS];
const BULK_QUANTITIES = [1, 2, 3, 4, 5, 10, 15, 20, 25, 50];

const ModernDocumentSelector = React.memo(function ModernDocumentSelector(): React.ReactElement {
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleSections, setVisibleSections] = useState({
    General: true,
    Financial: true,
    MRI: true,
    CT: true,
    PET: true,
    US: true
  });
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [bulkQuantity, setBulkQuantity] = useState(1);
  const [docQuantities, setDocQuantities] = useState<Record<string, number>>({});
  const [isPrinting, setIsPrinting] = useState(false);

  const toggleDocument = useCallback((docPath: string): void => {
    setSelectedDocs(prev => 
      prev.includes(docPath) 
        ? prev.filter(path => path !== docPath)
        : [...prev, docPath]
    );
    
    if (!selectedDocs.includes(docPath) && !isBulkMode) {
      setDocQuantities(prev => ({ ...prev, [docPath]: 1 }));
    }
  }, [selectedDocs, isBulkMode]);

  const toggleSection = useCallback((section: keyof typeof visibleSections): void => {
    setVisibleSections(prev => ({ ...prev, [section]: !prev[section] }));
  }, []);

  const clearSelectedDocs = useCallback((): void => {
    setSelectedDocs([]);
    setDocQuantities({});
  }, []);

  const getTotalCopies = useCallback((): number => {
    if (isBulkMode) {
      return selectedDocs.length * bulkQuantity;
    }
    return selectedDocs.reduce((total, docPath) => total + (docQuantities[docPath] || 1), 0);
  }, [selectedDocs, isBulkMode, bulkQuantity, docQuantities]);

  const filteredDocuments = useMemo(() => {
    return ALL_DOCUMENTS.filter(doc => {
      const matchesSearch = searchTerm === '' || 
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (doc.modality && doc.modality.toLowerCase().includes(searchTerm.toLowerCase()));
      
      if (doc.category === 'general') {
        return matchesSearch && visibleSections.General;
      }
      
      if (doc.category === 'financial') {
        return matchesSearch && visibleSections.Financial;
      }
      
      if (doc.modality) {
        const sectionKey = doc.modality as keyof typeof visibleSections;
        return matchesSearch && visibleSections[sectionKey];
      }
      
      return matchesSearch;
    });
  }, [searchTerm, visibleSections]);

  const handlePrint = useCallback(async (): Promise<void> => {
    if (selectedDocs.length === 0) {
      alert('Please select at least one document to print');
      return;
    }

    setIsPrinting(true);
    
    try {
      const printPromises = selectedDocs.map(async (docPath) => {
        const quantity = isBulkMode ? bulkQuantity : (docQuantities[docPath] || 1);
        
        for (let i = 0; i < quantity; i++) {
          const printWindow = window.open(docPath, '_blank');
          if (!printWindow) {
            throw new Error('Unable to open print dialog. Please check your popup blocker settings.');
          }
          
          await new Promise<void>((resolve, reject) => {
            const timeout = setTimeout(() => {
              reject(new Error('Print dialog timeout'));
            }, 5000);
            
            printWindow.onload = () => {
              clearTimeout(timeout);
              try {
                printWindow.print();
                resolve();
              } catch (error) {
                reject(error);
              }
            };
          });
        }
      });

      await Promise.all(printPromises);
    } catch (error) {
      console.error('Print failed:', error);
      alert('Unable to open print dialog. Please check your popup blocker settings.');
    } finally {
      setIsPrinting(false);
    }
  }, [selectedDocs, isBulkMode, bulkQuantity, docQuantities]);

  const renderFormCheckbox = useCallback((form: Document) => {
    const isSelected = selectedDocs.includes(form.path);
    
    return (
      <Card 
        key={form.path}
        onClick={(e) => {
          e.preventDefault();
          toggleDocument(form.path);
        }}
        style={{
          cursor: 'pointer',
          borderColor: isSelected ? form.color : '#e2e8f0',
          backgroundColor: isSelected ? `${form.color}10` : 'white'
        }}
      >
        <CardContent style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => toggleDocument(form.path)}
              onClick={(e) => e.stopPropagation()}
              aria-label={form.name}
            />
            <div 
              style={{
                width: '4px',
                height: '32px',
                borderRadius: '2px',
                backgroundColor: form.color || MODALITY_COLORS.Other
              }}
            />
            <div style={{ flex: 1 }}>
              <p style={{
                fontSize: '14px',
                fontWeight: '500',
                color: isSelected ? '#1e293b' : '#374151',
                margin: '0 0 4px 0'
              }}>
                {form.name}
              </p>
              {form.modality && (
                <p style={{
                  fontSize: '12px',
                  color: '#64748b',
                  margin: 0
                }}>
                  {form.modality} form
                </p>
              )}
            </div>
            <FileText style={{ width: '16px', height: '16px', color: '#9ca3af' }} />
          </div>
        </CardContent>
      </Card>
    );
  }, [selectedDocs, toggleDocument]);

  return (
    <div style={{ 
      backgroundColor: '#f8fafc',
      minHeight: '100vh'
    }}>
      {/* Header - matching providers layout */}
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
            margin: '0 0 24px 0',
            letterSpacing: '-0.025em'
          }}>
            Document Hub
          </h1>
          
          {/* Print Queue - above search like provider filters */}
          {selectedDocs.length > 0 && (
            <div style={{
              backgroundColor: '#f1f5f9',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '20px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div>
                  <span style={{ fontWeight: '500', color: '#1e293b' }}>Print Queue: {selectedDocs.length} items</span>
                  <span style={{ color: '#64748b', marginLeft: '8px' }}>Total copies: {getTotalCopies()}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={handlePrint}
                    disabled={selectedDocs.length === 0 || isPrinting}
                    style={{
                      backgroundColor: isPrinting ? '#94a3b8' : '#3b82f6',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontSize: '14px',
                      cursor: isPrinting ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Printer style={{ width: '16px', height: '16px' }} />
                    {isPrinting ? 'Printing...' : `Print ${getTotalCopies()}`}
                  </button>
                  <button
                    onClick={clearSelectedDocs}
                    style={{
                      backgroundColor: 'white',
                      color: '#64748b',
                      border: '1px solid #d1d5db',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                    aria-label="Clear selected documents"
                  >
                    <Trash2 style={{ width: '16px', height: '16px' }} />
                  </button>
                </div>
              </div>
              
              {/* Bulk Mode Toggle */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Checkbox
                  id="bulk-mode"
                  checked={isBulkMode}
                  onCheckedChange={(checked) => setIsBulkMode(!!checked)}
                  aria-label="Bulk Mode"
                />
                <label
                  htmlFor="bulk-mode"
                  style={{ fontSize: '14px', cursor: 'pointer' }}
                >
                  Bulk Mode
                </label>
                {isBulkMode && (
                  <Select value={bulkQuantity.toString()} onValueChange={(value) => setBulkQuantity(Number(value))}>
                    <SelectTrigger style={{ width: '120px', height: '32px' }}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {BULK_QUANTITIES.map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} copies
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          )}
          
          {/* Search */}
          <div style={{ 
            position: 'relative',
            marginBottom: '20px'
          }}>
            <div style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#64748b',
              fontSize: '16px',
              pointerEvents: 'none'
            }}>
              🔍
            </div>
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px 12px 40px',
                fontSize: '14px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                backgroundColor: 'white',
                outline: 'none',
                transition: 'all 0.2s ease',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Filter Buttons - matching provider layout */}
          <div style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap'
          }}>
            {Object.entries(visibleSections).map(([section, isVisible]) => (
              <button
                key={section}
                onClick={() => toggleSection(section as keyof typeof visibleSections)}
                style={{
                  backgroundColor: isVisible ? MODALITY_COLORS[section as keyof typeof MODALITY_COLORS] : 'white',
                  color: isVisible ? 'white' : '#374151',
                  border: '1px solid #d1d5db',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                {section}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
        {searchTerm ? (
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#1e293b' }}>
              Search Results ({filteredDocuments.length})
            </h2>
            <div style={{ display: 'grid', gap: '12px' }}>
              {filteredDocuments.map(renderFormCheckbox)}
            </div>
          </div>
        ) : (
          <>
            {/* General Forms */}
            {visibleSections.General && (
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: MODALITY_COLORS.General }}>
                  General Forms
                </h2>
                <div style={{ display: 'grid', gap: '12px' }}>
                  {GENERAL_FORMS.map(renderFormCheckbox)}
                </div>
              </div>
            )}

            {/* Financial Forms */}
            {visibleSections.Financial && (
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: MODALITY_COLORS.Financial }}>
                  Financial Forms
                </h2>
                <div style={{ display: 'grid', gap: '12px' }}>
                  {FINANCIAL_FORMS.map(renderFormCheckbox)}
                </div>
              </div>
            )}

            {/* Screening Forms by Modality */}
            {visibleSections.MRI && (
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: MODALITY_COLORS.MRI }}>
                  MRI Forms
                </h2>
                <div style={{ display: 'grid', gap: '12px' }}>
                  {SCREENING_FORMS.filter(f => f.modality === 'MRI').map(renderFormCheckbox)}
                </div>
              </div>
            )}
            
            {visibleSections.CT && (
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: MODALITY_COLORS.CT }}>
                  CT Forms
                </h2>
                <div style={{ display: 'grid', gap: '12px' }}>
                  {SCREENING_FORMS.filter(f => f.modality === 'CT').map(renderFormCheckbox)}
                </div>
              </div>
            )}
            
            {visibleSections.PET && (
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: MODALITY_COLORS.PET }}>
                  PET Forms
                </h2>
                <div style={{ display: 'grid', gap: '12px' }}>
                  {SCREENING_FORMS.filter(f => f.modality === 'PET').map(renderFormCheckbox)}
                </div>
              </div>
            )}
            
            {visibleSections.US && (
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: MODALITY_COLORS.US }}>
                  Ultrasound Forms
                </h2>
                <div style={{ display: 'grid', gap: '12px' }}>
                  {SCREENING_FORMS.filter(f => f.modality === 'US').map(renderFormCheckbox)}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
});

export default ModernDocumentSelector;