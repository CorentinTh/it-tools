import { EyeOff } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const registry = {
  category: 'Web',
  order: 16,
} as const satisfies import('../tools.types').ToolRegistryMetadata;

export const tool = defineTool({
  name: translate('tools.sensitive-data-masker.title'),
  path: '/sensitive-data-masker',
  description: translate('tools.sensitive-data-masker.description'),
  keywords: ['redact', 'mask', 'sanitize', 'har', 'secret', 'token', 'password', 'privacy', 'pii'],
  component: () => import('./sensitive-data-masker.vue'),
  icon: EyeOff,
});
