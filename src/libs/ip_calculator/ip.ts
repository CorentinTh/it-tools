/* eslint-disable no-labels */
/* eslint-disable no-restricted-syntax */

const IPv4MAX = (BigInt(2) ** BigInt(32)) - BigInt(1);
const IPv6MAX = (BigInt(2) ** BigInt(128)) - BigInt(1);

/**
* Represents a single IP address v4 or v6.
* @class IP
* @param {string} address
* host = new IP("184.170.96.196");
* @return {object} -> IP{address:"184.170.96.196", version: 4, integer: 0, short: 0}
*/

export default class IP {
  integer: bigint;
  short: string;
  version: number;
  address: string;
  /**
    * @constructor
    */
  constructor(address: string) {
    this.integer = 0n;
    this.short = '';
    this.version = this._checkVersion(address);
    this.address = this._checkAddress(address, this.version);
    this.toInteger();
  }

  // Public methods

  /**
    * toInteger - Converts dotquad or hextet IP to integer
    * @return {BigInt} -> 2130706432
    */
  toInteger() {
    let bigInt;
    if (this.version === 4) {
      const splittedAddr = this.address.split('.').reverse();
      bigInt = splittedAddr.reduce((bigInt, octet, index) => {
        return (Number(octet) * 256 ** index + bigInt
        );
      }, 0);
    }
    else {
      const joinedAddr = this.address.split(':').join('');
      bigInt = BigInt(`0x${joinedAddr}`);
    }
    this.integer = BigInt(bigInt);
    return BigInt(bigInt);
  }

  /**
    * toDottedNotation - Converts big integer IP to full dotquad or hextet representation
    * @param {bigint} bigInt
    * @return {string} -> "184.170.96.196"
    */
  toDottedNotation(bigInt: bigint) {
    if (this.version === 4) {
      return (
        [(bigInt >> BigInt(24) & BigInt(255)), (bigInt >> BigInt(16) & BigInt(255)),
          (bigInt >> BigInt(8) & BigInt(255)),
          (bigInt & BigInt(255)),
        ].join('.')
      );
    }
    else {
      let hex = bigInt.toString(16);
      const groups = [];
      while (hex.length < 32) {
        hex = `0${hex}`;
      }
      for (let i = 0; i < 8; i++) {
        groups.push(hex.slice(i * 4, (i + 1) * 4));
      }
      return groups.join(':');
    }
  }

  toARPA() {
    if (this.version === 6) {
      return '';
    }

    const bigInt = this.integer;
    const reverseIP = (
      [(bigInt & BigInt(255)), (bigInt >> BigInt(8) & BigInt(255)),
        (bigInt >> BigInt(16) & BigInt(255)),
        (bigInt >> BigInt(24) & BigInt(255)),
      ].join('.')
    );
    return `${reverseIP}.in-addr.arpa`;
  }

  toIPv4MappedAddress() {
    if (this.version === 6) {
      return '';
    }

    const hexIP = this.toHEX(true);
    return `::ffff:${hexIP.substring(0, 4)}:${hexIP.substring(4)}`;
  }

  toIPv4MappedAddressDecimal() {
    if (this.version === 6) {
      return '';
    }

    return `::ffff:${this.toDottedNotation(this.integer)}`;
  }

  to6to4Prefix() {
    if (this.version === 6) {
      return '';
    }

    const hexIP = this.toHEX(true);
    return `2002:${hexIP.substring(0, 4)}:${hexIP.substring(4)}::/48`;
  }

  /**
    * toBinary - Converts decimal IP to full-length binary representation.
    * @return {string} -> 01111111000000000000000000000001
    */
  toBinary() {
    let binary = this.integer.toString(2);
    const markLen = this.version === 4 ? 32 : 128;

    if (binary.length < markLen) {
      while (binary.length < markLen) {
        binary = `0${binary}`;
      }
    }
    return binary;
  }

  /**
    * toHEX - Converts both IP versions to hexadecimal representation.
    * @return {string} -> 7f000001
    */
  toHEX(pad: boolean = false) {
    let hex = this.integer.toString(16);
    if (!pad) {
      return hex;
    }
    const markLen = this.version === 4 ? 8 : 24;

    if (hex.length < markLen) {
      while (hex.length < markLen) {
        hex = `0${hex}`;
      }
    }
    return hex;
  }

