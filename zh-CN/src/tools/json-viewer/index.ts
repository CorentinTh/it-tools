import { Braces } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'JSON 格式化',
  path: '/json-prettify',
  description: '将 JSON 格式化',
  keywords: ['json', '视图', '美化', '格式化'],
  component: () => import('./json-viewer.vue'),
  icon: Braces,
  redirectFrom: ['/json-viewer'],
});
