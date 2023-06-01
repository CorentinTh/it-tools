import { FileText } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Text statistics',
  path: '/text-statistics',
  description: 'Get information about a text, the amount of characters, the amount of words, it\'s size, ...',
  keywords: ['text', 'statistics', 'length', 'characters', 'count', 'size', 'bytes'],
  component: () => import('./text-statistics.vue'),
  icon: FileText,
  redirectFrom: ['/text-stats'],
});
