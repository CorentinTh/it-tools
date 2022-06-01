import { ArrowsShuffle } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Token generator',
  path: '/token-generator',
  description:
    'Generate random string with the chars you want: uppercase or lowercase letters, numbers and/or symbols.',
  keywords: ['token', 'random', 'string', 'alphanumeric', 'symbols', 'number', 'letters', 'lowercase', 'uppercase'],
  component: () => import('./token-generator.tool.vue'),
  icon: ArrowsShuffle,
});
