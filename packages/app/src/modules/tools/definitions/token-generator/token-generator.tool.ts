import { defineTool } from '../../tools.models';

export const tokenGeneratorTool = defineTool({
  slug: 'token-generator',
  entryFile: () => import('./token-generator.page'),
  icon: 'i-tabler-key',
  createdAt: new Date('2024-02-13'),
  currentDirUrl: import.meta.url,
});
