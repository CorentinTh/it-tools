import IP from './ip';
import ipv4registry from './ipv4registry.json';
import ipv6registry from './ipv6registry.json';

const IPv4MAX = (BigInt(2) ** BigInt(32)) - BigInt(1);
const IPv6MAX = (BigInt(2) ** BigInt(128)) - BigInt(1);

// IP range specific information, see IANA allocations.
// http://www.iana.org/assignments/iana-ipv4-special-registry/iana-ipv4-special-registry.xhtml
const _ipv4Registry = new Map(ipv4registry.map(v => [v[0] as string, v[1]]));

// https://www.iana.org/assignments/iana-ipv6-special-registry/iana-ipv6-special-registry.xhtml
const _ipv6Registry = new Map(ipv6registry.map(v => [v[0] as string, v[1]]));

/**
* Network slice calculations.
* @class Network
* @param {string} address
* @param {integer} prefix
* host = new IP("127.128.99.3",8)
* @return {object} -> IP{address:"127.128.99.3", prefix: 8}
*/

export default class Network extends IP {
  prefix: bigint;
  /**
    * Extends IP class. Calls the parent class IP with the parameters passed to Network.
    * @constructor
    */
  constructor(address: string, prefix: number) {
    super(address);
    this.prefix = this._checkPrefix(prefix);
  }

  // Private methods

  /**
    * _checkPrefix - Returns this IP prefix and validates it
    * @private
    * @return {integer} -> prefix: 25n
    */
  _checkPrefix(prefix: number) {
    if (this.version === 4) {
      if (prefix > 0 && prefix <= 32) {
        return BigInt(prefix);
      }
    }
    else {
      if (prefix > 0 && prefix <= 128) {
        return BigInt(prefix);
      }
    }
    throw new Error('Tips: Invalid prefix');
  }

  // Public methods

  /**
    * printInfo - Shows IANA allocation information for the current IP address.
    * @return {string} ->LOOPBACK
    */
  printInfo() {
    const results = [];
    for (const [addr, info] of (this.version === 4 ? _ipv4Registry : _ipv6Registry).entries()) {
      const found = this.contains(this.address, addr, Number(info[0]));
      if (found) {
        results.unshift(info[1]);
      }
    }
    return results.length === 0 ? 'Unknown' : results[0];
  }

  /**
    * maskToInteger - Returns network mask as bigInt
    * @return {BigInt} -> 4278190080n
    */
  maskToInteger() {
    if (this.version === 4) {
      return (IPv4MAX >> (BigInt(32) - this.prefix)) << (BigInt(32) - this.prefix);
    }
    else {
      return (IPv6MAX >> (BigInt(128) - this.prefix)) << (BigInt(128) - this.prefix);
    }
  }

  /**
    * getMask - Returns mask from the prefix
    * @return {string} -> 255.255.0.0
    */
  getMask() {
    return this.toDottedNotation(this.maskToInteger());
  }

  /**
    * networkToInteger - Returns network as bigInt.
    * @return {BigInt} -> 21307064320
    */
  networkToInteger() {
    return this.toInteger() & this.maskToInteger();
  }

  /**
    * getNetwork - Returns network part of the address
    * @return {string} -> 127
    */
  getNetwork() {
    return this.toDottedNotation(this.networkToInteger());
  }

  /**
    * getBroadcast - Calculates broadcast.IPv6 doesn't have a broadcast
    * address, but it's used for other calculations such as Network.hostLast.
    * @return {string} -> 127.255.255.255
    */
  getBroadcast() {
    return this.version === 4
      ? this.toDottedNotation(this.broadcastToLong())
      : 'IPv6 doesnt have broadcast address';
  }

  /**
    * broadcastToLong - Returns broadcast as long.
    * @return {BigInt} ->2147483647
    */
  broadcastToLong() {
    if (this.version === 4) {
      return this.networkToInteger() | (IPv4MAX - this.maskToInteger());
    }
    else {
      return this.networkToInteger() | (IPv6MAX - this.maskToInteger());
    }
  }

  /**
    * hostFirst - Calculates first available host in this subnet.
    * @return {string} ->127.0.0.1
    */
  hostFirst() {
    const isSmall4 = this.version === 4 && this.prefix > BigInt(30);
    let first;

    if (this.version === 6) {
      first = this.getNetwork();
    }
    else if (isSmall4) {
      return 'N/A';
    }
    else {
      first = this.toDottedNotation(this.networkToInteger() + BigInt(1));
    }
    return this.toCompressed(first, this.version);
  }

  /**
    * hostLast - Calculates last available host in this subnet.
    * @return {string} ->127.255.255.255
    */
  hostLast() {
    const isLast4 = this.version === 4 && this.prefix === BigInt(32);
    const isLast6 = this.version === 6 && this.prefix === BigInt(128);
    const isPrev4 = this.version === 4 && this.prefix === BigInt(31);
    const isPrev6 = this.version === 6 && this.prefix === BigInt(127);
    let last;

    if (isLast4 || isLast6 || isPrev4) {
      return 'N/A';
    }
    else if (isPrev6) {
      last = this.address;
    }
    else if (this.version === 4) {
      last = this.toDottedNotation(this.broadcastToLong() - BigInt(1));
    }
    else {
      last = this.toDottedNotation(this.broadcastToLong());
    }
    return this.toCompressed(last, this.version);
  }

  /**
    * contains - Check if thisIP is part of the network
    * @param {string} thisIP
    * @param {string} otherIP
    * @param {number} prefix
    * @return {boolean}
    */
  contains(thisIP: string, otherIP: string, prefix: number) {
    const other = new Network(otherIP, prefix);
    const thisNetwork = this.networkToInteger();
    const otherNetwork = other.networkToInteger();
    const smaller = (thisNetwork <= otherNetwork)
            && (otherNetwork <= this.broadcastToLong());
    const bigger = (otherNetwork <= thisNetwork)
            && (thisNetwork <= other.broadcastToLong());
    return smaller || bigger;
  }

  /**
    * hostRange - Generates a range of usable host IP addresses within the network.
    * @return {array} -> ['127.0.0.1','127.255.255.255']
    */
  hostRange() {
    const range = [];
    range.push(this.hostFirst());
    range.push(this.hostLast());
    return range;
  }

  /**
    * networkSize - Returns number of ips within the network.
    * @return {number} -> 16777214
    */
  networkSize() {
    const size = BigInt(2) ** ((this.version === 4 ? BigInt(32) : BigInt(128)) - this.prefix);

    if (this.version === 4 && this.prefix < BigInt(30)) {
      return size - BigInt(2);
    }
    return size;
  }

  /**
    * networkCount - Returns number of network fo the prefix.
    * @return {number} -> 16777214
    */
  networkCount() {
    if (this.version === 4) {
      const [firstOctet] = this.address.split('.').map(Number);

      if (firstOctet < 128) {
        return 2 ** 7;
      }
      if (firstOctet > 127 && firstOctet < 192) {
        return 2 ** 14;
      }
      if (firstOctet > 191 && firstOctet < 224) {
        return 2 ** 21;
      }
      if (firstOctet > 223 && firstOctet < 240) {
        return -1;
      }
      if (firstOctet > 239 && firstOctet < 256) {
        return -1;
      }
    }

    return this.prefix <= 64 ? (BigInt(2) ** BigInt(64n - this.prefix)).toString() : '';
  }
}
