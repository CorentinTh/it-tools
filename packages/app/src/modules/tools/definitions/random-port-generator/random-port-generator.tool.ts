import { defineTool } from '../../tools.models';

export const randomPortGeneratorTool = defineTool({
  slug: 'random-port-generator',
  entryFile: () => import('./random-port-generator.page'),
  icon: 'i-tabler-server',
  createdAt: new Date('2024-10-03'),
  dirName: 'random-port-generator',
});
