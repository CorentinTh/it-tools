<script setup lang="ts">
import { stringifyIp } from 'ip-bigint';
import InputCopyable from '../../components/InputCopyable.vue';
import { convertBase, hasNumberPrefix } from '../integer-base-converter/integer-base-converter.model';

const input = ref('3232235777');
const inputBase = ref(10);

const hasInputNumberPrefix = computed(() => hasNumberPrefix(input.value));

function convertToIP({ value, fromBase, version }: { value: string; fromBase: number; version: 6 | 4 }): string {
  try {
    return stringifyIp({
      number: BigInt(convertBase({
        value,
        fromBase,
        toBase: 10,
      })),
      version,
    }) ?? 'Invalid IP';
  }
  catch (err) {
    return err?.toString() ?? 'Invalid IP';
  }
}
</script>

<template>
  <div>
    <c-card>
      <c-input-text v-model:value="input" label="Input number" placeholder="Put your number here (ex: 3232235777)" label-position="left" label-width="110px" mb-2 label-align="right" />

      <n-form-item v-if="!hasInputNumberPrefix" label="Input base" label-placement="left" label-width="110" :show-feedback="false">
        <c-select
          v-model:value="inputBase"
          :options="[{ value: 2, label: 'Binary' }, { value: 8, label: 'Octal' }, { value: 10, label: 'Decimal' }, { value: 16, label: 'Hexadecimal' }]"
          placeholder="Select a base"
          w-100px
        />
      </n-form-item>

      <n-divider />

      <InputCopyable
        label="Formatted IPv4"
        label-position="left" label-width="110px" mb-2 label-align="right"
        :value="convertToIP({ value: input, fromBase: inputBase, version: 4 })"
        placeholder="Formatted IPv4 will be here..."
      />

      <InputCopyable
        label="Formatted IPv6"
        label-position="left" label-width="110px" mb-2 label-align="right"
        :value="convertToIP({ value: input, fromBase: inputBase, version: 6 })"
        placeholder="Formatted IPv6 will be here..."
      />
    </c-card>
  </div>
</template>

<style lang="less" scoped>
.n-input-group:not(:first-child) {
  margin-top: 5px;
}
</style>
