import { TextWrapDisabled } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.unicode-to-java-entites.title'),
  path: '/unicode-to-java-entites',
  description: translate('tools.unicode-to-java-entites.description'),
  keywords: ['text', 'to', 'unicode'],
  component: () => import('./unicode-characters-to-java-entities.vue'),
  icon: TextWrapDisabled,
  createdAt: new Date('2024-01-31'),
});
