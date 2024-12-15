import { Language } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Regex Tester',
  path: '/regex-tester',
  description: 'Test your regular expressions with sample text.',
  keywords: ['regex', 'tester', 'sample', 'expression'],
  component: () => import('./regex-tester.vue'),
  icon: Language,
  createdAt: new Date('2024-09-20'),
});
