<script setup lang="ts">
import { useTimestamp } from '@vueuse/core';
import { useQRCode } from '../qr-code-generator/useQRCode';
import { buildKeyUri, generateSecret, generateTOTP } from './otp.service';
import TokenDisplay from './token-display.vue';
import { useStyleStore } from '@/stores/style.store';
import { computedRefreshable } from '@/composable/computedRefreshable';

const now = useTimestamp();
const interval = computed(() => (now.value / 1000) % 30);
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
    message: '秘钥应该是32位字符串',
    validator: (value: string) => value.toUpperCase().match(/^[A-Z234567]+$/),
  },
  {
    message: '请粘贴或随机生成秘钥',
    validator: (value: string) => value !== '',
  },
];
</script>

<template>
  <c-card>
    <n-h2 style="margin-bottom: 0">
      OTP 凭证
    </n-h2>
    <div mb-5 style="opacity: 0.8">
      用于生成OTP的凭证，请使用移动设备下载带有身份验证的OTP应用程序，扫描二维码添加OTP凭证，或妥善保存OTP秘钥用于以后查看OTP令牌。
    </div>
    <c-input-text
      v-model:value="secret"
      label="秘钥"
      placeholder="粘贴 TOTP 秘钥"
      mb-5
      :validation-rules="secretValidationRules"
    >
      <template #suffix>
        <c-tooltip tooltip="生成一个新的随机秘钥">
          <c-button circle variant="text" size="small" @click="refreshSecret">
            <icon-mdi-refresh />
          </c-button>
        </c-tooltip>
      </template>
    </c-input-text>

    <div flex flex-col items-center justify-center gap-3>
      <n-image :src="qrcode" preview-disabled />
      <c-button :href="keyUri" target="_blank">
        在新标签页中打开密钥URI
      </c-button>
    </div>
  </c-card>

  <c-card>
    <n-h2 style="margin-bottom: 0">
      OTP 令牌
    </n-h2>
    <div mb-5 style="opacity: 0.8">
      此OTP令牌是根据OTP凭证生成的，此工具不会存储此凭证和令牌。运算是通过浏览器即时生成的，不会与服务器共享数据。
    </div>
    <TokenDisplay :tokens="tokens" />
    <n-progress :percentage="100 - ((100 * interval) / 30)" :status="Math.floor(30 - interval)>10?'success':'error'" :show-indicator="false" style="transform: rotate(180deg);" />
    <div mt-1 style="text-align: center">
      此令牌有效期：还剩{{ String(Math.floor(30 - interval)).padStart(2, '0') }}秒
    </div>
  </c-card>
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
