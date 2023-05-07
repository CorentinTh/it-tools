<template>
  <div class="c-input-text" :class="{ disabled, error: !validation.isValid, 'label-left': labelPosition === 'left' }">
    <label v-if="label" :for="id" class="label"> {{ label }} </label>

    <div class="input-wrapper">
      <slot name="prefix" />

      <input
        :id="id"
        v-model="value"
        type="text"
        class="input"
        :placeholder="placeholder"
        :readonly="readonly"
        :disabled="disabled"
        :data-test-id="testId"
        :autocapitalize="autocapitalize ?? (rawText ? 'off' : undefined)"
        :autocomplete="autocomplete ?? (rawText ? 'off' : undefined)"
        :autocorrect="autocorrect ?? (rawText ? 'off' : undefined)"
        :spellcheck="spellcheck ?? (rawText ? false : undefined)"
      />

      <c-button v-if="clearable && value" variant="text" circle size="small" @click="value = ''">
        <icon-mdi-close />
      </c-button>
      <slot name="suffix" />
    </div>

    <span v-if="!validation.isValid" class="feedback"> {{ validation.message }} </span>
  </div>
</template>

<script lang="ts" setup>
import { generateRandomId } from '@/utils/random';
import { useValidation, type UseValidationRule } from '@/composable/validation';
import { useTheme } from './c-input-text.theme';
import { useAppTheme } from '../theme/themes';

const props = withDefaults(
  defineProps<{
    value?: string;
    id?: string;
    placeholder?: string;
    label?: string;
    readonly?: boolean;
    disabled?: boolean;
    validationRules?: UseValidationRule<string>[];
    labelPosition?: 'top' | 'left';
    labelWidth?: string;
    labelAlign?: 'left' | 'right';
    clearable?: boolean;
    testId?: string;
    autocapitalize?: 'none' | 'sentences' | 'words' | 'characters' | 'on' | 'off' | string;
    autocomplete?: 'on' | 'off' | string;
    autocorrect?: 'on' | 'off' | string;
    spellcheck?: 'true' | 'false' | boolean;
    rawText?: boolean;
  }>(),
  {
    value: '',
    id: generateRandomId,
    placeholder: 'Input text',
    label: undefined,
    readonly: false,
    disabled: false,
    validationRules: () => [],
    labelPosition: 'top',
    labelWidth: 'auto',
    labelAlign: 'left',
    clearable: false,
    testId: undefined,
    autocapitalize: undefined,
    autocomplete: undefined,
    autocorrect: undefined,
    spellcheck: undefined,
    rawText: false,
  },
);
const emit = defineEmits(['update:value']);
const value = useVModel(props, 'value', emit);

const { id, placeholder, label, validationRules, labelPosition, labelWidth, labelAlign } = toRefs(props);

const validation = useValidation({
  rules: validationRules,
  source: value,
});

const theme = useTheme();
const appTheme = useAppTheme();
</script>

<style lang="less" scoped>
.c-input-text {
  display: inline-flex;
  flex-direction: column;
  width: 100%;

  &.label-left {
    flex-direction: row;
    align-items: baseline;
  }

  &.error {
    & > .input {
      border-color: v-bind('appTheme.error.color');
      &:hover,
      &:focus {
        border-color: v-bind('appTheme.error.color');
      }

      &:focus {
        background-color: v-bind('appTheme.error.color + 22');
      }
    }

    & > .feedback {
      color: v-bind('appTheme.error.color');
    }
  }

  & > .label {
    margin-bottom: 5px;
    flex: 0 0 v-bind('labelWidth');
    text-align: v-bind('labelAlign');
    padding-right: 10px;
  }

  .input-wrapper {
    flex: 1 1 0;
    min-width: 0;

    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: v-bind('theme.backgroundColor');
    border: 1px solid v-bind('theme.borderColor');
    border-radius: 4px;
    padding: 0 4px 0 12px;

    & > .input {
      flex: 1 1 0;
      min-width: 0;

      padding: 8px 0;
      outline: none;
      transition: border-color 0.2s ease-in-out;
      background-color: transparent;
      background-image: none;
      -webkit-box-shadow: none;
      -moz-box-shadow: none;
      box-shadow: none;
      background-color: transparent;
      border: none;
      color: v-bind('appTheme.text.baseColor');

      &::placeholder {
        color: v-bind('appTheme.text.mutedColor');
      }
    }

    &:hover,
    &:focus {
      border-color: v-bind('appTheme.primary.color');
    }

    &:focus {
      background-color: v-bind('theme.focus.backgroundColor');
    }
  }

  &.error .input-wrapper {
    border-color: v-bind('appTheme.error.color');

    &:hover,
    &:focus {
      border-color: v-bind('appTheme.error.color');
    }

    &:focus {
      background-color: v-bind('appTheme.error.color + 22');
    }
  }

  &.disabled .input-wrapper {
    opacity: 0.5;

    &:hover,
    &:focus {
      border-color: v-bind('theme.borderColor');
    }

    & > .input {
      cursor: not-allowed;
    }
  }
}
</style>
