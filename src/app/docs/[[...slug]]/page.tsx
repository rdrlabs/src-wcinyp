import { DocsPage, DocsBody, DocsDescription, DocsTitle } from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';
import { source } from '@/lib/source';

export default async function Page(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  // @ts-ignore - MDX component type issue: fumadocs library types are not fully compatible with Next.js types
  const MDX = page.data.default || page.data.body;

  return (
    // @ts-ignore - Type issues with fumadocs: DocsPage component expects different prop types than provided
    <DocsPage toc={page.data.toc}>
      {/* @ts-ignore - DocsTitle component type mismatch with children prop */}
      <DocsTitle>{page.data.title}</DocsTitle>
      {/* @ts-ignore - DocsDescription component type mismatch with children prop */}
      <DocsDescription>{page.data.description}</DocsDescription>
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

  return {
    // @ts-ignore - page.data types are not fully typed in fumadocs
    title: page.data.title,
    // @ts-ignore - page.data types are not fully typed in fumadocs
    description: page.data.description,
  };
}