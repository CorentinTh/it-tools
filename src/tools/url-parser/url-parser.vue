<script setup lang="ts">
import InputCopyable from '../../components/InputCopyable.vue';
import { getUrlProperties, getUrlQueryParameters, parseUrl } from './url-parser.model';

const urlToParse = ref('https://me:pwd@it-tools.tech:3000/url-parser?key1=value&key2=value2#the-hash');

const urlParsed = computed(() => parseUrl(urlToParse.value));
const urlProperties = computed(() => getUrlProperties(urlParsed.value));
const queryParameters = computed(() => getUrlQueryParameters(urlParsed.value));
const urlValidationRules = [
  {
    validator: (value: string) => parseUrl(value) !== undefined,
    message: 'Invalid url',
  },
];
</script>

<template>
  <div class="c-form-layout">
    <c-card title="Input">
      <c-input-text
        v-model:value="urlToParse"
        label="URL to parse"
        placeholder="Your url to parse..."
        raw-text
        :validation-rules="urlValidationRules"
      />
    </c-card>

    <c-card title="URL properties">
      <div grid grid-cols-1 gap-3 md:grid-cols-2>
        <InputCopyable
          v-for="{ title, key, value } in urlProperties"
          :key="key"
          :label="title"
          :value="value"
          readonly
          monospace
          placeholder=" "
        />
      </div>
    </c-card>

    <c-card v-if="queryParameters.length" title="Query parameters">
      <div class="c-form-layout">
        <div v-for="{ id, name, value } in queryParameters" :key="id" grid grid-cols-1 gap-3 md:grid-cols-2>
          <c-field label="Parameter name">
            <InputCopyable :value="name" aria-label="Parameter name" readonly monospace />
          </c-field>
          <c-field label="Parameter value">
            <InputCopyable :value="value" aria-label="Parameter value" readonly monospace />
          </c-field>
        </div>
      </div>
    </c-card>
  </div>
</template>
