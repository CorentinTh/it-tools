import { ImageOutlined } from '@vicons/material';
import { translate } from '@/plugins/i18n.plugin';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: translate('tools.svg-placeholder-generator.title'),
  path: '/svg-placeholder-generator',
  description: translate('tools.svg-placeholder-generator.description'),
  keywords: ['svg', 'placeholder', 'generator', 'image', 'size', 'mockup'],
  component: () => import('./svg-placeholder-generator.vue'),
  icon: ImageOutlined,
});
