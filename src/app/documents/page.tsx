'use client';

import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import documentsData from "@/data/documents.json";
import formTemplatesData from "@/data/form-templates.json";
import type { DocumentCategories, FormTemplate } from "@/types";
import { FormBuilder } from "@/components/FormBuilder";
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
  FileInput,
  FolderOpen,
  DollarSign
} from "lucide-react";
import { getCategoryIcon } from "@/lib/icons";
import { getThemeColor, getStatusColor } from "@/lib/theme";

export default function DocumentsPage() {
  const [viewMode, setViewMode] = useState<'documents' | 'forms'>('documents');
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedFormId, setSelectedFormId] = useState<number | null>(null);

  // Use imported data
  const documentCategories = documentsData.categories as DocumentCategories;
  const templates: FormTemplate[] = formTemplatesData.templates as FormTemplate[];


  // Flatten all documents for search
  const allDocuments = Object.entries(documentCategories).flatMap(([category, docs]) =>
    docs.map(doc => ({ ...doc, category, lastUpdated: "2025-01-04" }))
  );
  
  // Filter documents based on search and category
  const baseDocuments = selectedCategory === "all"
    ? allDocuments
    : allDocuments.filter(doc => doc.category === selectedCategory);

  const filteredDocuments = searchTerm
    ? baseDocuments.filter(doc =>
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : baseDocuments;

  const categories = ["all", ...Object.keys(documentCategories)];

  // Filter forms
  const filteredForms = searchTerm
    ? templates.filter(template =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : templates;

  // Handle form selection
  const handleFormSelect = (formId: number) => {
    setSelectedFormId(formId);
  };

  const handleBackToList = () => {
    setSelectedFormId(null);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Documents & Forms</h1>
            <p className="text-muted-foreground mt-2">
              {viewMode === 'documents' 
                ? 'Medical forms and documents repository' 
                : 'Create and manage form templates'}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Label htmlFor="view-mode" className="text-sm">
              <FileText className="h-4 w-4 inline mr-1" />
              Documents
            </Label>
            <Switch
              id="view-mode"
              checked={viewMode === 'forms'}
              onCheckedChange={(checked) => setViewMode(checked ? 'forms' : 'documents')}
            />
            <Label htmlFor="view-mode" className="text-sm">
              <FileInput className="h-4 w-4 inline mr-1" />
              Form Filler
            </Label>
          </div>
        </div>
      </div>

      {selectedFormId && viewMode === 'forms' ? (
        <div>
          <Button
            variant="outline"
            onClick={handleBackToList}
            className="mb-4"
          >
            ← Back to Forms
          </Button>
          <FormBuilder 
            template={templates.find(t => t.id === selectedFormId)!}
          />
        </div>
      ) : (
        <>
      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="capitalize flex items-center gap-1.5"
            >
              {(() => {
                const Icon = getCategoryIcon(category);
                return <Icon className="h-4 w-4" />;
              })()}
              {category === "all" ? "All Documents" : category}
              {category === "all" && (
                <span className="ml-1 text-xs">({allDocuments.length})</span>
              )}
              {category !== "all" && (
                <span className="ml-1 text-xs">({documentCategories[category as keyof typeof documentCategories].length})</span>
              )}
            </Button>
          ))}
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>
      </div>

      {viewMode === 'forms' && (
        <div className="mb-6 flex gap-4">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create New Form
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Import Template
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Bulk Export
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            Print Batch
          </Button>
        </div>
      )}

      <div className="rounded-md border">
        {viewMode === 'documents' ? (
        <Table>
          <TableCaption>
            {searchTerm && filteredDocuments.length === 0 
              ? `No documents found matching "${searchTerm}"`
              : `${filteredDocuments.length} documents available`
            }
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Document Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDocuments.map((doc, idx) => (
              <TableRow key={idx}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    {doc.name}
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getThemeColor('blue')}`}>
                    {(() => {
                      const Icon = getCategoryIcon(doc.category);
                      return <Icon className="h-3 w-3" />;
                    })()}
                    {doc.category}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <HardDrive className="h-3 w-3 text-muted-foreground" />
                    {doc.size}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    {doc.lastUpdated}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <a
                    href={`/documents/${doc.path}`}
                    download
                    className="inline-flex"
                  >
                    <Button variant="ghost" size="sm" className="flex items-center gap-1.5">
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </a>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        ) : (
        <Table>
          <TableCaption>
            {searchTerm && filteredForms.length === 0 
              ? `No forms found matching "${searchTerm}"`
              : `${filteredForms.length} form templates available`
            }
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Form Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-center">Fields</TableHead>
              <TableHead className="text-center">Submissions</TableHead>
              <TableHead>Last Used</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredForms.map((template) => (
              <TableRow key={template.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    {template.name}
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getThemeColor('purple')}`}>
                    {(() => {
                      const Icon = getCategoryIcon(template.category);
                      return <Icon className="h-3 w-3" />;
                    })()}
                    {template.category}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <FolderOpen className="h-3 w-3 text-muted-foreground" />
                    {template.fields}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Users className="h-3 w-3 text-muted-foreground" />
                    {template.submissions}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    {template.lastUsed}
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getStatusColor(template.status)}`}>
                    {template.status === 'active' ? <CheckCircle className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                    {template.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex items-center gap-1"
                      onClick={() => handleFormSelect(template.id)}
                    >
                      <Edit className="h-3 w-3" />
                      Fill
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      Preview
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      <Copy className="h-3 w-3" />
                      Clone
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        )}
      </div>
      
      {viewMode === 'forms' && (
        <div className={`mt-8 p-6 rounded-lg ${getThemeColor('info')}`}>
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
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
    </div>
  );
}