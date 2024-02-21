import { FileDiff } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.text-diff.title'),
  path: '/text-diff',
  description: t('tools.text-diff.description'),
  keywords: ['text', 'diff', 'compare', 'string', 'text diff', 'code'],
  component: () => import('./text-diff.vue'),
  icon: FileDiff,
  createdAt: new Date('2023-08-16'),
});
