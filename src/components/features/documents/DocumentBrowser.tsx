'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Search } from 'lucide-react';
import documentsData from '@/data/documents.json';

// Type assertion to match our interface
const typedDocumentsData = documentsData as DocumentsData;

interface Document {
  name: string;
  size: string;
  path: string;
}

interface DocumentsData {
  categories: {
    [key: string]: Document[];
  };
}

export function DocumentBrowser() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Get unique categories
  const categories = useMemo(() => {
    return ['all', ...Object.keys(typedDocumentsData.categories)];
  }, []);

  // Filter documents based on category and search
  const filteredDocuments = useMemo(() => {
    let categoryEntries: [string, Document[]][] = [];
    
    if (selectedCategory === 'all') {
      categoryEntries = Object.entries(typedDocumentsData.categories);
    } else {
      const docs = typedDocumentsData.categories[selectedCategory];
      if (docs) {
        categoryEntries = [[selectedCategory, docs]];
      }
    }
    
    if (searchQuery) {
      categoryEntries = categoryEntries
        .map(([category, docs]) => [
          category,
          docs.filter(doc => 
            doc.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
        ])
        .filter(([_, docs]) => docs.length > 0) as [string, Document[]][];
    }
    
    return categoryEntries;
  }, [selectedCategory, searchQuery]);

  const handleDownload = (path: string, _name: string) => {
    // Track download analytics if needed
    // TODO: Implement proper analytics tracking
    // Construct the full URL for the document
    const url = `/documents/${path}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border rounded-lg"
            data-testid="document-search-input"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              data-testid={`category-button-${cat.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {cat === 'all' ? 'All Documents' : cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Document Grid */}
      <div className="space-y-8">
        {filteredDocuments.map(([categoryName, documents]) => (
          <div key={categoryName}>
            <h3 className="text-lg font-semibold mb-4">{categoryName}</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {documents.map((doc, docIdx) => (
                <Card key={docIdx} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {doc.name}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {doc.size}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={() => handleDownload(doc.path, doc.name)}
                      data-testid={`download-button-${doc.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No documents found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}