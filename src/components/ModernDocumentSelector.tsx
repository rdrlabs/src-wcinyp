import React, { useState, useCallback, useMemo } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Search, FileText, Printer, Trash2 } from 'lucide-react';
import styles from '../pages/document-hub.module.css';

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
      <div
        key={form.path}
        className={cn(styles.documentCard, isSelected && 'ring-2')}
        onClick={(e) => {
          e.preventDefault();
          toggleDocument(form.path);
        }}
        style={{
          borderColor: isSelected ? form.color : undefined,
          backgroundColor: isSelected ? `${form.color}10` : undefined,
          ringColor: isSelected ? form.color : undefined
        }}
      >
        <div className={styles.documentCardContent}>
          <div className={styles.documentCardInner}>
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => toggleDocument(form.path)}
              onClick={(e) => e.stopPropagation()}
              aria-label={form.name}
            />
            <div 
              className={styles.documentIndicator}
              style={{ backgroundColor: form.color || MODALITY_COLORS.Other }}
            />
            <div className={styles.documentInfo}>
              <p className={styles.documentName}>
                {form.name}
              </p>
              {form.modality && (
                <p className={styles.documentModality}>
                  {form.modality} form
                </p>
              )}
            </div>
            <FileText className={cn('h-4 w-4', styles.documentIcon)} />
          </div>
        </div>
      </div>
    );
  }, [selectedDocs, toggleDocument]);

  return (
    <div className={styles.pageContainer}>
      {/* Header Section */}
      <div className={styles.headerSection}>
        <div className={styles.contentWrapper}>
          <div className={styles.headerContent}>
            <div>
              <h1 className={styles.headerTitle}>
                Document Hub
              </h1>
              <p className={styles.headerSubtitle}>
                Medical forms and questionnaires for all modalities
              </p>
            </div>
          </div>

          {/* Print Queue */}
          {selectedDocs.length > 0 && (
            <div className={styles.printQueue}>
              <div className={styles.printQueueHeader}>
                <div className={styles.printQueueInfo}>
                  <span style={{ fontWeight: 500 }}>Print Queue: {selectedDocs.length} items</span>
                  <span className={styles.printQueueCount}>Total copies: {getTotalCopies()}</span>
                </div>
                <div className={styles.printQueueActions}>
                  <Button
                    onClick={handlePrint}
                    disabled={selectedDocs.length === 0 || isPrinting}
                    className="flex items-center gap-2"
                  >
                    <Printer className="h-4 w-4" />
                    {isPrinting ? 'Printing...' : `Print ${getTotalCopies()}`}
                  </Button>
                  <Button
                    onClick={clearSelectedDocs}
                    variant="outline"
                    size="icon"
                    aria-label="Clear selected documents"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Bulk Mode Toggle */}
              <div className={styles.bulkModeWrapper}>
                <Checkbox
                  id="bulk-mode"
                  checked={isBulkMode}
                  onCheckedChange={(checked) => setIsBulkMode(!!checked)}
                  aria-label="Bulk Mode"
                />
                <label
                  htmlFor="bulk-mode"
                  style={{ fontSize: '0.875rem', cursor: 'pointer' }}
                >
                  Bulk Mode
                </label>
                {isBulkMode && (
                  <Select value={bulkQuantity.toString()} onValueChange={(value) => setBulkQuantity(Number(value))}>
                    <SelectTrigger className="w-[120px] h-8">
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
          <div className={styles.searchWrapper}>
            <Search className={cn('h-4 w-4', styles.searchIcon)} />
            <Input
              type="text"
              placeholder="Search documents by name or modality..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
              aria-label="Search documents"
            />
          </div>

          {/* Filter Buttons */}
          <div className={styles.filtersWrapper}>
            {Object.entries(visibleSections).map(([section, isVisible]) => (
              <Button
                key={section}
                onClick={() => toggleSection(section as keyof typeof visibleSections)}
                variant={isVisible ? "default" : "outline"}
                size="sm"
                style={{
                  backgroundColor: isVisible ? MODALITY_COLORS[section as keyof typeof MODALITY_COLORS] : undefined,
                  borderColor: isVisible ? MODALITY_COLORS[section as keyof typeof MODALITY_COLORS] : undefined
                }}
              >
                {section}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          {searchTerm ? (
            <div className={styles.searchResults}>
              <h2 className={styles.sectionTitle}>
                Search Results ({filteredDocuments.length})
              </h2>
              <div className={styles.documentGrid}>
                {filteredDocuments.map(renderFormCheckbox)}
              </div>
            </div>
          ) : (
            <>
              {/* General Forms */}
              {visibleSections.General && (
                <div className={styles.section}>
                  <h2 className={styles.sectionTitle} style={{ color: MODALITY_COLORS.General }}>
                    General Forms
                  </h2>
                  <div className={styles.documentGrid}>
                    {GENERAL_FORMS.map(renderFormCheckbox)}
                  </div>
                </div>
              )}

              {/* Financial Forms */}
              {visibleSections.Financial && (
                <div className={styles.section}>
                  <h2 className={styles.sectionTitle} style={{ color: MODALITY_COLORS.Financial }}>
                    Financial Forms
                  </h2>
                  <div className={styles.documentGrid}>
                    {FINANCIAL_FORMS.map(renderFormCheckbox)}
                  </div>
                </div>
              )}

              {/* Screening Forms by Modality */}
              {visibleSections.MRI && (
                <div className={styles.section}>
                  <h2 className={styles.sectionTitle} style={{ color: MODALITY_COLORS.MRI }}>
                    MRI Forms
                  </h2>
                  <div className={styles.documentGrid}>
                    {SCREENING_FORMS.filter(f => f.modality === 'MRI').map(renderFormCheckbox)}
                  </div>
                </div>
              )}
              
              {visibleSections.CT && (
                <div className={styles.section}>
                  <h2 className={styles.sectionTitle} style={{ color: MODALITY_COLORS.CT }}>
                    CT Forms
                  </h2>
                  <div className={styles.documentGrid}>
                    {SCREENING_FORMS.filter(f => f.modality === 'CT').map(renderFormCheckbox)}
                  </div>
                </div>
              )}
              
              {visibleSections.PET && (
                <div className={styles.section}>
                  <h2 className={styles.sectionTitle} style={{ color: MODALITY_COLORS.PET }}>
                    PET Forms
                  </h2>
                  <div className={styles.documentGrid}>
                    {SCREENING_FORMS.filter(f => f.modality === 'PET').map(renderFormCheckbox)}
                  </div>
                </div>
              )}
              
              {visibleSections.US && (
                <div className={styles.section}>
                  <h2 className={styles.sectionTitle} style={{ color: MODALITY_COLORS.US }}>
                    Ultrasound Forms
                  </h2>
                  <div className={styles.documentGrid}>
                    {SCREENING_FORMS.filter(f => f.modality === 'US').map(renderFormCheckbox)}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
});

export default ModernDocumentSelector;