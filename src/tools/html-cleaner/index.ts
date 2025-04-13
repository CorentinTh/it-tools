import { BrandHtml5 } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Html cleaner',
  path: '/html-cleaner',
  description: 'Clean HTML',
  keywords: ['html', 'cleaner'],
  component: () => import('./html-cleaner.vue'),
  icon: BrandHtml5,
  createdAt: new Date('2024-02-25'),
});
