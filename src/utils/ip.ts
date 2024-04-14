import { isIPv4 } from 'is-ip';
import { Address4, Address6 } from 'ip-address';
import { contains as containsCidr } from 'cidr-tools';
import type { IPMatch } from 'ip-matching';
import { IPMask, IPSubnetwork, getMatch } from 'ip-matching';
import isCidr from 'is-cidr';
import ipv4registry from './ipv4registry.json';
import ipv6registry from './ipv6registry.json';

const IPv4MAX = (BigInt(2) ** BigInt(32)) - BigInt(1);

// IP range specific information, see IANA allocations.
// http://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry.xhtml
const _ipv4Registry = new Map(ipv4registry.map(v => [v[0] as string, v[1]]));

// https://www.iana.org/assignments/iana-ipv6-special-registry/iana-ipv6-special-registry.xhtml
const _ipv6Registry = new Map(ipv6registry.map(v => [v[0] as string, v[1]]));

export function parseAsCIDR(form: string) {
  if (isCidr(form)) {
    return form;
  }

  const ipMatch: IPMatch = getMatch(form);
  if (ipMatch instanceof IPSubnetwork) {
    return (ipMatch as IPSubnetwork).toString();
  }
  if (ipMatch instanceof IPMask) {
    return (ipMatch as IPMask).convertToSubnet()?.toString();
  }
  return (ipMatch.convertToMasks() || [])[0]?.convertToSubnet()?.toString();
}

export function getSubnets(cidr: string) {
  const [address, prefix] = cidr.split('/');
  if (isIPv4(address)) {
    const prefix4Int = Number(prefix || '32');
    const getMask = (prefix: number) => (IPv4MAX >> (BigInt(32) - BigInt(prefix))) << (BigInt(32) - BigInt(prefix));
    const bigInt = BigInt((new Address4(address)).bigInteger());

    const subnets = [];
    let startNetwork;
    if (prefix4Int < 8) {
      startNetwork = 0;
    }
    if (prefix4Int % 8 === 0) {
      return [];
    }
    startNetwork = bigInt & getMask(prefix4Int);
    const increment = BigInt(2) ** BigInt(32 - prefix4Int);
    const netCount = getNetworksCount(cidr);
    for (let netIndex = 0; netIndex < netCount; netIndex += 1) {
      const netAddr = Address4.fromBigInteger(startNetwork.toString()).correctForm();
      subnets.push(`${netAddr}/${prefix4Int}`);
      startNetwork += increment;
    }
    return subnets;
  }

  return [];
}

export function getNetworksCount(cidr: string) {
  const [address, prefix] = cidr.split('/');
  if (isIPv4(address)) {
    const prefix4Int = Number(prefix || '32');

    if (prefix4Int % 8 === 0) {
      return 0;
    }
    else if (prefix4Int < 8) {
      return 2 ** prefix4Int;
    }
    else if (prefix4Int < 16) {
      return 2 ** (prefix4Int - 8);
    }
    else if (prefix4Int < 24) {
      return 2 ** (prefix4Int - 16);
    }
    else {
      return 2 ** (prefix4Int - 24);
    }
  }

  const prefix6Int = Number(prefix || '128');
  return prefix6Int <= 64 ? (BigInt(2) ** BigInt(64n - BigInt(prefix6Int))) : -1;
}

export function getIPNetworkType(address: string) {
  const results = [];
  for (const [addr, info] of (isIPv4(address) ? _ipv4Registry : _ipv6Registry).entries()) {
    const found = containsCidr([`${addr}/${Number(info[0])}`], address);
    if (found) {
      results.unshift(info[1]);
    }
  }
  return results.length === 0 ? 'Public' : results[0]?.toString();
}

export function toARPA(address: string) {
  if (isIPv4(address)) {
    const bigInt = BigInt((new Address4(address)).bigInteger());
    const reverseIP = (
      [(bigInt & BigInt(255)), (bigInt >> BigInt(8) & BigInt(255)),
        (bigInt >> BigInt(16) & BigInt(255)),
        (bigInt >> BigInt(24) & BigInt(255)),
      ].join('.')
    );
    return `${reverseIP}.in-addr.arpa`;
  }

  return (new Address6(address)).reverseForm();
}

export function toIPv4MappedAddress(address: string) {
  if (!isIPv4(address)) {
    return '';
  }

  const hexIP = (new Address4(address)).toHex().replace(/:/g, '');
  return `::ffff:${hexIP.substring(0, 4)}:${hexIP.substring(4)}`;
}

export function toIPv4MappedAddressDecimal(address: string) {
  if (!isIPv4(address)) {
    return '';
  }

  return `::ffff:${address}`;
}

export function to6to4Prefix(address: string) {
  if (!isIPv4(address)) {
    return '';
  }

  const hexIP = (new Address4(address)).toHex();
  return `2002:${hexIP.substring(0, 4)}:${hexIP.substring(4)}::/48`;
}

export function toMicrosoftTranscription(address: string) {
  if (!isIPv4(address)) {
    return '';
  }

  return (new Address6(address)).microsoftTranscription();
}
