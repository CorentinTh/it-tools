<script setup lang="ts">
import { compareSync, hashSync } from 'bcryptjs';
import { useThemeVars } from 'naive-ui';
import { useCopy } from '@/composable/copy';

const themeVars = useThemeVars();
const { t } = useI18n();
const input = ref('');
const saltCount = ref(10);
const hashed = computed(() => hashSync(input.value, saltCount.value));
const { copy } = useCopy({ source: hashed, text: t('bcrypt.hashedStringCopied') });

const compareString = ref('');
const compareHash = ref('');
const compareMatch = computed(() => compareSync(compareString.value, compareHash.value));
</script>

<template>
  <c-card :title="$t('bcrypt.hash')">
    <c-input-text
      v-model:value="input"
      :placeholder="$t('bcrypt.placeholder')"
      raw-text
      :label="$t('bcrypt.input')"
      label-position="left"
      label-align="right"
      label-width="120px"
      mb-2
    />
    <n-form-item :label="$t('bcrypt.salt')" label-placement="left" label-width="120">
      <n-input-number v-model:value="saltCount" :placeholder="$t('bcrypt.saltRounds')" :max="10" :min="0" w-full />
    </n-form-item>

    <c-input-text :value="hashed" readonly text-center />

    <div mt-5 flex justify-center>
      <c-button @click="copy()"> {{ $t('bcrypt.copyHash') }} </c-button>
    </div>
  </c-card>

  <c-card :title="$t('bcrypt.compare')">
    <n-form label-width="120">
      <n-form-item :label="$t('bcrypt.compareString')" label-placement="left">
        <c-input-text v-model:value="compareString" :placeholder="$t('bcrypt.comparePlaceholder')" raw-text />
      </n-form-item>
      <n-form-item :label="$t('bcrypt.compareHash')" label-placement="left">
        <c-input-text v-model:value="compareHash" :placeholder="$t('bcrypt.comparePlaceholder')" raw-text />
      </n-form-item>
      <n-form-item :label="$t('bcrypt.compareResult')" label-placement="left" :show-feedback="false">
        <div class="compare-result" :class="{ positive: compareMatch }">
          {{ compareMatch ? $t('bcrypt.match') : $t('bcrypt.mismatch') }}
        </div>
      </n-form-item>
    </n-form>
  </c-card>
</template>

<style lang="less" scoped>
.compare-result {
  color: v-bind('themeVars.errorColor');

  &.positive {
    color: v-bind('themeVars.successColor');
  }
}
</style>
