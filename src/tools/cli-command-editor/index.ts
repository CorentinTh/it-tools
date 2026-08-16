import { Terminal2 } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const registry = {
  category: 'Development',
  order: 2,
} as const satisfies import('../tools.types').ToolRegistryMetadata;

export const tool = defineTool({
  name: translate('tools.cli-command-editor.title'),
  path: '/cli-command-editor',
  description: translate('tools.cli-command-editor.description'),
  keywords: ['cli', 'command', 'shell', 'posix', 'powershell', 'quote', 'flags', 'pipeline', 'redirect'],
  component: () => import('./cli-command-editor.vue'),
  icon: Terminal2,
});
