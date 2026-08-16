import { SettingsAutomation } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const registry = {
  category: 'Development',
  order: 3,
} as const satisfies import('../tools.types').ToolRegistryMetadata;

export const tool = defineTool({
  name: translate('tools.devops-config-workspace.title'),
  path: '/devops-config-workspace',
  description: translate('tools.devops-config-workspace.description'),
  keywords: ['devops', 'dockerfile', 'compose', 'nginx', 'properties', 'yaml', 'json', 'toml', 'dotenv', '.env', 'environment variables', 'lint', 'format', 'config'],
  component: () => import('./devops-config-workspace.vue'),
  icon: SettingsAutomation,
});
