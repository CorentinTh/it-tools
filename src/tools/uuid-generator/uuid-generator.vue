<script setup lang="ts">
import { v3 as generateUuidV3, v4 as generateUuidV4, v5 as generateUuidV5, NIL as nilUuid } from 'uuid';
import {
  type IdentifierInspection,
  type ModernIdentifierKind,
  generateUuidV1Batch,
  generateUuidV6Batch,
  generateUuidV7Batch,
  inspectObjectId,
  inspectSnowflake,
  inspectUuid,
} from './uuid-generator.service';
import { useCopy } from '@/composable/copy';
import { computedRefreshable } from '@/composable/computedRefreshable';
import { useResilientStorage } from '@/composable/use-resilient-storage';
import { withDefaultOnError } from '@/utils/defaults';
import CInputNumber from '@/ui/c-input-number/c-input-number.vue';

const versions = ['NIL', 'v1', 'v3', 'v4', 'v5', 'v6', 'v7'] as const;
const identifierKinds: Array<{ label: string; value: ModernIdentifierKind }> = [
  { label: 'UUID', value: 'uuid' },
  { label: 'Mongo ObjectID', value: 'object-id' },
  { label: 'Snowflake', value: 'snowflake' },
];

const version = useStorage<typeof versions[number]>('uuid-generator:version', 'v4');
const count = useResilientStorage('uuid-generator:quantity', 1);
const v35Args = ref({ namespace: '6ba7b811-9dad-11d1-80b4-00c04fd430c8', name: '' });
const identifierKind = ref<ModernIdentifierKind>('uuid');
const identifierInput = ref('01890abc-def0-7000-8000-000000000001');
const snowflakeEpoch = ref('1420070400000');
const inspection = ref<IdentifierInspection>();
const inspectionError = ref('');

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
  if (version.value === 'v6') {
    return generateUuidV6Batch({ count: count.value }).join('\n');
  }
  if (version.value === 'v7') {
    return generateUuidV7Batch({ count: count.value }).join('\n');
  }

  const generator = generators[version.value] ?? generators.NIL;
  return Array.from({ length: count.value }, () => generator()).join('\n');
}, ''), {
  dependencies: [version, count, () => v35Args.value.namespace, () => v35Args.value.name],
});

const { copy } = useCopy({ source: uuids, text: 'UUIDs copied to the clipboard' });
const canonicalIdentifier = computed(() => inspection.value?.canonical ?? '');
const { copy: copyCanonical } = useCopy({ source: canonicalIdentifier, text: 'Canonical identifier copied to the clipboard' });

function inspectIdentifier() {
  try {
    inspection.value = identifierKind.value === 'uuid'
      ? inspectUuid(identifierInput.value)
      : identifierKind.value === 'object-id'
        ? inspectObjectId(identifierInput.value)
        : inspectSnowflake(identifierInput.value, snowflakeEpoch.value);
    inspectionError.value = '';
  }
  catch (caught) {
    inspection.value = undefined;
    inspectionError.value = caught instanceof Error ? caught.message : 'The identifier could not be inspected.';
  }
}

watch(identifierKind, () => {
  inspection.value = undefined;
  inspectionError.value = '';
  identifierInput.value = identifierKind.value === 'uuid'
    ? '01890abc-def0-7000-8000-000000000001'
    : identifierKind.value === 'object-id' ? '507f1f77bcf86cd799439011' : '1191168914225258538';
});
</script>

<template>
  <div class="c-generator-layout">
    <c-card class="c-generator-options">
      <div grid grid-cols-1 gap-3 md:grid-cols-2>
        <c-buttons-select
          v-model:value="version"
          :options="versions"
          label="UUID version"
          label-position="top"
        />
        <c-field label="Quantity (1–50)" label-for="uuid-quantity">
          <CInputNumber
            id="uuid-quantity"
            v-model:value="count"
            test-id="uuid-quantity"
            :min="1"
            :max="50"
            placeholder="UUID quantity"
            w-full
          />
        </c-field>
      </div>

      <div v-if="version === 'v3' || version === 'v5'" mt-4 flex flex-col gap-3>
        <c-buttons-select
          v-model:value="v35Args.namespace"
          :options="{
            DNS: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
            URL: '6ba7b811-9dad-11d1-80b4-00c04fd430c8',
            OID: '6ba7b812-9dad-11d1-80b4-00c04fd430c8',
            X500: '6ba7b814-9dad-11d1-80b4-00c04fd430c8',
          }"
          label="Namespace preset"
          label-position="top"
        />
        <c-input-text
          v-model:value="v35Args.namespace"
          placeholder="Namespace"
          label="Namespace UUID"
          :validation-rules="validUuidRules"
        />

        <c-input-text
          v-model:value="v35Args.name"
          placeholder="Name"
          label="Name"
        />
      </div>
    </c-card>

    <c-input-text
      class="c-generator-output"
      :value="uuids"
      aria-label="Generated UUIDs"
      placeholder="Your uuids"
      test-id="uuid-output"
      rows="12"
      readonly
      raw-text
      multiline
      monospace
    />

    <div class="c-generator-actions">
      <c-button type="primary" data-test-id="uuid-generate" @click="refreshUUIDs">
        Generate
      </c-button>
      <c-button data-test-id="uuid-copy" @click="copy()">
        Copy
      </c-button>
    </div>

    <c-divider title-placement="left">
      Inspect and normalize identifiers
    </c-divider>

    <c-card class="c-generator-options" title="Identifier input">
      <div grid grid-cols-1 gap-3 md:grid-cols-2>
        <c-buttons-select
          v-model:value="identifierKind"
          :options="identifierKinds"
          label="Identifier type"
          label-position="top"
        />
        <c-input-text
          v-if="identifierKind === 'snowflake'"
          v-model:value="snowflakeEpoch"
          label="Snowflake epoch (Unix milliseconds)"
          test-id="identifier-epoch"
          raw-text monospace
        />
      </div>
      <c-input-text
        v-model:value="identifierInput"
        label="Identifier"
        placeholder="Paste an identifier"
        test-id="identifier-input"
        raw-text monospace
        mt-3
      />
      <p mt-2 text-sm op-70>
        Inspection is local and explicit. Values are not saved. Snowflake decoding uses the selected custom epoch and the common 41/5/5/12 layout.
      </p>
      <c-alert v-if="inspectionError" title="Invalid identifier" mt-3 data-test-id="identifier-error">
        {{ inspectionError }}
      </c-alert>
    </c-card>

    <div class="c-generator-actions">
      <c-button type="primary" data-test-id="identifier-inspect" @click="inspectIdentifier">
        Inspect
      </c-button>
      <c-button :disabled="!inspection" data-test-id="identifier-copy" @click="copyCanonical()">
        Copy canonical value
      </c-button>
    </div>

    <c-card v-if="inspection" title="Decoded identifier" data-test-id="identifier-result">
      <dl grid grid-cols-1 gap-3 md:grid-cols-2>
        <div>
          <dt text-sm font-semibold op-70>
            Canonical value
          </dt>
          <dd break-all font-mono>
            {{ inspection.canonical }}
          </dd>
        </div>
        <div v-for="detail in inspection.details" :key="detail.label">
          <dt text-sm font-semibold op-70>
            {{ detail.label }}
          </dt>
          <dd break-all font-mono>
            {{ detail.value }}
          </dd>
        </div>
      </dl>
    </c-card>
  </div>
</template>
