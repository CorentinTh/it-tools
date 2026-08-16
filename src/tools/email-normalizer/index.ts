import { Mail } from '@vicons/tabler';
import { defineTool } from '../tool';

export const registry = {
  category: 'Development',
  order: 24,
} as const satisfies import('../tools.types').ToolRegistryMetadata;

export const tool = defineTool({
  name: 'Email normalizer',
  path: '/email-normalizer',
  description: 'Normalize email addresses to a standard format for easier comparison. Useful for deduplication and data cleaning.',
  keywords: ['email', 'normalizer'],
  component: () => import('./email-normalizer.vue'),
  icon: Mail,
  createdAt: new Date('2024-08-15'),
});
