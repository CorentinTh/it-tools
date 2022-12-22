import { Key } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'JWT parser',
  path: '/jwt-parser',
  description: 'Parse a JWT (JSON Web Token) to display its content.',
  keywords: ['jwt', 'parser'],
  component: () => import('./jwt-parser.vue'),
  icon: Key,
});
