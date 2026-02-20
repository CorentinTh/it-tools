import { Leaf } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'ObjectId',
  path: '/object-id',
  description: 'MongoDB ObjectId parser and generator',
  keywords: ['mongo', 'mongodb', 'object-id', 'object', 'id'],
  component: () => import('./object-id.vue'),
  icon: Leaf,
  createdAt: new Date('2025-01-21'),
});
