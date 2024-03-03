import { FileSearch } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Url Text Search Fragment Maker',
  path: '/url-text-fragment-maker',
  description: 'Create url that allows linking directly to a specific portion of text in a web document',
  keywords: ['url', 'text', 'fragment'],
  component: () => import('./url-text-fragment-maker.vue'),
  icon: FileSearch,
  createdAt: new Date('2024-01-17'),
});
