declare module 'ip-bigint' {
  type IPInfo = {
    number: bigint; 
    version: number;
    ipv4mapped?: boolean;
    scopeid?:string;
  };
  type StringifyOptions = { 
    compress?:boolean;
    hexify?:boolean;
  };
  
  export function normalizeIp(ip: string, options: StringifyOptions = {compress = true, hexify = false} = {})
  export function stringifyIp(ip: IPInfo, options: StringifyOptions = {compress = true, hexify = false}): string;
  export function ipVersion(ip: string): number;
  export function parseIp(ip): IPInfo;
}