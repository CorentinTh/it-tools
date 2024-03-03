<script setup lang="ts">
import { getUrlWithTextFragment } from './url-text-fragment-maker.service';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

const url = ref('');
const prefixSearch = ref('');
const textStartSearch = ref('');
const textStopSearch = ref('');
const suffixSearch = ref('');

const searchableUrl = computed(() => {
  try {
    return getUrlWithTextFragment({
      url: url.value,
      textStartSearch: textStartSearch.value,
      textStopSearch: textStopSearch.value,
      prefixSearch: prefixSearch.value,
      suffixSearch: suffixSearch.value,
    });
  }
  catch (e: any) {
    return e.toString();
  }
});
</script>

<template>
  <div>
    <n-p>
      Url with Text Fragments allows to make link to content that has no anchor or @id.
      <n-a href="https://developer.mozilla.org/en-US/docs/Web/Text_fragments" target="blank" rel="noopener">
        See MDN for more info
      </n-a>
    </n-p>
    <div>
      <c-input-text
        v-model:value="url"
        label="Base url:"
        placeholder="Base url..."
        type="url"
        clearable raw-text mb-5
      />
    </div>

    <div flex justify-center gap-2>
      <c-input-text
        v-model:value="textStartSearch"
        label="Start Search(es) (comma separated)"
        placeholder="Start Search(es) (comma separated)..."
        clearable
        raw-text
        mb-2
      />
      <c-input-text
        v-model:value="textStopSearch"
        label="Stop Search"
        placeholder="Stop Search text..."
        clearable
        raw-text
        mb-2
      />
    </div>

    <div flex justify-center gap-2>
      <c-input-text
        v-model:value="prefixSearch"
        label="Prefix"
        placeholder="Prefix search"
        clearable
        raw-text
        mb-2
      />
      <c-input-text
        v-model:value="suffixSearch"
        label="Suffix"
        placeholder="Suffix search"
        clearable
        raw-text
        mb-2
      />
    </div>

    <n-divider />

    <n-form-item label="Searchable Url:">
      <TextareaCopyable :value="searchableUrl" />
    </n-form-item>
    <div flex justify-center>
      <n-a :href="searchableUrl" target="blank" rel="noopener">
        Test Searchable Url
      </n-a>
    </div>
  </div>
</template>
