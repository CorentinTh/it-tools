import { BrandPhp } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Json to PHP-Array',
  path: '/json-to-php-array',
  description: 'Convert JSON to PHP Array',
  keywords: ['json', 'php', 'array'],
  component: () => import('./json-to-php-array.vue'),
  icon: BrandPhp,
  createdAt: new Date('2024-05-11'),
});
