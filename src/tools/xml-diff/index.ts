import { CompareArrowsRound } from '@vicons/material';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.xml-diff.title'),
  path: '/xml-diff',
  description: translate('tools.xml-diff.description'),
  keywords: ['xml', 'diff', 'compare', 'difference'],
  component: () => import('./xml-diff.vue'),
  icon: CompareArrowsRound,
  createdAt: new Date('2026-08-08'),
});
