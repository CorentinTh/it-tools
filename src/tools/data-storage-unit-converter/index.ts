import { ArrowsLeftRight } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Data Storage Unit converter',
  path: '/data-storage-unit-converter',
  description: 'Convert data storage or transfer units (bytes, bibytes, bits, kilobytes...)',
  keywords: ['data', 'storage', 'unit', 'conversion',
    'bits', 'bytes', 'bibytes', 'binary',
    'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB',
    'B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB',
    'b', 'Kb', 'Mb', 'Gb', 'Tb', 'Pb', 'Eb', 'Zb', 'Yb'],
  component: () => import('./data-storage-unit-converter.vue'),
  icon: ArrowsLeftRight,
  createdAt: new Date('2024-08-15'),
});
