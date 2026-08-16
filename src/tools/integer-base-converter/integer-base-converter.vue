<script setup lang="ts">
import InputCopyable from '../../components/InputCopyable.vue';
import { INTEGER_INPUT_MAX_LENGTH, formatInteger, parseInteger } from './integer-base-converter.model';
import CInputNumber from '@/ui/c-input-number/c-input-number.vue';
import { getErrorMessageIfThrows } from '@/utils/error';

const inputProps = {
  readonly: true,
} as const;

const input = ref('42');
const inputBase = ref(10);
const outputBase = ref(42);

const parsedValue = computed(() => parseInteger({ value: input.value, base: inputBase.value }));

function formatted(base: number) {
  try {
    return formatInteger({ value: parsedValue.value, base });
  }
  catch {
    return '';
  }
}

const error = computed(() =>
  getErrorMessageIfThrows(() => formatInteger({ value: parsedValue.value, base: outputBase.value })),
);
</script>

<template>
  <div class="c-form-layout">
    <c-card>
      <div grid grid-cols-1 gap-3 md:grid-cols-2>
        <c-input-text v-model:value="input" label="Input number" placeholder="For example: -0xFF or 1010b" :maxlength="INTEGER_INPUT_MAX_LENGTH" monospace />
        <c-field label="Input base (2–64)" label-for="integer-input-base">
          <CInputNumber id="integer-input-base" v-model:value="inputBase" :max="64" :min="2" />
        </c-field>
      </div>

      <n-alert v-if="error" style="margin-top: 25px" type="error">
        {{ error }}
      </n-alert>
      <n-alert v-else type="info" mt-4>
        Bases 2, 8, 10, and 16 accept matching 0b/0o/0d/0x prefixes or b/o/d/h suffixes. Digits are case-insensitive through base 36; bases 37–64 preserve case because A–Z are distinct digits.
      </n-alert>
    </c-card>

    <c-card>
      <div grid grid-cols-1 gap-3 md:grid-cols-2>
        <InputCopyable
          label="Binary (2)"
          v-bind="inputProps"
          :value="formatted(2)"
          placeholder="Binary version will be here..."
        />

        <InputCopyable
          label="Octal (8)"
          v-bind="inputProps"
          :value="formatted(8)"
          placeholder="Octal version will be here..."
        />

        <InputCopyable
          label="Decimal (10)"
          v-bind="inputProps"
          :value="formatted(10)"
          placeholder="Decimal version will be here..."
        />

        <InputCopyable
          label="Hexadecimal (16)"
          v-bind="inputProps"
          :value="formatted(16)"
          placeholder="Hexadecimal version will be here..."
        />

        <InputCopyable
          label="Base64 (64)"
          v-bind="inputProps"
          :value="formatted(64)"
          placeholder="Base64 version will be here..."
        />

        <c-field label="Custom output base (2–64)" label-for="integer-output-base">
          <CInputNumber id="integer-output-base" v-model:value="outputBase" :max="64" :min="2" />
        </c-field>
        <InputCopyable
          v-bind="inputProps"
          :label="`Base ${outputBase}`"
          :value="formatted(outputBase)"
          :placeholder="`Base ${outputBase} will be here...`"
        />
      </div>
    </c-card>
  </div>
</template>