  /**
    * toCompressed - Compress an IP address to its shortest possible form.
    * IP('127.1.0.0').toCompressed
    * @return {string} -> "127.1"
    */
  toCompressed(addr: string, ver: number) {
    if (ver === 4) {
      const splittedAddr = addr.split('.');
      const sRange = [[1, 3], [2, 2], [3, 1], [0, 0]];

      for (let i = splittedAddr.length - 1; i >= 0; i--) {
        if (splittedAddr[i] === '0') {
          continue;
        }
        else {
          splittedAddr.splice(sRange[i][0], sRange[i][1]);
          this.short = splittedAddr.join('.');
          return this.short;
        }
      }
    }
    else {
      const splitted = addr.split(':');
      // finding longest zero group
      const [startOfLongest, longestLength] = _longestZerosGroup(splitted);
      // 'N/A' - _longestZerosGroup fn return in case if there is NO
      // '0000' blocks in address
      if (startOfLongest !== 'N/A' || longestLength !== 'N/A') {
        splitted.splice(Number(startOfLongest), Number(longestLength), '');
        if (startOfLongest === 0) {
          splitted.unshift('');
        }
        if (Number(startOfLongest) + Number(longestLength) === 8) {
          splitted.push('');
        }
      }

      // removing single '0000' blocks and leading zeros
      for (let i = 0; i < splitted.length; i++) {
        if (splitted[i] === '0000') {
          splitted.splice(i, 1, '0');
        }

        loopStr:
        for (let j = 0; j < splitted[i].length; j++) {
          if (splitted[i][j] === '0' && splitted[i] !== '0') {
            splitted[i] = splitted[i].substring(j + 1);
            j--;
            continue;
          }
          else {
            break loopStr;
          }
        }
      }
      this.short = splitted.join(':');
      return this.short;
    }
  }

  // Private methods

  /**
    * checkVersion - Determins this IP version.
    * @private
    * @param {string} addr
    * @return {number}  -> 4 or 6
    */
  _checkVersion(addr: string) {
    // matches all possible chars in both versions of IP
    const reGen = /^[0-9a-f.:]+$/i;
    if (reGen.test(addr)) {
      // checks if there is .. and more or whole IP is just a dot
      const reDots = /\.{2,}|^\.{1}$/;
      // checks if there is ::: and more or whole IP is just a colon
      const reColon = /:{3,}|^:{1}$/;
      // checks if there is only digits in integer IP
      const reNum = /^[0-9]+$/;

      if (reNum.test(addr)) {
        const parsedAddr = BigInt(addr);
        if (parsedAddr > IPv6MAX || parsedAddr <= 0) {
          throw new Error('Tips: IP address cant be bigger than 2 to the 128-th power or negative number');
        }
        else if (parsedAddr <= IPv4MAX) {
          return 4;
        }
        else if (parsedAddr > IPv4MAX) {
          return 6;
        }
      }
      else if (addr.includes('.') && !reDots.test(addr)) {
        return 4;
      }
      else if (addr.includes(':') && !reColon.test(addr)) {
        return 6;
      }
    }
    throw new Error('Tips: Please, enter a valid IP address (Like "127.1.0.0", long integer, short or long IPv6)');
  }

  /**
    * checkAddress - Validates this IP address.
    * @private
    * @return {string} as a valid address
    */
  _checkAddress(addr: string, v: number) {
    const reNum = /^[0-9]+$/;
    if (reNum.test(addr)) {
      this.integer = BigInt(addr);
      return this.toDottedNotation(this.integer);
    }

    const splittedAddr = addr.split(v === 4 ? '.' : ':');

    if (v === 6 && splittedAddr.length < 8) {
      const dbColon = (addr.match(/::/g) || []).length;
      if (dbColon !== 1) {
        throw new Error('Tips: Please, enter a valid IP address (Like "127.1.0.0", long integer, short or long IPv6)');
      }
    }

    if ((v === 4 ? this._isIPv4 : this._isIPv6).call(this, splittedAddr)) { // TODO: make ifs more readable
      if (splittedAddr.length === (v === 4 ? 4 : 8) && this.short === '') {
        return addr;
      }
      else {
        return this._toRepresentation(splittedAddr);
      }
    }
    else {
      throw new Error('Tips: Please, enter a valid IP address (Like "127.1.0.0", long integer, short or long IPv6)');
    }
  }

