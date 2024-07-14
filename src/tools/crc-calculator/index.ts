import { EyeOff } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'CRC calculator',
  path: '/crc-calculator',
  description: 'Compute text or file CRC (CRC1, CRC8, CRC8 1-Wire, CRC8 DVB-S2, CRC16, CRC16 CCITT, CRC16 Modbus, CRC16 Kermit, CRC16 XModem, CRC24, CRC32, CRC32 MPEG-2, CRCJAM)',
  keywords: ['crc', 'checksum', 'crc1',
    'crc8',
    'crc8 1-wire',
    'crc8 dvb-s2',
    'crc16',
    'crc16 ccitt',
    'crc16 modbus',
    'crc16 kermit',
    'crc16 xmodem',
    'crc24',
    'crc32',
    'crc32 mpeg-2',
    'crcjam'],
  component: () => import('./crc-calculator.vue'),
  icon: EyeOff,
  createdAt: new Date('2024-05-11'),
});
