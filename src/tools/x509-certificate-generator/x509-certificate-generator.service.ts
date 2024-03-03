import { asn1, md, pki, random, util } from 'node-forge';
import workerScript from 'node-forge/dist/prime.worker.min?url';

export { generateSSLCertificate };

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

// a hexString is considered negative if it's most significant bit is 1
// because serial numbers use ones' complement notation
// this RFC in section 4.1.2.2 requires serial numbers to be positive
// http://www.ietf.org/rfc/rfc5280.txt
function toPositiveHex(hexString: string) {
  let mostSiginficativeHexAsInt = Number.parseInt(hexString[0], 16);
  if (mostSiginficativeHexAsInt < 8) {
    return hexString;
  }

  mostSiginficativeHexAsInt -= 8;
  return mostSiginficativeHexAsInt.toString() + hexString.substring(1);
}

async function generateSSLCertificate(config: {
  bits?: number
  password?: string
  commonName?: string
  countryName?: string
  city?: string
  state?: string
  organizationName?: string
  organizationalUnit?: string
  contactEmail?: string
  days?: number
} = {}): Promise<{
  fingerprint: string
  publicKeyPem: string
  privateKeyPem: string
  certificatePem: string
}> {
  const { privateKey, publicKey } = await generateRSAPairs(config);

  const cert = pki.createCertificate();

  cert.serialNumber = toPositiveHex(util.bytesToHex(random.getBytesSync(9))); // the serial number can be decimal or hex (if preceded by 0x)

  cert.validity.notBefore = new Date();
  cert.validity.notAfter = new Date();
  cert.validity.notAfter.setDate(cert.validity.notBefore.getDate() + (config.days || 365));

  const attrs = [{
    name: 'commonName',
    value: config.commonName,
  }, {
    name: 'countryName',
    value: config.countryName,
  }, {
    name: 'stateOrProvinceName',
    value: config.state,
  }, {
    name: 'localityName',
    value: config.city,
  }, {
    name: 'organizationName',
    value: config.organizationName,
  }, {
    name: 'organizationalUnitName',
    value: config.organizationalUnit,
  }, {
    name: 'emailAddress',
    value: config.contactEmail,
  }].filter(attr => attr.value !== null && attr.value?.trim() !== '');

  cert.setSubject(attrs);
  cert.setIssuer(attrs);

  cert.publicKey = publicKey;

  cert.setExtensions([{
    name: 'basicConstraints',
    cA: true,
  }, {
    name: 'keyUsage',
    keyCertSign: true,
    digitalSignature: true,
    nonRepudiation: true,
    keyEncipherment: true,
    dataEncipherment: true,
  }]);

  cert.sign(privateKey);

  const fingerprint = md.sha1
    .create()
    .update(asn1.toDer(pki.certificateToAsn1(cert)).getBytes())
    .digest()
    .toHex()
    .match(/.{2}/g)?.join(':') ?? '';

  const privateUnencryptedKeyPem = pki.privateKeyToPem(privateKey);

  return {
    fingerprint,
    certificatePem: pki.certificateToPem(cert),
    publicKeyPem: pki.publicKeyToPem(publicKey),
    privateKeyPem: config?.password
      ? pki.encryptRsaPrivateKey(privateKey, config?.password)
      : privateUnencryptedKeyPem,
  };
}
