'use client'

import { notFound } from 'next/navigation'
import { DocsPage, DocsBody, DocsTitle, DocsDescription } from 'fumadocs-ui/page'
import { getPage, getPages } from '@/app/source'

interface PageProps {
  params: {
    slug?: string[]
  }
}

export default function Page({ params }: PageProps) {
  const slug = params.slug ?? []
  const page = getPage(slug)

  if (!page) {
    notFound()
  }

  const MDX = page.data.body

  return (
    <DocsPage 
      toc={page.data.toc}
      breadcrumb={{
        enabled: true,
      }}
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      {page.data.description && (
        <DocsDescription>{page.data.description}</DocsDescription>
      )}
      <DocsBody>
        <div className="prose prose-gray dark:prose-invert max-w-none">
          {typeof MDX === 'function' ? <MDX /> : null}
        </div>
      </DocsBody>
    </DocsPage>
  )
}