<script setup lang="ts">
import {
  EAPMethods,
  EAPPhase2Methods,
  useWifiQRCode,
} from './useQRCode';
import { useDownloadFileFromBase64 } from '@/composable/downloadBase64';
import CColorPicker from '@/ui/c-color-picker/c-color-picker.vue';
import InputCopyable from '@/components/InputCopyable.vue';

const foreground = ref('#000000ff');
const background = ref('#ffffffff');

const ssid = ref();
const password = ref();
const eapMethod = ref();
const isHiddenSSID = ref(false);
const eapAnonymous = ref(false);
const eapIdentity = ref();
const eapPhase2Method = ref();

const { error, isGenerating, payload, qrcode, status, encryption } = useWifiQRCode({
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

const statusMessage = computed(() => {
  if (error.value) {
    return error.value;
  }
  if (isGenerating.value) {
    return qrcode.value
      ? 'Updating the WiFi QR code. The previous preview remains visible.'
      : 'Generating the WiFi QR code…';
  }
  return status.value === 'ready'
    ? 'WiFi QR code ready.'
    : 'Complete the required WiFi fields to generate a QR code.';
});

const { download } = useDownloadFileFromBase64({ source: qrcode, filename: 'qr-code.png' });
const personalWpa3 = computed(() => encryption.value === 'WPA3' || encryption.value === 'WPA3-TRANSITION');
</script>

<template>
  <div class="c-form-layout">
    <c-alert title="De-facto scanner payload">
      This tool emits the ZXing-style WIFI text format, not a Wi-Fi Alliance provisioning standard. WPA3 Personal and transition selections deliberately use the broadly understood <code>T:WPA</code> token: the QR carries the SSID/password, while the access point and scanner negotiate WPA2/WPA3. A QR cannot force SAE-only policy; test the exact scanner and network before distribution.
    </c-alert>
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
              label: 'WPA3 Personal (compatible payload)',
              value: 'WPA3',
            },
            {
              label: 'WPA2/WPA3 transition (compatible payload)',
              value: 'WPA3-TRANSITION',
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
          :maxlength="256"
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
          :maxlength="2048"
        />
        <p v-if="personalWpa3" op-75>
          Compatibility mode selected: the encoded authentication token is <code>WPA</code>; WPA3-only enforcement remains an access-point/scanner responsibility.
        </p>
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

    <p
      class="c-task-status"
      data-test-id="wifi-qrcode-status"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {{ statusMessage }}
    </p>

    <c-card v-if="qrcode && payload" data-test-id="wifi-qrcode-result">
      <div flex flex-col items-center gap-3>
        <img alt="WiFi QR code" :src="qrcode" width="240">
        <div class="c-generator-actions">
          <c-button type="primary" :disabled="isGenerating" @click="download">
            Download QR code
          </c-button>
        </div>
        <InputCopyable label="Exact encoded WIFI payload (contains the password)" :value="payload" readonly monospace w-full />
      </div>
    </c-card>
  </div>
</template>
