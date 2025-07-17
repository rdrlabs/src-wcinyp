import { getPages, getPage } from '@/app/source';

export function debugPages() {
  const pages = getPages();
  console.log('Available pages:', pages.map(p => ({
    slug: p.slugs,
    url: p.url,
    title: p.data.title
  })));
  
  const indexPage = getPage(['index']);
  console.log('Index page:', indexPage);
  
  return { pages, indexPage };
}