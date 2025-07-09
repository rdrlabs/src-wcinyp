'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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

  // Calculate stats
  const documentsCount = allDocuments.length;
  const formsCount = templates.length;
  const activeFormsCount = templates.filter(t => t.status === 'active').length;
  const totalSubmissions = templates.reduce((sum, t) => sum + t.submissions, 0);

  return (
    <TooltipProvider>
      <div className="container mx-auto py-8 space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className={TYPOGRAPHY.pageTitle}>Documents & Forms</h1>
              <p className={cn(TYPOGRAPHY.pageDescription, "mt-1")}>
                Access medical forms, documents, and create custom forms
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative w-64">
                <Input
                  type="search"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
              
              {/* View Toggle */}
              <div className="flex items-center gap-2">
                <Label className="text-sm">Documents</Label>
                <Switch
                  checked={viewMode === 'forms'}
                  onCheckedChange={(checked) => setViewMode(checked ? 'forms' : 'documents')}
                />
                <Label className="text-sm">Forms</Label>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center">
              <p className="text-2xl font-semibold">{documentsCount}</p>
              <p className="text-sm text-muted-foreground">Total Documents</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold">{formsCount}</p>
              <p className="text-sm text-muted-foreground">Form Templates</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold">{activeFormsCount}</p>
              <p className="text-sm text-muted-foreground">Active Forms</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold">{totalSubmissions}</p>
              <p className="text-sm text-muted-foreground">Total Submissions</p>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap mt-4">
            {viewMode === 'documents' && categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="capitalize flex items-center gap-2"
              >
                {(() => {
                  const Icon = getCategoryIcon(category);
                  return <Icon className="h-4 w-4" />;
                })()}
                {category === "all" ? "All Documents" : category}
                {category === "all" && (
                  <span className="ml-1 text-sm">({allDocuments.length})</span>
                )}
                {category !== "all" && (
                  <span className="ml-1 text-sm">({documentCategories[category as keyof typeof documentCategories].length})</span>
                )}
              </Button>
            ))}
          </div>
        </CardHeader>
      </Card>

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
            template={templates.find(t => (typeof t.id === 'string' ? parseInt(t.id) : t.id) === selectedFormId)!}
          />
        </div>
      ) : (
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">

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
                <TableCell className="font-semibold">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    {doc.name}
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center gap-2 rounded-md px-2 py-2 text-sm font-semibold ring-1 ring-inset ${getThemeColor('blue')}`}>
                    {(() => {
                      const Icon = getCategoryIcon(doc.category);
                      return <Icon className="h-4 w-4" />;
                    })()}
                    {doc.category}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <HardDrive className="h-4 w-4 text-muted-foreground" />
                    {doc.size}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {doc.lastUpdated}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="inline-flex">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="flex items-center gap-2"
                          disabled
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Downloads disabled pending login verification</p>
                    </TooltipContent>
                  </Tooltip>
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
                <TableCell className="font-semibold">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    {template.name}
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center gap-2 rounded-md px-2 py-2 text-sm font-semibold ring-1 ring-inset ${getThemeColor('purple')}`}>
                    {(() => {
                      const Icon = getCategoryIcon(template.category);
                      return <Icon className="h-4 w-4" />;
                    })()}
                    {template.category}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <FolderOpen className="h-4 w-4 text-muted-foreground" />
                    {typeof template.fields === 'number' ? template.fields : template.fields.length}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    {template.submissions}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {template.lastUsed}
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center gap-2 rounded-md px-2 py-2 text-sm font-semibold ring-1 ring-inset ${getStatusColor(template.status)}`}>
                    {template.status === 'active' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                    {template.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex items-center gap-2"
                      onClick={() => handleFormSelect(typeof template.id === 'string' ? parseInt(template.id) : template.id)}
                    >
                      <Edit className="h-4 w-4" />
                      Fill
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Preview
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                      <Copy className="h-4 w-4" />
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
          </CardContent>
        </Card>
      )}
      </div>
    </TooltipProvider>
  );
}