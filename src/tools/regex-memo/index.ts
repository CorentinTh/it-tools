import { BrandJavascript } from '@vicons/tabler';
import { defineTool } from '../tool';

export const registry = {
  category: 'Development',
  order: 26,
} as const satisfies import('../tools.types').ToolRegistryMetadata;

export const tool = defineTool({
  name: 'Regex cheatsheet',
  path: '/regex-memo',
  description: 'Javascript Regex/Regular Expression cheatsheet',
  keywords: ['regex', 'regular', 'expression', 'javascript', 'memo', 'cheatsheet'],
  component: () => import('./regex-memo.vue'),
  icon: BrandJavascript,
  createdAt: new Date('2024-09-20'),
});
