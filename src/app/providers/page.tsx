'use client';

import { useState } from "react";
import { ProviderTable } from "@/components/ui/provider-table";
import providersData from "@/data/providers.json";
import type { Provider } from "@/types";
import { Search } from "lucide-react";

export default function ProvidersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const providers = providersData.providers as Provider[];
  
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
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search providers by name, specialty, department, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>
      </div>
      
      <ProviderTable providers={filteredProviders} searchTerm={searchTerm} />
    </div>
  );
}