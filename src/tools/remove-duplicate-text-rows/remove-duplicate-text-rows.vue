<script setup lang="ts">
enum Sort {
  OriginalOrder = 'original',
  InOrder = 'inorder',
  ReverseOrder = 'reverse',
}

const input = ref('');
const output = ref('');
const duplicates = ref('');
const is_case_sense = ref(false);
const is_trim_spaces = ref(false);
const sorting = ref(Sort.OriginalOrder);

const sortingOptions = [
  { label: 'Original', value: Sort.OriginalOrder },
  { label: 'In Order', value: Sort.InOrder },
  { label: 'Reverse', value: Sort.ReverseOrder },
];

watchEffect(() => {
  const lines = input.value.split('\n');
  const duplicatesMap = new Map<string, number>();
  const uniquesMap = new Map<string, number>();

  for (let line of lines) {
    if (is_trim_spaces.value) {
      line = line.trim();
    }
    if (is_case_sense.value) {
      line = line.toLowerCase();
    }
    if (duplicatesMap.has(line)) {
      duplicatesMap.set(line, duplicatesMap.get(line)! + 1);
    }
    else {
      duplicatesMap.set(line, 1);
      uniquesMap.set(line, 1);
    }
  }

  const sortedLines = [...uniquesMap.keys()].sort((a, b) => {
    switch (sorting.value) {
      case Sort.InOrder:
        return a.localeCompare(b);
      case Sort.ReverseOrder:
        return b.localeCompare(a);
      default:
        return 0;
    }
  });

  output.value = sortedLines.join('\n');
  duplicates.value = [...duplicatesMap.entries()]
    .filter(([_, count]) => count > 1)
    .sort((a, b) => b[1] - a[1])
    .map(([line, count]) => `${line} (${count})`)
    .join('\n');
});
</script>

<template>
  <c-card style="max-width: 600px">
    <c-input-text
      v-model:value="input"
      label="Your text:"
      placeholder="Seperate rows by a break"
      raw-text
      multiline
      rows="10"
    />

    <n-divider />

    <n-form flex style="flex-direction: column; gap: 6px" label-placement="left">
      <n-form-item flex label="Case Sensitive">
        <n-switch v-model:value="is_case_sense" />
      </n-form-item>

      <n-form-item flex label="Trim Spaces">
        <n-switch v-model:value="is_trim_spaces" />
      </n-form-item>

      <n-form-item flex label="Sorting">
        <c-buttons-select v-model:value="sorting" :options="sortingOptions" />
      </n-form-item>
    </n-form>

    <n-divider />

    <n-form-item label="Unique text:">
      <TextareaCopyable
        :value="output"
        mb-1 mt-1
        copy-placement="outside"
      />
    </n-form-item>
    <n-form-item label="Duplicates:">
      <TextareaCopyable
        :value="duplicates"
        mb-1 mt-1
        copy-placement="outside"
      />
    </n-form-item>
  </c-card>
</template>
