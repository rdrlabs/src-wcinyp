import { getPages, getPage } from '@/app/source';
import { logger } from '@/lib/logger-v2';

interface TocItem {
  title: string;
  url: string;
  depth?: number;
}

interface PageData {
  title: string;
  description?: string;
  body: React.ComponentType;
  toc: Array<TocItem>;
  full?: boolean;
}

interface Page {
  slugs: string[];
  url?: string;
  data: PageData;
}

interface DebugPagesResult {
  pages: Page[];
  indexPage: Page | null;
}

export function debugPages(): DebugPagesResult {
  const pages = getPages() as Page[];
  logger.debug('Available pages', { 
    pages: pages.map(p => ({
      slug: p.slugs,
      url: p.url,
      title: p.data.title
    }))
  });
  
  const indexPage = getPage(['index']) as Page | null;
  logger.debug('Index page', { indexPage });
  
  return { pages, indexPage };
}