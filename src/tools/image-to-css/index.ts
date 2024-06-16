import { BrandCss3 } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Image to CSS',
  path: '/image-to-css',
  description: 'Convert image to CSS (url, background, ...)',
  keywords: ['image', 'css'],
  component: () => import('./image-to-css.vue'),
  icon: BrandCss3,
  createdAt: new Date('2024-05-11'),
});
