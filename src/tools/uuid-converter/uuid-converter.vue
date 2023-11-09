<script setup lang="ts">
import InputCopyable from '../../components/InputCopyable.vue';
import { UUID2HEX, getVersion, normalizeUUID } from './uuid-converter.service';

const { t } = useI18n();
const input = ref('');

const formats = computed(() => [
  {
    label: t('tools.uuid-converter.uuid'),
    value: normalizeUUID(input.value),
  },
  {
    label: t('tools.uuid-converter.uuidhexupper'),
    value: UUID2HEX(input.value, true),
  },
  {
    label: t('tools.uuid-converter.uuidhexlower'),
    value: UUID2HEX(input.value, false),
  },
  {
    label: t('tools.uuid-converter.uuidversion'),
    value: getVersion(input.value).toString(),
  },
]);

const inputLabelAlignmentConfig = {
  labelPosition: 'left',
  labelWidth: '120px',
  labelAlign: 'right',
};
</script>

<template>
  <c-card>
    <c-input-text
      v-model:value="input"
      autofocus :label="t('tools.uuid-converter.input.label')" :placeholder="t('tools.uuid-converter.input.placeholder')" raw-text
      v-bind="inputLabelAlignmentConfig"
    />

    <div my-16px divider />

    <InputCopyable
      v-for="format in formats" :key="format.label" :value="format.value" :label="format.label"
      :readonly="true" v-bind="inputLabelAlignmentConfig" mb-1
    />
  </c-card>
</template>
