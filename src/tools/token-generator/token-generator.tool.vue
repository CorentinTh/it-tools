<template>
  <div>
    <n-card>
      <n-form label-placement="left" label-width="140">
        <n-space justify="center" item-style="padding: 0" :size="0">
          <div>
            <n-form-item label="Uppercase (ABC...)">
              <n-switch v-model:value="withUppercase" />
            </n-form-item>

            <n-form-item label="Lowercase (abc...)">
              <n-switch v-model:value="withLowercase" />
            </n-form-item>
          </div>

          <div>
            <n-form-item label="Numbers (012...)">
              <n-switch v-model:value="withNumbers" />
            </n-form-item>

            <n-form-item label="Symbols (;-!...)">
              <n-switch v-model:value="withSymbols" />
            </n-form-item>
          </div>
        </n-space>
      </n-form>

      <n-form-item :label="`Length (${length})`" label-placement="left">
        <n-slider v-model:value="length" :step="1" :min="1" :max="512" />
      </n-form-item>

      <n-input
        v-model:value="token"
        style="text-align: center"
        type="textarea"
        placeholder="The token..."
        :autosize="{ minRows: 1 }"
        readonly
        autocomplete="off"
        autocorrect="off"
        autocapitalize="off"
        spellcheck="false"
      />
      <br />
      <br />
      <n-space justify="center">
        <n-button secondary autofocus @click="copy"> Copy </n-button>
        <n-button secondary @click="refreshToken"> Refresh </n-button>
      </n-space>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { useCopy } from '@/composable/copy';
import { ref, watch } from 'vue';
import { useQueryParam } from '@/composable/queryParams';
import { createToken } from './token-generator.service';

const token = ref('');
const length = useQueryParam({ name: 'length', defaultValue: 64 });
const { copy } = useCopy({ source: token, text: 'Token copied to the clipboard' });

const withUppercase = useQueryParam({ name: 'uppercase', defaultValue: true });
const withLowercase = useQueryParam({ name: 'lowercase', defaultValue: true });
const withNumbers = useQueryParam({ name: 'numbers', defaultValue: true });
const withSymbols = useQueryParam({ name: 'symbols', defaultValue: false });

watch([withUppercase, withLowercase, withNumbers, withSymbols, length], refreshToken, { immediate: true });

function refreshToken() {
  token.value = createToken({
    length: length.value,
    withUppercase: withUppercase.value,
    withLowercase: withLowercase.value,
    withNumbers: withNumbers.value,
    withSymbols: withSymbols.value,
  });
}
</script>
