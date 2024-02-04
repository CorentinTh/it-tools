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
  '英语': englishWordList,
  '中文-简体': chineseSimplifiedWordList,
  '中文-繁体': chineseTraditionalWordList,
  '捷克语': czechWordList,
  '法语': frenchWordList,
  '意大利语': italianWordList,
  '日语': japaneseWordList,
  '韩语': koreanWordList,
  '葡萄牙语': portugueseWordList,
  '西班牙语': spanishWordList,
};

const entropy = ref(generateEntropy());
const passphraseInput = ref('');

const language = ref<keyof typeof languages>('英语');
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
      message: '熵长度应该大于等于16，小于等于32，并且是4的倍数',
    },
    {
      validator: value => /^[a-fA-F0-9]*$/.test(value),
      message: '熵应该是一个十六进制字符串',
    },
  ],
});

const mnemonicValidation = useValidation({
  source: passphrase,
  rules: [
    {
      validator: value => isNotThrowing(() => mnemonicToEntropy(value, languages[language.value])),
      message: '助记词无效',
    },
  ],
});

function refreshEntropy() {
  entropy.value = generateEntropy();
}

const { copy: copyEntropy } = useCopy({ source: entropy, text: '熵已复制到剪贴板' });
const { copy: copyPassphrase } = useCopy({ source: passphrase, text: '密码已复制到剪贴板' });
</script>

<template>
  <div>
    <n-grid cols="3" x-gap="12">
      <n-gi span="1">
        <c-select
          v-model:value="language"
          label="语言："
          :options="Object.keys(languages)"
        />
      </n-gi>
      <n-gi span="2">
        <n-form-item
          label="熵（种子）："
          :feedback="entropyValidation.message"
          :validation-status="entropyValidation.status"
        >
          <n-input-group>
            <c-input-text v-model:value="entropy" placeholder="字符串..." />

            <c-button @click="refreshEntropy()">
              <n-icon size="22">
                <Refresh />
              </n-icon>
            </c-button>
            <c-button @click="copyEntropy()">
              <n-icon size="22">
                <Copy />
              </n-icon>
            </c-button>
          </n-input-group>
        </n-form-item>
      </n-gi>
    </n-grid>
    <n-form-item
      label="密码（助记词）："
      :feedback="mnemonicValidation.message"
      :validation-status="mnemonicValidation.status"
    >
      <n-input-group>
        <c-input-text v-model:value="passphrase" placeholder="助记词..." raw-text />

        <c-button @click="copyPassphrase()">
          <n-icon size="22" :component="Copy" />
        </c-button>
      </n-input-group>
    </n-form-item>
  </div>
</template>
