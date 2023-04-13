<template>
  <div style="flex: 0 0 100%">
    <n-space style="margin: 0 auto; max-width: 600px" justify="center">
      <n-form-item label="Show unchanged :" label-placement="left" label-width="160">
        <n-switch v-model:value="showUnchanged" :disabled="!validInput" />
      </n-form-item>
    </n-space>
  </div>

  <div style="flex: 0 0 100%">
    <n-space style="margin: 0 auto; max-width: 600px" justify="center">
      <n-card title="Diff result" data-test-id="result">
        <div ref="result">
          <SanitizedHtml :html="diffResult" />
        </div>
      </n-card>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, toRefs } from 'vue';
import { withDefaultOnError } from '@/utils/defaults';
import JSON5 from 'json5';
import { DiffPatcher, formatters } from 'jsondiffpatch-rc';
import SanitizedHtml from './sanitized-html.vue';
import './styles.css';

const result = ref<HTMLDivElement | null>(null);

onMounted(() => {
  showHideUnchanged();
});

const props = withDefaults(defineProps<{ left: string; right: string }>(), { left: '', right: '' });
const { left, right } = toRefs(props);
const showUnchanged = ref(true);

const leftJson = computed(() => withDefaultOnError(() => JSON5.parse(left.value), ''));
const rightJson = computed(() => withDefaultOnError(() => JSON5.parse(right.value), ''));
const diffResult = computed(() => {
  if (!validInput.value) {
    return '';
  }

  const diffPatcher = new DiffPatcher({
    objectHash: function (obj, index) {
      if (typeof obj._id !== 'undefined') {
        return obj._id;
      }
      if (typeof obj.id !== 'undefined') {
        return obj.id;
      }
      return '$$index:' + index;
    },
    arrays: { detectMove: true, includeValueOnMove: true },
  });
  const delta = diffPatcher.diff(leftJson.value, rightJson.value);
  return delta === undefined ? 'both JSONs are identical' : formatters.html.format(delta, leftJson.value);
});
const validInput = computed(() => leftJson.value !== '' && rightJson.value !== '');

watch([diffResult, showUnchanged], () => showHideUnchanged(), { immediate: true });

function showHideUnchanged() {
  if (result.value) {
    formatters.html.showUnchanged(showUnchanged.value, result.value, 200);
  }
}
</script>
