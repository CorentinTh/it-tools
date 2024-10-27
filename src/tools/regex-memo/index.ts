import { IconBrandJavascript } from '@tabler/icons-vue';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Regex cheatsheet',
  path: '/regex-memo',
  description: 'Javascript Regex/Regular Expression cheatsheet',
  keywords: ['regex', 'regular', 'expression', 'javascript', 'memo', 'cheatsheet'],
  component: () => import('./regex-memo.vue'),
  icon: IconBrandJavascript,
  createdAt: new Date('2024-09-20'),
});
