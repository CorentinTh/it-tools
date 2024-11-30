import type { Buffer } from 'node:buffer';
import {
  parseCertificate,
} from 'sshpk';

import type {
  Certificate,
  CertificateFormat,
} from 'sshpk';

import * as forge from 'node-forge';
import jks from 'jks-js';

function convertPKCS12ToPem(p12base64: forge.Bytes | forge.util.ByteBuffer, password: string) {
  const p12Asn1 = forge.asn1.fromDer(p12base64, false);
  const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, false, password);

  const pemKey = getKeyFromP12(p12);
  const { pemCertificate, commonName } = getCertificateFromP12(p12);

  return { pemKey, pemCertificate, commonName };
}

function getKeyFromP12(p12: forge.pkcs12.Pkcs12Pfx) {
  const keyData = p12.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag });
  let pkcs8Key = keyData[forge.pki.oids.pkcs8ShroudedKeyBag]![0];

  if (!pkcs8Key) {
    pkcs8Key = keyData[forge.pki.oids.keyBag]![0];
  }

  if (!pkcs8Key?.key) {
    throw new TypeError('Unable to get private key.');
  }

  return forge.pki.privateKeyToPem(pkcs8Key.key);
}

function getCertificateFromP12(p12: any) {
  const certData = p12.getBags({ bagType: forge.pki.oids.certBag });
  const certificate = certData[forge.pki.oids.certBag][0];

  const pemCertificate = forge.pki.certificateToPem(certificate.cert);
  const commonName = certificate.cert.subject.attributes[0].value;
  return { pemCertificate, commonName };
}

export function convertCertificate(
  inputKeyOrCertificateValue: string | Buffer,
  password: string) {
  const canParse = (value: any, parseFunction: (value: any) => any) => {
    try {
      return parseFunction(value);
    }
    catch (e: any) {
      // console.log(e);
      return null;
    }
  };

  const cert = canParse(inputKeyOrCertificateValue, (value) => {
    for (const format of ['openssh', 'pem', 'x509']) {
      try {
        return parseCertificate(value, format as CertificateFormat);
      }
      catch {
      }
    }
    return null;
  }) as Certificate;
  if (cert) {
    return [{
      alias: '#default',
      key: null,
      der: canParse(cert, c => c.toBuffer('x509')),
      pem: cert.toString('pem'),
    }];
  }

  const pkcs12 = canParse(inputKeyOrCertificateValue, (value) => {
    return convertPKCS12ToPem(forge.util.createBuffer(value, 'raw'), password);
  });
  if (pkcs12) {
    return [{
      alias: pkcs12.commonName,
      key: pkcs12.pemKey,
      der: canParse(pkcs12.pemCertificate, pemCert => parseCertificate(pemCert, 'pem').toBuffer('x509')),
      pem: pkcs12.pemCertificate,
    }];
  }

  const parsedJKS = canParse(inputKeyOrCertificateValue, (value) => {
    return jks.toPem(
      value,
      password,
    );
  });
  if (parsedJKS) {
    return Object.entries(parsedJKS).map(([k, v]) => {
      if (typeof v === 'string') {
        return {
          alias: k,
          key: null,
          der: canParse(v, pemCert => parseCertificate(pemCert, 'pem').toBuffer('x509')),
          pem: v,
        };
      }
      const { cert, key } = v as { cert: string; key: string };
      return {
        alias: k,
        key,
        der: canParse(cert, pemCert => parseCertificate(pemCert, 'pem').toBuffer('x509')),
        pem: cert,
      };
    });
  }

  return null;
}
