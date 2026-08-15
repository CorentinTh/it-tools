<script setup lang="ts">
import { NInputNumber } from 'naive-ui';
import { generateRandomId } from '@/utils/random';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<{
  value?: number | null
  id?: string
  testId?: string
  ariaLabel?: string
  ariaDescribedby?: string
  ariaInvalid?: boolean
}>(), {
  value: null,
  id: generateRandomId,
  testId: undefined,
  ariaLabel: undefined,
  ariaDescribedby: undefined,
  ariaInvalid: false,
});

const emit = defineEmits<{
  (event: 'update:value', value: number | null): void
}>();

const attrs = useAttrs();
const root = ref<HTMLElement>();
const accessibleLabel = computed(() => props.ariaLabel ?? stringifyAttribute(attrs['aria-label']));

function stringifyAttribute(value: unknown) {
  return value === undefined || value === null ? undefined : String(value);
}

function syncInputAttributes() {
  const input = root.value?.querySelector('input');
  if (!input) {
    return;
  }

  input.id = props.id;
  input.setAttribute('role', 'spinbutton');

  const attributes = {
    'aria-label': accessibleLabel.value,
    'aria-describedby': props.ariaDescribedby,
    'aria-invalid': props.ariaInvalid ? 'true' : undefined,
    'aria-valuemin': stringifyAttribute(attrs.min),
    'aria-valuemax': stringifyAttribute(attrs.max),
    'aria-valuenow': stringifyAttribute(props.value),
    'aria-disabled': attrs.disabled ? 'true' : undefined,
  };

  for (const [name, value] of Object.entries(attributes)) {
    if (value === undefined) {
      input.removeAttribute(name);
    }
    else {
      input.setAttribute(name, value);
    }
  }

  const controlLabel = accessibleLabel.value
    ?? Array.from(input.labels ?? []).map(label => label.textContent?.trim()).find(Boolean)
    ?? 'value';
  const [decreaseButton, increaseButton] = root.value?.querySelectorAll('button') ?? [];
  decreaseButton?.setAttribute('aria-label', `Decrease ${controlLabel}`);
  increaseButton?.setAttribute('aria-label', `Increase ${controlLabel}`);
}

function focus() {
  root.value?.querySelector('input')?.focus();
}

function blur() {
  root.value?.querySelector('input')?.blur();
}

defineExpose({ focus, blur });

onMounted(() => nextTick(syncInputAttributes));
onUpdated(syncInputAttributes);
</script>

<template>
  <div ref="root" class="c-input-number" :data-test-id="testId">
    <NInputNumber
      v-bind="$attrs"
      :value="value"
      @update:value="emit('update:value', $event)"
    >
      <template v-if="$slots.prefix" #prefix>
        <slot name="prefix" />
      </template>
      <template v-if="$slots.suffix" #suffix>
        <slot name="suffix" />
      </template>
    </NInputNumber>
  </div>
</template>

<style scoped>
.c-input-number,
.c-input-number :deep(.n-input-number) {
  width: 100%;
  min-width: 0;
}
</style>
