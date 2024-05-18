import { CSharp } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'JSON to C#',
  path: '/json-to-csharp',
  description: 'Convert JSON data to C# type definition',
  keywords: ['json', 'c#', 'csharp'],
  component: () => import('./json-to-csharp.vue'),
  icon: CSharp,
  createdAt: new Date('2024-05-11'),
});
