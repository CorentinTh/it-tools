import { Id } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'National ID generator',
  path: '/national-id-generator',
  description: 'Generate a valid national identification number',
  keywords: ['national', 'id', 'number', 'generator'],
  component: () => import('./national-id-generator.vue'),
  icon: Id,
  createdAt: new Date('2026-05-19'),
});
