'use client';

import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { ReactNode } from 'react';
import { RootProvider } from 'fumadocs-ui/provider';
import { Book } from 'lucide-react';
import Link from 'next/link';
import { pageTree } from './mock-source';
import './fumadocs.css';

export default function KnowledgeLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <RootProvider
      search={{
        enabled: true,
        options: {
          type: 'static',
        },
      }}
      theme={{
        defaultTheme: 'system',
        enabled: true,
      }}
    >
      <DocsLayout
        tree={pageTree}
        nav={{
          title: 'Knowledge Base',
          transparentMode: 'top',
        }}
        sidebar={{
          enabled: true,
          collapsible: true,
          defaultOpenLevel: 1,
          footer: (
            <div className="border-t pt-4 mt-4">
              <Link 
                href="/wiki" 
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Book className="h-4 w-4" />
                <span>Wiki</span>
              </Link>
            </div>
          ),
        }}
      >
        {children}
      </DocsLayout>
    </RootProvider>
  );
}