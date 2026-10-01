<script setup lang="ts">
import { type HmacAlgorithm, decodeJwtParts, generateJwt } from './jwt-generator.service';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { useValidation } from '@/composable/validation';
import { withDefaultOnErrorAsync } from '@/utils/defaults';
import { computedRefreshableAsync } from '@/composable/computedRefreshable';

const emptyParts = { header: '', payload: '', signature: '' };

const headerInput = ref('{\n  "alg": "HS256",\n  "typ": "JWT"\n}');
const payloadInput = ref('{\n  "sub": "1234567890",\n  "name": "John Doe",\n  "iat": 1516239022\n}');
const secret = ref('your-256-bit-secret');
const algorithm = ref<HmacAlgorithm>('HS256');

const algorithmOptions = ['HS256', 'HS384', 'HS512'].map(value => ({ label: value, value }));

function jsonParse(value: string) {
  return JSON.parse(value);
}

function isValidJson(value: string) {
  try {
    jsonParse(value);
    return true;
  }
  catch {
    return false;
  }
}

const headerValid = useValidation({
  source: headerInput,
  rules: [{
    validator: isValidJson,
    message: 'Header must be valid JSON',
  }],
});
const payloadValid = useValidation({
  source: payloadInput,
  rules: [{
    validator: isValidJson,
    message: 'Payload must be valid JSON',
  }],
});

const [token, refresh] = computedRefreshableAsync(
  () => withDefaultOnErrorAsync(
    async () => generateJwt({
      header: jsonParse(headerInput.value),
      payload: jsonParse(payloadInput.value),
      secret: secret.value,
      algorithm: algorithm.value,
    }),
    '',
  ),
  '',
);

function safeDecode() {
  try {
    return token.value ? decodeJwtParts(token.value) : emptyParts;
  }
  catch {
    return emptyParts;
  }
}

const decodedParts = computed(safeDecode);
</script>

<template>
  <div style="max-width: 720px; margin: 0 auto;">
    <c-card mb-3>
      <n-grid cols="2" x-gap="12" mb-3>
        <n-gi>
          <c-select v-model:value="algorithm" label="Algorithm" label-position="top" :options="algorithmOptions" />
        </n-gi>
        <n-gi>
          <c-input-text v-model:value="secret" label="Secret" placeholder="Shared HMAC secret" clearable />
        </n-gi>
      </n-grid>

      <n-form-item label="Header (JSON)" label-placement="top" :feedback="headerValid.message" :validation-status="headerValid.status" mb-2>
        <c-input-text v-model:value="headerInput" rows="4" raw-text multiline monospace />
      </n-form-item>

      <n-form-item label="Payload (JSON)" label-placement="top" :feedback="payloadValid.message" :validation-status="payloadValid.status" mb-2>
        <c-input-text v-model:value="payloadInput" multiline raw-text rows="6" monospace />
      </n-form-item>

      <c-button :disabled="!headerValid.isValid || !payloadValid.isValid || !secret" @click="refresh()">
        Generate token
      </c-button>
    </c-card>

    <c-card mb-3>
      <n-form-item label="JWT:" label-placement="top">
        <TextareaCopyable :value="token" copy-placement="outside" mb-1 />
      </n-form-item>
      <div flex justify-center>
        <c-button :disabled="!token" @click="refresh()">
          Regenerate
        </c-button>
      </div>
    </c-card>

    <c-card v-if="decodedParts.header">
      <n-form-item label="Decoded header:" label-placement="top" mb-2>
        <TextareaCopyable :value="decodedParts.header" mb-1 />
      </n-form-item>
      <n-form-item label="Decoded payload:" label-placement="top">
        <TextareaCopyable :value="decodedParts.payload" mb-1 />
      </n-form-item>
    </c-card>
  </div>
</template>
