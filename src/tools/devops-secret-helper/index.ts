import { Lock } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.devops-secret-helper.title'),
  path: '/devops-secret-helper',
  description: translate('tools.devops-secret-helper.description'),
  keywords: ['Ansible Vault', 'AES256', 'htpasswd', 'Apache', 'bcrypt', 'DevOps', 'secret'],
  component: () => import('./devops-secret-helper.vue'),
  icon: Lock,
});
