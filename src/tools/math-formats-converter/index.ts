import { EqualNot } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Math Formats Converter',
  path: '/math-formats-converter',
  description: 'Convert mathematical expression between formats',
  keywords: ['math', 'formats', 'converter', 'latex', 'mathml', 'asciimath', 'omml', 'html'],
  component: () => import('./math-formats-converter.vue'),
  icon: EqualNot,
  createdAt: new Date('2024-05-11'),
});
