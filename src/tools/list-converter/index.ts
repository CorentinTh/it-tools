import { List } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'List converter',
  path: '/list-converter',
  description:
    'This tool can process column-based data and apply various changes (transpose, add prefix and suffix, reverse list, sort list, lowercase values, truncate values) to each row.',
  keywords: ['list', 'converter', 'sort', 'reverse', 'prefix', 'suffix', 'lowercase', 'truncate'],
  component: () => import('./list-converter.vue'),
  icon: List,
  createdAt: new Date('2023-05-07'),
});
