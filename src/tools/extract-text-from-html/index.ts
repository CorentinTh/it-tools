import { CursorText } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Extract text from HTML',
  path: '/extract-text-from-html',
  description:
    'Paste your HTML in the input form on the left and you will get text instantly. Occasionally, you may need to extract plain text from an HTML page where CSS properties (like user-select: none;) prevent text selection. The typical workaround involves using the DevTools (F12) to select "Copy → outer HTML". The proposed tool would simplify this process by extracting the "inner Text" directly from the copied HTML.',
  keywords: ['extract', 'text', 'from', 'html'],
  component: () => import('./extract-text-from-html.vue'),
  icon: CursorText,
  createdAt: new Date('2024-05-10'),
});
