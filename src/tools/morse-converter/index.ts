import { ArrowsShuffle } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Morse Code Converter',
  path: '/morse-converter',
  description: 'Encode/Decode to Morse code',
  keywords: ['morse', 'converter'],
  component: () => import('./morse-converter.vue'),
  icon: ArrowsShuffle,
  createdAt: new Date('2024-04-20'),
});
