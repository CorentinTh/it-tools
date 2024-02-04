import { Tags } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'HTML META 生成器',
  path: '/og-meta-generator',
  description: '为您的网站生成OpenGraph和HTML META标记。',
  keywords: [
    'meta',
    '标签',
    '生成',
    '社会化',
    '标题',
    '描述',
    '图片',
    '分享',
    '在线',
    '网站',
    'opengraph',
    'og',
  ],
  component: () => import('./meta-tag-generator.vue'),
  icon: Tags,
});
