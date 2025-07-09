'use client'

import { ThemeProvider } from 'next-themes'
import * as React from 'react'
import { AppProvider } from '@/contexts/app-context'
import { FormProvider } from '@/contexts/form-context'
import { DataProvider } from '@/contexts/data-context'
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
            <FormProvider>
              {children}
              <GlobalLoading />
              <Notifications />
            </FormProvider>
          </DataProvider>
        </AppProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}