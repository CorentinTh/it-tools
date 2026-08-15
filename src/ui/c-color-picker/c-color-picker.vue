<script setup lang="ts">
import { NColorPicker } from 'naive-ui';
import { generateRandomId } from '@/utils/random';

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<{
  value?: string
  id?: string
  ariaLabel?: string
  testId?: string
}>(), {
  value: undefined,
  id: generateRandomId,
  ariaLabel: undefined,
  testId: undefined,
});

const emit = defineEmits<{
  (event: 'update:value', value: string): void
}>();

const attrs = useAttrs();
const root = ref<HTMLElement>();
const accessibleLabel = computed(() => props.ariaLabel ?? String(attrs['aria-label'] ?? 'Color'));

function syncTriggerAttributes() {
  const trigger = root.value?.querySelector<HTMLElement>('.n-color-picker-trigger');
  if (!trigger) {
    return;
  }

  trigger.id = props.id;
  trigger.setAttribute('role', 'button');
  trigger.setAttribute('aria-label', accessibleLabel.value);
  trigger.setAttribute('aria-haspopup', 'dialog');
  trigger.setAttribute('aria-disabled', attrs.disabled ? 'true' : 'false');
  trigger.tabIndex = attrs.disabled ? -1 : 0;
}

function handleKeydown(event: KeyboardEvent) {
  const trigger = root.value?.querySelector<HTMLElement>('.n-color-picker-trigger');
  if (!trigger || event.target !== trigger || attrs.disabled || (event.key !== 'Enter' && event.key !== ' ')) {
    return;
  }

  event.preventDefault();
  trigger.click();
}

onMounted(() => nextTick(syncTriggerAttributes));
onUpdated(syncTriggerAttributes);

function handleUpdateValue(value: string | null) {
  if (value !== null) {
    emit('update:value', value);
  }
}
</script>

<template>
  <div ref="root" class="c-color-picker" :data-test-id="testId" @keydown="handleKeydown">
    <NColorPicker
      v-bind="$attrs"
      :value="value"
      @update:value="handleUpdateValue"
    />
  </div>
</template>

<style scoped>
.c-color-picker,
.c-color-picker :deep(.n-color-picker) {
  width: 100%;
  min-width: 0;
}
</style>
