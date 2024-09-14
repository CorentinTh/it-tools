import { FileText } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Unicode Search',
  path: '/unicode-search',
  description: 'Search in Unicode Characters',
  keywords: ['unicode', 'search'],
  component: () => import('./unicode-search.vue'),
  icon: FileText,
  createdAt: new Date('2024-08-15'),
});
