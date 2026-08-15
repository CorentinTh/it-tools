<script setup lang="ts">
import { generateMeta } from '@it-tools/oggen';
import _ from 'lodash';
import { image, ogSchemas, twitter, website } from './og-schemas';
import type { OGSchemaType, OGSchemaTypeElementSelect } from './OGSchemaType.type';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

// Since type guards do not work in template

const metadata = ref<{ type: string; [k: string]: any }>({
  'type': 'website',
  'twitter:card': 'summary_large_image',
});

watch(
  () => ref(metadata.value.type),
  (_ignored, prevSection) => {
    const section = ogSchemas[prevSection.value];

    if (!section) {
      return;
    }

    section.elements.forEach(({ key }) => {
      metadata.value[key] = '';
    });
  },
);

const sections = computed(() => {
  const secs: OGSchemaType[] = [website, image, twitter];
  const additionalSchema = ogSchemas[metadata.value.type];

  if (additionalSchema) {
    secs.push(additionalSchema);
  }

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

<template>
  <div class="c-tool-workbench c-tool-stack">
    <c-card v-for="{ name, elements } of sections" :key="name" :title="name">
      <div grid grid-cols-1 gap-3 md:grid-cols-2>
        <template v-for="{ key, type, label, placeholder, ...element } of elements" :key="key">
          <c-input-text
            v-if="type === 'input'"
            v-model:value="metadata[key]"
            :label="label"
            :placeholder="placeholder"
            clearable
          />
          <c-field v-else-if="type === 'input-multiple'" :label="label">
            <n-dynamic-input
              v-model:value="metadata[key]"
              :min="1"
              :placeholder="placeholder"
              :default-value="['']"
              :show-sort-button="true"
              :aria-label="label"
            />
          </c-field>

          <c-select
            v-else-if="type === 'select'"
            v-model:value="metadata[key]"
            :label="label"
            :placeholder="placeholder"
            :options="(element as OGSchemaTypeElementSelect).options"
          />
        </template>
      </div>
    </c-card>
    <c-field class="c-tool-panel" label="Your meta tags">
      <TextareaCopyable :value="metaTags" language="html" />
    </c-field>
  </div>
</template>

<style lang="less" scoped>
::v-deep(.n-dynamic-input-item) {
  margin-bottom: 5px;
}
</style>
