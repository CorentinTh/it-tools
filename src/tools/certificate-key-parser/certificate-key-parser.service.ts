import type { Buffer } from 'node:buffer';
import {
  parseCertificate, parseFingerprint,
  parseKey,
  parsePrivateKey,
  parseSignature,
} from 'sshpk';
import type {
  AlgorithmType,
  Certificate,
  CertificateFormat,
  Fingerprint,
  Key,
  PrivateKey, Signature, SignatureFormatType,
} from 'sshpk';
import { Base64 } from 'js-base64';
import * as openpgp from 'openpgp';
import * as forge from 'node-forge';
import { type LabelValue, getCSRLabelValues, getCertificateLabelValues, getFingerprintLabelValues, getPGPPrivateKeyLabelValuesAsync, getPGPPublicKeyLabelValuesAsync, getPrivateKeyLabelValues, getPublicKeyLabelValues, getSignatureLabelValues } from './certificate-key-parser.infos';

export async function getKeyOrCertificateInfosAsync(keyOrCertificateValue: string | Buffer, passphrase: string) {
  try {
    const canParse = (value: string | Buffer, parseFunction: (value: string | Buffer) => any) => {
      try {
        return parseFunction(value);
      }
      catch {
        return null;
      }
    };
    const canParseAsync = async (value: string | Buffer, parseFunction: (value: string | Buffer) => Promise<any>) => {
      try {
        return await parseFunction(value);
      }
      catch {
        return null;
      }
    };

    const inputKeyOrCertificateValue = (typeof keyOrCertificateValue === 'string' ? keyOrCertificateValue?.trim() : keyOrCertificateValue);

    const privateKey = canParse(inputKeyOrCertificateValue,
      value => parsePrivateKey(value, 'auto', { passphrase })) as PrivateKey;
    if (privateKey) {
      return {
        values: getPrivateKeyLabelValues(privateKey),
      };
    }

    const publicKey = canParse(inputKeyOrCertificateValue, parseKey) as Key;
    if (publicKey) {
      return { values: getPublicKeyLabelValues(publicKey) };
    }

    const pgpPrivateKey = await canParseAsync(inputKeyOrCertificateValue, value => openpgp.readPrivateKey({ armoredKey: value.toString() })) as openpgp.Key;
    if (pgpPrivateKey) {
      return { values: await getPGPPrivateKeyLabelValuesAsync(pgpPrivateKey) };
    }

    const pgpPublicKey = await canParseAsync(inputKeyOrCertificateValue, value => openpgp.readKey({ armoredKey: value.toString() })) as openpgp.Key;
    if (pgpPublicKey) {
      return { values: await getPGPPublicKeyLabelValuesAsync(pgpPublicKey) };
    }

    const cert = canParse(inputKeyOrCertificateValue, (value) => {
      for (const format of ['openssh', 'pem', 'x509']) {
        try {
          return parseCertificate(value, format as CertificateFormat);
        }
        catch {}
      }
      return null;
    }) as Certificate;
    if (cert) {
      let certificateX509DER = '';
      try {
        certificateX509DER = Base64.fromUint8Array(cert.toBuffer('x509'));
      }
      catch {}

      return { values: getCertificateLabelValues(cert), certificateX509DER };
    }

    const csr = canParse(inputKeyOrCertificateValue, (value) => {
      return forge.pki.certificationRequestFromPem(value.toString(), false, false);
    }) as forge.pki.Certificate;
    if (csr) {
      return { values: getCSRLabelValues(csr) };
    }

    const fingerprint = canParse(inputKeyOrCertificateValue, value => parseFingerprint(value.toString())) as Fingerprint;
    if (fingerprint) {
      return { values: getFingerprintLabelValues(fingerprint) };
    }

    const signature = canParse(inputKeyOrCertificateValue, (value) => {
      //
      for (const algo of ['dsa', 'rsa', 'ecdsa', 'ed25519']) {
        for (const format of ['asn1', 'ssh', 'raw']) {
          try {
            return parseSignature(value, algo as AlgorithmType, format as SignatureFormatType);
          }
          catch {}
        }
      }
      return null;
    }) as Signature;
    if (signature) {
      return { values: getSignatureLabelValues(signature) };
    }

    return {
      values: [
        {
          label: 'Type:',
          value: 'Unknown format or invalid passphrase',
        }],
    };
  }
  catch (e: any) {
    return {
      values: [
        {
          label: 'Error:',
          value: e.toString(),
        }] as LabelValue[],
    };
  }
}
