import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { Callout } from 'fumadocs-ui/components/callout';
import { Card, Cards } from 'fumadocs-ui/components/card';
import { Steps, Step } from 'fumadocs-ui/components/steps';
import { Tabs, Tab } from 'fumadocs-ui/components/tabs';
import { Accordion, Accordions } from 'fumadocs-ui/components/accordion';
import { File, Folder, Files } from 'fumadocs-ui/components/files';
import { TypeTable } from 'fumadocs-ui/components/type-table';
import { Banner } from 'fumadocs-ui/components/banner';
import { InlineTOC } from 'fumadocs-ui/components/inline-toc';
import { ImageZoom } from 'fumadocs-ui/components/image-zoom';

// This file ensures MDX components are available globally for all MDX files
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    ...components,
    // All Fumadocs UI components
    Callout,
    Cards,
    Card,
    Steps,
    Step,
    Tabs,
    Tab,
    Accordion,
    Accordions,
    File,
    Folder,
    Files,
    TypeTable,
    InlineTOC,
    Banner,
    ImageZoom,
  };
}