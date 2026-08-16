<script setup lang="ts">
import { PASSPHRASE_MAX_SEPARATOR_LENGTH, PASSPHRASE_MAX_WORDS, PASSPHRASE_MIN_WORDS, PASSPHRASE_WORD_LIST_ID, generatePassphrase } from './passphrase-generator.service';
import CInputNumber from '@/ui/c-input-number/c-input-number.vue';
import CSwitch from '@/ui/c-switch/c-switch.vue';
import { useCopy } from '@/composable/copy';

const wordCount = ref(6);
const separator = ref('-');
const capitalize = ref(false);
const appendNumber = ref(false);
const appendSymbol = ref(false);
const output = ref('');
const entropy = ref(0);
const error = ref('');
const generatedSignature = ref('');
const signature = computed(() => `${wordCount.value}\0${separator.value}\0${capitalize.value}\0${appendNumber.value}\0${appendSymbol.value}`);
const stale = computed(() => Boolean(output.value && generatedSignature.value !== signature.value));

function generate() {
  error.value = '';
  try {
    const result = generatePassphrase({
      wordCount: wordCount.value,
      separator: separator.value,
      capitalize: capitalize.value,
      appendNumber: appendNumber.value,
      appendSymbol: appendSymbol.value,
    });
    output.value = result.value;
    entropy.value = result.entropyBits;
    generatedSignature.value = signature.value;
  }
  catch (caught) {
    error.value = caught instanceof Error ? caught.message : 'Passphrase generation failed.';
  }
}

function clear() {
  output.value = '';
  entropy.value = 0;
  generatedSignature.value = '';
  error.value = '';
}

const { copy } = useCopy({ source: output, text: 'Passphrase copied to the clipboard' });
generate();
</script>

<template>
  <div class="c-generator-layout">
    <c-alert title="Local, ephemeral generation">
      Uses Web Crypto and the route-local {{ PASSPHRASE_WORD_LIST_ID }} list. Generated passphrases are not saved or sent anywhere. This is a general password generator, not a BIP39 wallet mnemonic.
    </c-alert>
    <c-card class="c-generator-options" title="Options">
      <div grid grid-cols-1 gap-3 md:grid-cols-2>
        <c-field label="Words" label-for="passphrase-word-count">
          <CInputNumber id="passphrase-word-count" v-model:value="wordCount" :min="PASSPHRASE_MIN_WORDS" :max="PASSPHRASE_MAX_WORDS" />
        </c-field>
        <c-input-text v-model:value="separator" label="Separator" :maxlength="PASSPHRASE_MAX_SEPARATOR_LENGTH" raw-text />
        <CSwitch v-model:value="capitalize" label="Capitalize each word" />
        <CSwitch v-model:value="appendNumber" label="Append one random digit" />
        <CSwitch v-model:value="appendSymbol" label="Append one random symbol" />
      </div>
    </c-card>
    <c-alert v-if="error" title="Invalid passphrase options" data-test-id="passphrase-error">
      {{ error }}
    </c-alert>
    <c-alert v-if="stale" title="Result uses previous options">
      Generate again to apply the current options.
    </c-alert>
    <c-card title="Entropy guidance" data-test-id="passphrase-entropy">
      <p><strong>{{ entropy.toFixed(2) }} bits</strong> from independently selected words and enabled random suffixes.</p>
      <p mt-2 text-sm op-70>
        Capitalization and separators are formatting choices and do not add entropy. Site-specific password rules and compromised endpoints can still reduce real security.
      </p>
    </c-card>
    <c-input-text class="c-generator-output" :value="output" label="Generated passphrase" data-test-id="passphrase-output" raw-text readonly monospace multiline :rows="5" />
    <div class="c-generator-actions">
      <c-button type="primary" data-test-id="passphrase-generate" @click="generate">
        Generate
      </c-button>
      <c-button :disabled="!output" @click="copy()">
        Copy
      </c-button>
      <c-button :disabled="!output" @click="clear">
        Clear
      </c-button>
    </div>
  </div>
</template>
