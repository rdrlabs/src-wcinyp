'use client';

import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import type { ReactNode } from 'react';

// TODO: Fix Fumadocs UI component imports - temporarily providing stubs
const StubComponent = ({ children }: { children?: ReactNode }) => {
  return <>{children}</>;
};

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    // Temporary stub components to fix build
    Callout: StubComponent,
    Cards: StubComponent,
    Card: StubComponent,
    Steps: StubComponent,
    Step: StubComponent,
    Tabs: StubComponent,
    Tab: StubComponent,
    Accordion: StubComponent,
    Accordions: StubComponent,
    File: StubComponent,
    Folder: StubComponent,
    Files: StubComponent,
    TypeTable: StubComponent,
    InlineTOC: StubComponent,
    Banner: StubComponent,
    ImageZoom: StubComponent,
    ...components,
  };
}