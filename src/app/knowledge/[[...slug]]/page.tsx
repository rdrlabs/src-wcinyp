import { DocsPage, DocsBody, DocsDescription, DocsTitle } from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';
import { source } from '@/lib/source';
import type { FC } from 'react';
import type { MDXProps } from 'mdx/types';
import type { TableOfContents } from 'fumadocs-core/server';

interface PageData {
  title: string;
  description?: string;
  default?: FC<MDXProps>;
  body?: FC<MDXProps>;
  toc?: TableOfContents;
}

export default async function Page(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const data = page.data as PageData;
  const MDX = data.default || data.body;

  if (!MDX) {
    throw new Error('MDX content not found');
  }

  return (
    <DocsPage toc={data.toc}>
      <DocsTitle>{data.title}</DocsTitle>
      {data.description && <DocsDescription>{data.description}</DocsDescription>}
      <DocsBody>
        <MDX />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const data = page.data as PageData;

  return {
    title: data.title,
    description: data.description,
  };
}