import { Brackets } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'XPath Tester',
  path: '/xpath-tester',
  description: 'Test XPath expression against XML content',
  keywords: ['xpath', 'xml', 'tester'],
  component: () => import('./xpath-tester.vue'),
  icon: Brackets,
  createdAt: new Date('2024-08-15'),
});
