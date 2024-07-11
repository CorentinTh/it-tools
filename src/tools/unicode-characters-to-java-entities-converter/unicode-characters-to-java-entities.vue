<script setup lang="ts">
import { parseJavaEntitiesToUnicode, parseUnicodeToJavaEntities } from './unicode-characters-to-java-entities.service';
import { useCopy } from '@/composable/copy';

const inputUnicode = ref('');
const entitiesFromUnicode = computed(() => inputUnicode.value.trim() === '' ? '' : parseUnicodeToJavaEntities(inputUnicode.value));
const { copy: copyJavaEntities } = useCopy({ source: entitiesFromUnicode });

const inputJavaEntities = ref('');
const unicodeFromEntities = computed(() => inputJavaEntities.value.trim() === '' ? '' : parseJavaEntitiesToUnicode(inputJavaEntities.value));
const { copy: copyUnicode } = useCopy({ source: unicodeFromEntities });
</script>

<template>
  <c-card title="Unicode Characters to Java entities">
    <c-input-text v-model:value="inputUnicode" placeholder="e.g. 'Hello Avengers'" label="Enter Unicode Characters to convert to Java entities" autosize raw-text multiline autofocus test-id="unicode-to-entities-input" />
    <c-input-text v-model:value="entitiesFromUnicode" label="Java entities from your text" placeholder="The unicode representation of your text will be here" raw-text multiline readonly mt-2 test-id="unicode-to-entities-output" />
    <div mt-2 flex justify-center>
      <c-button :disabled="!entitiesFromUnicode" @click="copyJavaEntities()">
        Copy Java entities to clipboard
      </c-button>
    </div>
  </c-card>

  <c-card title="Java entities to Unicode Characters">
    <c-input-text v-model:value="inputJavaEntities" placeholder="Input Java entities" label="Enter Java entities to convert to Unicode Characters" autosize raw-text multiline test-id="entities-to-unicode-input" />
    <c-input-text v-model:value="unicodeFromEntities" label="Text from your Java entities" placeholder="The text representation of your unicode will be here" multiline raw-text readonly mt-2 test-id="entities-to-unicode-output" />
    <div mt-2 flex justify-center>
      <c-button :disabled="!unicodeFromEntities" @click="copyUnicode()">
        Copy Unicode to clipboard
      </c-button>
    </div>
  </c-card>
</template>
