<script setup lang="ts">
import { Plus, Trash } from '@vicons/tabler';
import { useTemplateRefsList, useVModel } from '@vueuse/core';
import { nextTick } from 'vue';
import CInputNumber from '@/ui/c-input-number/c-input-number.vue';

const props = withDefaults(defineProps<{
  values: (number | null)[]
  labelPrefix?: string
}>(), {
  labelPrefix: 'Suite',
});

const emit = defineEmits(['update:values']);

const refs = useTemplateRefsList<InstanceType<typeof CInputNumber>>();

const values = useVModel(props, 'values', emit);

async function addValue() {
  values.value.push(null);
  await nextTick();
  refs.value.at(-1)?.focus();
}

function onInputEnter(index: number) {
  if (index === values.value.length - 1) {
    addValue();
    return;
  }

  refs.value.at(index + 1)?.focus();
}
</script>

<template>
  <div>
    <div v-for="(value, index) of values" :key="index" mb-2 flex flex-nowrap gap-2>
      <CInputNumber
        :ref="refs.set"
        v-model:value="values[index]"
        :aria-label="`${labelPrefix} measure ${index + 1}`"
        :show-button="false"
        placeholder="Set your measure..."
        autofocus
        @keydown.enter="onInputEnter(index)"
      />
      <c-tooltip tooltip="Delete this value">
        <c-button circle variant="text" :aria-label="`Delete ${labelPrefix} measure ${index + 1}`" @click="values.splice(index, 1)">
          <n-icon :component="Trash" depth="3" size="18" />
        </c-button>
      </c-tooltip>
    </div>

    <c-button @click="addValue">
      <n-icon :component="Plus" depth="3" mr-2 size="18" />
      Add a measure
    </c-button>
  </div>
</template>
