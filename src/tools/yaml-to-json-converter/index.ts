import { IconAlignJustified } from '@tabler/icons-vue';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.yaml-to-json-converter.title'),
  path: '/yaml-to-json-converter',
  description: translate('tools.yaml-to-json-converter.description'),
  keywords: ['yaml', 'to', 'json'],
  component: () => import('./yaml-to-json.vue'),
  icon: IconAlignJustified,
  createdAt: new Date('2023-04-10'),
});
