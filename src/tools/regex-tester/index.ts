import { Language } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.regex-tester.title'),
  path: '/regex-tester',
  description: translate('tools.regex-tester.description'),
  keywords: ['regex', 'tester', 'sample', 'expression'],
  component: () => import('./regex-tester.vue'),
  icon: Language,
  createdAt: new Date('2024-09-20'),
});
