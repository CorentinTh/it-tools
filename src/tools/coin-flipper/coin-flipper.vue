<script setup lang="ts">
import { computedRefreshable } from '@/composable/computedRefreshable';
import { randIntFromInterval } from '@/utils/random';

const [coinFlip, refreshCoinFlip] = computedRefreshable(() => ({
  coin: randIntFromInterval(0, 10) % 2 === 0 ? 'Heads' : 'Tails',
  dt: Date.now(),
}));
</script>

<template>
  <div>
    <Transition name="bounce" mode="out-in">
      <div :key="coinFlip.dt" flex items-center justify-center>
        <div flex items-center justify-center rounded-full outline style="width: 5em; height: 5em">
          {{ coinFlip.coin }}
        </div>
      </div>
    </Transition>
    <div mt-4 flex justify-center>
      <c-button @click="refreshCoinFlip">
        Re flip
      </c-button>
    </div>
  </div>
</template>

<style scoped>
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}
</style>
