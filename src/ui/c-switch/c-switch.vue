<script setup lang="ts">
import { NSwitch } from 'naive-ui';
import CField from '@/ui/c-field/c-field.vue';
import { generateRandomId } from '@/utils/random';

withDefaults(defineProps<{
  value?: boolean
  id?: string
  label: string
  description?: string
  disabled?: boolean
  testId?: string
  labelPosition?: 'top' | 'left'
}>(), {
  value: false,
  id: generateRandomId,
  description: undefined,
  disabled: false,
  testId: undefined,
  labelPosition: 'left',
});

const emit = defineEmits<{
  (event: 'update:value', value: boolean): void
}>();
</script>

<template>
  <CField
    :id="`${id}-field`"
    :label="label"
    :description="description"
    :disabled="disabled"
    :label-position="labelPosition"
  >
    <template #default="{ labelId, describedBy }">
      <NSwitch
        :id="id"
        :value="value"
        :disabled="disabled"
        :aria-labelledby="labelId"
        :aria-describedby="describedBy"
        :aria-disabled="disabled ? 'true' : undefined"
        :data-test-id="testId"
        @update:value="emit('update:value', Boolean($event))"
      />
    </template>
  </CField>
</template>
