import { FileText } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'HTML to text',
  path: '/html-to-text',
  description: 'Extract the visible plain text from an HTML fragment, dropping scripts, styles and hidden elements',
  keywords: ['html', 'text', 'extract', 'plaintext', 'innerhtml', 'dom'],
  component: () => import('./html-to-text.vue'),
  icon: FileText,
  createdAt: new Date('2026-10-01'),
});
