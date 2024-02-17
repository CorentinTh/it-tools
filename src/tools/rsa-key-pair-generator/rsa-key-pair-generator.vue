<script setup lang="ts">
import type sshpk from 'sshpk';
import { generateKeyPair } from './rsa-key-pair-generator.service';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { withDefaultOnErrorAsync } from '@/utils/defaults';
import { useValidation } from '@/composable/validation';
import { computedRefreshableAsync } from '@/composable/computedRefreshable';

const bits = ref(2048);
const comment = ref('');
const password = ref('');
const emptyCerts = { publicKey: '', privateKey: '' };

const format = useStorage('rsa-key-pair-generator:format', 'ssh');
const formatOptions = [
  { value: 'pem', label: 'PEM' },
  { value: 'pkcs1', label: 'PKCS#1' },
  { value: 'pkcs8', label: 'PKCS#8' },
  { value: 'ssh', label: 'OpenSSH Standard' },
  { value: 'openssh', label: 'OpenSSH New' },
  { value: 'putty', label: 'PuTTY' },
];

const supportsPassphrase = computed(() => format.value === 'pem' || format.value === 'ssh');

const { attrs: bitsValidationAttrs } = useValidation({
  source: bits,
  rules: [
    {
      message: 'Bits should be 256 <= bits <= 16384 and be a multiple of 8',
      validator: value => value >= 256 && value <= 16384 && value % 8 === 0,
    },
  ],
});

const [certs, refreshCerts] = computedRefreshableAsync(
  () => withDefaultOnErrorAsync(() => generateKeyPair({
    bits: bits.value,
    password: password.value,
    format: format.value as sshpk.PrivateKeyFormatType,
    comment: comment.value,
  }), emptyCerts),
  emptyCerts,
);
</script>

<template>
  <div>
    <n-space justify="space-between" mb-1>
      <c-select
        v-model:value="format"
        label-position="left"
        label="Format:"
        :options="formatOptions"
        placeholder="Select a key format"
      />

      <n-form-item label="Bits :" v-bind="bitsValidationAttrs as any" label-placement="left">
        <n-input-number v-model:value="bits" min="256" max="16384" step="8" />
      </n-form-item>
    </n-space>

    <div v-if="supportsPassphrase" mb-1>
      <n-form-item label="Passphrase :" label-placement="left">
        <n-input
          v-model:value="password"
          type="password"
          show-password-on="mousedown"
          placeholder="Passphrase"
        />
      </n-form-item>
    </div>

    <div mb-1>
      <n-form-item label="Comment :" label-placement="left">
        <n-input
          v-model:value="comment"
          type="text"
          placeholder="Comment"
        />
      </n-form-item>
    </div>

    <n-space justify="center" mb-1>
      <c-button @click="refreshCerts">
        Refresh key-pair
      </c-button>
    </n-space>

    <div>
      <h3>Public key</h3>
      <TextareaCopyable :value="certs.publicKey" :word-wrap="true" />
    </div>

    <div>
      <h3>Private key</h3>
      <TextareaCopyable :value="certs.privateKey" />
    </div>
  </div>
</template>
