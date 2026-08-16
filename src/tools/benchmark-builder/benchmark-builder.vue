<script setup lang="ts">
import { Plus, Trash } from '@vicons/tabler';
import _ from 'lodash';

import { arrayToMarkdownTable, computeAverage, computeVariance } from './benchmark-builder.models';
import DynamicValues from './dynamic-values.vue';
import { useCopy } from '@/composable/copy';
import { useResilientStorage } from '@/composable/use-resilient-storage';

const suites = ref([
  { title: 'Suite 1', data: [5, 10] },
  { title: 'Suite 2', data: [8, 12] },
]);

const unit = useResilientStorage('benchmark-builder:unit', '');

const round = (v: number) => Math.round(v * 1000) / 1000;

const results = computed(() => {
  return suites.value
    .map(({ data: dirtyData, title }) => {
      const data = dirtyData.filter(_.isNumber);

      return {
        title,
        size: data.length,
        mean: computeAverage({ data }),
        variance: computeVariance({ data }),
      };
    })
    .sort((a, b) => a.mean - b.mean)
    .map(({ mean, variance, size, title }, index, suites) => {
      const cleanUnit = unit.value.trim();
      const bestMean: number = suites[0].mean;
      const deltaWithBestMean = mean - bestMean;
      const ratioWithBestMean = bestMean === 0 ? '∞' : round(mean / bestMean);

      const comparisonValues: string
        = (index !== 0 && bestMean !== mean) ? ` (+${round(deltaWithBestMean)}${cleanUnit} ; x${ratioWithBestMean})` : '';

      return {
        position: index + 1,
        title,
        mean: `${round(mean)}${cleanUnit}${comparisonValues}`,
        variance: `${round(variance)}${cleanUnit}${cleanUnit ? '²' : ''}`,
        size,
      };
    });
});

const { copy } = useCopy({ createToast: false });

const header = {
  position: 'Position',
  title: 'Suite',
  size: 'Samples',
  mean: 'Mean',
  variance: 'Variance',
};

function copyAsMarkdown() {
  copy(arrayToMarkdownTable({ data: results.value, headerMap: header }));
}

function copyAsBulletList() {
  const bulletList = results.value
    .flatMap(({ title, ...sections }) => {
      return [
        ` - ${title}`,
        ...Object.entries(sections).map(
          ([key, value]) => `    - ${header[key as keyof typeof header] ?? key}: ${value}`,
        ),
      ];
    })
    .join('\n');

  copy(bulletList);
}
</script>

<template>
  <div class="c-form-layout">
    <div class="suite-grid">
      <c-card v-for="(suite, index) of suites" :key="index" :title="suite.title || `Suite ${index + 1}`">
        <c-input-text
          v-model:value="suite.title"
          label="Suite name"
          placeholder="Suite name..."
          clearable
        />

        <c-field class="mt-4" label="Suite values">
          <DynamicValues v-model:values="suite.data" :label-prefix="suite.title || `Suite ${index + 1}`" />
        </c-field>

        <div class="c-generator-actions mt-4">
          <c-button v-if="suites.length > 1" variant="text" @click="suites.splice(index, 1)">
            <n-icon :component="Trash" depth="3" mr-2 size="18" />
            Delete suite
          </c-button>
          <c-button
            variant="text"
            @click="suites.splice(index + 1, 0, { data: [0], title: `Suite ${suites.length + 1}` })"
          >
            <n-icon :component="Plus" depth="3" mr-2 size="18" />
            Add suite
          </c-button>
        </div>
      </c-card>
    </div>

    <c-card title="Results">
      <div grid grid-cols-1 items-end gap-3 md:grid-cols-2>
        <c-input-text v-model:value="unit" placeholder="Unit (for example, ms)" label="Unit" />

        <c-button
          @click="
            suites = [
              { title: 'Suite 1', data: [] },
              { title: 'Suite 2', data: [] },
            ]
          "
        >
          Reset suites
        </c-button>
      </div>

      <div class="mt-4" overflow-x-auto>
        <c-table :data="results" :headers="header" />
      </div>

      <div class="c-generator-actions mt-4">
        <c-button @click="copyAsMarkdown()">
          Copy as markdown table
        </c-button>
        <c-button @click="copyAsBulletList()">
          Copy as bullet list
        </c-button>
      </div>
    </c-card>
  </div>
</template>

<style scoped>
.suite-grid {
  display: grid;
  min-width: 0;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
  gap: var(--ui-space-4);
}
</style>
