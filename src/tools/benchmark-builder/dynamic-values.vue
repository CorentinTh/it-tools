<script setup lang="ts">
import { Plus, Trash } from '@vicons/tabler';
import { useTemplateRefsList, useVModel } from '@vueuse/core';
import { NInputNumber } from 'naive-ui';
import { nextTick } from 'vue';

const props = defineProps<{ values: (number | null)[] }>();

const emit = defineEmits(['update:values']);

const refs = useTemplateRefsList<typeof NInputNumber>();

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
      <NInputNumber
        :ref="refs.set"
        v-model:value="values[index]"
        :show-button="false"
        placeholder="Set your measure..."
        autofocus
        @keydown.enter="onInputEnter(index)"
      />
      <c-tooltip tooltip="Delete this value">
        <c-button circle variant="text" @click="values.splice(index, 1)">
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
