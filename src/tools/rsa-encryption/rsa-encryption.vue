<script setup lang="ts">
import { md, pki } from 'node-forge';
import { Base64 } from 'js-base64';
import { computedCatchAsync } from '@/composable/computed/catchedComputed';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

const schemes = [
  { value: 'RSAES-PKCS1-V1_5', label: 'RSAES PKCS#1 v1.5' },
  { value: 'RSAES-OAEP', label: 'RSAES-OAEP' },
  { value: 'RSAES-OAEP/SHA-256', label: 'RSAES-OAEP/SHA-256' },
  { value: 'RSAES-OAEP/SHA-256/MGF1-SHA-1', label: 'RSAES-OAEP/SHA-256/MGF1-SHA-1 (RSA/ECB/OAEPWithSHA-256AndMGF1Padding)' },
];

const cryptInput = ref('');
const cryptScheme = ref('RSAES-PKCS1-V1_5');
const cryptPublicKey = ref('');
const [cryptOutput, cryptError] = computedCatchAsync(async () => {
  const publicKeyPEM = cryptPublicKey.value;
  const text = cryptInput.value;
  const scheme = cryptScheme.value;

  const publicKey = pki.publicKeyFromPem(publicKeyPEM);

  let encrypted;
  if (scheme === 'RSAES-PKCS1-V1_5') {
  // encrypt data with a public key using RSAES PKCS#1 v1.5
    encrypted = publicKey.encrypt(text, 'RSAES-PKCS1-V1_5');
  }
  else if (scheme === 'RSAES-OAEP') {
  // encrypt data with a public key using RSAES-OAEP
    encrypted = publicKey.encrypt(text, 'RSA-OAEP');
  }
  else if (scheme === 'RSAES-OAEP/SHA-256') {
  // encrypt data with a public key using RSAES-OAEP/SHA-256
    encrypted = publicKey.encrypt(text, 'RSA-OAEP', {
      md: md.sha256.create(),
    });
  }
  else if (scheme === 'RSAES-OAEP/SHA-256/MGF1-SHA-1') {
  // encrypt data with a public key using RSAES-OAEP/SHA-256/MGF1-SHA-1
  // compatible with Java's RSA/ECB/OAEPWithSHA-256AndMGF1Padding
    encrypted = publicKey.encrypt(text, 'RSA-OAEP', {
      md: md.sha256.create(),
      mgf1: {
        md: md.sha1.create(),
      },
    });
  }
  return Base64.encode(encrypted || '');
}, {
  defaultValue: '',
  defaultErrorMessage: 'Unable to encrypt your text',
});

const decryptInput = ref('');
const decryptScheme = ref('RSAES-PKCS1-V1_5');
const decryptPrivateKey = ref('');
const decryptPrivateKeyPassphrase = ref('');
const [decryptOutput, decryptError] = computedCatchAsync(async () => {
  const privateKeyPEM = decryptPrivateKey.value;
  const passphrase = decryptPrivateKeyPassphrase.value;
  const encrypted = Base64.decode(decryptInput.value);
  const scheme = decryptScheme.value;

  const privateKey = pki.decryptRsaPrivateKey(privateKeyPEM, passphrase);

  let decrypted;
  if (scheme === 'RSAES-PKCS1-V1_5') {
  // decrypt data with a private key using RSAES PKCS#1 v1.5
    decrypted = privateKey.decrypt(encrypted, 'RSAES-PKCS1-V1_5');
  }
  else if (scheme === 'RSAES-OAEP') {
  // decrypt data with a private key using RSAES-OAEP
    decrypted = privateKey.decrypt(encrypted, 'RSA-OAEP');
  }
  else if (scheme === 'RSAES-OAEP/SHA-256') {
  // decrypt data with a private key using RSAES-OAEP/SHA-256
    decrypted = privateKey.decrypt(encrypted, 'RSA-OAEP', {
      md: md.sha256.create(),
    });
  }
  else if (scheme === 'RSAES-OAEP/SHA-256/MGF1-SHA-1') {
  // decrypt data with a private key using RSAES-OAEP/SHA-256/MGF1-SHA-1
  // compatible with Java's RSA/ECB/OAEPWithSHA-256AndMGF1Padding
    decrypted = privateKey.decrypt(encrypted, 'RSA-OAEP', {
      md: md.sha256.create(),
      mgf1: {
        md: md.sha1.create(),
      },
    });
  }
  return decrypted;
}, {
  defaultValue: '',
  defaultErrorMessage: 'Unable to encrypt your text',
});
</script>

<template>
  <div>
    <c-card title="Encrypt">
      <div>
        <c-input-text
          v-model:value="cryptInput"
          label="Your text:"
          placeholder="The string to encrypt"
          rows="4"
          multiline raw-text monospace autosize flex-1
        />
        <c-select
          v-model:value="cryptScheme"
          label="Scheme:"
          :options="schemes"
          placeholder="Select the encryption scheme"
        />
        <div flex flex-1 flex-col gap-2>
          <c-input-text
            v-model:value="cryptPublicKey"
            label="Target public key:"
            placeholder="Target public key"
            rows="5"
            multiline raw-text monospace autosize flex-1
          />
        </div>
      </div>

      <c-alert v-if="cryptError && cryptPublicKey !== ''" type="error" mt-12 title="Error while encrypting">
        {{ cryptError }}
      </c-alert>

      <n-form-item label="Your text encrypted:" mt-3>
        <TextareaCopyable
          :value="cryptOutput || ''"
          rows="3"
          placeholder="Your string encrypted"
          multiline monospace readonly autosize mt-5
        />
      </n-form-item>
    </c-card>

    <c-card title="Decrypt">
      <div>
        <c-input-text
          v-model:value="decryptInput"
          label="Your PGP Message to decrypt:"
          placeholder="The string to decrypt"
          rows="4"
          multiline raw-text monospace autosize flex-1
        />

        <c-select
          v-model:value="decryptScheme"
          label="Scheme:"
          :options="schemes"
          placeholder="Select the encryption scheme"
        />

        <div flex flex-1 flex-col gap-2>
          <c-input-text
            v-model:value="decryptPrivateKey"
            label="Your private key:"
            placeholder="The private key to use to decrypt message"
            rows="5"
            multiline raw-text monospace autosize flex-1
          />

          <c-input-text
            v-model:value="decryptPrivateKeyPassphrase"
            label="Your private key password:" clearable raw-text
          />
        </div>
      </div>

      <c-alert v-if="decryptError && decryptPrivateKey !== ''" type="error" mt-12 title="Error while decrypting">
        {{ decryptError }}
      </c-alert>

      <n-form-item label="Your text decrypted:" mt-3>
        <TextareaCopyable
          :value="decryptOutput || ''"
          rows="3"
          placeholder="Your string decrypted"
          multiline monospace readonly autosize mt-5
        />
      </n-form-item>
    </c-card>
  </div>
</template>
