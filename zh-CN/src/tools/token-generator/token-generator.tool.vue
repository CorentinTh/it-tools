<script setup lang="ts">
import { createToken } from './token-generator.service';
import { useCopy } from '@/composable/copy';
import { computedRefreshable } from '@/composable/computedRefreshable';

const length = ref(64);
const withUppercase = ref(true);
const withLowercase = ref(true);
const withNumbers = ref(true);
const withSymbols = ref(false);

const [token, refreshToken] = computedRefreshable(() =>
  createToken({
    length: length.value,
    withUppercase: withUppercase.value,
    withLowercase: withLowercase.value,
    withNumbers: withNumbers.value,
    withSymbols: withSymbols.value,
  }),
);

const { copy } = useCopy({ source: token, text: '已复制到剪贴板' });
</script>

<template>
  <div>
    <c-card>
      <n-form label-placement="top">
        <n-form-item label="字符类型">
          <n-checkbox size="large" v-model:checked="withUppercase">
            大写字母
          </n-checkbox>
          <n-checkbox ml-4 size="large" v-model:checked="withLowercase">
            小写字母
          </n-checkbox>
          <n-checkbox ml-4 size="large" v-model:checked="withNumbers">
            数字
          </n-checkbox>
          <n-checkbox ml-4 size="large" v-model:checked="withSymbols">
            符号
          </n-checkbox>
        </n-form-item>

        <n-form-item label="字符长度">
          <n-slider v-model:value="length" :step="1" :min="1" :max="512" />
          <n-input-number ml-4 v-model:value="length" min="1" max="512" :show-button="false" />
        </n-form-item>
      </n-form>

      <c-input-text
        v-model:value="token"
        multiline
        placeholder="生成的随机字符"
        readonly
        rows="3"
        autosize
        class="token-display"
      />

      <div mt-5 flex justify-center gap-3>
        <c-button @click="copy()">
          复制
        </c-button>
        <c-button @click="refreshToken">
          刷新
        </c-button>
      </div>
    </c-card>
  </div>
</template>

<style scoped lang="less">
::v-deep(.token-display) {
  textarea {
    text-align: center;
  }
}
</style>
