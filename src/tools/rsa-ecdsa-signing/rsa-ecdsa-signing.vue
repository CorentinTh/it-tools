<script setup lang="ts">
import sshpk from 'sshpk';
import { computedCatch } from '@/composable/computed/catchedComputed';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

const hashTypes = [
  'sha1', 'sha256', 'sha384', 'sha512', 'md5',
];

const verifyText = ref('');
const verifySignature = ref('');
const verifyPublicKey = ref('');
const [verifyOutput, verifyError] = computedCatch(() => {
  const publicKey = sshpk.parseKey(verifyPublicKey.value, 'auto');

  const v = publicKey.createVerify();
  v.update(verifyText.value);
  return v.verify(verifySignature.value);
}, {
  defaultValue: '',
  defaultErrorMessage: 'Unable to verify your text',
});

const signText = ref('');
const signPrivateKey = ref('');
const signPrivateKeyPassphrase = ref('');
const signHashType = ref('sha1');
const [signOutput, signError] = computedCatch(() => {
  const privateKey = sshpk.parsePrivateKey(signPrivateKey.value, 'auto', { passphrase: signPrivateKeyPassphrase.value });
  const s = privateKey.createSign(signHashType.value as sshpk.AlgorithmHashType);
  s.update(signText.value);
  const signature = s.sign();
  return {
    asn1: signature.toString('asn1'),
    ssh: signature.toString('ssh'),
  };
}, {
  defaultValue: {
    asn1: '',
    ssh: '',
  },
  defaultErrorMessage: 'Unable to sign your text',
});
</script>

<template>
  <div>
    <c-card title="Sign">
      <div>
        <c-input-text
          v-model:value="signText"
          label="Your text:"
          placeholder="The string to sign"
          rows="4"
          multiline raw-text monospace autosize flex-1
        />
        <c-select
          v-model:value="signHashType"
          label="Hash Type:"
          :options="hashTypes"
          placeholder="Select the hashing algorithm"
        />
        <div flex flex-1 flex-col gap-2>
          <c-input-text
            v-model:value="signPrivateKey"
            label="Your private key:"
            placeholder="The private key to use to sign message"
            rows="5"
            multiline raw-text monospace autosize flex-1
          />

          <c-input-text
            v-model:value="signPrivateKeyPassphrase"
            label="Your private key password:" clearable raw-text
          />
        </div>
      </div>

      <c-alert v-if="signError && signPrivateKey !== ''" type="error" mt-12 title="Error while signing">
        {{ signError }}
      </c-alert>

      <n-form-item label="ASN1 Signature:" mt-3>
        <TextareaCopyable
          :value="signOutput?.asn1 || ''"
          placeholder="ASN1 Signature"
          multiline monospace readonly autosize mt-5
        />
      </n-form-item>
      <n-form-item label="SSH Signature:" mt-3>
        <TextareaCopyable
          :value="signOutput?.ssh || ''"
          placeholder="SSG Signature"
          multiline monospace readonly autosize mt-5
        />
      </n-form-item>
    </c-card>

    <c-card title="Verify">
      <div>
        <c-input-text
          v-model:value="verifyText"
          label="Your text to verify:"
          placeholder="The string to verify"
          rows="4"
          multiline raw-text monospace autosize flex-1
        />

        <c-input-text
          v-model:value="verifySignature"
          label="Associated signature:"
          placeholder="Text signature"
          rows="4"
          multiline raw-text monospace autosize flex-1
        />

        <div flex flex-1 flex-col gap-2>
          <c-input-text
            v-model:value="verifyPublicKey"
            label="Public key:"
            placeholder="Public key"
            rows="5"
            multiline raw-text monospace autosize flex-1
          />
        </div>
      </div>

      <c-alert v-if="verifyError && verifyPublicKey !== ''" type="error" mt-12 title="Error while verifying">
        {{ verifyError }}
      </c-alert>
      <c-alert v-if="verifyOutput && verifyPublicKey !== ''" type="error" mt-12 title="Signature failed">
        Signature is NOT valid for the given text
      </c-alert>
      <n-alert v-if="!verifyOutput && verifyPublicKey !== ''" type="success" mt-12 title="Signature verified">
        Signature is valid for the given text
      </n-alert>
    </c-card>
  </div>
</template>
