import type { IPMask } from 'ip-matching';
import { getMatch } from 'ip-matching';
import { excludeCidr } from 'cidr-tools';

function convertToCIDR(mask: IPMask) {
  const subnet = mask.convertToSubnet();
  if (!subnet) {
    return { cidr: mask.toString(), start: '', end: '' };
  }
  return {
    cidr: subnet.toString(),
    start: subnet.getFirst().toString(),
    end: subnet.getLast().toString(),
  };
}

export function substractCIDRs(
  { allowedRanges, disallowedRanges }:
  {
    allowedRanges: string
    disallowedRanges: string
  }) {
  try {
    const allowedRangesMatchMasks = allowedRanges.split(/\s*[,;|]+\s*/g) // NOSONAR
      .filter(range => range)
      .flatMap(range => getMatch(range)?.convertToMasks() || []);
    const disallowedRangesMatchMasks = disallowedRanges.split(/\s*[,;|]+\s*/g) // NOSONAR
      .filter(range => range)
      .flatMap(range => getMatch(range)?.convertToMasks() || []);

    const allowedSubnets = allowedRangesMatchMasks.map(convertToCIDR);
    const disallowedSubnets = disallowedRangesMatchMasks.map(convertToCIDR);

    return {
      error: '',
      allowedSubnets,
      disallowedSubnets,
      allowedCIDRs: excludeCidr(allowedSubnets.map(net => net.cidr), disallowedSubnets.map(net => net.cidr)),
    };
  }
  catch (e: any) {
    return {
      error: e.toString(),
      allowedSubnets: [],
      disallowedSubnets: [],
      allowedCIDRs: [],
    };
  }
}
