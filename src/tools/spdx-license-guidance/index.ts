import { FileText } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const registry = {
  category: 'Development',
  order: 5,
} as const satisfies import('../tools.types').ToolRegistryMetadata;

export const tool = defineTool({
  name: translate('tools.spdx-license-guidance.title'),
  path: '/spdx-license-guidance',
  description: translate('tools.spdx-license-guidance.description'),
  keywords: ['SPDX', 'license', 'compatibility', 'attribution', 'NOTICE', 'copyleft', 'GPL', 'MIT', 'Apache'],
  component: () => import('./spdx-license-guidance.vue'),
  icon: FileText,
});
