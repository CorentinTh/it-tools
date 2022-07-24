import { Braces } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'JSON prettify and format',
  path: '/json-prettify',
  description: 'Prettify your JSON string to a human friendly readable format.',
  keywords: ['json', 'viewer', 'prettify', 'format'],
  component: () => import('./json-viewer.vue'),
  icon: Braces,
  redirectFrom: ['/json-viewer'],
});
