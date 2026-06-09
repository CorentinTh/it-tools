import { Photo } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Favicon generator',
  path: '/favicon-generator',
  description: 'Convert any image into a complete favicon package. Upload a logo or square image — get a ZIP with favicon.ico, 16×16, 32×32, 48×48, 180×180, 192×192, and 512×512 PNGs plus site.webmanifest. Everything runs in your browser.',
  keywords: ['favicon', 'generator', 'icon', 'apple-touch-icon', 'webmanifest', 'png', 'image', 'convert'],
  component: () => import('./favicon-generator.vue'),
  icon: Photo,
  createdAt: new Date('2026-06-09'),
});
