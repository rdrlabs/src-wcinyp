'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { useTheme } from 'next-themes';

export type ColorTheme = 'blue' | 'red' | 'orange' | 'green' | 'yellow' | 'default';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface AppContextValue {
  // Theme management
  colorTheme: ColorTheme;
  setColorTheme: (theme: ColorTheme) => void;
  theme: string;
  setTheme: (theme: string) => void;
  systemTheme: string | undefined;
  
  // Global loading states
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  loadingMessage?: string;
  setLoadingMessage: (message?: string) => void;
  
  // Global error state
  error: Error | null;
  setError: (error: Error | null) => void;
  clearError: () => void;
  
  // Notifications
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  
  // User preferences
  preferences: Record<string, unknown>;
  setPreference: (key: string, value: unknown) => void;
  
  // Mounted state
  mounted: boolean;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

const COLOR_THEME_KEY = 'color-theme';
const PREFERENCES_KEY = 'app-preferences';
const DEFAULT_COLOR_THEME: ColorTheme = 'default';

export function AppProvider({ children }: { children: ReactNode }) {
  const nextThemes = useTheme();
  
  // Color theme state
  const [colorTheme, setColorThemeState] = useState<ColorTheme>(DEFAULT_COLOR_THEME);
  
  // Global loading state
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string>();
  
  // Global error state
  const [error, setError] = useState<Error | null>(null);
  
  // Notifications
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // User preferences
  const [preferences, setPreferences] = useState<Record<string, unknown>>({});
  
  // Mounted state
  const [mounted, setMounted] = useState(false);
  
  // Initialize color theme from localStorage
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem(COLOR_THEME_KEY) as ColorTheme;
      
      // Remove any existing theme classes first
      if (document.body) {
        const existingThemeClasses = Array.from(document.body.classList).filter(
          cls => cls.startsWith('theme-')
        );
        existingThemeClasses.forEach(cls => document.body.classList.remove(cls));
        
        // Apply the correct theme
        if (savedTheme && ['blue', 'red', 'orange', 'green', 'yellow', 'default'].includes(savedTheme)) {
          setColorThemeState(savedTheme);
          document.body.classList.add(`theme-${savedTheme}`);
        } else {
          setColorThemeState(DEFAULT_COLOR_THEME);
          document.body.classList.add(`theme-${DEFAULT_COLOR_THEME}`);
        }
      }
    } catch (error) {
      // If localStorage is not available, use default theme
      setColorThemeState(DEFAULT_COLOR_THEME);
      if (document.body) {
        document.body.classList.add(`theme-${DEFAULT_COLOR_THEME}`);
      }
    }
    setMounted(true);
  }, []);
  
  // Initialize preferences from localStorage
  useEffect(() => {
    try {
      const savedPrefs = localStorage.getItem(PREFERENCES_KEY);
      if (savedPrefs) {
        setPreferences(JSON.parse(savedPrefs));
      }
    } catch (error) {
      console.error('Failed to load preferences:', error);
    }
  }, []);
  
  // Color theme management
  const setColorTheme = useCallback((theme: ColorTheme) => {
    const oldTheme = colorTheme;
    setColorThemeState(theme);
    
    try {
      localStorage.setItem(COLOR_THEME_KEY, theme);
    } catch (error) {
      console.warn('Failed to save theme preference:', error);
    }
    
    // Update document classes
    if (document.body) {
      document.body.classList.remove(`theme-${oldTheme}`);
      document.body.classList.add(`theme-${theme}`);
    }
  }, [colorTheme]);
  
  // Error management
  const clearError = useCallback(() => {
    setError(null);
  }, []);
  
  // Notification management
  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = Date.now().toString();
    const newNotification = { ...notification, id };
    
    setNotifications(prev => [...prev, newNotification]);
    
    // Auto-remove after duration
    if (notification.duration !== 0) {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, notification.duration || 5000);
    }
  }, []);
  
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);
  
  // Preference management
  const setPreference = useCallback((key: string, value: unknown) => {
    setPreferences(prev => {
      const updated = { ...prev, [key]: value };
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);
  
  const value: AppContextValue = {
    // Theme
    colorTheme,
    setColorTheme,
    theme: nextThemes.theme || 'system',
    setTheme: nextThemes.setTheme,
    systemTheme: nextThemes.systemTheme,
    
    // Loading
    isLoading,
    setIsLoading,
    loadingMessage,
    setLoadingMessage,
    
    // Error
    error,
    setError,
    clearError,
    
    // Notifications
    notifications,
    addNotification,
    removeNotification,
    
    // Preferences
    preferences,
    setPreference,
    
    // Mounted
    mounted,
  };
  
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}

// Convenience hooks for specific parts of the context
export function useAppTheme() {
  const { colorTheme, setColorTheme, theme, setTheme, systemTheme, mounted } = useAppContext();
  return { colorTheme, setColorTheme, theme, setTheme, systemTheme, mounted };
}

export function useAppLoading() {
  const { isLoading, setIsLoading, loadingMessage, setLoadingMessage } = useAppContext();
  return { isLoading, setIsLoading, loadingMessage, setLoadingMessage };
}

export function useAppError() {
  const { error, setError, clearError } = useAppContext();
  return { error, setError, clearError };
}

export function useNotifications() {
  const { notifications, addNotification, removeNotification } = useAppContext();
  return { notifications, addNotification, removeNotification };
}

export function usePreferences() {
  const { preferences, setPreference } = useAppContext();
  return { preferences, setPreference };
}