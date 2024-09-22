<script setup lang="ts">
import { compareLists } from './list-comparer.service';

const compareConfig = useStorage<{ ignoreCase: boolean; trimItems: boolean; noDuplicate: boolean; separator: string }>('list-cmp:conf', {
  ignoreCase: false,
  trimItems: true,
  noDuplicate: false,
  separator: '',
});
const list1 = ref('');
const list2 = ref('');

const compareResult = computed(() => {
  return compareLists({
    list1: list1.value,
    list2: list2.value,
    ignoreCase: compareConfig.value.ignoreCase,
    trimItems: compareConfig.value.trimItems,
    noDuplicate: compareConfig.value.noDuplicate,
    separator: compareConfig.value.separator,
  });
});
</script>

<template>
  <div>
    <n-space justify="center" gap-1 align="baseline">
      <n-form-item
        label="Trim items"
        label-placement="left"
      >
        <n-switch v-model:value="compareConfig.trimItems" />
      </n-form-item>

      <n-form-item
        label="Ignore case"
        label-placement="left"
        mb-2
      >
        <n-switch v-model:value="compareConfig.ignoreCase" />
      </n-form-item>
      <n-form-item
        label="No duplicate"
        label-placement="left"
      >
        <n-switch v-model:value="compareConfig.noDuplicate" />
      </n-form-item>

      <n-form-item
        label="Separator"
        label-placement="left"
      >
        <n-input
          v-model:value="compareConfig.separator"
          placeholder="Additional separator"
        />
      </n-form-item>
    </n-space>

    <div flex gap-1>
      <c-input-text
        v-model:value="list1"
        multiline
        rows="10"
        label="List 1"
      />
      <c-input-text
        v-model:value="list2"
        multiline
        rows="10"
        label="List 2"
      />
    </div>

    <div v-if="list1 || list2">
      <n-divider />

      <c-card title="Items in both lists" mb-2>
        <textarea-copyable :value="compareResult.same.join('\n')" />
      </c-card>
      <c-card title="Items in List 1 but not in List 2" mb-2>
        <textarea-copyable :value="compareResult.list1Not2.join('\n')" />
      </c-card>
      <c-card title="Items in List 2 but not in List 1" mb-2>
        <textarea-copyable :value="compareResult.list2Not1.join('\n')" />
      </c-card>
    </div>
  </div>
</template>
