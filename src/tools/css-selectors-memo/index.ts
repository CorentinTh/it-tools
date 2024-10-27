import { BrandCss3 } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'CSS Selectors Cheatsheet',
  path: '/css-selectors-memo',
  description: 'CSS Selectors Syntax Cheatsheet',
  keywords: ['css', 'selectors', 'cheatsheet', 'memo'],
  component: () => import('./css-selectors-memo.vue'),
  icon: BrandCss3,
  createdAt: new Date('2024-08-15'),
});
