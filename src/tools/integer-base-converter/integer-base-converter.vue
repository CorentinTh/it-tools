<template>
  <div>
    <c-card>
      <div v-if="styleStore.isSmallScreen">
        <n-input-group>
          <n-input-group-label style="flex: 0 0 120px"> Input number: </n-input-group-label>
          <n-input v-model:value="input" w-full :status="error ? 'error' : undefined" />
        </n-input-group>
        <n-input-group>
          <n-input-group-label style="flex: 0 0 120px"> Input base: </n-input-group-label>
          <n-input-number v-model:value="inputBase" max="64" min="2" w-full />
        </n-input-group>
      </div>

      <n-input-group v-else>
        <n-input-group-label style="flex: 0 0 120px"> Input number: </n-input-group-label>
        <n-input v-model:value="input" :status="error ? 'error' : undefined" />
        <n-input-group-label style="flex: 0 0 120px"> Input base: </n-input-group-label>
        <n-input-number v-model:value="inputBase" max="64" min="2" />
      </n-input-group>

      <n-alert v-if="error" style="margin-top: 25px" type="error">{{ error }}</n-alert>
      <n-divider />

      <input-copyable
        label="Binary (2)"
        v-bind="inputProps"
        :value="errorlessConvert({ value: input, fromBase: inputBase, toBase: 2 })"
        placeholder="Binary version will be here..."
      />

      <input-copyable
        label="Octal (8)"
        v-bind="inputProps"
        :value="errorlessConvert({ value: input, fromBase: inputBase, toBase: 8 })"
        placeholder="Octal version will be here..."
      />

      <input-copyable
        label="Decimal (10)"
        v-bind="inputProps"
        :value="errorlessConvert({ value: input, fromBase: inputBase, toBase: 10 })"
        placeholder="Decimal version will be here..."
      />

      <input-copyable
        label="Hexadecimal (16)"
        v-bind="inputProps"
        :value="errorlessConvert({ value: input, fromBase: inputBase, toBase: 16 })"
        placeholder="Hexadecimal version will be here..."
      />

      <input-copyable
        label="Base64 (64)"
        v-bind="inputProps"
        :value="errorlessConvert({ value: input, fromBase: inputBase, toBase: 64 })"
        placeholder="Base64 version will be here..."
      />

      <div flex items-baseline>
        <n-input-group style="width: 160px; margin-right: 10px">
          <n-input-group-label> Custom: </n-input-group-label>
          <n-input-number v-model:value="outputBase" max="64" min="2" />
        </n-input-group>

        <input-copyable
          flex-1
          v-bind="inputProps"
          :value="errorlessConvert({ value: input, fromBase: inputBase, toBase: outputBase })"
          :placeholder="`Base ${outputBase} will be here...`"
        />
      </div>
    </c-card>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useStyleStore } from '@/stores/style.store';
import { getErrorMessageIfThrows } from '@/utils/error';
import { convertBase } from './integer-base-converter.model';
import InputCopyable from '../../components/InputCopyable.vue';

const styleStore = useStyleStore();

const inputProps = {
  labelPosition: 'left',
  labelWidth: '170px',
  labelAlign: 'right',
  readonly: true,
  'mb-2': '',
} as const;

const input = ref('42');
const inputBase = ref(10);
const outputBase = ref(42);

function errorlessConvert(...args: Parameters<typeof convertBase>) {
  try {
    return convertBase(...args);
  } catch (err) {
    return '';
  }
}

const error = computed(() =>
  getErrorMessageIfThrows(() =>
    convertBase({ value: input.value, fromBase: inputBase.value, toBase: outputBase.value }),
  ),
);
</script>

<style lang="less" scoped>
.n-input-group:not(:first-child) {
  margin-top: 5px;
}
</style>
