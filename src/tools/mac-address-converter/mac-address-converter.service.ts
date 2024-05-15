function convertMac(mac: string, group: number = 2, char: string = ':'): string {
  mac = mac.replace(/[\W_]+/g, '');
  return mac.match(new RegExp(`.{1,${group}}`, 'g'))?.join(char) || '';
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
