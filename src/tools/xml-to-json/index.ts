import { IconBraces } from '@tabler/icons-vue';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'XML to JSON',
  path: '/xml-to-json',
  description: 'Convert XML to JSON',
  keywords: ['xml', 'json'],
  component: () => import('./xml-to-json.vue'),
  icon: IconBraces,
  createdAt: new Date('2024-08-09'),
});
