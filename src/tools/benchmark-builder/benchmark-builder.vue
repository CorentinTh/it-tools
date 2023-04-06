<template>
  <n-scrollbar style="flex: 1" x-scrollable>
    <n-space :wrap="false" style="flex: 1" justify="center" :size="0">
      <div v-for="(suite, index) of suites" :key="index">
        <n-card style="width: 292px; margin: 0 8px 5px">
          <n-form-item label="Suite name:" :show-feedback="false" label-placement="left">
            <n-input v-model:value="suite.title" placeholder="Suite name..." />
          </n-form-item>

          <n-divider></n-divider>
          <n-form-item label="Suite values" :show-feedback="false">
            <dynamic-values v-model:values="suite.data" />
          </n-form-item>
        </n-card>

        <n-space justify="center">
          <n-button v-if="suites.length > 1" quaternary @click="suites.splice(index, 1)">
            <template #icon>
              <n-icon :component="Trash" depth="3" />
            </template>
            Delete suite
          </n-button>
          <n-button quaternary @click="suites.splice(index + 1, 0, { data: [0], title: `Suite ${suites.length + 1}` })">
            <template #icon>
              <n-icon :component="Plus" depth="3" />
            </template>
            Add suite
          </n-button>
        </n-space>
      </div>
    </n-space>
    <br />
  </n-scrollbar>

  <div style="flex: 0 0 100%">
    <div style="max-width: 600px; margin: 0 auto">
      <n-space justify="center">
        <n-form-item label="Unit:" label-placement="left">
          <n-input v-model:value="unit" placeholder="Unit (eg: ms)" />
        </n-form-item>

        <n-button
          tertiary
          @click="
            suites = [
              { title: 'Suite 1', data: [] },
              { title: 'Suite 2', data: [] },
            ]
          "
          >Reset suites</n-button
        >
      </n-space>

      <n-table>
        <thead>
          <tr>
            <th>{{ header.position }}</th>
            <th>{{ header.title }}</th>
            <th>{{ header.size }}</th>
            <th>{{ header.mean }}</th>
            <th>{{ header.variance }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="{ title, size, mean, variance, position } of results" :key="title">
            <td>{{ position }}</td>
            <td>{{ title }}</td>
            <td>{{ size }}</td>
            <td>{{ mean }}</td>
            <td>{{ variance }}</td>
          </tr>
        </tbody>
      </n-table>
      <br />
      <n-space justify="center">
        <n-button tertiary @click="copyAsMarkdown">Copy as markdown table</n-button>
        <n-button tertiary @click="copyAsBulletList">Copy as bullet list</n-button>
      </n-space>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Trash, Plus } from '@vicons/tabler';
import { useClipboard, useStorage } from '@vueuse/core';
import _ from 'lodash';
import { computed } from 'vue';
import { computeAverage, computeVariance, arrayToMarkdownTable } from './benchmark-builder.models';
import DynamicValues from './dynamic-values.vue';

const suites = useStorage('benchmark-builder:suites', [
  { title: 'Suite 1', data: [5, 10] },
  { title: 'Suite 2', data: [8, 12] },
]);

const unit = useStorage('benchmark-builder:unit', '');

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
    .map(({ mean, variance, ...value }, index, suites) => {
      const cleanUnit = unit.value.trim();
      const bestMean: number = suites[0].mean;
      const deltaWithBestMean = mean - bestMean;
      const ratioWithBestMean = bestMean === 0 ? '∞' : round(mean / bestMean);

      const comparisonValues: string =
        index !== 0 && bestMean !== mean ? ` (+${round(deltaWithBestMean)}${cleanUnit} ; x${ratioWithBestMean})` : '';

      return {
        position: index + 1,
        mean: `${round(mean)}${cleanUnit}${comparisonValues}`,
        variance: `${round(variance)}${cleanUnit}${cleanUnit ? '²' : ''}`,
        ...value,
      };
    });
});

const { copy } = useClipboard();

const header = {
  title: 'Suite',
  size: 'Samples',
  mean: 'Mean',
  variance: 'Variance',
  position: 'Position',
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

<style lang="less" scoped></style>
