import { TextWrap } from '@vicons/tabler';
import { translate } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: translate('tools.text-to-unicode.title'),
  path: '/text-to-unicode',
  description: translate('tools.text-to-unicode.description'),
  keywords: ['text', 'to', 'unicode'],
  component: () => import('./text-to-unicode.vue'),
  icon: TextWrap,
  createdAt: new Date('2024-01-31'),
});
