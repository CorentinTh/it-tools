<script setup lang="ts">
import { randomNumber } from './pin-code-generator.service';
import { useCopy } from '@/composable/copy';
import { useQueryParamOrStorage } from '@/composable/queryParams';
import { computedRefreshable } from '@/composable/computedRefreshable';

const count = useQueryParamOrStorage({ name: 'count', storageName: 'pin-generator:count', defaultValue: 1 });
const length = useQueryParamOrStorage({ name: 'length', storageName: 'pin-generator:length', defaultValue: 6 });
const repeat = useQueryParamOrStorage({ name: 'repeat', storageName: 'pin-generator:repeat', defaultValue: true });

const [pins, refreshPins] = computedRefreshable(() =>
  Array.from({ length: count.value },
    () => randomNumber({
      length: length.value,
      repeatDigits: repeat.value,
    })).join('\n'),
);

const { copy } = useCopy({ source: pins, text: 'Pin code copied to clipboard!' });
</script>

<template>
  <div>
    <c-card>
      <n-form-item :label="`Number of digits (${length})`" label-placement="left">
        <n-slider v-model:value="length" :step="1" :min="1" :max="512" mr-2 />
        <n-input-number v-model:value="length" size="small" />
      </n-form-item>

      <n-form-item label="Allow repeated digits" label-placement="left">
        <n-switch v-model:value="repeat" />
      </n-form-item>

      <n-form-item label="Number of PIN codes to generate" label-placement="left">
        <n-input-number v-model:value="count" size="small" />
      </n-form-item>

      <c-input-text
        v-model:value="pins"
        multiline
        placeholder="PIN codes..."
        readonly
        rows="3"
        autosize
        class="pin-code-display"
        word-wrap
      />

      <div mt-5 flex justify-center gap-3>
        <c-button @click="copy()">
          Copy
        </c-button>
        <c-button @click="refreshPins">
          Refresh
        </c-button>
      </div>
    </c-card>
  </div>
</template>

<style scoped lang="less">
::v-deep(.pin-code-display) {
  textarea {
    text-align: center;
  }
}
</style>
