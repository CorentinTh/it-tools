import { LetterCase } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.text-case-converter.title'),
  path: '/text-case-converter',
  description: translate('tools.text-case-converter.description'),
  keywords: ['text', 'case', 'converter'],
  component: () => import('./text-case-converter.vue'),
  icon: LetterCase,
  createdAt: new Date('2024-5-28'),
});
