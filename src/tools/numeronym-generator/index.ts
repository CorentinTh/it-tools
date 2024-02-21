import { defineTool } from '../tool';
import n7mIcon from './n7m-icon.svg?component';
import { translate as t } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: t('tools.numeronym-generator.title'),
  path: '/numeronym-generator',
  description: t('tools.numeronym-generator.description'),
  keywords: ['numeronym', 'generator', 'abbreviation', 'i18n', 'a11y', 'l10n'],
  component: () => import('./numeronym-generator.vue'),
  icon: n7mIcon,
  createdAt: new Date('2023-11-05'),
});
