<script setup lang="ts">
import {
  EAPMethods,
  EAPPhase2Methods,
  useWifiQRCode,
} from './useQRCode';
import { useDownloadFileFromBase64 } from '@/composable/downloadBase64';
import CColorPicker from '@/ui/c-color-picker/c-color-picker.vue';

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

const { download } = useDownloadFileFromBase64({ source: qrcode, filename: 'qr-code.png' });
</script>

<template>
  <div class="c-form-layout">
    <c-card>
      <div grid grid-cols-1 gap-4>
        <c-select
          v-model:value="encryption"
          label="Encryption method"
          default-value="WPA"
          :options="[
            {
              label: 'No password',
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
            {
              label: 'WPA2-EAP',
              value: 'WPA2-EAP',
            },
          ]"
        />

        <c-input-text
          id="wifi-ssid"
          v-model:value="ssid"
          label="SSID"
          placeholder="Your WiFi SSID..."
        />
        <CCheckbox id="wifi-hidden" v-model:checked="isHiddenSSID">
          Hidden SSID
        </CCheckbox>

        <c-input-text
          v-if="encryption !== 'nopass'"
          id="wifi-password"
          v-model:value="password"
          label="Password"
          type="password"
          placeholder="Your WiFi Password..."
        />
        <c-select
          v-if="encryption === 'WPA2-EAP'"
          v-model:value="eapMethod"
          label="EAP method"
          :options="EAPMethods.map((method) => ({ label: method, value: method }))"
          searchable
        />

        <template v-if="encryption === 'WPA2-EAP'">
          <c-input-text
            id="wifi-eap-identity"
            v-model:value="eapIdentity"
            label="Identity"
            placeholder="Your EAP Identity..."
          />
          <CCheckbox id="wifi-eap-anonymous" v-model:checked="eapAnonymous">
            Anonymous identity
          </CCheckbox>
        </template>

        <c-select
          v-if="encryption === 'WPA2-EAP'"
          v-model:value="eapPhase2Method"
          label="EAP Phase 2 method"
          :options="EAPPhase2Methods.map((method) => ({ label: method, value: method }))"
          searchable
        />

        <div grid grid-cols-1 gap-3 sm:grid-cols-2>
          <c-field label="Foreground color" label-for="wifi-foreground-color">
            <CColorPicker
              id="wifi-foreground-color"
              v-model:value="foreground"
              aria-label="Foreground color"
              :modes="['hex']"
            />
          </c-field>
          <c-field label="Background color" label-for="wifi-background-color">
            <CColorPicker
              id="wifi-background-color"
              v-model:value="background"
              aria-label="Background color"
              :modes="['hex']"
            />
          </c-field>
        </div>
      </div>
    </c-card>

    <c-card v-if="qrcode" data-test-id="wifi-qrcode-result">
      <div flex flex-col items-center gap-3>
        <img alt="WiFi QR code" :src="qrcode" width="240">
        <div class="c-generator-actions">
          <c-button type="primary" @click="download">
            Download QR code
          </c-button>
        </div>
      </div>
    </c-card>
  </div>
</template>
