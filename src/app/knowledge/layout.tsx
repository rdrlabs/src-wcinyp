'use client';

import { ReactNode } from 'react';

export default function KnowledgeLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="container mx-auto py-8">
      {children}
    </div>
  );
}