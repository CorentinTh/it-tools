import { TransferIn } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Data Transfer Rate Calculator',
  path: '/data-transfer-rate-converter',
  description: 'Compute Data Transfer times, rates and amount of data',
  keywords: ['data', 'transfer', 'rate', 'convert', 'time'],
  component: () => import('./data-transfer-rate-converter.vue'),
  icon: TransferIn,
  createdAt: new Date('2024-08-15'),
});
