<script setup lang="ts">
import { compare, hash } from 'bcryptjs';
import { useThemeVars } from 'naive-ui';
import { type BcryptFn, InvalidatedError, bcryptWithProgressUpdates } from './bcrypt.models';
import { useCopy } from '@/composable/copy';

const themeVars = useThemeVars();

interface ExecutionState<T> {
  result: T | null
  percentage: number
  error: string | null
  timeTakenMs: number | null
}

const blankState = () => ({ result: null, percentage: 0, error: null, timeTakenMs: null });

async function exec<Param, Result>(
  fn: BcryptFn<Param, Result>,
  args: [string | null, Param | null],
  controller: AbortController,
  state: ExecutionState<Result>,
) {
  const [arg0, arg1] = args;
  if (arg0 == null || arg1 == null) {
    return;
  }

  for await (const update of bcryptWithProgressUpdates(fn, [arg0, arg1], { controller, timeoutMs: 10_000 })) {
    switch (update.kind) {
      case 'progress': {
        state.percentage = Math.round(update.progress * 100);
        break;
      }
      case 'success': {
        state.result = update.value;
        state.timeTakenMs = update.timeTakenMs;
        break;
      }
      case 'error': {
        state.error = update.message;
        break;
      }
    }
  }
}

function initWatcher<Param, Result>(
  fn: BcryptFn<Param, Result>,
  inputs: [Ref<string | null>, Ref<Param | null>],
  state: Ref<ExecutionState<Result>>,
) {
  let controller = new AbortController();
  watch(inputs, (inputs) => {
    controller.abort(new InvalidatedError());
    controller = new AbortController();
    state.value = blankState();
    exec(fn, inputs, controller, state.value);
  });
}

const hashState = ref<ExecutionState<string>>(blankState());
const input = ref('');
const saltCount = ref(10);
initWatcher(hash, [input, saltCount], hashState);

const source = computed(() => hashState.value.result ?? '');
const { copy } = useCopy({ source, text: 'Hashed string copied to the clipboard' });

const compareState = ref<ExecutionState<boolean>>(blankState());
const compareString = ref('');
const compareHash = ref('');
initWatcher(compare, [compareString, compareHash], compareState);
</script>

<template>
  <c-card title="Hash">
    <c-input-text
      v-model:value="input"
      placeholder="Your string to bcrypt..."
      raw-text
      label="Your string: "
      label-position="left"
      label-align="right"
      label-width="120px"
      mb-2
    />
    <n-form-item label="Salt count: " label-placement="left" label-width="120">
      <n-input-number v-model:value="saltCount" placeholder="Salt rounds..." :max="20" :min="0" w-full />
    </n-form-item>

    <n-progress :percentage="hashState.percentage" :show-indicator="false" />
    <c-input-text
      :value="hashState.result ?? undefined"
      :placeholder="hashState.error ?? 'Hashed string'"
      readonly
      text-center
    />
    <div mt-1 h-3 op-60>
      {{ hashState.timeTakenMs == null ? '' : `Hashed in ${hashState.timeTakenMs}\xA0ms` }}
    </div>

    <div mt-5 flex justify-center>
      <c-button @click="copy()">
        Copy hash
      </c-button>
    </div>
  </c-card>

  <c-card title="Compare string with hash">
    <n-form label-width="120">
      <n-form-item label="Your string: " label-placement="left">
        <c-input-text v-model:value="compareString" placeholder="Your string to compare..." raw-text />
      </n-form-item>
      <n-form-item label="Your hash: " label-placement="left">
        <c-input-text v-model:value="compareHash" placeholder="Your hash to compare..." raw-text />
      </n-form-item>

      <n-progress :percentage="compareState.percentage" :show-indicator="false" />
      <div>
        <c-input-text
          id="bcrypt-compare-result"
          :value="compareState.result == null ? undefined : compareState.result ? 'Matched' : 'No match'"
          :placeholder="compareState.error ?? 'Comparison result'"
          readonly
          text-center
          class="compare-result"
          :class="compareState.result == null ? undefined : compareState.result ? 'positive' : 'negative'"
        />
      </div>
      <div mb-1 mt-1 h-3 op-60>
        {{ compareState.timeTakenMs == null ? '' : `Compared in ${compareState.timeTakenMs}\xA0ms` }}
      </div>
    </n-form>
  </c-card>
</template>

<style lang="less">
.compare-result {
  &.negative {
    input#bcrypt-compare-result {
      color: v-bind('themeVars.errorColor');
    }
  }
  &.positive {
    input#bcrypt-compare-result {
      color: v-bind('themeVars.successColor');
    }
  }
}
</style>
