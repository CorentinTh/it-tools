<script setup lang="ts">
import db from 'oui-data';
import { macAddressValidationRules } from '@/utils/macAddress';
import { useCopy } from '@/composable/copy';

const { t } = useI18n();
const getVendorValue = (address: string) => address.trim().replace(/[.:-]/g, '').toUpperCase().substring(0, 6);

const macAddress = ref('20:37:06:12:34:56');
const details = computed<string | undefined>(() => (db as Record<string, string>)[getVendorValue(macAddress.value)]);

const { copy } = useCopy({ source: () => details.value ?? '', text: t('tools.mac-address-lookup.copied') });
</script>

<template>
  <div>
    <c-input-text
      v-model:value="macAddress"
      :label="t('tools.mac-address-lookup.MACAddressLabel')"
      size="large"
      :placeholder="t('tools.mac-address-lookup.MACAddressPlaceholder')"
      clearable
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      spellcheck="false"
      :validation-rules="macAddressValidationRules"
      mb-5
    />

    <div mb-5px>
      {{ t('tools.mac-address-lookup.vendorInfo') }}
    </div>
    <c-card mb-5>
      <div v-if="details">
        <div v-for="(detail, index) of details.split('\n')" :key="index">
          {{ detail }}
        </div>
      </div>

      <div v-else italic op-60>
        {{ t('tools.mac-address-lookup.unknownAddress') }}
      </div>
    </c-card>

    <div flex justify-center>
      <c-button :disabled="!details" @click="copy()">
        {{ t('tools.mac-address-lookup.copyBtn') }}
      </c-button>
    </div>
  </div>
</template>
