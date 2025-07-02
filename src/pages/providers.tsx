import React, { useState, useMemo } from 'react';
import Layout from '@theme/Layout';
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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const providers: Provider[] = providersData.providers as Provider[];

  // Filter and search logic
  const filteredProviders = useMemo(() => {
    let filtered = providers;

    // Apply search filter
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

    // Apply active filters
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return '#dc2626';
      case 'warning': return '#f59e0b';
      case 'ok': return '#10b981';
      default: return '#64748b';
    }
  };

  const criticalCount = providers.filter(p => p.status === 'critical').length;

  return (
    <Layout
      title="Provider Database"
      description="Comprehensive provider directory with search and filtering"
    >
      <div style={{ 
        backgroundColor: '#f8fafc',
        minHeight: '100vh'
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: 'white',
          padding: '24px 32px',
          borderBottom: '1px solid #e2e8f0'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ 
              fontSize: '24px',
              fontWeight: '600',
              color: '#1e293b',
              margin: '0 0 24px 0',
              letterSpacing: '-0.025em'
            }}>
              Provider Database
            </h1>
            
            {/* Search */}
            <div style={{ 
              position: 'relative',
              marginBottom: '20px'
            }}>
              <div style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#64748b',
                fontSize: '16px',
                pointerEvents: 'none'
              }}>
                🔍
              </div>
              <input
                type="text"
                placeholder="Search providers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 40px',
                  fontSize: '14px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  backgroundColor: 'white',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Quick Filters */}
            <div style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap'
            }}>
              {[
                { key: 'neurology', label: 'Neurology' },
                { key: 'cardiology', label: 'Cardiology' },
                { key: 'oncology', label: 'Oncology' },
                { key: 'critical', label: 'Critical Notes', critical: true },
                { key: 'pths-only', label: 'PTHS Only' },
                { key: '3t-required', label: '3T Required' },
                { key: 'no-direct-contact', label: 'No Direct Contact' }
              ].map(filter => (
                <button
                  key={filter.key}
                  onClick={() => toggleFilter(filter.key)}
                  style={{
                    padding: '6px 12px',
                    background: activeFilters.includes(filter.key) ? '#3b82f6' : 'white',
                    color: activeFilters.includes(filter.key) ? 'white' : (filter.critical ? '#dc2626' : '#374151'),
                    border: `1px solid ${activeFilters.includes(filter.key) ? '#3b82f6' : (filter.critical ? '#dc2626' : '#d1d5db')}`,
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '500',
                    transition: 'all 0.2s ease',
                    outline: 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (!activeFilters.includes(filter.key)) {
                      e.currentTarget.style.backgroundColor = filter.critical ? '#fef2f2' : '#f8fafc';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!activeFilters.includes(filter.key)) {
                      e.currentTarget.style.backgroundColor = 'white';
                    }
                  }}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats and Controls */}
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '20px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ 
            fontSize: '14px',
            color: '#64748b',
            fontWeight: '500'
          }}>
            {filteredProviders.length} providers ({criticalCount} critical)
          </div>
          
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              onClick={downloadJSON}
              style={{
                padding: '8px 16px',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#059669';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#10b981';
              }}
            >
              <span>📥</span>
              Export JSON
            </button>
            
            <div style={{ display: 'flex', backgroundColor: '#f1f5f9', borderRadius: '6px', padding: '2px' }}>
              <button
                onClick={() => setViewMode('grid')}
                style={{
                  padding: '6px 12px',
                  border: 'none',
                  background: viewMode === 'grid' ? 'white' : 'transparent',
                  color: viewMode === 'grid' ? '#1e293b' : '#64748b',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                  boxShadow: viewMode === 'grid' ? '0 1px 2px rgba(0, 0, 0, 0.05)' : 'none'
                }}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                style={{
                  padding: '6px 12px',
                  border: 'none',
                  background: viewMode === 'list' ? 'white' : 'transparent',
                  color: viewMode === 'list' ? '#1e293b' : '#64748b',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '500',
                  transition: 'all 0.2s ease',
                  boxShadow: viewMode === 'list' ? '0 1px 2px rgba(0, 0, 0, 0.05)' : 'none'
                }}
              >
                List
              </button>
            </div>
          </div>
        </div>

        {/* Providers Grid/List */}
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 32px 32px',
          display: viewMode === 'grid' ? 'grid' : 'flex',
          gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(380px, 1fr))' : 'none',
          flexDirection: viewMode === 'list' ? 'column' : 'row',
          gap: '20px'
        }}>
          {filteredProviders.map(provider => (
            <div
              key={provider.id}
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid #e2e8f0',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                position: 'relative',
                borderLeft: `4px solid ${getStatusColor(provider.status)}`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.08)';
                e.currentTarget.style.borderColor = '#cbd5e1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = '#e2e8f0';
              }}
            >
              {/* Provider Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '16px'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1e293b',
                    marginBottom: '4px',
                    lineHeight: '1.4'
                  }}>
                    {provider.name}
                  </div>
                  <div style={{
                    color: '#64748b',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    {provider.specialty}
                  </div>
                </div>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: getStatusColor(provider.status),
                  marginTop: '4px',
                  flexShrink: 0
                }} />
              </div>

              {/* Provider Info */}
              <div style={{ marginBottom: '16px', fontSize: '13px' }}>
                <div style={{ display: 'flex', marginBottom: '6px' }}>
                  <span style={{ color: '#64748b', marginRight: '12px', minWidth: '60px', fontWeight: '500' }}>Phone:</span>
                  <span style={{ color: '#1e293b', fontWeight: '500' }}>{provider.phone}</span>
                </div>
                <div style={{ display: 'flex', marginBottom: '6px' }}>
                  <span style={{ color: '#64748b', marginRight: '12px', minWidth: '60px', fontWeight: '500' }}>Location:</span>
                  <span style={{ color: '#1e293b', fontWeight: '500' }}>{provider.location}</span>
                </div>
                {provider.epic_chat.length > 0 && (
                  <div style={{ display: 'flex', marginBottom: '6px' }}>
                    <span style={{ color: '#64748b', marginRight: '12px', minWidth: '60px', fontWeight: '500' }}>Epic:</span>
                    <span style={{ color: '#1e293b', fontWeight: '500' }}>{provider.epic_chat.join(', ')}</span>
                  </div>
                )}
              </div>

              {/* Priority Notes */}
              {provider.priority_notes.length > 0 && (
                <div style={{
                  backgroundColor: '#f8fafc',
                  padding: '12px',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  border: '1px solid #f1f5f9'
                }}>
                  {provider.priority_notes.map((note, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                      fontSize: '13px',
                      marginBottom: index < provider.priority_notes.length - 1 ? '8px' : '0',
                      lineHeight: '1.4'
                    }}>
                      <span style={{ fontSize: '14px', marginTop: '1px', flexShrink: 0 }}>{note.icon}</span>
                      <span style={{
                        color: note.type === 'critical' ? '#dc2626' : '#374151',
                        fontWeight: note.type === 'critical' ? '600' : '500'
                      }}>
                        {note.text}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Tags */}
              <div style={{
                display: 'flex',
                gap: '6px',
                flexWrap: 'wrap'
              }}>
                {provider.tags.map(tag => (
                  <span
                    key={tag}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: '#f0f9ff',
                      color: '#0369a1',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: '500',
                      border: '1px solid #e0f2fe'
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {filteredProviders.length === 0 && (
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '64px 32px',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '48px',
              marginBottom: '16px'
            }}>
              🔍
            </div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#1e293b',
              margin: '0 0 8px 0'
            }}>
              No providers found
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#64748b',
              margin: 0
            }}>
              Try adjusting your search terms or filters.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}