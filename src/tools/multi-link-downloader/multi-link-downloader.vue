<script lang="ts">
import { defineComponent, ref } from 'vue';
import { downloadLinks } from './multi-link-downloader.service';

export default defineComponent({
  setup() {
    const links = ref<string>('');
    const downloadMultiLinks = () => {
      if (links.value) {
        downloadLinks(links.value);
      }
    };

    const clearInput = () => {
      links.value = '';
    };

    return {
      links,
      downloadMultiLinks,
      clearInput,
    };
  },
});
</script>

<template>
  <c-card>
    <div class="mb-4 flex justify-between">
      <c-button
        class="mr-2"
        :disabled="!links"
        @click="downloadMultiLinks"
      >
        Start Download
      </c-button>
      <c-button
        class="ml-2"
        @click="clearInput"
      >
        Clear
      </c-button>
    </div>

    <c-input-text
      v-model:value="links"
      placeholder="Add links separated by new lines..."
      multiline
      :rows="20"
    />
  </c-card>
</template>
