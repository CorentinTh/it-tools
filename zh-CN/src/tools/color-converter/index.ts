import { Palette } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: '颜色转换器',
  path: '/color-converter',
  description: '在不同格式之间转换颜色（hex、rgb、hsl 和 css 名称）',
  keywords: ['颜色', '转换器'],
  component: () => import('./color-converter.vue'),
  icon: Palette,
  redirectFrom: ['/color-picker-converter'],
});
