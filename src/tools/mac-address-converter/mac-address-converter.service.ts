function convertMac(mac: string, group: number = 2, char: string = ':'): string {
  mac = mac.replace(/[\W_]+/g, '');
  return mac.match(new RegExp(`.{1,${group}}`, 'g'))?.join(char) || '';
}

function convertMacToEUI64(mac: string, ipv6: boolean) {
  const macIETF = convertMac(mac);
  // Split the MAC address into an array of hex values
  const macArray = macIETF.split(':').map(hex => Number.parseInt(hex, 16));

  // For IPv6, invert the 7th bit of the first byte
  if (ipv6) {
    macArray[0] ^= 0x02;
  }

  // Insert FFFE in the middle
  const eui64Array = [
    macArray[0], macArray[1], macArray[2],
    0xFF, 0xFE,
    macArray[3], macArray[4], macArray[5],
  ];

  // Convert the array to a colon-separated string
  const eui64 = eui64Array.map(byte => byte.toString(16).padStart(2, '0')).join(':');

  // Group into IPv6 EUI-64 format (XXXX:XXFF:FEXX:XXXX)
  return eui64.replace(/:/g, '').match(/.{1,4}/g)!.join(':');
}

export function convertMacToEUI64CanonicalIETF(mac: string, ipv6: boolean) {
  return convertMac(convertMacToEUI64(mac, ipv6).toLocaleLowerCase());
}
export function convertMacToEUI64CanonicalIEEE(mac: string, ipv6: boolean) {
  return convertMac(convertMacToEUI64(mac, ipv6).toLocaleUpperCase(), 2, '-');
}
export function convertMacToEUI64CISCO(mac: string, ipv6: boolean) {
  return convertMac(convertMacToEUI64(mac, ipv6).toLocaleLowerCase(), 4, '.');
}
export function convertMacToLinkLocalIPv6(mac: string) {
  return `:fe80::${convertMac(convertMacToEUI64(mac, true).toLocaleLowerCase(), 4, ':').replace(/^0/g, '')}`;
}

export function convertMacToNumber(mac: string) {
  mac = mac.replace(/[\W_]+/g, '');
  return Number.parseInt(mac, 16);
}

export function convertMacCanonicalIETF(mac: string): string {
  return convertMac(mac.toLocaleLowerCase());
};
export function convertMacCanonical(mac: string): string {
  return convertMac(mac, 2, '.');
};
export function convertMacCanonicalIEEE(mac: string): string {
  return convertMac(mac.toLocaleUpperCase(), 2, '-');
};
export function convertMacCISCO(mac: string): string {
  return convertMac(mac.toLocaleLowerCase(), 4, '.');
};
