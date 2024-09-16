import { Braces } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'CSS XPath Converter',
  path: '/css-xpath-converter',
  description: 'Convert CSS selector to/from XPath expression',
  keywords: ['css', 'xpath', 'converter'],
  component: () => import('./css-xpath-converter.vue'),
  icon: Braces,
  createdAt: new Date('2024-08-15'),
});
