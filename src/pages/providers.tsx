import React, { useState, useMemo } from 'react';
import Layout from '@theme/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { AppErrorBoundary, PageErrorBoundary } from '@/components/ErrorBoundary';
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      case 'warning':
        return <Badge variant="warning">Warning</Badge>;
      default:
        return <Badge variant="success">Active</Badge>;
    }
  };

  const criticalCount = providers.filter(p => p.status === 'critical').length;

  return (
    <PageErrorBoundary>
      <Layout 
        title="Provider Database" 
        description="WCINYP Provider Contact Information and Guidelines"
      >
        <AppErrorBoundary>
          <main role="main">
            {/* Header Section - Similar to original */}
            <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border-b">
              <div className="container mx-auto px-6 py-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                      Provider Database
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                      {providers.length} providers • {criticalCount} critical notes
                    </p>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 text-right">
                    <p>Last Updated</p>
                    <p className="font-medium">{new Date().toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Search */}
                <div className="mb-6">
                  <Input
                    type="text"
                    placeholder="Search providers by name, specialty, department, phone, or NPI..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full max-w-2xl"
                    aria-label="Search providers"
                  />
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

            {/* Table Section */}
            <div className="container mx-auto px-6 py-8">
              <div className="rounded-lg border bg-card">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">Provider</TableHead>
                      <TableHead>Specialty</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Tags</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProviders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          <div className="text-muted-foreground">
                            <p className="text-lg font-medium mb-1">No providers found</p>
                            <p className="text-sm">Try adjusting your search criteria</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredProviders.map((provider) => (
                        <TableRow key={provider.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">
                            <div>
                              <div className="font-semibold">{provider.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {provider.credentials} • NPI: {provider.npi}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{provider.specialty}</TableCell>
                          <TableCell className="capitalize">{provider.department}</TableCell>
                          <TableCell>
                            <div className="text-sm space-y-1">
                              <div className="font-medium">{provider.phone}</div>
                              <div className="text-muted-foreground">{provider.email}</div>
                              {provider.epic_chat.length > 0 && (
                                <div className="text-xs text-muted-foreground">
                                  Epic: {provider.epic_chat.join(', ')}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">{provider.location}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {provider.tags.slice(0, 3).map((tag, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {provider.tags.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{provider.tags.length - 3}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {getStatusBadge(provider.status)}
                              {provider.priority_notes.length > 0 && (
                                <div className="text-xs text-muted-foreground">
                                  {provider.priority_notes.length} note{provider.priority_notes.length !== 1 ? 's' : ''}
                                </div>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Footer */}
              <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                <div>
                  Showing {filteredProviders.length} of {providers.length} providers
                </div>
                <div className="flex items-center gap-2">
                  <span>Critical Notes Legend:</span>
                  <Badge variant="destructive" className="text-xs">Critical</Badge>
                  <Badge variant="warning" className="text-xs">Warning</Badge>
                  <Badge variant="success" className="text-xs">Active</Badge>
                </div>
              </div>
            </div>
          </main>
        </AppErrorBoundary>
      </Layout>
    </PageErrorBoundary>
  );
}