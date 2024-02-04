import { AlignJustified } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: '占位符文本生成器',
  path: '/lorem-ipsum-generator',
  description: 'Lorem ipsum 是一种占位符文本，通常用于演示文档或字体的视觉形式，内容没有任何意义',
  keywords: ['lorem', 'ipsum', '占位符', '文本', '随机', '生成'],
  component: () => import('./lorem-ipsum-generator.vue'),
  icon: AlignJustified,
});
