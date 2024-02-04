import { DeviceDesktop } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: '设备信息',
  path: '/device-information',
  description: '获取有关您当前设备的信息（屏幕尺寸、像素比、用户代理...）',
  keywords: [
    '设备',
    '信息',
    '屏幕',
    '像素',
    '比例',
    '状态',
    '数据',
    '电脑',
    '尺寸',
    '用户',
    '代理',
  ],
  component: () => import('./device-information.vue'),
  icon: DeviceDesktop,
});
