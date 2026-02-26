import { ArrowsShuffle } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.icon-generator.title'),
  path: '/icon-generator',
  description: translate('tools.icon-generator.description'),
  keywords: ['icon', 'generator', 'pwa', 'android', 'ios', 'app icon', 'resize', 'favicon'],
  component: () => import('./icon-generator.vue'),
  icon: ArrowsShuffle,
  createdAt: new Date('2026-02-26'),
});
