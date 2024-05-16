import { TextWrapDisabled } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.unicode-to-java-entities.title'),
  path: '/unicode-to-java-entities',
  description: translate('tools.unicode-to-java-entities.description'),
  keywords: ['java-entities', 'to', 'unicode', 'text'],
  component: () => import('./unicode-characters-to-java-entities.vue'),
  icon: TextWrapDisabled,
  createdAt: new Date('2024-05-16'),
});
