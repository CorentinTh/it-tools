import { ClearFormatting } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'HAR Sanitizer',
  path: '/har-sanitizer',
  description: 'HAR Files Sanitizer',
  keywords: ['har', 'sanitizer'],
  component: () => import('./har-sanitizer.vue'),
  icon: ClearFormatting,
  createdAt: new Date('2024-06-17'),
});
