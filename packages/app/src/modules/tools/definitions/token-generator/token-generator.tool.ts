import { defineTool } from '../../tools.models';

export const tokenGeneratorTool = defineTool({
  slug: 'token-generator',
  entryFile: './token-generator.vue',
  icon: 'i-tabler-key',
  createdAt: new Date('2024-02-13'),
  currentDirUrl: import.meta.url,
});
