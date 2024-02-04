<script setup lang="ts">
import {
  useWifiQRCode,
} from './useQRCode';
import { useDownloadFileFromBase64 } from '@/composable/downloadBase64';

const foreground = ref('#000000ff');
const background = ref('#ffffffff');

const ssid = ref();
const password = ref();
const eapMethod = ref();
const isHiddenSSID = ref(false);
const eapAnonymous = ref(false);
const eapIdentity = ref();
const eapPhase2Method = ref();

const { qrcode, encryption } = useWifiQRCode({
  ssid,
  password,
  eapMethod,
  isHiddenSSID,
  eapAnonymous,
  eapIdentity,
  eapPhase2Method,
  color: {
    background,
    foreground,
  },
  options: { width: 1024 },
});

const { download } = useDownloadFileFromBase64({ source: qrcode, filename: 'WiFi二维码.png' });
</script>

<template>
  <c-card>
    <div grid grid-cols-1 gap-3>
      <div>
        <c-select
          v-model:value="encryption"
          mb-4
          label="加密方式:"
          default-value="WPA"
          label-position="left"
          label-width="130px"
          label-align="right"
          :options="[
            {
              label: '无密码',
              value: 'nopass',
            },
            {
              label: 'WPA/WPA2',
              value: 'WPA',
            },
            {
              label: 'WEP',
              value: 'WEP',
            },
          ]"
        />
        <c-input-text
          v-model:value="ssid"
          label-position="left"
          label-width="130px"
          label-align="right"
          label="WiFi名称:"
          rows="1"
          autosize
          placeholder="输入WiFi名称"
          mb-6
        />
        <c-select
          v-model:value="isHiddenSSID"
          mb-4
          label="是否隐藏:"
          :default-value="false"
          label-position="left"
          label-width="130px"
          label-align="right"
          :options="[
            {
              label: '否',
              value: false,
            },
            {
              label: '是',
              value: true,
            },
          ]"
        />
        <c-input-text
          v-if="encryption !== 'nopass'"
          v-model:value="password"
          label-position="left"
          label-width="130px"
          label-align="right"
          label="WiFi密码:"
          rows="1"
          autosize
          type="password"
          placeholder="输入WiFi密码"
          mb-6
        />
        <n-form label-width="130" label-placement="left">
          <n-form-item label="前景色:">
            <n-color-picker v-model:value="foreground" :modes="['hex']" />
          </n-form-item>
          <n-form-item label="背景色:">
            <n-color-picker v-model:value="background" :modes="['hex']" />
          </n-form-item>
        </n-form>
      </div>
      <div v-if="qrcode">
        <div flex flex-col items-center gap-3>
          <img alt="wifi-qrcode" :src="qrcode" width="240">
          <c-button @click="download">
            下载二维码
          </c-button>
        </div>
      </div>
    </div>
  </c-card>
</template>
