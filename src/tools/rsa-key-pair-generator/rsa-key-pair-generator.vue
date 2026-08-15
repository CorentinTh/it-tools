<script setup lang="ts">
import { generateKeyPair } from './rsa-key-pair-generator.service';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { withDefaultOnErrorAsync } from '@/utils/defaults';
import { useValidation } from '@/composable/validation';
import { computedRefreshableAsync } from '@/composable/computedRefreshable';

const bits = ref(2048);
const emptyCerts = { publicKeyPem: '', privateKeyPem: '' };

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
  ({ signal }) => withDefaultOnErrorAsync(() => generateKeyPair({ bits: bits.value, signal }), emptyCerts),
  { defaultValue: emptyCerts, dependencies: [bits] },
);
</script>

<template>
  <div style="flex: 0 0 100%">
    <div item-style="flex: 1 1 0" style="max-width: 600px" mx-auto flex gap-3>
      <n-form-item label="Bits :" v-bind="bitsValidationAttrs as any" label-placement="left" label-width="100">
        <label w-full>
          <span class="sr-only">RSA key size in bits</span>
          <n-input-number v-model:value="bits" min="256" max="16384" step="8" />
        </label>
      </n-form-item>

      <c-button @click="refreshCerts">
        Refresh key-pair
      </c-button>
    </div>
  </div>

  <div>
    <h3>Public key</h3>
    <TextareaCopyable :value="certs.publicKeyPem" />
  </div>

  <div>
    <h3>Private key</h3>
    <TextareaCopyable :value="certs.privateKeyPem" />
  </div>
</template>
