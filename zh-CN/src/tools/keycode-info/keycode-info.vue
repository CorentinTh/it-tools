<script setup lang="ts">
import { useEventListener } from '@vueuse/core';

import InputCopyable from '../../components/InputCopyable.vue';

const event = ref<KeyboardEvent>();

useEventListener(document, 'keydown', (e) => {
  event.value = e;
  if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) {
    e.preventDefault();
  }
});

const fields = computed(() => {
  if (!event.value) {
    return [];
  }

  return [
    {
      label: '按键:',
      value: event.value.key,
      placeholder: '按键名称',
    },
    {
      label: '按键代码:',
      value: String(event.value.keyCode),
      placeholder: '按键代码',
    },
    {
      label: '代码:',
      value: event.value.code,
      placeholder: '代码',
    },
    {
      label: '位置 :',
      value: String(event.value.location),
      placeholder: '位置',
    },

    {
      label: '组合按键:',
      value: [
        event.value.metaKey && 'Win',
        event.value.shiftKey && 'Shift',
        event.value.ctrlKey && 'Ctrl',
        event.value.altKey && 'Alt',
      ]
        .filter(Boolean)
        .join(' + '),
      placeholder: '无',
    },
  ];
});
</script>

<template>
  <div>
    <c-card mb-5 text-center important:py-12>
      <div v-if="event" mb-2 text-3xl>
        {{ event.key }}
      </div>
      <span lh-1 op-70>
        按下键盘中的任意键
      </span>
    </c-card>

    <n-input-group v-for="({ label, value, placeholder }, i) of fields" :key="i" style="margin-bottom: 5px">
      <n-input-group-label style="flex: 0 0 150px">
        {{ label }}
      </n-input-group-label>
      <InputCopyable :value="value" readonly :placeholder="placeholder" />
    </n-input-group>
  </div>
</template>
