import { BrandHtml5 } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Html Prettifier',
  path: '/html-prettifier',
  description: 'Prettify HTML code',
  keywords: ['html', 'prettifier', 'beautify', 'prettier', 'format'],
  component: () => import('./html-prettifier.vue'),
  icon: BrandHtml5,
  createdAt: new Date('2024-03-15'),
});
