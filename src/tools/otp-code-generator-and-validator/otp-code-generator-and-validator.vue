<script setup lang="ts">
import { useTimestamp } from '@vueuse/core';
import { useThemeVars } from 'naive-ui';
import { useQRCode } from '../qr-code-generator/useQRCode';
import { base32toHex, buildKeyUri, generateHOTP, generateSecret, generateTOTP, getCounterFromTime, verifyHOTP, verifyTOTP } from './otp.service';
import TokenDisplay from './token-display.vue';
import { useStyleStore } from '@/stores/style.store';
import InputCopyable from '@/components/InputCopyable.vue';

type OtpMode = 'totp' | 'hotp';
const now = useTimestamp();
const interval = computed(() => (now.value / 1000) % 30);
const theme = useThemeVars();
const styleStore = useStyleStore();
const mode = ref<OtpMode>('totp');
const digits = ref<6 | 8>(6);
const secret = ref(generateSecret());
const counterText = ref('0');
const verificationToken = ref('');
const hotpCode = ref('');
const verificationResult = ref<boolean>();
const status = ref('Ready.');

const secretValid = computed(() => secret.value.trim().length <= 512 && /^[A-Z2-7]+$/u.test(secret.value.trim().toUpperCase()));
const counter = computed(() => {
  try {
    const value = BigInt(counterText.value);
    return value >= 0n && value <= (1n << 64n) - 1n ? value : undefined;
  }
  catch {
    return undefined;
  }
});
const tokens = computed(() => {
  if (!secretValid.value) {
    return { previous: '', current: '', next: '' };
  }
  return {
    previous: generateTOTP({ key: secret.value, now: now.value - 30000, digits: digits.value }),
    current: generateTOTP({ key: secret.value, now: now.value, digits: digits.value }),
    next: generateTOTP({ key: secret.value, now: now.value + 30000, digits: digits.value }),
  };
});
const keyUri = computed(() => {
  if (!secretValid.value || (mode.value === 'hotp' && counter.value === undefined)) {
    return '';
  }
  return buildKeyUri({ secret: secret.value.trim().toUpperCase(), digits: digits.value, type: mode.value, counter: counter.value });
});
const secretHex = computed(() => secretValid.value ? base32toHex(secret.value) : '');

const { qrcode } = useQRCode({
  text: keyUri,
  color: {
    background: computed(() => (styleStore.isDarkTheme ? '#ffffff' : '#00000000')),
    foreground: '#000000',
  },
  options: { width: 210 },
});

watch([mode, secret, counterText, digits], () => {
  hotpCode.value = '';
  verificationResult.value = undefined;
  status.value = 'Inputs changed.';
});

function refreshSecret() {
  secret.value = generateSecret();
  status.value = 'Generated a new local secret.';
}

function generateCounterCode() {
  if (!secretValid.value || counter.value === undefined) {
    return;
  }
  hotpCode.value = generateHOTP({ key: secret.value, counter: counter.value, digits: digits.value });
  status.value = `Generated HOTP for counter ${counter.value.toString()}.`;
}

function verifyCode() {
  if (!secretValid.value || !new RegExp(`^\\d{${digits.value}}$`, 'u').test(verificationToken.value)) {
    verificationResult.value = false;
    status.value = 'Enter a valid secret and numeric token.';
    return;
  }
  verificationResult.value = mode.value === 'totp'
    ? verifyTOTP({ key: secret.value, token: verificationToken.value, now: now.value, window: 1, digits: digits.value })
    : counter.value !== undefined && verifyHOTP({ key: secret.value, token: verificationToken.value, counter: counter.value, digits: digits.value });
  status.value = verificationResult.value ? 'Token matches locally.' : 'Token does not match.';
}
</script>

