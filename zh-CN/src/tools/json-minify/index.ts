import { Braces } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'JSON 压缩',
  path: '/json-minify',
  description: '通过删除不必要的空格来缩小和压缩 JSON',
  keywords: ['json', 'minify', 'format'],
  component: () => import('./json-minify.vue'),
  icon: Braces,
});
