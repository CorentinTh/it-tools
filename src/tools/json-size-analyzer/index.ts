import { FileAnalytics } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Json Size Analyzer',
  path: '/json-size-analyzer',
  description: 'Measure JSON nodes relative weights',
  keywords: ['json', 'size', 'analyzer'],
  component: () => import('./json-size-analyzer.vue'),
  icon: FileAnalytics,
  createdAt: new Date('2024-07-14'),
});
