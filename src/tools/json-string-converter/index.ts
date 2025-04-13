import { IconBraces } from '@tabler/icons-vue';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Json string converter',
  path: '/json-string-converter',
  description: '',
  keywords: ['json', 'string', 'converter'],
  component: () => import('./json-string-converter.vue'),
  icon: IconBraces,
  createdAt: new Date('2024-10-17'),
});
