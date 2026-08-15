<script setup lang="ts">
import { NSlider } from 'naive-ui';
import CField from '@/ui/c-field/c-field.vue';
import { generateRandomId } from '@/utils/random';

type SliderValue = number | number[];

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<{
  value?: SliderValue
  id?: string
  label: string
  description?: string
  min?: number
  max?: number
  step?: number
  range?: boolean
  disabled?: boolean
  testId?: string
}>(), {
  value: 0,
  id: generateRandomId,
  description: undefined,
  min: 0,
  max: 100,
  step: 1,
  range: false,
  disabled: false,
  testId: undefined,
});

const emit = defineEmits<{
  (event: 'update:value', value: SliderValue): void
}>();

const root = ref<HTMLElement>();
const fieldId = computed(() => `${props.id}-field`);
const labelId = computed(() => `${fieldId.value}-label`);

function syncHandleAttributes() {
  const handles = root.value?.querySelectorAll<HTMLElement>('.n-slider-handle-wrapper');
  if (!handles?.length) {
    return;
  }

  const values = Array.isArray(props.value) ? props.value : [props.value];

  handles.forEach((handle, index) => {
    const currentValue = values[index] ?? values[0];
    handle.id = `${props.id}-handle-${index + 1}`;
    handle.setAttribute('role', 'slider');
    handle.setAttribute('aria-labelledby', labelId.value);
    handle.setAttribute('aria-orientation', 'horizontal');
    handle.setAttribute('aria-valuemin', String(props.min));
    handle.setAttribute('aria-valuemax', String(props.max));
    handle.setAttribute('aria-valuenow', String(currentValue));

    if (props.range) {
      handle.setAttribute('aria-valuetext', `${index === 0 ? 'Minimum' : 'Maximum'} ${currentValue}`);
    }
    else {
      handle.removeAttribute('aria-valuetext');
    }

    if (props.disabled) {
      handle.setAttribute('aria-disabled', 'true');
    }
    else {
      handle.removeAttribute('aria-disabled');
    }

    if (props.testId) {
      handle.dataset.testId = props.range ? `${props.testId}-${index + 1}` : props.testId;
    }
  });
}

onMounted(() => nextTick(syncHandleAttributes));
onUpdated(syncHandleAttributes);
</script>

<template>
  <CField
    :id="fieldId"
    :label="label"
    :description="description"
    :disabled="disabled"
  >
    <div ref="root" class="c-slider">
      <NSlider
        v-bind="$attrs"
        :value="value"
        :min="min"
        :max="max"
        :step="step"
        :range="range"
        :disabled="disabled"
        @update:value="emit('update:value', $event)"
      />
    </div>
  </CField>
</template>

<style scoped>
.c-slider {
  width: 100%;
  min-width: 0;
  padding: 0 var(--ui-space-2);
}
</style>
