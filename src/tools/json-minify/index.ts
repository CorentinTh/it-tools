import { Braces } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'JSON minify',
  path: '/json-minify',
  description: 'Minify and compress your JSON by removing unnecessary white spaces.',
  keywords: ['json', 'minify', 'format'],
  component: () => import('./json-minify.vue'),
  icon: Braces,
});
