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
import providersData from "@/data/providers.json";
import type { Provider } from "@/types";

export default function ProvidersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const providers: Provider[] = providersData.providers;
  
  // Filter providers based on search
  const filteredProviders = searchTerm
    ? providers.filter(provider =>
        provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : providers;

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Provider Directory</h1>
        <p className="text-muted-foreground mt-2">
          Medical staff contact information and specialties
        </p>
      </div>
      
      <div className="mb-6">
        <input
          type="search"
          placeholder="Search providers by name, specialty, department, or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 border rounded-lg"
        />
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableCaption>
            {searchTerm && filteredProviders.length === 0 
              ? `No providers found matching "${searchTerm}"`
              : `${filteredProviders.length} providers in directory`
            }
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Specialty</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProviders.map((provider) => (
              <TableRow key={provider.id}>
                <TableCell className="font-medium">{provider.name}</TableCell>
                <TableCell>{provider.specialty}</TableCell>
                <TableCell>{provider.department}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-700/10">
                    {provider.location}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{provider.phone}</div>
                    <div className="text-muted-foreground">{provider.email}</div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}