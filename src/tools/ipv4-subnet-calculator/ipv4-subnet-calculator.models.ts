export { getIPClass };

function getIPClass({ ip }: { ip: string }) {
  const [firstOctet] = ip.split('.').map(Number);

  if (firstOctet < 128) {
    return 'A';
  }
  if (firstOctet > 127 && firstOctet < 192) {
    return 'B';
  }
  if (firstOctet > 191 && firstOctet < 224) {
    return 'C';
  }
  if (firstOctet > 223 && firstOctet < 240) {
    return 'D';
  }
  if (firstOctet > 239 && firstOctet < 256) {
    return 'E';
  }

  return undefined;
}
