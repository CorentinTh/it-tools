<script setup lang="ts">
import _ from 'lodash';
import SpanCopyable from '@/components/SpanCopyable.vue';

const props = withDefaults(defineProps<{ label: string; oldValue?: string; newValue?: string }>(), {
  label: '',
  oldValue: '',
  newValue: '',
});
const { label, oldValue, newValue } = toRefs(props);

const testId = computed(() => _.kebabCase(label.value));
</script>

<template>
  <tr>
    <td font-bold>
      {{ label }}
    </td>
    <td :data-test-id="`${testId}.old`">
      <SpanCopyable :value="oldValue" class="monospace" />
    </td>
    <td :data-test-id="`${testId}.new`">
      <SpanCopyable :value="newValue" />
    </td>
  </tr>
</template>
