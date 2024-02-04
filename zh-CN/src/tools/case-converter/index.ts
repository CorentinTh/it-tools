import { LetterCaseToggle } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: '大小写转换器',
  path: '/case-converter',
  description: '更改字符串的大小写并选择不同的格式',
  keywords: [
    '大小写',
    '转换器',
    'camelCase',
    'capitalCase',
    'constantCase',
    'dotCase',
    'headerCase',
    'noCase',
    'paramCase',
    'pascalCase',
    'pathCase',
    'sentenceCase',
    'snakeCase',
  ],
  component: () => import('./case-converter.vue'),
  icon: LetterCaseToggle,
});
