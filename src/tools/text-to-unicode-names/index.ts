import { Language } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Text to Unicode Names',
  path: '/text-to-unicode-names',
  description: 'Convert a text to its hexadecimal character codes and Unicode Names for each character',
  keywords: ['text', 'unicode', 'name', 'hexa', 'char', 'code'],
  component: () => import('./text-to-unicode-names.vue'),
  icon: Language,
  createdAt: new Date('2024-06-10'),
});
