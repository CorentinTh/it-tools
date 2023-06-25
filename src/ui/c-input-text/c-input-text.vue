<script lang="ts" setup>
import { useAppTheme } from '../theme/themes';
import { useTheme } from './c-input-text.theme';
import { generateRandomId } from '@/utils/random';
import { type UseValidationRule, useValidation } from '@/composable/validation';

const props = withDefaults(
  defineProps<{
    value?: string
    id?: string
    placeholder?: string
    label?: string
    readonly?: boolean
    disabled?: boolean
    validationRules?: UseValidationRule<string>[]
    validationWatch?: Ref<unknown>[]
    validation?: ReturnType<typeof useValidation>
    labelPosition?: 'top' | 'left'
    labelWidth?: string
    labelAlign?: 'left' | 'right'
    clearable?: boolean
    testId?: string
    autocapitalize?: 'none' | 'sentences' | 'words' | 'characters' | 'on' | 'off' | string
    autocomplete?: 'on' | 'off' | string
    autocorrect?: 'on' | 'off' | string
    spellcheck?: 'true' | 'false' | boolean
    rawText?: boolean
    type?: 'text' | 'password'
    multiline?: boolean
    rows?: number | string
    autosize?: boolean
    autofocus?: boolean
    monospace?: boolean
  }>(),
  {
    value: '',
    id: generateRandomId,
    placeholder: 'Input text',
    label: undefined,
    readonly: false,
    disabled: false,
    validationRules: () => [],
    validationWatch: undefined,
    validation: undefined,
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
    type: 'text',
    multiline: false,
    rows: 3,
    autosize: false,
    autofocus: false,
    monospace: false,
  },
);
const emit = defineEmits(['update:value']);
const value = useVModel(props, 'value', emit);
const showPassword = ref(false);

const { id, placeholder, label, validationRules, labelPosition, labelWidth, labelAlign, autosize, readonly, disabled, clearable, type, multiline, rows, rawText, autofocus, monospace } = toRefs(props);

const validation
  = props.validation
  ?? useValidation({
    rules: validationRules,
    source: value,
    watch: props.validationWatch,
  });

const theme = useTheme();
const appTheme = useAppTheme();

const textareaRef = ref<HTMLTextAreaElement>();
const inputRef = ref<HTMLInputElement>();
const inputWrapperRef = ref<HTMLElement>();

watch(
  [value, autosize, multiline, inputWrapperRef, textareaRef],
  () => nextTick(() => {
    if (props.multiline && autosize.value) {
      resizeTextarea();
    }
  }),
  { immediate: true },
);

function resizeTextarea() {
  if (!textareaRef.value || !inputWrapperRef.value) {
    return;
  }

  const scrollHeight = textareaRef.value.scrollHeight + 2;

  inputWrapperRef.value.style.height = `${scrollHeight}px`;
}

const htmlInputType = computed(() => {
  if (props.type === 'password' && !showPassword.value) {
    return 'password';
  }

  return 'text';
});

function focus() {
  if (textareaRef.value) {
    textareaRef.value.focus();
  }

  if (inputRef.value) {
    inputRef.value.focus();
  }
}

function blur() {
  if (textareaRef.value) {
    textareaRef.value.blur?.();
  }

  if (inputRef.value) {
    inputRef.value.blur?.();
  }
}

onMounted(() => {
  if (autofocus.value) {
    focus();
  }
});

defineExpose({
  inputWrapperRef,
  focus,
  blur,
});
</script>

