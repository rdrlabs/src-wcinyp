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
import formTemplatesData from "@/data/form-templates.json";
import type { FormTemplate } from "@/types";

export default function FormsPage() {
  const templates: FormTemplate[] = formTemplatesData.templates as FormTemplate[];
  
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Form Generator</h1>
        <p className="text-muted-foreground mt-2">
          Automate document creation and streamline the self-pay form process
        </p>
      </div>
      
      <div className="mb-6 flex gap-4">
        <Button>Create New Form</Button>
        <Button variant="outline">Import Template</Button>
        <Button variant="outline">Bulk Export</Button>
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
                <TableCell className="font-medium">{template.name}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
                    {template.category}
                  </span>
                </TableCell>
                <TableCell className="text-center">{template.fields}</TableCell>
                <TableCell className="text-center">{template.submissions}</TableCell>
                <TableCell>{template.lastUsed}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                    template.status === 'active' 
                      ? 'bg-green-50 text-green-700 ring-green-700/10' 
                      : 'bg-yellow-50 text-yellow-700 ring-yellow-700/10'
                  }`}>
                    {template.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <a href={`/forms/${template.id}`}>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </a>
                    <a href={`/forms/${template.id}`}>
                      <Button variant="ghost" size="sm">
                        Preview
                      </Button>
                    </a>
                    <Button variant="ghost" size="sm">
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
        <h2 className="text-lg font-semibold mb-2">Self-Pay Form Automation</h2>
        <p className="text-sm text-gray-700 mb-4">
          Streamline the self-pay process by automatically generating personalized forms based on patient data, 
          insurance status, and procedure type. Reduce manual entry errors and improve collection rates.
        </p>
        <Button>Configure Self-Pay Workflow</Button>
      </div>
    </div>
  );
}