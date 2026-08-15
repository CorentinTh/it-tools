<script setup lang="ts">
import { NCheckbox } from 'naive-ui';
import { C_CHOICE_GROUP_DISABLED } from './c-choice-group.context';
import { generateRandomId } from '@/utils/random';

const props = withDefaults(defineProps<{
  checked?: boolean
  id?: string
  disabled?: boolean
  describedBy?: string
  ariaLabel?: string
  testId?: string
}>(), {
  checked: false,
  id: generateRandomId,
  disabled: false,
  describedBy: undefined,
  ariaLabel: undefined,
  testId: undefined,
});

const emit = defineEmits<{
  (event: 'update:checked', value: boolean): void
}>();

const groupDisabled = inject(C_CHOICE_GROUP_DISABLED, computed(() => false));
const isDisabled = computed(() => props.disabled || groupDisabled.value);
</script>

<template>
  <NCheckbox
    :id="id"
    :checked="checked"
    :disabled="isDisabled"
    :aria-disabled="isDisabled ? 'true' : undefined"
    :aria-describedby="describedBy"
    :aria-label="ariaLabel"
    :data-test-id="testId"
    @update:checked="emit('update:checked', Boolean($event))"
  >
    <slot />
  </NCheckbox>
</template>
