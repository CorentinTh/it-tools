import { Markdown } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Mermaid exporter',
  path: '/mermaid-exporter',
  description: 'Convert Markdown (Mermaid) to image and allow to export to PNG, JPG & SVG',
  keywords: ['mermaid', 'exporter', 'markdown', 'MD'],
  component: () => import('./mermaid-exporter.vue'),
  icon: Markdown,
  createdAt: new Date('2025-04-11'),
});
