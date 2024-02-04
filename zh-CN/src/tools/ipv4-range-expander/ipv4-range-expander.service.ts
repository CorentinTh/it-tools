import { convertBase } from '../integer-base-converter/integer-base-converter.model';
import { ipv4ToInt } from '../ipv4-address-converter/ipv4-address-converter.service';
import type { Ipv4RangeExpanderResult } from './ipv4-range-expander.types';

export { calculateCidr };

function bits2ip(ipInt: number) {
  return `${ipInt >>> 24}.${(ipInt >> 16) & 255}.${(ipInt >> 8) & 255}.${ipInt & 255}`;
}

function getRangesize(start: string, end: string) {
  if (start == null || end == null) {
    return -1;
  }

  return 1 + Number.parseInt(end, 2) - Number.parseInt(start, 2);
}

function getCidr(start: string, end: string) {
  if (start == null || end == null) {
    return null;
  }

  const range = getRangesize(start, end);
  if (range < 1) {
    return null;
  }

  let mask = 32;
  for (let i = 0; i < 32; i++) {
    if (start[i] !== end[i]) {
      mask = i;
      break;
    }
  }

  const newStart = start.substring(0, mask) + '0'.repeat(32 - mask);
  const newEnd = end.substring(0, mask) + '1'.repeat(32 - mask);

  return { start: newStart, end: newEnd, mask };
}

function calculateCidr({ startIp, endIp }: { startIp: string; endIp: string }) {
  const start = convertBase({
    value: ipv4ToInt({ ip: startIp }).toString(),
    fromBase: 10,
    toBase: 2,
  }).padStart(32, '0');
  const end = convertBase({
    value: ipv4ToInt({ ip: endIp }).toString(),
    fromBase: 10,
    toBase: 2,
  }).padStart(32, '0');

  const cidr = getCidr(start, end);
  if (cidr != null) {
    const result: Ipv4RangeExpanderResult = {};
    result.newEnd = bits2ip(Number.parseInt(cidr.end, 2));
    result.newStart = bits2ip(Number.parseInt(cidr.start, 2));
    result.newCidr = `${result.newStart}/${cidr.mask}`;
    result.newSize = getRangesize(cidr.start, cidr.end);

    result.oldSize = getRangesize(start, end);
    return result;
  }

  return undefined;
}
