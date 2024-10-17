import { ClearFormatting } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Json stringify',
  path: '/json-stringify',
  description: '',
  keywords: ['json', 'stringify'],
  component: () => import('./json-stringify.vue'),
  icon: ClearFormatting,
  createdAt: new Date('2024-10-17'),
});
