import { Barcode } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Barcode Generator',
  path: '/barcode-generator',
  description: 'Barcode generator',
  keywords: ['barcode', 'generator'],
  component: () => import('./barcode-generator.vue'),
  icon: Barcode,
  createdAt: new Date('2024-04-20'),
});
