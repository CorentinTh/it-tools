<script setup lang="ts" generic="T extends unknown">
import _ from 'lodash';
import type { CLabelProps } from '../c-label/c-label.types';
import type { CButtonSelectOption } from './c-buttons-select.types';

const props = withDefaults(
  defineProps<{
    options?: CButtonSelectOption<T>[] | string[] | Record<string, T>
    value?: T
    size?: 'small' | 'medium' | 'large'
    disabled?: boolean
  } & CLabelProps >(),
  {
    options: () => [],
    value: undefined,
    labelPosition: 'left',
    size: 'medium',
    disabled: false,
  },
);

const emits = defineEmits(['update:value']);

const labelProps = props as CLabelProps;
const { disabled, options: rawOptions, size } = toRefs(props);

const options = computed<CButtonSelectOption<T>[]>(() => {
  if (_.isArray(rawOptions.value)) {
    return rawOptions.value.map((option: string | CButtonSelectOption<T>) => {
      if (typeof option === 'string') {
        return { label: option, value: option };
      }

      return option;
    }) as CButtonSelectOption<T>[];
  }

  return _.map(rawOptions.value, (value, label) => ({ label, value })) as CButtonSelectOption<T>[];
});

const value = useVModel(props, 'value', emits);
const groupRef = ref<HTMLElement>();

function selectOption(option: CButtonSelectOption<T>) {
  if (disabled.value) {
    return;
  }

  // @ts-expect-error vue template generic is a bit flacky thanks to withDefaults
  value.value = option.value;
}

function handleKeydown(event: KeyboardEvent, index: number) {
  if (disabled.value) {
    return;
  }

  const lastIndex = options.value.length - 1;
  let nextIndex: number | undefined;

  if (['ArrowRight', 'ArrowDown'].includes(event.key)) {
    nextIndex = index === lastIndex ? 0 : index + 1;
  }
  else if (['ArrowLeft', 'ArrowUp'].includes(event.key)) {
    nextIndex = index === 0 ? lastIndex : index - 1;
  }
  else if (event.key === 'Home') {
    nextIndex = 0;
  }
  else if (event.key === 'End') {
    nextIndex = lastIndex;
  }

  if (nextIndex === undefined || nextIndex < 0) {
    return;
  }

  const targetIndex = nextIndex;
  event.preventDefault();
  selectOption(options.value[targetIndex]);
  nextTick(() => groupRef.value?.querySelectorAll<HTMLElement>('[role="radio"]')[targetIndex]?.focus());
}

function isFocusableOption(option: CButtonSelectOption<T>, index: number) {
  return option.value === value.value || (value.value === undefined && index === 0);
}
</script>

<template>
  <c-label
    :label="labelProps.label"
    :label-align="labelProps.labelAlign"
    :label-position="labelProps.labelPosition"
    :label-width="labelProps.labelWidth"
  >
    <div
      ref="groupRef"
      class="min-w-0 flex flex-wrap gap-2"
      role="radiogroup"
      :aria-label="labelProps.label"
      :aria-disabled="disabled ? 'true' : undefined"
    >
      <c-tooltip
        v-for="(option, index) in options" :key="String(option.value)"
        :tooltip="option.tooltip"
      >
        <c-button
          :data-test-id="option.value"
          :size="size"
          :type="option.value === value ? 'primary' : 'default'"
          :disabled="disabled"
          role="radio"
          :aria-checked="option.value === value"
          :tabindex="isFocusableOption(option, index) ? 0 : -1"
          @click="selectOption(option)"
          @keydown="handleKeydown($event, index)"
        >
          {{ option.label }}
        </c-button>
      </c-tooltip>
    </div>
  </c-label>
</template>
