import { ArrowsShuffle } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'X509 certificate decoder',
  path: '/x509-certificate-decoder',
  description: '',
  keywords: ['x509', 'certificate', 'decoder'],
  component: () => import('./x509-certificate-decoder.vue'),
  icon: ArrowsShuffle,
  createdAt: new Date('2026-03-25'),
});
