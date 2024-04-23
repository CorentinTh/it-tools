<script setup lang="ts">
import { getPasswordCrackTimeEstimation } from './password-strength-analyser.service';

const { t } = useI18n();
const password = ref('');
const crackTimeEstimation = computed(() => getPasswordCrackTimeEstimation({ password: password.value }, t));

const details = computed(() => [
  {
    label: t('passwordStrengthAnalyser.pdwlength'),
    value: crackTimeEstimation.value.passwordLength,
  },
  {
    label: t('passwordStrengthAnalyser.crackDuration'),
    value: Math.round(crackTimeEstimation.value.entropy * 100) / 100,
  },
  {
    label: t('passwordStrengthAnalyser.charsetLength'),
    value: crackTimeEstimation.value.charsetLength,
  },
  {
    label: t('passwordStrengthAnalyser.score'),
    value: `${Math.round(crackTimeEstimation.value.score * 100)} / 100`,
  },
]);
</script>

<template>
  <div flex flex-col gap-3>
    <c-input-text
      v-model:value="password"
      type="password"
      :placeholder="$t('passwordStrengthAnalyser.passwordPlaceholder')"
      clearable
      autofocus
      raw-text
      test-id="password-input"
    />

    <c-card text-center>
      <div op-60>
        {{ $t('passwordStrengthAnalyser.crackTimeEstimation') }}
      </div>
      <div text-2xl data-test-id="crack-duration">
        {{ crackTimeEstimation.crackDurationFormatted }}
      </div>
    </c-card>
    <c-card>
      <div v-for="{ label, value } of details" :key="label" flex gap-3>
        <div flex-1 text-right op-60>
          {{ label }}
        </div>
        <div flex-1 text-left>
          {{ value }}
        </div>
      </div>
    </c-card>
    <div op-70>
      <span font-bold>{{ $t('passwordStrengthAnalyser.note') }} </span>
      {{ $t('passwordStrengthAnalyser.noteDescription') }}
    </div>
  </div>
</template>
