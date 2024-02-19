<script setup lang="ts">
import { generatePort } from './random-port-generator.model';
import { computedRefreshable } from '@/composable/computedRefreshable';
import { useCopy } from '@/composable/copy';

const { t } = useI18n();
const [port, refreshPort] = computedRefreshable(() => String(generatePort()));

const { copy } = useCopy({ source: port, text: t('tools.random-port-generator.copied') });
</script>

<template>
  <c-card>
    <div class="port">
      {{ port }}
    </div>
    <div flex justify-center gap-3>
      <c-button @click="copy()">
        {{ t('tools.random-port-generator.copyBtn') }}
      </c-button>
      <c-button @click="refreshPort">
        {{ t('tools.random-port-generator.refreshBtn') }}
      </c-button>
    </div>
  </c-card>
</template>

<style lang="less" scoped>
.port {
  text-align: center;
  font-size: 26px;
  font-weight: 400;
  margin: 10px 0 25px;
}
</style>
