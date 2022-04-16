<template>
  <n-card>
    <n-input
      v-model:value="text"
      type="textarea"
      placeholder="Your text..."
      rows="5"
    />
    <br>
    <br>
    <n-space justify="space-around">
      <n-statistic
        label="Character count"
        :value="text.length"
      />
      <n-statistic
        label="Word count"
        :value="text.split(/\s+/).length"
      />
      <n-statistic
        label="Line count"
        :value="text.split(/\r\n|\r|\n/).length"
      />
      <n-statistic
        label="Byte size"
        :value="formatBytes(getStringSizeInBytes(text))"
      />
    </n-space>
  </n-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { formatBytes } from '@/utils/convert'
import { getStringSizeInBytes } from './text-statistics.service'

const text = ref('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Commodo risus faucibus varius volutpat habitasse suspendisse justo inceptos primis mi. Fusce molestie lorem bibendum habitasse litora adipiscing turpis egestas quis nec. Non id conubia vulputate etiam iaculis vitae venenatis hac fusce condimentum. Adipiscing pellentesque venenatis ornare pulvinar tempus hac montes velit erat convallis.')
</script>
