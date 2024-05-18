import { Barcode } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Barcode Reader',
  path: '/barcode-reader',
  description: 'Barcode reader',
  keywords: ['barcode', 'reader'],
  component: () => import('./barcode-reader.vue'),
  icon: Barcode,
  createdAt: new Date('2024-04-20'),
});
