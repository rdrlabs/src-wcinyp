import { getPage, getPages } from '@/app/source';
import { DocsPage, DocsBody } from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { Card, Cards } from 'fumadocs-ui/components/card';
import { Callout } from 'fumadocs-ui/components/callout';
import { Steps, Step } from 'fumadocs-ui/components/steps';
import { Tabs, Tab } from 'fumadocs-ui/components/tabs';
import { Accordion, Accordions } from 'fumadocs-ui/components/accordion';
import { File, Folder, Files } from 'fumadocs-ui/components/files';
import { TypeTable } from 'fumadocs-ui/components/type-table';
import { Banner } from 'fumadocs-ui/components/banner';
import { InlineTOC } from 'fumadocs-ui/components/inline-toc';
import { ImageZoom } from 'fumadocs-ui/components/image-zoom';

interface PageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

// Define components outside the async function
const components = {
  ...defaultMdxComponents,
  Card,
  Cards,
  Callout,
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
  Banner,
  InlineTOC,
  ImageZoom,
};

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const page = getPage(resolvedParams.slug);

  if (!page) {
    notFound();
  }

  const MDX = (page.data as any).body || page.data.content;

  return (
    <DocsPage
      toc={(page.data as any).toc || []}
      full={(page.data as any).full}
    >
      <DocsBody>
        <h1>{page.data.title}</h1>
        {MDX && <MDX components={components} />}
      </DocsBody>
    </DocsPage>
  );
}

export function generateStaticParams() {
  return getPages().map((page) => ({
    slug: page.slugs,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const page = getPage(resolvedParams.slug);

  if (!page) {
    return {};
  }

  return {
    title: page.data.title,
    description: page.data.description,
  };
}