import { Database } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Data size converter',
  path: '/data-size-converter',
  description: 'Convert data sizes between B, KB, MB, GB, TB and PB with decimal (SI) or binary base',
  keywords: ['data', 'size', 'bytes', 'kb', 'mb', 'gb', 'tb', 'converter', 'storage'],
  component: () => import('./data-size-converter.vue'),
  icon: Database,
  createdAt: new Date('2026-09-30'),
});
