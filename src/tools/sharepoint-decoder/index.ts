import { Mailbox } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Sharepoint Share Url Decoder',
  path: '/sharepoint-decoder',
  description: 'Decode sharepoint.com share urls to "normal" Sharepoint Url',
  keywords: ['sharepoint', 'url', 'decoder'],
  component: () => import('./sharepoint-decoder.vue'),
  icon: Mailbox,
  createdAt: new Date('2025-02-09'),
});
