'use client';

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import contactsData from "@/data/contacts.json";
import providersData from "@/data/providers.json";
import type { Contact, Provider } from "@/types";
import { ReferringProviderTable } from "./components/ReferringProviderTable";
import { 
  User, 
  Shield, 
  Building, 
  TestTube, 
  Package, 
  Search,
  Phone,
  Mail,
  MapPin
} from "lucide-react";

export default function DirectoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
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
  
  // Filter contacts
  const filteredContacts = searchTerm
    ? contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.phone.includes(searchTerm)
      )
    : contacts;

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Directory</h1>
        <p className="text-muted-foreground mt-2">
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
      
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={viewMode === 'directory' 
              ? "Search by name, department, email, or phone..."
              : "Search providers by name, specialty, department, or location..."
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      {/* Conditional rendering based on view mode */}
      {viewMode === 'directory' ? (
        <div className="rounded-md border">
          <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Contact Info</TableHead>
              <TableHead>Location</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContacts.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell className="font-medium">{contact.name}</TableCell>
                <TableCell>
                  <Badge 
                    variant="secondary"
                    className={`flex items-center gap-1.5 w-fit ${
                      contact.type === 'Provider' ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800' :
                      contact.type === 'Insurance' ? 'bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800' :
                      contact.type === 'Facility' ? 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800' :
                      contact.type === 'Lab' ? 'bg-yellow-50 dark:bg-yellow-950/50 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800' :
                      contact.type === 'Vendor' ? 'bg-orange-50 dark:bg-orange-950/50 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800' :
                      'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    {getContactTypeIcon(contact.type)}
                    {contact.type}
                  </Badge>
                </TableCell>
                <TableCell>{contact.department}</TableCell>
                <TableCell>
                  <div className="text-sm space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      {contact.phone}
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      {contact.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    {contact.location}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          </Table>
        </div>
      ) : (
        // Referring Provider Database View
        <ReferringProviderTable 
          providers={searchTerm
            ? providers.filter(provider =>
                provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                provider.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                provider.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                provider.location.toLowerCase().includes(searchTerm.toLowerCase())
              )
            : providers
          }
          searchTerm={searchTerm}
        />
      )}
    </div>
  );
}