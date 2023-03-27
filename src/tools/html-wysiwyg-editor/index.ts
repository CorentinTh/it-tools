import { Edit } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'HTML WYSIWYG editor',
  path: '/html-wysiwyg-editor',
  description: 'Online HTML editor with feature-rich WYSIWYG editor, get the source code of the content immediately.',
  keywords: ['html', 'wysiwyg', 'editor', 'p', 'ul', 'ol', 'converter', 'live'],
  component: () => import('./html-wysiwyg-editor.vue'),
  icon: Edit,
});
