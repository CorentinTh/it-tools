<script setup lang="ts">
import { AES, RC4, Rabbit, TripleDES, enc } from 'crypto-js';

const algos = { AES, TripleDES, Rabbit, RC4 };
const { t } = useI18n();
const cypherInput = ref(t('tools.encryption.encrypt.text.default'));
const cypherAlgo = ref<keyof typeof algos>('AES');
const cypherSecret = ref(t('tools.encryption.encrypt.secretKey.default'));
const cypherOutput = computed(() => algos[cypherAlgo.value].encrypt(cypherInput.value, cypherSecret.value).toString());

const decryptInput = ref(t('tools.encryption.decrypt.encrypted.default'));
const decryptAlgo = ref<keyof typeof algos>('AES');
const decryptSecret = ref(t('tools.encryption.decrypt.secretKey.default'));
const decryptOutput = computed(() =>
  algos[decryptAlgo.value].decrypt(decryptInput.value, decryptSecret.value).toString(enc.Utf8),
);
</script>

<template>
  <c-card title="Encrypt">
    <div flex gap-3>
      <c-input-text
        v-model:value="cypherInput"
        :label="`${t('tools.encryption.encrypt.text.label')}: `"
        :placeholder="t('tools.encryption.encrypt.text.placeholder')"
        rows="4"
        multiline raw-text monospace autosize flex-1
      />
      <div flex flex-1 flex-col gap-2>
        <c-input-text v-model:value="cypherSecret" :label="`${t('tools.encryption.encrypt.secretKey.label')}:`" clearable raw-text />

        <c-select
          v-model:value="cypherAlgo"
          :label="`${t('tools.encryption.encrypt.algorithm.label')}:`"
          :options="Object.keys(algos).map((label) => ({ label, value: label }))"
        />
      </div>
    </div>
    <c-input-text
      :label="`${t('tools.encryption.encrypt.encrypted.label')}:`"
      :value="cypherOutput"
      rows="3"
      :placeholder="t('tools.encryption.encrypt.encrypted.placeholder')"
      multiline monospace readonly autosize mt-5
    />
  </c-card>
  <c-card title="Decrypt">
    <div flex gap-3>
      <c-input-text
        v-model:value="decryptInput"
        :label="`${t('tools.encryption.decrypt.encrypted.label')}:`"
        :placeholder="t('tools.encryption.decrypt.encrypted.placeholder')"
        rows="4"
        multiline raw-text monospace autosize flex-1
      />
      <div flex flex-1 flex-col gap-2>
        <c-input-text v-model:value="decryptSecret" :label="`${t('tools.encryption.decrypt.secretKey.label')}:`" clearable raw-text />

        <c-select
          v-model:value="decryptAlgo"
          :label="`${t('tools.encryption.decrypt.algorithm.label')}:`"
          :options="Object.keys(algos).map((label) => ({ label, value: label }))"
        />
      </div>
    </div>
    <c-input-text
      :label="`${t('tools.encryption.decrypt.text.label')}:`"
      :value="decryptOutput"
      :placeholder="t('tools.encryption.decrypt.text.placeholder')"
      rows="3"
      multiline monospace readonly autosize mt-5
    />
  </c-card>
</template>
