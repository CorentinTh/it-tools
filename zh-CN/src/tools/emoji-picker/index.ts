import { MoodSmile } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Emoji 表情大全',
  path: '/emoji-picker',
  description: '轻松复制和粘贴表情符号，并获取每个表情符号的 unicode 和 Code points 值。',
  keywords: ['emoji', '大全', 'unicode', '复制', '粘贴'],
  component: () => import('./emoji-picker.vue'),
  icon: MoodSmile,
  createdAt: new Date('2023-08-07'),
});
