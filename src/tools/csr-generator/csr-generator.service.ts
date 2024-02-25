import { pki } from 'node-forge';
import workerScript from 'node-forge/dist/prime.worker.min?url';

export { generateCSR };

function generateRSAPairs({ bits = 2048 }) {
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

async function generateCSR(config: {
  bits?: number
  password?: string
  commonName?: string
  countryName?: string
  city?: string
  state?: string
  organizationName?: string
  organizationalUnit?: string
  contactEmail?: string
} = {}): Promise<{
  publicKeyPem: string
  privateKeyPem: string
  csrPem: string
}> {
  const { privateKey, publicKey } = await generateRSAPairs(config);

  // create a certification request (CSR)
  const csr = pki.createCertificationRequest();
  csr.publicKey = publicKey;
  csr.setSubject([{
    name: 'CN',
    value: config.commonName,
  }, {
    name: 'C',
    value: config.countryName,
  }, {
    shortName: 'ST',
    value: config.state,
  }, {
    name: 'L',
    value: config.city,
  }, {
    name: 'O',
    value: config.organizationName,
  }, {
    shortName: 'OU',
    value: config.organizationalUnit,
  }, {
    name: 'EMAIL',
    value: config.contactEmail,
  }]);

  // sign certification request
  csr.sign(privateKey);

  // convert certification request to PEM-format
  const csrPem = pki.certificationRequestToPem(csr);

  const privateUnencryptedKeyPem = pki.privateKeyToPem(privateKey);

  return {
    csrPem,
    publicKeyPem: pki.publicKeyToPem(publicKey),
    privateKeyPem: config?.password
      ? pki.encryptRsaPrivateKey(privateKey, config?.password)
      : privateUnencryptedKeyPem,
  };
}
