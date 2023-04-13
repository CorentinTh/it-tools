import { ArrowsShuffle } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
    name: 'JSON to GO',
    path: '/json-to-go',
    description: 'Converts JSON into a Go type definition.',
    keywords: ['json', 'JSON', 'go'],
    component: () => import('./json-to-go.vue'),
    icon: ArrowsShuffle,
    createdAt: new Date('2023-04-07'),
});