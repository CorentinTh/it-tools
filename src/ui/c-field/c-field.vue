<script setup lang="ts">
type FieldStatus = 'default' | 'error' | 'warning' | 'success';

const props = withDefaults(defineProps<{
  id?: string
  label?: string
  labelFor?: string
  description?: string
  feedback?: string
  status?: FieldStatus
  required?: boolean
  optional?: boolean
  disabled?: boolean
  reserveFeedback?: boolean
  labelPosition?: 'top' | 'left'
  labelWidth?: string
}>(), {
  id: undefined,
  label: undefined,
  labelFor: undefined,
  description: undefined,
  feedback: undefined,
  status: 'default',
  required: false,
  optional: false,
  disabled: false,
  reserveFeedback: false,
  labelPosition: 'top',
  labelWidth: '140px',
});

const instance = getCurrentInstance();
const fieldId = computed(() => props.id ?? `c-field-${instance?.uid ?? 'unknown'}`);
const labelId = computed(() => `${fieldId.value}-label`);
const descriptionId = computed(() => `${fieldId.value}-description`);
const feedbackId = computed(() => `${fieldId.value}-feedback`);
const describedBy = computed(() => [
  props.description ? descriptionId.value : undefined,
  props.feedback ? feedbackId.value : undefined,
].filter(Boolean).join(' ') || undefined);
const isInvalid = computed(() => props.status === 'error');
</script>

<template>
  <div
    class="c-field"
    :class="{
      'c-field--left': labelPosition === 'left',
      'c-field--disabled': disabled,
    }"
    :style="{ '--c-field-label-width': labelWidth }"
    :data-status="status"
    :aria-disabled="disabled ? 'true' : undefined"
  >
    <label v-if="label" :id="labelId" class="c-field__label" :for="labelFor">
      {{ label }}
      <span v-if="required" aria-hidden="true" class="c-field__required">*</span>
      <span v-if="required" class="sr-only"> required</span>
      <span v-else-if="optional" class="c-field__optional"> (optional)</span>
    </label>

    <div class="c-field__body">
      <p v-if="description" :id="descriptionId" class="c-field__description">
        {{ description }}
      </p>
      <slot
        :label-id="label ? labelId : undefined"
        :description-id="description ? descriptionId : undefined"
        :feedback-id="feedback ? feedbackId : undefined"
        :described-by="describedBy"
        :invalid="isInvalid"
      />
      <p
        v-if="feedback || reserveFeedback"
        :id="feedbackId"
        class="c-field__feedback"
        :class="{ 'c-field__feedback--reserved': reserveFeedback }"
        :role="isInvalid && feedback ? 'alert' : undefined"
        :aria-live="isInvalid && feedback ? 'polite' : undefined"
      >
        {{ feedback }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.c-field {
  width: 100%;
  min-width: 0;
}

.c-field--left {
  display: grid;
  grid-template-columns: var(--c-field-label-width) minmax(0, 1fr);
  align-items: start;
  column-gap: var(--ui-space-3);
}

.c-field__label {
  display: block;
  margin-bottom: var(--ui-space-1);
  line-height: var(--ui-control-height-medium);
  font-weight: 500;
}

.c-field__body {
  min-width: 0;
}

.c-field__description,
.c-field__feedback {
  margin: var(--ui-space-1) 0 0;
  font-size: 12px;
  line-height: 1.4;
  opacity: 0.72;
}

.c-field__description {
  margin: 0 0 var(--ui-space-1);
}

.c-field__feedback--reserved {
  min-height: 17px;
}

.c-field[data-status='error'] .c-field__feedback,
.c-field__required {
  color: var(--n-feedback-text-color-error, #d03050);
}

.c-field[data-status='warning'] .c-field__feedback {
  color: var(--n-warning-color, #f0a020);
}

.c-field[data-status='success'] .c-field__feedback {
  color: var(--n-feedback-text-color-success, #18a058);
}

.c-field--disabled {
  opacity: 0.6;
}

.c-field__optional {
  font-weight: 400;
  opacity: 0.7;
}

@media (max-width: 600px) {
  .c-field--left {
    display: block;
  }
}
</style>