  /**
    * _isIPv6 - Validates IPv6.
    * @private
    * @return {boolean} whether splitted address is valid IPv6 or not
    */
  _isIPv6(splittedAddr: string[]) {
    if (splittedAddr.length <= 8) {
      let checked = false;
      const [isShort, cleanedAddr] = this._isShort(splittedAddr);

      const regex = /^[0-9a-f]{1,4}$/i;
      const isValid = function (hextet: string) {
        return regex.test(hextet);
      };
      checked = (cleanedAddr as string[]).every(isValid);

      if (checked && isShort) {
        this.short = splittedAddr.join(':');
      }
      return checked;
    }
    else {
      throw new Error('Tips: IPv6 cannot contain more than 8 bytes');
    }
  }

  /**
    * _isIPv4 - Validates IPv4.
    * @private
    * @return {boolean} whether splitted address is valid IPv4 or not
    */
  _isIPv4(splittedAddr: string[]) {
    if (splittedAddr.length <= 4) {
      if (splittedAddr.length < 4) {
        this.short = splittedAddr.join('.');
      }
      const isValid = function (octet: string) {
        return (!!((Number(octet) <= 255 && Number(octet) >= 0)));
      };
      return splittedAddr.every(isValid);
    }
    else {
      throw new Error('Tips: IPv4 cannot contain more than 4 bytes');
    }
  }

  /**
     * _isShort - checks if IPv6 addres was compressed like this "234:f:34:34:1:1:2:2" or like "1234::1234:1234" and removes empty strings for future validation
     * @private
     * @param  {array} splittedAddr
     * @return {array} with both results boolean and cleaned array
     */
  _isShort(splittedAddr: string[]) {
    let isShort = false;
    const cleanedAddr = [...splittedAddr];
    for (let i = 0; i < cleanedAddr.length; i++) {
      if (cleanedAddr[i].length === 0) {
        cleanedAddr.splice(i, 1);
        isShort = true;
        i--; // code  chunk similar to toCompressed method
        // for addr '::1' can happen that there are 2 empty strings
        // together, so by i-- we check every el of array but not next but one
      }
      else if (cleanedAddr[i].length < 4) {
        isShort = true;
      }
    }
    return [isShort, cleanedAddr];
  }

  /**
    * toRepresentation - Converts short version to canonical representation of IP.
    * IP('::1').address
    * @private
    * @param  {array} splittedAddr
    * @return {string} -> "0000:0000:0000:0000:0000:0000:0000:0001"
    */
  _toRepresentation(splittedAddr: string[]) {
    if (this.version === 4) {
      for (let i = 0; i <= 4; i++) {
        if (splittedAddr[i] === '') {
          let missOcts = 5 - splittedAddr.length;
          let flag = true;
          while (missOcts > 0) {
            if (flag) {
              splittedAddr.splice(i, 1, '0');
              missOcts--;
              flag = false;
            }
            else {
              splittedAddr.splice(i, 0, '0');
              missOcts--;
            }
          }
        }
      }
      while (splittedAddr.length < 4) {
        splittedAddr.push('0');
      }
      return splittedAddr.join('.');
    }
    else {
      for (let i = 0; i <= 8; i++) {
        if (splittedAddr[i] === '') {
          let missHex = 9 - splittedAddr.length;
          let flag = true;
          while (missHex > 0) {
            if (flag) {
              splittedAddr.splice(i, 1, '0000');
              missHex--;
              flag = false;
            }
            else {
              splittedAddr.splice(i, 0, '0000');
              missHex--;
            }
          }
        }
      }
      for (let i = 0; i < splittedAddr.length; i++) {
        if (splittedAddr[i].length < 4) {
          let missNum = 4 - splittedAddr[i].length;
          while (missNum > 0) {
            splittedAddr[i] = `0${splittedAddr[i]}`;
            missNum--;
          }
        }
      }
    }
    return splittedAddr.join(':');
  }
}// IP class end

/**
 * longestZerosGroup - Helper fn counting longest consecutive zeros for shortening IPv6
 * "0000:0000:0000:0000:0000:0000:0000:0001"
 * @private
 * @param  {array} zeros
 * @return {array} -> [0, 7]
 */
function _longestZerosGroup(splittedAddr: string[]) {
  let curr = 0;
  let currLongest = 0;
  let startOfLongest = 0;
  let hasZeros = false;

  while (curr < splittedAddr.length - 2) {
    const startOfRun = curr;
    while (curr < splittedAddr.length && splittedAddr[curr] === '0000') {
      hasZeros = true;
      curr++;
    }

    if ((curr - startOfRun) > currLongest) {
      startOfLongest = startOfRun;
      currLongest = curr - startOfRun;
    }
    curr++;
  }
  return hasZeros ? [startOfLongest, currLongest] : ['N/A', 'N/A'];
}
