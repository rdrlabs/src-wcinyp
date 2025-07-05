'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import formTemplatesData from "@/data/form-templates.json";
import type { FormTemplate } from "@/types";
import { 
  Plus, 
  Upload, 
  Download, 
  Edit, 
  Eye, 
  Copy, 
  FileText, 
  Users, 
  Calendar,
  CheckCircle,
  AlertCircle,
  Settings,
  FolderOpen,
  ClipboardList,
  DollarSign,
  User,
  Shield
} from "lucide-react";

export default function FormsPage() {
  const templates: FormTemplate[] = formTemplatesData.templates as FormTemplate[];
  
  // Get icon for category
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'self-pay':
        return <DollarSign className="h-3 w-3" />;
      case 'patient-info':
        return <User className="h-3 w-3" />;
      case 'insurance':
        return <Shield className="h-3 w-3" />;
      default:
        return <ClipboardList className="h-3 w-3" />;
    }
  };
  
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Form Generator</h1>
        <p className="text-muted-foreground mt-2">
          Automate document creation and streamline the self-pay form process
        </p>
      </div>
      
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
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableCaption>
            {templates.length} form templates available for automation
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
            {templates.map((template) => (
              <TableRow key={template.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    {template.name}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-1 rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
                    {getCategoryIcon(template.category)}
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
                  <span className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                    template.status === 'active' 
                      ? 'bg-green-50 text-green-700 ring-green-700/10' 
                      : 'bg-yellow-50 text-yellow-700 ring-yellow-700/10'
                  }`}>
                    {template.status === 'active' ? <CheckCircle className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                    {template.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/forms/${template.id}`}>
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <Edit className="h-3 w-3" />
                        Edit
                      </Button>
                    </Link>
                    <Link href={`/forms/${template.id}`}>
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        Preview
                      </Button>
                    </Link>
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
      </div>
      
      <div className="mt-8 p-6 bg-blue-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Self-Pay Form Automation
        </h2>
        <p className="text-sm text-gray-700 mb-4">
          Streamline the self-pay process by automatically generating personalized forms based on patient data, 
          insurance status, and procedure type. Reduce manual entry errors and improve collection rates.
        </p>
        <Button className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Configure Self-Pay Workflow
        </Button>
      </div>
    </div>
  );
}