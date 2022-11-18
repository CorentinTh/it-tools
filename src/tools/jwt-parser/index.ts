import { ArrowsShuffle } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'JWT parser',
  path: '/jwt-parser',
  description: '',
  keywords: ['jwt', 'parser'],
  component: () => import('./jwt-parser.vue'),
  icon: ArrowsShuffle,
});
