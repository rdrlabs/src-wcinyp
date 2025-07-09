'use client';

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import contactsData from "@/data/contacts.json";
import providersData from "@/data/providers.json";
import type { Contact, Provider } from "@/types";
import { ReferringProviderTable } from "./components/ReferringProviderTable";
import { TYPOGRAPHY } from "@/constants/typography";
import { cn } from "@/lib/utils";
import { 
  User, 
  Shield, 
  Building, 
  TestTube, 
  Package,
  Phone,
  Mail,
  MapPin
} from "lucide-react";
import { DataTable, DataTableColumn } from "@/components/shared";
import { useSearch } from "@/hooks/shared";

export default function DirectoryPage() {
  const [viewMode, setViewMode] = useState<'directory' | 'providers'>('directory');
  
  const contacts: Contact[] = contactsData.contacts as Contact[];
  const providers: Provider[] = providersData.providers as Provider[];
  
  // Get icon for contact type
  const getContactTypeIcon = (type: string) => {
    switch (type) {
      case 'Provider':
        return <User className="h-4 w-4" />;
      case 'Insurance':
        return <Shield className="h-4 w-4" />;
      case 'Facility':
        return <Building className="h-4 w-4" />;
      case 'Lab':
        return <TestTube className="h-4 w-4" />;
      case 'Vendor':
        return <Package className="h-4 w-4" />;
      default:
        return null;
    }
  };
  
  // Use search hook for contacts
  const contactSearch = useSearch(contacts, {
    searchableFields: ['name', 'department', 'email', 'phone'],
    minSearchLength: 1
  });

  // Use search hook for providers
  const providerSearch = useSearch(providers, {
    searchableFields: ['name', 'specialty', 'department', 'location'],
    minSearchLength: 1
  });

  // Define columns for contacts table
  const contactColumns: DataTableColumn<Contact>[] = [
    {
      key: 'name',
      header: 'Name',
      accessor: (contact) => <span className="font-semibold">{contact.name}</span>
    },
    {
      key: 'type',
      header: 'Type',
      accessor: (contact) => (
        <Badge 
          variant="secondary"
          className="flex items-center gap-2 w-fit"
        >
          {getContactTypeIcon(contact.type)}
          {contact.type}
        </Badge>
      )
    },
    {
      key: 'department',
      header: 'Department',
      accessor: (contact) => contact.department
    },
    {
      key: 'contactInfo',
      header: 'Contact Info',
      accessor: (contact) => (
        <div className="text-sm space-y-2">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            {contact.phone}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-4 w-4" />
            {contact.email}
          </div>
        </div>
      )
    },
    {
      key: 'location',
      header: 'Location',
      accessor: (contact) => (
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          {contact.location}
        </div>
      )
    }
  ];

  // Determine search placeholder based on view mode
  const searchPlaceholder = viewMode === 'directory' 
    ? "Search by name, department, email, or phone..."
    : "Search providers by name, specialty, department, or location...";

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className={TYPOGRAPHY.pageTitle}>Directory</h1>
        <p className={cn(TYPOGRAPHY.pageDescription, "mt-2")}>
          {viewMode === 'directory' 
            ? 'Comprehensive contact database for all internal staff, facilities, and partners'
            : 'External providers who refer patients to our imaging center'
          }
        </p>
      </div>
      
      {/* View Toggle */}
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'directory' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('directory')}
            className="min-w-[100px]"
          >
            Directory
          </Button>
          <Button
            variant={viewMode === 'providers' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('providers')}
            className="min-w-[180px]"
          >
            Referring Provider Database
          </Button>
        </div>
      </div>
      
      {/* Conditional rendering based on view mode */}
      {viewMode === 'directory' ? (
        <DataTable
          data={contactSearch.filteredData}
          columns={contactColumns}
          searchPlaceholder={searchPlaceholder}
          onSearch={contactSearch.handleSearch}
          searchValue={contactSearch.searchQuery}
          emptyMessage="No contacts found matching your search."
          getRowKey={(contact) => contact.id}
        />
      ) : (
        // Referring Provider Database View
        <ReferringProviderTable 
          providers={providerSearch.filteredData}
          searchTerm={providerSearch.searchQuery}
          onSearch={providerSearch.handleSearch}
        />
      )}
    </div>
  );
}