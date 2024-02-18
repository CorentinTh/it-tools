import { pki } from 'node-forge';
import workerScript from 'node-forge/dist/prime.worker.min?url';
import sshpk from 'sshpk';

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

async function generateKeyPair(config: {
  bits?: number
  password?: string
  format?: sshpk.PrivateKeyFormatType
  comment?: string
} = {}) {
  const { privateKey, publicKey } = await generateRawPairs(config);

  const privateUnencryptedKeyPem = pki.privateKeyToPem(privateKey);

  if (config?.format === 'pem') {
    return {
      publicKey: pki.publicKeyToPem(publicKey),
      privateKey: config?.password
        ? pki.encryptRsaPrivateKey(privateKey, config?.password)
        : privateUnencryptedKeyPem,
    };
  }

  const privKey = sshpk.parsePrivateKey(privateUnencryptedKeyPem);
  privKey.comment = config?.comment;
  const pubFormat = config.format ?? 'ssh';
  let privFormat = config.format ?? 'ssh';
  if (privFormat === 'ssh') {
    privFormat = 'ssh-private';
  }
  const pubKey = privKey.toPublic();
  return {
    publicKey: pubKey.toString(pubFormat),
    privateKey: config?.password
      ? privKey.toString(privFormat,
        { passphrase: config?.password, comment: config?.comment },
      )
      : privKey.toString(privFormat, { comment: config?.comment }),
  };
}
