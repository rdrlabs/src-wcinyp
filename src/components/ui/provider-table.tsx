'use client';

import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { Provider } from "@/types";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Building2,
  ChevronRight,
  ChevronDown,
  FileText,
  Shield
} from "lucide-react";
import { 
  getSpecialtyIcon, 
  getAffiliationInfo
} from "@/lib/icons";

interface ProviderTableProps {
  providers: Provider[];
  searchTerm?: string;
}

export function ProviderTable({ providers, searchTerm }: ProviderTableProps) {
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());

  const toggleCard = (id: number) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCards(newExpanded);
  };

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };


  if (providers.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          {searchTerm 
            ? `No providers found matching "${searchTerm}"`
            : 'No providers available'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
        {providers.map((provider) => {
          const isExpanded = expandedCards.has(provider.id);
          const affiliationInfo = getAffiliationInfo(provider.affiliation);
          
          return (
            <Card key={provider.id} className="hover:shadow-lg transition-shadow">
              <Collapsible open={isExpanded} onOpenChange={() => toggleCard(provider.id)}>
                <div className="p-6">
                  <div className="flex items-start justify-between gap-6">
                    {/* Left side - Provider info */}
                    <div className="flex gap-4 flex-1">
                      <div className="relative">
                        <Avatar className="h-16 w-16">
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                            {getInitials(provider.name)}
                          </AvatarFallback>
                        </Avatar>
                        
                      </div>
              
                      <div className="flex-1 space-y-3">
                        <div>
                          <h3 className="text-lg font-semibold">{provider.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            {(() => {
                              const SpecIcon = getSpecialtyIcon(provider.specialty);
                              return <SpecIcon className="h-4 w-4" />;
                            })()}
                            <span className="text-sm font-semibold">{provider.specialty}</span>
                            <span className="text-muted-foreground">•</span>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Building2 className="h-4 w-4" />
                              {provider.department}
                            </div>
                          </div>
                          {provider.npi && (
                            <div className="flex items-center gap-2 mt-1">
                              <Shield className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm font-mono text-muted-foreground">NPI: {provider.npi}</span>
                            </div>
                          )}
                        </div>
                
                        <div className="flex flex-wrap gap-2">
                          {provider.affiliation && (
                            <Badge 
                              variant="secondary" 
                              className="font-semibold"
                            >
                              {affiliationInfo.label}
                            </Badge>
                          )}
                          <Badge 
                            variant="secondary"
                          >
                            <MapPin className="h-4 w-4 mr-1" />
                            {provider.location}
                          </Badge>
                          
                        </div>
                        
                        {provider.notes && (
                          <div className="mt-2">
                            <CollapsibleTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-6 px-2">
                                <FileText className="h-4 w-4 mr-1" />
                                Notes
                                {isExpanded ? <ChevronDown className="h-4 w-4 ml-1" /> : <ChevronRight className="h-4 w-4 ml-1" />}
                              </Button>
                            </CollapsibleTrigger>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right side - Contact info and actions */}
                    <div className="flex flex-col items-end justify-between h-full min-h-[100px]">
                      <div className="text-right space-y-2">
                        <a 
                          href={`tel:${provider.phone}`} 
                          className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                        >
                          <Phone className="h-4 w-4" />
                          {provider.phone}
                        </a>
                        <a 
                          href={`mailto:${provider.email}`} 
                          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Mail className="h-4 w-4" />
                          {provider.email}
                        </a>
                      </div>
                      
                      <div className="mt-4">
                        <Button size="sm" className="flex items-center gap-2">
                          View Profile
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Expandable notes section */}
                  {provider.notes && (
                    <CollapsibleContent className="mt-4">
                      <div className="pt-4 border-t">
                        <div className="flex items-start gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold mb-1">Provider Notes</h4>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{provider.notes}</p>
                          </div>
                        </div>
                      </div>
                    </CollapsibleContent>
                  )}
                </div>
              </Collapsible>
            </Card>
          );
        })}
    </div>
  );
}