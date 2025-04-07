import { Id } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Snowflake ID extractor',
  path: '/snowflake-id-extractor',
  description: 'Extract timestamp, machine ID, and sequence number from a Snowflake ID',
  keywords: ['snowflake', 'id', 'extractor'],
  component: () => import('./snowflake-id-extractor.vue'),
  icon: Id,
  createdAt: new Date('2024-07-22'),
});
