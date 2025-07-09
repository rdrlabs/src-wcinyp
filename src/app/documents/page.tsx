'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState, useMemo } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import documentsData from "@/data/documents.json";
import formTemplatesData from "@/data/form-templates.json";
import type { DocumentCategories, FormTemplate } from "@/types";
import { FormBuilder } from "@/components/FormBuilder";
import { TYPOGRAPHY } from "@/constants/typography";
import { cn } from "@/lib/utils";
import { 
  Search, 
  Download, 
  FileText, 
  Calendar,
  HardDrive,
  Plus,
  Upload,
  Edit,
  Eye,
  Copy,
  Users,
  CheckCircle,
  AlertCircle,
  Settings,
  Printer,
  FolderOpen,
  DollarSign,
  ChevronDown
} from "lucide-react";
import { getCategoryIcon } from "@/lib/icons";
import { getThemeColor, getStatusColor } from "@/lib/theme";
import { DataTable, createSortableHeader, createActionsColumn } from "@/components/ui/data-table";
import { DetailsSheet, type CategoryData } from "@/components/shared";
import type { ColumnDef } from "@tanstack/react-table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DocumentsPage() {
  const [selectedTab, setSelectedTab] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFormId, setSelectedFormId] = useState<number | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedCategoryDetails, setSelectedCategoryDetails] = useState<CategoryData | null>(null);
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({});

  // Use imported data
  const documentCategories = documentsData.categories as DocumentCategories;
  const templates: FormTemplate[] = formTemplatesData.templates as FormTemplate[];


  // Flatten all documents for search
  const allDocuments = Object.entries(documentCategories).flatMap(([category, docs]) =>
    docs.map(doc => ({ ...doc, category, lastUpdated: "2025-01-04", itemType: 'document' as const }))
  );

  // Combine documents and forms into a single list
  const allItems = useMemo(() => {
    const documentsWithType = allDocuments;
    const formsWithType = templates.map(t => ({ ...t, itemType: 'form' as const }));
    return [...documentsWithType, ...formsWithType];
  }, [allDocuments, templates]);

  // Filter items based on selected tab
  const filteredByTab = useMemo(() => {
    if (selectedTab === 'all') return allItems;
    if (selectedTab === 'documents') return allItems.filter(item => item.itemType === 'document');
    if (selectedTab === 'forms') return allItems.filter(item => item.itemType === 'form');
    // Filter by document category
    return allItems.filter(item => item.itemType === 'document' && item.category === selectedTab);
  }, [allItems, selectedTab]);

  // Apply search filter
  const filteredItems = useMemo(() => {
    if (!searchTerm) return filteredByTab;
    const query = searchTerm.toLowerCase();
    return filteredByTab.filter(item => 
      item.name.toLowerCase().includes(query) ||
      (item.category && item.category.toLowerCase().includes(query))
    );
  }, [filteredByTab, searchTerm]);

  const categories = Object.keys(documentCategories);

  // Handle form selection
  const handleFormSelect = (formId: number) => {
    setSelectedFormId(formId);
  };

  const handleBackToList = () => {
    setSelectedFormId(null);
  };

  // Handle category button click
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    
    if (viewMode === 'documents') {
      const categoryDocs = category === 'all' 
        ? allDocuments 
        : documentCategories[category as keyof typeof documentCategories];
      
      const items = (Array.isArray(categoryDocs) ? categoryDocs : allDocuments)
        .slice(0, 5)
        .map((doc, index) => ({
          id: index.toString(),
          name: doc.name,
          size: doc.size,
          date: doc.lastUpdated || '2025-01-04'
        }));
      
      const totalSize = Array.isArray(categoryDocs) 
        ? categoryDocs.reduce((acc, doc) => {
            const sizeMatch = doc.size.match(/([\d.]+)\s*(KB|MB|GB)/i);
            if (sizeMatch) {
              const [, value, unit] = sizeMatch;
              const multiplier = unit.toUpperCase() === 'KB' ? 1 : unit.toUpperCase() === 'MB' ? 1024 : 1024 * 1024;
              return acc + parseFloat(value) * multiplier;
            }
            return acc;
          }, 0)
        : 0;
      
      setSelectedCategoryDetails({
        name: category === 'all' ? 'All Documents' : category,
        type: 'documents',
        description: category === 'all' 
          ? 'View all documents across all categories' 
          : `View all ${category.toLowerCase()} documents`,
        count: category === 'all' ? allDocuments.length : (categoryDocs as any[]).length,
        totalSize: `${(totalSize / 1024).toFixed(1)} MB`,
        lastUpdated: '2025-01-04',
        items
      });
    } else {
      // For forms view
      const categoryForms = templates.filter(t => 
        category === 'all' || t.category.toLowerCase() === category.toLowerCase()
      );
      
      const items = categoryForms.slice(0, 5).map(form => ({
        id: form.id.toString(),
        name: form.name,
        submissions: form.submissions,
        date: form.lastUsed
      }));
      
      setSelectedCategoryDetails({
        name: category === 'all' ? 'All Forms' : category,
        type: 'forms',
        description: category === 'all' 
          ? 'View all form templates' 
          : `View all ${category.toLowerCase()} form templates`,
        count: categoryForms.length,
        items
      });
    }
    
    setIsDetailsOpen(true);
  };

  // Define columns for unified table
  const columns: ColumnDef<any>[] = useMemo(() => [
    {
      accessorKey: 'name',
      header: ({ column }) => createSortableHeader(column, 'Name'),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="font-semibold">{row.getValue('name')}</span>
        </div>
      )
    },
    {
      accessorKey: 'category',
      header: ({ column }) => createSortableHeader(column, 'Category'),
      cell: ({ row }) => {
        const category = row.getValue('category') as string;
        const Icon = getCategoryIcon(category);
        return (
          <span className={`inline-flex items-center gap-2 rounded-md px-2 py-2 text-sm font-semibold ring-1 ring-inset ${getThemeColor('blue')}`}>
            <Icon className="h-4 w-4" />
            {category}
          </span>
        );
      }
    },
    {
      accessorKey: 'size',
      header: ({ column }) => createSortableHeader(column, 'Size'),
      cell: ({ row }) => {
        const item = row.original;
        if (item.itemType === 'form') {
          const fields = item.fields;
          return (
            <div className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
              {typeof fields === 'number' ? fields : fields.length} fields
            </div>
          );
        }
        return (
          <div className="flex items-center gap-2">
            <HardDrive className="h-4 w-4 text-muted-foreground" />
            {row.getValue('size')}
          </div>
        );
      }
    },
    {
      id: 'updated',
      header: ({ column }) => createSortableHeader(column, 'Updated'),
      accessorFn: (row) => row.lastUpdated || row.lastUsed,
      cell: ({ row }) => {
        const value = row.getValue('updated') as string;
        return (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            {value}
          </div>
        );
      }
    },
    {
      id: 'status',
      header: ({ column }) => createSortableHeader(column, 'Status'),
      cell: ({ row }) => {
        const item = row.original;
        if (item.itemType === 'form' && item.status) {
          const status = item.status;
          return (
            <span className={`inline-flex items-center gap-2 rounded-md px-2 py-2 text-sm font-semibold ring-1 ring-inset ${getStatusColor(status)}`}>
              {status === 'active' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              {status}
            </span>
          );
        }
        return null;
      }
    },
    createActionsColumn<any>([
      {
        label: 'View',
        onClick: (item) => {
          if (item.itemType === 'form') {
            handleFormSelect(typeof item.id === 'string' ? parseInt(item.id) : item.id);
          } else {
            console.log('Preview document', item);
          }
        },
        icon: <Eye className="h-4 w-4" />
      },
      {
        label: 'Download',
        onClick: (item) => console.log('Download', item),
        icon: <Download className="h-4 w-4" />
      },
      {
        label: 'Clone',
        onClick: (item) => console.log('Clone', item),
        icon: <Copy className="h-4 w-4" />
      }
    ])
  ], [handleFormSelect]);

  // Define columns for forms table (kept for reference but not used)
  const formColumns: ColumnDef<FormTemplate>[] = useMemo(() => [
    {
      accessorKey: 'name',
      header: ({ column }) => createSortableHeader(column, 'Form Name'),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="font-semibold">{row.getValue('name')}</span>
        </div>
      )
    },
    {
      accessorKey: 'category',
      header: ({ column }) => createSortableHeader(column, 'Category'),
      cell: ({ row }) => {
        const category = row.getValue('category') as string;
        const Icon = getCategoryIcon(category);
        return (
          <span className={`inline-flex items-center gap-2 rounded-md px-2 py-2 text-sm font-semibold ring-1 ring-inset ${getThemeColor('purple')}`}>
            <Icon className="h-4 w-4" />
            {category}
          </span>
        );
      }
    },
    {
      id: 'fields',
      header: 'Fields',
      cell: ({ row }) => {
        const fields = row.original.fields;
        return (
          <div className="flex items-center justify-center gap-2">
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
            {typeof fields === 'number' ? fields : fields.length}
          </div>
        );
      }
    },
    {
      accessorKey: 'submissions',
      header: ({ column }) => createSortableHeader(column, 'Submissions'),
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          {row.getValue('submissions')}
        </div>
      )
    },
    {
      accessorKey: 'lastUsed',
      header: ({ column }) => createSortableHeader(column, 'Last Used'),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          {row.getValue('lastUsed')}
        </div>
      )
    },
    {
      accessorKey: 'status',
      header: ({ column }) => createSortableHeader(column, 'Status'),
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        return (
          <span className={`inline-flex items-center gap-2 rounded-md px-2 py-2 text-sm font-semibold ring-1 ring-inset ${getStatusColor(status)}`}>
            {status === 'active' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            {status}
          </span>
        );
      }
    },
    createActionsColumn<FormTemplate>([
      {
        label: 'Fill Form',
        onClick: (template) => handleFormSelect(typeof template.id === 'string' ? parseInt(template.id) : template.id),
        icon: <Edit className="h-4 w-4" />
      },
      {
        label: 'Preview',
        onClick: (template) => console.log('Preview', template),
        icon: <Eye className="h-4 w-4" />
      },
      {
        label: 'Clone',
        onClick: (template) => console.log('Clone', template),
        icon: <Copy className="h-4 w-4" />
      }
    ])
  ], []);

  // Available columns for visibility control
  const availableColumns = useMemo(() => {
    return columns
      .filter(col => col.id !== 'actions' && col.accessorKey)
      .map(col => ({
        id: col.accessorKey as string,
        label: (col.header as any)?.({ column: {} })?.props?.children?.[0] || col.accessorKey
      }));
  }, [columns]);

  return (
    <TooltipProvider>
      <div className="container mx-auto py-8 space-y-6">
        {/* Page Header */}
        <div className="space-y-1 mb-6">
          <h1 className={TYPOGRAPHY.pageTitle}>Documents & Forms</h1>
          <p className={cn(TYPOGRAPHY.pageDescription)}>
            Access medical forms, documents, and create custom forms
          </p>
        </div>

        {selectedFormId ? (
          <div>
            <Button
              variant="outline"
              onClick={handleBackToList}
              className="mb-4"
            >
              ← Back to Forms
            </Button>
            <FormBuilder 
              template={templates.find(t => (typeof t.id === 'string' ? parseInt(t.id) : t.id) === selectedFormId)!}
            />
          </div>
        ) : (
          <>
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Input
                  type="search"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>

              {/* Tabs */}
              <Tabs value={selectedTab} onValueChange={setSelectedTab} className="flex-1 overflow-hidden">
                <TabsList className="inline-flex h-10 items-center justify-start rounded-md bg-muted p-1 text-muted-foreground w-max overflow-x-auto">
                  <TabsTrigger value="all" onClick={() => handleCategoryClick('all')} className="whitespace-nowrap">
                    All ({allDocuments.length + templates.length})
                  </TabsTrigger>
                  <TabsTrigger value="documents" onClick={() => handleCategoryClick('documents')} className="whitespace-nowrap">
                    Documents ({allDocuments.length})
                  </TabsTrigger>
                  {categories.map((category) => (
                    <TabsTrigger key={category} value={category} onClick={() => handleCategoryClick(category)} className="whitespace-nowrap">
                      {category} ({documentCategories[category as keyof typeof documentCategories].length})
                    </TabsTrigger>
                  ))}
                  <TabsTrigger value="forms" onClick={() => handleCategoryClick('forms')} className="whitespace-nowrap">
                    Forms ({templates.length})
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Column Visibility */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Columns <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {availableColumns.map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      checked={columnVisibility[column.id] !== false}
                      onCheckedChange={(value) =>
                        setColumnVisibility(prev => ({ ...prev, [column.id]: value }))
                      }
                    >
                      {column.label}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Action Buttons for Forms */}
            {selectedTab === 'forms' && (
              <div className="mb-6 flex gap-4">
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create New Form
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Import Template
                </Button>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <Button variant="outline" className="flex items-center gap-2" disabled>
                        <Download className="h-4 w-4" />
                        Bulk Export
                      </Button>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Downloads disabled pending login verification</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <Button variant="outline" className="flex items-center gap-2" disabled>
                        <Printer className="h-4 w-4" />
                        Print Batch
                      </Button>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Downloads disabled pending login verification</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            )}

            {/* Table */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-0">
                <DataTable
                  columns={columns}
                  data={filteredItems}
                  showColumnVisibility={false}
                  showPagination={true}
                  pageSize={20}
                  columnVisibility={columnVisibility}
                  onColumnVisibilityChange={setColumnVisibility}
                  onRowClick={(item) => {
                    if (item.itemType === 'form' && item.id) {
                      handleFormSelect(typeof item.id === 'string' ? parseInt(item.id) : item.id);
                    } else {
                      // Open details sheet for document
                      const category = item.category;
                      
                      setSelectedCategoryDetails({
                        name: `${item.name}`,
                        type: 'documents',
                        description: `Document in ${category} category`,
                        count: 1,
                        totalSize: item.size,
                        lastUpdated: item.lastUpdated || '2025-01-04',
                        items: [{
                          id: '0',
                          name: item.name,
                          size: item.size,
                          date: item.lastUpdated || '2025-01-04'
                        }]
                      });
                      
                      setIsDetailsOpen(true);
                    }
                  }}
                />
              </CardContent>
            </Card>
            
            {selectedTab === 'forms' && (
              <div className={`mt-8 p-6 rounded-lg ${getThemeColor('info')}`}>
                <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <DollarSign className="h-6 w-6" />
                  Self-Pay Form Automation
                </h2>
                <p className="text-sm mb-4">
                  Streamline the self-pay process by automatically generating personalized forms based on patient data, 
                  insurance status, and procedure type. Reduce manual entry errors and improve collection rates.
                </p>
                <Button className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Configure Self-Pay Workflow
                </Button>
              </div>
            )}
          </>
        )}
      
      {/* Details Sheet */}
      {selectedCategoryDetails && (
        <DetailsSheet
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          type="category"
          data={selectedCategoryDetails}
        />
      )}
      </div>
    </TooltipProvider>
  );
}