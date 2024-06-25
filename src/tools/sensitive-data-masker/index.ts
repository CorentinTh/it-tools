import { ShieldLock } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Sensitive data masker',
  path: '/sensitive-data-masker',
  description: 'Clean sensitive data from textual content (ie logs)',
  keywords: ['sensitive', 'data', 'masker', 'obfuscator', 'clean', 'log'],
  component: () => import('./sensitive-data-masker.vue'),
  icon: ShieldLock,
  createdAt: new Date('2024-06-16'),
});
