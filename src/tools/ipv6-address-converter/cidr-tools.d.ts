declare module 'cidr-tools' {
  type IPv4Address = string;
  type IPv4CIDR = string;
  type IPv6Address = string;
  type IPv6CIDR = string;
  
  type Network = IPv4Address | IPv4CIDR | IPv6Address | IPv6CIDR;
  type Networks = Network | Network[];
  
  type Parsed = {
    cidr: string;
    version: number;
    prefix: string;
    start: bigint;
    end: bigint;
    single: boolean;
  };
  
  type NormalizeOpts = {
    compress?: boolean;
    hexify?: boolean;
  };
  
  export function merge(networks: Networks): Network[];
  export function exclude(baseNetworks: Networks, excludeNetworks: Networks): Network[];
  export function expand(networks: Networks): Network[];
  export function overlap(networksA: Networks, networksB: Networks): boolean;
  export function normalize(cidr: Networks, opts?: NormalizeOpts): Networks;
  export function contains(networksA: Networks, networksB: Networks): boolean;
  export function parse(network: Network): Parsed;
  
  declare const _default: {
    merge: typeof merge;
    exclude: typeof exclude;
    expand: typeof expand;
    overlap: typeof overlap;
    normalize: typeof normalize;
    contains: typeof contains;
    parse: typeof parse;
  };
  export default _default;
}