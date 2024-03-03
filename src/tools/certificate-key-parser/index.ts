import { FileCertificate } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Certificate/Key parser',
  path: '/certificate-key-parser',
  description: 'Parse Key and Certificate',
  keywords: ['certificate', 'key', 'parser'],
  component: () => import('./certificate-key-parser.vue'),
  icon: FileCertificate,
  createdAt: new Date('2024-02-22'),
});
