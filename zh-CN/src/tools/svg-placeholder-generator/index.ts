import { ImageOutlined } from '@vicons/material';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'SVG 图片占位生成器',
  path: '/svg-placeholder-generator',
  description: '生成用于应用程序中占位的 svg 图片。',
  keywords: ['svg', '占位', '生成', '图片', '尺寸', '样机'],
  component: () => import('./svg-placeholder-generator.vue'),
  icon: ImageOutlined,
});
