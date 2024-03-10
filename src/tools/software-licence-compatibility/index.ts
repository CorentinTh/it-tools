import { License } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Software licence compatibility',
  path: '/software-licence-compatibility',
  description: 'Software Licence compatibility checker and information',
  keywords: ['software', 'licence', 'compatibility'],
  component: () => import('./software-licence-compatibility.vue'),
  icon: License,
  createdAt: new Date('2024-03-17'),
});
