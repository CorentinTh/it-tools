import { IconBrowser } from '@tabler/icons-vue';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.user-agent-parser.title'),
  path: '/user-agent-parser',
  description: translate('tools.user-agent-parser.description'),
  keywords: ['user', 'agent', 'parser', 'browser', 'engine', 'os', 'cpu', 'device', 'user-agent', 'client'],
  component: () => import('./user-agent-parser.vue'),
  icon: IconBrowser,
  createdAt: new Date('2023-04-06'),
});
