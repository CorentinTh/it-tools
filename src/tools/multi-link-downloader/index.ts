import { IconFileDownload } from '@tabler/icons-vue';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Multi link downloader',
  path: '/multi-link-downloader',
  description: '',
  keywords: ['multi', 'link', 'downloader'],
  component: () => import('./multi-link-downloader.vue'),
  icon: IconFileDownload,
  createdAt: new Date('2024-10-18'),
});
