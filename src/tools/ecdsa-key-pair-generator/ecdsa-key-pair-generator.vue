<script setup lang="ts">
import type sshpk from 'sshpk';
import { generateKeyPair } from './ecdsa-key-pair-generator.service';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { withDefaultOnErrorAsync } from '@/utils/defaults';
import { computedRefreshableAsync } from '@/composable/computedRefreshable';

const password = ref('');
const comment = ref('');
const emptyCerts = { publicKey: '', privateKey: '' };
const curve = useStorage('ecdsa-key-pair-generator:curve', 'nistp256');
const curveOptions = [
  { value: 'nistp256', label: 'nistp256' },
  { value: 'nistp384', label: 'nistp384' },
  { value: 'nistp521', label: 'nistp521' },
];

const format = useStorage('ecdsa-key-pair-generator:format', 'ssh');
const formatOptions = [
  { value: 'pem', label: 'PEM' },
  { value: 'pkcs8', label: 'PKCS#8' },
  { value: 'ssh', label: 'OpenSSH Standard' },
  { value: 'openssh', label: 'OpenSSH New' },
  { value: 'putty', label: 'PuTTY' },
];

const supportsPassphrase = computed(() => format.value === 'ssh');
const [certs, refreshCerts] = computedRefreshableAsync(
  () => withDefaultOnErrorAsync(() => generateKeyPair(
    {
      password: password.value,
      format: format.value as sshpk.PrivateKeyFormatType,
      curve: curve.value as sshpk.CurveType,
      comment: comment.value,
    },
  ), emptyCerts),
  emptyCerts,
);
</script>

<template>
  <div max-w-600px>
    <n-space mb-1>
      <c-select
        v-model:value="format"
        label-position="left"
        label="Format:"
        :options="formatOptions"
        placeholder="Select a key format"
      />

      <c-select
        v-model:value="curve"
        label-position="left"
        label="Curve:"
        :options="curveOptions"
        placeholder="Select a curve type"
      />
    </n-space>

    <div v-if="supportsPassphrase" mb-1 mt-3>
      <n-form-item label="Passphrase :" label-placement="left">
        <n-input
          v-model:value="password"
          type="password"
          show-password-on="mousedown"
          placeholder="Passphrase"
        />
      </n-form-item>
    </div>

    <div mb-2>
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

    <n-divider />

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
