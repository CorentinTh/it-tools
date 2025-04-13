import { getMatch } from 'ip-matching';

export function cidrInCidr(
  { baseRange, ipOrRangeToTest }:
  {
    baseRange: string
    ipOrRangeToTest: string
  }) {
  const baseMatchMasks = getMatch(baseRange)?.convertToMasks() || [];
  const ipOrRangeToTestMatchMasks = getMatch(ipOrRangeToTest)?.convertToMasks() || [];

  const baseSubnets = baseMatchMasks.map((mask) => {
    const subnet = mask.convertToSubnet();
    if (!subnet) {
      return { cidr: '', start: '', end: '' };
    }
    return {
      cidr: subnet.toString(),
      start: subnet.getFirst().toString(),
      end: subnet.getLast().toString(),
    };
  }).filter(subnet => subnet.cidr !== '');

  return {
    baseSubnets,
    isIncluded: baseMatchMasks.some(baseMask => ipOrRangeToTestMatchMasks.every(ipOrRangeMask => ipOrRangeMask.isSubsetOf(baseMask))),
  };
}
