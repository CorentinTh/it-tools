<script setup lang="ts">
import { useEventListener } from '@vueuse/core';

import InputCopyable from '../../components/InputCopyable.vue';

const event = ref<KeyboardEvent>();

useEventListener(document, 'keydown', (e) => {
  event.value = e;
});

const fields = computed(() => {
  if (!event.value) {
    return [];
  }

  return [
    {
      label: 'Key',
      value: event.value.key,
      placeholder: 'Key name...',
    },
    {
      label: 'Keycode',
      value: String(event.value.keyCode),
      placeholder: 'Keycode...',
    },
    {
      label: 'Code',
      value: event.value.code,
      placeholder: 'Code...',
    },
    {
      label: 'Location',
      value: String(event.value.location),
      placeholder: 'Code...',
    },

    {
      label: 'Modifiers',
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

<template>
  <div class="c-form-layout">
    <c-card text-center important:py-12>
      <div v-if="event" mb-2 text-3xl>
        {{ event.key }}
      </div>
      <span lh-1 op-70>
        Press the key on your keyboard you want to get info about this key
      </span>
    </c-card>

    <c-card v-if="fields.length" title="Key details">
      <div grid grid-cols-1 gap-3 md:grid-cols-2>
        <InputCopyable
          v-for="({ label, value, placeholder }, i) of fields"
          :key="i"
          :value="value"
          :label="label"
          readonly
          monospace
          :placeholder="placeholder"
        />
      </div>
    </c-card>
  </div>
</template>
