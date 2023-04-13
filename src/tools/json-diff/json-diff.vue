<template>
  <n-form-item
    label="Your first json"
    :feedback="leftJsonValidation.message"
    :validation-status="leftJsonValidation.status"
  >
    <n-input
      v-model:value="rawLeftJson"
      placeholder="Paste your first json here..."
      type="textarea"
      rows="20"
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      spellcheck="false"
      :input-props="{ 'data-test-id': 'leftJson' }"
    />
  </n-form-item>
  <n-form-item
    label="Your json to compare"
    :feedback="rightJsonValidation.message"
    :validation-status="rightJsonValidation.status"
  >
    <n-input
      v-model:value="rawRightJson"
      placeholder="Paste your json to compare here..."
      type="textarea"
      rows="20"
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      spellcheck="false"
      :input-props="{ 'data-test-id': 'rightJson' }"
    />
  </n-form-item>

  <JsonDiffResult :left="rawLeftJson" :right="rawRightJson" />
</template>

<script setup lang="ts">
import { useStorage } from '@vueuse/core';
import { useValidation } from '@/composable/validation';
import JSON5 from 'json5';
import JsonDiffResult from './json-diff-result.vue';

const rawLeftJson = useStorage(
  'json-compare:left-json',
  `{
  "Actors": [
    {
      "name": "Tom Cruise",
      "age": 56,
      "Born At": "Syracuse, NY",
      "Birthdate": "July 3, 1962",
      "photo": "https://jsonformatter.org/img/tom-cruise.jpg",
      "wife": null,
      "weight": 67.5,
      "hasChildren": true,
      "hasGreyHair": false,
      "children": [
        "Suri",
        "Isabella Jane",
        "Connor"
      ]
    },
    {
      "name": "Robert Downey Jr.",
      "age": 53,
      "Born At": "New York City, NY",
      "Birthdate": "April 4, 1965",
      "photo": "https://jsonformatter.org/img/Robert-Downey-Jr.jpg",
      "wife": "Susan Downey",
      "weight": 77.1,
      "hasChildren": true,
      "hasGreyHair": false,
      "children": [
        "Indio Falconer",
        "Avri Roel",
        "Exton Elias"
      ]
    }
  ]
}`,
);
const rawRightJson = useStorage(
  'json-compare:right-json',
  `{
  "Actors": [
    {
      "name": "Tom Cruise",
      "age": 56,
      "Born At": "Syracuse, NY",
      "Birthdate": "July 3, 1962",
      "photo": "https://jsonformatter.org/img/tom-cruise.jpg",
      "wife": null,
      "weight": 57.7,
      "hasChildren": true,
      "hasGreyHair": false,
      "children": [
        "Connor",
        "Suri",
        "Isabella Jane"
      ],
      "favoriteFood": "Spaghetti"
    },
    {
      "name": "Robert Downey Sr.",
      "age": 53,
      "Born At": "New York City, NY",
      "Birthdate": "April 4, 1965",
      "photo": "https://jsonformatter.org/img/Robert-Downey-Jr.jpg",
      "weight": 77.1,
      "hasChildren": true,
      "hasGreyHair": false,
      "children": [
        "Indio Falconer",
        "Avri Roel",
        "Exton Elias"
      ]
    }
  ]
}`,
);

const leftJsonValidation = useValidation({
  source: rawLeftJson,
  rules: [
    {
      validator: (v) => v === '' || JSON5.parse(v),
      message: 'Provided JSON is not valid.',
    },
  ],
});

const rightJsonValidation = useValidation({
  source: rawRightJson,
  rules: [
    {
      validator: (v) => v === '' || JSON5.parse(v),
      message: 'Provided JSON is not valid.',
    },
  ],
});
</script>

<style lang="less" scoped></style>
