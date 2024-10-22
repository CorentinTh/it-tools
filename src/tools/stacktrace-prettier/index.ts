import { Stack } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Stacktrace prettier',
  path: '/stacktrace-prettier',
  description: 'Highlight .Net and JS stacktraces',
  keywords: ['stacktrace', 'prettier', 'highlighter'],
  component: () => import('./stacktrace-prettier.vue'),
  icon: Stack,
  createdAt: new Date('2024-08-15'),
});
