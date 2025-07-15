import { docs, meta } from '@/../.source';
import { createMDXSource } from 'fumadocs-mdx';
import { loader } from 'fumadocs-core/source';

const source = createMDXSource(docs, meta);

export const { getPage, getPages, pageTree } = loader({
  baseUrl: '/knowledge/docs',
  source,
});