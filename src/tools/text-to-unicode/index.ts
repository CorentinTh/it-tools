import { TextWrap } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Text to Unicode',
  path: '/text-to-unicode',
  description: 'Parse and convert Text to Unicode',
  keywords: ['text', 'to', 'unicode'],
  component: () => import('./text-to-unicode.vue'),
  icon: TextWrap,
  createdAt: new Date('2024-01-31'),
});
