import { Lock } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Pdf Encrypt',
  path: '/pdf-encrypt',
  description: 'Encrypt and add protection to a PDF File',
  keywords: ['pdf', 'encrypt'],
  component: () => import('./pdf-encrypt.vue'),
  icon: Lock,
  createdAt: new Date('2024-01-09'),
});
