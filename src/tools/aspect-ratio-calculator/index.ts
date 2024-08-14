import { AspectRatio } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Aspect Ratio Calculator',
  path: '/aspect-ratio-calculator',
  description: 'Use this ratio calculator to check the dimensions when resizing images.',
  keywords: ['aspect', 'ratio', 'calculator'],
  component: () => import('./aspect-ratio-calculator.vue'),
  icon: AspectRatio,
  createdAt: new Date('2024-08-14'),
});
