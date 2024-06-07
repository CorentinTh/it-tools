<script setup lang="ts">
import { compare, hash } from 'bcryptjs';
import { useThemeVars } from 'naive-ui';
import { useCopy } from '@/composable/copy';

const themeVars = useThemeVars();

interface ExecutionState<T> {
  result: T | null
  percentage: number
  error: string | null
  timeTakenMs: number | null
}

const blankState = () => ({ result: null, percentage: 0, error: null, timeTakenMs: null });

type Update<Result> =
  | {
    kind: 'progress'
    progress: number
  }
  | {
    kind: 'result'
    result: Result
    timeTakenMs: number
  }
  | {
    kind: 'error'
    message: string
  };

const TIMEOUT_SECONDS = 10;

class TimedOutError extends Error {
  name = 'TimedOutError';
}
class InvalidatedError extends Error {
  name = 'InvalidatedError';
}

// generic type for the callback versions of bcryptjs's `hash` and `compare`
type BcryptFn<Param, Result> = (
  arg1: string,
  arg2: Param,
  callback: (err: Error | null, hash: Result) => void,
  progressCallback: (percent: number) => void,
) => void;

async function* runWithProgress<Param, Result>(
  fn: BcryptFn<Param, Result>,
  arg1: string,
  arg2: Param,
  controller: AbortController,
): AsyncGenerator<Update<Result>, undefined, undefined> {
  let res = (_: Update<Result>) => {};
  const nextPromise = () =>
    new Promise<Update<Result>>((resolve) => {
      res = resolve;
    });
  const promises = [nextPromise()];
  const nextValue = (value: Update<Result>) => {
    res(value);
    promises.push(nextPromise());
  };

  const start = Date.now();

  fn(
    arg1,
    arg2,
    (err, result) => {
      nextValue(
        err == null
          ? { kind: 'result', result, timeTakenMs: Date.now() - start }
          : { kind: 'error', message: err.message },
      );
    },
    (progress) => {
      if (controller.signal.aborted) {
        nextValue({ kind: 'progress', progress: 0 });
        if (controller.signal.reason instanceof TimedOutError) {
          nextValue({ kind: 'error', message: controller.signal.reason.message });
        }

        // throw inside callback to cancel execution of hashing/comparing
        throw controller.signal.reason;
      }
      else {
        nextValue({ kind: 'progress', progress });
      }
    },
  );

  setTimeout(() => {
    controller.abort(new TimedOutError(`Timed out after ${TIMEOUT_SECONDS} seconds`));
  }, TIMEOUT_SECONDS * 1000);

  for await (const value of promises) {
    yield value;

    if (value.kind === 'result' || value.kind === 'error') {
      return;
    }
  }
}

async function exec<Param, Result>(
  fn: BcryptFn<Param, Result>,
  arg1: string | null,
  arg2: Param | null,
  controller: AbortController,
  state: ExecutionState<Result>,
) {
  if (arg1 == null || arg2 == null) {
    return;
  }

  for await (const value of runWithProgress(fn, arg1, arg2, controller)) {
    switch (value.kind) {
      case 'progress': {
        state.percentage = value.progress * 100;
        break;
      }
      case 'result': {
        state.result = value.result;
        state.timeTakenMs = value.timeTakenMs;
        break;
      }
      case 'error': {
        state.error = value.message;
        break;
      }
    }
  }
}

function initWatcher<Param, Result>(
  fn: BcryptFn<Param, Result>,
  input1: Ref<string | null>,
  input2: Ref<Param | null>,
  state: Ref<ExecutionState<Result>>,
) {
  let controller = new AbortController();
  watch([input1, input2], ([input1, input2]) => {
    controller.abort(new InvalidatedError());
    controller = new AbortController();
    state.value = blankState();
    exec(fn, input1, input2, controller, state.value);
  });
}

const hashState = ref<ExecutionState<string>>(blankState());
const input = ref('');
const saltCount = ref(10);
initWatcher(hash, input, saltCount, hashState);

const source = computed(() => hashState.value.result ?? '');
const { copy } = useCopy({ source, text: 'Hashed string copied to the clipboard' });

const compareState = ref<ExecutionState<boolean>>(blankState());
const compareString = ref('');
const compareHash = ref('');
initWatcher(compare, compareString, compareHash, compareState);
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
      {{ hashState.timeTakenMs == null ? '' : `Hashed in ${hashState.timeTakenMs}\xa0ms` }}
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
        {{ compareState.timeTakenMs == null ? '' : `Compared in ${compareState.timeTakenMs}\xa0ms` }}
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
