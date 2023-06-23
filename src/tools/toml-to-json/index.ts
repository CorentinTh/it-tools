import { defineTool } from '../tool';

import BracketIcon from '~icons/mdi/code-brackets';

export const tool = defineTool({
  name: 'TOML to JSON',
  path: '/toml-to-json',
  description: 'Parse and convert TOML to JSON.',
  keywords: ['toml', 'json', 'convert', 'online', 'transform', 'parser'],
  component: () => import('./toml-to-json.vue'),
  icon: BracketIcon,
  createdAt: new Date('2023-06-23'),
});
