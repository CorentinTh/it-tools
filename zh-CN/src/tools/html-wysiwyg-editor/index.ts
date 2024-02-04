import { Edit } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'HTML 在线编辑器',
  path: '/html-wysiwyg-editor',
  description: '在线HTML编辑器，具有功能丰富的所见即所得编辑器，立即获取内容的源代码。',
  keywords: ['html', '所见即所得', '编辑器', 'p', 'ul', 'ol', '编辑器', '在线'],
  component: () => import('./html-wysiwyg-editor.vue'),
  icon: Edit,
});
