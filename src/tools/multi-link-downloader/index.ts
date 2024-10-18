import { FileDownload } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Multi link downloader',
  path: '/multi-link-downloader',
  description: '',
  keywords: ['multi', 'link', 'downloader'],
  component: () => import('./multi-link-downloader.vue'),
  icon: FileDownload,
  createdAt: new Date('2024-10-18'),
});
