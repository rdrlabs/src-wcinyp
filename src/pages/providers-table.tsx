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

export default function ProvidersTable(): React.ReactElement {
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
        provider.priority_notes.some(note => note.text.toLowerCase().includes(searchLower))
      );
    }

    if (activeFilters.length > 0) {
      filtered = filtered.filter(provider => {
        if (activeFilters.includes('critical') && provider.status === 'critical') {
          return true;
        }
        if (activeFilters.includes(provider.department.toLowerCase())) {
          return true;
        }
        if (activeFilters.some(filter => 
          provider.tags.some(tag => tag.toLowerCase().includes(filter))
        )) {
          return true;
        }
        return false;
      });
    }

    return filtered;
  }, [searchTerm, activeFilters, providers]);

  const toggleFilter = (filter: string) => {
    setActiveFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const downloadJSON = () => {
    const dataStr = JSON.stringify(filteredProviders, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `wcinyp-providers-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
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

  return (
    <PageErrorBoundary>
      <Layout 
        title="Provider Database" 
        description="WCINYP Provider Contact Information and Guidelines"
      >
        <AppErrorBoundary>
          <main className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
              <h2 className="text-3xl font-bold tracking-tight">Provider Database</h2>
              <div className="flex items-center space-x-2">
                <Button onClick={downloadJSON} variant="outline" size="sm">
                  Export JSON
                </Button>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Search providers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
              <div className="flex gap-2">
                {[
                  { key: 'critical', label: 'Critical', variant: 'destructive' as const },
                  { key: 'neurology', label: 'Neurology', variant: 'outline' as const },
                  { key: 'cardiology', label: 'Cardiology', variant: 'outline' as const },
                  { key: 'oncology', label: 'Oncology', variant: 'outline' as const },
                ].map(filter => (
                  <Button
                    key={filter.key}
                    variant={activeFilters.includes(filter.key) ? "default" : filter.variant}
                    size="sm"
                    onClick={() => toggleFilter(filter.key)}
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Provider</TableHead>
                    <TableHead>Specialty</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProviders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No providers found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProviders.map((provider) => (
                      <TableRow key={provider.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div className="font-semibold">{provider.name}</div>
                            <div className="text-sm text-muted-foreground">{provider.credentials}</div>
                          </div>
                        </TableCell>
                        <TableCell>{provider.specialty}</TableCell>
                        <TableCell>{provider.department}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{provider.phone}</div>
                            <div className="text-muted-foreground">{provider.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>{provider.location}</TableCell>
                        <TableCell>{getStatusBadge(provider.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            
            <div className="flex items-center justify-between px-2">
              <div className="text-sm text-muted-foreground">
                Showing {filteredProviders.length} of {providers.length} providers
              </div>
              <div className="flex items-center space-x-6 lg:space-x-8">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium">Rows per page</p>
                  <select className="h-8 w-[70px] rounded-md border border-input bg-transparent px-3 py-1 text-sm">
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="30">30</option>
                    <option value="40">40</option>
                    <option value="50">50</option>
                  </select>
                </div>
                <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                  Page 1 of 1
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </main>
        </AppErrorBoundary>
      </Layout>
    </PageErrorBoundary>
  );
}