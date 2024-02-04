import { Code } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'XML 格式化',
  path: '/xml-formatter',
  description: 'XML 美化和格式化',
  keywords: ['xml', '美化', '格式化'],
  component: () => import('./xml-formatter.vue'),
  icon: Code,
  createdAt: new Date('2023-06-17'),
});
