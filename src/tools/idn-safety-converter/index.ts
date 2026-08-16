import { TextWrap } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const registry = {
  category: 'Converter',
  order: 6,
} as const satisfies import('../tools.types').ToolRegistryMetadata;

export const tool = defineTool({
  name: translate('tools.idn-safety-converter.title'),
  path: '/idn-safety-converter',
  description: translate('tools.idn-safety-converter.description'),
  keywords: ['punycode', 'idn', 'domain', 'unicode', 'confusable', 'phishing', 'ace'],
  component: () => import('./idn-safety-converter.vue'),
  icon: TextWrap,
});
