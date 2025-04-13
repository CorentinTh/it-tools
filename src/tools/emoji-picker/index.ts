import { IconMoodSmile } from '@tabler/icons-vue';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.emoji-picker.title'),
  path: '/emoji-picker',
  description: translate('tools.emoji-picker.description'),
  keywords: ['emoji', 'picker', 'unicode', 'copy', 'paste'],
  component: () => import('./emoji-picker.vue'),
  icon: IconMoodSmile,
  createdAt: new Date('2023-08-07'),
});
