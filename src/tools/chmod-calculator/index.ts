import { FileInvoice } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const registry = {
  category: 'Development',
  order: 20,
} as const satisfies import('../tools.types').ToolRegistryMetadata;

export const tool = defineTool({
  name: translate('tools.chmod-calculator.title'),
  path: '/chmod-calculator',
  description: translate('tools.chmod-calculator.description'),
  keywords: [
    'chmod',
    'calculator',
    'file',
    'permission',
    'files',
    'directory',
    'folder',
    'recursive',
    'generator',
    'octal',
    'symbolic',
    'setuid',
    'setgid',
    'sticky',
    'umask',
  ],
  component: () => import('./chmod-calculator.vue'),
  icon: FileInvoice,
});
