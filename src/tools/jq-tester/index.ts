import { Braces } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Jq/JSONPath Tester',
  path: '/jq-tester',
  description: 'Test jq/JSONPath expression against a JSON content',
  keywords: ['jq', 'json', 'tester', 'jsonpath'],
  component: () => import('./jq-tester.vue'),
  icon: Braces,
  createdAt: new Date('2024-08-15'),
});