<template>
  <div
    class="c-input-text"
    :class="{ disabled, 'error': !validation.isValid, 'label-left': labelPosition === 'left', multiline }"
  >
    <label v-if="label" :for="id" class="label"> {{ label }} </label>

    <div class="feedback-wrapper">
      <div ref="inputWrapperRef" class="input-wrapper">
        <slot name="prefix" />

        <textarea
          v-if="multiline"
          :id="id"
          ref="textareaRef"
          v-model="value"
          class="input"
          :class="{
            'leading-5 !font-mono': monospace,
          }"
          :placeholder="placeholder"
          :readonly="readonly"
          :disabled="disabled"
          :data-test-id="testId"
          :autocapitalize="autocapitalize ?? (rawText ? 'off' : undefined)"
          :autocomplete="autocomplete ?? (rawText ? 'off' : undefined)"
          :autocorrect="autocorrect ?? (rawText ? 'off' : undefined)"
          :spellcheck="spellcheck ?? (rawText ? false : undefined)"
          :rows="rows"
        />

        <input
          v-else
          :id="id"
          ref="inputRef"
          v-model="value"
          :type="htmlInputType"
          class="input"
          :class="{
            'leading-5 !font-mono': monospace,
          }"
          size="1"
          :placeholder="placeholder"
          :readonly="readonly"
          :disabled="disabled"
          :data-test-id="testId"
          :autocapitalize="autocapitalize ?? (rawText ? 'off' : undefined)"
          :autocomplete="autocomplete ?? (rawText ? 'off' : undefined)"
          :autocorrect="autocorrect ?? (rawText ? 'off' : undefined)"
          :spellcheck="spellcheck ?? (rawText ? false : undefined)"
        >

        <c-button v-if="clearable && value" variant="text" circle size="small" @click="value = ''">
          <icon-mdi-close />
        </c-button>

        <c-button v-if="type === 'password'" variant="text" circle size="small" @click="showPassword = !showPassword">
          <icon-mdi-eye v-if="!showPassword" />
          <icon-mdi-eye-off v-if="showPassword" />
        </c-button>
        <slot name="suffix" />
      </div>
      <span v-if="!validation.isValid" class="feedback"> {{ validation.message }} </span>
    </div>
  </div>
</template>

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

    & .feedback {
      color: v-bind('appTheme.error.color');
    }
  }

  & > .label {
    margin-bottom: 5px;
    flex: 0 0 v-bind('labelWidth');
    text-align: v-bind('labelAlign');
    padding-right: 12px;
  }

  .feedback-wrapper {
    flex: 1 1 0;
    min-width: 0;
  }
  .input-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: v-bind('theme.backgroundColor');
    color: transparent;
    border: 1px solid v-bind('theme.borderColor');
    border-radius: 4px;
    padding: 0 4px 0 12px;
    transition: border-color 0.2s ease-in-out;

    .multiline& {
      resize: vertical;
      overflow: hidden;

      & > textarea {
        height: 100%;
        resize: none;
        word-break: break-word;
        white-space: pre-wrap;
        overflow-wrap: break-word;
        border: none;
        outline: none;
        font-family: inherit;
        font-size: inherit;
        color: v-bind('appTheme.text.baseColor');

        &::placeholder {
          color: v-bind('appTheme.text.mutedColor');
        }
      }
    }

    & > .input {
      flex: 1 1 0;
      min-width: 0;

      padding: 8px 0;
      outline: none;
      background-color: transparent;
      background-image: none;
      -webkit-box-shadow: none;
      -moz-box-shadow: none;
      box-shadow: none;
      border: none;
      color: v-bind('appTheme.text.baseColor');

      &::placeholder {
        color: v-bind('appTheme.text.mutedColor');
      }
    }

    &:hover {
      border-color: v-bind('appTheme.primary.color');
    }

    &:focus-within {
      border-color: v-bind('appTheme.primary.color');

      background-color: v-bind('theme.focus.backgroundColor');
    }
  }

  &.error .input-wrapper {
    border-color: v-bind('appTheme.error.color');

    &:hover,
    &:focus-within {
      border-color: v-bind('appTheme.error.color');
    }

    &:focus-within {
      background-color: v-bind('appTheme.error.color + 22');
    }
  }

  &.disabled .input-wrapper {
    opacity: 0.5;

    &:hover,
    &:focus-within {
      border-color: v-bind('theme.borderColor');
    }

    & > .input {
      cursor: not-allowed;
    }
  }
}
</style>
