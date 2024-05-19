import { BrandPhp } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'PHP-Array to JSON',
  path: '/php-array-to-json',
  description: 'Convert PHP Array to JSON',
  keywords: ['php', 'array', 'json'],
  component: () => import('./php-array-to-json.vue'),
  icon: BrandPhp,
  createdAt: new Date('2024-05-11'),
});
