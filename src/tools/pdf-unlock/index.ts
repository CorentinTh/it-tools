import { LockOff } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Pdf Decrypt and Unlock',
  path: '/pdf-unlock',
  description: 'Decrypt a PDF and unlock (remove security permissions)',
  keywords: ['pdf', 'unlock', 'decrypt'],
  component: () => import('./pdf-unlock.vue'),
  icon: LockOff,
  createdAt: new Date('2024-01-09'),
});
