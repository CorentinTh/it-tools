<script setup lang="ts">
import { AES, RC4, Rabbit, TripleDES, enc } from 'crypto-js';
import { computedCatch } from '@/composable/computed/catchedComputed';

const algos = { AES, TripleDES, Rabbit, RC4 };

const { t } = useI18n();

const cypherInput = ref('Lorem ipsum dolor sit amet');
const cypherAlgo = ref<keyof typeof algos>('AES');
const cypherSecret = ref('my secret key');
const cypherOutput = computed(() => algos[cypherAlgo.value].encrypt(cypherInput.value, cypherSecret.value).toString());

const decryptInput = ref('U2FsdGVkX18oguRKlUyr7Po25uzcRyz1DVR6+3ULIoQ/gvlXJ+JT+uVJkz+WmSEZ');
const decryptAlgo = ref<keyof typeof algos>('AES');
const decryptSecret = ref('my secret key');
const [decryptOutput, decryptError] = computedCatch(() => algos[decryptAlgo.value].decrypt(decryptInput.value, decryptSecret.value).toString(enc.Utf8), {
  defaultValue: '',
  defaultErrorMessage: t('tools.encryption.errorMessage'),
});
</script>

<template>
  <c-card :title="t('tools.encryption.encrypt.title')">
    <div flex gap-3>
      <c-input-text
        v-model:value="cypherInput"
        :label="t('tools.encryption.encrypt.inputLabel')"
        :placeholder="t('tools.encryption.encrypt.inputPlaceholder')"
        rows="4"
        multiline raw-text monospace autosize flex-1
      />
      <div flex flex-1 flex-col gap-2>
        <c-input-text v-model:value="cypherSecret" :label="t('tools.encryption.encrypt.secretLabel')" clearable raw-text />

        <c-select
          v-model:value="cypherAlgo"
          :label="t('tools.encryption.encrypt.algoLabel')"
          :options="Object.keys(algos).map((label) => ({ label, value: label }))"
        />
      </div>
    </div>
    <c-input-text
      :label="t('tools.encryption.encrypt.outputLabel')"
      :value="cypherOutput"
      rows="3"
      :placeholder="t('tools.encryption.encrypt.outputPlaceholder')"
      multiline monospace readonly autosize mt-5
    />
  </c-card>
  <c-card title="Decrypt">
    <div flex gap-3>
      <c-input-text
        v-model:value="decryptInput"
        :label="t('tools.encryption.decrypt.inputLabel')"
        :placeholder="t('tools.encryption.decrypt.inputPlaceholder')"
        rows="4"
        multiline raw-text monospace autosize flex-1
      />
      <div flex flex-1 flex-col gap-2>
        <c-input-text v-model:value="decryptSecret" :label="t('tools.encryption.decrypt.secretLabel')" clearable raw-text />

        <c-select
          v-model:value="decryptAlgo"
          :label="t('tools.encryption.decrypt.algoLabel')"
          :options="Object.keys(algos).map((label) => ({ label, value: label }))"
        />
      </div>
    </div>
    <c-alert v-if="decryptError" type="error" mt-12 :title="t('tools.encryption.decrypt.decryptError')">
      {{ decryptError }}
    </c-alert>
    <c-input-text
      v-else
      :label="t('tools.encryption.decrypt.outputLabel')"
      :value="decryptOutput"
      :placeholder="t('tools.encryption.decrypt.outputPlaceholder')"
      rows="3"
      multiline monospace readonly autosize mt-5
    />
  </c-card>
</template>
