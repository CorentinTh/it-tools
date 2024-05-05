<script setup lang="ts">
import { Buffer } from 'node:buffer';
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
import { useDownloadFileFromBase64 } from '@/composable/downloadBase64';

function buf2Hex(buffer: ArrayBuffer) { // buffer is an ArrayBuffer
  return [...new Uint8Array(buffer)]
    .map(x => x.toString(16).padStart(2, '0'))
    .join('');
}

const inputKeyOrCertificate = ref('');
const passphrase = ref('');
const fileInput = ref() as Ref<Buffer>;

async function onUpload(file: File) {
  if (file) {
    fileInput.value = Buffer.from(await file.arrayBuffer());
    inputKeyOrCertificate.value = '';
  }
}

const certificateX509DER = ref('');
const { download: downloadX509DER } = useDownloadFileFromBase64(
  {
    source: certificateX509DER,
    extension: 'der',
  });

function downloadX509DERFile() {
  if (certificateX509DER.value === '') {
    return;
  }

  try {
    downloadX509DER();
  }
  catch (_) {
    //
  }
}

interface LabelValue {
  label: string
  value: string
  multiline?: boolean
}
const parsedSections = computedAsync<LabelValue[]>(async () => {
  try {
    certificateX509DER.value = '';
    const onErrorReturnErrorMessage = (func: () => any) => {
      try {
        return func();
      }
      catch (e: any) {
        return e.toString();
      }
    };
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
    const inputKeyOrCertificateValue
      = inputKeyOrCertificate.value !== ''
        ? inputKeyOrCertificate.value
        : fileInput.value;
    const publicKey = canParse(inputKeyOrCertificateValue, parseKey) as Key;
    if (publicKey) {
      return [
        {
          label: 'Type: ',
          value: 'Public Key',
        },
        {
          label: 'Key Type: ',
          value: publicKey.type,
        },
        {
          label: 'Size: ',
          value: publicKey.size,
        },
        {
          label: 'Comment: ',
          value: publicKey.comment,
          multiline: true,
        },
        {
          label: 'Curve: ',
          value: publicKey.curve ?? 'none',
        },
        {
          label: 'Fingerprint (sha256): ',
          value: onErrorReturnErrorMessage(() => publicKey.fingerprint('sha256')),
          multiline: true,
        },
        {
          label: 'Fingerprint (sha512): ',
          value: onErrorReturnErrorMessage(() => publicKey.fingerprint('sha512')),
          multiline: true,
        },
      ] as LabelValue[];
    }

    const privateKey = canParse(inputKeyOrCertificateValue,
      value => parsePrivateKey(value, 'auto', { passphrase: passphrase.value })) as PrivateKey;
    if (privateKey) {
      return [
        {
          label: 'Type: ',
          value: 'Private Key',
        },
        {
          label: 'Key Type: ',
          value: privateKey.type,
        },
        {
          label: 'Size: ',
          value: privateKey.size,
        },
        {
          label: 'Comment: ',
          value: privateKey.comment,
          multiline: true,
        },
        {
          label: 'Curve: ',
          value: privateKey.curve,
        },
        {
          label: 'Fingerprint (sha256): ',
          value: onErrorReturnErrorMessage(() => privateKey.fingerprint('sha256')),
          multiline: true,
        },
        {
          label: 'Fingerprint (sha512): ',
          value: onErrorReturnErrorMessage(() => privateKey.fingerprint('sha512')),
          multiline: true,
        },
      ] as LabelValue[];
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
      try {
        certificateX509DER.value = Base64.fromUint8Array(cert.toBuffer('x509'));
      }
      catch {}

      return [
        {
          label: 'Type: ',
          value: 'Certificate',
        },
        {
          label: 'Subjects: ',
          value: cert.subjects.map(s => s.toString()).join('\n'),
          multiline: true,
        },
        {
          label: 'Issuer: ',
          value: cert.issuer.toString(),
          multiline: true,
        },
        {
          label: 'Subject Key: ',
          value: onErrorReturnErrorMessage(() => cert.subjectKey?.toString('ssh')),
          multiline: true,
        },
        {
          label: 'Subject Key Type: ',
          value: cert.subjectKey?.type,
        },
        {
          label: 'Subject Size: ',
          value: cert.subjectKey?.size,
        },
        {
          label: 'Subject Comment: ',
          value: cert.subjectKey?.comment,
          multiline: true,
        },
        {
          label: 'Subject Curve: ',
          value: cert.subjectKey?.curve ?? 'none',
        },
        {
          label: 'Issuer Key: ',
          value: onErrorReturnErrorMessage(() => cert.issuerKey?.toString('ssh')),
          multiline: true,
        },
        {
          label: 'Serial: ',
          value: buf2Hex(cert.serial),
        },
        {
          label: 'Purposes: ',
          value: cert.purposes?.join(', '),
        },
        {
          label: 'Extensions: ',
          value: JSON.stringify(cert.getExtensions(), null, 2),
          multiline: true,
        },
        {
          label: 'Fingerprint (sha256): ',
          value: onErrorReturnErrorMessage(() => cert.fingerprint('sha256')),
          multiline: true,
        },
        {
          label: 'Fingerprint (sha512): ',
          value: onErrorReturnErrorMessage(() => cert.fingerprint('sha512')),
          multiline: true,
        },
        {
          label: 'Certificate (pem): ',
          value: onErrorReturnErrorMessage(() => cert.toString('pem')),
          multiline: true,
        },
      ] as LabelValue[];
    }

    const csr = canParse(inputKeyOrCertificateValue, (value) => {
      return forge.pki.certificationRequestFromPem(value.toString(), true, false);
    }) as forge.pki.Certificate;
    if (csr) {
      return [
        {
          label: 'Type: ',
          value: 'Certificate Signing Request',
        },
        {
          label: 'Subject: ',
          value: csr.subject.attributes.map(a => JSON.stringify(a, null, 2)).join('\n'),
          multiline: true,
        },
        {
          label: 'Issuer: ',
          value: csr.issuer?.toString(),
          multiline: true,
        },
        {
          label: 'Validity: ',
          value: JSON.stringify(csr.validity, null, 2),
        },
        {
          label: 'Signature: ',
          value: csr.signature,
        },
        {
          label: 'Signature Oid: ',
          value: csr.signatureOid?.toString(),
        },
        {
          label: 'Signature parameters: ',
          value: JSON.stringify(csr.signatureParameters, null, 2),
        },
        {
          label: 'Signing info: ',
          value: JSON.stringify(csr.siginfo, null, 2),
        },
        {
          label: 'Serial: ',
          value: csr.serialNumber?.toString(),
        },
        {
          label: 'Extensions: ',
          value: JSON.stringify(csr.extensions, null, 2),
          multiline: true,
        },
        {
          label: 'Public Key: ',
          value: onErrorReturnErrorMessage(() => forge.pki.publicKeyToPem(csr.publicKey)),
          multiline: true,
        },
        {
          label: 'Public Key Fingerprint:',
          value: onErrorReturnErrorMessage(() => forge.pki.getPublicKeyFingerprint(csr.publicKey)?.toHex()),
          multiline: true,
        },
      ] as LabelValue[];
    }

    const fingerprint = canParse(inputKeyOrCertificateValue, value => parseFingerprint(value.toString())) as Fingerprint;
    if (fingerprint) {
      return [
        {
          label: 'Type: ',
          value: 'Fingerprint',
        },
        {
          label: 'Fingerprint (hex): ',
          value: fingerprint.toString('hex'),
        },
        {
          label: 'Fingerprint (base64): ',
          value: fingerprint.toString('base64'),
        },
      ] as LabelValue[];
    }

    const pgpPrivateKey = await canParseAsync(inputKeyOrCertificateValue, value => openpgp.readPrivateKey({ armoredKey: value.toString() })) as openpgp.Key;
    if (pgpPrivateKey) {
      return [
        {
          label: 'Type: ',
          value: 'PGP Private Key',
        },
        {
          label: 'Creation Time: ',
          value: pgpPrivateKey.getCreationTime().toString(),
        },
        {
          label: 'Expiration Time: ',
          value: (await pgpPrivateKey.getExpirationTime())?.toString() || '',
        },
        {
          label: 'Algorithm Info: ',
          value: JSON.stringify(pgpPrivateKey.getAlgorithmInfo()),
        },
        {
          label: 'Fingerprint: ',
          value: pgpPrivateKey.getFingerprint(),
        },
        {
          label: 'User ID(s): ',
          value: pgpPrivateKey.getUserIDs().join(', '),
        },
        {
          label: 'Key ID(s): ',
          value: pgpPrivateKey.getKeyIDs().map(k => k.toHex()).join(' ; '),
        },
      ] as LabelValue[];
    }

    const pgpPublicKey = await canParseAsync(inputKeyOrCertificateValue, value => openpgp.readKey({ armoredKey: value.toString() })) as openpgp.Key;
    if (pgpPublicKey) {
      return [
        {
          label: 'Type: ',
          value: 'PGP Public Key',
        },
        {
          label: 'Creation Time: ',
          value: pgpPublicKey.getCreationTime().toString(),
        },
        {
          label: 'Expiration Time: ',
          value: (await pgpPublicKey.getExpirationTime())?.toString() || '',
        },
        {
          label: 'Algorithm Info: ',
          value: JSON.stringify(pgpPublicKey.getAlgorithmInfo()),
        },
        {
          label: 'Fingerprint: ',
          value: pgpPublicKey.getFingerprint(),
        },
        {
          label: 'User ID(s): ',
          value: pgpPublicKey.getUserIDs().join(', '),
        },
        {
          label: 'Key ID(s): ',
          value: pgpPublicKey.getKeyIDs().map(k => k.toHex()).join(' ; '),
        },
      ] as LabelValue[];
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
      return [
        {
          label: 'Type: ',
          value: 'Signature',
        },
        {
          label: 'Fingerprint (asn1): ',
          value: signature.toString('asn1'),
        },
        {
          label: 'Fingerprint (ssh): ',
          value: signature.toString('ssh'),
        },
      ] as LabelValue[];
    }

    return [
      {
        label: 'Type: ',
        value: 'Unknown format or invalid passphrase',
      }];
  }
  catch (e: any) {
    return [
      {
        label: 'Error: ',
        value: e.toString(),
      }] as LabelValue[];
  }
});
</script>

