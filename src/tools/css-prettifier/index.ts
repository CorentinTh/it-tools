import { BrandCss3 } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Css prettifier',
  path: '/css-prettifier',
  description: 'CSS Prettify',
  keywords: ['css', 'prettifier', 'beautify', 'prettier', 'format'],
  component: () => import('./css-prettifier.vue'),
  icon: BrandCss3,
  createdAt: new Date('2024-03-15'),
});
