<template>
  <div>
    <c-card style="text-align: center; padding: 40px 0; margin-bottom: 26px">
      <n-h2 v-if="event">{{ event.key }}</n-h2>
      <n-text strong depth="3">Press the key on your keyboard you want to get info about this key</n-text>
    </c-card>

    <n-input-group v-for="({ label, value, placeholder }, i) of fields" :key="i" style="margin-bottom: 5px">
      <n-input-group-label style="flex: 0 0 150px"> {{ label }} </n-input-group-label>
      <input-copyable :value="value" readonly :placeholder="placeholder" />
    </n-input-group>
  </div>
</template>

<script setup lang="ts">
import { useEventListener } from '@vueuse/core';
import { computed, ref } from 'vue';
import InputCopyable from '../../components/InputCopyable.vue';

const event = ref<KeyboardEvent>();

useEventListener(document, 'keydown', (e) => {
  event.value = e;
});

const fields = computed(() => {
  if (!event.value) return [];

  return [
    {
      label: 'Key :',
      value: event.value.key,
      placeholder: 'Key name...',
    },
    {
      label: 'Keycode :',
      value: String(event.value.keyCode),
      placeholder: 'Keycode...',
    },
    {
      label: 'Code :',
      value: event.value.code,
      placeholder: 'Code...',
    },
    {
      label: 'Location :',
      value: String(event.value.location),
      placeholder: 'Code...',
    },

    {
      label: 'Modifiers :',
      value: [
        event.value.metaKey && 'Meta',
        event.value.shiftKey && 'Shift',
        event.value.ctrlKey && 'Ctrl',
        event.value.altKey && 'Alt',
      ]
        .filter(Boolean)
        .join(' + '),
      placeholder: 'None',
    },
  ];
});
</script>

<style lang="less" scoped></style>
