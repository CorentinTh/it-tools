<script setup lang="ts">
import { useEventListener } from '@vueuse/core';

import InputCopyable from '../../components/InputCopyable.vue';

const event = ref<KeyboardEvent>();

const { t } = useI18n();

useEventListener(document, 'keydown', (e) => {
  event.value = e;
});

const fields = computed(() => {
  if (!event.value) {
    return [];
  }

  return [
    {
      label: t('tools.keycode-info.keyLabel'),
      value: event.value.key,
      placeholder: t('tools.keycode-info.keyPlaceholder'),
    },
    {
      label: t('tools.keycode-info.keycodeLabel'),
      value: String(event.value.keyCode),
      placeholder: t('tools.keycode-info.keycodePlaceholder'),
    },
    {
      label: t('tools.keycode-info.codeLabel'),
      value: event.value.code,
      placeholder: t('tools.keycode-info.codePlaceholder'),
    },
    {
      label: t('tools.keycode-info.locationLabel'),
      value: String(event.value.location),
      placeholder: t('tools.keycode-info.locationPlaceholder'),
    },

    {
      label: t('tools.keycode-info.modifiersLabel'),
      value: [
        event.value.metaKey && 'Meta',
        event.value.shiftKey && 'Shift',
        event.value.ctrlKey && 'Ctrl',
        event.value.altKey && 'Alt',
      ]
        .filter(Boolean)
        .join(' + '),
      placeholder: t('tools.keycode-info.modifiersPlaceholder'),
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
        {{ t('tools.keycode-info.tips') }}
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
