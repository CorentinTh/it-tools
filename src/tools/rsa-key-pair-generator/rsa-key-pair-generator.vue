<template>
  <div style="flex: 0 0 100%">
    <n-space item-style="flex: 1 1 0" style="margin: 0 auto; max-width: 600px" justify="center">
      <n-form-item label="Bits :" v-bind="bitsValidationAttrs" label-placement="left" label-width="100">
        <n-input-number v-model:value="bits" min="256" max="16384" step="8" />
      </n-form-item>

      <c-button @click="refreshCerts">Refresh key-pair</c-button>
    </n-space>
  </div>

  <div>
    <h3>Public key</h3>
    <textarea-copyable :value="certs.publicKeyPem" />
  </div>

  <div>
    <h3>Private key</h3>
    <textarea-copyable :value="certs.privateKeyPem" />
  </div>
</template>

<script setup lang="ts">
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { ref } from 'vue';
import { withDefaultOnErrorAsync } from '@/utils/defaults';
import { useValidation } from '@/composable/validation';
import { computedRefreshableAsync } from '@/composable/computedRefreshable';
import { generateKeyPair } from './rsa-key-pair-generator.service';

const bits = ref(2048);
const emptyCerts = { publicKeyPem: '', privateKeyPem: '' };

const { attrs: bitsValidationAttrs } = useValidation({
  source: bits,
  rules: [
    {
      message: 'Bits should be 256 <= bits <= 16384 and be a multiple of 8',
      validator: (value) => value >= 256 && value <= 16384 && value % 8 === 0,
    },
  ],
});

const [certs, refreshCerts] = computedRefreshableAsync(
  () => withDefaultOnErrorAsync(() => generateKeyPair({ bits: bits.value }), emptyCerts),
  emptyCerts,
);
</script>

<style lang="less" scoped></style>
