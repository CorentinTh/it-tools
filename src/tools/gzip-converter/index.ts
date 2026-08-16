import { FileDigit } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const registry = {
  category: 'Converter',
  order: 5,
} as const satisfies import('../tools.types').ToolRegistryMetadata;

export const tool = defineTool({
  name: translate('tools.gzip-converter.title'),
  path: '/gzip-converter',
  description: translate('tools.gzip-converter.description'),
  keywords: ['gzip', 'compress', 'decompress', 'file', 'string', 'base64', 'compression stream'],
  component: () => import('./gzip-converter.vue'),
  icon: FileDigit,
});
