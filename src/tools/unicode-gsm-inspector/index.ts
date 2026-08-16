import { TextWrap } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const registry = {
  category: 'Text',
  order: 4,
} as const satisfies import('../tools.types').ToolRegistryMetadata;

export const tool = defineTool({
  name: translate('tools.unicode-gsm-inspector.title'),
  path: '/unicode-gsm-inspector',
  description: translate('tools.unicode-gsm-inspector.description'),
  keywords: ['unicode', 'code point', 'utf-8', 'utf-16', 'grapheme', 'gsm-7', 'sms', 'septet'],
  component: () => import('./unicode-gsm-inspector.vue'),
  icon: TextWrap,
});
