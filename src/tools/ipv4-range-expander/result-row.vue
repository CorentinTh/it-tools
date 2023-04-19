<template>
  <tr>
    <td>
      <n-text strong>{{ label }}</n-text>
    </td>
    <td :data-test-id="testId + '.old'"><span-copyable :value="oldValue" class="monospace" /></td>
    <td :data-test-id="testId + '.new'">
      <span-copyable :value="newValue"></span-copyable>
    </td>
  </tr>
</template>

<script setup lang="ts">
import SpanCopyable from '@/components/SpanCopyable.vue';
import _ from 'lodash';

const props = withDefaults(defineProps<{ label: string; oldValue?: string; newValue?: string }>(), {
  label: '',
  oldValue: '',
  newValue: '',
});
const { label, oldValue, newValue } = toRefs(props);

const testId = computed(() => _.kebabCase(label.value));
</script>

<style scoped lang="less"></style>
