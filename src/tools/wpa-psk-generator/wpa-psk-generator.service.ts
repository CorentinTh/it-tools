import CryptoJS from 'crypto-js';
import pbkdf2 from 'crypto-js/pbkdf2';

export function generateWpaPskRawKey(ssid: string, passphrase: string) {
  const psk = pbkdf2(passphrase, ssid, {
    keySize: 256 / 32,
    iterations: 4096,
    hasher: CryptoJS.algo.SHA1,
  }).toString(CryptoJS.enc.Hex);
  return {
    ssid,
    passphrase,
    psk,
  };
}
