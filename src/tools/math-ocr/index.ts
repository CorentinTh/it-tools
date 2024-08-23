import { MathSymbols } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Math OCR',
  path: '/math-ocr',
  description: 'Convert Math Formula images to Latex',
  keywords: ['math', 'ocr', 'latex', 'formula', 'image'],
  component: () => import('./math-ocr.vue'),
  icon: MathSymbols,
  createdAt: new Date('2024-08-15'),
});
