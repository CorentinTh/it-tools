import { ArrowsShuffle } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
    name: 'JSON to GO',
    path: '/json-to-go',
    description: '',
    keywords: ['json', 'JSON', 'go'],
    component: () => import('./json-to-go.vue'),
    icon: ArrowsShuffle,
    createdAt: new Date('2023-04-07'),
});