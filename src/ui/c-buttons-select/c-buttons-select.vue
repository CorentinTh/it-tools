<script setup lang="ts" generic="T extends unknown">
import type { CLabelProps } from '../c-label/c-label.types';
import type { CButtonSelectOption } from './c-buttons-select.types';
import _ from 'lodash';

const props = withDefaults(
  defineProps<{
    options?: readonly CButtonSelectOption<T>[] | readonly string[] | Record<string, T>
    value?: T
    size?: 'small' | 'medium' | 'large'
  } & CLabelProps>(),
  {
    // eslint-disable-next-line vue/require-valid-default-prop -- The rule does not recognize readonly array types as arrays.
    options: () => [],
    value: undefined,
    labelPosition: 'left',
    size: 'medium',
  },
);

const emits = defineEmits(['update:value']);

const { options: rawOptions } = toRefs(props);

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

function selectOption(option: CButtonSelectOption<T>) {
  // @ts-expect-error vue template generic is a bit flacky thanks to withDefaults
  value.value = option.value;
}
</script>

<template>
  <c-label v-bind="props">
    <div class="flex gap-2">
      <c-tooltip
        v-for="option in options" :key="option.label"
        :tooltip="option.tooltip"
      >
        <c-button
          :test-id="option.value"
          :size="props.size"
          :type="option.value === value ? 'primary' : 'default'"
          @click="selectOption(option)"
        >
          {{ option.label }}
        </c-button>
      </c-tooltip>
    </div>
  </c-label>
</template>
