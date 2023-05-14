<template>
  <div style="max-width: 350px">
    <c-input-text
      v-model:value="secret"
      label="Secret"
      placeholder="Paste your TOTP secret..."
      mb-5
      :validation-rules="secretValidationRules"
    >
      <template #suffix>
        <n-tooltip trigger="hover">
          <template #trigger>
            <c-button circle variant="text" size="small" @click="refreshSecret">
              <icon-mdi-refresh />
            </c-button>
          </template>
          Generate secret token
        </n-tooltip>
      </template>
    </c-input-text>

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
    <input-copyable
      label="Secret in hexadecimal"
      :value="base32toHex(secret)"
      readonly
      placeholder="Secret in hex will be displayed here"
      mb-5
    />

    <input-copyable
      label="Epoch"
      :value="Math.floor(now / 1000).toString()"
      readonly
      mb-5
      placeholder="Epoch in sec will be displayed here"
    />

    <p>Iteration</p>

    <input-copyable
      :value="String(getCounterFromTime({ now, timeStep: 30 }))"
      readonly
      label="Count:"
      label-position="left"
      label-width="90px"
      label-align="right"
      placeholder="Iteration count will be displayed here"
    />

    <input-copyable
      :value="getCounterFromTime({ now, timeStep: 30 }).toString(16).padStart(16, '0')"
      readonly
      placeholder="Iteration count in hex will be displayed here"
      label-position="left"
      label-width="90px"
      label-align="right"
      label="Padded hex:"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useTimestamp } from '@vueuse/core';
import { useThemeVars } from 'naive-ui';
import { useStyleStore } from '@/stores/style.store';
import InputCopyable from '@/components/InputCopyable.vue';
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