<template>
  <div class="c-task-layout">
    <c-alert title="Local one-time password workspace">
      TOTP follows a 30-second clock and HOTP follows an explicit unsigned 64-bit counter. Both use HMAC-SHA-1 for RFC/authenticator compatibility; the secret stays in this page only. A successful local match does not prove account ownership, server enrollment, or resistance to phishing.
    </c-alert>
    <c-card class="c-task-options" title="Mode and secret">
      <div grid grid-cols-1 gap-3 md:grid-cols-2>
        <c-select v-model:value="mode" label="OTP mode" :options="[{ label: 'TOTP — time based', value: 'totp' }, { label: 'HOTP — counter based', value: 'hotp' }]" />
        <c-select v-model:value="digits" label="Code length" :options="[{ label: '6 digits', value: 6 }, { label: '8 digits', value: 8 }]" />
      </div>
      <c-input-text
        v-model:value="secret"
        label="RFC 4648 Base32 secret"
        placeholder="JBSWY3DPEHPK3PXP"
        :maxlength="512"
        raw-text mt-3
        :validation-rules="[{ message: 'Secret must contain only A–Z and 2–7 and be at most 512 characters', validator: () => secretValid }]"
      >
        <template #suffix>
          <c-tooltip tooltip="Generate a new random secret">
            <c-button circle variant="text" size="small" aria-label="Generate a new random secret" @click="refreshSecret">
              <icon-mdi-refresh />
            </c-button>
          </c-tooltip>
        </template>
      </c-input-text>
      <c-input-text v-if="mode === 'hotp'" v-model:value="counterText" label="HOTP counter (0 to 2^64 − 1)" raw-text monospace mt-3 :validation-rules="[{ message: 'Counter must be an unsigned 64-bit integer', validator: () => counter !== undefined }]" />
    </c-card>

    <c-card v-if="mode === 'totp'" class="c-generator-output" title="Current TOTP window">
      <TokenDisplay :tokens="tokens" />
      <n-progress :percentage="(100 * interval) / 30" :color="theme.primaryColor" :show-indicator="false" mt-3 />
      <p text-center>
        Next in {{ String(Math.floor(30 - interval)).padStart(2, '0') }}s
      </p>
    </c-card>
    <c-card v-else class="c-generator-output" title="HOTP result">
      <c-input-text :value="hotpCode" label="Code for the exact counter" monospace raw-text readonly data-test-id="hotp-output" />
      <div class="c-task-actions" mt-3>
        <c-button type="primary" :disabled="!secretValid || counter === undefined" data-test-id="hotp-generate" @click="generateCounterCode">
          Generate HOTP
        </c-button>
      </div>
    </c-card>

    <c-card title="Verify one code">
      <c-input-text v-model:value="verificationToken" :label="`${digits}-digit token`" inputmode="numeric" :maxlength="digits" raw-text monospace />
      <div class="c-task-actions" mt-3>
        <c-button type="primary" :disabled="!secretValid || (mode === 'hotp' && counter === undefined)" @click="verifyCode">
          Verify locally
        </c-button>
      </div>
      <c-alert v-if="verificationResult !== undefined" :title="verificationResult ? 'Token matches' : 'Token does not match'" mt-3>
        {{ mode === 'totp' ? 'TOTP verification accepts the current step plus one adjacent step on either side.' : 'HOTP verification uses only the exact displayed counter.' }}
      </c-alert>
    </c-card>

    <p class="c-task-status" role="status" aria-live="polite">
      {{ status }}
    </p>
    <c-card class="c-generator-output" title="Provisioning and technical details">
      <div grid grid-cols-1 gap-3 md:grid-cols-2>
        <InputCopyable label="Secret in hexadecimal" :value="secretHex" readonly />
        <InputCopyable v-if="mode === 'totp'" label="Unix time (seconds)" :value="Math.floor(now / 1000).toString()" readonly />
        <InputCopyable v-if="mode === 'totp'" label="TOTP counter" :value="String(getCounterFromTime({ now, timeStep: 30 }))" readonly />
        <InputCopyable v-else label="HOTP counter" :value="counter?.toString() ?? ''" readonly />
        <InputCopyable label="Provisioning URI" :value="keyUri" readonly />
      </div>
      <div v-if="keyUri" mt-4 flex flex-col items-center justify-center gap-3>
        <img :src="qrcode" alt="OTP setup QR code" width="210">
        <c-button :href="keyUri" target="_blank">
          Open Key URI in new tab
        </c-button>
      </div>
    </c-card>
  </div>
</template>
