'use client';

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Provider } from "@/types";
import { 
  Phone, 
  Mail, 
  ChevronDown,
  ChevronRight,
  Shield,
  FileText
} from "lucide-react";
import { getAffiliationInfo } from "@/lib/icons";

interface ReferringProviderTableProps {
  providers: Provider[];
  searchTerm?: string;
}

export function ReferringProviderTable({ providers, searchTerm }: ReferringProviderTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const toggleRow = (id: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  if (providers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          {searchTerm 
            ? `No referring providers found matching "${searchTerm}"`
            : 'No referring providers available'
          }
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[30px]"></TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Specialty / Department</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Affiliation</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {providers.map((provider) => {
          const isExpanded = expandedRows.has(provider.id);
          const affiliationInfo = getAffiliationInfo(provider.affiliation);
          
          return (
            <>
              <TableRow 
                key={provider.id} 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => toggleRow(provider.id)}
              >
                <TableCell>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </Button>
                </TableCell>
                <TableCell className="font-medium">{provider.name}</TableCell>
                <TableCell>
                  <div className="space-y-0.5">
                    <div className="text-sm">{provider.specialty}</div>
                    <div className="text-sm text-muted-foreground">{provider.department}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <a 
                      href={`tel:${provider.phone}`} 
                      className="flex items-center gap-1.5 text-sm hover:text-primary"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Phone className="h-3 w-3" />
                      {provider.phone}
                    </a>
                    <a 
                      href={`mailto:${provider.email}`} 
                      className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Mail className="h-3 w-3" />
                      {provider.email}
                    </a>
                  </div>
                </TableCell>
                <TableCell>{provider.location}</TableCell>
                <TableCell>
                  <Badge 
                    variant="secondary" 
                    className={`${affiliationInfo.color} ring-1 ring-inset`}
                  >
                    {affiliationInfo.label}
                  </Badge>
                </TableCell>
              </TableRow>
              {isExpanded && (
                <TableRow>
                  <TableCell colSpan={6} className="bg-muted/30">
                    <div className="py-4 px-8 space-y-3">
                      {provider.npi && (
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            <span className="font-medium">NPI:</span> {provider.npi}
                          </span>
                        </div>
                      )}
                      {provider.notes && (
                        <div className="flex items-start gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div className="space-y-1">
                            <span className="text-sm font-medium">Notes:</span>
                            <p className="text-sm text-muted-foreground">{provider.notes}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </>
          );
        })}
      </TableBody>
    </Table>
  );
}