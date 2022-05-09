import { reactive, watch, type Ref } from 'vue';

type UseValidationRule<T> = {
  validator: (value: T) => boolean;
  message: string;
};

function isFalsyOrHasThrown(cb: () => boolean) {
  try {
    return !cb();
  } catch (_) {
    return true;
  }
}

export function useValidation<T>({ source, rules }: { source: Ref<T>; rules: UseValidationRule<T>[] }) {
  const state = reactive<{
    message: string;
    status: undefined | 'error';
  }>({
    message: '',
    status: undefined,
  });

  watch([source], () => {
    state.message = '';
    state.status = undefined;

    for (const rule of rules) {
      if (isFalsyOrHasThrown(() => rule.validator(source.value))) {
        state.message = rule.message;
        state.status = 'error';
      }
    }
  });

  return state;
}
