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
import styles from './providers.module.css';

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
          <div className={styles.pageContainer}>
            {/* Header Section */}
            <div className={styles.headerSection}>
              <div className={styles.contentWrapper}>
                <div className={styles.headerContent}>
                  <div>
                    <h1 className={styles.headerTitle}>
                      Provider Database
                    </h1>
                    <p className={styles.headerSubtitle}>
                      {providers.length} providers • {criticalCount} critical notes
                    </p>
                  </div>
                  <div className={styles.lastUpdated}>
                    <p>Last Updated</p>
                    <p style={{ fontWeight: 600 }}>{new Date().toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Search */}
                <div className={styles.searchWrapper}>
                  <Input
                    type="text"
                    placeholder="Search providers by name, specialty, department, phone, or NPI..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                    aria-label="Search providers"
                  />
                </div>

                {/* Filters */}
                <div className={styles.filtersWrapper}>
                  <div className={styles.filterButtons}>
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
                          filter.key === 'critical' && !activeFilters.includes(filter.key) && 
                          "border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
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
            <div className={styles.tableSection}>
              <div className={styles.contentWrapper}>
                <div className={styles.tableWrapper}>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead style={{ width: '250px' }}>Provider</TableHead>
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
                          <TableCell colSpan={7} style={{ height: '6rem', textAlign: 'center' }}>
                            <div style={{ color: 'var(--ifm-color-secondary-dark)' }}>
                              <p style={{ fontSize: '1.125rem', fontWeight: 500, marginBottom: '0.25rem' }}>
                                No providers found
                              </p>
                              <p style={{ fontSize: '0.875rem' }}>
                                Try adjusting your search criteria
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredProviders.map((provider) => (
                          <TableRow key={provider.id}>
                            <TableCell style={{ fontWeight: 500 }}>
                              <div>
                                <div style={{ fontWeight: 600 }}>{provider.name}</div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--ifm-color-secondary-dark)' }}>
                                  {provider.credentials} • NPI: {provider.npi}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{provider.specialty}</TableCell>
                            <TableCell style={{ textTransform: 'capitalize' }}>{provider.department}</TableCell>
                            <TableCell>
                              <div style={{ fontSize: '0.875rem' }}>
                                <div style={{ fontWeight: 500 }}>{provider.phone}</div>
                                <div style={{ color: 'var(--ifm-color-secondary-dark)' }}>{provider.email}</div>
                                {provider.epic_chat.length > 0 && (
                                  <div style={{ fontSize: '0.75rem', color: 'var(--ifm-color-secondary-dark)' }}>
                                    Epic: {provider.epic_chat.join(', ')}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell style={{ fontSize: '0.875rem' }}>{provider.location}</TableCell>
                            <TableCell>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                                {provider.tags.slice(0, 3).map((tag, idx) => (
                                  <Badge key={idx} variant="secondary" style={{ fontSize: '0.75rem' }}>
                                    {tag}
                                  </Badge>
                                ))}
                                {provider.tags.length > 3 && (
                                  <Badge variant="secondary" style={{ fontSize: '0.75rem' }}>
                                    +{provider.tags.length - 3}
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                {getStatusBadge(provider.status)}
                                {provider.priority_notes.length > 0 && (
                                  <div style={{ fontSize: '0.75rem', color: 'var(--ifm-color-secondary-dark)' }}>
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
                <div className={styles.footerSection}>
                  <div>
                    Showing {filteredProviders.length} of {providers.length} providers
                  </div>
                  <div className={styles.legendWrapper}>
                    <span>Status:</span>
                    <Badge variant="destructive" style={{ fontSize: '0.75rem' }}>Critical</Badge>
                    <Badge variant="warning" style={{ fontSize: '0.75rem' }}>Warning</Badge>
                    <Badge variant="success" style={{ fontSize: '0.75rem' }}>Active</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AppErrorBoundary>
      </Layout>
    </PageErrorBoundary>
  );
}