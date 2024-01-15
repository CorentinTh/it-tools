import { BrandHtml5 } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'HTML-MD converter',
  path: '/html-md-converter',
  description: 'Convert an html div with all contained data to Markdown using turndown',
  keywords: ['html', 'md', 'converter'],
  component: () => import('./html-md-converter.vue'),
  icon: BrandHtml5,
});
