<script setup lang="ts">
import { computedRefreshableAsync } from '@/composable/computedRefreshable';
import { useCopy } from '@/composable/copy';

const [clientIP, refreshClientIP] = computedRefreshableAsync(async () => {
  try {
    return (await (await fetch('https://api64.ipify.org?format=json', {
      mode: 'cors',
    })).json()).ip?.toString();
  }
  catch (e: any) {
    return e.toString();
  }
});

const { copy } = useCopy({ source: clientIP, text: 'Client IP copied to the clipboard' });
</script>

<template>
  <c-card title="Your IPv4/6 address">
    <div class="ip">
      {{ clientIP }}
    </div>
    <div flex justify-center gap-3>
      <c-button @click="copy()">
        Copy
      </c-button>
      <c-button @click="refreshClientIP">
        Refresh
      </c-button>
    </div>
  </c-card>
</template>

<style lang="less" scoped>
.ip {
  text-align: center;
  font-size: 26px;
  font-weight: 400;
  margin: 10px 0 25px;
}
</style>
