<script setup lang="ts">
import { generateSillyPassword } from 'silly-password-generator';
import { useCopy } from '@/composable/copy';
import { useQueryParamOrStorage } from '@/composable/queryParams';
import { computedRefreshable } from '@/composable/computedRefreshable';

const count = useQueryParamOrStorage({ name: 'count', storageName: 'pass-generator:count', defaultValue: 1 });
const words = useQueryParamOrStorage({ name: 'words', storageName: 'pass-generator:words', defaultValue: 5 });
const capitalize = useQueryParamOrStorage({ name: 'capitalize', storageName: 'pass-generator:capitalize', defaultValue: false });
const saltChars = useQueryParamOrStorage({ name: 'salt', storageName: 'pass-generator:salt', defaultValue: '' });
const separator = useQueryParamOrStorage({ name: 'sep', storageName: 'pass-generator:sep', defaultValue: '-' });

const [passphrases, refreshPassphrases] = computedRefreshable(() =>
  Array.from({ length: count.value },
    () => generateSillyPassword({
      capitalize: capitalize.value,
      wordCount: words.value,
      salt: saltChars.value,
    }).replace(/\s+/g, separator.value)).join('\n'),
);

const { copy } = useCopy({ source: passphrases, text: 'Passphrase(s) copied to clipboard!' });
</script>

<template>
  <div>
    <c-card>
      <n-form-item :label="`Words (${words})`" label-placement="left">
        <n-slider v-model:value="words" :step="1" :min="1" :max="512" mr-2 />
        <n-input-number v-model:value="words" size="small" />
      </n-form-item>

      <n-space>
        <n-form-item label="Capitalize" label-placement="left">
          <n-switch v-model:value="capitalize" />
        </n-form-item>
        <n-form-item label="Separator" label-placement="left">
          <c-input-text
            v-model:value="separator"
            placeholder="Put separator char"
          />
        </n-form-item>
      </n-space>

      <n-form-item label="Ending Salt Chars" label-placement="left">
        <c-input-text
          v-model:value="saltChars"
          placeholder="Put characters to appended to end of passphrase"
        />
      </n-form-item>

      <n-form-item label="Number of passphrase to generate" label-placement="left">
        <n-input-number v-model:value="count" size="small" />
      </n-form-item>

      <c-input-text
        v-model:value="passphrases"
        multiline
        placeholder="Passphrase..."
        readonly
        rows="3"
        autosize
        class="passphrase-display"
        word-wrap
      />

      <div mt-5 flex justify-center gap-3>
        <c-button @click="copy()">
          Copy
        </c-button>
        <c-button @click="refreshPassphrases">
          Refresh
        </c-button>
      </div>
    </c-card>
  </div>
</template>

<style scoped lang="less">
::v-deep(.passphrase-display) {
  textarea {
    text-align: center;
  }
}
</style>
