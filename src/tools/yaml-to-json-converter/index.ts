import { AlignJustified } from '@vicons/tabler';
import { translate } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: translate('tools.yaml-to-json-converter.title'),
  path: '/yaml-to-json-converter',
  description: translate('tools.yaml-to-json-converter.description'),
  keywords: ['yaml', 'to', 'json'],
  component: () => import('./yaml-to-json.vue'),
  icon: AlignJustified,
  createdAt: new Date('2023-04-10'),
});
