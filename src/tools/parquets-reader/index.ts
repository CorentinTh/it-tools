import { Parking } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Parquet files Reader',
  path: '/parquets-reader',
  description: 'Read parquet file as JSON object arrays',
  keywords: ['parquet', 'reader'],
  component: () => import('./parquets-reader.vue'),
  icon: Parking,
  createdAt: new Date('2025-02-09'),
});
