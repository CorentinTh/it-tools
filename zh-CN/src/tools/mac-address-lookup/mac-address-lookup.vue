<script setup lang="ts">
import db from 'oui-data';
import { macAddressValidationRules } from '@/utils/macAddress';
import { useCopy } from '@/composable/copy';

const getVendorValue = (address: string) => address.trim().replace(/[.:-]/g, '').toUpperCase().substring(0, 6);

const macAddress = ref('20:37:06:12:34:56');
const details = computed<string | undefined>(() => (db as Record<string, string>)[getVendorValue(macAddress.value)]);

const { copy } = useCopy({ source: () => details.value ?? '', text: '信息已复制到剪贴板' });
</script>

<template>
  <div>
    <c-input-text
      v-model:value="macAddress"
      label="MAC地址:"
      size="large"
      placeholder="输入MAC地址"
      clearable
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      spellcheck="false"
      :validation-rules="macAddressValidationRules"
      mb-5
    />

    <div mb-5px>
      供应商信息:
    </div>
    <c-card mb-5>
      <div v-if="details">
        <div v-for="(detail, index) of details.split('\n')" :key="index">
          {{ detail }}
        </div>
      </div>

      <div v-else italic op-60>
        该地址的供应商未知
      </div>
    </c-card>

    <div flex justify-center>
      <c-button :disabled="!details" @click="copy()">
        复制
      </c-button>
    </div>
  </div>
</template>
