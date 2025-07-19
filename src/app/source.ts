import { createMDXSource } from 'fumadocs-mdx';
import { loader } from 'fumadocs-core/source';
import { docs as generatedDocs, meta as generatedMeta } from '@/../.source';

// Re-export the generated source
export const docs = generatedDocs;
export const meta = generatedMeta;

export const source = loader({
  baseUrl: '/knowledge/docs',
  source: createMDXSource(docs, meta),
});

export const { getPage, getPages, pageTree } = source;