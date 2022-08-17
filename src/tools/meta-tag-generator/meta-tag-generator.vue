<template>
  <div>
    <div v-for="{ name, elements } of sections" :key="name" style="margin-bottom: 15px">
      <n-form-item :label="name" :show-feedback="false"> </n-form-item>

      <n-input-group v-for="{ key, type, label, placeholder, ...element } of elements" :key="key">
        <n-input-group-label style="flex: 0 0 110px">{{ label }}</n-input-group-label>
        <n-input v-if="type === 'input'" v-model:value="metadata[key]" :placeholder="placeholder" />
        <n-dynamic-input
          v-else-if="type === 'input-multiple'"
          v-model:value="metadata[key]"
          :min="1"
          :placeholder="placeholder"
          :default-value="['']"
          :show-sort-button="true"
        />

        <n-select
          v-else-if="type === 'select'"
          v-model:value="metadata[key]"
          :placeholder="placeholder"
          :options="(element as OGSchemaTypeElementSelect).options"
        />
      </n-input-group>
    </div>
  </div>
  <div>
    <n-form-item label="Your meta tags">
      <textarea-copyable :value="metaTags" language="html" />
    </n-form-item>
  </div>
</template>

<script setup lang="ts">
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { generateMeta } from '@it-tools/oggen';
import _ from 'lodash';
import { computed, ref, watch } from 'vue';
import { image, ogSchemas, twitter, website } from './og-schemas';
import type { OGSchemaType, OGSchemaTypeElementSelect } from './OGSchemaType.type';

// Since type guards do not work in template
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const metadata = ref<{ type: string; [k: string]: any }>({
  type: 'website',
  'twitter:card': 'summary_large_image',
});

watch(
  () => ref(metadata.value.type),
  (_ignored, prevSection) => {
    const section = ogSchemas[prevSection.value];

    if (!section) return;

    section.elements.forEach(({ key }) => {
      metadata.value[key] = '';
    });
  },
);

const sections = computed(() => {
  const secs: OGSchemaType[] = [website, image, twitter];
  const additionalSchema = ogSchemas[metadata.value.type];

  if (additionalSchema) secs.push(additionalSchema);

  return secs;
});

const metaTags = computed(() => {
  const twitterMeta = _.chain(metadata.value)
    .pickBy((_value, k) => k.startsWith('twitter:'))
    .mapKeys((_value, k) => k.replace(/^twitter:/, ''))
    .value();

  const otherMeta = _.pickBy(metadata.value, (_value, k) => !k.startsWith('twitter:'));

  return generateMeta({ ...otherMeta, twitter: twitterMeta }, { generateTwitterCompatibleMeta: true });
});
</script>

<style lang="less" scoped>
.n-input-group {
  margin-bottom: 5px;
}

::v-deep(.n-form-item-blank) {
  min-height: 0 !important;
}
::v-deep(.n-dynamic-input-item) {
  margin-bottom: 5px;
}
</style>
