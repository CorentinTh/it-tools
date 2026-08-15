<script setup lang="ts">
import { C_CHOICE_GROUP_DISABLED } from './c-choice-group.context';
import { generateRandomId } from '@/utils/random';

const props = withDefaults(defineProps<{
  id?: string
  label: string
  description?: string
  disabled?: boolean
}>(), {
  id: generateRandomId,
  description: undefined,
  disabled: false,
});

const descriptionId = computed(() => `${props.id}-description`);
provide(C_CHOICE_GROUP_DISABLED, computed(() => props.disabled));
</script>

<template>
  <fieldset
    class="c-choice-group"
    :disabled="disabled"
    :aria-describedby="description ? descriptionId : undefined"
    :aria-disabled="disabled ? 'true' : undefined"
  >
    <legend class="c-choice-group__legend">
      {{ label }}
    </legend>
    <p v-if="description" :id="descriptionId" class="c-choice-group__description">
      {{ description }}
    </p>
    <div class="c-choice-group__options">
      <slot />
    </div>
  </fieldset>
</template>

<style scoped>
.c-choice-group {
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;
}

.c-choice-group__legend {
  margin-bottom: var(--ui-space-1);
  padding: 0;
  font-weight: 500;
}

.c-choice-group__description {
  margin: 0 0 var(--ui-space-2);
  font-size: 12px;
  line-height: 1.4;
  opacity: 0.72;
}

.c-choice-group__options {
  display: grid;
  min-width: 0;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr));
  gap: var(--ui-space-2) var(--ui-space-4);
}

.c-choice-group[disabled] {
  opacity: 0.6;
}
</style>
