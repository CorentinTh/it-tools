import { Microphone } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.mic-tester.title'),
  path: '/mic-tester',
  description: translate('tools.mic-tester.description'),
  keywords: ['mic', 'microphone', 'test', 'check', 'troubleshoot', 'sound'],
  component: () => import('./mic-tester.vue'),
  icon: Microphone,
});
