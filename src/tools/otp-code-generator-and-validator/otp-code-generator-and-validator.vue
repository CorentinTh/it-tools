<script setup lang="ts">
import { useTimestamp } from '@vueuse/core';
import { useThemeVars } from 'naive-ui';
import { useQRCode } from '../qr-code-generator/useQRCode';
import { base32toHex, buildKeyUri, generateSecret, generateTOTP, getCounterFromTime } from './otp.service';
import TokenDisplay from './token-display.vue';
import { useStyleStore } from '@/stores/style.store';
import InputCopyable from '@/components/InputCopyable.vue';
import { computedRefreshable } from '@/composable/computedRefreshable';

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
  { dependencies: [secret, now], throttle: 500 },
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

const secretValidationRules = [
  {
    message: 'Secret should be a base32 string',
    validator: (value: string) => value.toUpperCase().match(/^[A-Z234567]+$/),
  },
  {
    message: 'Please set a secret',
    validator: (value: string) => value !== '',
  },
];
</script>

<template>
  <div class="c-generator-layout">
    <c-card class="c-generator-options" title="Secret and current codes">
      <c-input-text
        v-model:value="secret"
        label="Secret"
        placeholder="Paste your TOTP secret..."
        mb-5
        :validation-rules="secretValidationRules"
      >
        <template #suffix>
          <c-tooltip tooltip="Generate a new random secret">
            <c-button circle variant="text" size="small" aria-label="Generate a new random secret" @click="refreshSecret">
              <icon-mdi-refresh />
            </c-button>
          </c-tooltip>
        </template>
      </c-input-text>

      <div>
        <TokenDisplay :tokens="tokens" />

        <n-progress :percentage="(100 * interval) / 30" :color="theme.primaryColor" :show-indicator="false" />
        <div style="text-align: center">
          Next in {{ String(Math.floor(30 - interval)).padStart(2, '0') }}s
        </div>
      </div>
      <div mt-4 flex flex-col items-center justify-center gap-3>
        <img :src="qrcode" alt="OTP setup QR code" width="210">
        <c-button :href="keyUri" target="_blank">
          Open Key URI in new tab
        </c-button>
      </div>
    </c-card>

    <c-card class="c-generator-output" title="Technical details">
      <div grid grid-cols-1 gap-3 md:grid-cols-2>
        <InputCopyable
          label="Secret in hexadecimal"
          :value="base32toHex(secret)"
          readonly
          placeholder="Secret in hex will be displayed here"
        />

        <InputCopyable
          label="Epoch"
          :value="Math.floor(now / 1000).toString()"
          readonly
          placeholder="Epoch in sec will be displayed here"
        />

        <InputCopyable
          :value="String(getCounterFromTime({ now, timeStep: 30 }))"
          readonly
          label="Iteration count"
          placeholder="Iteration count will be displayed here"
        />

        <InputCopyable
          :value="getCounterFromTime({ now, timeStep: 30 }).toString(16).padStart(16, '0')"
          readonly
          placeholder="Iteration count in hex will be displayed here"
          label="Padded hexadecimal count"
        />
      </div>
    </c-card>
  </div>
</template>

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
