import { FileSearch } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const registry = {
  category: 'Development',
  order: 9,
} as const satisfies import('../tools.types').ToolRegistryMetadata;

export const tool = defineTool({
  name: translate('tools.local-file-inspector.title'),
  path: '/local-file-inspector',
  description: translate('tools.local-file-inspector.description'),
  keywords: ['file', 'magic bytes', 'signature', 'mime', 'hex', 'crc32', 'inspect'],
  component: () => import('./local-file-inspector.vue'),
  icon: FileSearch,
});
