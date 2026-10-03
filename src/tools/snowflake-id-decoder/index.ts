import { Snowflake } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Snowflake id decoder',
  path: '/snowflake-id-decoder',
  description: 'Decode Twitter, Discord, Instagram or Mastodon snowflake ids into timestamps, worker ids and sequences',
  keywords: ['snowflake', 'twitter', 'discord', 'instagram', 'mastodon', 'id', 'timestamp', 'decoder'],
  component: () => import('./snowflake-id-decoder.vue'),
  icon: Snowflake,
  createdAt: new Date('2026-10-01'),
});
