import { FileText } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Common Regex Cheatsheet',
  path: '/common-regex-memo',
  description: 'Cheatsheet for common regex patterns',
  keywords: ['common', 'regex', 'memo', 'cheatsheet'],
  component: () => import('./common-regex-memo.vue'),
  icon: FileText,
  createdAt: new Date('2024-05-11'),
});
