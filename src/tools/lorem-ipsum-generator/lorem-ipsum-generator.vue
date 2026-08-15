<script setup lang="ts">
import { generateLoremIpsum } from './lorem-ipsum-generator.service';
import { useCopy } from '@/composable/copy';
import { randIntFromInterval } from '@/utils/random';
import { computedRefreshable } from '@/composable/computedRefreshable';
import CSlider from '@/ui/c-slider/c-slider.vue';
import CSwitch from '@/ui/c-switch/c-switch.vue';

const paragraphs = ref(1);
const sentences = ref([3, 8]);
const words = ref([8, 15]);
const startWithLoremIpsum = ref(true);
const asHTML = ref(false);

const [loremIpsumText, refreshLoremIpsum] = computedRefreshable(() =>
  generateLoremIpsum({
    paragraphCount: paragraphs.value,
    asHTML: asHTML.value,
    sentencePerParagraph: randIntFromInterval(sentences.value[0], sentences.value[1]),
    wordCount: randIntFromInterval(words.value[0], words.value[1]),
    startWithLoremIpsum: startWithLoremIpsum.value,
  }),
{
  dependencies: [
    paragraphs,
    () => sentences.value[0],
    () => sentences.value[1],
    () => words.value[0],
    () => words.value[1],
    startWithLoremIpsum,
    asHTML,
  ],
},
);

const { copy } = useCopy({ source: loremIpsumText, text: 'Lorem ipsum copied to the clipboard' });
</script>

<template>
  <div class="c-generator-layout">
    <c-card class="c-generator-options">
      <div flex flex-col gap-4>
        <CSlider
          id="lorem-paragraphs"
          v-model:value="paragraphs"
          :label="`Paragraphs (${paragraphs})`"
          test-id="lorem-paragraphs"
          :step="1"
          :min="1"
          :max="20"
        />

        <CSlider
          id="lorem-sentences"
          v-model:value="sentences"
          :label="`Sentences per paragraph (${sentences[0]}–${sentences[1]})`"
          test-id="lorem-sentences"
          range
          :step="1"
          :min="1"
          :max="50"
        />

        <CSlider
          id="lorem-words"
          v-model:value="words"
          :label="`Words per sentence (${words[0]}–${words[1]})`"
          test-id="lorem-words"
          range
          :step="1"
          :min="1"
          :max="50"
        />

        <div grid grid-cols-1 gap-3 md:grid-cols-2>
          <CSwitch
            id="lorem-start-with-lorem-ipsum"
            v-model:value="startWithLoremIpsum"
            label="Start with Lorem ipsum"
          />
          <CSwitch id="lorem-as-html" v-model:value="asHTML" label="Generate HTML" />
        </div>
      </div>
    </c-card>

    <c-input-text
      class="c-generator-output"
      :value="loremIpsumText"
      aria-label="Generated Lorem ipsum text"
      placeholder="Your Lorem ipsum text"
      test-id="lorem-output"
      :rows="12"
      readonly
      raw-text
      multiline
    />

    <div class="c-generator-actions">
      <c-button type="primary" data-test-id="lorem-generate" @click="refreshLoremIpsum">
        Generate
      </c-button>
      <c-button data-test-id="lorem-copy" @click="copy()">
        Copy
      </c-button>
    </div>
  </div>
</template>
