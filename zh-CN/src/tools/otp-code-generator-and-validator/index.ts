import { DeviceMobile } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'OTP 验证码生成器',
  path: '/otp-generator',
  description: '生成并验证基于时间的 OTP（一次性密码）以进行多重身份验证。',
  keywords: [
    'otp',
    '代码',
    '生成',
    '验证',
    '一次性',
    '时间',
    '密码',
    '认证',
    'MFA',
    'mobile',
    '设备',
    '安全',
    'TOTP',
    'Time',
    'HMAC',
  ],
  component: () => import('./otp-code-generator-and-validator.vue'),
  icon: DeviceMobile,
});
