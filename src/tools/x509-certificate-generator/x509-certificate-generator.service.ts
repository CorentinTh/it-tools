import { md, pki } from 'node-forge';
import { v4 as uuidv4 } from 'uuid';

export interface X509CertificateOptions {
  commonName: string
  country: string
  stateOrProvince?: string
  locality?: string
  organization?: string
  organizationalUnit?: string
  email?: string
  date: [string, string]
}

export interface X509CertificateResult {
  certificate: string
  privateKey: string
}

function getUuid(): string {
  return uuidv4().replace(/-/g, '');
}

export function generateX509(options: X509CertificateOptions): X509CertificateResult {
  const {
    commonName,
    country,
    stateOrProvince,
    locality,
    organization,
    organizationalUnit,
    email,
    date: [startDate, endDate],
  } = options;

  // Generate RSA key pair, 2048 bits
  const keys = pki.rsa.generateKeyPair(2048);

  // Create a new X.509 certificate
  const cert = pki.createCertificate();
  cert.publicKey = keys.publicKey;

  // Set certificate serial number using UUID
  cert.serialNumber = getUuid();

  // Set certificate validity period
  cert.validity.notBefore = new Date(startDate);
  cert.validity.notAfter = new Date(endDate);

  // Define certificate subject attributes
  const attrs: pki.CertificateField[] = [
    {
      name: 'countryName',
      value: country,
    },
    {
      shortName: 'ST',
      value: stateOrProvince || '',
    },
    {
      name: 'localityName',
      value: locality || '',
    },
    {
      name: 'organizationName',
      value: organization || '',
    },
    {
      shortName: 'OU',
      value: organizationalUnit || '',
    },
  ];

  // Handle multiple domains in commonName (comma-separated)
  const domainList = commonName.split(',').map(item => item.trim());
  domainList.forEach((domain) => {
    attrs.push({
      name: 'commonName',
      value: domain,
    });
  });

  // Set certificate subject and issuer
  cert.setSubject(attrs);
  cert.setIssuer(attrs);

  // Build Subject Alternative Names (SAN)
  const altNames: Array<{ type: number; value: string }> = [];
  if (email) {
    altNames.push({ type: 1, value: email }); // 1: Email
  }

  domainList.forEach((domain) => {
    // Check if it's an IP address (contains only digits and dots, and has 4 parts)
    if (/\d+/.test(domain.replace(/\./g, '')) && domain.split('.').length === 4) {
      altNames.push({ type: 7, value: domain }); // 7: IP Address
    }
    else {
      altNames.push({ type: 2, value: domain }); // 2: DNS
    }
  });

  // Set certificate extensions
  cert.setExtensions([
    {
      name: 'basicConstraints',
      cA: true,
    },
    {
      name: 'subjectAltName',
      altNames,
    },
  ]);

  // Self-sign the certificate with SHA256
  cert.sign(keys.privateKey, md.sha256.create());

  // Convert to PEM format
  const pem = {
    privateKey: pki.privateKeyToPem(keys.privateKey),
    certificate: pki.certificateToPem(cert),
  };

  return pem;
}
