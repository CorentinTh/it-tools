import { Keyboard } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: '键盘按键信息',
  path: '/keycode-info',
  description: '查找任何按下的键盘按键的 JavaScript 键码、代码、位置和修饰符。',
  keywords: [
    '按键',
    '信息',
    '代码',
    'javascript',
    '事件',
    '键盘',
    '按下',
    '修饰符',
    'alt',
    'ctrl',
    'meta',
    'shift',
  ],
  component: () => import('./keycode-info.vue'),
  icon: Keyboard,
});
