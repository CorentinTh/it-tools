import { pki } from 'node-forge';
import workerScript from 'node-forge/dist/prime.worker.min?url';

export { generateKeyPair };

function generateRawPairs({ bits = 2048 }) {
  return new Promise<pki.rsa.KeyPair>((resolve, reject) =>
    pki.rsa.generateKeyPair({ bits, workerScript }, (err, keyPair) => {
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
