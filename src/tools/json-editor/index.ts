import { Braces } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'JSON Editor',
  path: '/json-editor',
  description: 'Edit JSON content',
  keywords: ['json', 'editor'],
  component: () => import('./json-editor.vue'),
  icon: Braces,
  createdAt: new Date('2024-05-11'),
});
