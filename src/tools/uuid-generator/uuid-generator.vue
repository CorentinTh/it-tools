<script setup lang="ts">
import { v3 as generateUuidV3, v4 as generateUuidV4, v5 as generateUuidV5, NIL as nilUuid } from 'uuid';
import { generateUuidV1Batch } from './uuid-generator.service';
import { useCopy } from '@/composable/copy';
import { computedRefreshable } from '@/composable/computedRefreshable';
import { withDefaultOnError } from '@/utils/defaults';

const versions = ['NIL', 'v1', 'v3', 'v4', 'v5'] as const;

const version = useStorage<typeof versions[number]>('uuid-generator:version', 'v4');
const count = useStorage('uuid-generator:quantity', 1);
const v35Args = ref({ namespace: '6ba7b811-9dad-11d1-80b4-00c04fd430c8', name: '' });

const validUuidRules = [
  {
    message: 'Invalid UUID',
    validator: (value: string) => {
      if (value === nilUuid) {
        return true;
      }

      return Boolean(value.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/));
    },
  },
];

const generators: Record<string, () => string> = {
  NIL: () => nilUuid,
  v3: () => generateUuidV3(v35Args.value.name, v35Args.value.namespace),
  v4: () => generateUuidV4(),
  v5: () => generateUuidV5(v35Args.value.name, v35Args.value.namespace),
};

const [uuids, refreshUUIDs] = computedRefreshable(() => withDefaultOnError(() => {
  if (version.value === 'v1') {
    return generateUuidV1Batch({ count: count.value }).join('\n');
  }

  const generator = generators[version.value] ?? generators.NIL;
  return Array.from({ length: count.value }, () => generator()).join('\n');
}, ''), {
  dependencies: [version, count, () => v35Args.value.namespace, () => v35Args.value.name],
});

const { copy } = useCopy({ source: uuids, text: 'UUIDs copied to the clipboard' });
</script>

<template>
  <div>
    <c-buttons-select v-model:value="version" :options="versions" label="UUID version" label-width="100px" mb-2 />

    <div mb-2 flex items-center>
      <span w-100px>Quantity </span>
      <n-input-number v-model:value="count" flex-1 :min="1" :max="50" placeholder="UUID quantity" />
    </div>

    <div v-if="version === 'v3' || version === 'v5'">
      <div>
        <c-buttons-select
          v-model:value="v35Args.namespace"
          :options="{
            DNS: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
            URL: '6ba7b811-9dad-11d1-80b4-00c04fd430c8',
            OID: '6ba7b812-9dad-11d1-80b4-00c04fd430c8',
            X500: '6ba7b814-9dad-11d1-80b4-00c04fd430c8',
          }"
          label="Namespace"
          label-width="100px"
          mb-2
        />
      </div>
      <div flex-1>
        <c-input-text
          v-model:value="v35Args.namespace"
          placeholder="Namespace"
          label-width="100px"
          label-position="left"
          label=" "
          :validation-rules="validUuidRules"
          mb-2
        />
      </div>

      <c-input-text
        v-model:value="v35Args.name"
        placeholder="Name"
        label="Name"
        label-width="100px"
        label-position="left"
        mb-2
      />
    </div>

    <c-input-text
      style="text-align: center; font-family: monospace"
      :value="uuids"
      placeholder="Your uuids"
      rows="1"
      autosize
      readonly
      raw-text
      multiline
      monospace
      my-3
      class="uuid-display"
    />

    <div flex justify-center gap-3>
      <c-button autofocus @click="copy()">
        Copy
      </c-button>
      <c-button @click="refreshUUIDs">
        Refresh
      </c-button>
    </div>
  </div>
</template>

<style scoped lang="less">
::v-deep(.uuid-display) {
  textarea {
    text-align: center;
  }
}
</style>
