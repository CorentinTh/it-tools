import { type MaybeRef, get } from '@vueuse/core';
import _ from 'lodash';
import { type Ref, reactive, watch } from 'vue';

type ValidatorReturnType = unknown;

export interface UseValidationRule<T> {
  validator: (value: T) => ValidatorReturnType
  message: string
}

export function isFalsyOrHasThrown(cb: () => ValidatorReturnType): boolean {
  try {
    const returnValue = cb();

    if (_.isNil(returnValue)) {
      return true;
    }

    return returnValue === false;
  }
  catch (_) {
    return true;
  }
}

export interface ValidationAttrs {
  feedback: string
  validationStatus: string | undefined
}

export function useValidation<T>({
  source,
  rules,
  watch: watchRefs = [],
}: {
  source: Ref<T>
  rules: MaybeRef<UseValidationRule<T>[]>
  watch?: Ref<unknown>[]
}) {
  const state = reactive<{
    message: string
    status: undefined | 'error'
    isValid: boolean
    attrs: ValidationAttrs
  }>({
    message: '',
    status: undefined,
    isValid: false,
    attrs: {
      validationStatus: undefined,
      feedback: '',
    },
  });

  watch(
    [source, ...watchRefs],
    () => {
      state.message = '';
      state.status = undefined;

      for (const rule of get(rules)) {
        if (isFalsyOrHasThrown(() => rule.validator(source.value))) {
          state.message = rule.message;
          state.status = 'error';
        }
      }

      state.isValid = state.status !== 'error';
      state.attrs.feedback = state.message;
      state.attrs.validationStatus = state.status;
    },
    { immediate: true },
  );

  return state;
}
