import { DeviceDesktop } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'HDD calculator',
  path: '/hdd-calculator',
  description: 'Storage device manufacturers report capacities in decimal form (like GB), while operating systems and other software uses binary form (GiB), although still incorrectly using the decimal unit (GiB). This tool converts decimal form capacity into various binary forms.',
  keywords: ['hdd', 'calculator', 'size', 'conversion', 'binary', 'decimal',
    'gb', 'mb', 'tb',
    'gigabyte', 'gibibyte', 'megabyte', 'mebibyte', 'terabyte', 'tebibyte'],
  component: () => import('./hdd-calculator.vue'),
  icon: DeviceDesktop,
  createdAt: new Date('2024-04-07'),
});
