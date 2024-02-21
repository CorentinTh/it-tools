<script setup lang="ts">
import { SHA1 } from 'crypto-js';
import InputCopyable from '@/components/InputCopyable.vue';
import { macAddressValidation } from '@/utils/macAddress';

const { t } = useI18n();
const macAddress = ref('20:37:06:12:34:56');
const calculatedSections = computed(() => {
  const timestamp = new Date().getTime();
  const hex40bit = SHA1(timestamp + macAddress.value)
    .toString()
    .substring(30);

  const ula = `fd${hex40bit.substring(0, 2)}:${hex40bit.substring(2, 6)}:${hex40bit.substring(6)}`;

  return [
    {
      label: t('tools.ipv6-ula-generator.IPv6ULA'),
      value: `${ula}::/48`,
    },
    {
      label: t('tools.ipv6-ula-generator.firstRoutableBlock'),
      value: `${ula}:0::/64`,
    },
    {
      label: t('tools.ipv6-ula-generator.lastRoutableBlock'),
      value: `${ula}:ffff::/64`,
    },
  ];
});

const addressValidation = macAddressValidation(macAddress);
</script>

<template>
  <div>
    <n-alert :title="t('tools.ipv6-ula-generator.info')" type="info">
      {{ t('tools.ipv6-ula-generator.infoDetail') }}
    </n-alert>

    <c-input-text
      v-model:value="macAddress"
      :placeholder="t('tools.ipv6-ula-generator.macAddressPlaceholder')"
      clearable
      :label="t('tools.ipv6-ula-generator.macAddressLabel')"
      raw-text
      my-8
      :validation="addressValidation"
    />

    <div v-if="addressValidation.isValid">
      <InputCopyable
        v-for="{ label, value } in calculatedSections"
        :key="label"
        :value="value"
        :label="label"
        label-width="160px"
        label-align="right"
        label-position="left"
        readonly
        mb-2
      />
    </div>
  </div>
</template>
