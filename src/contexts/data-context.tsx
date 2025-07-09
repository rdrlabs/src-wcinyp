'use client';

import React, { createContext, useContext, useState, useCallback, useRef, ReactNode } from 'react';
import type { Provider, Contact, Document, FormTemplate } from '@/types';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface DataContextValue {
  // Providers
  providers: Provider[];
  providersLoading: boolean;
  providersError: Error | null;
  refreshProviders: () => Promise<void>;
  updateProvider: (id: number, updates: Partial<Provider>) => void;
  
  // Contacts
  contacts: Contact[];
  contactsLoading: boolean;
  contactsError: Error | null;
  refreshContacts: () => Promise<void>;
  updateContact: (id: number, updates: Partial<Contact>) => void;
  
  // Documents
  documents: Document[];
  documentsLoading: boolean;
  documentsError: Error | null;
  refreshDocuments: () => Promise<void>;
  
  // Form Templates
  formTemplates: FormTemplate[];
  formTemplatesLoading: boolean;
  formTemplatesError: Error | null;
  refreshFormTemplates: () => Promise<void>;
  
  // Cache management
  clearCache: () => void;
  getCacheStats: () => { size: number; entries: number };
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

export function DataProvider({ children }: { children: ReactNode }) {
  // Cache storage
  const cache = useRef<Map<string, CacheEntry<unknown>>>(new Map());
  
  // Providers state
  const [providers, setProviders] = useState<Provider[]>([]);
  const [providersLoading, setProvidersLoading] = useState(false);
  const [providersError, setProvidersError] = useState<Error | null>(null);
  
  // Contacts state
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [contactsError, setContactsError] = useState<Error | null>(null);
  
  // Documents state
  const [documents, setDocuments] = useState<Document[]>([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [documentsError, setDocumentsError] = useState<Error | null>(null);
  
  // Form Templates state
  const [formTemplates, setFormTemplates] = useState<FormTemplate[]>([]);
  const [formTemplatesLoading, setFormTemplatesLoading] = useState(false);
  const [formTemplatesError, setFormTemplatesError] = useState<Error | null>(null);
  
  // Cache helpers
  const getCached = useCallback(<T,>(key: string): T | null => {
    const entry = cache.current.get(key);
    if (!entry) return null;
    
    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      cache.current.delete(key);
      return null;
    }
    
    return entry.data as T;
  }, []);
  
  const setCached = useCallback(<T,>(key: string, data: T, ttl: number = DEFAULT_TTL) => {
    cache.current.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }, []);
  
  // Data fetching functions
  const fetchProviders = useCallback(async () => {
    const cacheKey = 'providers';
    const cached = getCached<Provider[]>(cacheKey);
    
    if (cached) {
      setProviders(cached);
      return;
    }
    
    setProvidersLoading(true);
    setProvidersError(null);
    
    try {
      // Import the JSON data (in production, this would be an API call)
      const providersModule = await import('@/data/providers.json');
      const data = providersModule.default.providers as Provider[];
      setProviders(data);
      setCached(cacheKey, data);
    } catch (error) {
      setProvidersError(error as Error);
    } finally {
      setProvidersLoading(false);
    }
  }, [getCached, setCached]);
  
  const fetchContacts = useCallback(async () => {
    const cacheKey = 'contacts';
    const cached = getCached<Contact[]>(cacheKey);
    
    if (cached) {
      setContacts(cached);
      return;
    }
    
    setContactsLoading(true);
    setContactsError(null);
    
    try {
      const contactsModule = await import('@/data/contacts.json');
      const data = contactsModule.default.contacts as Contact[];
      setContacts(data);
      setCached(cacheKey, data);
    } catch (error) {
      setContactsError(error as Error);
    } finally {
      setContactsLoading(false);
    }
  }, [getCached, setCached]);
  
  const fetchDocuments = useCallback(async () => {
    const cacheKey = 'documents';
    const cached = getCached<Document[]>(cacheKey);
    
    if (cached) {
      setDocuments(cached);
      return;
    }
    
    setDocumentsLoading(true);
    setDocumentsError(null);
    
    try {
      const documentsModule = await import('@/data/documents.json');
      const categories = documentsModule.default.categories;
      const allDocs: Document[] = [];
      
      Object.entries(categories).forEach(([category, docs]) => {
        (docs as Document[]).forEach(doc => {
          allDocs.push({ ...doc, category });
        });
      });
      
      setDocuments(allDocs);
      setCached(cacheKey, allDocs);
    } catch (error) {
      setDocumentsError(error as Error);
    } finally {
      setDocumentsLoading(false);
    }
  }, [getCached, setCached]);
  
  const fetchFormTemplates = useCallback(async () => {
    const cacheKey = 'formTemplates';
    const cached = getCached<FormTemplate[]>(cacheKey);
    
    if (cached) {
      setFormTemplates(cached);
      return;
    }
    
    setFormTemplatesLoading(true);
    setFormTemplatesError(null);
    
    try {
      // In production, this would be an API call
      const templates: FormTemplate[] = []; // Would load from API
      setFormTemplates(templates);
      setCached(cacheKey, templates);
    } catch (error) {
      setFormTemplatesError(error as Error);
    } finally {
      setFormTemplatesLoading(false);
    }
  }, [getCached, setCached]);
  
  // Refresh functions (force refetch)
  const refreshProviders = useCallback(async () => {
    cache.current.delete('providers');
    await fetchProviders();
  }, [fetchProviders]);
  
  const refreshContacts = useCallback(async () => {
    cache.current.delete('contacts');
    await fetchContacts();
  }, [fetchContacts]);
  
  const refreshDocuments = useCallback(async () => {
    cache.current.delete('documents');
    await fetchDocuments();
  }, [fetchDocuments]);
  
  const refreshFormTemplates = useCallback(async () => {
    cache.current.delete('formTemplates');
    await fetchFormTemplates();
  }, [fetchFormTemplates]);
  
  // Optimistic updates
  const updateProvider = useCallback((id: number, updates: Partial<Provider>) => {
    setProviders(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, ...updates } : p);
      setCached('providers', updated);
      return updated;
    });
  }, [setCached]);
  
  const updateContact = useCallback((id: number, updates: Partial<Contact>) => {
    setContacts(prev => {
      const updated = prev.map(c => c.id === id ? { ...c, ...updates } : c);
      setCached('contacts', updated);
      return updated;
    });
  }, [setCached]);
  
  // Cache management
  const clearCache = useCallback(() => {
    cache.current.clear();
  }, []);
  
  const getCacheStats = useCallback(() => {
    let size = 0;
    cache.current.forEach(entry => {
      size += JSON.stringify(entry.data).length;
    });
    
    return {
      size,
      entries: cache.current.size,
    };
  }, []);
  
  // Initial data fetch
  React.useEffect(() => {
    fetchProviders();
    fetchContacts();
    fetchDocuments();
    fetchFormTemplates();
  }, [fetchProviders, fetchContacts, fetchDocuments, fetchFormTemplates]);
  
  const value: DataContextValue = {
    providers,
    providersLoading,
    providersError,
    refreshProviders,
    updateProvider,
    
    contacts,
    contactsLoading,
    contactsError,
    refreshContacts,
    updateContact,
    
    documents,
    documentsLoading,
    documentsError,
    refreshDocuments,
    
    formTemplates,
    formTemplatesLoading,
    formTemplatesError,
    refreshFormTemplates,
    
    clearCache,
    getCacheStats,
  };
  
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useDataContext() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useDataContext must be used within DataProvider');
  }
  return context;
}

// Convenience hooks for specific data types
export function useProviders() {
  const { providers, providersLoading, providersError, refreshProviders, updateProvider } = useDataContext();
  return { providers, loading: providersLoading, error: providersError, refresh: refreshProviders, update: updateProvider };
}

export function useContacts() {
  const { contacts, contactsLoading, contactsError, refreshContacts, updateContact } = useDataContext();
  return { contacts, loading: contactsLoading, error: contactsError, refresh: refreshContacts, update: updateContact };
}

export function useDocuments() {
  const { documents, documentsLoading, documentsError, refreshDocuments } = useDataContext();
  return { documents, loading: documentsLoading, error: documentsError, refresh: refreshDocuments };
}

export function useFormTemplates() {
  const { formTemplates, formTemplatesLoading, formTemplatesError, refreshFormTemplates } = useDataContext();
  return { formTemplates, loading: formTemplatesLoading, error: formTemplatesError, refresh: refreshFormTemplates };
}