import React, { useState, useMemo } from 'react';
import Layout from '@theme/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import providersData from '../data/providers.json';

interface PriorityNote {
  type: 'critical' | 'contact' | 'info';
  icon: string;
  text: string;
}

interface Provider {
  id: string;
  name: string;
  credentials: string;
  specialty: string;
  department: string;
  npi: string;
  phone: string;
  email: string;
  location: string;
  epic_chat: string[];
  tags: string[];
  associated_providers: string[];
  priority_notes: PriorityNote[];
  last_updated: string;
  updated_by: string;
  status: 'critical' | 'warning' | 'ok';
}

export default function Providers(): React.ReactElement {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const providers: Provider[] = providersData.providers as Provider[];

  const filteredProviders = useMemo(() => {
    let filtered = providers;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(provider => 
        provider.name.toLowerCase().includes(searchLower) ||
        provider.specialty.toLowerCase().includes(searchLower) ||
        provider.department.toLowerCase().includes(searchLower) ||
        provider.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
        provider.priority_notes.some(note => note.text.toLowerCase().includes(searchLower)) ||
        provider.phone.includes(searchTerm) ||
        provider.npi.includes(searchTerm)
      );
    }

    if (activeFilters.length > 0) {
      filtered = filtered.filter(provider => {
        return activeFilters.every(filter => {
          switch (filter) {
            case 'critical':
              return provider.status === 'critical';
            case 'neurology':
              return provider.department.toLowerCase() === 'neurology';
            case 'cardiology':
              return provider.department.toLowerCase() === 'cardiology';
            case 'oncology':
              return provider.department.toLowerCase() === 'oncology';
            case '3t-required':
              return provider.tags.includes('3T-required');
            case 'pths-only':
              return provider.tags.includes('PTHS-only');
            case 'no-direct-contact':
              return provider.tags.includes('no-direct-contact');
            default:
              return provider.tags.includes(filter);
          }
        });
      });
    }

    return filtered;
  }, [providers, searchTerm, activeFilters]);

  const toggleFilter = (filter: string) => {
    setActiveFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const downloadJSON = () => {
    const dataStr = JSON.stringify(providersData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `wcinyp-providers-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'critical': return 'destructive';
      case 'warning': return 'secondary';
      case 'ok': return 'default';
      default: return 'outline';
    }
  };

  const criticalCount = providers.filter(p => p.status === 'critical').length;

  return (
    <Layout
      title="Provider Database"
      description="Comprehensive provider directory with search and filtering"
    >
      <div className="min-h-screen bg-background">
        {/* Header Section */}
        <div className="border-b bg-card">
          <div className="container mx-auto px-6 py-8">
            <div className="mb-6">
              <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
                Provider Database
              </h1>
              <p className="text-muted-foreground">
                {filteredProviders.length} providers ({criticalCount} critical)
              </p>
            </div>
            
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  🔍
                </div>
                <Input
                  type="text"
                  placeholder="Search providers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 max-w-md"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 flex-wrap items-center justify-between">
              <div className="flex gap-2 flex-wrap">
                {[
                  { key: 'neurology', label: 'Neurology' },
                  { key: 'cardiology', label: 'Cardiology' },
                  { key: 'oncology', label: 'Oncology' },
                  { key: 'critical', label: 'Critical Notes' },
                  { key: 'pths-only', label: 'PTHS Only' },
                  { key: '3t-required', label: '3T Required' },
                  { key: 'no-direct-contact', label: 'No Direct Contact' }
                ].map(filter => (
                  <Button
                    key={filter.key}
                    variant={activeFilters.includes(filter.key) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleFilter(filter.key)}
                    className={cn(
                      "text-xs",
                      filter.key === 'critical' && "border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    )}
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>
              
              <Button onClick={downloadJSON} variant="secondary" size="sm">
                📥 Export JSON
              </Button>
            </div>
          </div>
        </div>

        {/* Providers Grid */}
        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProviders.map(provider => (
              <Card key={provider.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold leading-tight mb-1">
                        {provider.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground font-medium">
                        {provider.specialty}
                      </p>
                    </div>
                    <div className={cn(
                      "w-3 h-3 rounded-full flex-shrink-0 mt-1",
                      provider.status === 'critical' && "bg-destructive",
                      provider.status === 'warning' && "bg-yellow-500",
                      provider.status === 'ok' && "bg-green-500"
                    )} />
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Contact Info */}
                  <div className="space-y-2 text-sm">
                    <div className="flex">
                      <span className="text-muted-foreground w-16 font-medium">Phone:</span>
                      <span className="font-medium">{provider.phone}</span>
                    </div>
                    <div className="flex">
                      <span className="text-muted-foreground w-16 font-medium">Location:</span>
                      <span className="font-medium">{provider.location}</span>
                    </div>
                    {provider.epic_chat.length > 0 && (
                      <div className="flex">
                        <span className="text-muted-foreground w-16 font-medium">Epic:</span>
                        <span className="font-medium">{provider.epic_chat.join(', ')}</span>
                      </div>
                    )}
                  </div>

                  {/* Priority Notes */}
                  {provider.priority_notes.length > 0 && (
                    <div className="bg-muted rounded-lg p-3">
                      {provider.priority_notes.map((note, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm">
                          <span className="text-base mt-0.5 flex-shrink-0">{note.icon}</span>
                          <span className={cn(
                            "leading-relaxed",
                            note.type === 'critical' && "text-destructive font-medium"
                          )}>
                            {note.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tags */}
                  <div className="flex gap-1 flex-wrap">
                    {provider.tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-secondary text-secondary-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredProviders.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold mb-2">No providers found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or filters.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}