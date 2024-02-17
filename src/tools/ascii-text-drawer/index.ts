import { Artboard } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'ASCII Art Text Drawer',
  path: '/ascii-text-drawer',
  description: 'Draw a text using Ascii Art',
  keywords: ['ascii', 'asciiart', 'text', 'drawer'],
  component: () => import('./ascii-text-drawer.vue'),
  icon: Artboard,
  createdAt: new Date('2024-02-17'),
});
