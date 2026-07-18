import { pki } from 'node-forge';
import workerScript from 'node-forge/dist/prime.worker.min?url';

export { generateKeyPair };

interface GenerateKeyPairConfig {
  bits?: number
  signal?: AbortSignal
}

function getAbortReason(signal: AbortSignal) {
  return signal.reason ?? new DOMException('The key generation was aborted', 'AbortError');
}

function generateRawPairs({ bits = 2048, signal }: GenerateKeyPairConfig) {
  return new Promise<pki.rsa.KeyPair>((resolve, reject) => {
    let settled = false;

    const handleAbort = () => {
      if (settled || !signal) {
        return;
      }

      settled = true;
      reject(getAbortReason(signal));
    };

    if (signal?.aborted) {
      handleAbort();
      return;
    }

    signal?.addEventListener('abort', handleAbort, { once: true });

    pki.rsa.generateKeyPair({ bits, workerScript }, (err, keyPair) => {
      if (settled) {
        return;
      }

      settled = true;
      signal?.removeEventListener('abort', handleAbort);

      if (err) {
        reject(err);
        return;
      }

      resolve(keyPair);
    });
  });
}

async function generateKeyPair(config: GenerateKeyPairConfig = {}) {
  const { privateKey, publicKey } = await generateRawPairs(config);

  return {
    publicKeyPem: pki.publicKeyToPem(publicKey),
    privateKeyPem: pki.privateKeyToPem(privateKey),
  };
}
