import { Eraser } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Background remover',
  path: '/bg-remover',
  description: 'Remove the background from an image directly in your browser, using an AI model (RMBG-1.4). Nothing is uploaded, everything runs locally on your device.',
  keywords: ['bg', 'remover', 'background', 'remove', 'image', 'photo', 'ai', 'rmbg'],
  component: () => import('./bg-remover.vue'),
  icon: Eraser,
  createdAt: new Date('2026-09-04'),
});
