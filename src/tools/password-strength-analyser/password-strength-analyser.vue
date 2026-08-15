<script setup lang="ts">
import { getPasswordCrackTimeEstimation } from './password-strength-analyser.service';

const password = ref('');
const crackTimeEstimation = computed(() => getPasswordCrackTimeEstimation({ password: password.value }));

const details = computed(() => [
  {
    label: 'Password length',
    value: crackTimeEstimation.value.passwordLength,
  },
  {
    label: 'Entropy',
    value: Math.round(crackTimeEstimation.value.entropy * 100) / 100,
  },
  {
    label: 'Character set size',
    value: crackTimeEstimation.value.charsetLength,
  },
  {
    label: 'Score',
    value: `${Math.round(crackTimeEstimation.value.score * 100)} / 100`,
  },
]);
</script>

<template>
  <div class="c-form-layout">
    <c-input-text
      v-model:value="password"
      label="Password"
      type="password"
      placeholder="Enter a password..."
      clearable
      autofocus
      raw-text
      test-id="password-input"
    />

    <c-card text-center>
      <div op-60>
        Duration to crack this password with brute force
      </div>
      <div text-2xl data-test-id="crack-duration">
        {{ crackTimeEstimation.crackDurationFormatted }}
      </div>
    </c-card>
    <c-card title="Strength details">
      <c-key-value-list :items="details.map(item => ({ ...item, showCopyButton: false }))" />
    </c-card>
    <div op-70>
      <span font-bold>Note: </span>
      The computed strength is based on the time it would take to crack the password using a brute force approach, it does not take into account the possibility of a dictionary attack.
    </div>
  </div>
</template>
