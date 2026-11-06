import { defineTool } from '../tool';
import n7mIcon from './n7m-icon.svg?component';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.numeronym-generator.title'),
  path: '/numeronym-generator',
  description: translate('tools.numeronym-generator.description'),
  keywords: ['numeronym', 'generator', 'abbreviation', 'i18n', 'a11y', 'l10n'],
  component: () => import('./numeronym-generator.vue'),
  icon: n7mIcon,
  createdAt: new Date('2023-11-05'),
});
