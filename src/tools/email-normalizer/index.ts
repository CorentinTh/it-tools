import { Mail } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.email-normalizer.title'),
  path: '/email-normalizer',
  description: translate('tools.email-normalizer.description'),
  keywords: ['email', 'normalizer'],
  component: () => import('./email-normalizer.vue'),
  icon: Mail,
  createdAt: new Date('2024-08-15'),
});
