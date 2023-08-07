import { MoodSmile } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Emoji picker',
  path: '/emoji-picker',
  description: 'Copy and paste emojis easily and get the unicode and code points value of each emoji.',
  keywords: ['emoji', 'picker', 'unicode', 'copy', 'paste'],
  component: () => import('./emoji-picker.vue'),
  icon: MoodSmile,
  createdAt: new Date('2023-08-07'),
});
