import { IconMailbox } from '@tabler/icons-vue';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Outlook Safelink decoder',
  path: '/safelink-decoder',
  description: 'Decode Outlook SafeLink links',
  keywords: ['outlook', 'safelink', 'decoder'],
  component: () => import('./safelink-decoder.vue'),
  icon: IconMailbox,
  createdAt: new Date('2024-03-11'),
});
