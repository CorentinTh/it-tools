<script setup lang="ts">
import { generateWpaPskRawKey } from './wpa-psk-generator.service';
import { useValidation } from '@/composable/validation';

const ssid = ref('');
const passphrase = ref('');

const wpaPSKRawKey = ref('');
function computeRawKey() {
  try {
    wpaPSKRawKey.value = generateWpaPskRawKey(ssid.value, passphrase.value)?.psk;
  }
  catch (e: any) {
    wpaPSKRawKey.value = e.toString();
  }
}

const ssidValidation = useValidation({
  source: ssid,
  rules: [
    {
      validator: v => v !== '',
      message: 'SSID must not be empty.',
    },
  ],
});
</script>

<template>
  <div style="max-width: 600px;">
    <c-card title="Wifi Infos" mb-2>
      <c-input-text
        v-model:value="ssid"
        label="SSID"
        label-position="left"
        placeholder="Put your SSID here..."
        :validation="ssidValidation"
        mb-2
      />

      <c-input-text
        v-model:value="passphrase"
        label="Passphrase"
        label-position="left"
        placeholder="Put your Passphrase here..."
        mb-2
      />

      <div flex justify-center>
        <n-button @click="computeRawKey()">Compute</n-button>
      </div>
    </c-card>

    <c-card title="WPA PSK Raw Key (256 bits)">
      <TextareaCopyable :value="wpaPSKRawKey" />
    </c-card>
  </div>
</template>
