'use client'

import { ThemeProvider } from 'next-themes'
import * as React from 'react'
import { AppProvider } from '@/contexts/app-context'
import { FormProvider } from '@/contexts/form-context'
import { DataProvider } from '@/contexts/data-context'
import { SearchProvider } from '@/contexts/search-context'
import { ErrorBoundary } from '@/components/error-boundary'
import { GlobalLoading } from '@/components/global-loading'
import { Notifications } from '@/components/notifications'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <ThemeProvider
        attribute="data-theme"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <AppProvider>
          <DataProvider>
            <SearchProvider>
              <FormProvider>
                {children}
                <GlobalLoading />
                <Notifications />
              </FormProvider>
            </SearchProvider>
          </DataProvider>
        </AppProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}