<script setup lang="ts">
import { useObfuscateString } from './string-obfuscator.model';
import { useCopy } from '@/composable/copy';
import CInputNumber from '@/ui/c-input-number/c-input-number.vue';
import CSwitch from '@/ui/c-switch/c-switch.vue';

const str = ref('Lorem ipsum dolor sit amet');
const keepFirst = ref(4);
const keepLast = ref(4);
const keepSpace = ref(true);

const obfuscatedString = useObfuscateString(str, { keepFirst, keepLast, keepSpace });
const { copy } = useCopy({ source: obfuscatedString });
</script>

<template>
  <div class="c-tool-workbench c-tool-stack">
    <c-input-text v-model:value="str" placeholder="Enter string to obfuscate" label="String to obfuscate" raw-text clearable multiline />

    <c-card>
      <div grid grid-cols-1 gap-3 md:grid-cols-3>
        <c-field label="Keep first characters" label-for="obfuscator-keep-first">
          <CInputNumber id="obfuscator-keep-first" v-model:value="keepFirst" :min="0" />
        </c-field>

        <c-field label="Keep last characters" label-for="obfuscator-keep-last">
          <CInputNumber id="obfuscator-keep-last" v-model:value="keepLast" :min="0" />
        </c-field>

        <CSwitch id="obfuscator-keep-spaces" v-model:value="keepSpace" label="Keep spaces" label-position="top" />
      </div>
    </c-card>

    <c-card v-if="obfuscatedString" flex items-center gap-5px font-mono>
      <div break-anywhere text-wrap>
        {{ obfuscatedString }}
      </div>

      <c-button @click="copy()">
        <icon-mdi:content-copy />
      </c-button>
    </c-card>
  </div>
</template>
