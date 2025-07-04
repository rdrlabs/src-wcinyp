import { docs, meta } from '../../.source';
import { loader } from 'fumadocs-core/source';
import { createMDXSource } from 'fumadocs-mdx';

export const source = loader({
  baseUrl: '/knowledge',
  source: createMDXSource(docs, meta),
});