import { Folder } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Folder Structure Diagram',
  path: '/folder-structure-diagram',
  description: 'tree-like utility for generating ASCII folder structure diagrams',
  keywords: ['folder', 'structure', 'diagram', 'tree', 'ascii'],
  component: () => import('./folder-structure-diagram.vue'),
  icon: Folder,
  createdAt: new Date('2024-04-20'),
});
