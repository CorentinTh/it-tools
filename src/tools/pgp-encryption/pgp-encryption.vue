<script setup lang="ts">
import * as openpgp from 'openpgp';
import { computedCatchAsync } from '@/composable/computed/catchedComputed';

const cryptInput = ref('');
const cryptPublicKey = ref('');
const cryptPrivateKey = ref('');
const cryptPrivateKeyPassphrase = ref('');
const [cryptOutput, cryptError] = computedCatchAsync(async () => {
  const publicKeyArmored = cryptPublicKey.value;
  const privateKeyArmored = cryptPrivateKey.value;
  const passphrase = cryptPrivateKeyPassphrase.value;
  const text = cryptInput.value;

  const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });

  const privateKey = privateKeyArmored !== ''
    ? (passphrase !== ''
        ? await openpgp.decryptKey({
          privateKey: await openpgp.readPrivateKey({ armoredKey: privateKeyArmored }),
          passphrase,
        })
        : await openpgp.readPrivateKey({ armoredKey: privateKeyArmored }))
    : undefined;

  return await openpgp.encrypt({
    message: await openpgp.createMessage({ text }),
    encryptionKeys: publicKey,
    signingKeys: privateKey,
  });
}, {
  defaultValue: '',
  defaultErrorMessage: 'Unable to encrypt your text',
});

const decryptInput = ref('');
const decryptPublicKey = ref('');
const decryptPrivateKey = ref('');
const decryptPrivateKeyPassphrase = ref('');
const [decryptOutput, decryptError] = computedCatchAsync(async () => {
  const publicKeyArmored = decryptPublicKey.value;
  const privateKeyArmored = decryptPrivateKey.value;
  const passphrase = decryptPrivateKeyPassphrase.value;
  const encrypted = decryptInput.value;

  const publicKey = publicKeyArmored !== '' ? await openpgp.readKey({ armoredKey: publicKeyArmored }) : undefined;

  const privateKey = passphrase !== ''
    ? await openpgp.decryptKey({
      privateKey: await openpgp.readPrivateKey({ armoredKey: privateKeyArmored }),
      passphrase,
    })
    : await openpgp.readPrivateKey({ armoredKey: privateKeyArmored });

  const message = await openpgp.readMessage({
    armoredMessage: encrypted, // parse armored message
  });
  const { data: decrypted, signatures } = await openpgp.decrypt({
    message,
    verificationKeys: publicKey, // optional
    decryptionKeys: privateKey,
  });
  if (signatures.length > 0) {
    try {
      await signatures[0].verified; // throws on invalid signature
    }
    catch (e: any) {
      return {
        decryptedText: decrypted,
        signatureError: `Signature could not be verified: ${e.toString()}`,
      };
    }
  }
  return {
    decryptedText: decrypted,
    signatureError: '',
  };
}, {
  defaultValue: { decryptedText: '', signatureError: '' },
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
        <div flex flex-1 flex-col gap-2>
          <c-input-text
            v-model:value="cryptPublicKey"
            label="Target public key:"
            placeholder="Target public key"
            rows="5"
            multiline raw-text monospace autosize flex-1
          />

          <details>
            <summary>Signing private key (optional)</summary>
            <c-input-text
              v-model:value="cryptPrivateKey"
              label="Your private key:"
              placeholder="The private key to use to sign message"
              rows="5"
              multiline raw-text monospace autosize flex-1
            />

            <c-input-text
              v-model:value="cryptPrivateKeyPassphrase"
              label="Your private key password:" clearable raw-text
            />
          </details>
        </div>
      </div>

      <c-alert
        v-if="cryptError && cryptPublicKey !== ''"
        type="error" mt-12 title="Error while encrypting"
      >
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

          <details>
            <summary>Signing public key (optional)</summary>

            <c-input-text
              v-model:value="decryptPublicKey"
              label="Sender public key:"
              placeholder="Sender public key"
              rows="5"
              multiline raw-text monospace autosize flex-1
            />
          </details>
        </div>
      </div>

      <c-alert v-if="decryptError && decryptPrivateKey !== ''" type="error" mt-3 title="Error while decrypting">
        {{ decryptError }}
      </c-alert>

      <c-alert v-if="decryptOutput?.signatureError !== ''" type="error" mt-3 title="Signature verification">
        {{ decryptOutput?.signatureError }}
      </c-alert>

      <n-form-item label="Your text decrypted:" mt-3>
        <TextareaCopyable
          :value="decryptOutput?.decryptedText || ''"
          rows="3"
          placeholder="Your string decrypted"
          multiline monospace readonly autosize mt-5
        />
      </n-form-item>
    </c-card>
  </div>
</template>
