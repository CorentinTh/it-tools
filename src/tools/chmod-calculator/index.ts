import { FileInvoice } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Chmod calculator',
  path: '/chmod-calculator',
  description: 'Compute your chmod permissions and commands with this online chmod calculator.',
  keywords: [
    'chmod',
    'calculator',
    'file',
    'permission',
    'files',
    'directory',
    'folder',
    'recursive',
    'generator',
    'octal',
  ],
  component: () => import('./chmod-calculator.vue'),
  icon: FileInvoice,
});
