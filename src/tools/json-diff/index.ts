import { ArrowsShuffle } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'JSON diff',
  path: '/json-diff',
  description: 'Compares two given JSONs and build a visual comparison of them',
  keywords: ['json', 'diff', 'visual'],
  component: () => import('./json-diff.vue'),
  icon: ArrowsShuffle,
  createdAt: new Date('2023-04-12'),
});
