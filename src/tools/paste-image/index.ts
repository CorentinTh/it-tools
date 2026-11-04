import { Photo } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.paste-image.title'),
  path: '/paste-image',
  description: translate('tools.paste-image.description'),
  keywords: ['paste', 'image', 'clipboard', 'download', 'screenshot', 'png', 'jpeg', 'jpg', 'webp', 'convert', 'base64'],
  component: () => import('./paste-image.vue'),
  icon: Photo,
  createdAt: new Date('2026-11-04'),
});
