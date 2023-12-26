import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

import BracketIcon from '~icons/mdi/code-brackets';

export const tool = defineTool({
  name: translate('tools.toml-to-json.title'),
  path: '/toml-to-json',
  description: translate('tools.toml-to-json.description'),
  keywords: ['toml', 'json', 'convert', 'online', 'transform', 'parser'],
  component: () => import('./toml-to-json.vue'),
  icon: BracketIcon,
  createdAt: new Date('2023-06-23'),
});
