import React, { useState, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Printer, Trash2, FileText, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

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

// Constants for timeouts and delays
const PRINT_DELAY_MS = 500;
const WINDOW_OPEN_DELAY_MS = 300;

// Initial section visibility state
const INITIAL_SECTION_VISIBILITY: SectionVisibility = {
  General: true,
  MRI: true,
  CT: true,
  PET: true,
  US: true,
  Breast: true,
  'X-Ray': true,
  Financial: true,
  Other: false
};

const MODALITY_COLORS: ModalityColors = {
  General: 'hsl(215.4 16.3% 46.9%)',
  MRI: 'hsl(142.1 76.2% 36.3%)',
  CT: 'hsl(221.2 83.2% 53.3%)', 
  PET: 'hsl(262.1 83.3% 57.8%)',
  US: 'hsl(32.6 94.6% 43.7%)',
  DEXA: 'hsl(214.3 31.8% 58.4%)',
  Breast: 'hsl(322.2 83.3% 61.8%)',
  'X-Ray': 'hsl(0 84.2% 60.2%)',
  Financial: 'hsl(188.7 85% 53.1%)',
  Other: 'hsl(215.4 16.3% 46.9%)'
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

const ModernDocumentSelector = React.memo(function ModernDocumentSelector(): React.ReactElement {
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [docQuantities, setDocQuantities] = useState<Record<string, number>>({});
  const [selectedAbnLocation, setSelectedAbnLocation] = useState<string>('');
  const [selectedInvoiceType, setSelectedInvoiceType] = useState<string>('');
  const [isBulkMode, setIsBulkMode] = useState<boolean>(false);
  const [bulkQuantity, setBulkQuantity] = useState<number>(1);
  const [visibleSections, setVisibleSections] = useState<SectionVisibility>(INITIAL_SECTION_VISIBILITY);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isPrinting, setIsPrinting] = useState<boolean>(false);

  // Memoize the combined forms array to prevent recreation on every render
  const allForms = useMemo(() => 
    [...SCREENING_FORMS, ...BREAST_FORMS, ...GENERAL_FORMS, ...OTHER_FORMS], 
    []
  );

  const toggleSection = useCallback((section: string): void => {
    setVisibleSections(prev => ({ ...prev, [section]: !prev[section] }));
  }, []);

  // Memoize filtered forms to prevent unnecessary filtering
  const filteredForms = useMemo(() => 
    allForms.filter(form => 
      form.name.toLowerCase().includes(searchTerm.toLowerCase())
    ), [allForms, searchTerm]
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

  const handlePrint = useCallback(async (): Promise<void> => {
    if (selectedDocs.length === 0) {
      alert('Please select at least one document to print');
      return;
    }
    
    setIsPrinting(true);
    const openWindows: Window[] = [];
    
    try {
      for (let pathIndex = 0; pathIndex < selectedDocs.length; pathIndex++) {
        const path = selectedDocs[pathIndex];
        const copies = isBulkMode ? bulkQuantity : (docQuantities[path] || 1);
        
        for (let i = 0; i < copies; i++) {
          const printWindow = window.open(path, '_blank');
          if (printWindow) {
            openWindows.push(printWindow);
            
            // Add error handling for print window
            const handlePrintError = () => {
              console.warn(`Failed to print document: ${path}`);
            };
            
            setTimeout(() => {
              try {
                printWindow.print();
              } catch (printError) {
                handlePrintError();
              }
            }, PRINT_DELAY_MS);
          } else {
            throw new Error('Unable to open print dialog. Please check your popup blocker settings.');
          }
          
          // Add delay between windows, but not after the last one
          const isLastCopy = i === copies - 1;
          const isLastPath = pathIndex === selectedDocs.length - 1;
          if (!isLastCopy || !isLastPath) {
            await new Promise(resolve => setTimeout(resolve, WINDOW_OPEN_DELAY_MS));
          }
        }
      }
    } catch (error) {
      console.error('Print failed:', error);
      const message = error instanceof Error ? error.message : 'Failed to prepare documents for printing';
      alert(message);
      
      // Close any opened windows on error
      openWindows.forEach(window => {
        try {
          window.close();
        } catch (closeError) {
          console.warn('Failed to close print window:', closeError);
        }
      });
    } finally {
      setIsPrinting(false);
    }
  }, [selectedDocs, isBulkMode, bulkQuantity, docQuantities]);

  const renderFormCheckbox = useCallback((form: Document) => {
    const isSelected = selectedDocs.includes(form.path);
    
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleDocument(form.path);
      }
    };
    
    return (
      <Card 
        key={form.path}
        className={cn(
          "cursor-pointer transition-all duration-200 hover:shadow-md focus-within:ring-2 focus-within:ring-ring",
          isSelected ? "ring-2 ring-primary bg-primary/5" : "hover:bg-muted/50"
        )}
        onClick={(e) => {
          e.preventDefault();
          toggleDocument(form.path);
        }}
      >
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => toggleDocument(form.path)}
              onClick={(e) => e.stopPropagation()}
              aria-label={`${form.name}`}
            />
            <div 
              className="w-1 h-8 rounded-full flex-shrink-0" 
              style={{ backgroundColor: form.color || MODALITY_COLORS.Other }}
              aria-hidden="true"
            />
            <div className="flex-1">
              <p className={cn(
                "text-sm font-medium leading-none",
                isSelected ? "text-primary" : "text-foreground"
              )}>
                {form.name}
              </p>
              {form.modality && (
                <p className="text-xs text-muted-foreground mt-1">
                  {form.modality} form
                </p>
              )}
            </div>
            <FileText className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </div>
        </CardContent>
      </Card>
    );
  }, [selectedDocs, toggleDocument]);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className="w-80 border-r bg-card">
        <div className="p-6 space-y-6">
          {/* Print Queue Summary */}
          <Card className={cn(
            "transition-all duration-200",
            selectedDocs.length > 0 ? "ring-2 ring-primary bg-primary/5" : ""
          )}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Print Queue</CardTitle>
                <div className="flex items-center gap-2">
                  <Printer className="h-4 w-4" />
                  <span className="text-sm font-medium text-primary">
                    {selectedDocs.length} items
                  </span>
                </div>
              </div>
              <CardDescription>
                Total copies: {getTotalCopies()}
              </CardDescription>
            </CardHeader>
            
            {selectedDocs.length > 0 && (
              <CardContent className="space-y-4">
                {/* Bulk Mode Toggle */}
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={isBulkMode}
                    onCheckedChange={(checked) => setIsBulkMode(!!checked)}
                  />
                  <span className="text-sm font-medium">Bulk Mode</span>
                  {isBulkMode && (
                    <Select value={bulkQuantity.toString()} onValueChange={(value) => setBulkQuantity(Number(value))}>
                      <SelectTrigger className="w-28">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {BULK_QUANTITIES.map(n => (
                          <SelectItem key={n} value={n.toString()}>{n} copies</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    onClick={handlePrint}
                    disabled={isPrinting}
                    className="flex-1"
                    size="sm"
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    {isPrinting ? 'Printing...' : `Print ${getTotalCopies()}`}
                  </Button>
                  <Button
                    onClick={clearSelectedDocs}
                    variant="outline"
                    size="sm"
                    aria-label="Clear selected documents"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                {/* Selected Items Preview */}
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  <p className="text-xs font-medium text-muted-foreground">Selected Documents:</p>
                  {selectedDocs.slice(0, 5).map(path => (
                    <div key={path} className="flex justify-between items-center text-xs">
                      <span className="truncate pr-2">{getDocumentName(path)}</span>
                      <span className="font-medium text-primary">×{isBulkMode ? bulkQuantity : (docQuantities[path] || 1)}</span>
                    </div>
                  ))}
                  {selectedDocs.length > 5 && (
                    <p className="text-xs text-muted-foreground italic">
                      +{selectedDocs.length - 5} more documents
                    </p>
                  )}
                </div>
              </CardContent>
            )}
          </Card>

          {/* Search */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Section Filters */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <h3 className="text-sm font-semibold">Form Sections</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(visibleSections).map(([section, isVisible]) => (
                <Button
                  key={section}
                  onClick={() => toggleSection(section)}
                  variant={isVisible ? "default" : "outline"}
                  size="sm"
                  className="justify-start text-xs"
                  style={isVisible ? { backgroundColor: MODALITY_COLORS[section], borderColor: MODALITY_COLORS[section] } : {}}
                >
                  {section}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1">
        {/* Header */}
        <div className="border-b bg-card">
          <div className="p-6">
            <div className="max-w-6xl">
              <h1 className="text-3xl font-bold tracking-tight">Document Hub</h1>
              <p className="text-muted-foreground">Modern document management for medical forms</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="max-w-6xl space-y-8">
            {/* Search Results */}
            {searchTerm ? (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Search Results ({filteredForms.length})</h2>
                <div className="grid gap-3">
                  {filteredForms.map(renderFormCheckbox)}
                </div>
              </div>
            ) : (
              <>
                {/* General Forms */}
                {visibleSections.General && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold" style={{ color: MODALITY_COLORS.General }}>
                      General Forms
                    </h2>
                    <div className="grid gap-3">
                      {GENERAL_FORMS.map(renderFormCheckbox)}
                    </div>
                  </div>
                )}

                {/* Screening Forms by Modality */}
                {visibleSections.MRI && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold" style={{ color: MODALITY_COLORS.MRI }}>
                      MRI Forms
                    </h2>
                    <div className="grid gap-3">
                      {SCREENING_FORMS.filter(f => f.modality === 'MRI').map(renderFormCheckbox)}
                    </div>
                  </div>
                )}
                
                {visibleSections.CT && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold" style={{ color: MODALITY_COLORS.CT }}>
                      CT Forms
                    </h2>
                    <div className="grid gap-3">
                      {SCREENING_FORMS.filter(f => f.modality === 'CT').map(renderFormCheckbox)}
                    </div>
                  </div>
                )}
                
                {visibleSections.PET && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold" style={{ color: MODALITY_COLORS.PET }}>
                      PET Forms
                    </h2>
                    <div className="grid gap-3">
                      {SCREENING_FORMS.filter(f => f.modality === 'PET').map(renderFormCheckbox)}
                    </div>
                  </div>
                )}
                
                {visibleSections.US && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold" style={{ color: MODALITY_COLORS.US }}>
                      Ultrasound Forms
                    </h2>
                    <div className="grid gap-3">
                      {SCREENING_FORMS.filter(f => f.modality === 'US').map(renderFormCheckbox)}
                    </div>
                  </div>
                )}
                
                {visibleSections.Breast && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold" style={{ color: MODALITY_COLORS.Breast }}>
                      Breast Imaging Forms
                    </h2>
                    <div className="grid gap-3">
                      {BREAST_FORMS.map(renderFormCheckbox)}
                    </div>
                  </div>
                )}
                
                {visibleSections['X-Ray'] && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold" style={{ color: MODALITY_COLORS['X-Ray'] }}>
                      X-Ray & DEXA Forms
                    </h2>
                    <div className="grid gap-3">
                      {SCREENING_FORMS.filter(f => f.modality === 'DEXA').map(renderFormCheckbox)}
                      {SCREENING_FORMS.filter(f => f.modality === 'XRAY').map(renderFormCheckbox)}
                    </div>
                  </div>
                )}

                {/* Financial Forms */}
                {visibleSections.Financial && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold" style={{ color: MODALITY_COLORS.Financial }}>
                      Financial Forms
                    </h2>
                    <div className="grid gap-3">
                      <Card 
                        className={cn(
                          "cursor-pointer transition-all duration-200 hover:shadow-md",
                          selectedDocs.includes(FINANCIAL_FORMS.OFF_HOURS_WAIVER) ? "ring-2 ring-primary bg-primary/5" : "hover:bg-muted/50"
                        )}
                        onClick={() => toggleDocument(FINANCIAL_FORMS.OFF_HOURS_WAIVER)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              checked={selectedDocs.includes(FINANCIAL_FORMS.OFF_HOURS_WAIVER)}
                              onCheckedChange={() => toggleDocument(FINANCIAL_FORMS.OFF_HOURS_WAIVER)}
                              onClick={(e) => e.stopPropagation()}
                            />
                            <div className="w-1 h-8 rounded-full bg-cyan-500 flex-shrink-0" />
                            <p className="text-sm font-medium">Insurance Off-Hours Waiver</p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card 
                        className={cn(
                          "cursor-pointer transition-all duration-200 hover:shadow-md",
                          selectedDocs.includes(FINANCIAL_FORMS.SELF_PAY_WAIVER) ? "ring-2 ring-primary bg-primary/5" : "hover:bg-muted/50"
                        )}
                        onClick={() => toggleDocument(FINANCIAL_FORMS.SELF_PAY_WAIVER)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              checked={selectedDocs.includes(FINANCIAL_FORMS.SELF_PAY_WAIVER)}
                              onCheckedChange={() => toggleDocument(FINANCIAL_FORMS.SELF_PAY_WAIVER)}
                              onClick={(e) => e.stopPropagation()}
                            />
                            <div className="w-1 h-8 rounded-full bg-cyan-500 flex-shrink-0" />
                            <p className="text-sm font-medium">Self-Pay Waiver</p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <span className="text-sm font-medium">Invoice:</span>
                            <Select value={selectedInvoiceType} onValueChange={setSelectedInvoiceType}>
                              <SelectTrigger className="w-48">
                                <SelectValue placeholder="Select Type" />
                              </SelectTrigger>
                              <SelectContent>
                                {INVOICE_TYPES.map(type => (
                                  <SelectItem key={type} value={type}>{type}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button 
                              onClick={addInvoice}
                              disabled={!selectedInvoiceType}
                              size="sm"
                            >
                              Add
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <span className="text-sm font-medium">ABN:</span>
                            <Select value={selectedAbnLocation} onValueChange={setSelectedAbnLocation}>
                              <SelectTrigger className="w-48">
                                <SelectValue placeholder="Select Location" />
                              </SelectTrigger>
                              <SelectContent>
                                {LOCATIONS.map(location => (
                                  <SelectItem key={location} value={location}>{location}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button 
                              onClick={addAbn}
                              disabled={!selectedAbnLocation}
                              size="sm"
                            >
                              Add
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}

                {/* Other Forms */}
                {visibleSections.Other && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold" style={{ color: MODALITY_COLORS.Other }}>
                      Other Forms
                    </h2>
                    <div className="grid gap-3">
                      {OTHER_FORMS.map(renderFormCheckbox)}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default ModernDocumentSelector;