<template>
  <div>
    <c-card>
      <c-file-upload title="Drag and drop a Certificate file here, or click to select a Certificate file" @file-upload="onUpload" />
      <!-- separator -->
      <div my-4 w-full flex items-center justify-center op-70>
        <div class="h-1px max-w-100px flex-1 bg-gray-300 op-50" />
        <div class="mx-2 text-gray-400">
          or
        </div>
        <div class="h-1px max-w-100px flex-1 bg-gray-300 op-50" />
      </div>
      <c-input-text
        v-model:value="inputKeyOrCertificate"
        label="Paste your Public Key / Private Key / Signature / Fingerprint / Certificate:"
        placeholder="Your Public Key / Private Key / Signature / Fingerprint / Certificate..."
        multiline
        rows="8"
      />
    </c-card>

    <c-input-text
      v-model:value="passphrase"
      label="Passphrase (for encrypted keys):"
      placeholder="Passphrase (for encrypted keys)..."
      type="password"
    />

    <n-divider />

    <input-copyable
      v-for="{ label, value, multiline } of parsedSections"
      :key="label"
      :label="label"
      label-position="left"
      label-width="100px"
      label-align="right"

      autosize mb-2
      :multiline="multiline"
      :value="value"
      placeholder="Not Set"
    />

    <div v-if="certificateX509DER !== ''" flex justify-center>
      <c-button @click="downloadX509DERFile()">
        Download X509 DER certificate
      </c-button>
    </div>
  </div>
</template>
