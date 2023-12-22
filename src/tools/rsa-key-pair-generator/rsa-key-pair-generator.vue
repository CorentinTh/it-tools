<script setup lang="ts">
import { generateKeyPair } from './rsa-key-pair-generator.service';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { withDefaultOnErrorAsync } from '@/utils/defaults';
import { useValidation } from '@/composable/validation';
import { computedRefreshableAsync } from '@/composable/computedRefreshable';

const bits = ref(2048);
const emptyCerts = { publicKeyPem: '', privateKeyPem: '' };

const { t } = useI18n();

const { attrs: bitsValidationAttrs } = useValidation({
  source: bits,
  rules: [
    {
      message: t('tools.rsa-key-pair-generator.validationError'),
      validator: value => value >= 256 && value <= 16384 && value % 8 === 0,
    },
  ],
});

const [certs, refreshCerts] = computedRefreshableAsync(
  () => withDefaultOnErrorAsync(() => generateKeyPair({ bits: bits.value }), emptyCerts),
  emptyCerts,
);
</script>

<template>
  <div style="flex: 0 0 100%">
    <div item-style="flex: 1 1 0" style="max-width: 600px" mx-auto flex gap-3>
      <n-form-item :label="t('tools.rsa-key-pair-generator.bits')" v-bind="bitsValidationAttrs as any" label-placement="left" label-width="100">
        <n-input-number v-model:value="bits" min="256" max="16384" step="8" />
      </n-form-item>

      <c-button @click="refreshCerts">
        {{ t('tools.rsa-key-pair-generator.button.refresh') }}
      </c-button>
    </div>
  </div>

  <div>
    <h3>{{ t('tools.rsa-key-pair-generator.publicKey') }}</h3>
    <TextareaCopyable :value="certs.publicKeyPem" />
  </div>

  <div>
    <h3>{{ t('tools.rsa-key-pair-generator.privateKey') }}</h3>
    <TextareaCopyable :value="certs.privateKeyPem" />
  </div>
</template>
