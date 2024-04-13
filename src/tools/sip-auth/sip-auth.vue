<script setup lang="ts">
import { getAuthHeaderCheckResult } from './sip-auth.service';

const password = ref('');
const { t } = useI18n();

function transformer(value: string) {
  if (value !== '' && password.value !== '') {
    const Result = getAuthHeaderCheckResult({ message: value, password: password.value });
    if (Result) {
      return t('tools.sip-auth.sucess');
    }
    else {
      return t('tools.sip-auth.failure');
      // return `11 calculatedHash: ${calculatedHash}, response: ${response}`;
    }
  }
}
</script>

<template>
  <div flex flex-col gap-4>
    <c-input-text
      v-model:value="password"
      type="password"
      :placeholder="$t('tools.sip-auth.password-tips')"
      autofocus
      raw-text
      :label="$t('tools.sip-auth.password')"
    />
    <format-transformer
      :input-label="$t('tools.sip-auth.message')"
      :input-placeholder="$t('tools.sip-auth.message-tips')"
      :output-label="$t('tools.sip-auth.result')"
      :transformer="transformer"
      autosize
    />
  </div>
</template>
