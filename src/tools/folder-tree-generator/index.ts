import { Sitemap } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Folder tree generator',
  path: '/folder-tree-generator',
  description: 'Turn an indented file/folder listing into a box-drawing tree, like the tree command',
  keywords: ['folder', 'tree', 'directory', 'structure', 'ascii', 'diagram', 'indent'],
  component: () => import('./folder-tree-generator.vue'),
  icon: Sitemap,
  createdAt: new Date('2026-10-01'),
});
