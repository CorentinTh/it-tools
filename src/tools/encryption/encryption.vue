<script setup lang="ts">
import { AES, RC4, Rabbit, TripleDES, enc } from 'crypto-js';
import { computedCatch } from '@/composable/computed/catchedComputed';

const algos = { AES, TripleDES, Rabbit, RC4 };

const cypherInput = ref('Lorem ipsum dolor sit amet');
const cypherAlgo = ref<keyof typeof algos>('AES');
const cypherSecret = ref('my secret key');
const cypherOutput = computed(() => algos[cypherAlgo.value].encrypt(cypherInput.value, cypherSecret.value).toString());

const decryptInput = ref('U2FsdGVkX1/EC3+6P5dbbkZ3e1kQ5o2yzuU0NHTjmrKnLBEwreV489Kr0DIB+uBs');
const decryptAlgo = ref<keyof typeof algos>('AES');
const decryptSecret = ref('my secret key');
const [decryptOutput, decryptError] = computedCatch(() => algos[decryptAlgo.value].decrypt(decryptInput.value, decryptSecret.value).toString(enc.Utf8), {
  defaultValue: '',
  defaultErrorMessage: 'Unable to decrypt your text',
});
</script>

<template>
  <div class="c-tool-workbench c-tool-stack">
    <c-alert title="Password-based compatibility format">
      This legacy route uses CryptoJS's password-based OpenSSL-compatible envelope: the field is UTF-8 password text, not raw key bytes, and the serialized value owns its random salt/derived IV. Raw hex/Base64 keys or caller-supplied IVs are deliberately not offered because this format cannot describe them unambiguously. Prefer AES-GCM Envelope for new authenticated encryption; TripleDES, Rabbit, and RC4 are legacy compatibility choices.
    </c-alert>
    <c-card title="Encrypt">
      <c-input-text
        v-model:value="cypherInput"
        label="Your text:"
        placeholder="The string to cypher"
        rows="8"
        raw-text multiline monospace
      />
      <div grid grid-cols-1 mt-3 gap-3 md:grid-cols-2>
        <c-input-text v-model:value="cypherSecret" label="Secret key" raw-text clearable />

        <c-select
          v-model:value="cypherAlgo"
          label="Encryption algorithm"
          :options="Object.keys(algos).map((value) => ({ label: value === 'AES' ? 'AES (password envelope; unauthenticated)' : `${value} (legacy)`, value }))"
        />
      </div>
      <c-input-text
        label="Your text encrypted:"
        :value="cypherOutput"
        rows="8"
        placeholder="Your string hash"
        multiline monospace readonly mt-5
      />
    </c-card>
    <c-card title="Decrypt">
      <c-input-text
        v-model:value="decryptInput"
        label="Your encrypted text:"
        placeholder="The string to cypher"
        rows="8"
        multiline raw-text monospace
      />
      <div grid grid-cols-1 mt-3 gap-3 md:grid-cols-2>
        <c-input-text v-model:value="decryptSecret" label="Secret key" clearable raw-text />

        <c-select
          v-model:value="decryptAlgo"
          label="Encryption algorithm"
          :options="Object.keys(algos).map((value) => ({ label: value === 'AES' ? 'AES (password envelope; unauthenticated)' : `${value} (legacy)`, value }))"
        />
      </div>
      <c-alert v-if="decryptError" type="error" mt-12 title="Error while decrypting">
        {{ decryptError }}
      </c-alert>
      <c-input-text
        v-else
        label="Your decrypted text:"
        :value="decryptOutput"
        placeholder="Your string hash"
        rows="8"
        multiline monospace readonly mt-5
      />
    </c-card>
  </div>
</template>
