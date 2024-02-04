import { Code } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'HTML 转义',
  path: '/html-entities',
  description: '转义或取消转义 html 实体（将 <、>、&、" 和 \' 替换为其 html 版本）',
  keywords: ['html', '实体', '转义', '取消转义', '特殊', '字符', '标签'],
  component: () => import('./html-entities.vue'),
  icon: Code,
});
