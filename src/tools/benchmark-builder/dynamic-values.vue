<template>
  <div>
    <n-space v-for="(value, index) of values" :key="index" :wrap="false" style="margin-bottom: 5px" :size="5">
      <n-input-number
        :ref="refs.set"
        v-model:value="values[index]"
        :show-button="false"
        placeholder="Set your measure..."
        autofocus
        @keydown.enter="onInputEnter(index)"
      />
      <n-tooltip>
        <template #trigger>
          <n-button circle quaternary @click="values.splice(index, 1)">
            <template #icon>
              <n-icon :component="Trash" depth="3" />
            </template>
          </n-button>
        </template>
        Delete value
      </n-tooltip>
    </n-space>

    <n-button tertiary @click="addValue">
      <template #icon>
        <n-icon :component="Plus" />
      </template>
      Add a measure
    </n-button>
  </div>
</template>

<script setup lang="ts">
import { Trash, Plus } from '@vicons/tabler';
import { useTemplateRefsList, useVModel } from '@vueuse/core';
import { NInputNumber } from 'naive-ui';
import { nextTick } from 'vue';

const refs = useTemplateRefsList<typeof NInputNumber>();

const props = defineProps<{ values: (number | null)[] }>();
const emit = defineEmits(['update:values']);
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

<style scoped></style>
