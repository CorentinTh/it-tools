import { BrandJavascript } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Javascript Prettifier',
  path: '/javascript-prettifier',
  description: 'JS/Javascript Prettifier',
  keywords: ['javascript', 'prettifier', 'beautify', 'prettier', 'format'],
  component: () => import('./javascript-prettifier.vue'),
  icon: BrandJavascript,
  createdAt: new Date('2024-03-15'),
});
