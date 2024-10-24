import { Braces } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Json string converter',
  path: '/json-string-converter',
  description: '',
  keywords: ['json', 'string', 'converter'],
  component: () => import('./json-string-converter.vue'),
  icon: Braces,
  createdAt: new Date('2024-10-17'),
});
