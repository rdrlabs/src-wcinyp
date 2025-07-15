'use client';

import * as React from "react";
import { Input } from "@/components/ui/input";
import { useState, useMemo, useCallback } from "react";
import documentsData from "@/data/documents.json";
import type { DocumentCategories } from "@/types";
import { TYPOGRAPHY } from "@/constants/typography";
import { cn } from "@/lib/utils";
import { 
  Search, 
  Download, 
  FileText, 
  Eye,
  Printer
} from "lucide-react";
import { DataTable, createSortableHeader } from "@/components/ui/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

// Constants
const DEFAULT_LAST_UPDATED = new Date().toISOString().split('T')[0]; // Today's date in YYYY-MM-DD format

export default function DocumentsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Use imported data
  const documentCategories = documentsData.categories as DocumentCategories;


  // Type for a document with metadata
  interface DocumentWithMetadata {
    name: string;
    size: string;
    path: string;
    category: string;
    location: string | null;
    language: string;
    docType: string;
    lastUpdated: string;
    baseType?: string;
    modality?: string;
  }

  // Type for grouped documents
  interface GroupedDocument {
    baseType: string;
    docType: string;
    category: string;
    variants: DocumentWithMetadata[];
    selectedVariant: DocumentWithMetadata;
  }

  // Extract base type from document name
  const extractBaseType = (name: string): string => {
    // Remove file extension first
    let baseName = name.replace(/\.pdf$/i, '');
    
    // Remove language suffixes BEFORE location suffixes
    baseName = baseName.replace(/ \((Spanish|Español)\)$/i, '');
    
    // Now remove location suffixes
    baseName = baseName.replace(/ - (55th Street|61st Street|Beekman|Broadway|DHK|JO|LIC|Spiral|York Avenue|88 Pine|STARR|WGC|Westside|Generic|General|Cardiovascular|Gynecologic|Prostate|Non-Patient)$/i, '');
    
    // Remove "Form" from Invoice Forms
    if (baseName.includes('Invoice Form')) {
      baseName = baseName.replace('Invoice Form - ', 'Invoice - ');
    }
    
    // Remove "Questionnaire" suffix to avoid redundancy
    baseName = baseName.replace(/ Questionnaire$/i, '');
    
    // Remove modality from Invoice to group them together
    if (baseName.startsWith('Invoice - ')) {
      baseName = 'Invoice';
    }
    
    return baseName.trim();
  };

  // Flatten all documents with extracted metadata
  const allDocuments = useMemo(() => {
    return Object.entries(documentCategories).flatMap(([category, docs]) =>
      docs.map(doc => {
        // Extract location from path/name (handle Spanish suffix)
        const locationMatch = doc.name.match(/(55th Street|61st Street|Beekman|Broadway|DHK|JO|LIC|Spiral|York Avenue|88 Pine|STARR|WGC|Westside|Generic|General|Cardiovascular|Gynecologic|Prostate|Non-Patient)(?:\s*\(Spanish\))?/i);
        const location = locationMatch ? locationMatch[1] : null;
        
        // Check if Spanish
        const isSpanish = doc.name.toLowerCase().includes('spanish') || doc.name.toLowerCase().includes('español');
        
        // Extract document type
        const docType = doc.name.toLowerCase().includes('questionnaire') ? 'Questionnaire' :
                       doc.name.toLowerCase().includes('abn') ? 'ABN Form' :
                       doc.name.toLowerCase().includes('invoice') ? 'Invoice' :
                       doc.name.toLowerCase().includes('fax') ? 'Fax Form' :
                       'Other';
        
        // Extract modality for invoices
        let modality: string | undefined;
        if (docType === 'Invoice') {
          const modalityMatch = doc.name.match(/Invoice Form - (CT|MRI|Mammo|PET(?: \(FDG\))?|US|Xray)/i);
          modality = modalityMatch ? modalityMatch[1] : undefined;
        }
        
        const baseType = extractBaseType(doc.name);
        
        return { 
          ...doc, 
          category,
          location,
          language: isSpanish ? 'Spanish' : 'English',
          docType,
          baseType,
          modality,
          lastUpdated: DEFAULT_LAST_UPDATED
        };
      })
    );
  }, [documentCategories]);

  // Group similar documents
  const groupedDocuments = useMemo(() => {
    const groups: Record<string, GroupedDocument> = {};
    
    allDocuments.forEach(doc => {
      // Only group documents that have location variants or are invoices
      const shouldGroup = doc.location || doc.modality;
      
      if (shouldGroup) {
        const groupKey = doc.baseType;
        
        if (!groups[groupKey]) {
          groups[groupKey] = {
            baseType: doc.baseType,
            docType: doc.docType,
            category: doc.category,
            variants: [],
            selectedVariant: doc
          };
        }
        
        groups[groupKey].variants.push(doc);
      }
    });
    
    // Convert to array and add single documents that don't have variants
    const groupedArray: (GroupedDocument | DocumentWithMetadata)[] = Object.values(groups);
    
    // Add documents that don't have variants
    allDocuments.forEach(doc => {
      const shouldGroup = doc.location || doc.modality;
      if (!shouldGroup) {
        groupedArray.push(doc as DocumentWithMetadata);
      }
    });
    
    return groupedArray;
  }, [allDocuments]);

  // State for selected variants
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [selectedLanguages, setSelectedLanguages] = useState<Record<string, string>>({});

  // Apply search filter
  const filteredDocuments = useMemo(() => {
    if (!searchTerm) return groupedDocuments;
    
    const query = searchTerm.toLowerCase();
    return groupedDocuments.filter(item => {
      if ('variants' in item) {
        // For grouped documents, search in base type and all variants
        return item.baseType.toLowerCase().includes(query) ||
               item.variants.some(v => v.name.toLowerCase().includes(query));
      } else {
        // For single documents
        return item.name.toLowerCase().includes(query);
      }
    });
  }, [groupedDocuments, searchTerm]);


  // Helper to get the selected document for a group
  const getSelectedDocument = useCallback((item: GroupedDocument | DocumentWithMetadata): DocumentWithMetadata => {
    if ('variants' in item) {
      const groupKey = item.baseType;
      const selectedLanguage = selectedLanguages[groupKey] || 'English';
      const selectedLocation = selectedVariants[groupKey];
      
      // Filter by language first
      const languageVariants = item.variants.filter(v => v.language === selectedLanguage);
      
      // If location is selected, find that specific variant
      if (selectedLocation) {
        const variant = languageVariants.find(v => v.location === selectedLocation || v.modality === selectedLocation);
        if (variant) return variant;
      }
      
      // Return first variant of selected language
      return languageVariants[0] || item.variants[0];
    }
    return item;
  }, [selectedLanguages, selectedVariants]);

  // Define columns for document table
  type DocumentItem = GroupedDocument | DocumentWithMetadata;
  const columns: ColumnDef<DocumentItem>[] = useMemo(() => [
    {
      accessorKey: 'docType',
      header: ({ column }) => createSortableHeader(column, 'Category'),
      cell: ({ row }) => {
        const item = row.original;
        const type = 'variants' in item ? item.docType : item.docType;
        
        return (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-md px-2 py-1 text-sm font-medium ring-1 ring-inset ring-border bg-muted">
              {type}
            </span>
          </div>
        );
      }
    },
    {
      id: 'name',
      accessorFn: (row) => 'variants' in row ? row.baseType : row.name,
      header: ({ column }) => createSortableHeader(column, 'Name'),
      cell: ({ row }) => {
        const item = row.original;
        const displayName = 'variants' in item ? item.baseType : item.name.replace(/\.pdf$/i, '');
        const variantCount = 'variants' in item ? item.variants.length : 0;
        
        return (
          <div className="flex items-center gap-3">
            <div className="w-[90px]">
              {variantCount > 1 && (
                <Badge variant="secondary" className="text-xs">
                  {variantCount} variants
                </Badge>
              )}
            </div>
            <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <div className="flex flex-col">
              <span className="font-semibold">{displayName.replace(/ Questionnaire$/i, '')}</span>
              {'variants' in item && (() => {
                const languages = [...new Set(item.variants.map(v => v.language))];
                if (languages.length === 1 && languages[0] === 'Spanish') {
                  return <span className="text-xs text-muted-foreground">Spanish version</span>;
                }
                return null;
              })()}
            </div>
            {'variants' in item && (() => {
              const languages = [...new Set(item.variants.map(v => v.language))];
              const selectedLanguage = selectedLanguages[item.baseType] || 'English';
              const languageVariants = item.variants.filter(v => v.language === selectedLanguage);
              const locations = [...new Set(languageVariants.map(v => v.location || v.modality).filter(Boolean))];
              
              return (
                <>
                  {languages.length > 1 && (
                    <Select
                      value={selectedLanguage}
                      onValueChange={(value) => {
                        setSelectedLanguages(prev => ({ ...prev, [item.baseType]: value }));
                        // Reset location selection when language changes
                        setSelectedVariants(prev => ({ ...prev, [item.baseType]: '' }));
                      }}
                    >
                      <SelectTrigger className="w-[100px] h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang} value={lang}>
                            {lang}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {locations.length > 1 && (
                    <Select
                      value={selectedVariants[item.baseType] || locations[0]}
                      onValueChange={(value) => {
                        setSelectedVariants(prev => ({ ...prev, [item.baseType]: value }));
                      }}
                    >
                      <SelectTrigger className="w-[140px] h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((loc) => (
                          <SelectItem key={loc} value={loc!}>
                            {loc}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </>
              );
            })()}
          </div>
        );
      }
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const item = row.original;
        const doc = getSelectedDocument(item);
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.open(`/documents/${doc.path}`, '_blank')}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-muted h-8 w-8"
              title="View document"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              onClick={async () => {
                const response = await fetch(`/documents/${doc.path}`);
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = doc.name;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
              }}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-muted h-8 w-8"
              title="Download document"
            >
              <Download className="h-4 w-4" />
            </button>
            <button
              onClick={() => {
                const printWindow = window.open(`/documents/${doc.path}`, '_blank');
                if (printWindow) {
                  printWindow.onload = () => {
                    printWindow.print();
                  };
                }
              }}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-muted h-8 w-8"
              title="Print document"
            >
              <Printer className="h-4 w-4" />
            </button>
          </div>
        );
      }
    }
  ], [getSelectedDocument, selectedLanguages, selectedVariants]);

  return (
    <div className="container mx-auto py-8 space-y-6">
        {/* Page Header */}
        <div className="space-y-1 mb-6">
          <h1 className={TYPOGRAPHY.pageTitle}>Documents</h1>
          <p className={cn(TYPOGRAPHY.pageDescription)}>
            Access and manage medical forms and documents
          </p>
        </div>
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative max-w-md">
                <Input
                  type="search"
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            {/* Documents Table */}
            <div className="overflow-auto">
              <DataTable
                columns={columns}
                data={filteredDocuments}
                showColumnVisibility={false}
                showPagination={false}
                pageSize={1000}
                enableRowSelection={false}
              />
            </div>

      </div>
  );
}