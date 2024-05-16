<script setup lang="ts">
import { parseUnicodeToJavaEntities } from './unicode-characters-to-java-entities.service';
import { useCopy } from '@/composable/copy';

const inputUnicode = ref('');
const entitiesFromUnicode = computed(() => inputUnicode.value.trim() === '' ? '' : parseUnicodeToJavaEntities(inputUnicode.value, '0'));
const { copy: copyUnicode } = useCopy({ source: entitiesFromUnicode });

const inputJavaEntities = ref('');
const unicodeFromEntities = computed(() => inputJavaEntities.value.trim() === '' ? '' : parseUnicodeToJavaEntities(inputJavaEntities.value, '-1'));
const { copy: copyText } = useCopy({ source: unicodeFromEntities });
</script>

<template>
  <c-card title="Unicode Characters to Java entities">
    <c-input-text v-model:value="inputUnicode" multiline placeholder="e.g. 'Hello Avengers'" label="Enter Unicode Characters to convert to Java entities" autosize autofocus raw-text test-id="unicode-to-entities-input" />
    <c-input-text v-model:value="entitiesFromUnicode" label="Java entities from your text" multiline raw-text readonly mt-2 placeholder="The unicode representation of your text will be here" test-id="unicode-to-entities-output" />
    <div mt-2 flex justify-center>
      <c-button :disabled="!entitiesFromUnicode" @click="copyUnicode()">
        Copy unicode to clipboard
      </c-button>
    </div>
  </c-card>

  <c-card title="Java entities to Unicode Characters">
    <c-input-text v-model:value="inputJavaEntities" multiline placeholder="Input Java entities" label="Enter Java entities to convert to Unicode Characters" autosize raw-text test-id="entities-to-unicode-input" />
    <c-input-text v-model:value="unicodeFromEntities" label="Text from your Java entities" multiline raw-text readonly mt-2 placeholder="The text representation of your unicode will be here" test-id="entities-to-unicode-output" />
    <div mt-2 flex justify-center>
      <c-button :disabled="!unicodeFromEntities" @click="copyText()">
        Copy text to clipboard
      </c-button>
    </div>
  </c-card>
</template>
