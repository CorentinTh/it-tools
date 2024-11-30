import { IconAlignJustified } from '@tabler/icons-vue';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.yaml-prettify.title'),
  path: '/yaml-prettify',
  description: translate('tools.yaml-prettify.description'),
  keywords: ['yaml', 'viewer', 'prettify', 'format'],
  component: () => import('./yaml-viewer.vue'),
  icon: IconAlignJustified,
  createdAt: new Date('2024-01-31'),
});
