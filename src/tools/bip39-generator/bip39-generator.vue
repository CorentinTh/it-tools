<script setup lang="ts">
import {
  chineseSimplifiedWordList,
  chineseTraditionalWordList,
  czechWordList,
  englishWordList,
  entropyToMnemonic,
  frenchWordList,
  generateEntropy,
  italianWordList,
  japaneseWordList,
  koreanWordList,
  mnemonicToEntropy,
  portugueseWordList,
  spanishWordList,
} from '@it-tools/bip39';
import { Copy, Refresh } from '@vicons/tabler';

import { useCopy } from '@/composable/copy';
import { useValidation } from '@/composable/validation';
import { isNotThrowing } from '@/utils/boolean';
import { withDefaultOnError } from '@/utils/defaults';

const languages = {
  'English': englishWordList,
  'Chinese simplified': chineseSimplifiedWordList,
  'Chinese traditional': chineseTraditionalWordList,
  'Czech': czechWordList,
  'French': frenchWordList,
  'Italian': italianWordList,
  'Japanese': japaneseWordList,
  'Korean': koreanWordList,
  'Portuguese': portugueseWordList,
  'Spanish': spanishWordList,
};

const entropy = ref(generateEntropy());
const passphraseInput = ref('');

const language = ref<keyof typeof languages>('English');
const passphrase = computed({
  get() {
    return withDefaultOnError(() => entropyToMnemonic(entropy.value, languages[language.value]), passphraseInput.value);
  },
  set(value: string) {
    passphraseInput.value = value;
    entropy.value = withDefaultOnError(() => mnemonicToEntropy(value, languages[language.value]), '');
  },
});

const entropyValidation = useValidation({
  source: entropy,
  rules: [
    {
      validator: value => value === '' || (value.length <= 32 && value.length >= 16 && value.length % 4 === 0),
      message: 'Entropy length should be >= 16, <= 32 and be a multiple of 4',
    },
    {
      validator: value => /^[a-fA-F0-9]*$/.test(value),
      message: 'Entropy should be an hexadecimal string',
    },
  ],
});

const mnemonicValidation = useValidation({
  source: passphrase,
  rules: [
    {
      validator: value => isNotThrowing(() => mnemonicToEntropy(value, languages[language.value])),
      message: 'Invalid mnemonic',
    },
  ],
});

function refreshEntropy() {
  entropy.value = generateEntropy();
}

const { copy: copyEntropy } = useCopy({ source: entropy, text: 'Entropy copied to the clipboard' });
const { copy: copyPassphrase } = useCopy({ source: passphrase, text: 'Passphrase copied to the clipboard' });
</script>

<template>
  <div class="c-generator-layout">
    <c-card class="c-generator-options" title="Options">
      <div grid grid-cols-1 gap-3 md:grid-cols-2>
        <c-select
          v-model:value="language"
          searchable
          label="Language"
          :options="Object.keys(languages)"
        />
        <c-input-text
          v-model:value="entropy"
          label="Entropy (seed)"
          placeholder="Your hexadecimal entropy..."
          :validation="entropyValidation"
          monospace
        >
          <template #suffix>
            <c-button circle variant="text" aria-label="Generate new entropy" @click="refreshEntropy()">
              <n-icon size="22">
                <Refresh />
              </n-icon>
            </c-button>
            <c-button circle variant="text" aria-label="Copy entropy" @click="copyEntropy()">
              <n-icon size="22">
                <Copy />
              </n-icon>
            </c-button>
          </template>
        </c-input-text>
      </div>
    </c-card>

    <c-card class="c-generator-output" title="Mnemonic">
      <c-input-text
        v-model:value="passphrase"
        label="Passphrase (mnemonic)"
        placeholder="Your mnemonic..."
        :validation="mnemonicValidation"

        rows="4"

        monospace raw-text multiline
      />
      <div class="c-generator-actions mt-4">
        <c-button @click="copyPassphrase()">
          <n-icon size="22" :component="Copy" />
          Copy mnemonic
        </c-button>
      </div>
    </c-card>
  </div>
</template>
