import { FileLike } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Pdf Linearize/FastWeb',
  path: '/pdf-linearize',
  description: 'Create a Linearized version of a PDF (turn to FastWeb)',
  keywords: ['pdf', 'linearize', 'fastweb'],
  component: () => import('./pdf-linearize.vue'),
  icon: FileLike,
  createdAt: new Date('2024-01-09'),
});
