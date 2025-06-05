/*
 * @Author: guihouchang guihouchang@163.com
 * @Date: 2025-06-05 17:06:24
 * @LastEditors: guihouchang guihouchang@163.com
 * @LastEditTime: 2025-06-05 17:42:33
 * @FilePath: /it-tools/src/tools/ip-info/index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { ArrowLeftBar } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'ip-info',
  path: '/ip-info',
  component: () => import('./ip-info.vue'),
  icon: ArrowLeftBar,
  keywords: ['ip', 'query', 'info', 'location', 'isp'],
  createdAt: new Date('2024-08-25'),
});
