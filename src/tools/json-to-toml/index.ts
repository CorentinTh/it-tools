import { IconBraces } from '@tabler/icons-vue';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.json-to-toml.title'),
  path: '/json-to-toml',
  description: translate('tools.json-to-toml.description'),
  keywords: ['json', 'parse', 'toml', 'convert', 'transform'],
  component: () => import('./json-to-toml.vue'),
  icon: IconBraces,
  createdAt: new Date('2023-06-23'),
});
