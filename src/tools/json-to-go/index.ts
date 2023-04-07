import { ArrowsShuffle } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
    name: 'Json to go',
    path: '/json-to-go',
    description: '',
    keywords: ['json', 'go'],
    component: () => import('./json-to-go.vue'),
    icon: ArrowsShuffle,
    createdAt: new Date('2023-04-07'),
});