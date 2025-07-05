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
import documentsData from "@/data/documents.json";
import type { DocumentCategories } from "@/types";
import { 
  Search, 
  Download, 
  FileText, 
  FolderOpen, 
  Calendar,
  HardDrive,
  ClipboardList,
  Heart,
  User,
  Shield
} from "lucide-react";

export default function DocumentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Use imported data
  const documentCategories = documentsData.categories as DocumentCategories;

  // Get icon for category
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'forms':
      case 'all':
        return <ClipboardList className="h-4 w-4" />;
      case 'patient':
        return <User className="h-4 w-4" />;
      case 'insurance':
        return <Shield className="h-4 w-4" />;
      case 'clinical':
        return <Heart className="h-4 w-4" />;
      default:
        return <FolderOpen className="h-4 w-4" />;
    }
  };

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

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Document Hub</h1>
        <p className="text-muted-foreground mt-2">
          Medical forms and documents repository
        </p>
      </div>

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
              {getCategoryIcon(category)}
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

      <div className="rounded-md border">
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
                  <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                    {getCategoryIcon(doc.category)}
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
      </div>
    </div>
  );
}