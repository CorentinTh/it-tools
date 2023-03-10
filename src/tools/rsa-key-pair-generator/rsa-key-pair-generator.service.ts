import { pki } from 'node-forge';

export { generateKeyPair };

function generateRawPairs({ bits = 2048 }) {
  return new Promise<pki.rsa.KeyPair>((resolve, reject) =>
    pki.rsa.generateKeyPair({ bits }, (err, keyPair) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(keyPair);
    }),
  );
}

async function generateKeyPair(config: { bits?: number } = {}) {
  const { privateKey, publicKey } = await generateRawPairs(config);

  return {
    publicKeyPem: pki.publicKeyToPem(publicKey),
    privateKeyPem: pki.privateKeyToPem(privateKey),
  };
}
