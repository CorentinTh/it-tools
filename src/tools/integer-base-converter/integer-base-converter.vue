<script setup lang="ts">
import InputCopyable from '../../components/InputCopyable.vue';
import { convertBase } from './integer-base-converter.model';
import CInputNumber from '@/ui/c-input-number/c-input-number.vue';
import { getErrorMessageIfThrows } from '@/utils/error';

const inputProps = {
  readonly: true,
} as const;

const input = ref('42');
const inputBase = ref(10);
const outputBase = ref(42);

function errorlessConvert(...args: Parameters<typeof convertBase>) {
  try {
    return convertBase(...args);
  }
  catch (err) {
    return '';
  }
}

const error = computed(() =>
  getErrorMessageIfThrows(() =>
    convertBase({ value: input.value, fromBase: inputBase.value, toBase: outputBase.value }),
  ),
);
</script>

<template>
  <div class="c-form-layout">
    <c-card>
      <div grid grid-cols-1 gap-3 md:grid-cols-2>
        <c-input-text v-model:value="input" label="Input number" placeholder="Put your number here (ex: 42)" />
        <c-field label="Input base (2–64)" label-for="integer-input-base">
          <CInputNumber id="integer-input-base" v-model:value="inputBase" :max="64" :min="2" />
        </c-field>
      </div>

      <n-alert v-if="error" style="margin-top: 25px" type="error">
        {{ error }}
      </n-alert>
    </c-card>

    <c-card>
      <div grid grid-cols-1 gap-3 md:grid-cols-2>
        <InputCopyable
          label="Binary (2)"
          v-bind="inputProps"
          :value="errorlessConvert({ value: input, fromBase: inputBase, toBase: 2 })"
          placeholder="Binary version will be here..."
        />

        <InputCopyable
          label="Octal (8)"
          v-bind="inputProps"
          :value="errorlessConvert({ value: input, fromBase: inputBase, toBase: 8 })"
          placeholder="Octal version will be here..."
        />

        <InputCopyable
          label="Decimal (10)"
          v-bind="inputProps"
          :value="errorlessConvert({ value: input, fromBase: inputBase, toBase: 10 })"
          placeholder="Decimal version will be here..."
        />

        <InputCopyable
          label="Hexadecimal (16)"
          v-bind="inputProps"
          :value="errorlessConvert({ value: input, fromBase: inputBase, toBase: 16 })"
          placeholder="Hexadecimal version will be here..."
        />

        <InputCopyable
          label="Base64 (64)"
          v-bind="inputProps"
          :value="errorlessConvert({ value: input, fromBase: inputBase, toBase: 64 })"
          placeholder="Base64 version will be here..."
        />

        <c-field label="Custom output base (2–64)" label-for="integer-output-base">
          <CInputNumber id="integer-output-base" v-model:value="outputBase" :max="64" :min="2" />
        </c-field>
        <InputCopyable
          v-bind="inputProps"
          :label="`Base ${outputBase}`"
          :value="errorlessConvert({ value: input, fromBase: inputBase, toBase: outputBase })"
          :placeholder="`Base ${outputBase} will be here...`"
        />
      </div>
    </c-card>
  </div>
</template>
