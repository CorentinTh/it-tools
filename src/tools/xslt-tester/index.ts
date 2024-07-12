import { HandMove } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'XSLT tester',
  path: '/xslt-tester',
  description: 'Allows to test XML transformation using XSLT Stylesheets',
  keywords: ['xslt', 'xml', 'tester'],
  component: () => import('./xslt-tester.vue'),
  icon: HandMove,
  createdAt: new Date('2024-05-11'),
});
