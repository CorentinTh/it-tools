import { MoodSmile } from '@vicons/tabler';
import { translate } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: translate('tools.emoji-picker.title'),
  path: '/emoji-picker',
  description: translate('tools.emoji-picker.description'),
  keywords: ['emoji', 'picker', 'unicode', 'copy', 'paste'],
  component: () => import('./emoji-picker.vue'),
  icon: MoodSmile,
  createdAt: new Date('2023-08-07'),
});
