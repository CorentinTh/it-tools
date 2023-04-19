<template>
  <div style="max-width: 350px">
    <n-form-item label="Secret" v-bind="secretValidationAttrs">
      <n-input v-model:value="secret" placeholder="Paste your TOTP secret...">
        <template #suffix>
          <n-tooltip trigger="hover">
            <template #trigger>
              <c-button circle variant="text" @click="refreshSecret">
                <n-icon :component="Refresh" />
              </c-button>
            </template>
            Generate secret token
          </n-tooltip>
        </template>
      </n-input>
    </n-form-item>

    <div>
      <token-display :tokens="tokens" style="margin-top: 2px" />

      <n-progress :percentage="(100 * interval) / 30" :color="theme.primaryColor" :show-indicator="false" />
      <div style="text-align: center">Next in {{ String(Math.floor(30 - interval)).padStart(2, '0') }}s</div>
    </div>
    <n-space justify="center" vertical align="center" style="margin-top: 10px">
      <n-image :src="qrcode"></n-image>
      <c-button :href="keyUri" target="_blank">Open Key URI in new tab</c-button>
    </n-space>
  </div>
  <div style="max-width: 350px">
    <n-form-item label="Secret in hexadecimal">
      <input-copyable :value="base32toHex(secret)" readonly placeholder="Secret in hex will be displayed here" />
    </n-form-item>

    <n-form-item label="Epoch">
      <input-copyable
        :value="Math.floor(now / 1000).toString()"
        readonly
        placeholder="Epoch in sec will be displayed here"
      />
    </n-form-item>
    <n-form-item label="Iteration" :show-feedback="false">
      <n-input-group>
        <n-input-group-label style="width: 110px">Count:</n-input-group-label>
        <input-copyable
          :value="String(getCounterFromTime({ now, timeStep: 30 }))"
          readonly
          placeholder="Iteration count will be displayed here"
        />
      </n-input-group>
    </n-form-item>

    <n-form-item label="Iteration" :show-label="false" style="margin-top: 5px">
      <n-input-group>
        <n-input-group-label style="width: 110px">Padded hex:</n-input-group-label>
        <input-copyable
          :value="getCounterFromTime({ now, timeStep: 30 }).toString(16).padStart(16, '0')"
          readonly
          placeholder="Iteration count in hex will be displayed here"
        />
      </n-input-group>
    </n-form-item>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Refresh } from '@vicons/tabler';
import { useTimestamp } from '@vueuse/core';
import { useThemeVars } from 'naive-ui';
import { useStyleStore } from '@/stores/style.store';
import InputCopyable from '@/components/InputCopyable.vue';
import { useValidation } from '@/composable/validation';
import { computedRefreshable } from '@/composable/computedRefreshable';
import { generateTOTP, buildKeyUri, generateSecret, base32toHex, getCounterFromTime } from './otp.service';
import { useQRCode } from '../qr-code-generator/useQRCode';
import TokenDisplay from './token-display.vue';

const now = useTimestamp();
const interval = computed(() => (now.value / 1000) % 30);
const theme = useThemeVars();
const styleStore = useStyleStore();

const secret = ref(generateSecret());

function refreshSecret() {
  secret.value = generateSecret();
}

const [tokens] = computedRefreshable(
  () => ({
    previous: generateTOTP({ key: secret.value, now: now.value - 30000 }),
    current: generateTOTP({ key: secret.value, now: now.value }),
    next: generateTOTP({ key: secret.value, now: now.value + 30000 }),
  }),
  { throttle: 500 },
);

const keyUri = computed(() => buildKeyUri({ secret: secret.value }));

const { qrcode } = useQRCode({
  text: keyUri,
  color: {
    background: computed(() => (styleStore.isDarkTheme ? '#ffffff' : '#00000000')),
    foreground: '#000000',
  },
  options: { width: 210 },
});

const { attrs: secretValidationAttrs } = useValidation({
  source: secret,
  rules: [
    {
      message: 'Secret should be a base32 string',
      validator: (value) => value.toUpperCase().match(/^[A-Z234567]+$/),
    },
    {
      message: 'Please set a secret',
      validator: (value) => value !== '',
    },
  ],
});
</script>

<style lang="less" scoped>
.n-progress {
  margin-top: 10px;
  ::v-deep(.n-progress-graph-line-fill) {
    transition-duration: 0.05s !important;
  }
}

.token {
  text-align: center;
  &.token-current {
    font-size: 20px;
  }
}
</style>
