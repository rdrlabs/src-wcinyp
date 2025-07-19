'use client';

import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { RootProvider } from 'fumadocs-ui/provider';
import { pageTree } from '@/app/source';
import type { ReactNode } from 'react';
import 'fumadocs-ui/style.css';
import 'katex/dist/katex.min.css';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <RootProvider
      search={{
        enabled: true,
        // Search is enabled by default with Orama client-side search
      }}
    >
      <DocsLayout 
        tree={pageTree}
        nav={{
          title: 'Fumadocs Demo',
        }}
        sidebar={{
          // Enable collapsible sidebar sections
          collapsible: true,
        }}
      >
        {children}
      </DocsLayout>
    </RootProvider>
  );
}