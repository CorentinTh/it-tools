import { LetterX } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Roman numeral converter',
  path: '/roman-numeral-converter',
  description: 'Convert Roman numerals to numbers and convert numbers to Roman numerals.',
  keywords: ['roman', 'arabic', 'converter', 'X', 'I', 'V', 'L', 'C', 'D', 'M'],
  component: () => import('./roman-numeral-converter.vue'),
  icon: LetterX,
});
