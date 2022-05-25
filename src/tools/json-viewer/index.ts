import { Braces } from '@vicons/tabler';
import type { ITool } from '../tool';

export const tool: ITool = {
  name: 'JSON viewer',
  path: '/json-viewer',
  description: 'Prettify JSON string to a human friendly readable format.',
  keywords: ['json', 'viewer', 'prettify', 'format'],
  component: () => import('./json-viewer.vue'),
  icon: Braces,
};
