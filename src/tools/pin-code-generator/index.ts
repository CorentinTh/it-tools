import { FileDigit } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Pin Code Generator',
  path: '/pin-code-generator',
  description: 'Generate Unique PIN (digits) codes',
  keywords: ['pin', 'code', 'digits', 'generator'],
  component: () => import('./pin-code-generator.vue'),
  icon: FileDigit,
  createdAt: new Date('2024-08-15'),
});
