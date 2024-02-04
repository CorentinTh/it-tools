import { Devices } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'MAC地址查询',
  path: '/mac-address-lookup',
  description: '通过MAC地址查询设备的供应商和制造商。',
  keywords: ['mac', '地址', '查询', '设备', '供应商', '制造商'],
  component: () => import('./mac-address-lookup.vue'),
  icon: Devices,
  createdAt: new Date('2023-04-06'),
});
