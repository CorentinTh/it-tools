import { FileInvoice } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'chmod权限计算',
  path: '/chmod-calculator',
  description: '使用此在线 chmod 权限计算计算您的 chmod 权限和命令。',
  keywords: [
    'chmod',
    '计算',
    '文件',
    '权限',
    '目录',
    '文件夹',
    '递归',
    '生成',
    '八进制',
  ],
  component: () => import('./chmod-calculator.vue'),
  icon: FileInvoice,
});
