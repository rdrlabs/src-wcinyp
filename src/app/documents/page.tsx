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

export default function DocumentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Use imported data
  const documentCategories = documentsData.categories as DocumentCategories;

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
              className="capitalize"
            >
              {category === "all" ? "All Documents" : category}
              {category === "all" && (
                <span className="ml-2 text-xs">({allDocuments.length})</span>
              )}
              {category !== "all" && (
                <span className="ml-2 text-xs">({documentCategories[category as keyof typeof documentCategories].length})</span>
              )}
            </Button>
          ))}
        </div>

        <input
          type="search"
          placeholder="Search documents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 border rounded-lg"
        />
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
                <TableCell className="font-medium">{doc.name}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                    {doc.category}
                  </span>
                </TableCell>
                <TableCell>{doc.size}</TableCell>
                <TableCell>{doc.lastUpdated}</TableCell>
                <TableCell className="text-right">
                  <a
                    href={`/documents/${doc.path}`}
                    download
                    className="inline-flex"
                  >
                    <Button variant="ghost" size="sm">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                        />
                      </svg>
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