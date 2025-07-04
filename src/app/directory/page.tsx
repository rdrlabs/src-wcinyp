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
import contactsData from "@/data/contacts.json";
import type { Contact } from "@/types";

export default function DirectoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  
  const contacts: Contact[] = contactsData.contacts as Contact[];

  // Get unique contact types
  const contactTypes = ["all", ...new Set(contacts.map(c => c.type))] as const;
  
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
              className="capitalize"
            >
              {type === "all" ? "All Contacts" : type}
              <span className="ml-2 text-xs">
                ({type === "all" ? contacts.length : contacts.filter(c => c.type === type).length})
              </span>
            </Button>
          ))}
        </div>
        
        <div className="flex gap-4">
          <input
            type="search"
            placeholder="Search by name, department, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-4 py-2 border rounded-lg"
          />
          <Button>Add Contact</Button>
          <Button variant="outline">Import CSV</Button>
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
                  <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                    contact.type === 'Provider' ? 'bg-blue-50 text-blue-700 ring-blue-700/10' :
                    contact.type === 'Insurance' ? 'bg-green-50 text-green-700 ring-green-700/10' :
                    contact.type === 'Facility' ? 'bg-purple-50 text-purple-700 ring-purple-700/10' :
                    contact.type === 'Lab' ? 'bg-yellow-50 text-yellow-700 ring-yellow-700/10' :
                    contact.type === 'Vendor' ? 'bg-orange-50 text-orange-700 ring-orange-700/10' :
                    'bg-gray-50 text-gray-700 ring-gray-700/10'
                  }`}>
                    {contact.type}
                  </span>
                </TableCell>
                <TableCell>{contact.department}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{contact.phone}</div>
                    <div className="text-muted-foreground">{contact.email}</div>
                  </div>
                </TableCell>
                <TableCell>{contact.location}</TableCell>
                <TableCell>{contact.lastContact}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm">
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