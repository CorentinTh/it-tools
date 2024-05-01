<script setup lang="ts">
import ports from 'port-numbers';
import SpanCopyable from '@/components/SpanCopyable.vue';

const port = ref(80);
const protocol = ref('tcp');
const result = computed(() => {
  const [type, description] = ports[`${port.value}/${protocol.value}` as (keyof typeof ports)];
  return { type: type ?? 'unknown', description: description ?? 'Unknown' };
});
</script>

<template>
  <div>
    <c-card title="Port search">
      <n-space>
        <n-form-item label="Port number">
          <n-input-number v-model:value="port" :min="1" />
        </n-form-item>
        <n-form-item label="Protocol">
          <c-select
            v-model:value="protocol"
            :options="[{ value: 'tcp', label: 'TCP' }, { value: 'udp', label: 'UDP' }]"
          />
        </n-form-item>
      </n-space>
    </c-card>

    <c-card>
      <n-form-item label="Type">
        <SpanCopyable :value="result?.type" />
      </n-form-item>
      <n-form-item label="Description">
        <SpanCopyable :value="result?.description" />
      </n-form-item>
    </c-card>
  </div>
</template>
