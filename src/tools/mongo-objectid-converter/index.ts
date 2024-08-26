import { Database } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'MongoDB ObjectId Converter',
  path: '/mongo-objectid-converter',
  description: 'Convert between MongoDB ObjectId and internal timestamp',
  keywords: ['mongo', 'objectid', 'converter', 'timestamp'],
  component: () => import('./mongo-objectid-converter.vue'),
  icon: Database,
  createdAt: new Date('2024-08-15'),
});
