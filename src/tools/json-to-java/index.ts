import { ArrowsShuffle } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'JSON to Java Entity',
  path: '/json-to-java',
  description: 'Convert JSON into Java entities',
  keywords: ['json', 'to', 'java'],
  component: () => import('./json-to-java.vue'),
  icon: ArrowsShuffle,
  createdAt: new Date('2024-07-03'),
});
