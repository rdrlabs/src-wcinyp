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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Provider } from "@/types";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Building2,
  Download,
  Calendar,
  ChevronRight,
  ChevronDown,
  Clock,
  FileText,
  Shield,
  Star,
  Languages
} from "lucide-react";
import { 
  getSpecialtyIcon, 
  getLocationColor, 
  getAffiliationInfo, 
  getFlagInfo 
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
    <TooltipProvider>
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
                        
                        {/* Provider flags */}
                        {provider.flags && provider.flags.length > 0 && (
                          <div className="absolute -right-1 -bottom-1 flex gap-0.5">
                            {provider.flags.slice(0, 3).map((flag) => {
                              const flagInfo = getFlagInfo(flag);
                              const Icon = flagInfo.icon;
                              return (
                                <Tooltip key={flag}>
                                  <TooltipTrigger>
                                    <div className={`bg-white rounded-full p-1 shadow-sm border ${flagInfo.color}`}>
                                      <Icon className="h-3 w-3" />
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{flagInfo.tooltip}</p>
                                  </TooltipContent>
                                </Tooltip>
                              );
                            })}
                          </div>
                        )}
                      </div>
              
                      <div className="flex-1 space-y-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold">{provider.name}</h3>
                            {provider.availableToday && (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                <Clock className="h-3 w-3 mr-1" />
                                Available Today
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            {(() => {
                              const SpecIcon = getSpecialtyIcon(provider.specialty);
                              return <SpecIcon className="h-4 w-4" />;
                            })()}
                            <span className="text-sm font-medium">{provider.specialty}</span>
                            <span className="text-muted-foreground">•</span>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Building2 className="h-3 w-3" />
                              {provider.department}
                            </div>
                          </div>
                          {provider.npi && (
                            <div className="flex items-center gap-2 mt-1">
                              <Shield className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs font-mono text-muted-foreground">NPI: {provider.npi}</span>
                            </div>
                          )}
                        </div>
                
                        <div className="flex flex-wrap gap-2">
                          {provider.affiliation && (
                            <Badge 
                              variant="secondary" 
                              className={`${affiliationInfo.color} ring-1 ring-inset font-medium`}
                            >
                              {affiliationInfo.label}
                            </Badge>
                          )}
                          <Badge 
                            variant="secondary" 
                            className={`${getLocationColor(provider.location)} ring-1 ring-inset`}
                          >
                            <MapPin className="h-3 w-3 mr-1" />
                            {provider.location}
                          </Badge>
                          
                          {provider.languages && provider.languages.length > 0 && (
                            <Badge variant="outline" className="text-xs">
                              <Languages className="h-3 w-3 mr-1" />
                              {provider.languages.join(', ')}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <Star className="h-3 w-3 text-gray-300" />
                            <span className="text-xs text-muted-foreground ml-1">(4.8)</span>
                          </div>
                          
                          {provider.notes && (
                            <CollapsibleTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-6 px-2">
                                <FileText className="h-3 w-3 mr-1" />
                                Notes
                                {isExpanded ? <ChevronDown className="h-3 w-3 ml-1" /> : <ChevronRight className="h-3 w-3 ml-1" />}
                              </Button>
                            </CollapsibleTrigger>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right side - Contact info and actions */}
                    <div className="flex flex-col items-end justify-between h-full min-h-[100px]">
                      <div className="text-right space-y-2">
                        <a 
                          href={`tel:${provider.phone}`} 
                          className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
                        >
                          <Phone className="h-3 w-3" />
                          {provider.phone}
                        </a>
                        <a 
                          href={`mailto:${provider.email}`} 
                          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Mail className="h-3 w-3" />
                          {provider.email}
                        </a>
                      </div>
                      
                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Schedule
                        </Button>
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <Download className="h-3 w-3" />
                          vCard
                        </Button>
                        <Button size="sm" className="flex items-center gap-1">
                          View Profile
                          <ChevronRight className="h-3 w-3" />
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
                            <h4 className="text-sm font-medium mb-1">Provider Notes</h4>
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
    </TooltipProvider>
  );
}