declare module 'is-ip' {
  
  /**
  Check if `string` is IPv6 or IPv4.
  
  @example
  ```
  import {isIP} from 'is-ip';
  
  isIP('1:2:3:4:5:6:7:8');
  //=> true
  
  isIP('192.168.0.1');
  //=> true
  ```
  */
  export function isIP(string: string): boolean; // eslint-disable-line @typescript-eslint/naming-convention
  
  /**
  Check if `string` is IPv6.
  
  @example
  ```
  import {isIPv6} from 'is-ip';
  
  isIPv6('1:2:3:4:5:6:7:8');
  //=> true
  ```
  */
  export function isIPv6(string: string): boolean; // eslint-disable-line @typescript-eslint/naming-convention
  
  /**
  Check if `string` is IPv4.
  
  @example
  ```
  import {isIPv4} from 'is-ip';
  
  isIPv4('192.168.0.1');
  //=> true
  ```
  */
  export function isIPv4(string: string): boolean; // eslint-disable-line @typescript-eslint/naming-convention
  
  /**
  @returns `6` if `string` is IPv6, `4` if `string` is IPv4, or `undefined` if `string` is neither.
  
  @example
  ```
  import {ipVersion} from 'is-ip';
  
  ipVersion('1:2:3:4:5:6:7:8');
  //=> 6
  
  ipVersion('192.168.0.1');
  //=> 4
  
  ipVersion('abc');
  //=> undefined
  ```
  */
  export function ipVersion(string: string): 6 | 4 | undefined;
}