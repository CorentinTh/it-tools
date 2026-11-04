<script setup lang="ts">
import type { UuidVersion } from './uuid-generator.service';
import { computedRefreshable } from '@/composable/computedRefreshable';
import { useCopy } from '@/composable/copy';
import { withDefaultOnError } from '@/utils/defaults';
import { generateUuids, isValidNamespace, uuidVersions } from './uuid-generator.service';

const version = useStorage<UuidVersion>('uuid-generator:version', 'v4');
const count = useStorage('uuid-generator:quantity', 1);
const v35Args = ref({ namespace: '6ba7b811-9dad-11d1-80b4-00c04fd430c8', name: '' });

const validUuidRules = [
  {
    message: 'Invalid UUID',
    validator: isValidNamespace,
  },
];

const [uuids, refreshUUIDs] = computedRefreshable(() => withDefaultOnError(() =>
  generateUuids({
    version: version.value,
    count: count.value,
    namespace: v35Args.value.namespace,
    name: v35Args.value.name,
  }).join('\n'), ''));

const { copy } = useCopy({ source: uuids, text: 'UUIDs copied to the clipboard' });
</script>

<template>
  <div>
    <c-buttons-select v-model:value="version" :options="uuidVersions" label="UUID version" label-width="100px" mb-2 />

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
          test-id="namespace"
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
        test-id="name"
        label="Name"
        label-width="100px"
        label-position="left"
        mb-2
      />
    </div>

    <c-input-text
      style="text-align: center; font-family: monospace"
      :value="uuids"
      multiline
      placeholder="Your uuids"
      autosize
      rows="1"
      readonly
      raw-text
      monospace
      my-3
      class="uuid-display"
      test-id="uuids"
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
