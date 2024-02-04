import { defineTool } from '../tool';
import PasswordIcon from '~icons/mdi/form-textbox-password';

export const tool = defineTool({
  name: '密码强度分析器',
  path: '/password-strength-analyser',
  description: '分析密码的暴力破解所需时间，仅客户端运算，此工具不会与服务器通信，且不会保存密码信息。',
  keywords: ['密码', '强度', '分析器'],
  component: () => import('./password-strength-analyser.vue'),
  icon: PasswordIcon,
  createdAt: new Date('2023-06-24'),
});
