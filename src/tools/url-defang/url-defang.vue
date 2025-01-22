<script setup lang="ts">
import InputCopyable from '../../components/InputCopyable.vue';
import { isNotThrowing } from '@/utils/boolean';
import { withDefaultOnError } from '@/utils/defaults';

const urlToParse = ref('https://me:pwd@it-tools.tech:3000/url-parser?key1=value&key2=value2#the-hash');

const urlParsed = computed(() => withDefaultOnError(() => defangUrl(urlToParse.value), undefined));

const defangUrl = (url) => {
  let urlString = url.toString();

  // Remove credentials (username:password)
  const credentialsPattern = /\/\/([^@]+@)/;
  urlString = urlString.replace(credentialsPattern, '://');

  // Replace protocol separator to prevent execution (http:// or https:// -> http[:]//)
  urlString = urlString.replace('://', '[:]//');

  // Replace the dot before TLD with [.] (e.g., domain.tld -> domain[.]tld)
  const domainPattern = /(\.[a-zA-Z]{2,})(?=\b)/g;
  urlString = urlString.replace(domainPattern, '[.]$1').replace('.].', '.]');

  return urlString;
};

</script>

<template>
  <c-card>
    <c-input-text
      v-model:value="urlToParse"
      label="URL to Defang:"
      placeholder="Your url to defang..."
      raw-text
    />

    <n-divider />

    <InputCopyable
      label="Defanged URL"
      :value="(urlParsed as string) ?? ''"
      readonly
      label-position="left"
      label-width="110px"
      mb-2
      placeholder=" "
    />
  </c-card>
</template>

<style lang="less" scoped>
.n-input-group-label {
  text-align: right;
}
.n-input-group {
  margin: 2px 0;
}
</style>
