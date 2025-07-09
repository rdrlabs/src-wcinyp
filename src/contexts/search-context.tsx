'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

interface SearchContextValue {
  isOpen: boolean;
  openCommandMenu: () => void;
  closeCommandMenu: () => void;
  toggleCommandMenu: () => void;
}

const SearchContext = createContext<SearchContextValue | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openCommandMenu = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeCommandMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleCommandMenu = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return (
    <SearchContext.Provider
      value={{
        isOpen,
        openCommandMenu,
        closeCommandMenu,
        toggleCommandMenu,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearchContext() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearchContext must be used within a SearchProvider');
  }
  return context;
}