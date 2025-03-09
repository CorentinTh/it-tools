<script setup lang="ts">
import { FortuneWheel } from 'vue3-fortune-wheel';
import type { Data, ImgParams } from 'vue3-fortune-wheel';
import { useQueryParamOrStorage } from '@/composable/queryParams';
import { computedRefreshable } from '@/composable/computedRefreshable';

const base = import.meta.env.BASE_URL;

const choices = useQueryParamOrStorage({ name: 'choices', storageName: 'fortune-wheel:chs', defaultValue: '' });
const spinDuration = useQueryParamOrStorage({ name: 'duration', storageName: 'fortune-wheel:dur', defaultValue: 5 });

const colors = [
  { bgColor: '#FF5733', color: '#FFFFFF' },
  { bgColor: '#2E86C1', color: '#FFFFFF' },
  { bgColor: '#28B463', color: '#FFFFFF' },
  { bgColor: '#F1C40F', color: '#000000' },
  { bgColor: '#8E44AD', color: '#FFFFFF' },
  { bgColor: '#E74C3C', color: '#FFFFFF' },
  { bgColor: '#1ABC9C', color: '#000000' },
  { bgColor: '#34495E', color: '#FFFFFF' },
  { bgColor: '#D35400', color: '#FFFFFF' },
  { bgColor: '#2C3E50', color: '#FFFFFF' },
];

const wheel = ref<InstanceType<typeof FortuneWheel> | null>(null);
const data = computed(() => {
  return (choices.value || '').split('\n')
    .filter(s => s && s !== '')
    .map((choice, index) => ({ id: index + 1, value: choice, ...colors[index % colors.length] }));
});

const logo: ImgParams = {
  src: `${base}logo.png`,
  width: 100,
  height: 100,
};

const [randomGift, refreshGift] = computedRefreshable(() => {
  return Math.floor(Math.random() * data.value.length) + 1;
});

const result = ref<Data>();
function done(wheelResult: Data) {
  result.value = wheelResult;
}

function restart() {
  refreshGift();
  wheel.value?.spin();
}
</script>

<template>
  <div>
    <n-form-item label="Spin Duration (seconds):" label-placement="left">
      <n-input-number v-model:value="spinDuration" :min="1" />
    </n-form-item>

    <c-input-text
      v-model:value="choices"
      label="Wheel choices (one per line):"
      placeholder="Wheel choices (one per line)"
      multiline
      rows="5"
    />

    <n-divider />

    <FortuneWheel
      ref="wheel"
      v-model="randomGift"
      middle-circle
      :img-params="logo"
      :anim-duration="spinDuration * 1000"
      :data="data"
      @done="done"
    />

    <div flex justify-center>
      <c-button @click="restart()">
        Restart
      </c-button>
    </div>
  </div>
</template>
