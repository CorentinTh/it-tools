<script setup lang="ts">
import { InfoCircle } from '@vicons/tabler';
import { createNanoid } from './nanoid-generator.service';
import { computedRefreshable } from '@/composable/computedRefreshable';
import { withDefaultOnError } from '@/utils/defaults';
import { useCopy } from '@/composable/copy';
import { useQueryParam } from '@/composable/queryParams';

const count = useQueryParam({ name: 'count', defaultValue: 1 });
const length = useQueryParam({ name: 'length', defaultValue: 21 });
const withUppercase = useQueryParam({ name: 'uppercase', defaultValue: true });
const withLowercase = useQueryParam({ name: 'lowercase', defaultValue: true });
const withNumbers = useQueryParam({ name: 'numbers', defaultValue: true });
const withSymbols = useQueryParam({ name: 'symbols', defaultValue: true });
const excludeLookalikes = useQueryParam({ name: 'no-lookalikes', defaultValue: false });

const { t } = useI18n();

const [nanoIds, refreshNanoIds] = computedRefreshable(() =>
  withDefaultOnError(
    () =>
      Array.from({ length: count.value }, (_ignored) => {
        const nanoId = createNanoid({
          length: length.value,
          withUppercase: withUppercase.value,
          withLowercase: withLowercase.value,
          withNumbers: withNumbers.value,
          withSymbols: withSymbols.value,
          excludeLookalikes: excludeLookalikes.value,
        });

        return nanoId();
      }).join('\n'),
    '',
  ),
);

const { copy } = useCopy({ source: nanoIds, text: 'NanoIds copied to the clipboard' });
</script>

<template>
  <div>
    <n-form label-placement="left" label-width="140">
      <div mb-8 flex justify-center gap-8>
        <div class="column">
          <div>
            <n-text>{{ t('tools.nanoid-generator.uppercase') }}</n-text>
            <c-tooltip
              tooltip="ABCDEFGHIJKLMNOPQRSTUVWXYZ" position="bottom"
            >
              <n-icon size="20" :component="InfoCircle" />
            </c-tooltip>
            <n-switch v-model:value="withUppercase" />
          </div>

          <div>
            <n-text>{{ t('tools.nanoid-generator.lowercase') }}</n-text>
            <c-tooltip
              tooltip="abcdefghijklmnopqrstuvwxyz" position="bottom"
            >
              <n-icon size="20" :component="InfoCircle" />
            </c-tooltip>
            <n-switch v-model:value="withLowercase" />
          </div>
        </div>

        <div class="column">
          <div>
            <n-text>
              {{ t('tools.nanoid-generator.numbers') }}
            </n-text>
            <c-tooltip
              tooltip="0123456789" position="bottom"
            >
              <n-icon size="20" :component="InfoCircle" />
            </c-tooltip>
            <n-switch v-model:value="withNumbers" />
          </div>

          <div>
            <n-text>
              {{ t('tools.nanoid-generator.symbols') }}
            </n-text>
            <c-tooltip
              tooltip="-_" position="bottom"
            >
              <n-icon size="20" :component="InfoCircle" />
            </c-tooltip>
            <n-switch v-model:value="withSymbols" />
          </div>
        </div>
        <div class="column">
          <div>
            <n-text>
              {{ t('tools.nanoid-generator.excludeLookalikes') }}
            </n-text>
            <c-tooltip
              tooltip="1lI0Oouv5Ss2Z" position="bottom"
            >
              <n-icon size="20" :component="InfoCircle" />
            </c-tooltip>
            <n-switch v-model:value="excludeLookalikes" />
          </div>
        </div>
      </div>
    </n-form>

    <div mb-2 flex items-center>
      <span w-100px>{{ t('tools.nanoid-generator.length') }}</span>
      <n-input-number v-model:value="length" flex-1 :min="1" :max="100" placeholder="NanoId Length" />
    </div>
    <div mb-2 flex items-center>
      <span w-100px>{{ t('tools.nanoid-generator.quantity') }}</span>
      <n-input-number v-model:value="count" flex-1 :min="1" :max="50" placeholder="NanoIds quantity" />
    </div>

    <c-input-text
      style="text-align: center; font-family: monospace"
      :value="nanoIds"
      placeholder="Your uuids"
      rows="1"
      autosize
      readonly
      raw-text
      multiline
      monospace
      my-3
      class="uuid-display"
    />

    <div flex justify-center gap-3>
      <c-button autofocus @click="copy()">
        {{ t('tools.nanoid-generator.button.copy') }}
      </c-button>
      <c-button @click="refreshNanoIds">
        {{ t('tools.nanoid-generator.button.refresh') }}
      </c-button>
    </div>
  </div>
</template>

<style scoped lang="less">
.n-icon {
  margin-right: 8px;
}

.n-text {
  margin-right: 8px;
}

.column {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
