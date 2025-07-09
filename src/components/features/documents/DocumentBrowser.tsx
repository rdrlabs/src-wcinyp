'use client';

import { useState, useMemo } from 'react';
import { FileText, Download } from 'lucide-react';
import documentsData from '@/data/documents.json';
import type { Document } from '@/types';
import { ResourceBrowser, ResourceItem } from '@/components/shared';
import { useSearch } from '@/hooks/shared';

// Type assertion to match our interface
interface DocumentsData {
  categories: {
    [key: string]: Document[];
  };
}

const typedDocumentsData = documentsData as DocumentsData;

export function DocumentBrowser() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Flatten documents for search
  const allDocuments = useMemo(() => {
    const docs: (Document & { category: string })[] = [];
    Object.entries(typedDocumentsData.categories).forEach(([category, categoryDocs]) => {
      categoryDocs.forEach(doc => {
        docs.push({ ...doc, category });
      });
    });
    return docs;
  }, []);

  // Use search hook
  const { searchQuery, filteredData, handleSearch } = useSearch(allDocuments, {
    searchableFields: ['name'],
    minSearchLength: 1
  });

  // Convert documents to ResourceItem format
  const resourceItems: ResourceItem[] = useMemo(() => {
    return filteredData.map(doc => ({
      id: `${doc.category}-${doc.name}`,
      title: doc.name,
      description: doc.size || '',
      category: doc.category,
      icon: <FileText className="h-4 w-4" />,
      actions: [{
        label: 'Download',
        icon: <Download className="h-4 w-4 mr-2" />,
        onClick: () => handleDownload(doc.path),
        variant: 'outline' as const
      }]
    }));
  }, [filteredData]);

  const handleDownload = (path: string) => {
    const url = `/documents/${path}`;
    window.open(url, '_blank');
  };

  const categories = useMemo(() => {
    return ['all', ...Object.keys(typedDocumentsData.categories)];
  }, []);

  return (
    <ResourceBrowser
      items={resourceItems}
      onSearch={handleSearch}
      searchValue={searchQuery}
      searchPlaceholder="Search documents..."
      categories={categories}
      selectedCategory={selectedCategory}
      onCategoryChange={setSelectedCategory}
      emptyMessage="No documents found matching your criteria."
      gridCols={{ default: 1, md: 2, lg: 3 }}
    />
  );
}