'use client';

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import contactsData from "@/data/contacts.json";
import type { Contact } from "@/types";
import { 
  User, 
  Shield, 
  Building, 
  TestTube, 
  Package, 
  UserPlus, 
  FileUp, 
  Search,
  Edit,
  StickyNote,
  Phone,
  Mail,
  MapPin,
  Calendar
} from "lucide-react";

export default function DirectoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  
  const contacts: Contact[] = contactsData.contacts as Contact[];

  // Get unique contact types
  const contactTypes = ["all", ...new Set(contacts.map(c => c.type))] as const;
  
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
  const filteredByType = selectedType === "all" 
    ? contacts 
    : contacts.filter(contact => contact.type === selectedType);
    
  const filteredContacts = searchTerm
    ? filteredByType.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.phone.includes(searchTerm)
      )
    : filteredByType;

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Directory</h1>
        <p className="text-muted-foreground mt-2">
          Comprehensive contact database for all providers, facilities, and partners
        </p>
      </div>
      
      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap gap-2">
          {contactTypes.map((type) => (
            <Button
              key={type}
              variant={selectedType === type ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType(type)}
              className="capitalize flex items-center gap-1.5"
            >
              {type !== "all" && getContactTypeIcon(type)}
              {type === "all" ? "All Contacts" : type}
              <span className="ml-1 text-xs">
                ({type === "all" ? contacts.length : contacts.filter(c => c.type === type).length})
              </span>
            </Button>
          ))}
        </div>
        
        <div className="flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search by name, department, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>
          <Button className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Add Contact
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <FileUp className="h-4 w-4" />
            Import CSV
          </Button>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableCaption>
            {searchTerm && filteredContacts.length === 0 
              ? `No contacts found matching "${searchTerm}"`
              : `${filteredContacts.length} contacts in directory`
            }
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Contact Info</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Last Contact</TableHead>
              <TableHead className="text-right">Actions</TableHead>
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
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    {contact.lastContact}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" className="flex items-center gap-1.5">
                      <Edit className="h-3 w-3" />
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1.5">
                      <StickyNote className="h-3 w-3" />
                      Notes
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}