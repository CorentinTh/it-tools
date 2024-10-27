import { IconBraces } from '@tabler/icons-vue';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'JSON to XML',
  path: '/json-to-xml',
  description: 'Convert JSON to XML',
  keywords: ['json', 'xml'],
  component: () => import('./json-to-xml.vue'),
  icon: IconBraces,
  createdAt: new Date('2024-08-09'),
});
