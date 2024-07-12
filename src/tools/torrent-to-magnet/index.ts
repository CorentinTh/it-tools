import { Bookmarks } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Torrent to Magnet',
  path: '/torrent-to-magnet',
  description: 'Convert a torrent file to a Magnet url',
  keywords: ['torrent', 'magnet', 'url', 'link'],
  component: () => import('./torrent-to-magnet.vue'),
  icon: Bookmarks,
  createdAt: new Date('2024-04-20'),
});
