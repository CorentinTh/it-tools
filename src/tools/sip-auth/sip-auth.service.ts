import { MD5 } from 'crypto-js';

export { getAuthHeaderCheckResult };

function getAuthHeaderCheckResult({ message, password }: { message: string; password: string }) {
  let calculatedHash;
  const method = extractComponent('^([A-Z]+) sip', message);
  const username = extractComponent('username="([^"]+)"', message);
  const realm = extractComponent('realm="([^"]+)"', message);
  const uri = extractComponent('uri="([^"]+)"', message);
  const nonce = extractComponent('[^c]nonce="([^"]+)"', message);
  const cnonce = extractComponent('cnonce="([^"]+)"', message);
  const nc = extractComponent('nc=([0-9a-f]+)', message);
  const qop = extractComponent('qop="?(auth|auth-int)"?', message);
  const response = extractComponent('response="([^"]+)"', message);
  const ha1 = MD5(`${username}:${realm}:${password}`).toString();
  const ha2 = MD5(`${method}:${uri}`).toString();
  if (qop.toLowerCase() === 'auth') {
    calculatedHash = MD5(`${ha1}:${nonce}:${nc}:${cnonce}:${qop}:${ha2}`).toString();
  }
  else {
    calculatedHash = MD5(`${ha1}:${nonce}:${cnonce}`).toString();
  }
  return (response === calculatedHash);
}

function extractComponent(regex: string, source: string): string {
  const processor = new RegExp(regex, 'i');
  const matchResult = processor.exec(source);
  if (matchResult !== null && matchResult.length > 1) {
    return matchResult[1];
  }
  else {
    return 'Not Found';
  }
}
