import { pki } from 'node-forge';

export { generateKeyPair };

function generateKeyPair() {
  const { privateKey, publicKey } = pki.ed25519.generateKeyPair();

  console.log({ privateKey, publicKey });

  return {
    publicKeyPem: pki.publicKeyToPem(publicKey),
    privateKeyPem: pki.privateKeyToPem(privateKey),
  };
}
