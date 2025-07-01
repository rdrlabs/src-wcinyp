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

  const providers: Provider[] = providersData.providers;

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
      case 'critical': return '#dc3545';
      case 'warning': return '#ffc107';
      case 'ok': return '#28a745';
      default: return '#6c757d';
    }
  };

  const criticalCount = providers.filter(p => p.status === 'critical').length;

  return (
    <Layout
      title="Provider Database"
      description="Comprehensive provider directory with search and filtering"
    >
      <div style={{ 
        backgroundColor: '#f5f7fa',
        minHeight: '100vh'
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ 
            fontSize: '2rem',
            color: '#1a73e8',
            marginBottom: '1rem',
            margin: 0
          }}>
            🏥 WCINYP Provider Database
          </h1>
          
          {/* Search */}
          <div style={{ 
            position: 'relative',
            marginBottom: '1.5rem'
          }}>
            <span style={{
              position: 'absolute',
              left: '15px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#666',
              fontSize: '1.2rem'
            }}>
              🔍
            </span>
            <input
              type="text"
              placeholder="Search by name, specialty, notes, NPI, or any keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 20px 12px 45px',
                fontSize: '1rem',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                transition: 'all 0.3s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#1a73e8';
                e.target.style.boxShadow = '0 0 0 3px rgba(26, 115, 232, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e0e0e0';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Quick Filters */}
          <div style={{
            display: 'flex',
            gap: '10px',
            flexWrap: 'wrap',
            marginBottom: '1rem'
          }}>
            {[
              { key: 'neurology', label: 'Neurology' },
              { key: 'cardiology', label: 'Cardiology' },
              { key: 'oncology', label: 'Oncology' },
              { key: 'critical', label: '🛑 Has Critical Notes', critical: true },
              { key: 'pths-only', label: 'PTHS Only' },
              { key: '3t-required', label: '3T MRI Required' },
              { key: 'no-direct-contact', label: 'No Direct Contact' }
            ].map(filter => (
              <button
                key={filter.key}
                onClick={() => toggleFilter(filter.key)}
                style={{
                  padding: '8px 16px',
                  background: activeFilters.includes(filter.key) ? '#1a73e8' : 'white',
                  color: activeFilters.includes(filter.key) ? 'white' : (filter.critical ? '#dc3545' : '#333'),
                  border: `1px solid ${filter.critical ? '#dc3545' : '#e0e0e0'}`,
                  borderRadius: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontSize: '0.9rem',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => {
                  if (!activeFilters.includes(filter.key)) {
                    e.currentTarget.style.backgroundColor = filter.critical ? '#fff5f5' : '#f0f7ff';
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

        {/* Stats and Controls */}
        <div style={{
          backgroundColor: 'white',
          padding: '1rem 2rem',
          margin: '1rem 2rem',
          borderRadius: '8px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ fontSize: '0.95rem' }}>
            Showing <strong>{filteredProviders.length} providers</strong> 
            ({criticalCount} with critical notes)
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button
              onClick={downloadJSON}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}
            >
              📥 Download JSON
            </button>
            
            <div style={{ display: 'flex', gap: '0' }}>
              <button
                onClick={() => setViewMode('grid')}
                style={{
                  padding: '6px 12px',
                  border: '1px solid #e0e0e0',
                  background: viewMode === 'grid' ? '#1a73e8' : 'white',
                  color: viewMode === 'grid' ? 'white' : '#333',
                  borderRadius: '4px 0 0 4px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                style={{
                  padding: '6px 12px',
                  border: '1px solid #e0e0e0',
                  background: viewMode === 'list' ? '#1a73e8' : 'white',
                  color: viewMode === 'list' ? 'white' : '#333',
                  borderRadius: '0 4px 4px 0',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                List
              </button>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div style={{
          backgroundColor: 'white',
          padding: '1rem 2rem',
          margin: '0 2rem 1rem',
          borderRadius: '8px',
          display: 'flex',
          gap: '30px',
          fontSize: '0.9rem',
          flexWrap: 'wrap'
        }}>
          {[
            { color: '#dc3545', label: 'Critical Instructions' },
            { color: '#ffc107', label: 'Important Notes' },
            { color: '#28a745', label: 'Standard Provider' }
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '20px',
                height: '4px',
                backgroundColor: item.color,
                borderRadius: '2px'
              }} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        {/* Providers Grid/List */}
        <div style={{
          padding: '0 2rem 2rem',
          display: viewMode === 'grid' ? 'grid' : 'flex',
          gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(350px, 1fr))' : 'none',
          flexDirection: viewMode === 'list' ? 'column' : 'row',
          gap: '1.5rem'
        }}>
          {filteredProviders.map(provider => (
            <div
              key={provider.id}
              style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '1.5rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                transition: 'all 0.3s',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                borderLeft: `4px solid ${getStatusColor(provider.status)}`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
              }}
            >
              {/* Provider Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '1rem'
              }}>
                <div>
                  <div style={{
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: '#2c3e50',
                    marginBottom: '0.25rem'
                  }}>
                    {provider.name}
                  </div>
                  <div style={{
                    color: '#666',
                    fontSize: '0.9rem'
                  }}>
                    {provider.specialty}
                  </div>
                </div>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: getStatusColor(provider.status)
                }} />
              </div>

              {/* Provider Info */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                  <span style={{ color: '#666', marginRight: '8px', minWidth: '80px' }}>Phone:</span>
                  <span style={{ color: '#2c3e50', fontWeight: '500' }}>{provider.phone}</span>
                </div>
                <div style={{ display: 'flex', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                  <span style={{ color: '#666', marginRight: '8px', minWidth: '80px' }}>Location:</span>
                  <span style={{ color: '#2c3e50', fontWeight: '500' }}>{provider.location}</span>
                </div>
                {provider.epic_chat.length > 0 && (
                  <div style={{ display: 'flex', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                    <span style={{ color: '#666', marginRight: '8px', minWidth: '80px' }}>Epic Chat:</span>
                    <span style={{ color: '#2c3e50', fontWeight: '500' }}>{provider.epic_chat.join(', ')}</span>
                  </div>
                )}
              </div>

              {/* Priority Notes */}
              {provider.priority_notes.length > 0 && (
                <div style={{
                  backgroundColor: '#f8f9fa',
                  padding: '0.75rem',
                  borderRadius: '4px',
                  marginBottom: '1rem'
                }}>
                  {provider.priority_notes.map((note, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.9rem',
                      marginBottom: index < provider.priority_notes.length - 1 ? '0.5rem' : '0'
                    }}>
                      <span style={{ fontSize: '1rem' }}>{note.icon}</span>
                      <span style={{
                        color: note.type === 'critical' ? '#dc3545' : '#495057',
                        fontWeight: note.type === 'critical' ? '600' : '400'
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
                      padding: '4px 10px',
                      backgroundColor: '#e3f2fd',
                      color: '#1976d2',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: '500'
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
            textAlign: 'center',
            padding: '3rem',
            color: '#666'
          }}>
            <h3>No providers found</h3>
            <p>Try adjusting your search terms or filters.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}