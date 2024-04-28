import { DeviceDesktop } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'HDD calculator',
  path: '/hdd-calculator',
  description: 'Compute real storage space (binary) from HDD Capacity (decimal)',
  keywords: ['hdd', 'calculator', 'size', 'conversion', 'binary', 'decimal',
    'gb', 'mb', 'tb',
    'gigabyte', 'gibibyte', 'megabyte', 'mebibyte', 'terabyte', 'tebibyte'],
  component: () => import('./hdd-calculator.vue'),
  icon: DeviceDesktop,
  createdAt: new Date('2024-04-07'),
});
